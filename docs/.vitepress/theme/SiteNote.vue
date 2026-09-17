<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

/**
 * 全站页脚下方的一行小字。
 * 中文站与英文站各自使用对应文案。
 */
const { page } = useData()
const isEn = computed(() => page.value.relativePath.startsWith('en/'))
</script>

<template>
  <p class="site-note">
    <span class="site-note-mark" aria-hidden="true">♡</span>
    <template v-if="isEn">
      With a soft spot for
      <strong>DeepSeek V4.1 Flash</strong> — fast, cheap, capable enough for one person to run a
      whole pipeline
    </template>
    <template v-else>
      热爱
      <strong>DeepSeek V4.1 Flash</strong>
      · 快、省、够用，一个人也能把整条流水线跑完
    </template>
  </p>
</template>

<style scoped>
.site-note {
  padding: 0 24px 26px;
  text-align: center;
  font-size: 0.78rem;
  line-height: 1.7;
  color: var(--vp-c-text-3);
}

.site-note strong {
  color: var(--vp-c-text-2);
  font-weight: 600;
}

.site-note-mark {
  margin-right: 5px;
  color: #4d6bfe;
}

@media print {
  .site-note {
    display: none;
  }
}
</style>
