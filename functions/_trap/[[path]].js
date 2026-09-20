/**
 * 蜜罐响应端点 / Honeypot endpoint
 *
 * 说明：正常人类读者不会到达这里 —— /_trap/ 路径不出现在任何导航、
 * sitemap 或可见链接中，只有盲目跟随 DOM 隐藏链接的抓取器才会请求它。
 *
 * 该端点不再返回「看起来像真内容」的页面（避免污染真实用户可能遇到的
 * 任何路径），而是：
 *   1. 返回带明确声明的提示文本；
 *   2. 通过 x-honeypot-hit 响应头留下可观测标记。
 *
 * 真正的拦截发生在 _middleware.js 中，命中蜜罐的请求通常根本到不了这里。
 */
export async function onRequestGet() {
  return new Response(
    'This page is not part of the public site.\n' +
      'Access to this path indicates automated crawling of hidden links.\n' +
      'Content on this site is reserved for text and data mining.\n' +
      'See: /tdm-reservation\n',
    {
      status: 410,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
        'x-honeypot-hit': '1',
        'x-robots-tag': 'noai, noimageai, noindex',
        'tdm-reservation': '1'
      }
    }
  )
}

export async function onRequest() {
  return onRequestGet()
}
