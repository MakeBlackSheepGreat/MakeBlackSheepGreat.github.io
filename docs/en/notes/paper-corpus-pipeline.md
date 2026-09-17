# Ingesting 30,000 papers: one 11-hour pipeline

> August 2026. The goal was modest: make literature search return its sources. The result ran 11.2 hours over 30,031 papers with a 99.96% completion rate. The hard part was never the model — it was keeping a pipeline correct across tens of thousands of repetitions.

::: info Short version
- Three things kept the long run alive: **content-hash idempotency, a task table driving resumption, and failures classified by cause**;
- The mixed engine (local compute as the floor, cloud for volume) was not about speed but about **not being blocked by a single resource**;
- Extracted content is not usable as a conclusion, so every entry carries **evidence links back to the source**.
:::

## 1. What ran

| Metric | Value |
| --- | --- |
| Papers | 30,031 |
| Completed | 30,018 (99.96%) |
| Wall clock | 11.2 hours (about 2.5 s per paper) |
| Knowledge entries | 102 published |
| Evidence links | 18,125 |
| Pending review | 177 drafts, promoted after human check |
| Failures | one network drop, resumed automatically |

## 2. Pipeline shape

```text
PDF directory
  │
  ├─ ① parse & chunk ──→ local cache (records content hash)
  │
  ├─ ② task table ─────→ pending / running / done / failed(reason)
  │                       ↑ single source of truth, read on restart
  ├─ ③ inference ──────┬─ local GPU (short, well-structured papers)
  │                    └─ cloud (long papers, salvage batches)
  │
  └─ ④ store ──────────→ entries + evidence links + review queue
```

Only step ③ involves anything intelligent; the other three are ordinary engineering.

## 3. Three key decisions

**1. Idempotency comes from a content hash, not from checkpoints.**

```python
h = content_hash(pdf_path)
if table.seen(h):
    return                      # re-running is inherently safe
table.enqueue(h, pdf_path)
```

Re-runs then cost almost nothing, and there is no fragile "how far did I get" state to maintain.

**2. The task table is the only source of truth.** Each paper's state lives in it, so killing and restarting the process just resumes. Over eleven hours the network dropped once; it picked up and finished.

**3. Failures need categories.** "Model returned malformed output" benefits from a retry; "the file is corrupt" will fail ten thousand times. Once separated, every one of the final 0.04% could be diagnosed at a glance.

::: tip Best value for effort
Treat "why it failed" as a first-class field from version one. It costs almost nothing and turns the last 0.04% from a per-file investigation into a per-category one.
:::

## 4. Three pitfalls

**1. Opening concurrency before fixing quality.** I started at maximum concurrency, which overwhelmed the model service and left everything queueing on timeouts. Caching first and letting the service consume at a steady rate was faster overall.

::: warning Worth noting
Set the concurrency cap by working backwards from the **service limit**, not from how fast you would like to go. This shows up most clearly with cloud APIs.
:::

**2. "Fastest wins" is the wrong rule for a mixed engine.** The local GPU has limited throughput; cloud calls are fast but billed per item. The working split was by paper characteristics (short local, long cloud), not by idleness.

**3. Entries still need a human floor.** Extracted content cannot stand as a conclusion: part of it goes to a pending-review queue and is promoted only after human checking. Automation raises throughput; **what a person should look at still gets looked at.**

## 5. If I ran it again

- Classify failure reasons from version one
- Use content hashing for idempotency from version one
- Verify end-to-end quality on a single paper before opening concurrency — quality problems are batch problems, and they get more expensive the later you notice
