# Running a team of agents

> I often have several coding agents working at once: one investigating the code, one making changes, one whose only job is to find problems, and a few more running unrelated experiments. Half a year of this has produced a few lessons paid for with failures.

## Split the roles — and make sure they are not the same brain

Give everything to a single agent and it oscillates between implementing and reviewing: naturally, it tends to think its own code is fine. Separated, it becomes simple — the explorer does read-only inspection and reports conclusions; the implementer does not verify; the reviewer works from a checklist, hunts for problems, and is explicitly told **not to change any code**.

The real value of role separation is not parallelism. It is that the one proposing a solution is not the one verifying it.

## Long tasks must be resumable

For anything over an hour, I insist on three things:

1. **Progress on disk** — what step it is on, what finished, what failed, written to a file rather than living only in the conversation
2. **A time estimate up front** — anything over a minute needs a rough duration before it starts
3. **Resume after interruption** — restarting picks up where it stopped

These sound obvious, but missing any one of them turns a long task into "ran all night, found nothing in the morning".

## Acceptance criteria must be machine-checkable

"Make it look better" or "check for problems" are not requirements. Effective criteria look like this:

- All tests pass, with the count of passing tests reported
- Every clickable element on every page has actually been clicked, with total and failure counts reported
- Exported images must be rendered and looked at, not merely confirmed to exist

The last one matters most: a file existing, XML being valid and the word count matching do not mean the deliverable is correct. **Anything a script can check goes to a script; only what requires human judgement (layout, tone, whether it suits the scenario) goes to a person — but then it must actually be looked at.**

## Memory belongs in files, not in conversations

When the same trap catches you twice, the problem is not capability — it is process. So each project keeps a rules file recording what is unusual about that environment: which command is unavailable, which path needs escaping, which tools are broken on this machine.

Written once, every later session benefits. Not written, and you step on it again every time.

## Do not max out concurrency

I once dispatched more than a dozen sub-tasks at once. The result: rate limits, everything waiting on everything else, and retries burning through the quota. The fix was to cache results first, cap concurrency, and queue failures separately for retry — total wall-clock time went down.

## One line summary

Manage agents like a group of capable interns who need precise instructions: describe tasks concretely, make acceptance criteria verifiable, keep progress visible, and write your scars into the process. Do that, and one person really can push a lot of things forward at once.
