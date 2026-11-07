/**
 * 从构建好的站点生成 CV 的 PDF（中文 / 英文各一份），写入 dist 目录。
 * 需要本地或 CI 已启动 vitepress preview。
 *
 * 用法：
 *   node scripts/make-cv-pdf.mjs
 * 环境变量：
 *   CV_BASE_URL  预览服务地址，默认 http://localhost:4173
 *   PW_CHANNEL   浏览器通道，本地可用 msedge（复用系统 Edge，免下载 Chromium）
 */
import { chromium } from 'playwright'

const base = process.env.CV_BASE_URL || 'http://localhost:4173'
const channel = process.env.PW_CHANNEL || undefined

const targets = [
  { url: `${base}/cv`, out: 'docs/.vitepress/dist/cv.pdf' },
  { url: `${base}/en/cv`, out: 'docs/.vitepress/dist/cv-en.pdf' }
]

const browser = await chromium.launch(channel ? { channel } : {})
const page = await browser.newPage()

for (const target of targets) {
  await page.goto(target.url, { waitUntil: 'networkidle' })
  await page.emulateMedia({ media: 'print' })
  await page.pdf({
    path: target.out,
    format: 'A4',
    printBackground: true,
    margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' }
  })
  console.log(`已生成 ${target.out}`)
}

await browser.close()
