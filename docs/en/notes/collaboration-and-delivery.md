# Collaboration and delivery: state the mode, check the artifact

> Output quality when working with an agent comes down to two things: **whether the requirement is specific enough** and **whether the acceptance step is hard enough**. Neither depends on model capability, and together they decide most of the outcome.

## 1. Declare the mode first

The same agent behaves completely differently in review mode and in edit mode, and it cannot read minds. So I state the mode explicitly:

- **Review**: analyse only, no changes; output a problem list with evidence
- **Edit**: change within the agreed scope, and explain the changes

Not declaring it is the source of many "it made things worse" episodes: it analyses and edits in the same pass, and afterwards nobody can tell which problems were original and which were introduced.

## 2. Make the requirement executable

| Vague | Executable |
| --- | --- |
| Optimise this a bit | Cut the landing page from three sections to two and fit it in one screen |
| Check for problems | Check every external link and list the broken ones |
| Make it look better | Apply this spacing and palette, then export a screenshot for me to confirm |

The right column shares one property: **completion can be judged objectively.** The more specific the requirement, the fewer round trips.

## 3. Nothing ships before it can be seen

This one came from a failure: a generated report was correct in format, page count and word count, yet the layout was wrong — because the acceptance step only inspected file properties and nobody looked at the actual output.

So it became a rule: **a generated artifact must be rendered and looked at before anyone discusses revisions.** Sites export full-page screenshots, decks export every page, charts export as images — there has to be a form a person can see at a glance. The rule now sits in the project's rules file as a mandatory delivery step.

## 4. Do not spend human attention on machine checks

Conversely, mechanical checks should not consume human attention: link reachability, build success, word limits, asset size. Those go to scripts and run every time.

The dividing line is clear: **whatever a machine can judge goes to a script; whatever requires human judgement — layout, tone, fit to the scenario — goes to a person, who actually looks.**

## Closing thought

"Working with AI" sounds like a question of prompting, but it behaves like **acceptance-process design**. Declare the mode, phrase requirements so they can be judged, and make deliverables inspectable — and output quality stabilises. All three have conventional counterparts in software engineering: interface contracts, acceptance criteria, delivery checks.
