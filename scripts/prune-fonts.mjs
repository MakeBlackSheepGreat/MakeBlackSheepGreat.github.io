/**
 * 构建后清理（两件事）：
 *   1. 删除主题自带的 Inter 字体子集（站点已改用系统字体栈，见 theme/custom.css）
 *   2. 从生成的 HTML 里移除对 Inter 的 preload 链接
 *
 * 第 2 步必须放在构建之后：VitePress 的字体 preload 是在 SSR 渲染阶段注入的，
 * 配置里的 transformHead 看不到它，因此只能在产物里处理。
 */
import { readdir, stat, unlink, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(here, '..', 'docs', '.vitepress', 'dist')
const assetsDir = join(distDir, 'assets')

const FONT_RE = /^inter-.*\.woff2$/
const PRELOAD_RE = /<link rel="preload"[^>]*href="\/assets\/inter-[^>]*>/g

async function pruneFonts() {
  let removed = 0
  let bytes = 0
  const entries = await readdir(assetsDir)
  for (const name of entries) {
    if (!FONT_RE.test(name)) continue
    const path = join(assetsDir, name)
    const info = await stat(path)
    if (!info.isFile()) continue
    bytes += info.size
    await unlink(path)
    removed += 1
  }
  return { removed, bytes }
}

async function walkHtml(dir) {
  const out = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'assets') continue
      out.push(...(await walkHtml(path)))
    } else if (entry.name.endsWith('.html')) {
      out.push(path)
    }
  }
  return out
}

async function stripPreloads() {
  const files = await walkHtml(distDir)
  let touched = 0
  for (const file of files) {
    const html = await readFile(file, 'utf8')
    if (!html.includes('/assets/inter-')) continue
    const next = html.replace(PRELOAD_RE, '')
    if (next !== html) {
      await writeFile(file, next, 'utf8')
      touched += 1
    }
  }
  return { touched, total: files.length }
}

try {
  const fonts = await pruneFonts()
  const preloads = await stripPreloads()
  console.log(
    `prune-fonts: 删除字体 ${fonts.removed} 个（${(fonts.bytes / 1024).toFixed(0)} KB），` +
      `清理 preload 的页面 ${preloads.touched}/${preloads.total}`
  )
} catch (err) {
  console.log(`prune-fonts: 跳过（${err.code || err.message}）`)
}
