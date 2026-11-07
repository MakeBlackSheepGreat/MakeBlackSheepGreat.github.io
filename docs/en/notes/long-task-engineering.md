# Long-running tasks: progress, budget and recovery

> Running an agent for hours is a different problem class from running it for thirty seconds. Long tasks rarely fail because the model is not clever enough — they fail because something breaks halfway, the quota runs out, or the next morning shows the direction was wrong from the start.

::: info Short version
- Resumption depends not on checkpoints but on **idempotency**: removing the "how far along am I" state is cheaper than maintaining it;
- Progress belongs on disk; "12,000 items processed" inside a conversation expires the moment the session does;
- The concurrency cap is derived from **the server's limit**, not from how fast you want to go — maxing it out is a negative optimisation;
- Interruption is the normal path: state outside, operations idempotent, results verifiable, and a long task becomes "something to finish over several attempts".
:::

## 1. The real timeline of an 11.2-hour task

August 2026, the corpus pipeline: 30,031 papers, mixed local and cloud inference. It ran 11.2 hours, lost the network once, and resumed without anyone intervening.

| Time | What happened | Number observed |
| --- | --- | --- |
| 00:00 | Full batch enqueued, work starts | pending 30,031 |
| ~03:00 | Rate settles, per completed item | ~1.3 s per paper |
| ~05:00 | Network drops, process exits | a batch stuck in running |
| after the drop | Restarted directly, no "where do I resume" decision | re-running created no new rows |
| 11:12 | Wrap-up | 30,018 done (99.96%), failures classified |

The number worth remembering is not 11.2 hours but the fact that after the drop **nobody had to answer "how far did it get"** — the task table and the idempotency key answered it.

## 2. Progress on disk: the task table is the single source of truth

A long task needs external state: which step, what completed, what failed, and why.

```sql
CREATE TABLE tasks (
  hash       TEXT PRIMARY KEY,   -- content hash, also the idempotency key
  path       TEXT NOT NULL,
  status     TEXT NOT NULL,      -- pending | running | done | failed
  reason     TEXT,               -- failure category, not free text
  attempts   INTEGER DEFAULT 0,
  updated_at TEXT
);
```

The benefit is not only resumption: progress also becomes **observable from outside**, without digging through transcripts.

```bash
python -c "from db import stats; print(stats())"
# {'pending': 13, 'running': 0, 'done': 30018, 'failed': 12}
```

## 3. Idempotency is cheaper than checkpointing

Resumption is simpler than it sounds if idempotency comes first. Hash each file; skip what has been seen:

```python
h = content_hash(pdf_path)
if table.seen(h):
    return                      # re-running is inherently safe
table.enqueue(h, pdf_path)
```

That removes the fragile "how far along am I" state entirely: killed process, dropped network, restart — you just start it again, with no resume logic to reason about. My first version was designed around checkpoints, and the problem was that a checkpoint has to stay aligned with several processing stages; any drift either skips a batch or repeats one.

## 4. Budget and rate limits are part of the design

Two failure modes dominate: **rate limiting** (max concurrency queues everything and ends up slower than a modest setting) and **quota exhaustion** (a hard stop at the worst moment). Estimate first, with headroom:

```text
concurrency = min(server limit × 0.7, what local resources allow)
retries     = only for categories where retrying helps (rate limits); log the rest and skip
tiers       = must-do / can-defer, scheduled across quota windows
```

The mixed engine follows the same logic: local compute as the base, cloud for volume. **Local compute is not necessarily faster, but it is stable and unmetered**, so long tails and recovery batches go there and the quota is saved for work that genuinely needs cloud throughput.

::: warning The trap to watch for
Setting concurrency by "how fast I want this" will hit the limit almost every time. I maxed it out once: the API throttled, tasks waited on each other, retries burned quota, and total time went up. Derive the cap from the server's limit instead.
:::

## 5. Failure categories and reporting rhythm

Failures must be classified: "model returned malformed output" is worth retrying; "the file itself is corrupt" is not, ten thousand times over. Once separated, each of the last 0.04% can be explained at a glance.

The reporting rhythm is fixed as well: anything over a minute gets an estimate before it starts, periodic progress while it runs, and a failure report saying which step failed and how much completed. The point is to avoid **running all night and finding nothing in the morning**.

::: tip Best value for effort
Treat "failure reason" as a first-class field from version one. It costs almost nothing and turns the final cleanup from reading every case into handling categories.
:::

## 6. Reusable checklist

- Write state to an external file; never keep the only copy in a session
- Use a unique key such as a content hash for idempotency instead of checkpoint logic
- Derive the concurrency cap from the server limit, with about 30% headroom
- Classify failures by reason; retry only the categories where retrying helps
- Separate must-do from can-defer and schedule across quota windows
- For anything over a minute: estimate first, report progress periodically
