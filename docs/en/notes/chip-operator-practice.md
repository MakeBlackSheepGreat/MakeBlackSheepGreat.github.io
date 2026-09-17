# First time writing at the operator level

> August 2026. I entered operator problems on a domestic AI chip: 2D convolution, an activation function, a quantised GEMM, and one implementation removing a last-dimension limit. Until then, all my code *called* operators.

## Three things that differ from the model layer

**Address spaces are explicit.** At the model layer, moving data to a device is one call. At the operator level you decide which class of memory each buffer belongs to (global, shared, register) and how data moves between levels. My first version failed to compile because the annotations were wrong.

**Tiling decides performance.** The same convolution can differ several-fold in performance depending on how inputs and outputs are partitioned. The reason is mundane: on-chip memory is small, so a poor tiling forces the same data to be re-read from external memory. Getting data reuse right matters more than piling on optimisations.

**Types are handled branch by branch.** A "simple" activation must handle FP16, FP32 and BF16 separately and cover shapes from 0 to 8 dimensions; a quantised GEMM additionally mixes integer and floating-point arithmetic. Every combination has to be reasoned about, not discovered by running it.

## Problems attempted

| Problem | Key point |
| --- | --- |
| 2D convolution (FP16 / FP32 / BF16) | Separate implementations per type and tiling strategy |
| Element-wise activation (0–8 dimensions) | Dimension branching and shape alignment without degrading small shapes |
| INT8 quantised GEMM (small M/N, large K) | Quantisation parameters, accumulation accuracy, K-dimension tiling |
| Removing a 65535 last-dimension limit plus transpose combinations | Working around shape limits per transfer and handling transposed access patterns |

## What I took away

Not a specific technique, but a concrete sense of **where performance comes from**: fewer data movements rather than cleverer tricks. That lens later shaped decisions at the model layer too — for instance, how to choose batch sizes and chunking under a tight memory budget, which is the same problem in different clothes.
