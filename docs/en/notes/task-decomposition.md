# Decomposing a problem into tasks an agent can execute

> Most of the difference in how well agents work is not the model — it is **how the work was handed over**. The same model receiving "optimise this project" and receiving a decomposed task list will produce results an order of magnitude apart.

::: info Short version
- The goal of decomposition is not fineness but **every unit having a verifiable output**;
- Find the **acceptance criterion** first: a requirement whose finished state cannot be described should not be decomposed yet;
- Boundaries (what not to do) matter as much as outputs; missing either one and the work drifts.
:::

## 1. Four levels

| Level | Content | Test of readiness |
| --- | --- | --- |
| Objective | The real problem | Can state "why" in one sentence |
| Acceptance | What finished looks like | Objectively judgeable (tests pass / metric met / human sign-off) |
| Sub-task | A relatively independent block | Clear inputs and outputs, verifiable on its own |
| Execution unit | One dispatch to an agent | Completable in one session, retryable on failure |

The most common mistake is **jumping from objective straight to execution unit**: the objective is grand, the unit is concrete, and the acceptance criterion and sub-task boundaries are missing — so the agent guesses, and its guess is usually not your intent.

## 2. Three questions before decomposing

**One: what does finished look like?** If you cannot answer, stop — go define the acceptance criterion first. This step often exposes the real issue: some requirements are hard to delegate because the requester has not decided what they want.

**Two: what is the smallest verifiable unit?** Build that one unit first, confirm the direction, then scale.

**Three: what must absolutely not happen?** Boundaries are easier to forget than outputs — read-only, don't touch that directory, don't add dependencies. Without them the agent follows its own judgement, and that autonomy is usually not what you wanted.

## 3. Granularity: one verifiable output

My rule of thumb: **can this unit's output be judged without context?**

- Yes → the granularity is right, dispatch it;
- No ("optimised part of the code") → either the split is incomplete or the acceptance criterion is missing.

Too fine is also wasteful: chopping continuous work into ten hand-off fragments costs more in coordination than it saves. Three cases I normally do not decompose: single-file small edits, judgement questions (asking directly is cheaper), and exploratory work (let the agent look first, then decide).

## 4. Serial versus parallel

- **Data dependency**: the next step consumes the previous output → serial
- **Interface undefined**: parallel changes to the same interface conflict → fix the interface first
- **Shared mutable state**: multiple units editing the same files or data → serialise or isolate first

The third is the one that bit me: two sub-tasks editing the same files, overwriting each other at merge time. **Parallelism requires "no shared mutable state", not "looks independent".**

## 5. Common decomposition errors

**One: splitting by job title rather than by output.** "One does the backend, one does the frontend" only works if the interface exists. Split by output instead: define the interface (one unit), then implement on both sides.

**Two: mixing exploration and implementation in one sub-task.** Exploration needs breadth and trial; implementation needs convergence. Combined, the agent explores with an implementation mindset and locks onto the first workable option.

**Three: dragging irrelevant context into a sub-task.** More context is not better; unrelated history dilutes judgement. Give it what it needs.

::: tip Best value for effort
Before dispatching, write down the unit's definition of done in one sentence. If you cannot, you are not ready — and dispatching anyway usually means rework.
:::

## 6. A real example

A corpus-processing task started as "turn these tens of thousands of papers into a knowledge base". Decomposed through the four levels:

- Objective: literature search that returns its sources
- Acceptance: sample 50 papers — every entry matches the source and traces back to a location in it
- Sub-tasks: parse and chunk / extract / store with evidence links / quality sampling
- Execution units: for example "implement content-hash idempotency and task-table reads"

The result ran 11.2 hours continuously and recovered from a mid-run network drop — **not because the model was strong, but because every stage was independently verifiable**. The full account is in [another note](/en/notes/paper-corpus-pipeline).
