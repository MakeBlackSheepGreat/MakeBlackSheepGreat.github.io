import { defineConfig } from 'vitepress'
import container from 'markdown-it-container'

export default defineConfig({
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#2f6df6' }]
  ],
  markdown: {
    config(md) {
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
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: '杨智杰',
      description: '杨智杰的个人主页：医学影像深度学习、多智能体系统与工程实践',
      themeConfig: {
        logo: '/avatar.svg',
        nav: [
          { text: '关于', link: '/about' },
          { text: '经历', link: '/journey' },
          { text: '项目', link: '/projects' },
          { text: '科研', link: '/research' },
          { text: '获奖', link: '/awards' },
          { text: '技能', link: '/skills' },
          { text: '笔记', link: '/notes/' },
          { text: '致谢', link: '/acknowledgements' }
        ],
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
        socialLinks: [{ icon: 'github', link: 'https://github.com/MakeBlackSheepGreat' }],
        outline: { level: [2, 3], label: '本页目录' },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
              }
            }
          }
        },
        footer: {
          message: '持续更新中，内容以学习与项目记录为主',
          copyright: '© 2026 杨智杰 / ZhiJie Yang'
        },
        docFooter: { prev: '上一页', next: '下一页' },
        lastUpdated: { text: '最后更新于' },
        darkModeSwitchLabel: '外观',
        darkModeSwitchTitle: '切换到深色模式',
        lightModeSwitchTitle: '切换到浅色模式',
        sidebarMenuLabel: '目录',
        returnToTopLabel: '回到顶部',
        langMenuLabel: '切换语言'
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'ZhiJie Yang',
      description: 'ZhiJie Yang — medical imaging deep learning, multi-agent systems and engineering practice',
      themeConfig: {
        logo: '/avatar.svg',
        nav: [
          { text: 'About', link: '/en/about' },
          { text: 'Journey', link: '/en/journey' },
          { text: 'Projects', link: '/en/projects' },
          { text: 'Research', link: '/en/research' },
          { text: 'Awards', link: '/en/awards' },
          { text: 'Skills', link: '/en/skills' },
          { text: 'Notes', link: '/en/notes/' },
          { text: 'Thanks', link: '/en/acknowledgements' }
        ],
        sidebar: {
          '/en/notes/': [
            {
              text: 'Notes',
              items: [
                { text: 'All notes', link: '/en/notes/' },
                { text: 'Ingesting 30k papers', link: '/en/notes/paper-corpus-pipeline' },
                { text: 'Publishing an agent service', link: '/en/notes/agent-service-public' },
                { text: 'Negative results count too', link: '/en/notes/negative-results' },
                { text: 'Running a team of agents', link: '/en/notes/agent-orchestration' },
                { text: 'Shipping medical software on a disc', link: '/en/notes/medical-software-delivery' }
              ]
            }
          ]
        },
        socialLinks: [{ icon: 'github', link: 'https://github.com/MakeBlackSheepGreat' }],
        outline: { level: [2, 3], label: 'On this page' },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: 'Search', buttonAriaLabel: 'Search' },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Reset search',
                footer: { selectText: 'select', navigateText: 'navigate', closeText: 'close' }
              }
            }
          }
        },
        footer: {
          message: 'Continuously updated — mostly learning and project records',
          copyright: '© 2026 ZhiJie Yang'
        },
        docFooter: { prev: 'Previous', next: 'Next' },
        lastUpdated: { text: 'Last updated' },
        darkModeSwitchLabel: 'Appearance',
        darkModeSwitchTitle: 'Switch to dark theme',
        lightModeSwitchTitle: 'Switch to light theme',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Return to top',
        langMenuLabel: 'Change language'
      }
    }
  }
})
