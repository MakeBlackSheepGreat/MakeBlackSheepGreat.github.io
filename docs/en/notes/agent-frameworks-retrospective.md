# Six agent frameworks in half a year: what the data says

> Between March and September 2026 I used six off-the-shelf coding agent frameworks in earnest on this machine, rebuilt one of my own, and self-hosted two more. This note uses the records to check my own judgement: **which migrations were forced by the work, and which were just me chasing novelty.**

::: info Short version
- Across six frameworks, only one thing ever triggered a migration: **the task type changed and the old framework's boundary stood in the way**;
- **The framework with the most sessions is not the most productive one** — short Q&A inflates session counts, and in one framework more than half the records are dispatched sub-tasks rather than conversations;
- Three assets survived every move intact: **the project rules file, cross-session memory, and the habit of looking at a rendered artifact before shipping it**. None of them lives inside a framework.
:::

## 1. Six frameworks, by period and scale

| Tool | Period | Records | Main use |
| --- | --- | --- | --- |
| A terminal agent with plugins and skills | 2026.03 – 09 | 783 runs, 282 named threads | long experiments, competition work, documentation |
| A desktop + terminal agent strong on engineering detail | 2026.06 – 09 | 9 projects, 93 sessions | research workflow suite, on-device debugging |
| A terminal agent with workspaces and sub-agents | 2026.08 – 09 | 29 sessions, 3,169 tool calls | corpus ingestion long run, deployment |
| A terminal agent with multi-agent orchestration | 2026.04 – 05 | 43 sessions (35 sub-agent) | orchestration experiments, a review draft |
| A domestic multimodal client | 2026.05 – 09 | 146 sessions, 25 working directories | medical imaging work, personal tooling, filing |
| My own build (a modified open-source base) | 2026.05 – 09 | 89 working sessions + 1,000+ test sessions | daily work on my own code |

Two self-hosted runtimes sit alongside these (a browser-facing service and a multi-agent workbench): not "someone else's tool", but my own workflow packaged as a remotely reachable service.

**A number that is easy to misread**: in the first framework's records, **362 are sub-agent threads** — nearly half of those "sessions" are dispatched sub-tasks, not conversations. Judging usage by session count is enough to get the conclusion wrong.

## 2. How the migrations actually went

**2026.03–04 · Orchestration first.** The opening question was whether multiple agents could write a review article together. Two boundaries appeared quickly: a long task that died halfway had no resumption, and switching between workspaces was expensive.

**2026.05–06 · Switching for material handling.** Competition work meant repeated image and document handling, and the domestic client was simply easier there. But the long-task problem did not move: "what happens when it dies halfway" still had no answer.

**2026.06 · Building my own.** I modified an open-source base, **porting only what I actually needed — nine features in the end** (persistent memory, multi-agent workflows for smaller models, goal-driven execution), leaving the rest upstream-shaped. The gain was not features but maintainability: fewer conflicts on upgrade, and a clear blame boundary when something breaks.

**2026.06–09 · Engineering detail goes to the one that asks questions.** The 13 modules and 90+ tests of the research workflow suite took shape on the framework that reads context and asks about what is unclear.

**2026.08–09 · Unattended long runs.** For work measured in tens of hours I moved to the terminal agent with sub-agents: an 11.2-hour corpus ingestion that recovered from a mid-run network drop. That needs goal mode plus resumption, which the earlier frameworks did not have.

The common thread: every move was triggered by a task type the old framework had no mechanism for — never by a new release.

## 3. Three lessons the data supports

**One: long tasks live or die on process.** The longest run finished because of content-hash idempotency and task-table resumption; those come with you regardless of framework. The full account is in [the corpus note](/en/notes/paper-corpus-pipeline).

**Two: concurrency is derived from the upstream limit.** I once ran at full concurrency: everything queued, retries burned the quota, and the wall clock was worse than a modest setting. The rule is now "cap at 70% of the service limit, then retry by failure class".

**Three: rules files outlive prompts.** Every framework got one, and its content was not a project introduction but **this machine's and this repository's specific constraints**: which commands do not work, which paths need escaping, which checks must run before delivery. All of them survived every migration intact.

::: tip Best value for effort
**Keep assets outside the framework**: rules files, memory files and verification scripts live in the project directory and sync across devices through a private repository. Migration then degrades from "rebuild my working environment" to "change the entry point".
:::

## 4. Three pitfalls

**One: treating session count as output.** I used to gauge progress by session numbers until I noticed how much short Q&A inflates them. Tasks completed and long-run success rate are the numbers that matter.

**Two: config migration is more expensive than it looks.** I assumed it meant copying configuration files; what actually had to be rebuilt was the rules file, the memory, and scripted versions of the workflows used most — more time than the migration saved.

**Three: parallel is not fast.** The only trap I have fallen into twice; the story is in [multi-agent division of labour](/en/notes/multi-agent-roles).

::: warning Worth noting
Time a migration to the start of new work, not the middle of a project. Letting old projects finish where they are costs far less than porting all history at once.
:::

## 5. How work is routed now

| Task type | Goes to | Test |
| --- | --- | --- |
| Unattended long runs | the framework with goal mode and resumption | can it resume after a drop |
| Engineering work needing iteration | the one that asks about unclear points | does it clarify before building |
| Work needing tight process control | my own build | memory and workflow defined by me |
| Service-shaped, cross-device access | the self-hosted runtime | remotely reachable, long-lived |

The cost is maintaining several environments; the benefit is that each task type gets the tool that fits it. For personal use, that trade is worth it.

## 6. Reusable checklist

1. Before migrating, ask: **did the task type change, or is the new tool merely popular?**
2. Estimate migration cost across rules, memory, scripts and habits — not configuration files;
3. New work goes to the new framework; old projects finish where they are;
4. Write a rules file for every framework — it is the one asset that does not expire with the tool;
5. Measure your output by tasks completed, not by session count.
