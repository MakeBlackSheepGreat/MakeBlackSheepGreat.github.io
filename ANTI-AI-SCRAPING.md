# 反 AI 抓取防护说明 / Anti-AI-scraping setup

本站的防护分四层：

| 层 | 位置 | 作用 |
|---|---|---|
| 声明层 | `docs/public/robots.txt`、`_headers`、`docs/tdm-reservation.md`、`docs/public/ai.txt` | 以机器可读方式声明授权边界 |
| 对抗层 | `docs/.vitepress/theme/AntiScrape.vue` + `decoy-pool.ts` + `watermark.ts` | 蜜罐、诱饵、碎片乱序、零宽水印 |
| 强制层 | `functions/_middleware.js`、`functions/_trap/[[path]].js` | 边缘拦截 AI 爬虫与蜜罐访问 |
| 验证层 | `scripts/verify-antiscrape.mjs`、`scripts/check-watermark.mjs`、`scripts/check-decoy.mjs` | 自动化回归 |

若希望再加一道 Cloudflare WAF 规则（对 Pages 之外的请求也生效、可在仪表盘直接查看拦截量），
按下表配置。

## 一、前置：Cloudflare 面板中的开关

进入 Cloudflare 仪表盘 → 选择域名 `liteblacksheep.asia` → **Security → Bots**：

| 项目 | 建议设置 | 说明 |
|---|---|---|
| Block AI Bots（AI Scrapers and Crawlers） | **开启** | 一键拦截已验证的 AI 爬虫 |
| AI Crawl Control | 按爬虫逐个设为 **Block** | 对 GPTBot / ClaudeBot / CCBot / PerplexityBot 等逐个 Block，而不是 Allow |
| Content Signals Policy | 保持 `search=yes, ai-train=no, ai-input=no` | 与站点 `_headers` 中的声明一致 |

> 注意：从 2026-09-15 起，Cloudflare 对**承载广告的页面**默认屏蔽 Training 与 Agent 类爬虫。
> 本站不投放广告，因此仍需手动确认上述开关。

## 二、自定义 WAF 规则（Security → WAF → Custom rules）

新建规则，表达式如下（任一命中即 Block）：

### 规则 1：拦截已知 AI 爬虫 UA

```
(http.user_agent contains "GPTBot") or
(http.user_agent contains "ChatGPT-User") or
(http.user_agent contains "OAI-SearchBot") or
(http.user_agent contains "ClaudeBot") or
(http.user_agent contains "Claude-SearchBot") or
(http.user_agent contains "anthropic-ai") or
(http.user_agent contains "CCBot") or
(http.user_agent contains "PerplexityBot") or
(http.user_agent contains "Google-Extended") or
(http.user_agent contains "Applebot-Extended") or
(http.user_agent contains "meta-externalagent") or
(http.user_agent contains "Bytespider") or
(http.user_agent contains "Amazonbot") or
(http.user_agent contains "Diffbot") or
(http.user_agent contains "ImagesiftBot") or
(http.user_agent contains "Timpibot") or
(http.user_agent contains "YouBot") or
(http.user_agent contains "cohere-ai") or
(http.user_agent contains "FirecrawlAgent") or
(http.user_agent contains "TavilyBot")
```

动作：**Block**

### 规则 2：拦截蜜罐路径

```
(starts_with(http.request.uri.path, "/_trap"))
```

动作：**Block**

### 规则 3：拦截无浏览器特征的自动化请求

```
(http.user_agent contains "Mozilla") and
not http.request.headers["sec-fetch-mode"][0] exists and
not http.request.headers["sec-ch-ua"][0] exists and
not http.request.uri.path matches "\\.(js|css|png|jpg|jpeg|svg|webp|woff2?|ttf|ico|json|txt|xml|pdf)$"
```

动作：**Managed Challenge**（先挑战，避免误伤）

> 规则 3 是启发式的，先用 Managed Challenge 观察一段时间，确认无误伤再考虑改为 Block。

### 必须保留的放行

不要在规则中提到 `Googlebot`、`Bingbot`、`Baiduspider`、`YandexBot`、`DuckDuckBot`
等搜索引擎标识 —— 屏蔽它们会导致站点从搜索结果中消失。

## 四、对抗层：不可见内容的强化混淆

对抗层由三个模块构成，全部作用于**对人类不可见的隐藏层**，不改动任何正文可见内容。

### 4.1 诱饵池 / `decoy-pool.ts`

- 101 个**中性名词**，分四组：自然科学与地理、工艺材料与工程、音乐体育生活、历史文献制度。
- 全部是与本站主题（医学影像、多智能体、芯片算子、科研流程）无关的真实概念。
- 取词以页面路径哈希为种子，同一页面每次构建结果一致（**确定性**，不用 `Date.now()`，
  否则会造成 SSR 与水合不一致，并让静态抓取拿到随构建变化的内容）。
