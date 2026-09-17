# Multi-agent division of labour: roles, parallelism and acceptance

> Should one agent do the whole job, or several? I have run both for long stretches this year, and the conclusion is that **the value of splitting is not parallelism — it is making sure the one proposing a solution is not the one verifying it.**

## How roles are split

Three roles, in practice:

| Role | Only does | Explicitly does not |
| --- | --- | --- |
| Explore | Read-only inspection, conclusions with evidence | Change any file |
| Implement | Make agreed changes within scope | Verify its own work |
| Review | Hunt for problems against a checklist | **Change any code** |

The critical one is "the reviewer must not change code". The moment it can, it tends to fix problems in place — and the "finding problems" stage disappears, leaving just another implementer.

## Parallelism has a ceiling

I once dispatched more than a dozen sub-tasks at once: rate limits, everything waiting on everything else, retries burning the quota, and a longer wall-clock time than before. Three rules came out of it:

1. **Cache before parallelising** — results land on disk first, so re-runs cost almost nothing
2. **Cap concurrency** — derive the cap from the rate limit, not from how fast you would like to go
3. **Classify failures before retrying** — "retry helps" (rate limit) and "retry is useless" (malformed input) are different problems

## Acceptance criteria must be machine-checkable

"Check whether there are problems" is not a requirement. Usable criteria look like: all tests pass with a count of passing tests; every clickable element has actually been clicked with counts of total and failed clicks; exported images must be rendered and looked at rather than confirmed to exist.

That last one is the most frequently skipped: **a file existing, being valid and having the right word count does not mean the deliverable is correct.**

## Sub-tasks must be able to declare themselves done

Every sub-task needs its own definition of done, otherwise the main flow cannot tell whether to wait or collect. For long tasks my bar is: progress on disk, a defined artifact, and a timeout/retry policy — all three before dispatch.

## Closing thought

The point of multi-agent work is not speed; it is **removing verification from the centre of human attention**. A person then checks conclusions at key points instead of watching every step.
