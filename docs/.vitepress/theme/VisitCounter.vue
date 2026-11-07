<script setup lang="ts">
import { onMounted, ref } from 'vue'

/**
 * 访问计数展示。
 * 数据来自本站自己的 Cloudflare Pages Function（/api/hits），不依赖第三方统计脚本。
 *
 * - 在 Cloudflare Pages（home.liteblacksheep.asia）上走同源接口；
 * - 在 GitHub Pages 镜像上没有该函数，则回退到 Cloudflare 域名上的同一接口（函数已开放跨域）；
 * - 本地开发两者都不可用时静默隐藏，不产生任何报错。
 */
const pv = ref<number | null>(null)
const uv = ref<number | null>(null)
const failed = ref(false)

const STORAGE_KEY = 'ls-visitor-id'
const SESSION_KEY = 'ls-counted'
const FALLBACK_ENDPOINT = 'https://home.liteblacksheep.asia/api/hits'

function visitorId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    if (existing) return existing
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(STORAGE_KEY, id)
    return id
  } catch {
    return ''
  }
}

async function callApi(base: string, counted: boolean) {
  const res = counted
    ? await fetch(base, { credentials: 'omit' })
    : await fetch(base, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: visitorId() }),
        credentials: 'omit'
      })
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}

onMounted(async () => {
  let counted = false
  try {
    counted = sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    counted = false
  }

  let data: any = null
  try {
    data = await callApi('/api/hits', counted)
  } catch {
    try {
      data = await callApi(FALLBACK_ENDPOINT, counted)
    } catch {
      failed.value = true
      return
    }
  }

  if (!data || typeof data.pv !== 'number') {
    failed.value = true
    return
  }

  pv.value = data.pv
  uv.value = typeof data.uv === 'number' ? data.uv : null
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* 忽略存储失败 */
  }
})
</script>

<template>
  <p v-if="!failed && pv !== null" class="visit-counter">
    <span class="visit-counter-icon" aria-hidden="true">◍</span>
    本站访问 <strong>{{ pv.toLocaleString() }}</strong> 次<template v-if="uv !== null">
      · 独立访客 <strong>{{ uv.toLocaleString() }}</strong> 人</template
    >
  </p>
</template>

<style scoped>
.visit-counter {
  margin: 1.6rem 0 0.2rem;
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  letter-spacing: 0.01em;
}

.visit-counter strong {
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
}

.visit-counter-icon {
  margin-right: 4px;
  color: var(--vp-c-brand-1);
}

@media print {
  .visit-counter {
    display: none;
  }
}
</style>
