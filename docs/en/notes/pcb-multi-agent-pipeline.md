# Multi-agent hardware design: from topology review to fabrication output

> July 2026. Hardware design differs from software in its cost structure above all: **mistakes are expensive and feedback is slow**, and one fabrication round takes weeks. Thinking before acting is a cost decision here, not a matter of style.

::: info Short version
- The value of staging is not a tidy division of labour but turning **upstream artifacts** into hard gates: without a frozen schematic, layout does not start;
- Counter-intuitive: **parallelism buys little in hardware**. Running sessions on schematic and layout at the same time produced a layout routed against the old footprint, and one footprint change meant rerouting eight nets;
- Checkpoints have to be unskippable: the configuration offers "stop" and "fix and rerun", never "skip".
:::

## 1. The first plan: copy the software pattern and go parallel

The task was a non-commercial control board, from topology discussion all the way to fabrication files. The first plan was obvious — in software, multiple agents in parallel buy speed directly, so do the same here: one session on part selection, one starting the schematic, one laying out against a "roughly known" layout.

What the first round produced:

| Symptom | Immediate consequence |
| --- | --- |
| Part selection changed a footprint (to a more readily available equivalent package) | Eight nets in the layout had to be rerouted |
| The layout referenced a schematic revision that was no longer current | Netlist mismatch; fall back and redo |
| Three sessions each held their own "latest" bill of materials | No way to tell which one was authoritative |

Lining the rework up on a timeline, nearly every item traced back to one cause: **the next stage started before the upstream artifact was frozen**. In software a compile error is feedback within seconds; in hardware the next feedback is a fabrication round — the same "quick change" costs orders of magnitude more.

## 2. Rebuilt as a staged pipeline

The fix was to cut the flow into stages, each with defined inputs and artifacts, where **the previous stage's artifacts are the next stage's preconditions**:

| Stage | Input | Artifacts | Condition to advance |
| --- | --- | --- | --- |
| Topology and selection | Requirements and constraints | Topology notes, part list with footprints and availability | Footprints frozen |
| Schematic | Topology and part list | Schematic, netlist | Electrical rule check passes |
| Layout and routing | Schematic and netlist | Layout file, routing result | Constraint checks pass |
| Fabrication output | Layout file | Fabrication files (non-commercial) | BOM reviewed by a person before ordering |

Two benefits follow. Each agent focuses on one stage's objective, so nothing edits the circuit and the layout in the same pass. And when something goes wrong it is traceable to a stage rather than to "the whole flow".

## 3. Nine skill modules instead of one long prompt

The flow is divided into **nine skill modules**, each owning one class of work: part parameter checks, netlist review, layout constraint preparation, fabrication file checks and so on. Modularity makes things **testable on their own** — take a netlist, run the checking module against it with a few deliberately planted errors, and see whether all of them come back. No need to finish the whole pipeline to learn whether a step works.

The tool side drives an EDA package over MCP, so agents read and modify real design files instead of producing advice for a person to retype. That is what decides whether the pipeline is automated or half manual.

## 4. Two designs that cannot be bypassed

**Hard checkpoints.** Electrical rule checks, footprint audits and part availability checks are gates that cannot be skipped — the configuration simply has no option for it:

```yaml
gates:
  - id: erc
    run: skills/erc_check
    on_fail: stop          # only stop and fix_and_rerun; there is no skip
  - id: footprint_audit
    run: skills/footprint_check
    on_fail: stop
```

Hardware is not software: a wrong footprint means a scrapped batch of boards, so "it looks fine, skip it" should not exist as a choice.

**Explicit human confirmation points.** The flow marks where a person must sign off before continuing: freezing the design, and reviewing the BOM before ordering. Writing down where humans belong in the pipeline configuration is more reliable than expecting an agent to infer its own boundaries.

## 5. How it differs from a software pipeline

In software, multi-agent parallelism usually buys speed. In hardware, **serial dependencies dominate**: without a frozen selection the schematic cannot converge, and without a frozen schematic layout has nothing to work from. Parallelism only fits the few pieces whose inputs are already frozen — checking availability across many parts at once, for instance.

The clearer conclusion from this project is that multi-agent setups are not accelerators. Their value depends on whether the task can be split safely and whether each stage's output can be verified on its own. The metric for success shifts accordingly — not "how much design time was saved" but "how many fabrication rounds were avoided".

::: tip Best value for effort
Make "upstream artifact frozen" an explicit event in the flow: a frozen artifact carries a revision number, and downstream stages reference the revision rather than the filename. It costs almost nothing and removes the most common class of rework.
:::

::: warning Worth noting
Do not copy software-style parallelism into a hardware flow. The test for parallel work is whether both sides' inputs are already frozen, not whether the two pieces look independent.
:::

## 6. Reusable checklist

- Cut stages by artifact first, then talk about dividing labour between agents;
- For each stage, write down the inputs, artifacts, pass condition and human confirmation point;
- Make checkpoints hard gates with no skip option in the configuration;
- Version the artifacts and have downstream stages reference revisions, not filenames;
- Use parallelism only where the inputs are already frozen;
- Measure the benefit in fabrication rounds avoided, not design hours saved.
