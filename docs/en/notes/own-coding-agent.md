# Building my own coding agent as a long-term project

> June–September 2026. The motivation was practical: off-the-shelf coding agents are good at being general, but the things I wanted — persistent memory, multi-agent workflows driven by smaller models, goal-driven long-running execution — were either missing or beyond my control.

::: info Short version
- Porting incrementally onto an open-source base beats rewriting;
- Design the client protocol around task semantics, not a general mobile design system;
- The value of a personal build is control: memory, workflow and execution defined by me.
:::

## Rebuilding, not rewriting from scratch

I started from an open-source coding agent and **ported only the incremental features I actually needed** (nine in the end), keeping the upstream structure otherwise. That keeps maintenance tractable: fewer conflicts when upstream moves, and it stays clear whether a bug is in my changes or in the base.

The three capability groups added:

- **Persistent memory**: conclusions and constraints survive across sessions instead of being re-explained each time
- **Multi-agent workflows**: division of labour designed for small and mid-sized models rather than frontier ones, so cheaper models can still finish tasks that need several reasoning steps
- **Goal-driven execution**: give it an objective and it decomposes, advances, and resumes after interruption

## Release and documentation

Published to npm with versioning and a changelog, plus a separate documentation site. The docs are not decoration: writing down *why* something is designed this way saves half the time the next time I have to change it.

## Client protocol design

For the Android client I designed an agent-bridge protocol: **21 requests and 18 events**. One rejection is worth recording — the first instinct was to adopt an existing mobile design system wholesale; I dropped that idea because terminal-style agent interaction (streaming output, long-task progress, session recovery) differs enough from ordinary mobile apps that borrowing the convention makes the important states harder to express.

## Two pieces of supporting infrastructure

**Model serving**: an out-of-tree vLLM plugin that registers a model family's implementation, Transformers configuration and tool-call parser without modifying the vLLM source tree — so framework upgrades do not require re-applying patches.

**A pocket entry point**: a Flutter Android app aggregating a set of self-hosted web services, so they are reachable from a phone without memorising a list of addresses.

## Closing thought

A coding agent is unusual software in that I use it to write other projects and to modify itself. That self-referential loop surfaces problems normally ignored: how memory should be stored, how an interrupted task resumes, and how multiple roles avoid stepping on each other — questions that do not get taken seriously while the agent is only a tool.
