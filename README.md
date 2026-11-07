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
- **仅在致谢页**可写出经本人同意的师长姓名与职务；其余页面不出现导师姓名与实验室具体名称，也不出现队友姓名
- 竞赛条目只写颁发单位、时间与本人承担的工作
- 照片使用 `docs/public/photo-placeholder.svg` 占位，替换时改首页的 `<img>` 地址即可

## 许可证

本站采用代码与内容分离的双许可证：

| 文件 | 覆盖范围 | 授权 |
|---|---|---|
| `LICENSE` | 源码：`package.json`、`docs/.vitepress/`、`scripts/`、`functions/` | MIT |
| `LICENSE-CONTENT` | 内容：`docs/` 下正文、笔记、图片（`.vitepress/` 除外） | 保留所有权利 |

内容侧明确保留文本与数据挖掘权利（TDM Reservation Protocol、欧盟 2019/790 号指令第 4 条），
与 `docs/public/_headers`、`robots.txt` 中的机器可读声明一致。

致谢页的「开源协议」章节面向读者说明这些条款，改动许可证时需同步该章节与两个许可证文件。

## 反 AI 抓取与蒸馏防护

站点对内容使用作出了明确的权利保留，并实现了分层防护。完整说明见
[`ANTI-AI-SCRAPING.md`](./ANTI-AI-SCRAPING.md)，要点如下：

| 层 | 位置 | 作用 |
|---|---|---|
| 声明 | `docs/public/robots.txt` | 逐条屏蔽 AI 训练与检索爬虫；`Content-Signal` 声明 `ai-train=no, ai-input=no` |
| 声明 | `docs/public/_headers` | `X-Robots-Tag: noai, noimageai` 与 `TDM-Reservation: 1` |
| 声明 | `docs/tdm-reservation.md` / `docs/en/` | 可读的权利保留条款页，页脚有入口 |
| 对抗 | `docs/.vitepress/theme/AntiScrape.vue` | 对真人不可见的蜜罐链接、条款告知、碎片化乱序诱饵 |
| 对抗 | `docs/.vitepress/theme/decoy-pool.ts` | 101 词中性诱饵池，按页面哈希确定性取词 |
| 对抗 | `docs/.vitepress/theme/watermark.ts` | 零宽字符水印，用于事后溯源 |
| 强制 | `functions/_middleware.js` | 边缘拦截：AI 爬虫 UA 与蜜罐路径返回 403 |
| 强制 | `functions/_trap/[[path]].js` | 蜜罐端点，返回 410 并打标 |

### 对抗层的三项强化混淆

- **诱饵池扩容**：101 个中性名词（自然科学 / 工艺工程 / 音乐体育 / 历史制度），
  24 个页面即可覆盖全部词，抓取器无法靠「多次抓取取交集」识别诱饵。
- **碎片化 + DOM 顺序混淆**：每个诱饵词切 2 段，48 个碎片用 `order` 属性配合
  `display:flex` 重排，解析 DOM 得到的文本是乱序碎片。
- **零宽字符水印**：每页注入两段**各自完整可解**的水印（分处不同 DOM 位置），
  编码「站点标识 + 页面摘要」，用于事后确认某段文字是否源自本站。

> 设计取舍：全部使用中性名词，不注入假事实、不含指令性语句。被误抓时只产生降低信噪比的
> 噪声，不会形成似是而非的错误知识，也不对下游模型行为产生诱导。

### 验证

```bash
node scripts/check-watermark.mjs    # 水印编解码 13 项（无需浏览器）
node scripts/check-decoy.mjs        # 诱饵池与碎片乱序 13 项（无需浏览器）
PW_CHANNEL=msedge node scripts/verify-antiscrape.mjs   # 浏览器实测，需先起 pnpm preview
```

`verify-antiscrape.mjs` 会逐页断言：诱饵层对真人不可见、不可聚焦、不影响布局、
碎片化与 CSS 重排生效、零宽水印已注入且**未污染正文可见文本**，任一不满足即非零退出。

### 水印溯源用法

```js
import { decodeWatermark, decodeWatermarkAll } from './docs/.vitepress/theme/watermark.ts'

decodeWatermark(疑似转载的文本)
// → { found: true, site: 'LS', digest: 'b63bca1e', raw: 'LS|b63bca1e' }
```

`digest` 是页面路径加固定盐的 FNV-1a 哈希，可确认来源页面，且不泄露页面内容。

> 注意：诱饵层的隐藏样式必须写成**内联 style**。VitePress 默认由 JS 注入 CSS，
> 仅写 `<style scoped>` 会导致样式表加载前诱饵文字对人类可见。

**搜索引擎不会被屏蔽** —— Googlebot / Bingbot / Baiduspider 等始终放行，否则站点会从搜索结果中消失。

