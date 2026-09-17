# Projects

Most of my code is open-sourced on GitHub, grouped by direction below. Private repositories are listed by name only, without links.

## Medical imaging AI

::: card Breast ultrasound classification (bucad)
Binary benign/malignant classification on breast ultrasound images. Trained on BUS-BRA and tested externally on BUSI, producing lesion region hints, risk stratification and Grad-CAM visualisation for review.

My part: implementing and tuning the CNN classifier, fixing the evaluation metrics and threshold policy, building the Grad-CAM module, and packaging the inference demo. This project later supported three competition awards.

Stack: Python · PyTorch · medical imaging · Grad-CAM

[Repository](https://github.com/MakeBlackSheepGreat/bucad)
:::

::: card Pulmonary nodule classification and interpretable risk grading (ct-nodule-risk)
A provincial undergraduate innovation training project: classify pulmonary nodules on chest CT, grade malignancy risk, and give interpretable evidence for the decision.

I handle data processing and model experiments — nodule extraction and preprocessing, the training and evaluation pipeline, and keeping records reproducible (fixed splits, seeds and evaluation scripts). Ongoing; the current focus is making the evaluation protocol solid.

Stack: Python · PyTorch · 3D medical imaging · interpretability

[Repository](https://github.com/MakeBlackSheepGreat/ct-nodule-risk)
:::

::: card Osteomyelitis fluorescence-guided diagnostic workstation (osteo-vision)
A physician workstation for fluorescence-guided osteomyelitis imaging: image review, lesion annotation and 3D display. Frontend is a Vue3 workstation UI, backend is FastAPI, and the 3D view runs on Three.js.

Because the competition required delivery on a disc, there was plenty of engineering beyond the algorithms: two build configurations (GPU accelerated and CPU fallback), cross-machine dependency and path checks, and automated regression over the whole interface (13 pages, 265 buttons, 192 actual clicks, zero failures).

Stack: Vue3 · FastAPI · Three.js · Electron · Playwright

[Repository](https://github.com/MakeBlackSheepGreat/osteo-vision)
:::

## Agent and research tooling

::: card SWUST Code — a terminal-native coding agent (swust-code)
A personal build based on an open-source coding agent, extended with persistent memory, multi-agent workflows on smaller models, and goal-driven autonomy, plus its own documentation site. It is usable day to day and I have used it to write other projects — using it to develop itself was the most interesting tooling experience of my year.

Stack: TypeScript · Node.js · multi-agent · CLI

[Code](https://github.com/MakeBlackSheepGreat/swust-code) · [Docs site](https://github.com/MakeBlackSheepGreat/swust-code-docs)
:::

::: card IPC Vision — seven-model MNIST comparison (IPC_vision)
An exercise that walks the whole path from model to application: BP, CNN, ConvNeXt, LeNet-5, ResNet, ViT and MobileNetV2 compared under one dataset and evaluation protocol, wrapped with a Flask API, a web frontend and an Electron desktop app. The point was to see the real gap between model sizes on a single task instead of trusting paper numbers.

Stack: Python · PyTorch · Flask · Electron

[Repository](https://github.com/MakeBlackSheepGreat/IPC_vision)
:::

::: card PDF vector search (pdf-vector-search)
A local PDF knowledge-base retrieval tool for agents: documents are chunked and embedded into a local vector store, exposed through a command-line interface for an upper-layer agent to call — used for literature search and question answering. I built it because I did not want to feed papers to a model one at a time; I wanted retrieved answers that carry their sources.

Stack: Python · vector search · RAG · CLI

[Repository](https://github.com/MakeBlackSheepGreat/pdf-vector-search)
:::

## Engineering practice

These have no dedicated repository, but I spent no less time on them than on writing code.

::: card Paper corpus ingestion pipeline
Turning 30,000 papers into searchable, traceable knowledge entries: tiered concurrency, content-hash idempotency, and mixed local/cloud inference. It finished 30,018 of 30,031 papers in 11.2 hours (99.96%) and attached evidence links back to the source for every entry. The full story of what went wrong is in the [notes](/en/notes/paper-corpus-pipeline).
:::

::: card Agent service deployment and operations
Getting a self-hosted service running on the public internet: process supervision and boot persistence, credential persistence, reverse proxy and HTTPS, private networking. The traps included a process-scoped random secret that invalidated every session on restart, and cookie scope rules — written up in the [notes](/en/notes/agent-service-public).
:::

::: card Domestic AI chip operator exercises
Several CANN operator contest problems: 2D convolution (FP16/FP32/BF16), the HardSwish activation, and a quantised GEMM optimisation task. It was my first serious look at address spaces, tiling and vectorisation at the operator level, and the first time I felt how much performance depends on how the same semantics are written.
:::

## Private workspaces

These are research and engineering workspaces I use daily. They are private for now — email me if you would like to know more.

- **Neural_Paper_Skill** — a workflow skill set for neural network research and paper writing, covering ideation, training, validation, writing and figures
- **CordiSwarm** — a plugin-kernel research swarm agent system for long-running autonomous work
- **Regain-Mamba / LesioNeXt-Code** — research code for lesion analysis and remote sensing models, with reproducible training and evaluation pipelines
- **WeftMesh** — local AI agent software with a star topology and a device-interconnection protocol
- **SwustSpirit** — campus information tooling for students at my university

## Small tools and archives

::: card BearPi-Pico H3863 development archive (BearPi-Pico-H3863)
Documentation, chip manuals, firmware and source-code pointers for the BearPi-Pico H3863, archived because the material was scattered everywhere and painful to find. Tidying it up saves the next person some time.

Stack: embedded · documentation

[Repository](https://github.com/MakeBlackSheepGreat/BearPi-Pico-H3863)
:::

::: card HTML long-image export skill (html-png-exporter-skill)
A skill for coding agents: render a long HTML page into a previewable full-page image and export it as PNG using native Canvas. Built because generated reports and posters need to be *seen* before they can be judged.

Stack: JavaScript · Canvas · agent skill

[Repository](https://github.com/MakeBlackSheepGreat/html-png-exporter-skill)
:::

::: card dsh-OHDSH — an agent runtime on HarmonyOS (dsh-OHDSH)
An attempt to bring a reproducible implementation of DeepSeek Harness to HarmonyOS. Most of the time went into debugging a startup crash on a real device, which ended up traced to several system-level restrictions with workarounds for each.

Stack: HarmonyOS · ArkTS · C

[Repository](https://github.com/MakeBlackSheepGreat/dsh-OHDSH)
:::

## Other public repositories

| Repository | Description |
| --- | --- |
| [MakeBlackSheepGreat](https://github.com/MakeBlackSheepGreat/MakeBlackSheepGreat) | GitHub profile repository |
| [campus-network-auto-login](https://github.com/MakeBlackSheepGreat/campus-network-auto-login) | Small campus network auto-login tool (JavaScript) |

More experimental repositories are on my [GitHub profile](https://github.com/MakeBlackSheepGreat).
