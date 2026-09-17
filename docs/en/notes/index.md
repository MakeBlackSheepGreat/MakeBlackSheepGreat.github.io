# Notes

Records of problem diagnosis and design trade-offs from real projects, plus the working methods that emerged from long-term use of agents. Detailed enough to reproduce, with no private information involved.

## 1. Working with agents

Methods that came out of half a year of daily use, independent of any particular framework.

- [Four agent frameworks in half a year: what the data says](/en/notes/agent-frameworks-retrospective) — checking my own judgements against the records: what actually triggered migrations, the session counts that mislead, and the three assets that survive every move: rules, memory and the habit of verifying
- [Decomposing a problem into tasks an agent can execute](/en/notes/task-decomposition) — four levels, three questions before splitting, granularity and serial/parallel rules, and three common decomposition errors
- [Engineering skills in the agent era](/en/notes/skills-in-agent-era) — one practical test, seven abilities gaining value, and a checklist for the "mecha pilot"
- [Context management: what to feed an agent](/en/notes/context-management) — four layers, what belongs in rules versus memory files, clean sub-task context, externalising conclusions
- [Multi-agent division of labour](/en/notes/multi-agent-roles) — why splitting is about separating proposal from verification; concurrency caps, failure classes and checkable acceptance criteria
- [Long-running tasks: progress, budget and recovery](/en/notes/long-task-engineering) — state on disk, idempotent resumption, quota estimation, and treating interruption as the normal path
- [Memory and rules: turning mistakes into process](/en/notes/memory-and-rules) — per-project rules files, cross-session memory, a requirements ledger, and the test "will this take effect on its own next time?"
- [Collaboration and delivery](/en/notes/collaboration-and-delivery) — declaring review versus edit mode, writing executable requirements, and never shipping an artifact nobody has looked at
- [Choosing and switching agent frameworks](/en/notes/agent-tool-selection) — evaluation dimensions, when to switch and when not to, when to build your own, and why the real assets are not in the framework

## 2. Extending capability and building tools

- [Giving an agent capabilities: MCP services and plugins](/en/notes/agent-capability-plugins) — domain knowledge as an MCP service, capability and state as plugins, and adding capability without removing the fallback
- [Building my own coding agent](/en/notes/own-coding-agent) — incremental changes on an open-source base, release and documentation, client protocol design, plus model serving and a pocket entry point
- [WeftMesh: every device is a complete agent](/en/notes/weftmesh-device-mesh) — star topology, device protocol, permission boundaries and reconnection
- [Multi-agent hardware design](/en/notes/pcb-multi-agent-pipeline) — staged flow, skill modules, hard checkpoints, and why parallelism buys little in hardware

## 3. Engineering practice

- [Ingesting 30,000 papers into a knowledge base](/en/notes/paper-corpus-pipeline) — idempotency, task-table resumption, mixed inference scheduling and an evidence trail
- [Turning a research workflow into callable tooling](/en/notes/research-workflow-suite) — module boundaries, deterministic work to scripts, criteria fixed in advance
- [Publishing an agent service to the internet](/en/notes/agent-service-public) — session secret lifetime, cookie scope, reverse proxying and process supervision
- [Shipping medical software on a disc](/en/notes/medical-software-delivery) — dual hardware builds, full-interface regression, clean-machine verification
- [First time writing at the operator level](/en/notes/chip-operator-practice) — explicit address spaces, tiling and data reuse, per-type branching

## 4. Research notes

- [Negative results count too](/en/notes/negative-results) — an ablation that dropped accuracy from 77.23% to 56.78%, and what pre-registered criteria are for
