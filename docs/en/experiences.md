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

**Breast ultrasound benign/malignant classification and diagnosis support** (2026.03 – 2026.07): binary classification trained on BUS-BRA and evaluated on the independent BUSI test set for external validation. Implemented the CNN training and evaluation pipeline, fixed the evaluation metrics and decision threshold policy, and produced Grad-CAM attention visualisations. This work supported two competition awards (a university-level second prize and a national third prize).

**Provincial undergraduate innovation training project: interpretable pulmonary nodule classification and malignancy risk grading from chest CT** (approved 2026.05, ongoing): responsible for data processing and model experiments, including fixed data splits, random seeds and evaluation scripts to ensure reproducibility. Current stage: validating the stability of the evaluation protocol and consolidating experiment records.

**Fluorescence-guided osteomyelitis imaging software system** (2026.06 – 2026.08): independently implemented the physician workstation prototype and the algorithm side, covering image review, lesion annotation and 3D display, with two release configurations (GPU accelerated and CPU fallback) to meet delivery requirements. The entry, *An intelligent fluorescence-guided diagnosis and treatment platform for precise debridement of osteomyelitis of the jaw, and its industrial application*, won a national second prize at the 2026 China Youth Science and Technology Innovation "Open Competition".
:::

::: card "One Student One Chip" study group · RISC-V and digital design
<p class="entry-meta">2025.10 – present</p>
Studying Verilog and RISC-V processor design from digital logic fundamentals, currently at the E5 stage of RTL simulation; participating in a group meeting and progress report every two weeks.
:::

## ENGINEERING PRACTICE

::: card OpenHarmony build compatibility framework contributions (build_in_harmonyos)
<p class="entry-meta">2026.08 – 2026.10</p>
Submitted and merged 24 pull requests into the OpenHarmony PC build compatibility framework hosted on AtomGit, porting 22 third-party libraries to OpenHarmony aarch64: GDAL, OpenCASCADE, GTK+ 3, glib, pango, atk, gdk-pixbuf, cairo-gobject, harfbuzz, speex, asterisk-srtp, asterisk-speex, epoxy, goocanvas, flow-control, asymptote, qtserialport, abiword-plugin-opml, bashdb, termsvg and termshot.

Each port is built on a Conan recipe and follows the project's knowledge-graph entries: the build interpreter is not a hard gate in CI, Autotools `config.guess` platform detection, HMDFS temporary-file handling, meson `host_machine` detection, and EGL headers taken from the SDK sysroot. Also fixed two CI infrastructure issues where mis-tracked runtime state files blocked the full verification run.
:::

::: card OpenHarmony platform support for a DSH tooling plugin (dsh-ops)
<p class="entry-meta">2026.10 – present</p>
Filed an issue and a pull request on the DSH low-level operations plugin dsh-ops to add OpenHarmony platform support to its native worker. Identified three behavioural differences between the OpenHarmony kernel and Linux: `openat2` terminates the process with `SIGSYS` instead of returning `ENOSYS`, so the dependency's portable fallback never runs; the root path anchor and `/storage` are refused to open, so the preflight stage of path checking always fails; and `fsync` on an `O_PATH` directory descriptor returns `EBADF`, so `replace` reports failure even when the rename already succeeded.

The fix uses three platform-gated compilation blocks: the guard moves to the head of `open_beneath` and returns `NOSYS` to trigger the carryable fallback, path checking starts from the deepest openable ancestor prefix, and the flush reopens the parent directory by path as a best-effort step. Verified on OpenHarmony PC hardware (kernels 1.12.0 and 1.13.0) with an 8-case worker suite and 7 out-of-bounds security-boundary cases; non-OpenHarmony targets keep the upstream statements verbatim. The pull request is still under review.
:::

::: card Defect reports to a third-party project (dsh-connect-workbuddy)
<p class="entry-meta">2026.10</p>
While diagnosing someone else's issue I found and reported two distinct defects, both since fixed:

