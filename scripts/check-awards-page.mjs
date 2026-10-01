/**
 * 获奖页渲染核验：在真实浏览器里打开 /awards 与 /en/awards，
 * 断言新条目存在、旧措辞已移除、卡片结构完好、无横向溢出。
 *
 * 用法：先启动 dev 或 preview 服务，再执行本脚本。
 *   DEV_URL=http://127.0.0.1:5199 PW_CHANNEL=msedge node scripts/check-awards-page.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.DEV_URL || 'http://127.0.0.1:5199'
const channel = process.env.PW_CHANNEL || undefined

let pass = 0
let fail = 0
function check(label, ok, detail = '') {
  const mark = ok ? '✓' : '✗'
  console.log(`  ${mark} ${label}${detail ? ' — ' + detail : ''}`)
  ok ? pass++ : fail++
}

const CASES = [
  {
    path: '/awards',
    lang: 'zh',
    must: [
      '揭榜挂帅',
      '国家级二等奖',
      '共青团中央',
      '精准清创',
      '成都科奥达光电技术有限公司',
      'Three.js',
      'Electron',
      'PyTorch',
      'FastAPI',
      '国家级三等奖'
    ],
    mustNot: ['OSTEO VISION：面向颌骨骨髓炎辅助判读', 'github.com/MakeBlackSheepGreat/osteo-vision'],
    // 该赛事不应再出现在「参赛经历（未获奖）」区
    goneFromUnrewarded: '赛题为面向颌骨骨髓炎的智能化荧光诊疗'
  },
  {
    path: '/en/awards',
    lang: 'en',
    must: [
      'Open Competition',
      'National second prize',
      'Communist Youth League Central Committee',
      'precise debridement',
      'Chengdu Keaoda Optoelectronic Technology',
      'Three.js',
      'Electron',
      'PyTorch',
      'FastAPI',
      'National third prize'
    ],
    mustNot: ['OSTEO VISION: a fluorescence', 'github.com/MakeBlackSheepGreat/osteo-vision'],
    goneFromUnrewarded: 'problem on fluorescence-guided diagnosis and treatment'
  }
]

const browser = await chromium.launch({ channel })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

for (const c of CASES) {
  console.log(`\n${c.path}`)
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))

  await page.goto(BASE + c.path, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.entry', { timeout: 20000 })
  await page.waitForTimeout(400)

  const body = await page.innerText('body')

  for (const t of c.must) check(`包含「${t}」`, body.includes(t))
  for (const t of c.mustNot) check(`已移除「${t}」`, !body.includes(t))

  // 该赛事已从「参赛经历」区移出：检查它不在“未获奖”列表项目符号行里
  const unRewardedSection = await page.evaluate(() => {
    const heads = [...document.querySelectorAll('h2')]
    const h = heads.find((x) => /参赛经历|entered without a prize/i.test(x.textContent || ''))
    if (!h) return ''
    let out = ''
    let n = h.nextElementSibling
    while (n && n.tagName !== 'H2') {
      out += (n.textContent || '') + '\n'
      n = n.nextElementSibling
    }
    return out
  })
  check('未获奖区不含该赛事', !unRewardedSection.includes(c.goneFromUnrewarded))

  // 卡片数量
  const cardCount = await page.evaluate(() => document.querySelectorAll('.entry').length)
  check('卡片结构存在', cardCount > 0, `${cardCount} 张卡片`)

  // 横向溢出
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  )
  check('无横向溢出', overflow <= 0, `${overflow}px`)

  check('无页面级 JS 错误', errors.length === 0, errors.slice(0, 2).join(' | '))

  // 截图
  const shot = `docs/.vitepress/awards-${c.lang}.png`
  await page.screenshot({ path: shot, fullPage: true })
  console.log(`  截图: ${shot}`)
}

await browser.close()
console.log(`\n结果：${fail === 0 ? '全部通过 ✓' : `${fail} 项失败 ✗`}（通过 ${pass}，失败 ${fail}）`)
process.exit(fail === 0 ? 0 : 1)
