# Notes

Records of problem diagnosis and design trade-offs from actual projects. Detailed enough to reproduce, with no private information involved.

## All notes

### [Ingesting 30,000 papers into a knowledge base](/en/notes/paper-corpus-pipeline)

Design record of a corpus ingestion pipeline: mixed local/cloud inference scheduling, idempotency, resumable execution and an evidence trail.

### [Publishing an agent service to the internet](/en/notes/agent-service-public)

Diagnosing a self-hosted service published to the internet: session secret lifetime, cookie scope, reverse proxying and process supervision, and why an SSH tunnel was not used.

### [Negative results count too](/en/notes/negative-results)

An ablation that dropped accuracy from 77.23% to 56.78%: how the failure was recorded and why a pre-registered threshold must not be moved.

### [Running a team of agents](/en/notes/agent-orchestration)

Running multiple sub-agents in parallel: role separation, recoverable long-running tasks, and verifiable acceptance criteria.

### [Shipping medical software on a disc](/en/notes/medical-software-delivery)

Engineering constraints of offline delivery: hardware fallback builds, full-interface regression and clean-machine verification.
