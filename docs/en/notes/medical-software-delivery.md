# Shipping medical software on a disc

> August 2026. The competition required the software to be burned onto a disc. Until then, everything I had written only ran on my own machine.

::: info Short version
- "Adapts automatically" sounds elegant, but at delivery time **predictability beats elegance**: hardware fallback is not a config flag, it is two separately tested release configurations;
- An interface is verified by clicking, not by looking: 13 pages, 265 clickable elements audited, 192 clicks executed, zero failures. That number carries more weight than "the interface was checked";
- Almost nothing in the last mile was in the code — it was hard-coded paths, stale build caches, and dependencies that only install because they were already installed on my machine.
:::

## 1. Delivery and demo are different problems

During local development my standard was simple: it runs without errors and the interface looks right. Burning a disc means three extra things:

- I do not control the runtime: the other machine may not support GPU acceleration, or may have no discrete GPU at all;
- Nothing can be installed: I cannot expect anyone to run an install command on site;
- Nobody explains it for you: "click here, then there" does not travel to the judging room.

## 2. Hardware fallback is not a config flag, it is a second build

My first instinct was a switch: if no GPU is detected, use the CPU. In practice it was not that simple — preprocessing sizes, model precision and batching differ on the two paths, and some dependencies cannot be installed on a CPU-only machine at all. Worse, the fallback path had never been executed: it would only run for the first time at the venue, and fail for the first time there too.

The solution was two release configurations, each run through and packaged separately. **A deliverable needs predictability, and automatic adaptation supplies exactly the opposite.**

## 3. An interface is verified by clicking, not by looking

The software has more than a dozen pages and over two hundred clickable elements. Clicking through manually takes half a day, and you will not know what you missed.

So I drove the real desktop application with automated tests, auditing every clickable element and recording the totals: **13 pages / 265 clickable elements / 192 clicks executed / zero failures**. That set of numbers went straight into the delivery notes.

One detail worth recording: **being clickable is not the same as doing something useful**. Automation covers "the button does not throw, the UI does not crash"; "is this button's business logic correct" still needs a person. So the script owns coverage and a person spot-checks the critical flows.

## 4. Paths and caches are what break at packaging time

Almost nothing in the last mile was in the algorithm:

- An absolute path from my development machine hard-coded in a config file, unresolvable anywhere else;
- Build caches and stale artifacts swept into the release package, inflating it for no reason;
- Dependencies that install only because they were already installed here, and fail in a clean environment.

The fix is unglamorous but effective: **on a clean machine, walk the whole unzip-install-launch flow once**, and treat that as a mandatory pre-delivery step.

::: tip Best value for effort
Run the full flow on a clean machine before burning the disc, and do not install anything along the way. That single pass catches hard-coded paths, missing dependencies and stale artifacts — none of which appear on your own machine.
:::

## 5. The disc constraint actually helped

No network, no environment changes, fully self-contained offline. Those constraints removed the grey area around "we will sort it out later": a dependency is either packaged or not a dependency. Online delivery, where a patch is always an option, makes it easier to defer exactly these problems to the end.

::: warning Worth noting
Never accept "it worked on my machine" as a delivery argument. A development machine is the worst place in the world for finding these problems — dependencies present, fonts present, paths correct, caches warm.
:::

## 6. A closing thought

When writing algorithms I care whether the score can go higher. When delivering I care whether somebody else can use it. Those need completely different ways of thinking, and the second is almost never trained in coursework.

The disc exercise made one thing clear: **between "it is built" and "it is delivered" lies nothing but details.**

## 7. Reusable checklist

- Hardware fallback means two verified release configurations, not runtime adaptation;
- Delivery numbers must be checkable: page count, element count, click count, failure count;
- Automation owns coverage; a person spot-checks the critical business flows;
- No development-machine absolute paths inside a release package;
- Clear caches and old artifacts before packaging, and investigate any unexplained package size;
- Walk unzip-install-launch on a clean machine;
- Offline delivery is easier to get right than online delivery, because the constraints do not allow vagueness.
