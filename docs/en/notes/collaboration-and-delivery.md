# Collaboration and delivery: state the mode, check the artifact

> Output quality when working with an agent comes down to two things: **whether the requirement is specific enough to be judged** and **whether the acceptance step is hard enough**. Neither depends on model capability, and together they decide most of the outcome.

::: info Short version
- The two levers that actually work: **phrase requirements so they can be judged** (scope, threshold, artifact shape) and **render the deliverable before discussing revisions**;
- Counter-intuitive: a fully green check script usually means a false pass — it inspects file properties, not the rendered result;
- Without a declared mode, the agent reviews and edits in the same pass, and afterwards nobody can tell the original problems from the ones it introduced.
:::

## 1. A rework that passed every check

August 2026, a report to submit: one written document and one slide deck. The generation pipeline ran without errors, and the acceptance script checked page count, word count, file size and the presence of every required section — **all green**.

Opening it at the venue showed something else: the title on slide three overflowed its line and the right half was clipped; a table broke across a page boundary so the second page held nothing but a header row; the body font did not exist on the target machine, fell back to a default, and dragged the line spacing with it.

The script caught none of the three, because it inspects **file properties, not rendered output**:

| Acceptance step | Cost | What it can actually catch |
| --- | --- | --- |
| Page count, word count, file size | seconds | missing content, over-length sections |
| Parsing the file for unreplaced template variables | seconds | placeholders, empty sections |
| Exporting every page as an image and looking at it | minutes | overflow, clipping, broken tables, font fallback |

Only the third row catches a broken layout, and it is the row most likely to be skipped, because it requires a person to actually look. The rule that came out of it is blunt: **render the artifact into a form a person can see before discussing revisions** — decks export every page, sites export full-page screenshots, charts export as images.

::: warning Worth noting
"Every file-property check passed" is the easiest way to manufacture a false pass. It is cheap, so it tends to be mistaken for the whole of acceptance — yet correct page count, word count and file size can still ship something unusable.
:::

## 2. Without a declared mode, changes blur

The same delivery had a subtler cause. The agent had been asked to "take a look at this project and tell me if there are problems" — phrased as a review, executed as a review plus edits: it read the files, changed six modules along the way, and produced a list of what it had changed. Original problems and newly introduced edits were mixed into one diff, so there was nothing to roll back to and the comparison had to be done by hand.

The fault was not its judgement but the missing declaration of **which mode it was in**:

- **Review mode**: read and analyse only, output a problem list with evidence, and state explicitly that no file will be modified;
- **Edit mode**: change within the agreed scope, each change tied to a confirmed problem number.

Both sentences now go into the first paragraph of a task, together with hard scope limits, for example "only files under `docs/`; do not touch build configuration or dependency manifests". Two sentences of cost against a full round of rework.

## 3. Make the requirement judgeable

| Vague | Judgeable |
| --- | --- |
| Optimise this for me | Cut the landing page from three sections to two and fit it in one screen (no scrollbar at 1440×900) |
| Check for problems | Check every external link page by page; list the dead ones with status codes |
| Make it look better | Apply this spacing and palette, then export a screenshot for me to confirm |
| Polish it a bit more | Add failure-cause classification and verify on three known-bad samples that it no longer aborts |

The right column shares one property: **completion can be judged by someone else, reproducibly**. If that sentence cannot be written, the requirement itself is usually not thought through — and dispatching it will most likely come back as rework.

## 4. Do not spend human attention on machine checks

Conversely, mechanical checks should not consume human attention. The interface delivery for a medical imaging application is the positive example of this rule: automation drove the real desktop application across the whole UI, auditing clickable elements as it went — **13 pages, 265 clickable elements audited, 192 clicks executed, zero failures**. Those numbers are worth more than "the UI was checked", because they are reproducible, reconcilable, and can be written into the delivery note.

```bash
# Fixed pre-delivery actions: reproducible mechanical checks
python -m audit.ui_walk --app build/app.exe --report out/ui-walk.json   # walk clickable elements
python -m check.links docs/ --fail-on-broken                             # external link reachability
```

The same delivery also had a counterexample: **clickable does not mean it does anything**. Automation covers "the button can be pressed without an error and the UI survives"; whether the business logic behind it is right is not something it can judge. The split that worked was scripts for coverage, a person for spot checks on the critical paths:

| To scripts (every run) | To a person (fixed spot checks) |
| --- | --- |
| Link reachability, build success, word and asset size | Whether the layout holds, whether the tone fits |
| Clickable-element walk, response shapes | Fit to the scenario (who reads this, how it is used) |

::: tip Best value for effort
Put one command into the delivery flow and never skip it: **export the finished artifact as an image and open it**. It costs minutes and it is the only check that stops "every property is correct, the result is unusable".
:::

## 5. Reusable checklist

- Declare the mode (review / edit) at the start of a session, with explicit allowed scope and forbidden actions;
- Phrase requirements with a range, a threshold or an artifact shape, so completion can be judged reproducibly;
- Render the deliverable into a visible form and actually look at it before discussing revisions;
- Put machine-judgeable checks into a script that runs every time, turn human judgement into fixed spot checks, and never let "I'll take another look" stand in for a check;
- Write down what does *not* count as done; return criteria written before delivery work, written after delivery do not.
