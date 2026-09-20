# Cloudflare WAF 规则配置说明 / Edge enforcement setup

本站的防护分两层：**声明层**（robots.txt / HTTP 头 / TDM 保留）与**强制层**（Cloudflare 边缘拦截）。
`functions/_middleware.js` 已实现强制层。若希望再加一道 WAF 规则（对 Pages 之外的请求也生效、
可在仪表盘直接查看拦截量），按下表配置。

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

## 三、配置后自检

```bash
# 应返回 403
curl -s -o /dev/null -w "%{http_code}\n" -A "GPTBot/1.0" https://home.liteblacksheep.asia/
curl -s -o /dev/null -w "%{http_code}\n" -A "ClaudeBot/1.0" https://home.liteblacksheep.asia/
curl -s -o /dev/null -w "%{http_code}\n" https://home.liteblacksheep.asia/_trap/test

# 应返回 200
curl -s -o /dev/null -w "%{http_code}\n" -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36" https://home.liteblacksheep.asia/
curl -s -o /dev/null -w "%{http_code}\n" -A "Googlebot/2.1 (+http://www.google.com/bot.html)" https://home.liteblacksheep.asia/
```

## 四、注意事项

- **本地开发不受影响**：`functions/_middleware.js` 只在实际部署到 Cloudflare Pages 后生效，
  `pnpm dev` 与 `pnpm preview` 走的是 VitePress 自带服务器，不会触发拦截。
- **GitHub Pages 镜像无法使用 Functions**：镜像站点没有中间件能力，只有 robots.txt 与
  前端诱饵层生效。如需对镜像也强制拦截，需在 GitHub Pages 前置一层代理。
- **不要屏蔽搜索引擎**：声明层的所有配置都刻意保留了 Googlebot 与 Bingbot。
