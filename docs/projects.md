# 项目

以下按方向列出已公开发布的项目；未公开的仓库仅列名称与简介，不提供链接。


## 医学影像 AI

::: card 乳腺超声良恶性分类辅助诊断系统（bucad）
乳腺超声影像的良恶性二分类研究。用 BUS-BRA 数据集训练、BUSI 数据集做外部测试，输出病灶区域提示、风险分层与 Grad-CAM 关注区域可视化，供复核参考。

承担的工作：CNN 分类模型的实现与调参、评估指标与阈值口径的固定、Grad-CAM 可视化模块，以及演示用的推理封装。该工作支撑三项竞赛获奖。

技术：Python · PyTorch · 医学影像 · Grad-CAM

[仓库地址](https://github.com/MakeBlackSheepGreat/bucad)
:::

::: card 胸部 CT 肺结节智能分类与可解释性风险分级（ct-nodule-risk）
省级大学生创新训练计划项目，目标是在胸部 CT 上完成肺结节的分类与恶性风险分级，并给出可解释的依据。

我承担数据处理与模型实验部分：结节区域的提取与预处理、训练与评估流程、以及把实验记录整理成可复现的形式（固定数据划分、随机种子和评估脚本）。项目在研，目前的重心是把评估协议定稳。

技术：Python · PyTorch · 3D 医学影像 · 可解释性

[仓库地址](https://github.com/MakeBlackSheepGreat/ct-nodule-risk)
:::

::: card 颌骨骨髓炎智能化荧光诊疗医生工作站（osteo-vision）
面向颌骨骨髓炎荧光影像诊疗的医生工作站，包含影像查看、病灶标注与三维展示。前后端分离：前端是 Vue3 工作站界面，后端 FastAPI 提供接口，三维部分用 Three.js。

比赛要求刻盘交付，因此在算法之外做了不少工程工作：GPU 加速与 CPU 降级的双发行配置、跨机器的依赖与路径检查，以及用自动化测试对全部页面和按钮做回归（13 个页面、265 个按钮、192 次实际点击、零失败）。

技术：Vue3 · FastAPI · Three.js · Electron · Playwright

[仓库地址](https://github.com/MakeBlackSheepGreat/osteo-vision)
:::

## 智能体与科研工具

::: card SWUST Code —— 终端原生 AI 编程智能体（swust-code）
基于开源 coding agent 重写的个人版本，加上了持久记忆、基于中小型模型的多智能体工作流和目标驱动的自主执行能力，配了独立的文档站。项目已可日常使用，并用于其他项目的开发。

技术：TypeScript · Node.js · Multi-Agent · CLI

[代码仓库](https://github.com/MakeBlackSheepGreat/swust-code) · [文档站仓库](https://github.com/MakeBlackSheepGreat/swust-code-docs)
:::

::: card IPC Vision —— MNIST 七模型对比工程（IPC_vision）
一个把"从模型到应用"整条链路走通的练习：BP、CNN、ConvNeXt、LeNet-5、ResNet、ViT、MobileNetV2 七种模型在同一套数据与评估协议下对比，外面包了 Flask API、Web 前端和一个 Electron 桌面应用。目的是在同一任务与同一评估协议下比较不同规模模型的真实差距。

技术：Python · PyTorch · Flask · Electron

[仓库地址](https://github.com/MakeBlackSheepGreat/IPC_vision)
:::

::: card PDF 向量检索（pdf-vector-search）
面向 Agent 的本地 PDF 知识库检索工具：把文档切片、向量化后存进本地向量库，通过命令行接口供上层 Agent 调用，用来做文献检索与问答。设计目标是使检索结果携带原文出处，而非逐篇送入模型阅读。

技术：Python · 向量检索 · RAG · CLI

[仓库地址](https://github.com/MakeBlackSheepGreat/pdf-vector-search)
:::

## 工程实践

以下工作没有独立仓库，但投入的时间不少于编码工作。

::: card 论文语料摄取流水线
构建可检索、可追溯的文献知识条目：分级并发、内容哈希幂等、本机与云端混合推理；11.2 小时完成 30,031 篇中的 30,018 篇（99.96%），每条条目附原文证据链接。工程细节见[笔记](/notes/paper-corpus-pipeline)里。
:::

::: card Agent 服务的部署与运维
把自建服务放到公网跑通：进程托管与开机自启、凭据持久化、反向代理与 HTTPS、内网组网。涉及进程级随机密钥导致重启后会话失效、会话 cookie 作用域限制等问题，整理在[笔记](/notes/agent-service-public)里。
:::

::: card 国产 AI 芯片算子练习
参加 CANN 算子天梯赛的几道赛题，写二维卷积（FP16/FP32/BF16）、HardSwish 激活，以及量化 GEMM 的性能优化题。涉及地址空间、分块与向量化等底层处理。
:::

## 私有工作台（代码未公开）

这些是日常在用的科研与工程工作台，目前是私有仓库，如需了解可以邮件联系我。

- **Neural_Paper_Skill** —— 神经网络研发与论文写作的工作流技能集，覆盖创新、训练、验证、写作与画图环节
- **CordiSwarm** —— 插件内核驱动的科研蜂群智能体系统，用于长周期任务的自主推进
- **Regain-Mamba / LesioNeXt-Code** —— 病灶分析与遥感图像的模型研究代码，含可复现的训练与评估流程
- **WeftMesh** —— 本地 AI Agent 软件，星型拓扑与设备互联协议
- **SwustSpirit** —— 面向本校学生的校园信息工具，含课程资料索引与经验时间线

## 小工具与资料归档

::: card BearPi-Pico H3863 开发资料（BearPi-Pico-H3863）
小熊派 BearPi-Pico H3863 的文档、芯片手册、固件与源码指引归档。整理原因是配套资料分散，归档后便于后续查阅与复现。

技术：嵌入式 · 资料整理

[仓库地址](https://github.com/MakeBlackSheepGreat/BearPi-Pico-H3863)
:::

::: card HTML 长图导出技能（html-png-exporter-skill）
给编码智能体写的一个技能：把 HTML 长页面渲染成可预览的整页长图，用原生 Canvas 导出 PNG。目的是让自动生成的报告与海报在修改前可被实际查看。

技术：JavaScript · Canvas · Agent Skill

[仓库地址](https://github.com/MakeBlackSheepGreat/html-png-exporter-skill)
:::

::: card dsh-OHDSH —— 鸿蒙上的 Agent 运行时（dsh-OHDSH）
将 DeepSeek Harness 的可复现实现移植到 HarmonyOS 的尝试，主要工作为真机启动故障定位，最终确认若干系统层面限制并给出绕行方案。

技术：HarmonyOS · ArkTS · C

[仓库地址](https://github.com/MakeBlackSheepGreat/dsh-OHDSH)
:::

## 其余公开仓库

| 仓库 | 说明 |
| --- | --- |
| [MakeBlackSheepGreat](https://github.com/MakeBlackSheepGreat/MakeBlackSheepGreat) | GitHub 个人主页仓库 |
| [campus-network-auto-login](https://github.com/MakeBlackSheepGreat/campus-network-auto-login) | 校园网自动登录小工具（JavaScript） |

更多的实验性仓库可以直接看我的 [GitHub 主页](https://github.com/MakeBlackSheepGreat)。
