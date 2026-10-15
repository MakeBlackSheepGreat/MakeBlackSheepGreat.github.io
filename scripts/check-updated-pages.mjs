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
      '另两项工作已完成并支撑竞赛获奖',
      // 开源维护动态
      '为 DSH 底层操作工具插件提交鸿蒙平台支持 PR',
      '三处鸿蒙内核与 Linux 的行为差异'
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
      'Linux 系统与内网穿透',
      // 开源项目维护
      '开源鸿蒙编译适配框架贡献',
      'build_in_harmonyos',
      'dsh-ops',
      '24 个 PR',
      '22 个三方库适配到 OpenHarmony aarch64',
      'SIGSYS',
      'O_PATH',
      '8 项 worker 用例与 7 项越界安全边界验证',
      '2026.08 – 10',
      // 向第三方项目提交缺陷报告
      '向第三方项目提交缺陷报告',
      'dsh-connect-workbuddy',
      'applyContextBudgets',
      '代理默认模型随之消失',
      '17 个上游模型的实测目录下有 15 个被误砍'
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
    must: [
      '2026 年度中国青年科技创新“揭榜挂帅”擂台赛',
      '第十五届“挑战杯”专项赛事',
      'build_in_harmonyos',
      'dsh-ops',
      '24 个 PR',
      '22 个三方库适配到 OpenHarmony aarch64',
      '第三方缺陷报告',
      '上下文预算默认值误砍模型'
    ]
  },
  {
    path: '/publications',
    lang: 'zh',
    must: ['国家级二等奖', '第十五届“挑战杯”专项赛事']
  },
  {
    path: '/projects',
    lang: 'zh',
    must: [
      '看板为任务真值',
      '个人主页站点',
      '反抓取设计',
      // 开源项目贡献区
      '开源项目贡献',
      'build_in_harmonyos',
      'dsh-ops',
      '开源鸿蒙编译适配框架',
      'DSH 底层操作工具插件',
      'Conan',
      '24 个 PR',
      '22 个三方库',
      'SIGSYS',
      'O_PATH',
      // 缺陷报告卡片
      'DSH 连接插件 · 缺陷报告者',
      'dsh-connect-workbuddy',
      'applyContextBudgets',
      '配置写入通道的破坏性缺陷',
      '上下文预算默认值缺陷'
    ],
    mustLink: [
      'atomgit.com/OpenHarmonyPCDeveloper/build_in_harmonyos',
      'github.com/T-Auto/dsh-ops',
      'github.com/T-Auto/dsh-ops/pull/53'
    ]
  },
  {
    path: '/skills',
    lang: 'zh',
    must: [
      '无头浏览器渲染核验与交付物生成',
      '开源贡献',
      '跨平台移植与构建',
      'Conan 配方编写',
      'build_in_harmonyos',
      'dsh-ops',
      '第三方缺陷报告'
    ]
  },
  {
    path: '/en/',
    lang: 'en',
    must: [
      '2026.10',
      'Open Competition',
      '15th "Challenge Cup"',
      'Two medical imaging works are finished',
      // Open-source maintenance news item
      'OpenHarmony platform-support pull request for the DSH low-level operations plugin',
      'three behavioural differences between the OpenHarmony kernel and Linux'
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
      'NAT traversal',
      // Open-source maintenance
      'OpenHarmony build compatibility framework contributions',
      'build_in_harmonyos',
      'dsh-ops',
      '24 pull requests',
      '22 third-party libraries to OpenHarmony aarch64',
      'SIGSYS',
      'O_PATH',
      '8-case worker suite and 7 out-of-bounds security-boundary cases',
      '2026.08 – 10',
      // Defect reports to a third-party project
      'Defect reports to a third-party project',
      'dsh-connect-workbuddy',
      'applyContextBudgets',
      'the agent default model disappears',
      '15 were wrongly clamped'
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
    must: [
      '2026 China Youth Science and Technology Innovation',
      '15th "Challenge Cup"',
      'build_in_harmonyos',
      'dsh-ops',
      '24 pull requests',
      '22 third-party libraries to OpenHarmony aarch64',
      'Third-party defect reports',
      'a context-budget default that wrongly clamps models'
    ]
  },
  {
    path: '/en/publications',
    lang: 'en',
    must: ['national second prize', 'special event of the 15th']
  },
  {
    path: '/en/projects',
    lang: 'en',
    must: [
      'single source of truth',
      'Personal site',
      'zero-width-character watermark',
      // Open-source contributions
      'Open-source contributions',
      'build_in_harmonyos',
      'dsh-ops',
      'OpenHarmony build compatibility framework',
      'DSH low-level operations plugin',
      'Conan',
      '24 pull requests',
      '22 third-party libraries',
      'SIGSYS',
      'O_PATH',
      // Defect reporter card
      'DSH connectivity plugin · defect reporter',
      'dsh-connect-workbuddy',
      'applyContextBudgets',
      'A destructive defect in the settings write channel',
      'A faulty default in context budgeting'
    ],
    mustLink: [
      'atomgit.com/OpenHarmonyPCDeveloper/build_in_harmonyos',
      'github.com/T-Auto/dsh-ops',
      'github.com/T-Auto/dsh-ops/pull/53'
    ]
  },
  {
    path: '/en/skills',
    lang: 'en',
    must: [
      'headless-browser render checks',
      'OPEN-SOURCE CONTRIBUTIONS',
      'Cross-platform porting and builds',
      'Conan recipes',
      'build_in_harmonyos',
      'dsh-ops',
      'Third-party defect reports'
    ]
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

  const hrefs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href'))
  )
  for (const t of c.mustLink || []) {
    check(`链接指向「${t}」`, hrefs.some((h) => h.includes(t)))
  }

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  )
  check('无横向溢出', overflow <= 0, `${overflow}px`)
  check('无页面级 JS 错误', errors.length === 0, errors.slice(0, 2).join(' | '))
}

await browser.close()
console.log(`\n结果：${fail === 0 ? '全部通过 ✓' : `${fail} 项失败 ✗`}（通过 ${pass}，失败 ${fail}）`)
process.exit(fail === 0 ? 0 : 1)