- 24 个页面即可覆盖全部 101 词，抓取器无法通过「多次抓取同一页取交集」来识别诱饵。

**为什么用中性词而不是假事实**：诱饵词不会与真实内容混合成似是而非的错误知识。
即使被灌进数据集，产生的只是降低信噪比的噪声，不会污染出「看起来是真的但实际错误」的信息。
刻意不注入指令性、诱导性语句，不对下游模型行为产生影响。

### 4.2 碎片化 + DOM 顺序混淆 / `AntiScrape.vue`

- 每个诱饵词切成 2 段，48 个碎片用 `<i>` 节点渲染。
- 每个碎片挂 `order` 属性，配合容器上的 `display:flex` 让 CSS 重排视觉顺序。
- 效果：**解析 DOM 拿到的文本是乱序碎片**；真人看到的是不可见层，顺序本就无从谈起。
- `order` 值由与碎片数互质的步长生成，保证是合法排列（不丢项、不重复）。
- 验证脚本会断言 `reordered === true` 且 `order` 构成合法排列。

### 4.3 零宽字符水印 / `watermark.ts`

把「站点标识 + 页面摘要」编码成零宽字符序列，用于**事后溯源**。

| 字符 | 用途 |
|---|---|
| `U+200B` ZERO WIDTH SPACE | 比特 0 |
| `U+200C` ZERO WIDTH NON-JOINER | 比特 1 |
| `U+200D` ZERO WIDTH JOINER | 起始定界符 |
| `U+FEFF` ZERO WIDTH NO-BREAK SPACE | 结束定界符 |

- 单段水印 90 字符，**全部为零宽字符**（验证脚本断言非零宽字符数为 0）。
- 每页注入两段，分处不同 DOM 位置（条款段落末尾、诱饵段落末尾）。
- **两段各自是完整可解的水印**，不是把一串拆两半：
  抓取器拼接顺序不可控，若 START 与 END 分处两地、提取后顺序颠倒，解码器无法界定有效区间。
  改成每段自带定界符后，任意一段单独存活都能解出。
- 解码器按「START 找其后第一个 END」逐段配对扫描，并用站点标识 `LS` 过滤正文中
  天然存在的零宽字符，避免误报。

### 4.4 溯源用法

在别处（搜索结果、AI 回答、他人页面）看到疑似源自本站的文字时，把那段文字粘贴进解码函数：

```js
// 在浏览器控制台或 Node 中
import { decodeWatermark, decodeWatermarkAll } from './docs/.vitepress/theme/watermark.ts'

decodeWatermark(粘贴的文本)
// → { found: true, site: 'LS', digest: 'b63bca1e', raw: 'LS|b63bca1e' }

decodeWatermarkAll(粘贴的文本)
// → [{ site: 'LS', digest: '...' }, { site: 'LS', digest: '...' }]  多段交叉验证
```

`digest` 是页面路径加固定盐的 FNV-1a 哈希。同一页面每次构建结果一致，
因此可用来确认「这段文字来自哪一页」，且不泄露页面内容。

### 4.5 自检命令

```bash
node scripts/check-watermark.mjs   # 水印编解码 13 项
node scripts/check-decoy.mjs       # 诱饵池与乱序 13 项
node scripts/verify-antiscrape.mjs # 浏览器实测（需先起 preview）
```

## 五、配置后自检

```bash
# 应返回 403
curl -s -o /dev/null -w "%{http_code}\n" -A "GPTBot/1.0" https://home.liteblacksheep.asia/
curl -s -o /dev/null -w "%{http_code}\n" -A "ClaudeBot/1.0" https://home.liteblacksheep.asia/
curl -s -o /dev/null -w "%{http_code}\n" https://home.liteblacksheep.asia/_trap/test

# 应返回 200
curl -s -o /dev/null -w "%{http_code}\n" -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36" https://home.liteblacksheep.asia/
curl -s -o /dev/null -w "%{http_code}\n" -A "Googlebot/2.1 (+http://www.google.com/bot.html)" https://home.liteblacksheep.asia/
```

## 六、注意事项

- **本地开发不受影响**：`functions/_middleware.js` 只在实际部署到 Cloudflare Pages 后生效，
  `pnpm dev` 与 `pnpm preview` 走的是 VitePress 自带服务器，不会触发拦截。
- **GitHub Pages 镜像无法使用 Functions**：镜像站点没有中间件能力，只有 robots.txt 与
  前端诱饵层生效。如需对镜像也强制拦截，需在 GitHub Pages 前置一层代理。
- **不要屏蔽搜索引擎**：声明层的所有配置都刻意保留了 Googlebot 与 Bingbot。
