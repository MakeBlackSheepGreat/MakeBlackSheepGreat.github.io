<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { page } = useData()

const isEn = computed(() => page.value.relativePath.startsWith('en/'))

/** 去掉扩展名与结尾的 index，得到目录形式的路径 */
function normalize(rel: string) {
  return rel.replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')
}

/** 目标语言里对应的同一页面；若该页没有对应版本则回首页 */
const target = computed(() => {
  const rel = normalize(page.value.relativePath)
  if (isEn.value) {
    return withBase('/' + rel.replace(/^en\//, ''))
  }
  return withBase('/en/' + rel)
})

const label = computed(() => (isEn.value ? '中文' : 'EN'))
const title = computed(() => (isEn.value ? '切换到中文' : 'Switch to English'))
</script>

<template>
  <a class="lang-switch" :href="target" :title="title" :aria-label="title">
    <span class="lang-switch-icon" aria-hidden="true">🌐</span>
    <span>{{ label }}</span>
  </a>
</template>

<style scoped>
.lang-switch {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  color: var(--vp-c-text-1);
  transition: border-color 0.2s ease, color 0.2s ease;
}

.lang-switch:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.lang-switch-icon {
  font-size: 13px;
  line-height: 1;
}
</style>
