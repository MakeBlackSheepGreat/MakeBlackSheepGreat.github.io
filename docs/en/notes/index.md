# Notes

Field notes from things I have actually built. Concrete enough to reproduce, with no private details involved.

## All notes

### [Ingesting 30,000 papers into a knowledge base](/en/notes/paper-corpus-pipeline)

An 11-hour ingestion pipeline: 30k papers, a mixed local/cloud inference setup, self-healing after network drops and an evidence trail. The design decisions that actually decided whether it worked.

### [Publishing an agent service to the internet](/en/notes/agent-service-public)

What went wrong when a self-hosted service went public: process-scoped secrets, cookies that silently expire on restart, reverse proxies and process supervision — and why I did not use an SSH tunnel.

### [Negative results count too](/en/notes/negative-results)

A module I designed dropped accuracy from 77.23% to 56.78% and the training collapsed. How the failure was recorded, and why a pre-registered threshold must not be moved afterwards.

### [Running a team of agents](/en/notes/agent-orchestration)

Practising what I preach with several sub-agents at once: how to split roles, how to make long tasks recoverable, and how to write acceptance criteria an agent cannot talk its way around.

### [Shipping medical software on a disc](/en/notes/medical-software-delivery)

Going from "it runs on my laptop" to "it runs on a stranger's machine, offline, from a disc" — hardware fallbacks, full interface regression, and verifying on a clean machine.
