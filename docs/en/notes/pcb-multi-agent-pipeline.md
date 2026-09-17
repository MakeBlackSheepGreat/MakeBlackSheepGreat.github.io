# Multi-agent hardware design: from topology review to fabrication output

> July 2026. Hardware design differs from software in one decisive way: **mistakes are expensive and feedback is slow**. A fabrication run takes weeks, so thinking before acting is a cost issue rather than a matter of style. This project split the design flow into stages that multiple agents can work through.

## Stages, not one long session

The pipeline runs through several stages: topology discussion and part selection, then schematic capture, then layout, then manufacturing output. Each stage has defined inputs and outputs — **the previous stage's artifacts are the next stage's preconditions** — and a stage does not start until they are complete.

The benefit of this split is focus: no agent is asked to change schematics and layout in the same pass, and when something goes wrong it is traceable to a stage.

## Skill modules instead of one long prompt

The flow is divided into **nine skill modules**, each responsible for one class of work (part parameter checks, netlist review, layout constraint preparation and so on). Modularity makes things **testable**: each module's output can be checked on its own rather than only after the whole pipeline finishes.

The tool side drives an EDA package over MCP, so agents read and modify real design files instead of producing advice for a human to retype.

## The two things that mattered most

**Hard checkpoints.** Electrical rule checks, package correctness and part availability are not "looks fine, skip it" steps — they are gates that cannot be bypassed. Unlike software, a wrong footprint means a scrapped batch of boards.

**Explicit human confirmation points.** The flow marks where a person must sign off before continuing (freezing the design, reviewing the BOM before ordering). Writing down where humans belong is more reliable than expecting an agent to infer its own boundaries.

## How it differs from software pipelines

In software, multi-agent parallelism usually buys speed. In hardware, **serial dependencies dominate**, so parallelism buys little; what matters is whether each stage's output is verifiable. The lesson: multi-agent setups are not a universal accelerator — their value depends on whether the task can be split safely.
