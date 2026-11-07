# Context management: what to feed an agent

> Same model, same task, different information — and the output differs by an order of magnitude. This note is about layered supply: what belongs in long-lived files, what travels with a task, and what must reach disk before a session ends.

::: info Short version
- Supply information in four layers: **system rules → project rules → task input → session history**, stable at the top;
- Rules files hold environment constraints; memory files hold conclusions; neither belongs inside a prompt;
- The counter-intuitive part: giving a sub-task more information can lower its judgement — it starts accommodating constraints unrelated to its job;
- A conclusion only persists if it is written down when it is reached. Compression drops process, but a conclusion that lives only inside the process goes with it.
:::

## 1. One review task: more information, worse conclusions

Late in the corpus pipeline the main session had accumulated a lot: failure categories, scheduling policy, parser edge cases. A sub-task was dispatched to review 177 pending drafts. The instinct was natural — hand it the main flow's full context, "more information cannot hurt".

The symptom showed up in its verdicts: the pass rate came out noticeably low, with many entries sent back for re-extraction. Re-running is not cheap — at about 1.3 seconds per paper it means queuing again, and that quota was meant for the 30,031-paper extraction.

So a controlled comparison: the same sub-task, given only three things — entry, source excerpt, acceptance rule — and no scheduling history. The disagreements between the two runs clustered on one kind of entry: those that had failed during parsing but whose full text was intact. **Having seen the failure history, the sub-task treated uncertainty as evidence** and marked drafts that should have passed as pending. The conclusion reversed: more information is not better, more relevant information is; supply has to be layered, and unrelated history has to stay where it was.

## 2. The four layers

| Layer | Content | How often it changes | Where it lives |
| --- | --- | --- | --- |
| System rules | Role, output style, prohibitions | Rarely | Framework config / global rules file |
| Project rules | Constraints specific to this environment and repository | As the project evolves | Rules file in the project root |
| Task input | What to do now, acceptance criteria, boundaries | Every task | The dispatch itself |
| Session history | Trial and error, intermediate conclusions | Continuously growing | The session |

The point of layering: **the higher the layer, the more stable**. Stable information goes into files so it never has to be re-explained; temporary information stays in the session so it never pollutes the long-term rules.

## 3. Rules files: the environment's exceptions

A rules file holds environment constraints, not a project introduction:

```markdown
## Environment constraints
- No GPU dependencies on this machine; heavy compute goes remote, locally only scripts and tests
- Paths with spaces must be quoted on Windows (the same trap, twice)
- Before delivery: pytest -q, the UI walkthrough script, export hash comparison
```

The test is simple: **would this bite me again if it were not written down?** If yes, it goes in. The payoff is permanent — every session starts with the environment's manual loaded.

::: tip Best value for effort
Before a session ends, append the trap you just hit to the rules file. One line costs far less than rediscovering it later.
:::

## 4. Memory files: conclusions, not process

Rules record what the environment is like; memory records what was concluded:

- An approach ruled out, and why
- A parameter range that does not apply
- A decision and the context behind it, so nobody re-litigates it later

Kept only in a session, both vanish when the session or the machine changes. As files in the project directory, synchronised through a private repository, very little has to migrate when the framework changes: **the assets are in the files, not in the tool.**

```text
project/
├─ RULES.md     # environment: commands, paths, tool traps, pre-delivery checks
├─ MEMORY.md    # conclusions: rejected approaches, dead parameter ranges, context
├─ tasks.db     # state: pending / running / done / failed(reason)
└─ notes/       # stage conclusions and experiment records
```

## 5. A sub-task gets only what it needs

**One: supply on demand.** The dispatch lists three things — what to do, how it will be judged, where the output goes. Carrying the main flow's full history makes the sub-task trade off against constraints that are not its business; that is exactly how the review task above went wrong.

**Two: no shared mutable state.** Parallel sub-tasks should not edit the same files; if they must, serialise or isolate first. This causes more incidents than context length does.

## 6. Long sessions: externalise as you go

Long sessions get compressed or truncated, inevitably. The countermeasure is to **externalise conclusions as they form**: stage conclusions into the memory file, task state into the task table, key decisions into the rules file or project docs.

The principle: **never let knowledge that exists only inside a session become a critical dependency**. Sessions can be discarded; files cannot.

::: warning The trap to watch for
Compression usually drops the process description — but a conclusion that only exists inside that description disappears with it. Write conclusions down at the moment you reach them, with the evidence that supports them.
:::

## 7. Reusable checklist

- Keep four layers — system rules, project rules, task input, session history — and file each item by stability
- A rules file contains only constraints that would be stepped on again
- A memory file contains conclusions plus the context and evidence behind them
- Dispatches carry input, acceptance and output location, never the main flow's history
- Parallel sub-tasks never touch the same mutable state
- The moment a conclusion becomes reusable, it goes into a project file, not into the session
