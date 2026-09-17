# Decomposing a problem into tasks an agent can execute

> Most of the difference in how well agents work is not the model — it is how the work was handed over. The same model receiving "optimise this project" and receiving a decomposed task list with an explicit acceptance test will produce results an order of magnitude apart.

::: info Short version
- The goal is not fineness but **every execution unit having an independently judgeable output**;
- Find the **acceptance criterion** first: a requirement whose finished state cannot be described should not be decomposed at all;
- The ceiling on parallelism is set not by task count but by **whether shared mutable state exists**;
- My most expensive rework was not caused by the model picking the wrong approach, but by a task that had an objective and no acceptance test.
:::

## 1. The rework: a one-line request that ran for two hours

In August 2026 the corpus pipeline got its first dispatch, and the whole task description was one sentence: turn these papers into a searchable knowledge base. The reasoning at the time was that the agent would plan for itself — run it and see.

An hour and a half in, a spot check at roughly 5,500 papers exposed the problem: the output was a free-form summary per paper, which could not answer the original question — which part of which paper does this conclusion come from. Of 50 papers checked by hand, fewer than 15 entries could be traced back to a location in the source.

Diagnosis took little time because the cause was plain: the model had not chosen a wrong approach; the task never contained a "what finished looks like" field. So the work was thrown away and rebuilt — acceptance criterion first, sub-tasks derived from it backwards. The rebuilt pipeline then ran 11.2 hours continuously over 30,031 papers, completing 30,018 (99.96%), recovered by itself from a mid-run network drop, and produced 18,125 evidence links, each pointing back into the original text.

## 2. Four levels, objective to execution unit

| Level | Content | Test of readiness |
| --- | --- | --- |
| Objective | The real problem | Can state "why" in one sentence |
| Acceptance | What finished looks like | Objectively judgeable (tests pass / metric met / sampled check) |
| Sub-task | A relatively independent block | Clear inputs and outputs, verifiable on its own |
| Execution unit | One dispatch to an agent | Completable in one session, retryable on failure |

The most common mistake is jumping from objective straight to execution unit: the objective is grand, the unit is concrete, and acceptance and sub-task boundaries are missing — so the agent guesses, and its guess is usually not your intent. The rework above skipped level two.

## 3. Three questions before decomposing

**One: what does finished look like?** If you cannot answer, stop. This step exposes the real issue: some requirements are hard to delegate because the requester has not decided what they want.

**Two: what is the smallest verifiable unit?** The smallest set that runs on its own and can be judged right or wrong. Get one paper through the end-to-end quality check before scaling up.

**Three: what must absolutely not happen?** Boundaries are easier to forget than outputs — read-only, don't touch that directory, don't add dependencies. Without them the agent follows its own judgement, and that autonomy is usually not what you wanted. A dispatch template can be short:

```text
Task: implement content-hash idempotency and task-table reads
Input: table schema + location of the hash function
Output: re-running the same batch creates no new rows, with test count
Boundaries: do not change parsing logic, add no dependencies
Acceptance: tests green, report the number that passed
```

## 4. Granularity: one judgeable output per unit

There is one test: **can this unit's output be judged without context?** Yes means the granularity is right. No — "optimised part of the code" — means either the split is incomplete or the acceptance criterion is missing.

Too fine is equally wasteful: chopping continuous work into ten fragments that need hand-offs costs more in coordination than it saves. Three cases I do not decompose — single-file small edits, judgement questions (asking directly is cheaper), and exploratory work (let the agent look first, then decide).

## 5. Serial and parallel follow the dependencies

- **Data dependency**: the next step consumes the previous output → serial
- **Interface undefined**: parallel changes to the same interface conflict → fix the interface first
- **Shared mutable state**: multiple units editing the same files or data → serialise or isolate first

The third is the one most often missed: two sub-tasks editing the same files overwrite each other at merge time, and every step looks correct on its own, so no checkpoint catches it.

::: warning The trap to watch for
Parallelism requires "no shared mutable state", not "looks independent". Before dispatching, list which files each unit will write; any overlap means serial.
:::

## 6. Three errors that keep coming back

**Splitting by job title rather than by output.** "One does the backend, one does the frontend" only works once the interface exists. Split by output instead: define the interface as one unit, then implement on both sides.

**Mixing exploration and implementation in one unit.** Exploration needs breadth and trial; implementation needs convergence. Combined, the agent explores with an implementation mindset and locks onto the first workable option.

**Dragging irrelevant context into a sub-task.** Unrelated history dilutes judgement. Give the unit what it needs.

::: tip Best value for effort
Before dispatching, write the unit's definition of done in one sentence. If you cannot, you are not ready — and dispatching anyway usually means rework.
:::

## 7. Reusable checklist

- Ask "what does finished look like" before anything else; if there is no answer, define acceptance first
- Walk all four levels before dispatching: objective → acceptance → sub-task → execution unit
- Every unit must be independently judgeable; if it is not, the granularity or the criterion is missing
- Dispatch template in four lines: input, output, boundaries, acceptance
- Before parallelising, compare the file lists; any overlap means serial
- Do not decompose single-file edits, judgement questions, or exploratory work
