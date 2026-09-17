# Long-running tasks: progress, budget and recovery

> Running an agent for hours is a different problem class from running it for thirty seconds. Long tasks rarely fail because the model is not clever enough — they fail because **something breaks halfway, the quota runs out, or the next morning shows the work went in the wrong direction.**

## 1. Progress belongs on disk

"1,200 items processed" inside a conversation means nothing: when the session dies, so does that state. Long tasks therefore maintain an **external state file** — which step, what completed, what failed, and why.

The benefit is not only resumption: it also makes progress **observable from outside** without digging through transcripts.

## 2. Resume rather than rerun

Resumption is simpler than it sounds if idempotency comes first. When every unit of work has a unique identifier (a content hash, for instance), re-running skips what is done and no checkpoint logic is needed. After a network drop, a restart or an exhausted quota, you start it again and it continues.

## 3. Budget and rate limits are part of the design

Two failure modes dominate: **rate limiting** (max concurrency queues everything and ends up slower than a modest setting) and **quota exhaustion** (a hard stop at the worst moment). The countermeasures are estimation with headroom, capped concurrency, splitting peak work across windows, and separating must-do from can-defer.

A mixed engine follows the same logic: local compute is not necessarily faster, but it is stable and unmetered.

## 4. Long tasks need a reporting rhythm

One rule applies to both myself and the agent: anything over a minute gets a time estimate before it starts, periodic progress while it runs, and a failure report that says which step failed and how much completed. The point is to avoid **running all night and finding nothing in the morning**.

## 5. Interruption is the normal path

When work spans devices, days and quota cycles, interruption is expected rather than exceptional. So the design assumes it: state outside the session, operations idempotent, results verifiable. Do those three and a long task becomes "something to finish over several attempts" rather than "something that must succeed in one go".

## Closing thought

Long tasks test the robustness of the process far more than the ceiling of the model. Removing the mistakes people make — forgetting where they were, duplicating work, judging completion by feel — is more effective than hoping for a smarter model.
