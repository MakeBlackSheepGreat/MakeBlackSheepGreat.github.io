# Choosing and switching agent frameworks: the criteria half a year produced

> Within the last half year I have used four agent frameworks seriously on this machine and rebuilt one of my own. It looks like frequent switching, but every migration answered the same question: **has the current framework's capability boundary started to block the kind of work I am doing?**

::: info Short version
- The real trigger is **a change in task type**, not "a new tool exists"; running four frameworks side by side and assigning work by task type beats picking one best tool;
- Counter-intuitive: **migration cost is systematically underestimated**. The first move was planned as an hour of copying configuration and took three days — what had to be rebuilt was rule files, memory and scripted workflows;
- The assets that matter are **rule files, memory files and acceptance habits**, and they have to live outside the framework, or every switch rebuilds them from scratch.
:::

## 1. One migration that was badly underestimated

June 2026, moving from one framework to another, planned as "done this afternoon": copy the configuration, fix the paths, ship it.

The actual list looked like this:

| What had to move | What was assumed | What it took |
| --- | --- | --- |
| Configuration | Copy and paste | Field names and semantics differ; translate item by item |
| Project rules | Not considered | Every project's environment constraints (which commands fail, which paths need escaping) rewritten |
| Memory | Not considered | Half a year of conclusions scattered across session logs, fished out by hand |
| Routine workflows | Not considered | The scripted ones re-wrapped inside the new framework |

Three days. Before the second migration one thing was done first: rules and memory were moved out of the framework and into the project directory. By the third migration that part cost nothing — only a short entry note explaining how to read those files.

## 2. Evaluation dimensions: not "supported?" but "at which hour does it break?"

The field that loses meaning fastest in any comparison table is "supported / not supported". The judgement only became stable after rewriting each dimension as a question with an answer:

| Dimension | The question that decides it |
| --- | --- |
| Context capacity | An 8,000-line file plus 200 messages of history — can it be read without rewriting or truncating? |
| Long-task support | Three hours unattended; if it drops halfway, does it resume on its own? |
| Multi-agent | Dispatch ten sub-tasks: do they finish independently and report back, or wait on each other? |
| Extensibility | Can it attach MCP servers, plugins and skills, instead of relying on prompt text? |
| Controllability | Can it point at a local model or a self-hosted service? |
| Cost model | What does a long run bill on (per call, per token, per hour), and where is the rate limit? |

## 3. When to switch, when not to

Migrations were never triggered by a new tool appearing; they were triggered by a change in task type that the current framework had no mechanism for. Over half a year only three triggers were real: unattended autonomous runs of several hours, work across a very large repository, and dispatching sub-tasks in batches.

Conversely, three situations keep the old framework in place even when the new one looks better:

- **When the increment is smaller than the migration cost** — estimated from the table above, not from the configuration file alone;
- **While old projects are still running** — finish them where they are and use the new framework for new work;
- **When it is only more popular** — community heat is not a change in capability boundaries.

::: warning Worth noting
Judging a framework by usage metrics (session count, tool calls, hours used) systematically overrates short question-and-answer usage. Digging through the usage records, a large share of the entries were not conversations with a model at all but sub-agent threads dispatched by a main process; the framework ranked most-used by session count was not the one that produced the most work.
:::

## 4. When to build your own

Building only makes sense when the capability needed is one **upstream cannot provide** — because it is project-specific, or because upstream made a different trade-off in the same place.

The approach is incremental modification, not a rewrite: start from an open-source implementation, write the wanted features as a list, port only the ones genuinely needed (nine survived), and leave the rest upstream-shaped. Fewer conflicts when upstream moves, and it stays clear whether a bug belongs to the added part or to the base.

## 5. The real assets are not in the framework

The most important conclusion of the half year: **memory, rules and method should not live inside any framework.** They live as files in the project directory, and the framework is just an execution layer that can be replaced:

```text
project/
├─ AGENTS.md            # environment constraints: what fails here, what needs escaping
├─ docs/decisions/      # conclusions and trade-offs: why this way, what was rejected
└─ scripts/check.sh     # acceptance habits: runs before every delivery
```

Seen that way, how many frameworks were used is not the point. What matters is that **each migration left the real assets where they were**.

::: tip Best value for effort
Do this before migrating: move the rule files and memory out of the framework into the project directory, and keep only a short entry note in the new framework explaining how to read them. After that, a migration stops being a rebuild and becomes a plug-in.
:::

## 6. Reusable checklist

- Answer one question first: does the old framework have a mechanism for this class of task?
- Estimate migration cost across four items — rules, memory, scripts, credentials — not the configuration file alone;
- If the capability boundary is sufficient, do not switch; let running projects finish where they are instead of porting all history at once;
- Build your own only when upstream cannot provide the capability, and then port incrementally;
- Keep rules, memory and acceptance scripts outside the framework so the next migration costs close to nothing.
