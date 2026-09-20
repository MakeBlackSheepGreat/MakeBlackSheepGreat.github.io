/**
 * 反抓取防护的可见性验证 / Anti-scrape visibility check
 *
 * 目的：确认诱饵层对真实人类读者完全不可见，且不影响页面布局。
 * 需要先启动预览服务（默认 4173）。
 *
 * 用法：
 *   node scripts/verify-antiscrape.mjs
 */
import { chromium } from 'playwright'

const base = process.env.CV_BASE_URL || 'http://localhost:4173'
const channel = process.env.PW_CHANNEL || undefined

const pages = ['/', '/notes/', '/projects/', '/cv']

const browser = await chromium.launch(channel ? { channel } : {})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

let failures = 0
const fail = (msg) => {
  failures += 1
  console.log('  ✗ ' + msg)
}

for (const path of pages) {
  console.log(`\n${path}`)
  await page.goto(base + path, { waitUntil: 'networkidle' })

  // 1) 诱饵根节点存在（说明防爬层已注入）
  const exists = await page.locator('#decoy-root').count()
  console.log(`  诱饵层注入: ${exists > 0 ? '是' : '否'}`)
  if (exists === 0) fail('诱饵层未注入')

  // 2) 对人类不可见：bounding box 必须为 0 或 1px，且 opacity 为 0
  const box = await page.locator('#decoy-root').boundingBox()
  const opacity = await page
    .locator('#decoy-root')
    .evaluate((el) => getComputedStyle(el).opacity)
  console.log(`  占据尺寸: ${box ? `${box.width}x${box.height}` : '无'}, opacity=${opacity}`)
  if (box && (box.width > 2 || box.height > 2)) fail(`诱饵层占了 ${box.width}x${box.height} 空间`)
  if (Number(opacity) !== 0) fail(`诱饵层 opacity=${opacity}，未隐藏`)

  // 3) 不可交互：pointer-events 必须为 none，且树内无真正可聚焦的元素
  const pe = await page
    .locator('#decoy-root')
    .evaluate((el) => getComputedStyle(el).pointerEvents)
  if (pe !== 'none') fail(`pointer-events=${pe}，可能被误点`)
  const focusables = await page.evaluate(() => {
    const root = document.getElementById('decoy-root')
    if (!root) return -1
    // tabindex="-1" 是显式排除 Tab 序列的写法，不算可聚焦
    const all = root.querySelectorAll('a[href],button,input,select,textarea')
    let n = 0
    for (const el of all) {
      if (el.getAttribute('tabindex') === '-1') continue
      if (el.closest('[inert]')) continue
      if (el.hasAttribute('disabled')) continue
      n += 1
    }
    return n
  })
  const inert = await page.evaluate(() => {
    const root = document.getElementById('decoy-root')
    return root ? root.hasAttribute('inert') : false
  })
  console.log(`  可聚焦元素: ${focusables}, inert=${inert}`)
  if (focusables !== 0) fail(`存在 ${focusables} 个可聚焦诱饵元素`)

  // 4) 诱饵文字不可见（视觉上不应出现在视口内）
  const decoyVisible = await page.evaluate(() => {
    const el = document.querySelector('.decoy-filler')
    if (!el) return false
    const r = el.getBoundingClientRect()
    return r.width > 2 && r.height > 2
  })
  if (decoyVisible) fail('诱饵文字在视口中可见')

  // 5) 布局未受影响：页面不应出现横向滚动条
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  )
  console.log(`  横向溢出: ${overflow}px`)
  if (overflow > 1) fail(`出现 ${overflow}px 横向滚动`)

  // 6) 图片与正文正常渲染
  const h1 = await page.locator('h1').first().textContent()
  console.log(`  标题正常: ${(h1 || '').trim().slice(0, 30)}`)

  // 7) 页脚法律声明入口存在
  const legal = await page.locator('.site-legal a').count()
  console.log(`  页脚条款入口: ${legal > 0 ? '有' : '无'}`)
  if (legal === 0) fail('页脚缺少内容使用条款入口')
}

// 8) 截图做视觉留证
await page.goto(base + '/', { waitUntil: 'networkidle' })
await page.screenshot({ path: 'docs/.vitepress/dist/antiscrape-home.png', fullPage: false })
console.log('\n截图已保存: docs/.vitepress/dist/antiscrape-home.png')

await browser.close()
console.log(failures === 0 ? '\n结果：全部通过 ✓' : `\n结果：${failures} 项未通过 ✗`)
process.exit(failures === 0 ? 0 : 1)
