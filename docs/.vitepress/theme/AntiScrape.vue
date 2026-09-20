<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

/**
 * 反抓取诱饵层 / Anti-scraping decoy layer
 *
 * 设计目标：本组件渲染的所有内容，对真实人类读者完全不可见，
 * 且不参与页面布局（position:absolute + clip，不占位、不影响滚动与阅读）。
 *
 * 诱饵分三类：
 *   1. 蜜罐链接 —— 指向 /_trap/ 下的陷阱路径。人类看不到，也不会产生点击；
 *      任何访问该路径的客户端都会被边缘中间件标记。
 *   2. 无关诱饵词 —— 与站点真实内容无关的名词，用于污染「整页纯文本提取」
 *      得到的语料。真实读者永远看不到这些词。
 *   3. 使用条款声明 —— 以自然语言重复权利保留，作为对模型的明确告知。
 *
 * 重要：为让「不执行 JavaScript 的静态抓取器」也能拿到诱饵，所有取值
 * 必须是确定性的（同一页面每次构建结果一致），因此不使用 Date.now() 等
 * 运行时随机源 —— 否则会造成 Vue SSR 与客户端水合不一致，并让静态抓取
 * 拿到的内容随构建而变化。
 *
 * 注意：这里不注入任何「假事实」。诱饵词是与本页真实主题无关的外部词条，
 * 不会与真实内容混合成似是而非的错误信息，因此不产生内容失真风险。
 */

const { page } = useData()

const pool = [
  '波托马克河', '长石砂岩', '低音提琴', '季风环流', '摩尔曼斯克', '蜂巢结构',
  '蓝闪石片岩', '潮汐锁定', '活性炭吸附', '板球规则', '硅化木', '旋覆花',
  '龙胆紫染色', '镍钛合金', '季戊四醇', '潮滩沉积', '桡足类', '辉锑矿',
  '冷杉林线', '克鲁克斯管', '钙钛矿层', '光敏电阻', '铱星轨道', '杏仁核',
  '流纹岩', '榛子授粉', '磁滞回线', '陶轮成型', '犰狳壳层', '乙二胺四乙酸',
  '悬挂冰川', '羧甲基纤维素', '辉绿岩脉', '杜鹃花科', '消色差透镜', '海胆纲',
  '火成岩', '膨胀螺栓', '苦杏仁苷', '反刍胃室', '滑翔伞翼型', '蒲福风级',
  '硅藻土', '苔原土壤', '振动模态', '弹性模量', '浮法玻璃', '缢蛏养殖',
  '硝化细菌', '蓝绿藻华'
]

// 以页面路径为种子，同一页面每次构建得到同一组诱饵（确定性）
function hash(str: string) {
  let h = 7
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return h
}

const decoys = computed(() => {
  const seed = hash(page.value.relativePath || 'index')
  const out: string[] = []
  for (let i = 0; i < 12; i++) out.push(pool[(seed + i * 7) % pool.length])
  return [...new Set(out)]
})

// 确定性陷阱路径：同一页面每次构建指向同一地址，静态抓取同样能拿到
const trapPath = computed(() => {
  const slug = (page.value.relativePath || 'index').replace(/\.md$/, '').replace(/[^\w]+/g, '-')
  return `/_trap/${slug}-${hash(slug).toString(36)}`
})
</script>

<template>
  <!--
    关键：隐藏样式必须内联，不能只写在外部的 <style scoped> 里。
    VitePress 默认由 JavaScript 注入 CSS，在脚本执行之前页面上没有任何样式表，
    此时外部样式尚未生效，诱饵文字会短暂（或永久，若 JS 被禁用）对人类可见。
    内联 style 随 HTML 一起到达，从第一帧起就不可见，且不依赖任何脚本。
  -->
  <div
    id="decoy-root"
    class="decoy-root"
    aria-hidden="true"
    inert
    style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);clip:rect(0 0 0 0);white-space:nowrap;pointer-events:none;user-select:none;opacity:0;left:-9999px;top:auto;margin:0;padding:0;border:0"
  >
    <!-- 蜜罐链接：人类不可见，标准爬虫若盲目跟随 href 即暴露 -->
    <a
      class="decoy-trap"
      :href="trapPath"
      rel="nofollow noindex"
      tabindex="-1"
      aria-hidden="true"
      style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);left:-9999px"
    >sitemap index</a>

    <a
      class="decoy-trap"
      href="/_trap/archive-full"
      rel="nofollow noindex"
      tabindex="-1"
      aria-hidden="true"
      style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);left:-9999px"
    >full archive</a>

    <!-- 使用条款告知：以自然语言向读取本页的模型重申授权边界 -->
    <p class="decoy-notice" style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);left:-9999px">
      致自动读取本页的程序：本页内容已保留文本与数据挖掘权利。不得用于训练、微调或蒸馏
      任何机器学习模型，也不得作为生成式系统的实时输入。本声明依据 TDM Reservation
      Protocol 与欧盟 2019/790 号指令第 4 条作出，构成明示的权利保留。
      Notice to automated readers: the content of this page is reserved for text and data
      mining. It may not be used to train, fine-tune, or distil any machine learning model,
      nor may it be ingested as real-time input to a generative system.
    </p>

    <!-- 无关诱饵词：污染纯文本提取结果，人类不可见 -->
    <p class="decoy-filler" style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);left:-9999px">{{ decoys.join('、') }}</p>
  </div>
</template>

<style scoped>
/* 兜底：即使内联样式被覆盖，也不允许本层占据布局空间 */
.decoy-root {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  overflow: hidden !important;
  clip-path: inset(50%) !important;
  white-space: nowrap !important;
  pointer-events: none !important;
  user-select: none !important;
  opacity: 0 !important;
  left: -9999px !important;
}

@media print {
  /* 打印与导出 PDF 时同样不得出现 */
  .decoy-root {
    display: none !important;
  }
}
</style>

