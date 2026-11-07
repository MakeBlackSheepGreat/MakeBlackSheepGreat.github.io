# Ingesting 30,000 papers: one 11-hour pipeline

> August 2026. The goal was modest: make literature search return its sources. It ran for 11.2 hours over 30,031 papers at a 99.96% completion rate. The hard part was never the model — it was keeping a pipeline correct across tens of thousands of repetitions.

::: info Short version
- The counter-intuitive one: **maximum concurrency was slower**. The first version opened the throttle, overwhelmed the upstream model service, and spent the rest of the run waiting on timeouts. Deriving the cap from the service limit cut total wall clock;
- Idempotency should not come from "how far did I get" but from a **content hash** — hash first, skip what has been seen, re-runs are inherently safe;
- **Record why it failed alongside that it failed.** The last 0.04% was expensive to diagnose only because version one stored `failed` and nothing else.
:::

## 1. What this had to solve

The usual failure of literature search is an answer that reads well but cannot be traced. The task was concrete: walk a local PDF directory, extract searchable content into knowledge entries, and make every entry point back to a specific place in the original — not "this paper says so" but "this sentence is in that section".

The directory held 30,031 papers. The estimate before starting: at a few seconds per paper, this was a ten-hour run, so the design assumption had to be "it will be interrupted", not "it will finish in one go".

## 2. Pitfall one: full concurrency made it slower

The first version wired parsing, chunking, inference and storage into one line and opened concurrency as wide as possible. The first twenty minutes were fast, then it degraded: logs filled with timeouts and retries, and upstream response times went from hundreds of milliseconds to double-digit seconds.

The cause was mundane. I had sized concurrency by what the local machine could push, but upstream has its own rate limiting and queueing. Requests beyond its capacity simply waited for a timeout, and my retry logic sent them again, amplifying the load.

The fix was to work backwards: measure the upstream service's sustainable rate (about 1.3 s per paper, which is also where the observed throughput comes from), keep concurrency under it, and let the local machine only cache and write results. Latency per paper stabilised and total time went down.

::: warning Worth noting
Size the concurrency cap from the **service limit**, not from how fast you want to go. What the local script can push and what the upstream can absorb are different numbers, and the difference shows up as timeouts.
:::

## 3. Pitfall two: a single failure state

99.96% finished; 0.04% remained. That should have been the end of it, but cleanup took real time — the first task table had exactly one `failed` state.

There were at least two kinds of failure: **the model returned malformed output** (one retry usually fixes it) and **the file itself is broken** (ten thousand retries will not). Mixed together, retry policy cannot be layered: retry everything and you burn quota, retry nothing and you lose the batch that would have succeeded. Version two split the reasons apart, and every remaining item could then be classified at a glance.

::: tip Best value for effort
Make "why it failed" a first-class field from version one. One column replaces hours of per-file investigation.
:::

## 4. Version two: task table plus content hash

Re-run cost also had to drop, because interruption is normal — the network dropped once during those eleven hours. State moved out to a table:

```text
tasks.db
  paper_id | status | reason | updated_at
  ---------|--------|--------|-----------
  ...      | pending / running / done / failed(reason)
```

A restart makes no "resume" decision at all: it reads the table and continues. Idempotency comes from the content hash, independent of progress:

```python
h = content_hash(pdf_path)
if table.seen(h):
    return                      # re-running is inherently safe
table.enqueue(h, pdf_path)
```

Together these turn re-running from a delicate operation into a free one: after the drop it carried on by itself, with no manual intervention.

## 5. A mixed engine needs division of labour, not "fastest wins"

Inference used two resources: a local GPU for small models, cloud capacity for long papers and salvage batches. The first scheduling rule was "whoever is idle takes it", which sent long papers to the throughput-limited local card and short text to a per-item billed cloud endpoint — bad on both sides.

Splitting by paper characteristics fixed it: short, well-structured papers locally, long papers and failed parses to the cloud. **The value of a mixed engine is not speed, it is not being pinned by a single resource** — when the local queue backs up, work moves out; when the cloud rate-limits, the local card keeps going.

## 6. Result

| Metric | Value |
| --- | --- |
| Papers | 30,031 |
| Completed | 30,018 (99.96%) |
| Wall clock | 11.2 hours (about 1.3 s per paper) |
| Knowledge entries | 102 published |
| Evidence links | 18,125 |
| Pending review | 177 drafts |
| Failures | one network drop, resumed automatically |

One deliberate constraint: extracted content is not a conclusion. Part of it (177 items) went into a review queue and was promoted only after human checking. Automation raises throughput, but **what a person should look at still gets looked at**.

## 7. Reusable checklist

- Idempotency by content hash, not by a "how far did I get" cursor;
- The task table is the only source of truth; on restart, read it and continue;
- Failure state and failure reason are separate fields from version one;
- Derive the concurrency cap from the service limit, not local capacity;
- Split mixed inference by task characteristics, not by idleness;
- Verify end-to-end quality on one item before opening concurrency — quality problems come in batches, and the later you notice, the more they cost.
