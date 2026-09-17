# Instruction files need layers: why "say it all at once" works worse

> Early on I did the obvious thing: every requirement, convention and caution about a project went into one always-loaded instruction file. It grew past two hundred lines, which felt efficient — until a delivery went wrong. Line 200 said "export full-page screenshots before delivery"; that was the step I skipped, and the reason it was skipped is precisely that it sat on line 200.

::: info Short version
- An always-loaded instruction file is **not better for being complete**: the more rules it holds, the flatter each one's effective weight, and the one that matters most for the current task becomes the least visible;
- The fix is **layering**: the always-loaded layer holds only hard constraints; procedural content goes to task-level files loaded on demand; detail goes to reference files read only when linked;
- To decide where something belongs, ask one question: **if nobody reminds me, will this go wrong?**
:::

## 1. The pattern: the fuller the file, the worse the compliance

After that incident I went back through several rounds of records, and the pattern was clear:

| Always-loaded size | Observed behaviour |
| --- | --- |
| Under 30 lines | Constraints are broadly respected; lapses trace to imprecise wording |
| Around 80 lines | Selective execution begins: formatting rules are followed, process rules are followed intermittently |
| Over 200 lines | Clauses in the middle are effectively dead; and nobody dares delete a line, so the file only grows |

The third row is the real trap: **the file only gets longer.** Every trap adds a line, because adding is cheaper than deciding which layer it belongs to — and after dozens of rounds the always-loaded file becomes a document nobody has read in full, including the model that loads it.

## 2. Why this happens

Two reasons, neither of them about how clever the model is:

**Attention is spread thin.** Always-loaded content consumes budget at the start of every task; the more rules there are, the lower each one's relative weight. A constraint unrelated to the current task is almost never recalled on its own.

**Constraints interfere with each other.** A one-off experimental requirement ("fix the seed for this run") and a long-term project convention ("scripts must be repeatable") written in the same layer leave no way to tell which overrides which — so both get mediocre treatment.

## 3. Three layers

| Layer | What goes in | Size | Loaded when | Test |
| --- | --- | --- | --- | --- |
| Always-loaded (project instruction file) | Hard constraints: prohibitions, mandatory checks, commands that do not work here | 30–60 lines | Start of every task | Violating it causes real damage |
| Task layer (skills / process notes) | Steps and boundaries for one kind of work: how to do it, how to verify, when not to use it | under 100 lines each | When that task type is triggered | Only meaningful for that work |
| Reference layer (notes, troubleshooting, decision records) | Cases, error tables, parameter detail, past decisions | unbounded | When linked | Findable when needed is enough |

One test decides it: **if nobody reminds me, will this go wrong?** Yes → always-loaded. Only in specific work → task layer. Fine to look up afterwards → reference layer.

## 4. How progressive disclosure actually lands

The key move is treating **triggers as a first-class citizen**: every task-layer file starts with "when to use this, when not to", a very short section that can stay resident; the body loads on demand. The layout looks roughly like this:

```text
project/
├─ AGENTS.md              # always loaded: hard constraints (30–60 lines)
├─ skills/
│  ├─ experiment/SKILL.md # task layer: triggers + steps + boundaries
│  └─ delivery/SKILL.md
├─ docs/
│  ├─ troubleshooting.md  # reference: symptom → cause → fix
│  └─ decisions.md        # reference: why it was decided this way
└─ scripts/check.sh       # machine-checkable checks, not human memory
```

With this arrangement the always-loaded part is short enough to actually be read; task-layer files enter context only when that work happens; reference files cost nothing most of the time.

::: tip Best value for effort
**Move anything machine-checkable out of instructions and into a script.** "Run three checks before delivery" relies on the model's diligence; a `check.sh` invoked by the process relies on the machine. Instructions should explain *why* the check exists.
:::

## 5. A counter-intuitive trade-off

Layering is not "writing less" — it is **putting information on the layer where it is needed**. Three moves I actually made:

- "This path gets rewritten in that shell, use the other form" → from always-loaded to the reference troubleshooting file: environment-specific knowledge, not a per-task constraint;
- "Fix the acceptance criteria before running an experiment" → from the rules file to the experiment task layer: it applies only when running experiments, and sitting in the always-loaded layer it diluted other constraints;
- "Every clickable element must be audited" → from instructions to the delivery script: it is automatically checkable, and a machine is more reliable than a reminder.

After the moves, the always-loaded file went from over two hundred lines back under fifty — and **compliance went up**. That was the change that convinced me layering is not formalism.

::: warning Worth noting
"Documented" is not "done". Anything living in the reference layer is, by default, not executed; only constraints in the always-loaded layer or in automation actually take effect.
:::

## 6. Self-check list

1. Is the always-loaded file under 60 lines, every item a "violating this causes damage" constraint?
2. Is each constraint **verifiable** (writable as a check)? If not, it should be rewritten or moved;
3. Does every task-layer file state its triggers and its "when not to use" up front?
4. Are reference files genuinely linked rather than always loaded?
5. Where did I put the last trap I hit — the right layer, or just the most convenient file?
6. Which constraints could already be handled by a script but are still relying on memory?