- **A destructive defect in the settings write channel**: `__save` persists the host's own already-resolved `regions` value as the field's entire new value, so the first save blanks the live model catalog and the agent default model disappears. The report carried a full environment matrix, source locations and before/after readings.
- **A faulty default in context budgeting**: `applyContextBudgets` clamps every model above 200K down to 200K, discarding a model's real context window whenever the user has not set an explicit budget; the default also contradicts the upstream throttling line. In a measured catalog of 17 upstream models, 15 were wrongly clamped.
:::

::: card Paper corpus ingestion pipeline
<p class="entry-meta">2026.08</p>
Built a corpus ingestion pipeline for literature retrieval: content-hash idempotency, a task table driving resumable execution, mixed local-GPU and cloud inference scheduling, and failure classification for retry. Processed 30,031 papers, completing 30,018 (99.96%) in 11.2 hours; each knowledge entry carries evidence links back to the source paper so retrieved results remain traceable.
:::

::: card Research workflow and multi-agent systems
<p class="entry-meta">2026.07 – present</p>
- Research workflow tooling: staged modules for model development and paper writing (13 skill modules, about 20 deterministic scripts, 90+ accompanying tests), covering topic selection, training, validation, writing and figures
- Research swarm system: a multi-agent platform with a task board as the single source of truth, idempotent task dispatch keyed on plan versions and quality gates; it takes models from several families and runs end-to-end research flows on a self-hosted server
- Multi-agent collaboration: role-based sub-agents (explore, implement, review) working in parallel on long-running tasks, with progress persisted to disk and resumable after interruption; used for literature organisation, batch experiments and code review
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
<p class="entry-meta">Southwest University of Science and Technology · joined 2025.10 · Vice President since 2026.09</p>
Joined in October 2025 and has served as Vice President (hardware track) since September 2026. Responsible for the association's hardware track: organising study material, contributing to technical sessions and event organisation, and helping junior members get started with circuits and embedded systems.
:::

::: card Jingguan Tianxia Photography Association · Council Member
<p class="entry-meta">Southwest University of Science and Technology · 2026.09 – present</p>
Involved in the association's routine affairs and event organisation.
:::

## TIMELINE

**Middle school (2019 – 2020)** — First contact with circuits, programming and sensors in the school Arduino club; built line-following robots and similar projects. In the same period I taught myself Linux system administration and NAT traversal, founded the TAP Minecraft server, opened the CIE MC server studio, and joined a Raspberry Pi enthusiast group.

**High school** — Self-study of Linux, Python and HarmonyOS ArkTS development; earned the Huawei HarmonyOS application developer certification.

**2025.09** — Entered Southwest University of Science and Technology, majoring in Pharmaceutical Engineering.

**2025.10** — Joined the "One Student One Chip" study group: Verilog and RISC-V processor design.

**2026.03** — Sat in on the automation department's Circuit Analysis course; began systematic cross-disciplinary technical practice.

**2026.04** — Began research training in medical imaging, responsible for algorithms and software implementation.

**2026.05 – 07** — Second prize at the university biomedical engineering innovation competition and approval of the provincial project; then a provincial second prize and a national third prize. Completed a seven-model MNIST comparison project in the same period.

**2026.07 – 08** — Summer focused on engineering practice: the paper corpus pipeline, multi-agent collaboration systems, service deployment and operations, and domestic AI chip operator problems.

**2026.09** — Transferred into Electronic Information Engineering (Honors) and started catching up on the electronics core; took up the roles of Vice President (hardware track) of the Computing and Artificial Intelligence Association and Council Member of the Jingguan Tianxia Photography Association.

**2026.08 – 10** — Submitted and merged 24 pull requests into the OpenHarmony build compatibility framework, porting 22 third-party libraries to OpenHarmony aarch64; in the same period filed the OpenHarmony platform-support pull request for the DSH tooling plugin, completed on-device diagnosis and fixes for the kernel behaviour differences, and filed two defect reports against another third-party plugin.

**2026.10** — National second prize at the 2026 China Youth Science and Technology Innovation "Open Competition" for the fluorescence-guided osteomyelitis platform, a special event of the 15th "Challenge Cup".

## MORE

Skills and tooling are on the [skills](/en/skills) page, competitions on [awards](/en/awards), and open-source code on [projects](/en/projects) and [GitHub](https://github.com/MakeBlackSheepGreat).
