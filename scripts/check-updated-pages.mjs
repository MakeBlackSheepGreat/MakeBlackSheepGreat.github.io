/**
 * 本轮更新页面的渲染核验：主页、经历、CV、论文、项目、技能页
 * 断言新增内容存在、无横向溢出、无 JS 错误。
 *
 * 用法：DEV_URL=http://127.0.0.1:4173 PW_CHANNEL=msedge node scripts/check-updated-pages.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.DEV_URL || 'http://127.0.0.1:4173'
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
    path: '/',
    lang: 'zh',
    must: [
      '2026.10',
      '2026 年度中国青年科技创新“揭榜挂帅”擂台赛国家级二等奖',
      '第十五届“挑战杯”专项赛事',
      '另两项工作已完成并支撑竞赛获奖'
    ],
    mustNot: ['以及颌骨骨髓炎荧光影像诊疗软件系统的实现']
  },
  {
    path: '/experiences',
    lang: 'zh',
    must: ['2026.10', '第十五届“挑战杯”专项赛事', '科研蜂群系统', '看板为任务真值']
  },
  {
    path: '/cv',
    lang: 'zh',
    must: ['2026 年度中国青年科技创新“揭榜挂帅”擂台赛', '第十五届“挑战杯”专项赛事']
  },
  {
    path: '/publications',
    lang: 'zh',
    must: ['国家级二等奖', '第十五届“挑战杯”专项赛事']
  },
  {
    path: '/projects',
    lang: 'zh',
    must: ['看板为任务真值', '个人主页站点', '反抓取设计']
  },
  {
    path: '/skills',
    lang: 'zh',
    must: ['无头浏览器渲染核验与交付物生成']
  },
  {
    path: '/en/',
    lang: 'en',
    must: [
      '2026.10',
      'Open Competition',
      '15th "Challenge Cup"',
      'Two medical imaging works are finished'
    ]
  },
  {
    path: '/en/experiences',
    lang: 'en',
    must: ['2026.10', 'Research swarm system', 'single source of truth']
  },
  {
    path: '/en/cv',
    lang: 'en',
    must: ['2026 China Youth Science and Technology Innovation', '15th "Challenge Cup"']
  },
  {
    path: '/en/publications',
    lang: 'en',
    must: ['national second prize', 'special event of the 15th']
  },
  {
    path: '/en/projects',
    lang: 'en',
    must: ['single source of truth', 'Personal site', 'zero-width-character watermark']
  },
  {
    path: '/en/skills',
    lang: 'en',
    must: ['headless-browser render checks']
  }
]

const browser = await chromium.launch({ channel })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

for (const c of CASES) {
  console.log(`\n${c.path}`)
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))

  await page.goto(BASE + c.path, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(600)

  const body = await page.innerText('body')
  for (const t of c.must) check(`包含「${t}」`, body.includes(t))
  for (const t of c.mustNot || []) check(`已移除「${t}」`, !body.includes(t))

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  )
  check('无横向溢出', overflow <= 0, `${overflow}px`)
  check('无页面级 JS 错误', errors.length === 0, errors.slice(0, 2).join(' | '))
}

await browser.close()
console.log(`\n结果：${fail === 0 ? '全部通过 ✓' : `${fail} 项失败 ✗`}（通过 ${pass}，失败 ${fail}）`)
process.exit(fail === 0 ? 0 : 1)
