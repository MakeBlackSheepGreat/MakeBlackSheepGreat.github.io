# Shipping medical software on a disc

> August 2026. The competition required the software to be burned onto a disc. Until then, everything I had written only ran on my own machine.

## Delivery and demo are different problems

During local development my standard was simple: it runs without errors and the interface looks right. Burning a disc means several extra things:

- I do not control the runtime: the other machine may not support GPU acceleration, or may have no discrete GPU at all
- Nothing can be installed: I cannot expect anyone to `pip install` on site
- Nobody explains it for you: "click here, then there" does not travel to the judging room

## Hardware fallback is not a config flag, it is a second build

My first instinct was a switch: if no GPU is detected, use the CPU. In practice it was not that simple — preprocessing sizes, model precision and batching differ on the two paths, and some dependencies simply cannot be installed on CPU-only machines.

The solution was to maintain two release configurations, each tested and packaged separately, rather than hoping for graceful runtime degradation. **"Adapts automatically" sounds elegant; at delivery time, predictability beats elegance.**

## An interface is verified by clicking, not by looking

The software has more than a dozen pages and over two hundred clickable elements. Clicking through manually takes half a day, and you will not know what you missed.

So I drove the real desktop application with automated tests, auditing every clickable element and recording totals: 13 pages, 265 clickable elements audited, 192 clicks executed, zero failures. That number went into the delivery notes — far more convincing than "the interface was checked".

One detail worth recording: **being clickable is not the same as doing something useful.** Automation covers "the button does not throw, the UI does not crash", but "is this button's business logic correct" still needs a human. So the script owns coverage and a person spot-checks the critical flows.

## Paths and caches are what break at packaging time

Almost nothing in the last mile was in the code:

- An absolute path from my development machine hard-coded in a config file, unresolvable on any other machine
- Build caches and stale artifacts swept into the release package, inflating it inexplicably
- Dependencies that install only because they were already installed on my machine, and fail on a clean environment

The fix is unglamorous but effective: **on a clean machine, walk the whole unzip-install-launch flow once**, and treat that as a mandatory step before delivery.

## A closing thought

When writing algorithms, I care whether the score can go higher. When delivering, I care whether somebody else can use it. Those need completely different ways of thinking, and the second one is almost never trained in coursework.

The disc exercise made something clear to me: **between "it is built" and "it is delivered" lies nothing but details.**
