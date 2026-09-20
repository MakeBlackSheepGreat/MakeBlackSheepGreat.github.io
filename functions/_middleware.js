/**
 * 边缘拦截中间件 / Edge enforcement middleware
 *
 * 作用范围：本站所有请求（Cloudflare Pages Functions `_middleware` 约定）。
 *
 * 定位：robots.txt 与 HTTP 头只是「声明」，合规爬虫会遵守，不守规矩的不会。
 * 本中间件是真正的强制层，在请求到达静态资源之前就作出判断。
 *
 * 三层判定：
 *   1. 蜜罐命中 —— 访问 /_trap/* 的客户端一律拦截。这些路径人类不可见、
 *      也不出现在 sitemap 中，只有盲目跟随 DOM 链接的抓取器会到达。
 *   2. AI 爬虫 UA —— 命中已知 AI 训练/检索爬虫标识则返回 403。
 *   3. 假浏览器 —— 自称浏览器但缺少浏览器必备特征头的请求，按抓取器处理。
 *
 * 设计原则：
 *   - 只拦截声明为 AI / 采集用途的爬虫，搜索引擎（Googlebot / Bingbot /
 *     Baiduspider / YandexBot 等）正常放行，保证站点仍可被检索到；
 *   - 真实人类读者的 UA 与特征头不受影响；
 *   - 不记录 IP、不写日志，仅做实时判断，避免引入隐私负担。
 */

// ── 已知 AI 训练 / 数据采集爬虫标识（小写匹配）────────────────────────
const AI_CRAWLER_PATTERNS = [
  // OpenAI
  'gptbot', 'chatgpt-user', 'oai-searchbot', 'openai-operator',
  // Anthropic
  'claudebot', 'claude-web', 'claude-searchbot', 'claude-user', 'anthropic-ai',
  // Google AI 用途（不影响 Googlebot 正常收录）
  'google-extended',
  // 通用语料库
  'ccbot', 'commoncrawl',
  // Perplexity
  'perplexitybot', 'perplexity-user',
  // Apple / Meta / ByteDance
  'applebot-extended', 'meta-externalagent', 'facebookbot', 'bytespider',
  // 其他主要采集方
  'amazonbot', 'diffbot', 'imagesiftbot', 'omgilibot', 'omgili', 'youbot',
  'timpibot', 'webzio-extended', 'duckassistbot', 'cohere-ai',
  'ai2bot', 'ai2bot-dolma', 'peanutbutterbot', 'exabot', 'tavilybot',
  'firecrawlagent',
  // 批量镜像/采集工具（保留：这类工具用于整站克隆）
  'httrack', 'webcopier', 'sitesucker'
]

// ── 正常搜索引擎：明确放行（即使是空 UA 特征也放行）──────────────────
const SEARCH_ENGINE_PATTERNS = [
  'googlebot', 'bingbot', 'baiduspider', 'yandexbot', 'duckduckbot',
  'sogou', 'exabot-search', 'slurp', 'applebot', 'petalbot', 'seznambot',
  'naverbot', 'qwantify', 'bravebot'
]

// ── 通用 HTTP 客户端：不拦截 ──────────────────────────────────────────
// curl / wget / python-requests / node-fetch / axios 等既是抓取工具，
// 也是运维自检、监控探活与 CI 校验的常用手段。屏蔽它们会误伤合法访问，
// 且攻击者改一个 UA 字符串即可绕过，收益极低。故此处不列入拦截。
// 这类请求仍受三层防护约束：robots.txt 声明、Content-Signal、蜜罐路径。

// ── 浏览器特征头常量（第 3 层已改为仅判空 UA，此处保留供后续扩展）──────
const BROWSER_HINTS = [
  'sec-fetch-mode',
  'sec-fetch-site',
  'sec-ch-ua',
  'accept-language'
]
void BROWSER_HINTS

function deny(reason) {
  return new Response(
    'Access denied. This site reserves text and data mining rights.\n' +
      'See: /tdm-reservation\n' +
      `Reason: ${reason}\n`,
    {
      status: 403,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
        // 向扫描器与爬虫重申语义
        'x-robots-tag': 'noai, noimageai',
        'tdm-reservation': '1',
        'content-signal': 'search=yes, ai-train=no, ai-input=no'
      }
    }
  )
}

function matches(ua, patterns) {
  return patterns.some((p) => ua.includes(p))
}

export async function onRequest(context) {
  const { request, next } = context
  const url = new URL(request.url)
  const ua = (request.headers.get('user-agent') || '').toLowerCase()
  const path = url.pathname.toLowerCase()

  // ── 第 1 层：蜜罐路径 ────────────────────────────────────────────
  if (path.startsWith('/_trap')) {
    return deny('honeypot-path')
  }

  // ── 第 2 层：AI 爬虫 UA ─────────────────────────────────────────
  if (matches(ua, AI_CRAWLER_PATTERNS)) {
    // 搜索引擎标识优先，避免被通用采集框架词误伤
    if (!matches(ua, SEARCH_ENGINE_PATTERNS)) {
      return deny('ai-crawler-ua')
    }
  }

  // ── 第 3 层：UA 完全缺失 ────────────────────────────────────────
  // 真实浏览器与所有主流搜索引擎都会发送 UA。完全空 UA 的请求只可能来自
  // 脚本或残缺客户端。这一条误伤面极小，可以安全拦截。
  //
  // 刻意不做「自称浏览器但缺少 sec-fetch-* 头」的判断：部分隐私浏览器、
  // 老旧客户端、企业代理与 RSS 阅读器确实不带这些头，据此拦截会误伤真实
  // 读者，而攻击者伪造一个头即可绕过，收益远低于代价。
  if (!ua) {
    return deny('missing-user-agent')
  }

  // ── 放行，并补上内容使用信号 ──────────────────────────────────────
  const response = await next()
  const headers = new Headers(response.headers)
  headers.set('tdm-reservation', '1')
  headers.set('content-signal', 'search=yes, ai-train=no, ai-input=no')
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
}
