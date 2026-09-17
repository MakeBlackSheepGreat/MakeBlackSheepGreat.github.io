---
pageClass: labels
---

# publications

::: lead
No formally published papers yet. This page records ongoing work, the infrastructure supporting it, and the experiment methodology I follow.
:::

::: lead
ORCID: [0009-0006-7544-5954](https://orcid.org/0009-0006-7544-5954)
:::

## ONGOING WORK

::: card Interpretable pulmonary nodule classification and malignancy risk grading from chest CT
<p class="entry-meta">Provincial undergraduate innovation training project · approved 2026.05, ongoing · data processing and model experiments</p>

The aim is classification and malignancy risk grading of pulmonary nodules on chest CT, with interpretable evidence for each decision. Public datasets such as LIDC-IDRI are the starting point. The current focus is the stability of the evaluation protocol: fixed data splits, seeds and evaluation scripts so that comparisons between configurations are meaningful, with method and conclusion kept separate.

<span class="badge">PyTorch</span> <span class="badge">3D medical imaging</span> <span class="badge">Interpretability</span>
:::

::: card Breast ultrasound classification with cross-dataset external validation
<p class="entry-meta">2026.03 – 2026.07 · algorithms and software implementation</p>

A benign/malignant classification baseline trained on BUS-BRA and evaluated on the independent BUSI test set, with the emphasis on cross-dataset generalisation rather than gains on a single dataset. Evaluation reports AUC, sensitivity, specificity, precision and F1 under a fixed threshold policy; the model exposes Grad-CAM attention maps as interpretability evidence.

<span class="badge">External validation</span> <span class="badge">Grad-CAM</span> <span class="badge">Medical imaging</span>
:::

::: card Fluorescence-guided osteomyelitis imaging software system
<p class="entry-meta">2026.06 – 2026.08 · independently implemented</p>

An end-to-end chain from image processing to a clinical workstation interface for fluorescence-guided osteomyelitis imaging: registration and display of white-light and fluorescence views, lesion annotation and 3D review. The research interest lies in how algorithm outputs are organised into a clinically usable workflow, and in the engineering constraints of a restricted delivery environment (offline, physical media, heterogeneous hardware).

<span class="badge">Three.js</span> <span class="badge">Medical software</span> <span class="badge">Delivery</span>
:::

## RESEARCH INFRASTRUCTURE

::: card Literature corpus knowledge base and ingestion pipeline
<p class="entry-meta">2026.08</p>

A local knowledge base built to make literature review more efficient: content-hash idempotency, a task table driving resumable execution, and mixed local-GPU and cloud inference scheduling. 30,031 papers were processed, completing 30,018 (99.96%) in 11.2 hours — about 2.5 seconds per paper. Every knowledge entry carries evidence links back to the source paper, with a pending-review queue promoted by human checking, so retrieved results remain traceable.

<span class="badge">Retrieval augmentation</span> <span class="badge">Pipeline engineering</span> <span class="badge">Evidence trail</span>
:::

::: card Research workflow tooling and experiment management
<p class="entry-meta">2026.07 – present</p>

Staged tooling for model development and paper writing: 13 skill modules and about 20 deterministic scripts with 90+ accompanying tests, covering topic selection, training, validation, writing and figure generation. On the experiment side, a single record template and an experiment registry keep configurations, data splits and conclusions together.

<span class="badge">Workflow</span> <span class="badge">Experiment management</span> <span class="badge">Reproducibility</span>
:::

## DATA AND SETUP

| Stage | Configuration |
| --- | --- |
| Public datasets | BUS-BRA and BUSI (breast ultrasound), LIDC-IDRI (chest CT nodules) |
| Framework | PyTorch |
| Local compute | RTX 5060 Laptop (8 GB VRAM) with 32 GB RAM, Linux under WSL2 |
| Server | Self-hosted Ubuntu machine for inference services and batch experiments |
| Experiment management | Fixed splits and seeds; a registry recording every configuration and conclusion |

The 8 GB VRAM budget requires trade-offs between batch size, mixed precision and model size, which keeps lightweight approaches a standing interest.

## METHOD

- **Decision criteria in advance**: the threshold is set and recorded before the run, and never adjusted afterwards
- **Failed runs recorded in the same format**: for example, an attention routing module that dropped accuracy from 77.23% to 56.78% and collapsed mid-training is fully archived (see [notes](/en/notes/negative-results))
- **Experiment registry**: configurations, splits and conclusions logged for later comparison
- **External validation first**: metrics on the source dataset say little about generalisation
- **Metrics interpreted per scenario**: in medical imaging, sensitivity and specificity usually deserve more discussion than accuracy, and thresholds are reported alongside the numbers

## MANUSCRIPT PLANS

- Turn the pulmonary nodule experiments into a reproducible record: data splits, evaluation protocol, ablations and failed runs preserved
- Once the evaluation protocol is stable, write up the method details and consider submission

For experiment details or code, see the [projects](/en/projects) page or email me directly.
