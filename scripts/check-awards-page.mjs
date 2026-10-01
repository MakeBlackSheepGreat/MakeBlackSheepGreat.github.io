/**
 * 获奖页渲染核验：在真实浏览器里打开 /awards 与 /en/awards，
 * 断言条目内容、旧措辞已移除、卡片结构完好、无横向溢出。
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
      // 揭榜挂帅条目
      '揭榜挂帅',
      '国家级二等奖',
      '共青团中央',
      '精准清创',
      '成都科奥达光电技术有限公司',
      'Three.js',
      'Electron',
      'PyTorch',
      'FastAPI',
      // 国赛条目：作品名 + 方法细节
      '国家级三等奖',
      '基于超声影像的乳腺肿瘤良恶性分类辅助诊断系统设计',
      '双模型互补集成',
      '病例级五折交叉验证',
      '测试时增强',
      'logit 空间融合',
      '面积门控',
      'Grad-CAM',
      // 省赛条目：方法细节
      '2.5D 六通道',
      '外部验证队列',
      '概率校准',
      // 贡献口径
      '本人承担软件开发与项目报告的技术部分',
      '其余工作由团队其他成员完成'
    ],
    mustNot: [
      'OSTEO VISION：面向颌骨骨髓炎辅助判读',
      'github.com/MakeBlackSheepGreat/osteo-vision',
      '团队 5 人',
      '校赛阶段的参赛作品为乳腺超声辅助诊断系统'
    ],
    goneFromUnrewarded: '赛题为面向颌骨骨髓炎的智能化荧光诊疗',
    expectCards: 5
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
      'National third prize',
      'A benign/malignant classification and diagnosis support system for breast tumours on ultrasound images',
      'complementary dual-model ensemble',
      'patient-level five-fold cross-validation',
      'test-time augmentation',
      'logit space',
      'area gate',
      'Grad-CAM',
      '2.5D six-channel',
      'external cohort',
      'probability calibration',
      'I did the software development and the technical part of the project report',
      'The remaining work was done by other team members'
    ],
    mustNot: [
      'OSTEO VISION: a fluorescence',
      'github.com/MakeBlackSheepGreat/osteo-vision',
      'Five-person team',
      'The entry was the breast ultrasound diagnosis support system'
    ],
    goneFromUnrewarded: 'problem on fluorescence-guided diagnosis and treatment',
    expectCards: 5
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
  check('卡片数量正确', cardCount === c.expectCards, `${cardCount} 张（预期 ${c.expectCards}）`)

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
