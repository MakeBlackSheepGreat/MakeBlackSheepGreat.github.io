# 个人主页 / Personal site

用 VitePress 搭建的个人主页，部署在 GitHub Pages。

- 线上地址：<https://makeblacksheepgreat.github.io/>
- 内容为中文为主、英文摘要并排的双语结构

## 本地开发

```bash
pnpm install      # 安装依赖
pnpm dev          # 本地开发，默认 http://localhost:5173
pnpm build        # 构建到 docs/.vitepress/dist
pnpm preview      # 预览构建结果，默认 http://localhost:4173
```

## 目录结构

站点为中英双语，通过 VitePress 的 locales 实现，导航栏右侧的「简体中文 / English」是语言切换入口，切换时会跳到对应语言的同一页面。

```
docs/
├─ .vitepress/
│  ├─ config.mts          # 站点配置：locales（中/英）、导航、侧边栏、搜索、自定义容器
│  └─ theme/
│     ├─ index.ts         # 继承默认主题
│     └─ custom.css       # 品牌色、条目卡片样式
├─ public/                # 头像与站点图标
├─ index.md               # 中文首页
├─ about.md               # 关于我
├─ journey.md             # 经历时间线
├─ projects.md            # 项目
├─ research.md            # 科研
├─ awards.md              # 获奖与立项
├─ skills.md              # 技能
├─ acknowledgements.md    # 致谢
├─ notes/                 # 技术笔记
└─ en/                    # 英文站点，文件与中文一一对应
```

新增页面时，中英文两边都要建同名文件，语言切换才能对应上；导航与侧边栏分别在 `config.mts` 的 `root` 和 `en` 两个 locale 里配置。

## 自定义容器

配置里注册了 `card` 容器，用来做条目卡片：

```md
::: card 标题
卡片内容，支持 markdown 与链接。
:::
```

## 部署

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会自动构建并发布到 GitHub Pages。

首次部署需要在仓库的 Settings → Pages 里把 Source 设为 **GitHub Actions**。

## 内容约定

- 公开信息只包含姓名、学校、专业、项目与竞赛内容；学号、手机号、生日等个人信息不写入站点
- 竞赛条目只写颁发单位、时间与本人承担的工作，不出现其他人的姓名
