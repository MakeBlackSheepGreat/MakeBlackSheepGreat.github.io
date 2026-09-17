# Research

My research direction is deep learning for medical imaging, with two recurring concerns: whether a model genuinely holds up on real data, and whether its decisions can be understood by a human reader.

## Ongoing work

### Breast ultrasound classification

Binary benign/malignant classification on breast ultrasound images. Trained on BUS-BRA, tested externally on BUSI, with emphasis on cross-dataset generalisation rather than single-set scores.

Evaluation reports AUC, sensitivity, specificity, precision and F1 together under a fixed threshold policy — in a clinical setting a missed malignancy and a false alarm cost very different things, and accuracy alone hides that.

To make the output readable for a clinician, the model also exposes Grad-CAM maps showing which part of the lesion drove the decision. This work supported three competition awards.

Code: [bucad](https://github.com/MakeBlackSheepGreat/bucad)

### Pulmonary nodule classification and risk grading

A provincial undergraduate innovation training project aiming at detection, classification and malignancy risk grading on chest CT, with interpretable evidence. Starting from public datasets such as LIDC-IDRI.

I handle data processing and model experiments: nodule extraction and preprocessing, training and evaluation, and turning experiment records into a reproducible form. The project is at the experimental stage, currently fixing splits, evaluation protocol and seeds — without those three pinned down, no later comparison means anything.

Code: [ct-nodule-risk](https://github.com/MakeBlackSheepGreat/ct-nodule-risk)

### Fluorescence-guided osteomyelitis imaging

An end-to-end system from imaging to a clinical workstation: lesion analysis, registration of white-light and fluorescence views, and the operator workflow.

Here the software engineering side had to be complete, because it ships on a disc and has to run on someone else's machine. That brought requirements well outside the algorithms: page-by-page layout review, no dead buttons, and two build configurations (GPU accelerated and CPU fallback) for different hardware.

Code: [osteo-vision](https://github.com/MakeBlackSheepGreat/osteo-vision)

## Data and setup

| Stage | What I use |
| --- | --- |
| Public datasets | BUS-BRA and BUSI (breast ultrasound), LIDC-IDRI (chest CT nodules) |
| Framework | PyTorch |
| Local compute | RTX 5060 Laptop (8 GB VRAM) with 32 GB RAM, Linux under WSL2 |
| Server | Self-hosted Ubuntu machine for inference services and batch jobs |
| Experiment management | Fixed splits and seeds; an experiment registry recording every configuration and conclusion |

8 GB of VRAM forces decisions about batch size, mixed precision and model size from the start — in hindsight, not a bad constraint to have.

## Method notes

- **Set the threshold before the run.** Judging criteria are written down before experiments start and never adjusted afterwards.
- **Negative results are recorded too.** One of my modules dropped accuracy from 77.23% to 56.78% and the training collapsed midway; the failure is fully documented because it says more than a lucky success would.
- **External validation first.** Scores on the same dataset say little about generalisation, so I look for independent test sets.
- **Reproducible by construction.** Splits, seeds and evaluation scripts stay in the repository so results can be reproduced elsewhere.
- **Metrics depend on the scenario.** In medical imaging, sensitivity and specificity usually deserve more discussion than accuracy, and the threshold belongs next to the numbers.

## Publications

I do not have formally published papers yet; the work so far has taken the form of competition entries, an ongoing research project and open-source code. What I am doing now is turning the experiments into reproducible records and writing the details up before considering submission — I would rather be able to explain why a result holds than rush one out.
