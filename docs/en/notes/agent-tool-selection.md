# Choosing and switching agent frameworks: the criteria a year produced

> I have used several agent frameworks seriously on this machine within the last half year, and rebuilt one of my own. It looks like frequent switching, but every migration answered the same question: **has the current framework's capability boundary started to block the kind of work I am doing?**

## 1. The dimensions that proved useful

| Dimension | What I actually check |
| --- | --- |
| Context capacity | Can it handle long files and long sessions without constant truncation |
| Long-task support | Goal mode, automatic continuation, unattended execution |
| Multi-agent | Can it dispatch sub-tasks that finish independently |
| Extensibility | Plugins, skills, MCP — the ability to attach outside capability |
| Controllability | Local models, private deployment, self-hosted services |
| Cost model | Whether the quota structure suits long-running work |

## 2. When to switch

The trigger is never "a new tool exists" but **the task type changed and the boundary did not move**: unattended multi-hour experiments, working across a very large repository, dispatching tasks in parallel — if the framework has no mechanism for it, migration happens.

## 3. When not to

- **When the increment is smaller than the migration cost** — what moves is not just configuration but accumulated rules, memory and habits;
- **While old projects are still running** — finish them where they are; use the new framework for new work rather than porting all history at once;
- **When it is only more popular** — community heat is not a change in capability boundaries.

## 4. When to build your own

Only when the capability you need is one **the upstream project cannot provide** — because it is project-specific, or because upstream made a different trade-off. My approach is incremental: start from an open-source implementation and port only the features actually needed, leaving the rest upstream-shaped. Fewer conflicts on upgrade, clearer blame when something breaks.

## 5. The real assets are not in the framework

The most important conclusion of the last half year: **memory, rules and method should not live inside any framework.** They live as files in the project directory, and the framework is just an execution layer that can be replaced.

Seen that way, the number of frameworks is not the point — what matters is that **each migration left the real assets behind in place**.

## Closing thought

Treat the tool as an execution layer and method and memory as assets, and the question stops being "which tool is best" and becomes two clearer ones: **what capability does this work need**, and **what gets left behind when I move**.
