---
pageClass: labels
---

# 项目

以下按方向列出已公开发布的项目；未公开的仓库仅列名称与简介，不提供链接。


## 医学影像 AI

::: card 乳腺超声良恶性分类辅助诊断系统（bucad）
乳腺超声影像的良恶性二分类研究。用 BUS-BRA 数据集训练、BUSI 数据集做外部测试，输出病灶区域提示、风险分层与 Grad-CAM 关注区域可视化，供复核参考。

承担的工作：CNN 分类模型的实现与调参、评估指标与阈值口径的固定、Grad-CAM 可视化模块，以及演示用的推理封装。该工作支撑两项竞赛获奖（校赛二等奖与国家级三等奖）。

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

## 开源项目贡献

::: card 开源鸿蒙编译适配框架 · 贡献者（build_in_harmonyos）
面向 OpenHarmony aarch64 的开源软件编译、固化与分发框架，基于 Conan 包管理器，内置错误匹配引擎与知识图谱。我在 2026.08 – 2026.10 期间提交并合入 24 个 PR，把 22 个三方库适配到鸿蒙平台。

适配范围：GDAL、OpenCASCADE、GTK+ 3、glib、pango、atk、gdk-pixbuf、cairo-gobject、harfbuzz、speex、asterisk-srtp、asterisk-speex、epoxy、goocanvas、flow-control、asymptote、qtserialport、abiword-plugin-opml、bashdb、termsvg、termshot。另修复两处 CI 基础设施问题（被误跟踪的运行时状态文件阻塞全量校验）。

技术：Python · Conan · OpenHarmony · Autotools / CMake / Meson · Zig

[仓库地址](https://atomgit.com/OpenHarmonyPCDeveloper/build_in_harmonyos)
:::

::: card DSH 底层操作工具插件 · 平台贡献者（dsh-ops）
DSH 的性能工具插件，用 Rust 重写文件检索与批处理以降低 token 消耗与任务耗时。我提交了 issue 与 PR，为原生 worker 增加 OpenHarmony 平台支持。

定位到三处鸿蒙内核与 Linux 的行为差异：`openat2` 直接以 `SIGSYS` 终止进程而非返回 `ENOSYS`，使依赖库的 portable 回退永不触发；根路径锚点与 `/storage` 被拒绝打开，路径检查的 preflight 恒定失败；对 `O_PATH` 目录 fd 执行 `fsync` 返回 `EBADF`，使 rename 已成功却仍报失败。修复采用三处平台条件编译门控，非鸿蒙目标逐字保留上游语句。真机验证覆盖 8 项 worker 用例与 7 项越界安全边界用例。

技术：Rust · Node.js · OpenHarmony · 条件编译

[仓库地址](https://github.com/T-Auto/dsh-ops) · [PR #53](https://github.com/T-Auto/dsh-ops/pull/53)
:::

::: card DSH 连接插件 · 缺陷报告者（dsh-connect-workbuddy）
在排查他人 issue 的过程中发现并报告了两个独立缺陷，均已合入修复。报告附完整环境矩阵、源码定位与实测读数。

- 配置写入通道的破坏性缺陷：`__save` 以宿主自身已解析出的 `regions` 值作为该字段的新值整体持久化，首次保存即清空运行期候选目录，代理默认模型随之消失
- 上下文预算默认值缺陷：`applyContextBudgets` 将所有超过 200K 的模型一律压到 200K，用户未显式配置预算时模型真实上下文被丢弃，且该默认值与上游节流线自相矛盾

技术：TypeScript · 配置通道追踪 · 缺陷复现与最小证据
:::

## 智能体与科研工具

::: card SWUST Code —— 终端原生 AI 编程智能体（swust-code）
基于开源 coding agent 增量改造的个人版本，加上了持久记忆、基于中小型模型的多智能体工作流和目标驱动的自主执行能力，配了独立的文档站。项目已可日常使用，并用于其他项目的开发。

技术：TypeScript · Node.js · Multi-Agent · CLI

[代码仓库](https://github.com/MakeBlackSheepGreat/swust-code) · [文档站仓库](https://github.com/MakeBlackSheepGreat/swust-code-docs)
:::

::: card IPC Vision —— MNIST 七模型对比工程（IPC_vision）
一个把"从模型到应用"整条链路走通的练习：BP、CNN、ConvNeXt、LeNet-5、ResNet、ViT、MobileNetV2 七种模型在同一套数据与评估协议下对比，外层封装了 Flask API、Web 前端和一个 Electron 桌面应用。目的是在同一任务与同一评估协议下比较不同规模模型的真实差距。

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
构建可检索、可追溯的文献知识条目：分级并发、内容哈希幂等、本机与云端混合推理；11.2 小时完成 30,031 篇中的 30,018 篇（99.96%），每条条目附原文证据链接。工程细节见[笔记](/notes/paper-corpus-pipeline)。
:::

::: card Agent 服务的部署与运维
把自建服务放到公网跑通：进程托管与开机自启、凭据持久化、反向代理与 HTTPS、内网组网。涉及进程级随机密钥导致重启后会话失效、会话 cookie 作用域限制等问题，整理在[笔记](/notes/agent-service-public)里。
:::

::: card 个人主页站点
双语个人站点，VitePress 静态生成，GitHub Pages 与 Cloudflare Pages 双平台发布。页面内容经渲染级核验脚本断言（两站共 60 余项），并配套零宽字符水印与诱饵层的反抓取设计。
:::

::: card 国产 AI 芯片算子练习
参加 CANN 算子天梯赛的几道赛题，写二维卷积（FP16/FP32/BF16）、HardSwish 激活，以及量化 GEMM 的性能优化题。涉及地址空间、分块与向量化等底层处理。
:::

## 私有工作台（代码未公开）

这些是日常在用的科研与工程工作台，目前是私有仓库，如需了解可以邮件联系我。

- **Neural_Paper_Skill** —— 神经网络研发与论文写作的工作流技能集，覆盖创新、训练、验证、写作与画图环节
- **CordiSwarm** —— 插件内核驱动的科研蜂群智能体系统：以看板为任务真值，按计划版本幂等派发任务并设质量门禁，接入多家族大模型；已在自建服务器上线，跑通端到端研究流程
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
| [dsh-OHDSH](https://github.com/MakeBlackSheepGreat/dsh-OHDSH) | 鸿蒙上的 Agent 运行时（HarmonyOS · ArkTS · C） |

更多的实验性仓库可以直接看我的 [GitHub 主页](https://github.com/MakeBlackSheepGreat)。
