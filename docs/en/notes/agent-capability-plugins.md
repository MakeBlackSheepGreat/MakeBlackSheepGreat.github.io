# Giving an agent capabilities: MCP services and plugins

> August–September 2026. What a general-purpose agent actually lacks is not intelligence but two other things: **domain capability** (it cannot see your paper library or reach your design tools) and **long-term state** (a new session forgets the previous one's conclusions). This group of work addresses both.

::: info Short version
- The same knowledge written into a prompt is a one-off; published as an MCP service or a plugin it becomes a reusable asset;
- Counter-intuitive: the first version of an external component should implement **failure paths**, not features — unavailable, timed out and malformed response each need a default action;
- Capability can be externalised, but the main flow must not depend on it: when the outside component dies, the session has to fall back to the built-in path and keep running.
:::

## 1. A problem that kept coming back

The scenario was paper-library retrieval. The first approach was the obvious one: write "where the library is, what the fields mean, which endpoint to call" into the system prompt.

The symptoms arrived in order. The prompt grew to several hundred lines. Changing device or framework meant copying that explanation again. And in long sessions the explanation consumed context that the actual work needed — mid-session it started "forgetting" a retrieval field agreed on earlier and asked about it a second time.

Three approaches were tried, each falling short in a different way:

| Approach | Where it fell short |
| --- | --- |
| Written into the system prompt | Recopied on every device and framework change; consumed context every turn |
| Kept as a project rule file | Better, but still bound to the framework, and it required the agent to remember to read it |
| Extracted into a command-line script | Usable from any device, but the agent had no idea when to call it |

The fourth shape is the one that held: **make the knowledge a service**.

## 2. Turning domain knowledge into an MCP service

**PaperRAG_MCP** turns a personal paper library into something an agent can call directly: paper notes → vector retrieval → published as an MCP service on Cloudflare Workers, with the vector store and key-value storage taken from the platform. The corpus behind it comes from an ingestion run of 30,031 papers at a 99.96% success rate over 11.2 hours (recorded in [a separate note](/en/notes/paper-corpus-pipeline)).

Three reasons for this shape: serverless means no always-on machine to maintain; the service is decoupled from devices, so every device's agent reads the same knowledge; and the interface is plain MCP, so nothing is tied to one client.

What the client side needs is a short configuration block, with credentials injected by the runtime rather than stored in the file:

```json
{
  "mcpServers": {
    "paper-rag": {
      "type": "http",
      "url": "${PAPER_RAG_ENDPOINT}"
    }
  }
}
```

That block is what makes the setup portable across devices: changing device changes an environment variable, not a page of explanation.

## 3. Turning capability and state into plugins

Inside a self-hosted agent runtime, four directions were pursued along the line of "capability outside, state outside":

| Direction | Problem it solves |
| --- | --- |
| Injector × reasoning-mode routing | Moves "which mode of thinking to use" out of the prompt and into runtime-selectable routing presets |
| Cross-device memory sync | Memory and experience on each device sync through a private Git repository instead of staying isolated |
| Main-loop switching | Switches the session main loop to an external agent CLI while **keeping the built-in loop as a fallback** |
| Packaging the workflow suite | Wraps an established research workflow suite (13 skill modules, about 20 deterministic scripts, 90-plus tests) as a plugin, so a new environment is not rebuilt from scratch |

The shared judgement: **the same thing written in a prompt is disposable; written as a plugin or service it is reusable.**

## 4. The price of externalising: you have to design the fallback

Main-loop switching provided the sharpest lesson. Moving the loop to an external CLI did add flexibility — until an upgrade of that CLI changed its startup arguments. The session threw during initialisation, so there was not even a chance to switch back: the built-in path had never been loaded.

The fault was not in the external component but in **betting main-flow availability on it**. The fix makes external capability an optional overlay:

```python
def run_session(session):
    if cfg.external_loop.enabled and probe(cfg.external_loop):
        try:
            return external_loop.run(session)
        except ExternalLoopError as e:
            log.warning("external loop unavailable, falling back: %s", e)
    return builtin_loop.run(session)      # the default path is always available
```

Three conventions were fixed: the switch is **off by default**; enabling it requires a successful probe, and a failed probe goes straight to the built-in path; any runtime error degrades and records the reason. Cross-device memory sync follows the same standard — a failed sync writes a log line and never blocks the local session, because it is a bonus, not a dependency.

::: tip Best value for effort
For every external component, write a **failure-path table**: unavailable, timed out, malformed response — and the default action for each. If the table cannot be written, the component is not ready for the main flow.
:::

::: warning Worth noting
Run the fallback path for real, on a schedule. If only the external path is exercised for months, the fallback rots quietly — and the day it is needed turns out to be the day it no longer works either.
:::

## 5. Reusable checklist

- The test: will this knowledge still be needed after a device change? If yes, externalise it as a service or plugin;
- Capability as a service, state as files and repositories; the prompt keeps only "how to call it";
- New components default to off, probe before enabling, degrade on any runtime error;
- Write the failure paths before writing the features;
- Put fallback paths under regular verification instead of leaving them on paper.
