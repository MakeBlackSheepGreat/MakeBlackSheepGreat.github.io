---
pageClass: labels
---

# Awards and project approvals

## Competitions

::: card China Youth Science and Technology Innovation "Open Competition" (2026) · National second prize
October 2026, hosted by the Communist Youth League Central Committee. The problem set was intelligent fluorescence-guided diagnosis and treatment of osteomyelitis of the jaw, posted by Chengdu Keaoda Optoelectronic Technology Co., Ltd.

The entry was *An intelligent fluorescence-guided diagnosis and treatment platform for precise debridement of osteomyelitis of the jaw, and its industrial application*. It takes the form of an offline medical imaging workstation covering file admission, case management, image processing, AI candidate hints, manual annotation, physician review and evidence export, all within one traceable flow.

Inputs cover white-light and fluorescence JPEGs, single-channel or three-view MP4 video, and CBCT or STL three-dimensional reference data. Outputs are fused views, pseudo-colour images, risk maps, uncertainty maps and a structured evidence bundle. The platform frames its results as intraoperative reference signals and review material, and keeps physician review as the final decision layer.

The stack is a Python 3.11 and FastAPI backend, a Vue 3 front-end and PyTorch inference. Three-dimensional rendering is split into a separate Three.js runtime, and an Electron host packages the desktop build for offline distribution. I designed the platform and implemented all of it, covering backend services and data contracts, the front-end workstation, the inference pipeline and model adapters, the three-dimensional runtime, the test suite and desktop packaging.
:::

::: card 11th National College Student Biomedical Engineering Innovation Design Competition · National third prize
July 2026, hosted by the Chinese Society of Biomedical Engineering.

The entry was *A benign/malignant classification and diagnosis support system for breast tumours on ultrasound images*, the same work that first went through the university-level round. The system takes breast ultrasound images as input and returns candidate lesion regions, a benign/malignant call and a risk band, along with the areas the model attended to.

Technically it uses a two-stage pipeline with a complementary dual-model ensemble and lesion-region guidance. A full-image branch keeps the acquisition background and surrounding tissue context. A segmentation branch produces a lesion mask; connected-component extraction and boundary dilation crop the region of interest, which is then scored by the same classification family at the local view. The two lines of evidence are fused in logit space, and an area gate falls back to the full-image result when the mask is anomalous. Classifiers are trained with patient-level five-fold cross-validation, so samples from one patient never straddle folds, and inference adds multi-scale crop and horizontal-flip test-time augmentation. For interpretability, Grad-CAM attention maps are shown alongside the segmentation mask and the cropped region, which separates where the model looked from where the lesion is.

I did the software development and the technical part of the project report: data preprocessing and split definitions, training and evaluation of the classification and segmentation models, the ensemble and fusion pipeline, the Grad-CAM visualisation, the demo system, and the methods, experiments and results sections of the report. The remaining work was done by other team members.
:::

::: card 6th Sichuan Provincial Biomedical Engineering Innovation Design Competition · Provincial second prize
June 2026, hosted by the Sichuan Provincial Department of Education.

The entry was *Interpretable pulmonary nodule classification and malignancy risk grading from chest CT*, a four-person team. The system takes DICOM series as input, performs series reading and ordering, candidate localisation and region-of-interest cropping, and outputs a malignancy probability, a low/medium/high risk band and a structured report.

Rather than a full three-dimensional network, the approach uses a 2.5D six-channel input: several adjacent CT slices extracted around the candidate's centre slice, concatenated with a candidate-region mask from a segmentation network. That mask acts as a structural prior telling the classifier where the candidate sits. This keeps inter-slice context while avoiding the video-memory, inference-latency and deployment costs of a 3D network. The classification backbone was settled after several rounds of screening. Training uses patient-level splits, so no patient straddles folds, and probability calibration makes the output scores interpretable. A separate external cohort is held out purely to assess robustness — it takes no part in training, threshold selection or calibration tuning. Candidate localisation, the region mask and Grad-CAM are shown separately, separating which slice the candidate lies on, what the structural prior is, and where the model attends. Where one lung holds several candidates, the system reports evidence for each rather than collapsing them into a single patient-level conclusion.

I did the software development and the technical part of the project report: data processing and model experiments, the training and evaluation pipeline, the interpretability outputs, and the methods, experiments and results sections of the report. The remaining work was done by other team members. The same work was approved as a provincial undergraduate innovation training project.
:::

::: card SWUST Biomedical Engineering Innovation Design Competition · University-level second prize
May 2026.

The entry was *A benign/malignant classification and diagnosis support system for breast tumours on ultrasound images*, the same work later entered at national level. This round covered the full cycle from topic selection, data preparation and model implementation through to the on-site defence — my first complete competition cycle.

I did the software development and the technical part of the project report; the remaining work was done by other team members.
:::

::: card "Xuechuang Cup" National College Student Entrepreneurship Simulation Competition · University-level third prize
2026, three-person team, responsible for the technical proposal and the data work.
:::

## Project approvals

| Date | Project | Notes |
| --- | --- | --- |
| 2026.05 | Provincial undergraduate innovation training project | Interpretable pulmonary nodule classification and risk grading from chest CT; ongoing, I handle data processing and model experiments |
| 2025.10 | "One Student One Chip" study group | Self-study of Verilog and RISC-V, progressed to the E5 stage of RTL simulation |

## University award

- SWUST Science and Technology Innovation Award (2026)

## Competitions entered without a prize

Competitions entered without an award are listed below as well.

- **China International College Students' Innovation Competition, campus selection round (2026)**: two projects — a lightweight ultrasound screening system for primary care, and a drug-storage environment monitoring system for township clinics. I worked on algorithms and system implementation.
- **15th "China Software Cup" College Student Software Design Competition**: team entry, backend and algorithm modules.
- **CANN operator contest, August round**: several operator problems on domestic AI chips, including 2D convolution, HardSwish and quantised GEMM.

## Earlier

In middle school I joined the school Arduino club, working with circuits, programming and sensors on line-following robot projects.

In high school I earned the Huawei HarmonyOS application developer certification — the first certificate to come out of my self-directed study.
