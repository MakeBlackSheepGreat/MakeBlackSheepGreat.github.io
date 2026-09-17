# Building my own coding agent as a long-term project

> June–September 2026. The motivation was practical: off-the-shelf coding agents are good at being general, but the things I wanted — persistent memory, multi-agent workflows driven by small and mid-sized models, goal-driven long-running execution — were either missing or beyond my control.

::: info Short version
- Writing from scratch is the long way round: the time goes not into the core loop but into file editing, command execution and context compaction — all rebuilt by hand;
- What worked was **incremental modification**: porting only the nine features actually needed onto an open-source base, which keeps upstream upgrades cheap to merge;
- The client protocol is designed around **task semantics**: the mobile side defines 21 requests and 18 events in agent-bridge rather than borrowing a general mobile design system.
:::

## 1. Two weeks of writing from scratch, then a change of mind

The starting point was concrete: I wanted a coding agent that could run long tasks on its own and remember the conclusions. The first instinct was a rewrite — full control only comes from owning every line.

Two weeks in, the state of things was unimpressive. Nearly all the time had gone into base functionality: multi-file patching and conflict handling, command execution and timeouts, context compaction, retry logic. Every piece ran, none was as steady as a mature implementation, and the parts I actually cared about — memory, goal-driven execution — had not been started.

The turn came from swapping one criterion for another. Instead of "did I write it", the question became "**can the behaviour I want be added without forking upstream**". The answer was yes, so the plan became incremental modification.

## 2. Nine features, and what got dropped

The wanted features were written down as a list, then filtered to those upstream genuinely lacked and that had been needed at least three times. Nine survived; everything else stayed upstream-shaped. The added capability falls into three groups:

- **Persistent memory**: conclusions and constraints survive across sessions instead of being re-explained every time;
- **Multi-agent workflows**: division of labour designed for small and mid-sized models, so cheaper models can still finish tasks needing several reasoning steps;
- **Goal-driven execution**: give it an objective and it decomposes, advances, and resumes after interruption.

Memory entries land in files, sharded per project, in a shape that diffs cleanly:

```json
{
  "scope": "project:site",
  "key": "docs-build",
  "value": "run a build after any sidebar change; body-only edits can skip it",
  "source": "session-2026-07-14",
  "created_at": "2026-07-14T21:03:00+08:00"
}
```

Writes happen at exactly three moments: task close-out, failure branches, and human corrections. The payoff is maintainability — on upgrade, conflicts concentrate in the nine custom features, and it stays clear whether a bug is mine or the base's.

## 3. Client protocol: why the off-the-shelf mobile design system was rejected

The mobile client speaks a protocol called agent-bridge: **21 requests and 18 events**. One rejection during design is worth recording. The first plan was to adopt an existing mobile design system wholesale; it was dropped halfway through implementation.

The reason was visible on screen. Terminal-style agent interaction is streaming output, long tasks, interruption and resumption, whereas an ordinary mobile app's state model compresses "streaming but no longer receiving", "interrupted but resumable" and "restored with truncated history" into the same loading shell. The UI showed no difference between them, so the user could only guess.

The fix was to put the **state machine into the protocol** and leave the client to render it:

| Category | Count | Coverage |
| --- | --- | --- |
| Requests | 21 | create session, dispatch task, read/write files, query memory, approve an action, and so on |
| Events | 18 | streaming output, task progress, interruption, resumption, error, quota notices, and so on |

Defining "interrupted" and "failed" as separate events was the single most useful decision here: an interruption is a normal, resumable state, while a failure is the one that needs a person.

## 4. Release and documentation

The project is published to npm with versioning and a changelog, plus a separate documentation site (VitePress, bilingual, deployed along two paths — primary site and mirror). The docs are not decoration: writing down *why* something is designed this way saves half the time the next time it has to change.

## 5. Two pieces of infrastructure that came along

**Model serving**: an out-of-tree vLLM plugin that registers a model family's implementation, its Transformers configuration and a tool-call parser without modifying the upstream source tree. The reason to write a plugin rather than a patch is practical: patches are guaranteed to conflict on upgrade, while a plugin uses interfaces the framework promises to keep.

**A pocket entry point**: a Flutter Android app aggregating a set of self-hosted web services, so they are reachable from a phone without memorising addresses and ports.

::: tip Best value for effort
Tag a baseline before starting to modify, and keep custom changes distinguishable from upstream code in the commit history. During self-hosted development — using the agent to modify itself — that is the only way back.
:::

::: warning Worth noting
"Port only what is used" is what keeps the maintenance surface small. The longer the list, the more conflicts on the next upstream upgrade; every added item should come with who uses it and how often.
:::

## 6. Reusable checklist

- Ask first whether upstream can host the change; if it can, modify incrementally instead of forking;
- Filter the feature list by usage count, not by how useful it sounds;
- Keep memory as files, sharded per project, written at fixed moments, readable and diffable;
- Define protocol states by task semantics — especially keeping interruption separate from failure — rather than borrowing a general UI convention;
- Do release and documentation together: version numbers, changelog, a dedicated docs site;
- Before any self-referential change, tag a baseline and keep a way back.
