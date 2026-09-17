# Publishing an agent service to the internet

> September 2026. The service ran fine on my machine. The moment it went public, every problem turned into "I cannot log in".

::: info Short version
- The time does not go into "how do I make it reachable"; it goes into "why can I not log in, and why does it break on every restart";
- The root cause was counter-intuitive: **the session secret is generated at process start and never written to disk**. As long as the process never restarted, nothing was wrong — one supervised restart invalidated every credential ever issued;
- Some limits have no server-side switch (configuration goes read-only on a non-loopback address). That is a frontend decision, so the deployment structure has to change instead;
- An SSH tunnel "fixes" all of this instantly. I did not use it, because it hides the symptom rather than solving it.
:::

## 1. Symptom: it worked yesterday

The service had run locally for a month without a login problem. After it went under a process supervisor, the next day the page returned unauthorised — the same in a fresh cookie jar, another browser, another device.

My first three hypotheses:

| What I tried | Result |
| --- | --- |
| Clear cookies and site data | Worked at the time, failed again the next day |
| Another browser, another device | Same unauthorised response |
| Check system clock and HTTPS certificate | Fine, no skew |

The daily rhythm was the clue: this was not the browser. **The service was restarting once a day.**

## 2. Root cause: a process-scoped secret

The config answered it. The service generates its session secret **randomly at process start and never persists it**. Locally that is invisible, because the process never restarts. Under a supervisor — start on boot, restart on crash, periodic restarts — every restart produces a new key, none of the previously issued sessions can be validated, and the symptom reads as "it worked yesterday, today it says unauthorised".

The fix is direct: persist credentials to a fixed file and keep using the same one across restarts.

::: warning Worth noting
Before handing a service to a process supervisor, check whether its secrets are persisted or regenerated on start. This class of bug never reproduces locally — it only appears after a restart.
:::

## 3. Second trap: cookie scope

- The session cookie is set `SameSite=Strict`, so **following an external link into the service does not carry the cookie**. You have to open the address directly. That is the security design, not a bug, but users do not know it and report "the link does not work".
- Loosening `SameSite` and the domain scope would expose the service to cross-site request forgery. I kept the strict policy and documented "open the address directly".

There is a relative of this problem: on a non-loopback address the service makes part of its configuration read-only, on the assumption that a public deployment should not let an administrator change settings from the web UI. That check lives entirely in the frontend with no server-side flag, so it cannot be overridden — only the deployment structure can change.

**When reviewing a service's deployment docs, find out under what conditions it degrades functionality**, rather than discovering after launch that a control does nothing.

## 4. Why I did not take the SSH tunnel

The cheapest workaround for a login problem is an SSH tunnel between my machine and the server, making public traffic look local — every non-loopback restriction disappears and so does the symptom.

I did not take it, for two reasons: it hides the problem instead of solving it, and it hands out part of the server's security boundary along the way. The route I took was a reverse proxy plus process supervision, fixing the session problem at the root.

::: tip Best value for effort
After deploying, run a restart drill: restart the service manually, then access it with a session issued before the restart. It takes under a minute and catches the whole "credentials are not persisted" family before delivery.
:::

## 5. What the deployment looks like now

- Under a process supervisor: starts on boot, restarts on crash, logs to a fixed location;
- Credentials persist, so a restart does not invalidate issued sessions;
- A reverse proxy handles the domain and HTTPS; the service listens only on a local port;
- Access instructions are written down: open the address directly, do not use forwarded links.

In hindsight this has little to do with "deploying an AI service" and everything to do with ordinary operations common sense — when you are only playing on your own machine, nothing forces you to think about it.

## 6. Reusable checklist

- Before supervision, ask: is the secret persisted or generated per process start?
- Run a restart drill immediately after deploying and test with an old session;
- `SameSite=Strict` drops cookies on external-link navigation — that is design, so document it;
- Trading cookie scope for convenience buys CSRF risk, and it is not worth it;
- Identify which features degrade on a non-loopback address before reviewing a deployment;
- A tunnel is not a fix: it hides the symptom and widens the trust boundary;
- Target shape: process supervision + persisted credentials + reverse proxy terminating HTTPS + service listening on loopback only.
