<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

withDefaults(
  defineProps<{
    email?: string
    github?: string
    orcid?: string
    wechatQr?: string
  }>(),
  {
    email: 'yzj876762330@163.com',
    github: 'https://github.com/MakeBlackSheepGreat',
    orcid: 'https://orcid.org/0009-0006-7544-5954',
    wechatQr: '/wechat-qr.png'
  }
)

const hovered = ref(false)
const pinned = ref(false)
const root = ref<HTMLElement | null>(null)

const visible = () => hovered.value || pinned.value

function close() {
  pinned.value = false
  hovered.value = false
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

function onDocClick(e: MouseEvent) {
  if (pinned.value && root.value && !root.value.contains(e.target as Node)) {
    pinned.value = false
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onDocClick)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onDocClick)
})
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
    <a :href="orcid" title="ORCID" aria-label="ORCID" target="_blank" rel="noreferrer">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#a6ce39" />
        <path d="M8.2 7.3h1.5v9.4H8.2z" fill="#fff" />
        <path
          d="M10.9 7.3h2.7c2.4 0 3.9 1.4 3.9 3.6 0 2.3-1.5 3.8-3.9 3.8h-2.7zm1.5 1.3v4.8h1.1c1.6 0 2.5-.9 2.5-2.4 0-1.5-.9-2.4-2.5-2.4z"
          fill="#fff"
          transform="translate(1.2 0) scale(0.82) translate(1.2 1.6)"
        />
      </svg>
    </a>

    <span
      ref="root"
      class="wechat-item"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      <button
        type="button"
        class="wechat-btn"
        :aria-expanded="visible()"
        aria-label="微信二维码"
        title="微信"
        @click="pinned = !pinned"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path
            d="M9.1 3C5.2 3 2 5.7 2 9c0 1.9 1 3.5 2.7 4.6l-.7 2.1 2.4-1.2c.8.2 1.6.4 2.5.4h.5a5.6 5.6 0 0 1-.2-1.5c0-3.2 3-5.8 6.6-5.8h.6C15.6 5 12.7 3 9.1 3zm-2.4 3a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9zm4.9 0a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9z"
          />
          <path
            d="M22 15.1c0-2.7-2.7-4.9-6-4.9s-6 2.2-6 4.9 2.7 4.9 6 4.9c.7 0 1.4-.1 2-.3l1.9 1-.5-1.7c1.6-.9 2.6-2.3 2.6-3.9zm-7.9-1.4a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6zm3.8 0a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z"
          />
        </svg>
      </button>

      <span v-show="visible()" class="wechat-pop" role="dialog" aria-label="微信二维码">
        <img :src="wechatQr" alt="微信二维码" />
        <span class="wechat-pop-note">扫码添加，请注明来意</span>
      </span>
    </span>

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

.social-row a,
.wechat-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s ease;
}

.social-row a:hover,
.wechat-btn:hover {
  color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.wechat-item {
  position: relative;
  display: inline-flex;
}

.wechat-pop {
  position: absolute;
  bottom: 150%;
  left: 50%;
  transform: translateX(-50%);
  width: 190px;
  padding: 10px 10px 8px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.16);
  text-align: center;
  z-index: 30;
}

.wechat-pop img {
  display: block;
  width: 168px;
  height: 168px;
  margin: 0 auto 6px;
}

.wechat-pop-note {
  display: block;
  font-size: 0.76rem;
  line-height: 1.5;
  color: var(--vp-c-text-3);
}
</style>
