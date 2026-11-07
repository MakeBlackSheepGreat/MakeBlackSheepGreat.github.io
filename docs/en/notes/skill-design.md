# Skill design: capability units that load on demand

> A skill is a small capability the agent loads only when it needs one — usually a file with metadata plus a few reference files and scripts. The difference from a prompt is simple: **a prompt is what you say this time; a skill is an asset you maintain**. This note is about the design rules I worked out while building a research workflow suite.

::: info Short version
- Whether a skill works is decided less by how complete its body is than by **how narrow its trigger conditions are**;
- The counter-intuitive part: the longer the body, the less often it is invoked correctly — loading everything at once turns the skill from an asset into a cost, so disclosure has to be progressive;
- Boundaries (what is forbidden) matter as much as triggers; without them a skill will quietly modify data it should not touch;
- A skill has to be verifiable, and verification is mostly **negative cases**: when told "do not use it here", does it actually stay out?
:::

## 1. From one long prompt to 13 modules

In July–August 2026 the second research project meant rebuilding the whole "topic — training — validation — writing — figures" chain again. The first version was direct: one long prompt covering the entire workflow, four thousand-plus characters, from dataset splitting to paper figures.

The symptoms came quickly. The main flow either loaded the whole thing and still skipped steps (forgetting to fix the acceptance threshold before the run), or ignored it and improvised. Worse, failures could not be localised: four thousand characters is a single unit, so there was no way to say which step had not executed.

The fix was to cut the prompt by stage and check, block by block, whether it was invoked and which step got skipped. The cause was not missing content but **missing trigger conditions** — a module had no way to know it was its turn. After the split the suite became 13 skill modules plus about 20 deterministic scripts and over 90 tests, with one entry module that judges the current stage and routes to the rest. A second reversal concerned the scripts: only after deterministic steps were extracted and tested did the tests become meaningful — the 90-plus tests cover the scripts, not the judgement.

## 2. Skill versus prompt

| Dimension | Prompt | Skill |
| --- | --- | --- |
| Lifetime | This session | Long-lived, versioned with the project |
| Loading | Occupies context every time | Loaded only when triggers match |
| Testability | Judge the result | Trigger cases plus script tests, regression-capable |
| Evolution | Edited ad hoc | Goes through commits, revertable and comparable |

The test: **will this come up again in the next project?** If yes, it deserves to be a skill; if not, it stays a prompt.

## 3. Trigger conditions and boundaries

Triggers are written on both sides — when to use it, and when not to. With only the positive side, a skill grabs work everywhere:

```yaml
name: figure-export
triggers:
  - export experiment results as figures for a paper
  - the same batch of figures must be regenerated with consistent formatting
do_not_use:
  - a one-off diagram (drawing it directly is faster)
  - the data is not final (the figure will be redrawn)
requires:
  - results/metrics.json exists
```

Boundaries state what is forbidden, as concretely as the triggers:

```text
- raw experiment records are read-only
- never change the dataset split or the random seed
- never recompute metrics inside the plotting script (read metrics.json only)
```

Boundaries are not formalism. The hardware design pipeline splits into 9 skill modules by stage (topology discussion → schematic → layout → Gerber), and each module touches only its own stage's artefacts; the next stage does not start until the previous one's outputs exist. That boundary blocks exactly the class of interference where circuit edits and layout edits collide.

## 4. Progressive disclosure: only the essentials in the body

A skill body keeps four things: triggers, step skeleton, boundaries, output paths. Detail goes into linked reference files, and the body says explicitly when to read which file:

```text
skills/
├─ research-workflow/SKILL.md      # entry: judge the stage, route to modules
├─ data-split/SKILL.md             # triggers / skeleton / boundaries / outputs
│   └─ references/split-protocol.md  # detail: stratification rules, seed conventions
└─ scripts/
    ├─ split_dataset.py            # deterministic: same input, same output
    └─ tests/                      # the 90-plus tests live here
```

The reason is the cost of loading: detail in the body is paid by every task that matches the skill, while most tasks need only a fraction of it.

::: tip Best value for effort
Set a line limit for each skill body (mine is 120 lines) and move anything beyond it into references. The limit forces the real question: what must be known every single time?
:::

## 5. Verification: how to know the skill is invoked correctly

What gets verified is the invocation, not how pretty the output is. Each module gets a set of trigger cases, positive and negative:

```text
positive: export this run's results as figures   → figure-export should load
positive: redraw group 3 in the previous format  → figure-export should load
negative: draw me a quick flow diagram           → should not load
negative: training is still running, show me a figure → should not load (input missing)
```

Run the cases and count "should have loaded but did not" and "loaded when it should not" separately; only when both are zero are the triggers acceptable. On top of that, script tests: about 20 deterministic scripts covered by over 90 tests, guaranteeing identical input produces identical output.

::: warning The trap to watch for
Testing only positive cases makes a skill increasingly eager: it starts loading on anything vaguely related and takes over decisions that belong to the main flow. Negative cases are what actually constrain a trigger.
:::

## 6. Where the script/judgement line falls

One test: **must the same input produce the same output?** If yes, make it a script; if no, leave it in the skill as model judgement.

| Test | Script | Stays in the skill (judgement) |
| --- | --- | --- |
| Input/output | Same input must give the same output | Trade-offs depend on context |
| Cost of being wrong | Silent errors, must be caught by tests | Reviewable, a person can catch it |
| Examples | Dataset splitting, metric computation, figure generation, record templates | Whether an approach is worth trying, whether a conclusion can be written, whether to advance a stage |

Extract the deterministic part cleanly and the remaining judgement gets taken seriously; let a script "conveniently" choose the split ratio instead, and the tests lose their meaning.

## 7. Reusable checklist

- If it recurs in the next project, make it a skill; if not, keep it a prompt
- Write triggers in two columns: when to load, when not to load
- Write boundaries as prohibitions, specific down to files and fields
- Keep the body under 120 lines, move detail into references, and say when to read them
- Every skill gets positive and negative trigger cases, with both error types counted separately
- Work that must be deterministic becomes a script with tests, not a paragraph in a skill
