# Turning a research workflow into callable tooling

> July–August 2026. Breaking the chain from topic selection through training, validation, writing and figures into reusable modules, so the next project does not rebuild the pipeline from scratch. The result: 13 skill modules, about 20 deterministic scripts, 90+ tests.

::: info Short version
- The counter-intuitive part: the value is not speed, it is that **discipline becomes cheap to follow**. When "write the criteria first" is a mandatory step, you do not skip it because you are in a hurry;
- Deterministic work goes to scripts, judgement goes to the model. I drew that line the wrong way first, and paid for it with two runs of the same experiment reporting different metrics;
- Past a dozen modules you need a single entry point. Making a person remember which module to invoke is itself a design failure.
:::

## 1. Why: rebuilding the pipeline for the second project

What repeats between projects is rarely the model code. It is the process around it: how data is split, how experiments are recorded, when the decision criteria get fixed, how results become figures, how failures get described. For my second project I rebuilt all of it from memory, and the parameters and definitions did not quite match the first time.

So it became a suite where one module does one thing: **13 skill modules, about 20 deterministic scripts**, with **90+ tests** covering the script side.

## 2. The line I drew wrong: who does deterministic work

Version one split it as "simple things to scripts, complex things to the model". That sounds reasonable and it is wrong. A data-splitting decision — whether a class of samples belongs in the validation set — went into a script, while metric computation, pure arithmetic, was left to the model through a prompt.

The failure showed up quickly: the same experiment, run twice, gave F1 scores differing by a few tenths of a point. It was not model randomness. The model had counted a different sample range each time, including boundary samples in the positive class on one run.

The rule reversed into something harder: **anything whose result must be identical every time (splits, metrics, figures, record templates) is a script with tests; only genuinely judgemental questions — is this approach worth trying, can this conclusion be stated — go to the model.** The test is not difficulty, it is whether correctness can be checked automatically.

## 3. With enough modules, there must be one entry point

Past ten or so modules a new burden appeared: remembering when to call which. I found myself hesitating over module choice, and that hesitation had nothing to do with the research.

The fix was to keep a single outer module: it assesses the current stage and what is missing, then decides which sub-modules to call. The user describes the task and never needs to know how many modules exist.

## 4. Criteria are written before the experiment

This became a mandatory step with an artefact: write the decision rule down and archive it, then run, and never adjust the threshold afterwards. It looks like the most ceremonial part of the suite, and it earned its place — see [Negative results count too](/en/notes/negative-results).

What was written that time was "no stable improvement counts as failure", so when accuracy fell from 77.23% to 56.78% there was no room to discuss tuning it further. Diagnosis started immediately and ended at a design flaw: routing weights collapsing.

::: tip Best value for effort
Make "write the criteria" a step that must leave an artefact, not a verbal agreement. The artefact does not have to be shown to anyone — its job is to remove your own escape route when the result looks bad.
:::

## 5. Environment constraints become a rules file

Every project keeps a rules file recording what cannot be used here, what needs escaping, which tools are broken. Written once, it benefits every later session. Unlike research conclusions, its entire value comes from taking effect on its own next time.

::: warning Worth noting
Do not rely on tooling to remember constraints for you. The rules file has to be an explicit file in the project directory — kept in a session, or in one tool's private config, it disappears the moment either changes.
:::

## 6. Tested on a real project

The suite then ran end to end on a real image-classification project: baseline 77.23%, new module 56.78% with a mid-training collapse. The result was negative, but the process held — the failure was archived in the same record format as a success, and the diagnosis became a reusable check.

## 7. Reusable checklist

- The test is "can correctness be checked automatically": scripts with tests if yes, the model if no;
- Criteria are written and archived before the run and never adjusted after;
- Past a dozen modules, collapse to one entry point that judges stage and prerequisites;
- One rules file per project, containing only constraints that would be stepped on again;
- Failures use the same record format as successes and are archived the same way;
- The goal of tooling is to make discipline cheap, not to make the process fast.
