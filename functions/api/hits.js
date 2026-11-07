/**
 * 访问统计（Cloudflare Pages Function + KV）
 *
 * GET  /api/hits        读取当前计数
 * POST /api/hits        计数 +1，返回最新计数
 *       body: { id?: string }  前端生成的随机标识，用于估算独立访客
 *
 * 允许这些站点跨域调用（GitHub Pages 镜像与 pages.dev 预览域也能显示同一份计数）：
 *   home.liteblacksheep.asia / makeblacksheepgreat.github.io / liteblacksheep.pages.dev
 *
 * 隐私约定：
 * - 不记录 IP、UA、Referer，也不写日志；
 * - 独立访客只保存随机标识的 SHA-256 摘要（前 32 位十六进制），无法反推个人身份；
 * - 随机标识由访客浏览器生成并保存在本地存储里，清掉即视为新访客。
 */

const KEY_PV = 'pv'
const KEY_UV = 'uv'
const UV_PREFIX = 'u:'

const ALLOWED_ORIGINS = new Set([
  'https://home.liteblacksheep.asia',
  'https://liteblacksheep.pages.dev',
  'https://makeblacksheepgreat.github.io'
])

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || ''
  const headers = {
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'Origin'
  }
  if (ALLOWED_ORIGINS.has(origin)) headers['access-control-allow-origin'] = origin
  return headers
}

function json(data, request, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      ...corsHeaders(request)
    }
  })
}

async function readCounts(env) {
  const [pv, uv] = await Promise.all([env.STATS.get(KEY_PV), env.STATS.get(KEY_UV)])
  return { pv: Number(pv) || 0, uv: Number(uv) || 0 }
}

async function digestId(id) {
  const data = new TextEncoder().encode('ls-hits:' + id)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32)
}

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: corsHeaders(request) })
}

export async function onRequestGet({ request, env }) {
  return json(await readCounts(env), request)
}

export async function onRequestPost({ request, env }) {
  let id = ''
  try {
    const body = await request.json()
    if (body && typeof body.id === 'string' && body.id.length <= 64) id = body.id
  } catch {
    // 没有 body 也照常计一次访问
  }

  const counts = await readCounts(env)
  const pv = counts.pv + 1
  await env.STATS.put(KEY_PV, String(pv))

  let uv = counts.uv
  if (id) {
    const key = UV_PREFIX + (await digestId(id))
    const seen = await env.STATS.get(key)
    if (!seen) {
      await env.STATS.put(key, '1')
      uv += 1
      await env.STATS.put(KEY_UV, String(uv))
    }
  }

  return json({ pv, uv }, request)
}
