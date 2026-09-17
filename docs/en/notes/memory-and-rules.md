# Memory and rules: turning mistakes into process

> When the same trap catches you a second time, the problem is rarely the agent's intelligence — it is that nothing in the process remembers. The habit I settled into over the last half year: anything that recurs gets upgraded from "how do I fix it now" to "how do I never handle it again".

::: info Short version
- Rules files hold environment constraints, memory files hold conclusions; keeping the split clean stops both turning into a project introduction;
- Requirements end up scattered across dozens or hundreds of sessions, and **having an agent re-read its own history** beats recalling them by hand — but the compiled list needs a status field;
- A lesson only works once it sits where it is always read: rules file, checklist, script. Written in a chat log it does nothing;
- One test decides everything: will this take effect automatically next time?
:::

## 1. A requirements ledger: letting the agent re-read its own history

Once the session count passed a hundred, a new problem appeared: the same requirement sat in several sessions and was understood slightly differently each time. The clearest case was me changing a convention according to an early session, when a later session had already replaced that convention — nobody remembered.

So a ledger was built: batch-review the past sessions, extract every requirement that was raised, deduplicate and write the single authoritative list, with a status field attached.

| Requirement | Source | Status | Evidence |
| --- | --- | --- | --- |
| Site-wide time wording is "half a year" | early sessions | active | site copy checklist |
| Failed experiments are archived as fully as successes | mid sessions | active | experiment record template |
| An early agreed directory layout | early sessions | superseded | later changed to group by artefact type |

The raw extraction produced over two hundred entries, mostly restatements; after deduplication and status marking it converged to a few dozen. **The value is not the list itself but the explicit "no longer valid" half** — otherwise it is just another document that goes stale.

## 2. Rules files versus memory files

| File | Holds | Does not hold | When it updates |
| --- | --- | --- | --- |
| Rules file | Environment constraints: which commands fail, which paths need escaping, what must run before delivery | Project intros, one-off tasks | Every new trap |
| Memory file | Conclusions: rejected approaches, dead parameter ranges, decision context | A running log of the process | The moment a conclusion is reached |
| Requirements ledger | The single wording of each requirement, plus status | Unconfirmed guesses | Once sessions multiply |

To decide where something goes, ask: **is this a property of the environment, or does it change with the task?** Environment goes to rules, task-specific goes to memory.

One real payoff: the Windows path-escaping constraint was explained five times across five sessions before it entered the rules file. Afterwards it never came up again. One written line replaced all the later rediscovery.

## 3. Keeping memory outside the tools

I use different agent frameworks on different machines. If memory lives inside one client, switching devices means amnesia. So memory and experience are files in the project directory, synchronised between devices through a private repository:

```bash
git -C ~/agent-memory pull --rebase
git -C ~/agent-memory add -A
git -C ~/agent-memory commit -m "rules: add path escaping constraint"
git -C ~/agent-memory push
```

This is what makes framework switching cheap: **the real assets — rules, conclusions, methods — were never inside the framework**, so there is little to migrate.

::: tip Best value for effort
Before a session ends, ask one extra question: did anything today deserve a "never again"? If so, write one line into the rules file or the memory file. It costs almost nothing and decides whether the collaboration accumulates or repeats.
:::

## 4. The test: will it take effect automatically next time?

Whenever I write a lesson down, I ask: **will this take effect automatically next time?**

- If the answer is "I would have to remember to look it up", it will eventually fail
- Only when it sits where it is always read — rules file, checklist, automation — has it really become process

The same test applies to skills and workflows: the trigger conditions written into a [skill](/en/notes/skill-design) are rules read by the agent; the constraints in a rules file are rules read by every session. Both rest on the same point: **placement matters more than content.**

::: warning The trap to watch for
Writing a lesson into a chat log or leaving it inside one client feels like it is recorded, but it will not show up next time. Once is an accident; twice is a missing rule.
:::

## 5. Reusable checklist

- Rules file for environment constraints, memory file for conclusions, ledger for the single wording of requirements
- The ledger carries a status field, with superseded entries marked explicitly
- Compile historical requirements by having an agent batch-review the sessions
- Keep memory and rules as files in the project directory, synced across devices via a private repository
- After writing a lesson, ask whether it will take effect automatically next time
- The second time a problem appears, upgrade it into a rule, a check, or a script
