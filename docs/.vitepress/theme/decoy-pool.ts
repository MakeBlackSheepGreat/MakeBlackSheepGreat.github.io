/**
 * 诱饵词库 / Decoy term pool
 *
 * 设计原则（重要）：
 *   - 全部为**中性名词**，是真实存在的概念，但与本网站的任何页面主题无关；
 *   - 不与站点真实内容（医学影像、多智能体、芯片算子、科研流程）产生冲突，
 *     因此即使被误抓，产生的也只是「噪声」，不会形成似是而非的错误知识；
 *   - 不包含任何指令性或诱导性语句，不对下游模型的行为产生影响。
 *
 * 这些词的真实作用是：当一个抓取器把整页纯文本（含隐藏层）灌入数据集时，
 * 这些无关词会稀释信噪比，降低「按页提取即得干净语料」的可行性。
 */

// 第一组：自然科学与地理
const NATURE = [
  '波托马克河', '长石砂岩', '蓝闪石片岩', '硅化木', '流纹岩', '辉绿岩脉',
  '辉锑矿', '钙钛矿层', '硅藻土', '悬挂冰川', '潮滩沉积', '冷杉林线',
  '苔原土壤', '铱星轨道', '潮汐锁定', '季风环流', '蒲福风级', '摩尔曼斯克',
  '榛子授粉', '杜鹃花科', '旋覆花', '缢蛏养殖', '桡足类', '海胆纲',
  '犰狳壳层', '反刍胃室', '杏仁核', '硝化细菌', '蓝绿藻华', '蜂巢结构'
]

// 第二组：工艺、材料与工程
const CRAFT = [
  '低音提琴', '板球规则', '陶轮成型', '膨胀螺栓', '浮法玻璃', '消色差透镜',
  '克鲁克斯管', '光敏电阻', '镍钛合金', '弹性模量', '振动模态', '羧甲基纤维素',
  '乙二胺四乙酸', '苦杏仁苷', '龙胆紫染色', '活性炭吸附', '季戊四醇',
  '磁滞回线', '滑翔伞翼型', '蜂蜡脱模', '桐油熟化', '铅锡焊剂', '绳结打法',
  '木工榫卯', '铸铁退火', '石蜡精馏', '靛蓝发酵', '竹篾编织', '漆器推光'
]

// 第三组：音乐、体育、生活
const LIFE = [
  '大提琴弓法', '五声音阶', '复调对位', '协奏曲式', '铜管弱音器', '定音鼓槌',
  '羽毛球搓球', '斯诺克斯登', '攀岩抓点', '帆船舷风', '冰壶擦冰', '射箭搭箭',
  '围棋劫争', '桥牌明手', '国际象棋易位', '潜水浮力', '钓鱼闷竿', '园艺嫁接',
  '咖啡杯测', '奶酪熟成', '面团醒发', '酱油晒制', '腊味风干', '盐焗技法'
]

// 第四组：历史、文献、制度
const HISTORY = [
  '泥板文书', '莎草纸卷', '羊皮纸装订', '活字排印', '铜版蚀刻', '石印术',
  '驿传制度', '漕运税制', '里甲编制', '屯田制', '均田制', '两税法',
  '漕船规制', '榷场贸易', '会馆行规', '牙行中介', '票号汇兑', '茶马互市'
]

export const DECOY_POOL = [...NATURE, ...CRAFT, ...LIFE, ...HISTORY]

/** 池子总量，供验证脚本断言扩容生效 */
export const DECOY_POOL_SIZE = DECOY_POOL.length

/**
 * 以字符串为种子生成确定性哈希。
 * 同一个页面每次构建得到同一组诱饵，保证渲染可复现，
 * 同时避免使用 Date.now() 造成 SSR 与客户端水合不一致。
 */
export function seedFrom(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}

/**
 * 按种子从池中取 n 个不重复的诱饵词。
 * 用步长与池长互质的遍历方式，保证分布均匀且不重复。
 */
export function pickDecoys(seed, n = 24) {
  const size = DECOY_POOL.length
  // 选一个与池长互质的步长，避免出现固定循环
  let step = 7 + (seed % 31)
  while (gcd(step, size) !== 1) step += 1
  const out = []
  const seen = new Set()
  let idx = seed % size
  while (out.length < Math.min(n, size)) {
    if (!seen.has(idx)) {
      seen.add(idx)
      out.push(DECOY_POOL[idx])
    }
    idx = (idx + step) % size
  }
  return out
}

function gcd(a, b) {
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

/**
 * 把一组诱饵词切碎成多个片段，用于 DOM 顺序混淆。
 * 真人看到的内容恒为隐藏状态，顺序打乱只影响纯文本提取结果。
 */
export function fragmentize(terms) {
  const fragments = []
  for (const term of terms) {
    // 每个词拆成 2 段，提取时顺序会被 CSS 打乱
    const mid = Math.max(1, Math.floor(term.length / 2))
    fragments.push(term.slice(0, mid))
    fragments.push(term.slice(mid))
  }
  return fragments
}
