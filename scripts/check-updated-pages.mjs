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
    path: '/notes/',
    lang: 'zh',
    must: [
      // 新增两篇笔记已入索引
      '把核验做到渲染级',
      '先证伪自己',
      // 修正后的口径：框架数量、环境故障类数
      '六套智能体框架',
      '十一类环境故障'
    ],
    mustNot: [
      // 索引不再重复列出 env-troubleshooting（只应出现在工程实践区一次）
      '把环境类故障变成排查手册'
    ]
  },
  {
    path: '/notes/render-level-verification',
    lang: 'zh',
    must: [
      '构建产物取文',
      '渲染级断言',
      '线上字节比对',
      '流水线成功不等于部署生效',
      '必须出现',
      '必须消失'
    ]
  },
  {
    path: '/notes/falsify-yourself-first',
    lang: 'zh',
    must: ['第一嫌疑人永远是检查本身', '词序不匹配', '断言放错了页', '大小写不匹配']
  },
  {
    path: '/notes/env-troubleshooting',
    lang: 'zh',
    must: ['表格随之从七类长到十一类', '案例四：构建被沙箱配额拦下', '按会话累计', '批量失败先重试']
  },
  {
    path: '/en/notes/',
    lang: 'en',
    must: [
      'Verification at the render level',
      'Falsify yourself first',
      'Six agent frameworks',
      'eleven classes of environment failure'
    ],
    mustNot: ['Turning environment failures into a troubleshooting manual']
  },
  {
    path: '/en/notes/render-level-verification',
    lang: 'en',
    must: [
      'take text from the build artifact',
      'assert at the render level',
      'compare bytes against the live site',
      'a green pipeline is not the finish line',
      'A successful pipeline is not a successful deploy'
    ]
  },
  {
    path: '/en/notes/falsify-yourself-first',
    lang: 'en',
    must: ['first suspect is always the check itself', 'word order', 'wrong page', 'letter case']
  },
  {
    path: '/en/notes/env-troubleshooting',
    lang: 'en',
    must: ['grown from seven classes to eleven', 'Case four: a build stopped by the sandbox quota', 'cumulative per session', 'Retry a failing batch first']
  },
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
    must: [
      '2026.10',
      '第十五届“挑战杯”专项赛事',
      '科研蜂群系统',
      '看板为任务真值',
      // 初中经历（2019 – 2020）
      '初中（2019 – 2020）',
      'TAP Minecraft 服务器',
      'CIE MC 服务器工作室',
      '树莓派爱好者基地',
      'Linux 系统与内网穿透'
    ]
  },
  {
    path: '/awards',
    lang: 'zh',
    must: [
      '第十五届',
      '挑战杯',
      '专项赛事',
      '全国学联',
      '英雄不论出处',
      '夺榜挂帅',
      // 更早区初中经历
      '初中阶段（2019 – 2020）',
      'TAP Minecraft 服务器',
      'CIE MC 服务器工作室',
      '树莓派爱好者基地'
    ]
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
    must: [
      '2026.10',
      'Research swarm system',
      'single source of truth',
      // Middle-school years
      'Middle school (2019 – 2020)',
      'TAP Minecraft server',
      'CIE MC server studio',
      'Raspberry Pi enthusiast group',
      'NAT traversal'
    ]
  },
  {
    path: '/en/awards',
    lang: 'en',
    must: [
      '15th "Challenge Cup"',
      'special event',
      'whoever has the ability',
      // Earlier section, middle-school years
      'middle school (2019 – 2020)',
      'TAP Minecraft server',
      'CIE MC server studio',
      'Raspberry Pi enthusiast group',
      'NAT traversal'
    ]
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
