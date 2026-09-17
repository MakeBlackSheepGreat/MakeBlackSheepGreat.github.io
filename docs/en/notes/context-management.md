# Context management: what to feed an agent

> Same model, same task, different information — and the output quality differs by an order of magnitude. **More context is not better**: irrelevant history dilutes judgement, while missing constraints invite the agent to improvise. This is the layered approach I settled on.

::: info Short version
- Supply information in four layers: **system rules → project rules → task input → session history**, stable at the top;
- Rules files hold environment constraints, memory files hold conclusions — neither lives in the prompt;
- A sub-task gets only the input it needs, **not every document it might touch**.
:::

## 1. The four layers

| Layer | Content | How often it changes | Where it lives |
| --- | --- | --- | --- |
| System rules | Role, output style, prohibitions | Rarely | Framework config / global rules file |
| Project rules | Constraints specific to this environment and repository | As the project evolves | Rules file in the project root |
| Task input | What to do now, acceptance criteria, boundaries | Every task | The dispatch itself |
| Session history | Trial and error, intermediate conclusions | Continuously growing | The session |

The point of layering: **the higher the layer, the more stable**. Stable information goes into files so it never has to be re-explained; temporary information stays in the session so it never pollutes the long-term rules.

## 2. What belongs in the rules file

Environment constraints, not a project introduction:

- Which commands do not work on this machine, and what replaces them
- Which paths need escaping, which tool versions have traps
- Which checks must run before delivery
- The non-default parts of style and naming conventions

The test is simple: **would I step on this again if it were not written down?** If yes, it goes in. The payoff is permanent — every session starts with the environment's manual loaded.

::: tip Best value for effort
At the end of a session, append the trap you just hit to the rules file. One line costs far less than rediscovering it later.
:::

## 3. What belongs in the memory file

Rules record the environment; memory records **conclusions**:

- An approach ruled out, and why
- A parameter range that does not apply
- A decision and the context behind it, so nobody re-litigates it later

Kept only in a session, this vanishes when the session or the machine changes. Mine live as files in the project directory, synchronised across devices through a private repository — **which is why changing frameworks costs me very little**.

## 4. Keep sub-task context clean

**One: give only what is needed.** Carrying the main flow's full history into a sub-task degrades its judgement — it starts accommodating constraints unrelated to its job.

**Two: no shared mutable state.** Parallel sub-tasks should not edit the same files; if they must, serialise or isolate first. This causes more incidents than context size does.

## 5. Long sessions

Long sessions get compressed or truncated, inevitably. The countermeasure is to **externalise conclusions as they form**:

- Stage conclusions → memory file
- Task state → task table or progress file
- Key decisions → rules file or project docs

The principle: **never let knowledge that exists only inside a session become a critical dependency**. Sessions can be discarded; files cannot.

::: warning Worth noting
When context is compressed, what is dropped is usually the process rather than the conclusions — but a conclusion that only exists inside the process description goes with it. Write conclusions down at the moment you reach them.
:::

## 6. A negative example

Early on I had a painful episode: a conclusion lived in the middle of one session, and after switching tools and machines all I could find was evidence that something had been discussed — the conclusion had to be re-derived.

Since then one habit is fixed: **the moment a reusable conclusion appears, it goes into the project's memory file or notes**, and syncs across devices. It costs almost nothing and turns a one-off conversation into accumulating assets.
