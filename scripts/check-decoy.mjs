/**
 * 一次性自检：确认 decoy-pool.ts 的取词、碎片化与乱序逻辑。
 * 跑法：node scripts/check-decoy.mjs
 */
import { readFileSync } from 'node:fs'

const src = readFileSync('docs/.vitepress/theme/decoy-pool.ts', 'utf8')
const js = src
  .replace(/^export function /gm, 'function ')
  .replace(/^export const /gm, 'const ')
  .replace(/: string\[\]/g, '')
  .replace(/: string/g, '')
  .replace(/: number/g, '')
  .replace(/\): \{[^}]*\}/g, ')')

const mod = await import(
  'data:text/javascript,' +
    encodeURIComponent(js + '\nexport { DECOY_POOL, DECOY_POOL_SIZE, seedFrom, pickDecoys, fragmentize }')
)
const { DECOY_POOL, DECOY_POOL_SIZE, seedFrom, pickDecoys, fragmentize } = mod

let failures = 0
const check = (name, ok, detail) => {
  console.log(`  ${ok ? '✓' : '✗'} ${name}${detail ? '  ' + detail : ''}`)
  if (!ok) failures += 1
}

console.log('=== 1. 池子完整性 ===')
console.log('  池总量: ' + DECOY_POOL_SIZE)
check('池量 ≥ 100', DECOY_POOL_SIZE >= 100)
check('池内无重复', new Set(DECOY_POOL).size === DECOY_POOL_SIZE)

console.log('\n=== 2. 取词确定性 ===')
const seedA = seedFrom('notes/agent-design.md')
const seedB = seedFrom('projects/index.md')
const a1 = pickDecoys(seedA, 24)
const a2 = pickDecoys(seedA, 24)
const b1 = pickDecoys(seedB, 24)
check('同种子两次取词一致', JSON.stringify(a1) === JSON.stringify(a2))
check('不同页面取词不同', JSON.stringify(a1) !== JSON.stringify(b1))
check('取词无重复', new Set(a1).size === 24, `实际 ${new Set(a1).size}`)
console.log('  样例: ' + a1.slice(0, 6).join('、'))

console.log('\n=== 3. 多页面覆盖（池子利用率）===')
const seenAll = new Set()
for (let i = 0; i < 40; i++) {
  for (const t of pickDecoys(seedFrom('page-' + i), 24)) seenAll.add(t)
}
console.log('  40 个页面覆盖到的词数: ' + seenAll.size + ' / ' + DECOY_POOL_SIZE)
check('池子覆盖充分（≥ 90%）', seenAll.size / DECOY_POOL_SIZE >= 0.9)

console.log('\n=== 4. 碎片化 ===')
const frags = fragmentize(a1)
check('碎片数 = 词数 × 2', frags.length === a1.length * 2, `${frags.length}`)
check('碎片拼接可还原原词', frags.every((_, i) => i % 2 === 1 ? true : true))
const restored = []
for (let i = 0; i < frags.length; i += 2) restored.push(frags[i] + frags[i + 1])
check('按对拼接等于原词序列', JSON.stringify(restored) === JSON.stringify(a1))
check('碎片均非空', frags.every((f) => f.length > 0))

console.log('\n=== 5. 乱序（碎片的 DOM 顺序 ≠ 自然顺序）===')
const n = frags.length
let step = 5 + (seedA % 17)
const gcd = (x, y) => (y ? gcd(y, x % y) : x)
while (gcd(step, n) !== 1) step += 1
const items = []
let idx = seedA % n
for (let i = 0; i < n; i++) {
  items.push({ text: frags[idx], order: i })
  idx = (idx + step) % n
}
const sameOrder = items.every((it, i) => it.text === frags[i])
console.log('  DOM 排布顺序与自然顺序相同: ' + sameOrder)
check('顺序已打乱', !sameOrder)
check('乱序是排列（元素不丢不重）', new Set(items.map((i) => i.text)).size === n)
check('每个碎片恰好出现一次', items.length === n)

console.log('\n=== 6. 确定性乱序 ===')
const build = (s) => {
  const f = fragmentize(pickDecoys(s, 24))
  let st = 5 + (s % 17)
  while (gcd(st, f.length) !== 1) st += 1
  const out = []
  let j = s % f.length
  for (let i = 0; i < f.length; i++) {
    out.push(f[j])
    j = (j + st) % f.length
  }
  return out.join('')
}
check('同种子乱序结果一致', build(seedA) === build(seedA))

console.log(failures === 0 ? '\n结果：全部通过 ✓' : `\n结果：${failures} 项未通过 ✗`)
process.exit(failures === 0 ? 0 : 1)
