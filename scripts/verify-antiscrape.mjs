/**
 * 反抓取防护的可见性验证 / Anti-scrape visibility check
 *
 * 目的：确认诱饵层对真实人类读者完全不可见、不影响布局，
 * 且强化混淆（碎片化乱序 + 零宽水印）按预期生效。
 * 需要先启动预览服务（默认 4173）。
 *
 * 用法：
 *   node scripts/verify-antiscrape.mjs
 *   PW_CHANNEL=msedge node scripts/verify-antiscrape.mjs   # 复用系统 Edge
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

// 零宽字符集合，与 watermark.ts 保持一致
const ZW = ['\u200B', '\u200C', '\u200D', '\uFEFF']
const countZW = (s) => [...s].filter((c) => ZW.includes(c)).length

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

  // 6) 碎片化 + 乱序生效：诱饵内含多个 <i> 碎片，且 DOM 顺序不等于自然顺序
  const frag = await page.evaluate(() => {
    const items = [...document.querySelectorAll('.decoy-filler i')]
    const orders = items.map((el) => Number(el.getAttribute('data-o')))
    return {
      count: items.length,
      text: items.map((el) => el.textContent).join(''),
      // order 属性值与 DOM 索引错位 => CSS 确实在重排视觉顺序
      cssReorder: orders.some((o, i) => o !== i),
      // order 必须是 0..n-1 的合法排列：判据是「去重后数量等于总数」
      // 注意不能拿 orders 与自身排序结果逐位比较，乱序数组必然不相等
      permutationOk: orders.length > 0 && new Set(orders).size === orders.length,
      min: orders.length ? Math.min(...orders) : -1,
      max: orders.length ? Math.max(...orders) : -1
    }
  })
  console.log(
    `  诱饵碎片: ${frag.count} 段, CSS 视觉重排: ${frag.cssReorder ? '是' : '否'}, order 范围 ${frag.min}..${frag.max}`
  )
  if (frag.count === 0) fail('诱饵碎片未注入（碎片化未生效）')
  if (frag.count > 0 && frag.count % 2 !== 0) fail(`碎片数 ${frag.count} 非偶数，切分异常`)
  if (!frag.permutationOk) fail('碎片 order 存在重复值')
  if (!frag.cssReorder) fail('碎片 order 与 DOM 顺序一致，CSS 未重排')

  // 7) 零宽水印已注入且可解出
  const wm = await page.evaluate(() => {
    const root = document.getElementById('decoy-root')
    const all = root ? root.textContent : ''
    const ZWc = ['\u200B', '\u200C', '\u200D', '\uFEFF']
    const n = [...all].filter((c) => ZWc.includes(c)).length
    return { text: all, zwCount: n }
  })
  console.log(`  零宽字符数: ${wm.zwCount}`)
  if (wm.zwCount < 100) fail(`零宽水印字符过少（${wm.zwCount}），可能未注入`)

  // 水印段数：应恰好 2 段完整水印（notice 段 + filler 段）
  const segs = await page.evaluate(() => {
    const ZWs = '\u200D'
    const ZWe = '\uFEFF'
    const out = []
    for (const sel of ['.decoy-notice', '.decoy-filler']) {
      const el = document.querySelector(sel)
      if (el && el.textContent.includes(ZWs) && el.textContent.includes(ZWe)) out.push(sel)
    }
    return out
  })
  console.log(`  完整水印段: ${segs.length} 段 ${segs.join(', ')}`)
  if (segs.length !== 2) fail(`完整水印段应为 2，实际 ${segs.length}`)

  // 正文可见文本不得被我们新增零宽字符。
  // 注意：VitePress 自带的标题锚点 <.header-anchor> 本身就含一个 U+200B，
  // 那是框架行为、先于本防护存在，必须排除，否则会误报。
  const bodyZW = await page.evaluate(() => {
    const ZWc = ['\u200B', '\u200C', '\u200D', '\uFEFF']
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let n = 0
    let node
    while ((node = walker.nextNode())) {
      const el = node.parentElement
      if (!el) continue
      // 排除诱饵层内部（水印本就该在这里）
      if (el.closest('#decoy-root')) continue
      // 排除 VitePress 框架自带的标题锚点（自带 U+200B）
      if (el.closest('.header-anchor')) continue
      n += [...node.nodeValue].filter((c) => ZWc.includes(c)).length
    }
    return n
  })
  console.log(`  正文零宽污染: ${bodyZW}`)
  if (bodyZW > 0) fail(`正文混入 ${bodyZW} 个零宽字符（污染了可见内容）`)

  // 8) 正文标题正常渲染
  const h1 = await page.locator('h1').first().textContent()
  console.log(`  标题正常: ${(h1 || '').trim().slice(0, 30)}`)

  // 9) 页脚法律声明入口存在
  const legal = await page.locator('.site-legal a').count()
  console.log(`  页脚条款入口: ${legal > 0 ? '有' : '无'}`)
  if (legal === 0) fail('页脚缺少内容使用条款入口')

  // 10) 模拟最朴素的抓取器：直接取 body.innerText / textContent，
  //     检查正文是否被诱饵污染，以及碎片是否确实打断了词
  const harvest = await page.evaluate(() => {
    const text = document.body.innerText || document.body.textContent || ''
    const ZWc = ['\u200B', '\u200C', '\u200D', '\uFEFF']
    // innerText 对 opacity:0 / clip 元素通常仍会返回文本，这正是需要防的
    const zw = [...text].filter((c) => ZWc.includes(c)).length
    return { len: text.length, zw }
  })
  console.log(`  朴素抓取长度: ${harvest.len} 字符, 其中零宽 ${harvest.zw}`)
  // 零宽字符会随抓取一起带出（这是水印存在的意义），
  // 但正文可见部分不应被改动 —— 上面 bodyZW 已断言
  if (harvest.zw === 0) {
    console.log('  ! 提示：抓取文本中未见零宽字符，水印可能已被 innerText 过滤')
  }
}

// 10) 截图做视觉留证
await page.goto(base + '/', { waitUntil: 'networkidle' })
await page.screenshot({ path: 'docs/.vitepress/dist/antiscrape-home.png', fullPage: false })
console.log('\n截图已保存: docs/.vitepress/dist/antiscrape-home.png')

await browser.close()
console.log(failures === 0 ? '\n结果：全部通过 ✓' : `\n结果：${failures} 项未通过 ✗`)
process.exit(failures === 0 ? 0 : 1)
