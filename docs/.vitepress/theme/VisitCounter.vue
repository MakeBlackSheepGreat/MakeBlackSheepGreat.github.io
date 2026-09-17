<script setup lang="ts">
import { onMounted, ref } from 'vue'

/**
 * 访问计数展示。
 * 数据来自本站自己的 Cloudflare Pages Function（/api/hits），不依赖第三方统计脚本。
 * 在 GitHub Pages 镜像、本地开发等没有该接口的环境下静默隐藏。
 */
const pv = ref<number | null>(null)
const uv = ref<number | null>(null)
const failed = ref(false)

const STORAGE_KEY = 'ls-visitor-id'
const SESSION_KEY = 'ls-counted'

function visitorId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    if (existing) return existing
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(STORAGE_KEY, id)
    return id
  } catch {
    return ''
  }
}

onMounted(async () => {
  try {
    let counted = false
    try {
      counted = sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      counted = false
    }

    const res = counted
      ? await fetch('/api/hits')
      : await fetch('/api/hits', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id: visitorId() })
        })

    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    if (typeof data.pv !== 'number') throw new Error('bad payload')
    pv.value = data.pv
    uv.value = typeof data.uv === 'number' ? data.uv : null
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* 忽略存储失败 */
    }
  } catch {
    failed.value = true
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
