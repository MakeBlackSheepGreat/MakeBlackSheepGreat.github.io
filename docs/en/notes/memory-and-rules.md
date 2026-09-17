# Memory and rules: turning mistakes into process

> When the same trap catches you a second time, the problem is rarely the agent's intelligence — it is that nothing in the process remembers. A habit I built over the last half year: **anything that recurs gets upgraded from "how do I fix it now" to "how do I never handle it again".**

## 1. A rules file per project: the environment's exceptions

Every project keeps a rules file, and its content is not a project introduction but the **specific constraints of this machine and repository**: which commands do not work, which paths need escaping, which tools are broken here, which checks must run before delivery.

Information like this has a sharp property: **it will bite you if unread, and never again once written down**. Standing in a rules file means every session starts with the environment's manual loaded.

## 2. Project memory: conclusions that outlive a session

Rules record what the environment is like; memory records what we concluded — a rejected approach, a parameter range ruled out, a decision and the context behind it. Without it every new session re-explains the background; with it, a new session continues from the conclusion.

## 3. A requirements ledger: one list instead of many scattered ones

Once the count of sessions runs into the dozens, a new problem appears: **the same requirement sits in several sessions, understood slightly differently each time.** So I maintain a ledger: go back through history, extract every requirement that was raised, deduplicate and write the single authoritative list.

The way it was built is the interesting part — **using an agent to read its own work history**: batch-review past sessions, extract user requirements, compile the list. That is far more accurate than recalling them by hand, and it doubles as a review of what this collaboration has been asked to do.

## 4. Memory lives outside the tools

I use different agent frameworks on different devices. If memory lives inside one client, switching devices means amnesia. So memory and experience live **outside the tools**: as files in the project directory, synchronised between devices through a private repository.

This is what makes framework switching cheap: fewer things need migrating, because the real assets — memory, rules, methods — were never inside the framework.

## 5. One test for any lesson

Whenever I write a lesson down, I ask: **"will this take effect automatically next time?"**

- If the answer is "I would have to remember to look it up", it will eventually fail;
- Only when it sits where it is always read — rules file, checklist, script — has it really become process.

## Closing thought

Making experience into process sounds heavy, but the cost is small: a few lines of rules take far less time than repeating a mistake. The hard part is the judgement habit — **once is an accident, twice is a missing process.**
