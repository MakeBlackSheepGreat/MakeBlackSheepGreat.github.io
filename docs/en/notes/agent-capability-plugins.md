# Giving an agent capabilities: MCP services and plugins

> August–September 2026. What general-purpose agents actually lack is not intelligence but two other things: **domain capability** (they cannot see your paper library or reach your design tools) and **long-term state** (a new session forgets the last one's conclusions). This group of projects addresses both.

::: info Short version
- Capability grows better outside the prompt, as a service or a plugin;
- State kept outside the tool is what survives changing devices and frameworks;
- Extending capability must keep a fallback so a new component cannot take the main flow down.
:::

## 1. Turning domain knowledge into an MCP service

**PaperRAG_MCP** turns a personal paper library into something an agent can call directly: paper notes → vector retrieval → published as an MCP service on Cloudflare Workers (vector store and key-value storage from the platform), so any agent speaking MCP can use it.

Three reasons for this shape: serverless means no always-on machine to maintain; the service is decoupled from devices, so every device's agent uses the same knowledge; and MCP is a standard interface, so nothing is tied to one client.

## 2. Turning capability and state into plugins

Inside a self-hosted agent runtime, I worked along the line of "capability outside, state outside":

| Direction | Problem it solves |
| --- | --- |
| Injector × reasoning-mode routing | Moves "which mode of thinking to use" out of the prompt and into runtime-selectable routing presets |
| Cross-device memory sync | Memory and experience on each device sync through a private Git repository instead of staying isolated |
| Main-loop switching | Switches the session main loop to an external agent CLI while **keeping the built-in loop as a fallback** |
| Packaging the workflow suite | Wraps an existing research workflow suite as a plugin so a new environment does not have to be rebuilt from scratch |

The shared judgement: **the same thing written in a prompt is disposable; written as a plugin or service, it is reusable.**

## 3. One rule throughout: keep a fallback

Main-loop switching is the clearest case. An external CLI brings flexibility, but if that component is unavailable the whole session dies. So the built-in loop stays — **capability is added without removing the way back**. Cross-device sync follows the same rule: a failed sync must not affect the local session; it is a bonus, never a dependency.

## 4. Closing thought

Treating an agent as **software that must be maintained for a year** changes many decisions: whether a capability belongs in a service or a prompt, whether state lives locally or in a repository, and who catches the failure when a new component breaks. These choices have little to do with model capability and everything to do with whether the setup still works months later.
