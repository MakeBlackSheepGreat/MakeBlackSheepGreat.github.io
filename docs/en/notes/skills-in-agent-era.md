# Engineering skills in the agent era: what is losing value, what is gaining

> Over the past half year I have used several agent frameworks on real projects: research workflows, corpus processing, service deployment, a hardware design pipeline. Throughout, one question kept coming back — now that AI can read assembly, change code on its own and run its own experiments, what has happened to the value of engineering ability?

::: info Short version
- **What loses value is writing; what gains is defining and verifying**;
- One practical test decides whether a skill can be replaced: **can correctness be judged automatically?**
- An easily missed symmetry: AI multiplies output speed by N, and multiplies rework speed by N as well — the net gain depends on how solid the acceptance step is;
- Engineering ability will not expire the way hand-written assembly did, but its point of application moves from "implementing" to "defining constraints and reviewing output".
:::

## 1. One UI delivery: where the time actually went

In August 2026 a medical imaging application had to ship on a disc, with the runtime environment out of my control. The UI had 13 pages and 265 clickable elements. The first instinct was to click through it myself — half a day of work, and a missed element would go unnoticed.

That job went to automated testing instead: driving the real desktop application across the whole UI, auditing every clickable element, performing clicks, recording failures. The result was 265 elements audited, 192 clicks actually executed, zero failures. Writing the script took less time than clicking through by hand, and the number went straight into the delivery notes — "zero failures" is more convincing than "checked it".

The dividing line showed up here too: the script covers "the click does not error and the UI does not crash"; whether the button's business logic is correct still requires a person. So the two kinds of check were separated — the script owns coverage, the person owns sampling the critical paths. **The same ability is depreciating where it means "writing the page" and appreciating where it means "defining what to click and what counts as failure".**

::: tip Best value for effort
Turn "what counts as passing" into a script and hand that to the agent. After that, acceptance no longer depends on anyone remembering to check — every run produces a number.
:::

## 2. The test: can correctness be judged automatically?

| Nature of the work | Who does it | Why |
| --- | --- | --- |
| Correctness is automatic (tests, metrics, build) | The agent | Objective feedback lets it converge |
| Correctness is human-only (is the requirement right, does the conclusion hold, is the experience acceptable) | A person | No feedback signal, so it will confidently go the wrong way |

By that test, "being able to write code" is depreciating while **defining what counts as written correctly** is appreciating. It also explains why some teams get a real speedup from AI and others mainly get more rework: the difference is not the tool, it is whether anyone does the second row seriously.

## 3. Losing value

- **Typing speed**: the most directly replaced part
- **Boilerplate**: CRUD, configuration, scaffolding, routine tests — faster and more reliable from a model
- **Recall of one tool's API**: the model remembers it better than you
- **Memory-type knowledge of "how to write it"**: anything searchable loses value quickly

## 4. Seven things gaining value

| Ability | Why it cannot be replaced | Concrete action |
| --- | --- | --- |
| Problem definition | Demand-side judgement with no objective signal | Turn "optimise it" into "cut the landing page from 3 sections to 2, no scroll at 1280×720" |
| Acceptance design | The criterion decides collaboration quality | Write executable checks: test count, click count, metric threshold |
| System and interface design | Clear interfaces allow parallelism; vague ones create conflict | Fix the interface, then implement on both sides |
| Domain judgement | "Should this plan exist" depends on understanding the field | Cut directions that are not worth doing, early |
| Context organisation | What you feed the agent decides its judgement | Layered supply, see [another note](/en/notes/context-management) |
| Cost and budget | Which stages are expensive and where the concurrency cap goes is engineering economics | Estimate quota and rate limits before setting concurrency |
| Review and fault localisation | As output grows, "what is wrong" becomes the bottleneck | Mechanical checks to scripts, attention to "why is it wrong" |

The first three are developed in the [decomposition note](/en/notes/task-decomposition). Of the domain judgement item, the cheapest use is not inventing a better plan but killing one that should not exist: an ablation experiment dropped accuracy from 77.23% to 56.78% and collapsed at epoch 61, and because the acceptance threshold was written before the run, that direction was stopped within two days instead of turning into weeks of hyper-parameter tuning.

## 5. What is still needed once AI writes code

My answer: engineering ability does not expire, but its shape changes.

- **The mode changed**: it used to be "I organise the code"; now it is "I set constraints, it organises, I review"
- **The bar is higher**: output speed rises N-fold, and without structure so does the speed of producing mess — and structure is exactly the part a human must supply
- **It does not come for free**: these abilities only grow in real projects; skipping the practice skips the formation

::: warning The trap to watch for
Letting AI complete a lab in one click costs you more than API knowledge — it costs **the full process from fuzzy requirement to verifiable plan**. That stretch is precisely what AI cannot do for you, and what can only be learned by doing it once yourself.
:::

## 6. Reusable checklist

- Sort the task first: automatic correctness goes to the agent, human-only judgement stays with you
- For the automatic kind, turn the check into an executable script before handing the work over
- For the human kind, do not outsource it, and do not accept "looks fine to me"
- Subtract at the plan level: the earlier an unworthy direction is cut, the cheaper it is
- Once output volume rises, script every mechanical check and keep attention for fault localisation
- For irreversible operations, or anything you have not thought through yourself, do not use AI yet
