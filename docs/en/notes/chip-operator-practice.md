# First time writing at the operator level

> August 2026. I entered operator problems on a domestic AI chip: 2D convolution, an activation function, a quantised GEMM, and one implementation removing a last-dimension limit. Until then, all my code *called* operators.

::: info Short version
- Performance at this level does not come from cleverer tricks, it comes from **moving data fewer times**. Tiling matters more than any micro-optimisation;
- My first version failed to compile because address-space annotations were wrong. At the model layer, where data lives is the framework's business; at the operator level it is your decision;
- A "simple" activation has to handle three data types and nine dimension cases. Running it to see what breaks does not cover that space — every branch has to be reasoned through.
:::

## 1. The gap between calling and implementing

At the model layer you move data to a device and call an operator that already exists. At the operator level the questions are different. Three changes were immediately obvious:

- **Address spaces are explicit**: whether a buffer lives in global, shared or register memory is something you annotate, and it decides which levels data must be moved between;
- **Tiling decides performance**: the same computation, split differently across inputs and outputs, can differ several-fold;
- **Types are handled branch by branch**: FP16, FP32 and BF16 each get an implementation, and the dimension and shape cases get covered one by one.

## 2. First compile failure: wrong address space

Version one did not compile; the error pointed at a buffer in the wrong address space. My instinct was that data is data and the annotation should not matter — true at the model layer, wrong here, because the annotation decides whether the data has to cross levels and whether a compute unit can read it at all.

Once corrected, the point of it became clear: **the annotation is not a formality, it is what makes data movement visible in the code**. And because it is visible, there is something to optimise.

## 3. The tiling reversal: bigger is not better

Reasoning that larger tiles mean fewer loop iterations, I increased the tile size first. Performance dropped. On-chip memory is small: a tile that does not fit forces the same data to be re-read from external memory, so loop count fell while transfer count rose.

The criterion changed from "is the tile big enough" to "how many times is the same data moved". Performance stabilised only after redesigning around that question. Since then the habit has been fixed: **look at data reuse first, at instructions and tricks second.**

::: tip Best value for effort
Before tuning anything, draw the route each block of data takes between levels, and how many times it is reused. If the drawing exposes the problem, the direction is decided; if you cannot draw it, you do not yet understand your own implementation.
:::

## 4. The problems, and where the difficulty actually was

| Problem | Where the difficulty actually was |
| --- | --- |
| 2D convolution (FP16 / FP32 / BF16) | Three separate implementations per type, each with its own tiling |
| Element-wise activation (HardSwish, 0–8 dimensions) | Dimension branching and shape alignment without degrading small shapes |
| INT8 quantised GEMM (small M/N, large K) | Quantisation parameters, accumulation accuracy, K-dimension tiling |
| Removing a 65535 last-dimension limit plus transpose combinations | Working around shape limits per transfer and handling transposed access |

HardSwish is the easiest to underestimate: the arithmetic is trivial, but it must cover shapes from 0 to 8 dimensions and still avoid degenerating into a per-element slow path on small shapes. The quantised GEMM is hard for the opposite reason — with integer and floating-point arithmetic mixed, the accumulation scheme decides whether the results still line up.

## 5. Removing the last-dimension limit

One transfer path caps the last dimension at 65535; anything longer fails outright. That is a hardware shape constraint, so the fix is not to fight it but to reorganise the data: split the oversized last dimension into segments, move them individually, and recombine on the compute side.

The complication is that access patterns change after splitting — a single contiguous run becomes several. Processed in order, access efficiency falls; combined with transposition, the transposed layout has to be handled as well. The final implementation used both: split to the limit, then choose transposition to keep access contiguous.

::: warning Worth noting
Facing a hard shape limit, the first instinct is to look for a way around it. Usually there is none. What you can do is re-split the data and accept the access cost — a cost that has to be estimated in advance, or the split ends up slower than the original.
:::

## 6. What I took away

Not a specific technique, but a concrete sense of **where performance comes from**: fewer data movements rather than cleverer tricks. That lens later shaped decisions at the model layer too — choosing batch sizes and chunking under a tight memory budget is the same problem in different clothes.

## 7. Reusable checklist

- Settle address spaces and data flow before writing compute logic;
- Look at reuse counts first; a larger tile is not automatically better;
- Enumerate every data type and dimension case deliberately, not by trial runs;
- For hardware shape limits, reach for splitting and layout changes, not workarounds;
- For quantised operators, check the accumulation scheme first when accuracy is off;
- Draw "where data moves and how often" before discussing optimisation.
