# 科研

我的研究方向是医学影像的深度学习，重点关注两件事：模型在真实数据上是否真的有效，以及它的判断能不能被人看懂。

::: en Research
My research direction is deep learning for medical imaging, with two recurring concerns: whether a model genuinely holds up on real data, and whether its decisions can be understood by a human reader.
:::

## 在做的工作

### 乳腺超声良恶性分类

用乳腺超声图像做良恶性二分类。数据上，训练用 BUS-BRA，外部测试用 BUSI，重点看跨数据集的泛化表现，而不是在同一批数据上把分数刷高。

评估不只看准确率，而是把 AUC、敏感度、特异度、精确率和 F1 一起报出来，并且固定阈值口径——医学场景里，"漏诊一个恶性"和"误判一个良性"的代价完全不同，只看准确率会掩盖这件事。

为了让结果对医生可读，模型还需要输出 Grad-CAM 关注区域，标出它判断时主要看了病灶的哪一部分。这部分工作支撑了后续的三项竞赛获奖。

代码：[bucad](https://github.com/MakeBlackSheepGreat/bucad)

### 胸部 CT 肺结节分类与风险分级

省级大学生创新训练计划项目，目标是在胸部 CT 上完成肺结节的分类和恶性风险分级，并给出可解释的判断依据。数据方面以 LIDC-IDRI 这一类公开数据集为起点。

我承担数据处理与模型实验部分：结节区域的提取与预处理、模型训练与评估、以及把实验记录整理成可复现的形式。项目目前处在实验阶段，正在把数据划分、评估协议和随机种子固定下来——这三样不固定，后面的所有对比都没有意义。

代码：[ct-nodule-risk](https://github.com/MakeBlackSheepGreat/ct-nodule-risk)

### 颌骨骨髓炎荧光影像诊疗

面向颌骨骨髓炎的荧光影像诊疗，做的是从影像到临床工作界面的一整套东西：病灶区域分析、白光与荧光影像的配准展示、以及医生工作站的操作流程。

这个项目里我把软件工程的部分做得比较完整，因为最终要刻盘交付、要在别人的电脑上跑起来——这带来了一堆算法之外的要求：界面布局要经得起逐页检查，按钮不能有死链接，还要有 GPU 加速和 CPU 降级两套配置以适配不同机器。

代码：[osteo-vision](https://github.com/MakeBlackSheepGreat/osteo-vision)

::: en Ongoing work
- **Breast ultrasound classification**: binary benign/malignant classification trained on BUS-BRA and tested externally on BUSI, with emphasis on cross-dataset generalisation rather than single-set scores. Evaluation reports AUC, sensitivity, specificity, precision and F1 together under a fixed threshold policy — in a clinical setting a missed malignancy and a false alarm cost very different things, and accuracy alone hides that. The model also exposes Grad-CAM maps so a reader can see which part of the lesion drove the decision. This work supported three competition awards.
- **Pulmonary nodule grading on chest CT**: a provincial undergraduate innovation project aiming at detection, classification and malignancy risk grading with interpretable evidence, starting from public datasets such as LIDC-IDRI. I handle data processing and model experiments — nodule extraction and preprocessing, training and evaluation, and keeping records reproducible. We are currently fixing splits, evaluation protocol and seeds; without those three pinned down, no later comparison means anything.
- **Fluorescence-guided osteomyelitis imaging**: an end-to-end system from imaging to a clinical workstation — lesion analysis, registration of white-light and fluorescence views, and the operator workflow. Here the software engineering side had to be complete, because it ships on a disc and has to run on someone else's machine: page-by-page layout review, no dead buttons, and two build configurations (GPU accelerated and CPU fallback) for different hardware.
:::

## 数据与实验环境

| 环节 | 用什么 |
| --- | --- |
| 公开数据集 | BUS-BRA、BUSI（乳腺超声），LIDC-IDRI（胸部 CT 肺结节） |
| 框架 | PyTorch |
| 本机算力 | RTX 5060 Laptop（8 GB 显存）+ 32 GB 内存，WSL2 下的 Linux 环境 |
| 服务器 | 自建 Ubuntu 服务器，用于部署推理服务与跑批任务 |
| 实验管理 | 数据划分与种子固定；实验登记表记录每次配置与结论 |

显存只有 8 GB，这逼着我从一开始就得考虑批次大小、混合精度和模型规模——现在回头看，这未必是坏事。

::: en Data and setup
| Stage | What I use |
| --- | --- |
| Public datasets | BUS-BRA and BUSI (breast ultrasound), LIDC-IDRI (chest CT nodules) |
| Framework | PyTorch |
| Local compute | RTX 5060 Laptop (8 GB VRAM) with 32 GB RAM, Linux under WSL2 |
| Server | Self-hosted Ubuntu machine for inference services and batch jobs |
| Experiment management | Fixed splits and seeds; an experiment registry recording every configuration and conclusion |

8 GB of VRAM forces decisions about batch size, mixed precision and model size from the start — in hindsight, not a bad constraint to have.
:::

## 方法上的几个坚持

- **先定门槛，再看结果**。实验开始前把判定标准写下来，跑完不管结果好坏都不改标准。
- **负面结果照样记录**。我有过一个创新模块把准确率从 77.23% 拉低到 56.78%，训练还在中途崩掉；这次失败后来被完整记录进了实验档案，因为它比一次侥幸的成功更能说明问题。
- **外部验证优先**。同一批数据上刷出来的分数说明不了泛化能力，尽量找独立数据集做测试。
- **过程可复现**。数据划分、随机种子、评估脚本都留在仓库里，换台机器能跑出同样的结果。
- **指标要分场景看**。医学影像里敏感度和特异度往往比准确率更值得讨论，报指标的时候把阈值写清楚。

::: en Method notes
- **Set the threshold before the run.** Judging criteria are written down before experiments start and never adjusted afterwards.
- **Negative results are recorded too.** One of my modules dropped accuracy from 77.23% to 56.78% and the training collapsed midway; the failure is fully documented because it says more than a lucky success would.
- **External validation first.** Scores on the same dataset say little about generalisation, so I look for independent test sets.
- **Reproducible by construction.** Splits, seeds and evaluation scripts stay in the repository so results can be reproduced elsewhere.
- **Metrics depend on the scenario.** In medical imaging, sensitivity and specificity usually deserve more discussion than accuracy, and the threshold belongs next to the numbers.
:::

## 关于论文

目前我还没有正式发表的论文，相关工作以竞赛作品、在研项目和开源代码的形式推进。我正在做的准备是：把手上的实验整理成可复现的记录，把方法上的细节写清楚，再考虑投稿。比起赶一篇出来，我更想先把"这个结果为什么成立"讲明白。

::: en Publications
I do not have formally published papers yet; the work so far has taken the form of competition entries, an ongoing research project and open-source code. What I am doing now is turning the experiments into reproducible records and writing the details up before considering submission — I would rather be able to explain why a result holds than rush one out.
:::
