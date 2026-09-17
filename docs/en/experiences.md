---
pageClass: labels
---

# experiences

::: lead
Education, research and engineering experience, and service, in reverse chronological order.
:::

## EDUCATION

::: card Electronic Information Engineering (Honors) · B.Eng. in progress
<p class="entry-meta">Southwest University of Science and Technology · School of Information and Control Engineering · 2026.09 – present · Mianyang, China</p>

Transferred from Pharmaceutical Engineering in September 2026; currently in the second year. Courses this semester: complex functions and integral transforms, probability and statistics, analog electronics, university physics, Japanese, and software technology fundamentals. The electronics core — digital electronics, signals and systems — follows in later semesters.
:::

::: card Pharmaceutical Engineering · first year
<p class="entry-meta">Southwest University of Science and Technology · School of Life Science and Agriculture · 2025.09 – 2026.09 · Mianyang, China</p>
<span class="badge">Comprehensive evaluation 99.81 / 100</span> <span class="badge">Top 12% of major</span> <span class="badge">1st in innovation credits</span> <span class="badge">No failed courses</span>

First-year comprehensive evaluation 99.81, ranked 7th in the major (top 12%), with the highest innovation-credit score in the major. Selected course results: Programming Fundamentals (Python) 100, Fundamentals and Applications of AI 87, Calculus B1 88, Japanese 88 / 87. Also passed the National Computer Rank Examination (Level 2) and the College Japanese Test Band 4 (CJT4).
:::

## RESEARCH EXPERIENCE

::: card Medical imaging · algorithms and software implementation
<p class="entry-meta">2026.04 – present</p>

**Breast ultrasound benign/malignant classification and diagnosis support** (2026.03 – 2026.07): binary classification trained on BUS-BRA and evaluated on the independent BUSI test set for external validation. Implemented the CNN training and evaluation pipeline, fixed the evaluation metrics and decision threshold policy, and produced Grad-CAM attention visualisations. This work supported three competition awards.

**Provincial undergraduate innovation training project: interpretable pulmonary nodule classification and malignancy risk grading from chest CT** (approved 2026.05, ongoing): responsible for data processing and model experiments, including fixed data splits, random seeds and evaluation scripts to ensure reproducibility. Current stage: validating the stability of the evaluation protocol and consolidating experiment records.

**Fluorescence-guided osteomyelitis imaging software system** (2026.06 – 2026.08): independently implemented the physician workstation prototype and the algorithm side, covering image review, lesion annotation and 3D display, with two release configurations (GPU accelerated and CPU fallback) to meet delivery requirements.
:::

::: card "One Student One Chip" study group · RISC-V and digital design
<p class="entry-meta">2025.10 – present</p>
Studying Verilog and RISC-V processor design from digital logic fundamentals, currently at the E5 stage of RTL simulation; participating in a group meeting and progress report every two weeks.
:::

## ENGINEERING PRACTICE

::: card Paper corpus ingestion pipeline
<p class="entry-meta">2026.08</p>
Built a corpus ingestion pipeline for literature retrieval: content-hash idempotency, a task table driving resumable execution, mixed local-GPU and cloud inference scheduling, and failure classification for retry. Processed 30,031 papers, completing 30,018 (99.96%) in 11.2 hours; each knowledge entry carries evidence links back to the source paper so retrieved results remain traceable.
:::

::: card Research workflow and multi-agent systems
<p class="entry-meta">2026.07 – present</p>
- Research workflow tooling: staged modules for model development and paper writing (13 skill modules, about 20 deterministic scripts, 90+ accompanying tests), covering topic selection, training, validation, writing and figures
- Multi-agent collaboration system: role-based sub-agents (explore, implement, review) working in parallel on long-running tasks, with progress persisted to disk and resumable after interruption; used for literature organisation, batch experiments and code review
:::

::: card Model serving deployment and operations
<p class="entry-meta">2026.08 – present</p>
Deployed model inference and web services on a self-hosted Ubuntu server: process supervision and boot persistence, session credential persistence, reverse proxy and HTTPS, and private networking. Resolved deployment issues including session credentials invalidated on service restart and read-only frontend configuration under non-loopback access.
:::

::: card Domestic AI chip operator practice
<p class="entry-meta">2026.08</p>
Participated in CANN operator competition problems: 2D convolution (FP16 / FP32 / BF16), the HardSwish activation operator, performance optimisation of an INT8 quantised GEMM, and implementations removing the 65,535 limit on the last dimension and supporting transposition combinations — involving address spaces, tiling and vectorisation.
:::

## SERVICE

::: card Computing and Artificial Intelligence Association · Vice President (hardware track)
<p class="entry-meta">2025.10 – present</p>
Responsible for the association's hardware track: organising study material, contributing to technical sessions and event organisation, and helping junior members get started with circuits and embedded systems.
:::

## TIMELINE

**Middle school** — First contact with circuits, programming and sensors in the school Arduino club; built line-following robots and similar projects.

**High school** — Self-study of Linux, Python and HarmonyOS ArkTS development; earned the Huawei HarmonyOS application developer certification.

**2025.09** — Entered Southwest University of Science and Technology, majoring in Pharmaceutical Engineering.

**2025.10** — Joined the "One Student One Chip" study group: Verilog and RISC-V processor design.

**2026.03** — Sat in on the automation department's Circuit Analysis course; began systematic cross-disciplinary technical practice.

**2026.04** — Began research training in medical imaging, responsible for algorithms and software implementation.

**2026.05 – 07** — Second prize at the university biomedical engineering innovation competition and approval of the provincial project; then a provincial second prize and a national third prize. Completed a seven-model MNIST comparison project in the same period.

**2026.07 – 08** — Summer focused on engineering practice: the paper corpus pipeline, multi-agent collaboration systems, service deployment and operations, and domestic AI chip operator problems.

**2026.09** — Transferred into Electronic Information Engineering (Honors); took part in the CUMCM mathematical modelling contest.

## MORE

Skills and tooling are on the [skills](/en/skills) page, competitions on [awards](/en/awards), and open-source code on [projects](/en/projects) and [GitHub](https://github.com/MakeBlackSheepGreat).
