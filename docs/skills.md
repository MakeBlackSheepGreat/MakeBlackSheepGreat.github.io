# 技能

这里只写我确实用过的东西，用过的程度也照实说，不给自己加星。

::: en Skills
Only what I have actually used, with an honest note on how far I have taken each one.
:::

## 深度学习

| 方向 | 熟悉程度 | 具体做过什么 |
| --- | --- | --- |
| PyTorch 训练与评估 | 熟练 | 分类与分割模型的训练、外部验证、指标计算；数据划分与随机种子固定 |
| 医学影像数据处理 | 熟练 | 超声与 CT 影像的预处理、增强、ROI 处理；多数据集统一评估协议 |
| 可解释性 | 熟练 | Grad-CAM 关注区域可视化，用于向医生解释模型判断 |
| 模型工程 | 一般 | 轻量化与端侧部署的尝试，模型导出与推理封装 |
| 自然语言处理 / 小型语言模型 | 入门 | 微调与小模型推理实验，还在学习中 |

## 智能体（Agent）系统

- **多智能体编排**：给子智能体分角色（探索、实现、审查）并并行派发任务，长任务做进度落盘与断点续跑
- **工作流设计**：把读文献、跑实验、整理结果串成可重复执行的流水线
- **上下文与记忆管理**：把踩过的坑写进项目记忆与规则文件，减少重复试错
- **工具链开发**：写过面向 Agent 的 PDF 检索工具、编码智能体技能与文档站，也基于开源项目改过自己的编码智能体

::: en Agent systems
- **Multi-agent orchestration**: role-based sub-agents (explore, implement, review) dispatched in parallel, with progress checkpointing for long runs
- **Workflow design**: literature reading, experiments and write-up chained into repeatable pipelines
- **Context and memory management**: keeping hard-won lessons in project memory and rules files
- **Tooling**: a PDF retrieval tool for agents, agent skills and a documentation site; plus a personal coding-agent build based on an open-source project
:::

## 工程与部署

- **Linux**：日常开发环境；服务器上的服务部署、进程托管、日志排查
- **服务与网络**：反向代理、内网组网、内网穿透与隧道、域名与 HTTPS 配置
- **Python 工程**：uv / venv 环境管理、依赖与版本问题排查、脚本与命令行工具开发
- **Git 与 GitHub**：分支、变基、历史清理、GitHub Actions 自动构建与发布
- **测试与交付**：用自动化测试对界面做全量回归，发行包打包与跨机器验证

::: en Engineering and deployment
- **Linux**: daily development environment; service deployment, process supervision and log triage on servers
- **Services and networking**: reverse proxies, private networking, tunnels, domain and HTTPS setup
- **Python engineering**: uv/venv environments, dependency troubleshooting, scripts and CLI tools
- **Git and GitHub**: branching, rebasing, history cleanup, GitHub Actions CI and deployment
- **Testing and delivery**: automated full-page UI regression, packaging release builds and verifying them on other machines
:::

## 科研工作方式

- **实验记录**：判定标准前置、失败实验与成功实验同格式记录、实验配置与结论登记成表
- **可复现性**：数据划分、随机种子、评估脚本入库；换机器能跑出同样的结果
- **领域知识**：熟悉医学影像任务的基本评价体系（AUC、敏感度、特异度、F1），知道这些指标在临床场景里各自的含义和局限

::: en Research practice
- **Record-keeping**: criteria fixed before the run, failed runs documented in the same format as successful ones, configurations and conclusions kept in a registry
- **Reproducibility**: splits, seeds and evaluation scripts in the repository, so results reproduce on another machine
- **Domain knowledge**: comfortable with the standard evaluation set for medical imaging (AUC, sensitivity, specificity, F1) and aware of what each does and does not mean clinically
:::

## 语言与平台

- **Python**：主要工作语言，熟练
- **C 语言**：基础水平，做过课程与嵌入式练习
- **鸿蒙 ArkTS**：持华为鸿蒙应用开发者认证，写过应用层代码
- **Verilog**：学习阶段，在"一生一芯"里做过 RTL 仿真
- **日语**：已通过大学日语四级，正在准备 JLPT N2
- **英语**：能读论文和技术文档，写作还在练

::: en Languages
- **Python**: primary working language
- **C**: basic level, coursework and embedded exercises
- **HarmonyOS ArkTS**: certified HarmonyOS application developer
- **Verilog**: learning stage, RTL simulation within the "One Student One Chip" project
- **Japanese**: passed CJT4, preparing for JLPT N2
- **English**: comfortable reading papers and technical documentation; writing still improving
:::

## 硬件与设计工具

- **嘉立创 EDA**：画过 STM32F407 最小系统板的原理图与 PCB，配过可下单的 BOM
- **烧录与调试**：Keil 环境、烧录端口与编译缓存问题的排查
- **基础电子实践**：传感器、串口、OLED 等模块的动手练习

::: en Hardware and design tools
- **LCEDA**: schematic and PCB layout of an STM32F407 minimum system board, including a ready-to-order BOM
- **Flashing and debugging**: Keil toolchain, flashing port and build-cache troubleshooting
- **Basic electronics**: hands-on work with sensors, serial links and OLED modules
:::

## 文档与表达

- 写过完整的技术文档与项目说明（架构、接口、部署步骤），也维护过文档站
- 做过面向老师的项目答辩材料：技术方案、实验记录、PPT 与讲稿
- 习惯把"为什么这么做"和"踩了什么坑"写下来——这个网站的[笔记](/notes/)栏目就是这么来的

::: en Documentation
- Full technical documentation and project write-ups (architecture, interfaces, deployment steps), plus a documentation site
- Presentation material for project reviews: technical proposals, experiment records, slides and scripts
- A habit of writing down both the reasoning and the mistakes — the [notes](/notes/) section of this site comes from it
:::
