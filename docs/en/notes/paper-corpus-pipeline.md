# Ingesting 30,000 papers into a knowledge base

> August 2026. The goal: turn just over thirty thousand papers into searchable, traceable knowledge entries, rather than a pile of PDFs on a disk.

## Where the problem actually was

The first version was obvious: loop over the PDFs, feed each one to a model, store the summary. Around the few-hundred mark everything broke. An interrupted run had to start over. Re-processing a file wrote duplicate entries. A model returning malformed output poisoned the batch. The hard part was never calling the model — it was keeping a pipeline correct across tens of thousands of repetitions.

## The decisions that mattered

**Tiered concurrency, cache before parallelise.** Each file gets a content hash first and is skipped if it has been done. Re-runs then cost almost nothing, and duplicate writes disappear by construction. Concurrency does not go to maximum immediately: parsing results land in a local cache first, and the inference service consumes at a steady rate. Blow up the model server once and everything behind it just waits for timeouts.

**A mixed inference engine.** The local GPU can run a 4B-class model, but throughput is limited; cloud calls are faster per paper but billed per call. The split that worked: local handles most short, well-structured papers, cloud handles long papers and salvage batches for parse failures, and both write into one task table where whichever finishes first commits the result.

**The task table is the only source of truth.** Every paper's state (pending / running / done / failed-retry) lives in the table, so killing and restarting the process just resumes — no special "checkpoint resume" logic needed. Over the eleven hours the network dropped once; it picked up and finished on its own.

**Failures need categories.** "Model returned malformed output" and "the file itself is corrupt" are different problems: the first benefits from a retry, the second will fail ten thousand times. Recording them separately meant the final 0.04% could each be diagnosed at a glance.

## Result and cost

30,018 of 30,031 papers completed — 99.96% — in 11.2 hours, about 2.5 seconds per paper.

The cost: extracted content is not usable as a conclusion on its own. So every knowledge entry carries links back to the source (over eighteen thousand of them), and anything the model was unsure about goes into a separate "draft pending review" queue to be promoted by a human. Automation raises throughput; the parts a person should look at still get looked at by a person.

## If I did it again

- Treat "why it failed" as a first-class field from version one
- Use content hashing for idempotency from the start, not after finding duplicates
- Verify end-to-end quality on a single paper before opening up concurrency — quality problems are batch problems, and they get more expensive the later you notice
