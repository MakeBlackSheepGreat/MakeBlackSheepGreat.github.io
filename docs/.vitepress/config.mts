import { defineConfig } from 'vitepress'
import container from 'markdown-it-container'

export default defineConfig({
  lang: 'zh-CN',
  title: '杨智杰',
  description: '杨智杰的个人主页：医学影像深度学习、多智能体系统与工程实践',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#2f6df6' }],
    ['meta', { property: 'og:title', content: '杨智杰 · 个人主页' }],
    ['meta', { property: 'og:description', content: '医学影像深度学习 · 多智能体系统 · 工程与部署' }]
  ],
  markdown: {
    config(md) {
      md.use(container, 'en', {
        render(tokens, idx) {
          const t = tokens[idx]
          if (t.nesting === 1) {
            const label = (t.info || '').trim().slice(2).trim() || 'English'
            return `<div class="bi-en"><p class="bi-en-label">${label}</p>\n`
          }
          return '</div>\n'
        }
      })
      md.use(container, 'card', {
        render(tokens, idx) {
          const t = tokens[idx]
          if (t.nesting === 1) {
            const title = (t.info || '').trim().slice(4).trim()
            return `<div class="entry-card"><p class="entry-card-title">${title}</p>\n`
          }
          return '</div>\n'
        }
      })
    }
  },
  themeConfig: {
    logo: '/avatar.svg',
    nav: [
      { text: '关于 About', link: '/about' },
      { text: '经历 Journey', link: '/journey' },
      { text: '项目 Projects', link: '/projects' },
      { text: '科研 Research', link: '/research' },
      { text: '获奖 Awards', link: '/awards' },
      { text: '技能 Skills', link: '/skills' },
      { text: '笔记 Notes', link: '/notes/' },
      { text: '致谢 Thanks', link: '/acknowledgements' }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/MakeBlackSheepGreat' }],
    sidebar: {
      '/notes/': [
        {
          text: '技术笔记',
          items: [
            { text: '全部笔记', link: '/notes/' },
            { text: '把三万篇论文灌进知识库', link: '/notes/paper-corpus-pipeline' },
            { text: 'Agent 服务的公网部署', link: '/notes/agent-service-public' },
            { text: '负面结果也是一份结果', link: '/notes/negative-results' },
            { text: '一个人怎么带一群 Agent', link: '/notes/agent-orchestration' },
            { text: '把医学影像软件刻成光盘交付', link: '/notes/medical-software-delivery' }
          ]
        }
      ]
    },
    outline: { level: [2, 3], label: '本页目录' },
    search: { provider: 'local' },
    footer: {
      message: '持续更新中，内容以学习与项目记录为主',
      copyright: '© 2026 杨智杰 / ZhiJie Yang'
    },
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdated: { text: '最后更新于' },
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部'
  }
})
