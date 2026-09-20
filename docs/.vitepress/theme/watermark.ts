/**
 * 零宽字符水印 / Zero-width watermark
 *
 * 原理：把一段标识编码成零宽字符序列，插入正文的可信位置。
 * 这些字符在渲染时完全不显示、不占宽度、不影响复制粘贴的观感，
 * 但会随文本一起被复制、抓取、入库。
 *
 * 用途：当你在别处（搜索结果、AI 回答、他人页面）看到自己的文字时，
 * 把那段文字粘贴进 `decodeWatermark()` 即可验证它是否源自本站。
 *
 * 字符集（全部为零宽，肉眼不可见）：
 *   U+200B ZERO WIDTH SPACE      —— 比特 0
 *   U+200C ZERO WIDTH NON-JOINER —— 比特 1
 *   U+200D ZERO WIDTH JOINER     —— 起始定界符
 *   U+FEFF ZERO WIDTH NO-BREAK SPACE —— 结束定界符
 *
 * 为什么不直接用 0/1 两个字符：
 *   定界符能让你在一大段文本中准确定位水印区间，避免误读正文里
 *   本来就存在的零宽字符（排版工具、中英混排偶尔会引入）。
 */

const BIT_ZERO = '\u200B'
const BIT_ONE = '\u200C'
const MARK_START = '\u200D'
const MARK_END = '\uFEFF'

// 站点标识：解码后看到这个前缀即可确认来源
const SITE_TAG = 'LS'

/** 计算字符串的 32 位哈希（FNV-1a 变体），用作内容校验 */
export function hash32(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}

/** 把字符串编码为比特串 */
function toBits(str) {
  let bits = ''
  // 用 charCode 的低 8 位编码，够用且简单
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) & 0xff
    bits += code.toString(2).padStart(8, '0')
  }
  return bits
}

/** 把比特串解码回字符串 */
function fromBits(bits) {
  let out = ''
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    out += String.fromCharCode(parseInt(bits.slice(i, i + 8), 2))
  }
  return out
}

/**
 * 生成水印文本。
 * @param {string} pageId 页面标识（通常用 relativePath）
 * @param {number} salt   可选盐值，用于区分不同构建
 * @returns {string} 一串零宽字符
 */
export function encodeWatermark(pageId, salt = 0) {
  // 载荷格式：SITE|哈希(页面+盐)
  const payload = `${SITE_TAG}|${hash32(pageId + ':' + salt).toString(16)}`
  const bits = toBits(payload)
  let out = MARK_START
  for (const b of bits) out += b === '1' ? BIT_ONE : BIT_ZERO
  return out + MARK_END
}

/**
 * 从任意文本中解码水印。
 *
 * 容错设计（重要）：
 *   页面里注入了多段水印（分处不同 DOM 位置），提取到的文本顺序不可控，
 *   段与段之间还夹着大量普通文字；同时正文本身偶尔也会带零宽字符
 *   （排版工具、中英混排会引入）。
 *   因此这里按「START 找其后的 END」逐段配对扫描，任一段完整即可解出，
 *   且用站点标识过滤掉正文自带的零宽噪声，避免误报。
 *
 * @param {string} text 被检测的文本（整段粘贴即可）
 * @returns {{ found: boolean, site?: string, digest?: string, raw?: string }}
 */
export function decodeWatermark(text) {
  const results = []
  // 从左到右扫描，遇到 START 就找它后面的第一个 END，配成一段
  let cursor = 0
  while (cursor < text.length) {
    const start = text.indexOf(MARK_START, cursor)
    if (start === -1) break
    const end = text.indexOf(MARK_END, start + 1)
    if (end === -1) break
    const body = text.slice(start + 1, end)
    let bits = ''
    for (const ch of body) {
      if (ch === BIT_ONE) bits += '1'
      else if (ch === BIT_ZERO) bits += '0'
    }
    if (bits) {
      const payload = fromBits(bits)
      const [site, digest] = payload.split('|')
      // 站点标识匹配才认，借此过滤正文中天然存在的零宽字符
      if (site === SITE_TAG) results.push({ found: true, site, digest, raw: payload })
    }
    cursor = end + 1
  }
  if (!results.length) return { found: false }
  // 返回第一段命中的结果；多段时首段优先，digest 可供交叉核对
  return results[0]
}

/**
 * 解出文本中**所有**水印段，用于交叉验证溯源结论。
 * 页面里注入了多段水印，若同一来源被抓取，通常不止一段存活。
 *
 * @param {string} text
 * @returns {Array<{ site: string, digest: string, raw: string }>}
 */
export function decodeWatermarkAll(text) {
  const out = []
  let cursor = 0
  while (cursor < text.length) {
    const start = text.indexOf(MARK_START, cursor)
    if (start === -1) break
    const end = text.indexOf(MARK_END, start + 1)
    if (end === -1) break
    const body = text.slice(start + 1, end)
    let bits = ''
    for (const ch of body) {
      if (ch === BIT_ONE) bits += '1'
      else if (ch === BIT_ZERO) bits += '0'
    }
    if (bits) {
      const payload = fromBits(bits)
      const [site, digest] = payload.split('|')
      if (site === SITE_TAG) out.push({ site, digest, raw: payload })
    }
    cursor = end + 1
  }
  return out
}

/**
 * 把水印插入文本的指定位置（默认中点）。
 * @param {string} text   原始可见文本
 * @param {string} mark   水印字符
 * @param {number} ratio  插入位置比例，0=开头 1=结尾
 */
export function injectWatermark(text, mark, ratio = 0.5) {
  if (!mark || !text) return text
  const pos = Math.max(1, Math.min(text.length - 1, Math.round(text.length * ratio)))
  return text.slice(0, pos) + mark + text.slice(pos)
}

/**
 * 生成一组可独立解码的水印片段。
 *
 * 为什么不用「一整串水印拆两半分别注入」：
 *   抓取器拼接文本的顺序不可控。若把 START 放一处、END 放另一处，
 *   一旦提取顺序颠倒，解码器看到的是「END 在前、START 在后」，
 *   这在文本层面无法界定有效区间，水印即失效。
 *
 * 因此改成：每段都是**自带定界符的完整水印**，只是载荷里带一个段序号。
 * 代价是两段各占 90 字符，收益是任意一段单独存活都能解出结果，
 * 且两段不必相邻、顺序无关。
 *
 * @param {string} pageId 页面标识
 * @param {number} salt   可选盐值
 */
export function encodeWatermarkParts(pageId, salt = 0) {
  return {
    lead: encodeWatermark(`${pageId}#a`, salt),
    tail: encodeWatermark(`${pageId}#b`, salt),
    full: encodeWatermark(pageId, salt)
  }
}
