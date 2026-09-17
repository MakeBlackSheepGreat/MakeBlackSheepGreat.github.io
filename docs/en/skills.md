---
pageClass: labels
---

# skills

::: lead
Listed by actual level of use, without inflation. Every line corresponds to something I have built.
:::

## DEEP LEARNING AND DATA

| Area | Level | What I have done |
| --- | --- | --- |
| PyTorch training and evaluation | Comfortable | Classification and segmentation training, external validation and metrics; fixed splits, seeds and evaluation scripts |
| Medical imaging data | Comfortable | Ultrasound and CT preprocessing, augmentation and ROI handling; unified evaluation across datasets |
| Interpretability | Comfortable | Grad-CAM attention visualisation to support readable model decisions |
| Model comparison and selection | Comfortable | Seven classification models compared under one dataset and protocol; segmentation model selection for medical imaging |
| Remote sensing experiments | Some experience | RGB-T adaptive image fusion and budgeted semantic segmentation: experiment design and ablations |
| Lightweight and on-device deployment | Some experience | Model export, inference packaging and CPU-fallback paths |
| NLP / small language models | Beginner | Small-model inference and fine-tuning experiments |

## AGENT SYSTEMS

- **Multi-agent orchestration**: role-based task splitting (explore, implement, review) with parallel execution; progress on disk and resumable long-running work
- **Own coding agent**: incremental changes on an open-source base adding persistent memory, multi-agent workflows for smaller models and goal-driven execution; published to npm with its own documentation site
- **Client protocol design**: an agent-bridge protocol for mobile (21 requests, 18 events) covering streaming output, long-task progress and session recovery
- **MCP services**: a paper knowledge base exposed as vector retrieval plus an MCP service on an edge platform, usable from any client
- **Plugins and runtime changes**: reasoning-mode routing via injectors, cross-device memory sync, session main-loop switching with the built-in loop as fallback, and packaging an existing workflow suite as a plugin
- **Skill module design**: 13 modules plus about 20 deterministic scripts and 90+ tests for a research workflow suite; 9 modules for a hardware design pipeline
- **Device mesh**: star topology with a purpose-built device protocol supporting capability advertisement, task dispatch and reconnection (three platforms, 176 passing tests)
- **Process governance**: project identity, goals and task execution constrained by a plain-Markdown specification

## ENGINEERING AND DEPLOYMENT

- **Linux services**: system-level and user-level systemd supervision, boot persistence, log triage
- **Service exposure**: reverse proxies, private networking, tunnels and custom domains, HTTPS and security headers
- **Cloudflare platform**: Workers, vector and key-value storage, Pages, tunnel and DNS record management
- **Continuous integration**: dual-target publishing (static hosting plus edge platform) from GitHub Actions, build caching, headless-browser artifact generation
- **Model serving**: an out-of-tree vLLM plugin (model implementation, configuration and tool-call parser); local llama.cpp CUDA inference services
- **Cross-device sync**: memory and experience synchronised through a private Git repository
- **Frontend and clients**: Vue3 + Three.js + Electron desktop application; Flutter Android application
- **Testing and delivery**: full-interface automated regression (13 pages, 265 buttons, 192 actual clicks), release packaging and offline delivery, verification on other machines
- **Retrieval and knowledge bases**: vector search, document chunking, evidence trails and review queues
- **Fonts and frontend engineering**: font subsetting, device-matched font stacks, post-build artifact cleanup
- **Python engineering**: uv / venv environments, scripts and CLI tools
- **Git**: branching and rebasing, history cleanup, repository mirroring

## HARDWARE AND EMBEDDED

- **PCB design**: schematic and PCB layout of an STM32F407 minimum system board in LCEDA, with a ready-to-order BOM
- **Flashing and debugging**: Keil toolchain, flashing port and build-cache troubleshooting
- **Embedded platforms**: working with development material for BearPi-Pico H3863 (WS63) and similar boards
- **Domestic AI chip operators**: CANN operator implementation and performance work (convolution, activation, quantised GEMM)
- **Digital design**: Verilog and RISC-V processor design study (RTL simulation stage)

## RESEARCH METHOD

- **Record-keeping**: criteria set before the run; failed runs recorded in the same template as successful ones; configurations and conclusions kept in a registry
- **Reproducibility**: splits, seeds and evaluation scripts in the repository so results reproduce elsewhere
- **Evaluation metrics**: the standard medical imaging set (AUC, sensitivity, specificity, precision, F1) and what each does and does not mean clinically
- **External validation**: independent test sets preferred over comparisons on the same source data

## LANGUAGES

- **Python**: primary working language
- **C**: basic level, coursework and embedded exercises
- **HarmonyOS ArkTS**: certified HarmonyOS application developer
- **Verilog**: learning stage, RTL simulation exercises
- **Chinese**: native
- **Japanese**: passed CJT4, preparing for JLPT N2

## DOCUMENTATION

- Maintains a bilingual site; full technical documentation experience (architecture notes, interface documentation, deployment steps)
- Multi-language READMEs for open-source projects (including one covering ten languages)
- Project review material: technical proposals, experiment records, presentation decks and scripts

## HOW I WORK

- **Toolchain**: Linux for development, uv for Python environments, Git and GitHub for code, self-hosted servers for deployment
- **Working with agents**: role-based splitting with parallel execution; a rules file and memory file per project; recurring problems upgraded into process constraints — see the [notes](/en/notes/)
- **Experiments**: criteria fixed before the run; failures recorded on equal footing with successes
- **Delivery**: everything machine-checkable goes to scripts; anything requiring human judgement is confirmed by a person before delivery
