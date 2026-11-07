# Falsify yourself first: the order of operations when a check fails

> During one site update in October 2026 the verification script reported three failures. Every one turned out to be a badly written assertion; not a single piece of content was wrong. This note records the order of operations used at the time, and why it is worth fixing in place.

::: info Short version
- When a check fails, **the first suspect is always the check itself**, not the thing being checked;
- The order is fixed: take the real text → compare it against the assertion character by character → only then decide which side to change. Skipping to "fix the content" breaks something that was already right;
- The same rule applies to live anomalies: when a batch of requests all fail, retry them one by one before declaring the service down;
- A failed check is a question, not a verdict. Treating it as a verdict produces the most expensive kind of rework: breaking content that was correct.
:::

## 1. Three real cases

One verification round reported three failures, each wrong in a different way.

**Case one: word order.** The assertion said "已完成的医学影像工作" ("completed medical imaging work"). The actual copy read "另两项工作已完成并支撑竞赛获奖" ("two further works are finished and back competition awards"). Same meaning, different order, and a string comparison fails.

**Case two: assertion on the wrong page.** "夺榜挂帅" appears only on the awards page, but I had written it into the experiences-page assertion. The word was never on that page, so the assertion could never pass.

**Case three: letter case.** The English page reads "Research swarm system" with a capital R; the assertion was all lowercase. The visible text a browser returns preserves the original casing, so the comparison fails.

The common factor: **all the content was correct, and all the assertions were wrong.** Had the first reaction been "the content is wrong", going back to rewrite the copy would have broken three passages that were already right — and then they would have had to be changed back.

## 2. The order of operations

When a failure appears, walk this order and do not skip steps:

| Step | Action | Purpose |
| --- | --- | --- |
| 1 | Take the real text from the build artifact | Get the exact shape of the thing being checked, not a memory of it |
| 2 | Compare it against the assertion character by character | Locate which character differs |
| 3 | The difference is in the assertion → fix the assertion | The check is wrong; fix the check |
| 4 | The difference is in the content → fix the content | It really is wrong; fix the content |
| 5 | Neither side is clear → stop and ask | There is a premise nobody has established |

The key action is the first one: **take it from the artifact, not from memory.** The copy in your head and the copy on disk regularly differ by a few characters, and those characters are exactly the cause of the failure. Extract the text with a precise pattern and slice, rather than pulling the whole document and scanning by eye — the same word appears many times in a long text, and you will look at the wrong occurrence.

## 3. The same rule applies to live anomalies

The order is not only for assertions. That round also produced a case where four consecutive live-page requests all failed and no temp file was created, which looked exactly like "the site is down".

Retrying one at a time, the first succeeded immediately and the other three followed. The real cause was connection-level failures from rapid consecutive requests, unrelated to the service.

Distinguishing two classes of signal matters:

- **Nothing landed locally**: the temp file does not exist, so subsequent reads and counts error out in a chain. That class of error means local writing failed, not that the remote did not respond;
- **The remote genuinely did not respond**: the file was created, but its contents are an error page or empty.

When a batch fails, first establish which class it is before deciding whether to raise an alarm. **Reporting a local failure as a live outage damages credibility more than missing one real outage.**

## 4. When not to fix the assertion

This rule has boundaries; not every failure belongs to the assertion.

- The assertion states a clear agreement ("this old copy must be gone") and the page still has it → the content is wrong;
- The assertion states an agreement that has itself changed → confirm the new agreement first, then change the assertion;
- The assertion and the content disagree and both look defensible → stop and ask, rather than changing whichever is more convenient.

The criterion is one sentence: **is this change based on text from the artifact, or on my memory?** Any change based on memory goes back to the artifact first.

## 5. Checklist

- When a check fails, the first suspect is the check itself;
- Order: take real text → compare character by character → fix the assertion or the content → stop when unclear;
- Take text from the build artifact, never from memory;
- When a batch of live requests fails, retry one by one before declaring a service fault;
- Separate "nothing landed locally" from "the remote did not respond";
- Any change based on memory goes back to the artifact first.
