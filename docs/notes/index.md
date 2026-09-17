# 技术笔记

把我自己在工程里踩过的坑写下来。都是真做过的事，具体到能复现的程度，但不涉及任何私有信息。

::: en Notes
Field notes from things I have actually built. Concrete enough to reproduce, with no private details involved.
:::

## 文章列表

### [把三万篇论文灌进知识库](/notes/paper-corpus-pipeline)

一次 11 小时的语料摄取流水线：三万篇论文、混合推理引擎、断网自愈和证据链。记录几个真正影响成败的设计选择。

### [把一个 Agent 服务放到公网](/notes/agent-service-public)

自建服务对外发布时踩到的一串问题：进程级随机密钥、会话 cookie 的失效、反向代理与进程托管，以及为什么最后没有用 SSH 隧道。

### [负面结果也是一份结果](/notes/negative-results)

一个创新模块把准确率从 77.23% 拉到 56.78%，训练中途崩坏。写清楚失败是怎么被记录下来的，以及为什么预注册的实验门槛不能事后改。

### [一个人怎么带一群 Agent](/notes/agent-orchestration)

同时指挥多个子智能体干活的实践：角色怎么分、进度怎么落盘、验收标准怎么写才不会被糊弄。

### [把医学影像软件刻成光盘交付](/notes/medical-software-delivery)

从"在我电脑上跑得起来"到"在别人的机器上、离线、从光盘里跑起来"，中间隔着的全是细节：硬件降级、界面全量回归、干净环境验证。
