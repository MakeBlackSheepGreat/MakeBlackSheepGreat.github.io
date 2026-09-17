# One person, a team of agents: roles, concurrency and acceptance

> I have run several agents at once for most of this year. This note is about the three questions that decide whether that saves time or wastes it: how to split roles, how far to parallelise, and how to accept the result.

::: info Short version
- The value of splitting is not parallelism — it is **making sure the one proposing a solution is not the one verifying it**;
- Derive the concurrency cap from the **service limit**, and cache before parallelising;
- Acceptance criteria must be **machine-checkable**, otherwise they are not requirements.
:::

## 1. The scale of one typical task

An ablation experiment, as it actually ran:

| Role | Count | Only does | Explicitly does not |
| --- | --- | --- | --- |
| Main flow | 1 | split work, aggregate, report | implement anything itself |
| Explore | 2–4 | read-only inspection with evidence | change any file |
| Implement | 1–3 | change within agreed scope | verify its own work |
| Review | 1–2 | find problems against a checklist | **change any code** |

In the same body of records, **close to half of all execution units are sub-tasks rather than conversation turns** — most "sessions" are dispatched labour, not back-and-forth.

## 2. Three hard rules

**1. Reviewers do not change code.** The moment they can, they fix problems in place, the "finding problems" stage disappears, and you are left with one more implementer.

**2. Cache first, then parallelise.** Results land on disk so re-runs cost almost nothing, and the concurrency cap comes from the API limit rather than enthusiasm:

```text
cap = min(rate_limit × 0.7, concurrency the local machine can sustain)
retries = enable only for classes where retry helps (e.g. rate limits);
          everything else is recorded with its reason and skipped
```

**3. Acceptance must be automatically judgeable.** "Check whether there are problems" is not a requirement. Usable criteria look like: all tests pass with a count; every clickable element was actually clicked with counts of total and failed clicks; exported images were rendered and looked at, not merely confirmed to exist.

::: tip Best value for effort
Turn acceptance criteria into executable checks and let the main flow run them. After that, a human only looks at conclusions at key points.
:::

## 3. Three pitfalls

**1. Maximum concurrency is a negative optimisation.** I once dispatched a dozen sub-tasks: rate limits, mutual waiting, retries burning the quota, and a longer wall clock. With a fixed cap, the same work finished sooner.

**2. A sub-task without a definition of done cannot converge.** Every sub-task must state what counts as finished, otherwise the main flow cannot tell whether to wait or collect. My bar: progress on disk, a defined artifact, and a timeout/retry policy — all three before dispatch.

::: warning Worth noting
Long tasks must write progress to a file, not keep it in the conversation. A dropped session takes conversational state with it; a file can be picked up by any process.
:::

**3. Sub-task context must stay clean.** Carrying irrelevant history into a sub-task measurably degrades its judgement. Give it what it needs, not everything it might touch.

## 4. What I do by default now

- Exploration and review are **read-only**; implementation and review are **separated**
- Concurrency is capped and failures are retried by class
- Acceptance criteria are written first, and anything a script can check never goes to a human
- Long tasks keep progress on disk, so they can be interrupted, handed over and resumed

With those four fixed, "one person with a team of agents" stops being a demo and becomes a usable way to work.
