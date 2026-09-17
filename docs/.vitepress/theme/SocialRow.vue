<script setup lang="ts">
withDefaults(
  defineProps<{
    email?: string
    github?: string
  }>(),
  {
    email: 'yzj876762330@163.com',
    github: 'https://github.com/MakeBlackSheepGreat'
  }
)
</script>

<template>
  <div class="social-row">
    <a :href="`mailto:${email}`" title="Email" aria-label="Email">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7">
        <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    </a>
    <a :href="github" title="GitHub" aria-label="GitHub" target="_blank" rel="noreferrer">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path
          d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.34 1.12 2.91.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.8-4.57 5.05.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.6.69.49A10.06 10.06 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"
        />
      </svg>
    </a>
    <slot />
  </div>
</template>

<style scoped>
.social-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 1.2rem 0 0.4rem;
  color: var(--vp-c-text-2);
}

.social-row a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  transition: color 0.2s ease, transform 0.2s ease;
}

.social-row a:hover {
  color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}
</style>
