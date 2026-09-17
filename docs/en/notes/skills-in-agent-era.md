# Engineering skills in the agent era: what is losing value, what is gaining

> I recently read a public essay by an engineer who optimises GPU operators (its title translates as "I had to bury my talent in yesterday"). He makes two points: AI has moved from "help me read the docs" to "reading assembly, analysing instruction stalls and optimising operators on its own"; so he does not expect to lose his job, but he does expect to change profession — from writing operators by hand to being the pilot of an agent mecha. He also worries that students who let AI do their lab work will lose the engineering abilities underneath: organising code, building systems, anticipating requirements.

I have spent this year using several agent frameworks on real projects — research workflows, corpus processing, service deployment, a hardware design pipeline — and I have opinions on both claims.

::: info Short version
- **What loses value is the speed of writing; what gains is defining and verifying**;
- There is one practical test: **can "correct" be judged automatically?**
- Engineering ability will not expire the way hand-written assembly did, but its point of application moves from "implementing" to "defining constraints and reviewing output".
:::

## 1. My test: can correctness be judged automatically?

| Nature of the work | How I handle it | Why |
| --- | --- | --- |
| Correctness is automatic (tests, metrics, build) | Hand it to the agent | Objective feedback lets it converge |
| Correctness is human-only (is the requirement right, does the conclusion hold, is the experience acceptable) | A person must do it | No feedback signal, so it will confidently go the wrong way |

By that test, "being able to write code" is depreciating while **defining what counts as written correctly** is appreciating. It also explains why some teams get a large speedup from AI and others mainly get more rework.

## 2. Losing value

- **Typing speed**: the most directly replaced part
- **Boilerplate**: CRUD, configuration, scaffolding, routine tests — written faster and more reliably by a model
- **Fluency in a single tool**: API recall is better in the model than in you
- **Memory-type knowledge of "how to write it"**: anything searchable loses value quickly

## 3. Gaining value

Seven things that repeatedly turned out to be the bottleneck in my own work:

**One: problem definition and decomposition.** Turning "optimise it" into "cut the landing page from three sections to two and fit 1280×720 without scrolling". This translation cannot be outsourced — it is the demand-side judgement. Method: [another note](/en/notes/task-decomposition).

**Two: acceptance design.** Machine-checkable criteria (test counts, click counts, metric thresholds) decide collaboration quality. "Looks fine to me" is not acceptance.

**Three: system and interface design.** Clear interfaces let units run in parallel; vague interfaces turn parallelism into conflict.

**Four: domain judgement — knowing what is worth doing.** Models implement the plan you propose; whether the plan should exist depends on understanding the field. My biggest time savings this year came from cutting directions early, not from writing faster.

**Five: context and information organisation.** What to feed the agent, in what layers, and what deserves to become a rules file.

**Six: cost and budget judgement.** Which stages are expensive, what can run locally, where the concurrency cap goes. This is engineering economics, not coding.

**Seven: review and fault localisation.** As output grows, **quickly judging what is wrong** becomes scarce. I give mechanical checks to scripts and keep attention for "why is it wrong".

## 4. Will engineering ability expire?

The essay asks it precisely: will these abilities go the way of hand-written x86 assembly, or hold value the way understanding the whole stack from software to hardware does?

My answer is the latter, with a changed shape:

- **The mode changed**: it used to be "I organise the code"; now it is "I set constraints, it organises, I review"
- **The bar is higher**: output speed rises N-fold, and without structure so does the speed of producing mess — and structure is exactly the part a human must supply
- **It does not come for free**: these abilities only grow in real projects; skipping the practice skips the formation

::: warning Worth noting
Letting AI complete a lab in one click costs you more than API knowledge — it costs **the full loop from fuzzy requirement to verifiable plan**. That loop is precisely what AI cannot do for you.
:::

## 5. A concrete checklist for the "mecha pilot"

1. **Translate fuzzy requirements into judgeable acceptance criteria**
2. **Decompose**: objective → acceptance → sub-tasks → execution units, with explicit boundaries
3. **Design interfaces and structure** so parallelism is possible instead of conflicting
4. **Manage context**: rules, memory and task inputs supplied in layers
5. **Design automated acceptance**, keeping human attention for judgement
6. **Control cost and concurrency** — know where the money and time go
7. **Localise faults**: bad output is normal; quickly telling which layer is wrong is the core skill
8. **Know when not to use AI**: irreversible operations, or anything you have not thought through yourself

## 6. What I do

- Every project keeps a rules file and a memory file, so assets survive tool changes
- Experiments fix their acceptance criteria first; failures are recorded like successes
- Nothing ships before it is rendered and looked at; mechanical checks go to scripts
- Recurring problems get upgraded into process constraints instead of being handled ad hoc

None of these look like "AI skills", yet they decide whether my output with AI is an asset or garbage.
