# 个人主页 / Personal site

学术主页风格的个人网站，用 VitePress 搭建，部署在 GitHub Pages。

- 线上地址：<https://makeblacksheepgreat.github.io/>
- 中文为默认语言，导航栏右侧按钮可切换到英文站（`/en/`）

## 本地开发

```bash
pnpm install      # 安装依赖
pnpm dev          # 本地开发，默认 http://localhost:5173
pnpm build        # 构建到 docs/.vitepress/dist
pnpm preview      # 预览构建结果，默认 http://localhost:4173
```

## 目录结构

```
docs/
├─ .vitepress/
│  ├─ config.mts              # locales（中/英）、导航、侧边栏、搜索、自定义容器
│  └─ theme/
│     ├─ index.ts             # 继承默认主题，注册语言切换与社交图标组件
│     ├─ custom.css           # 学术主页风格样式（分组标签、经历条目、news 列表、打印样式）
│     ├─ LangSwitch.vue       # 导航栏的中英文切换按钮
│     └─ SocialRow.vue        # 首页的邮箱 / GitHub 图标行
├─ public/                    # 头像、照片占位图、favicon、cv.pdf
├─ index.md                   # 首页（关于我：简介 + 照片 + 社交图标 + news）
├─ experiences.md             # 经历（教育 / 科研 / 志愿服务 / 时间线）
├─ publications.md            # 论文（在研工作 / 手稿计划 / 实验环境与方法）
├─ projects.md                # 项目
├─ awards.md                  # 获奖与立项
├─ skills.md                  # 技能
├─ cv.md                      # 简历页（可下载 PDF）
├─ acknowledgements.md        # 致谢
├─ notes/                     # 技术笔记
└─ en/                        # 英文站，文件与中文一一对应
```

新增页面时，中英文两边都要建同名文件，语言切换才能对应上；导航与侧边栏分别在 `config.mts` 的 `root` 与 `en` 两个 locale 中配置。

## 写作约定

页面里可用的自定义容器：

```md
::: lead
副标题或语言能力行，显示为浅色小字。
:::

::: card 条目标题
<p class="entry-meta">机构 · 时间 · 地点</p>
<span class="badge">徽章文字</span>

条目正文，支持 markdown、列表与链接。
:::
```

- `::: card` 不要嵌套在其它容器里，VitePress 的容器嵌套会导致闭合标记解析异常
- 结构化页面（经历 / 论文 / CV）在 frontmatter 里写 `pageClass: labels`，二级标题会显示为品牌色分组标签

## 更新 CV PDF

CV 页面的打印样式已经处理过（隐藏导航、页脚与下载按钮）。导出流程：

```bash
pnpm build
pnpm preview --port 4173
# 另开一个终端，用无头浏览器打印成 PDF
msedge --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="docs/public/cv.pdf" "http://localhost:4173/cv"
```

生成的文件放在 `docs/public/cv.pdf`，页面上的「下载 PDF 版简历」按钮指向它。

## 部署

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会自动构建并发布到 GitHub Pages。

首次部署需要在仓库的 Settings → Pages 里把 Source 设为 **GitHub Actions**。

## 内容约定

- 公开信息只包含姓名、学校、专业、项目与竞赛内容；学号、手机号、生日、身份证等个人信息不写入站点
- 不出现导师姓名与实验室具体名称，不出现队友姓名
- 竞赛条目只写颁发单位、时间与本人承担的工作
- 照片使用 `docs/public/photo-placeholder.svg` 占位，替换时改首页的 `<img>` 地址即可
