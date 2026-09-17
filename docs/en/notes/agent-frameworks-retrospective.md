# Four agent frameworks in one year: what the data says

> From March to September 2026 I used Codex, Claude Code, ZCode and a build of my own in earnest on this machine. This is not a review — it is an attempt to check my own judgements against the records the tools left behind.

::: info Short version
- Migrations were never triggered by "a new tool exists" but by **the task type changing while the framework's boundary stayed put**;
- The framework with the most sessions is not necessarily the most productive one — **short Q&A inflates session counts**;
- Three things survived every migration: **the rules file, the memory file, and the habit of verifying**. None of them lives inside a framework.
:::

## 1. Scale of use

| Framework | Period | Sessions / threads | Main use |
| --- | --- | --- | --- |
| Codex | 2026.03 – 09 | 783 runs, 282 named threads | long experiments, competition projects, document material |
| Claude Code | 2026.06 – 09 | 9 projects, 93 sessions | research workflow suite, on-device debugging |
| ZCode | 2026.08 – 09 | 29 sessions, 3,169 tool calls | corpus ingestion long-run, deployment, modelling contest |
| My own build | 2026.06 – 09 | thousands of test sessions in-repo | daily work on my own code |

::: tip A number that is easy to misread
Of the Codex runs, **362 are sub-agent threads** — nearly half of those "sessions" are not conversations with me but tasks dispatched by a main flow. Counting usage without separating the two turns "20 sub-tasks in one dispatch" into "20 chats".
:::

## 2. What each framework actually solved

**Codex** excelled at unattended long tasks: goal mode can take an experiment from design to conclusion without step-by-step confirmation. It carried the most expensive categories — competition iteration and ablations with hundreds of parallel sub-tasks.

**Claude Code** excelled at engineering care: it reads context and asks about what is unclear, which suits "get this right" over "get this done". The 13 modules and 90+ tests of the research workflow suite largely took shape there.

**ZCode** handled very long runs and large parallel fan-out: the 11.2-hour continuous corpus ingestion and a ten-hour autonomous development task both ran there.

**My own build** is about control: persistent memory, a multi-agent workflow shaped to my task structure, and goal-driven execution defined the way I wanted it.

## 3. Three lessons the data supports

**1. Long tasks live or die on process, not model.** The longest run finished because of content-hash idempotency and task-table resumption, not because of the model choice.

**2. Derive concurrency from the limit, not from mood.** I once dispatched a dozen sub-tasks at once: everything waited on everything else and retries burned the quota. After fixing a cap, the same work finished sooner.

**3. Rules files outlive prompts.** Every framework got a project rules file, and its content was environment constraints rather than a project description. Those files survived every migration — **they are the only asset I am confident will not expire**.

## 4. Three pitfalls

**1. Treating session count as output.** I used to gauge my own progress by session numbers; short Q&A inflates them. Tasks completed and long-run success rate are the numbers worth tracking.

**2. "Config migration" is more expensive than it looks.** What actually has to be rebuilt is the rules file, the memory, and scripted versions of the workflows used most. After the third migration, all of it lives outside the frameworks.

**3. Parallel is not fast.** See lesson 2 — repeated because it is the only trap I have fallen into twice.

## 5. How I work now

I no longer look for one framework that does everything. Instead work is routed by type: **long runs go to whatever is best at unattended execution, engineering detail goes to whatever asks questions, and anything needing tight process control uses my own build.**

The cost is maintaining several environments; the benefit is that each task type gets the tool that fits it. For personal use, that trade is worth it.
