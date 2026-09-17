---
pageClass: labels
---

# publications

::: lead
No formally published papers yet. This page records ongoing work, manuscript plans and the experiment practice behind them.
:::

## ONGOING WORK

::: card Interpretable pulmonary nodule classification and risk grading from chest CT
<p class="entry-meta">Provincial undergraduate innovation training project · 2026.05 – ongoing · project member, data processing and model experiments</p>

Classification and malignancy risk grading of pulmonary nodules on chest CT, with interpretable evidence for each decision. Public datasets such as LIDC-IDRI are the starting point, and the main effort goes into making the evaluation protocol solid: fixed splits, seeds and evaluation scripts so results reproduce. At this stage I am writing up the experiment records and separating method from conclusion.

<span class="badge">PyTorch</span> <span class="badge">3D medical imaging</span> <span class="badge">Interpretability</span>
:::

::: card Breast ultrasound classification with cross-dataset external validation
<p class="entry-meta">2026.03 – 2026.07 · algorithms and software implementation</p>

Trained on BUS-BRA and tested externally on BUSI, with emphasis on cross-dataset generalisation rather than single-set scores. Evaluation reports AUC, sensitivity, specificity, precision and F1 under a fixed threshold policy; the model exposes Grad-CAM maps for review.

<span class="badge">External validation</span> <span class="badge">Grad-CAM</span> <span class="badge">Medical imaging</span>
:::

## MANUSCRIPT PLANS

- Turn the pulmonary nodule experiments into a reproducible record: data splits, evaluation protocol, ablations and failed runs all kept
- Consider writing up the method details once the evaluation protocol is stable — being able to explain why a result holds matters more to me than rushing a submission out

## DATA AND SETUP

| Stage | What I use |
| --- | --- |
| Public datasets | BUS-BRA and BUSI (breast ultrasound), LIDC-IDRI (chest CT nodules) |
| Framework | PyTorch |
| Local compute | RTX 5060 Laptop (8 GB VRAM) with 32 GB RAM, Linux under WSL2 |
| Server | Self-hosted Ubuntu machine for inference and batch jobs |
| Experiment management | Fixed splits and seeds; a registry recording every configuration and conclusion |

8 GB of VRAM forces decisions about batch size, mixed precision and model size from the start.

## PRACTICE

- **Decision rules come first**: the threshold is written down before the run and never adjusted afterwards
- **Failed runs are recorded the same way**: same template as successful ones — see [notes: negative results count too](/en/notes/negative-results)
- **An experiment registry**: every configuration, split and conclusion is logged for later comparison
- **External validation first**: scores on the same dataset say little about generalisation

For experiment details or code, see [projects](/en/projects) or email me directly.
