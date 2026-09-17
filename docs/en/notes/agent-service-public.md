# Publishing an agent service to the internet

> September 2026. The service ran fine on my machine. The moment it went public, every problem turned into "I cannot log in".

::: info Short version

When self-hosting a service on the public internet, the time does not go into "how do I make it reachable from outside" — it goes into "why can I not log in, and why does it break every time the process restarts". A few things I now remember:

:::

## Process-scoped secrets

The service generates its session secret **randomly at process start** and never writes it to disk. Locally that is fine — the process never restarts, so the secret never changes. But on a server managed by a process supervisor, the story changes: one restart invalidates every session credential ever issued, and the symptom is "it worked yesterday, today it says unauthorised".

I chased browser caches first: cleared cookies, switched browsers, no luck. The service itself was rotating its key on restart. The fix was to persist credentials to a fixed file so restarts keep the same key.

**Lesson**: before handing a service to a process supervisor, check whether its secrets are persisted or regenerated per start.

## Cookie scope is more subtle than it looks

Two more traps:

- The session cookie is set `SameSite=Strict`, which means **following an external link into the service will not carry the cookie**. You have to open the address directly in the address bar. That is not a bug, it is the security design — but users do not know that, they just report "the link does not work".
- Loosening `SameSite` and the domain scope would expose the service to cross-site request forgery. I kept the strict policy and documented "open the address directly".

## Some behaviour is a frontend decision with no server-side switch

When accessed from a non-loopback address, the service makes part of its configuration read-only — on the assumption that a public deployment should not let an administrator change settings through the web UI. That check lives entirely in the frontend, with no server-side flag, so there is nothing to override: the deployment structure has to change instead.

The takeaway: **when reviewing a service's deployment docs, find out under what conditions it degrades functionality**, rather than discovering after launch that a control does nothing.

## On SSH tunnels

The easiest workaround for the login problems was an SSH tunnel between my machine and the server, making public traffic look local — every "non-loopback" restriction disappears at once.

I did not take it. It does not solve anything, it hides the problem, and it hands out a chunk of the server's security boundary along the way. The route I took was a proper reverse proxy plus process supervision, fixing the session problem at the root.

## What the deployment looks like now

- The service runs under a process supervisor: starts on boot, restarts on crash, logs to a fixed location
- Credentials persist, so restarts do not invalidate issued sessions
- A reverse proxy handles the domain and HTTPS; the service itself only listens on a local port
- Access instructions are written down: open the address directly, do not use forwarded links

In hindsight this has little to do with "deploying an AI service" and everything to do with ordinary operations common sense — it is just that when you are only playing on your own machine, nothing forces you to think about it.
