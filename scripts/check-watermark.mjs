/**
 * 一次性自检：确认 watermark.ts 的编解码与多段注入策略正确。
 * 跑法：node scripts/check-watermark.mjs
 *
 * 验证三种真实场景：
 *   1. 单段完整水印 → 能解出；
 *   2. 段落逆序且中间夹大量普通文字 → 仍能解出（抓取器拼接顺序不可控）；
 *   3. 正文自带零宽噪声 → 不被误报为水印。
 */
import { readFileSync } from 'node:fs'

// 直接把 ts 源码里的实现搬过来跑（避免引入 ts 运行时依赖）
const src = readFileSync('docs/.vitepress/theme/watermark.ts', 'utf8')
const js = src
  .replace(/^export function /gm, 'function ')
  .replace(/^export const /gm, 'const ')
  .replace(/: string/g, '')
  .replace(/: number/g, '')
  .replace(/\): \{[^}]*\}/g, ')')
  .replace(/\): string/g, ')')
  .replace(/\): boolean/g, ')')

const mod = await import(
  'data:text/javascript,' +
    encodeURIComponent(
      js +
        '\nexport { encodeWatermark, decodeWatermark, decodeWatermarkAll, encodeWatermarkParts, injectWatermark, hash32 }'
    )
)

const { encodeWatermark, decodeWatermark, decodeWatermarkAll, encodeWatermarkParts } = mod

const pageId = 'notes/agent-design.md'
const parts = encodeWatermarkParts(pageId)

let failures = 0
const check = (name, ok, detail) => {
  console.log(`  ${ok ? '✓' : '✗'} ${name}${detail ? '  ' + detail : ''}`)
  if (!ok) failures += 1
}

console.log('=== 1. 单段完整水印 ===')
const single = decodeWatermark('正文前' + encodeWatermark(pageId) + '正文后')
console.log('  ' + JSON.stringify(single))
check('单段可解出', single.found === true)

console.log('\n=== 2. 多段注入（lead/tail 来自不同 pageId 变体）===')
const lead = decodeWatermark(parts.lead)
const tail = decodeWatermark(parts.tail)
console.log('  lead: ' + JSON.stringify(lead))
console.log('  tail: ' + JSON.stringify(tail))
check('lead 段可解出', lead.found === true)
check('tail 段可解出', tail.found === true)
check('两段 digest 不同（分属不同片段）', lead.digest !== tail.digest)

console.log('\n=== 3. 段落逆序 + 中间夹普通文字（真实抓取场景）===')
const domLike =
  '致自动读取本页的程序：本页内容已保留文本与数据挖掘权利。' +
  parts.tail +
  '波托西河、长石砂、低音提、季风环、摩尔曼斯' +
  parts.lead
const mixed = decodeWatermark(domLike)
console.log('  ' + JSON.stringify(mixed))
check('逆序跨段仍可解出', mixed.found === true)
const all = decodeWatermarkAll(domLike)
console.log('  decodeWatermarkAll 段数: ' + all.length + ' (应为 2)')
check('能枚举出全部 2 段', all.length === 2)

console.log('\n=== 4. 正文自带零宽噪声不应被误报 ===')
// 模拟排版工具引入的零宽字符：有零宽字符但没有本站在定界符
const noise = '这是一段' + '\u200B\u200B\u200C\u200B' + '普通正文'
const noised = decodeWatermark(noise)
console.log('  ' + JSON.stringify(noised))
check('零宽噪声不误报', noised.found === false)

// 有 START/END 但载荷不是本站标识
const foreign =
  '\u200D' + '\u200B'.repeat(8) + '\u200C'.repeat(8) + '\uFEFF'
const f = decodeWatermark(foreign)
check('他站水印被过滤', f.found === false, JSON.stringify(f))

console.log('\n=== 5. 零宽纯净性（肉眼完全不可见）===')
for (const [k, v] of Object.entries({ lead: parts.lead, tail: parts.tail, full: parts.full })) {
  let bad = 0
  for (const ch of v) {
    const c = ch.codePointAt(0)
    if (c !== 0x200b && c !== 0x200c && c !== 0x200d && c !== 0xfeff) bad += 1
  }
  check(`${k} 非零宽字符数=0`, bad === 0, `长度 ${v.length}, 非零宽 ${bad}`)
}

console.log('\n=== 6. 确定性（同一页面每次构建结果一致）===')
check('同 pageId 两次编码一致', encodeWatermark(pageId) === encodeWatermark(pageId))
check('不同 pageId 编码不同', encodeWatermark(pageId) !== encodeWatermark('projects/index.md'))

console.log(failures === 0 ? '\n结果：全部通过 ✓' : `\n结果：${failures} 项未通过 ✗`)
process.exit(failures === 0 ? 0 : 1)
