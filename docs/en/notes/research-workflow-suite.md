# Turning a research workflow into callable tooling

> July–August 2026. The goal: break the chain from topic selection through training, validation, writing and figures into reusable modules, so the second project does not have to rebuild the pipeline from scratch.

## Why a suite rather than a script

What repeats between projects is rarely the model code — it is the process around it: how data is split, how experiments are recorded, when the decision criteria get fixed, how results become figures, and how failures get described in writing. All of it reappears verbatim in the next project. So I split it into **13 skill modules and about 20 deterministic scripts**, with **90+ tests** covering the script side.

## Design trade-offs

**One entry point, modules on demand.** With enough modules, remembering which to invoke becomes the burden. So the outermost layer is a single module: it assesses the current stage and what is missing, then decides which sub-modules to call. The user describes the task, not the pipeline.

**Deterministic work goes to scripts, judgement goes to the model.** Data splitting, metric computation, figure generation and record filling should produce identical results every time, so they are scripts with tests. Only decisions that need judgement — is this approach worth trying, can this conclusion be stated — go to the model.

**Criteria before the experiment.** Fixing the decision threshold and archiving it before the run is a mandatory step, and it is never adjusted afterwards. It looks like the most ceremonial part of the suite, and it earned its place — see [Negative results count too](/en/notes/negative-results).

**Environment constraints become a rules file.** Each project keeps a file recording what cannot be used here, what needs escaping, which tools are broken. Written once, it benefits every later session.

## Tested on a real project

I ran the suite end to end on a real classification project (baseline 77.23%, new module 56.78% with a mid-training collapse). The result was negative, but the process held: the failure was archived in the same format as a success, and the diagnosis became a reusable check.

## Closing thought

The return on tooling the process is not speed — it is that **discipline becomes easy to follow**. When "write the criteria first" is a mandatory step, you do not skip it because you are in a hurry.
