# Verification at the render level: assertions, screenshots and byte comparison

> Fixed in place while maintaining a bilingual site between September and October 2026. That round touched a dozen pages and every file-attribute check passed, yet I still could not say the changes were right — the same checks had missed a rendering problem in an earlier round. This note covers the three-layer verification that came out of it.

::: info Short version
- File-attribute checks only prove the file is right, never that the page is right: a keyword in the HTML source does not mean it rendered;
- Verification runs in three layers: **take text from the build artifact → assert at the render level → compare bytes against the live site**. If a lower layer fails, the next one is meaningless;
- **A successful pipeline is not a successful deploy**. Final verification fetches the live page, and the criterion is that live bytes equal local artifact bytes;
- Assertions must state what should be gone. Asserting only "contains" misses the most expensive class of error: what should have been deleted but was not.
:::

## 1. Why file attributes are not enough

On a static site the body is often injected by frontend script. Fetching the page from the command line returns a shell of a few hundred bytes with none of the content in it. Counting keywords there counts the template, not the content.

There is a subtler variant: the word really is in the source, but the selector is wrong, so the browser never renders the element. File checks are completely blind to that.

One concrete case: a custom container is written as `card` in the source, but the rendered CSS class is `entry`. Waiting on `.card` times out forever; waiting on `.entry` resolves immediately. **A verification selector must be derived from the render result, never inferred from the source syntax.**

## 2. Three layers

| Layer | Means | Finds | Cannot find |
| --- | --- | --- | --- |
| Build artifact | Take real text out of the artifact | Content missing from the build, truncated copy | Rendering and live problems |
| Render-level assertions | Open the page in a headless browser, assert on visible text | Unrendered elements, stale copy left behind, layout overflow, script errors | Whether the business logic is right |
| Live byte comparison | Fetch the live page and compare bytes with the local artifact | Not deployed, stale deploy, CDN cache drift | Content quality |

The first layer is cheapest, so run it first. The third is closest to what a user sees, so run it last. Reversing the order wastes effort: render-level assertions run against a stale artifact pass or fail for no reason.

## 3. How to write assertions that do not miss

A usable assertion set covers five directions; miss one and a class of error slips through.

| Direction | How | Catches |
| --- | --- | --- |
| Must appear | Assert each new keyword | The change did not take effect |
| Must disappear | Assert each old phrase is absent | Stale copy left in, old and new mixed |
| Section ownership | Slice the text under a heading, then assert | Content landed in the wrong block |
| Structural completeness | Card counts, list item counts | One item failed to render |
| Runtime health | Horizontal overflow, page-level script errors | Broken styling, dead interactions |

Two lessons. **Assertions must be countable**: the run reports "88 passed, 0 failed", not "checks passed". An uncountable verdict cannot be reconciled or reused next round. **Section-scoped assertions matter more than whole-page ones**: the same sentence can appear in both an "awarded" and an "entered" section; finding it in the page does not mean it sits in the right place.

Keep a full-page screenshot every round as well. The screenshot is for a human to look at before the next change, and it is the evidence for acceptance.

## 4. Deploy verification: a green pipeline is not the finish line

Even after both publish pipelines report success, fetch the live pages yourself. Pipelines have gone green while the site still served the old build — caching, a reused build directory, a misconfigured branch.

The criterion is hard: **live bytes equal the bytes of the corresponding local artifact**. Equal bytes means the deploy is almost certainly clean; unequal means dig in item by item.

Two traps when fetching from the command line. First, a compressed response makes the download-size counter report zero unless compression is explicitly declined. Second, a batch of rapid requests can fail at the connection level, which looks exactly like "the site is down"; retrying one at a time usually succeeds. **Retry a failing batch before drawing a conclusion.**

## 5. Checklist

- Three layers: artifact text, render assertions, live byte comparison — in that order;
- Assertions cover must-appear, must-disappear, section ownership, structural counts and runtime health;
- Assertion results must report countable pass and fail totals;
- Derive selectors from the render result, not from source syntax;
- Keep a full-page screenshot each round as the basis for the next change;
- After a green pipeline, still fetch the live page and judge by byte count;
- Decline compression when fetching live pages, and retry failures one by one before judging.
