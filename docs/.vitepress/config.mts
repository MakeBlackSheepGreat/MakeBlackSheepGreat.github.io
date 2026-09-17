import { defineConfig } from 'vitepress'
import container from 'markdown-it-container'
import { execSync } from 'node:child_process'

function labeledContainer(md, name, className) {
  md.use(container, name, {
    render(tokens, idx) {
      const t = tokens[idx]
      if (t.nesting === 1) {
        const label = (t.info || '').trim().slice(name.length).trim()
        return `<div class="${className}"><p class="${className}-label">${label}</p>\n`
      }
      return '</div>\n'
    }
  })
}

// 站点主域名：绑定自定义域名后，把这里换成新域名即可（sitemap / canonical / og:url 会一起生效）
const SITE = 'https://home.liteblacksheep.asia'
const ORCID = 'https://orcid.org/0009-0006-7544-5954'
const GITHUB = 'https://github.com/MakeBlackSheepGreat'

export default defineConfig({
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: SITE },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg?v=2' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png?v=2' }],
    ['meta', { name: 'theme-color', content: '#4f46e5' }],
    ['meta', { name: 'author', content: '杨智杰 (LiteBlackSheep)' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    // 社交分享卡片
    ['meta', { property: 'og:type', content: 'profile' }],
    ['meta', { property: 'og:site_name', content: 'LiteBlackSheep' }],
    ['meta', { property: 'og:image', content: `${SITE}/og-card.jpg` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: `${SITE}/og-card.jpg` }],
    // 结构化数据，便于搜索引擎把主页与 ORCID / GitHub 关联
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: '杨智杰',
        alternateName: ['LiteBlackSheep', 'ZhiJie Yang'],
        url: SITE,
        affiliation: {
          '@type': 'CollegeOrUniversity',
          name: 'Southwest University of Science and Technology'
        },
        knowsAbout: [
          'Medical imaging',
          'Deep learning',
          'Multi-agent systems',
          'Model deployment'
        ],
        sameAs: [ORCID, GITHUB]
      })
    ]
  ],
  transformPageData(pageData) {
    // 首页显示整站最后更新时间（取仓库最新提交），避免首页文件本身很少改动而显得过期
    if (pageData.relativePath === 'index.md' || pageData.relativePath === 'en/index.md') {
      try {
        const secs = Number(
          execSync('git log -1 --format=%ct', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
        )
        if (secs) pageData.lastUpdated = secs * 1000
      } catch {
        pageData.lastUpdated = Date.now()
      }
    }

    const clean = pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '')
    const path = '/' + clean
    const isEn = path === '/en/' || path.startsWith('/en/')
    const alt = isEn
      ? path === '/en/'
        ? '/'
        : path.replace(/^\/en/, '')
      : path === '/'
        ? '/en/'
        : '/en' + path
    const head = ((pageData.frontmatter as any).head ??= [])
    head.push(['link', { rel: 'canonical', href: SITE + path }])
    head.push(['link', { rel: 'alternate', hreflang: isEn ? 'en' : 'zh-CN', href: SITE + path }])
    head.push(['link', { rel: 'alternate', hreflang: isEn ? 'zh-CN' : 'en', href: SITE + alt }])
    head.push(['link', { rel: 'alternate', hreflang: 'x-default', href: SITE + (isEn ? alt : path) }])
    head.push(['meta', { property: 'og:url', content: SITE + path }])
    const siteName = 'LiteBlackSheep'
    const pageTitle = pageData.title ? `${pageData.title} | ${siteName}` : siteName
    head.push(['meta', { property: 'og:title', content: pageTitle }])
  },
  markdown: {
    config(md) {
      // 副标题 / 语言能力行：::: lead
      labeledContainer(md, 'lead', 'lead')
      // 经历条目卡片：::: card 标题
      md.use(container, 'card', {
        render(tokens, idx) {
          const t = tokens[idx]
          if (t.nesting === 1) {
            const title = (t.info || '').trim().slice(4).trim()
            return `<div class="entry"><p class="entry-title">${title}</p>\n`
          }
          return '</div>\n'
        }
      })
    }
  },
  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      title: 'LiteBlackSheep',
      description: '杨智杰的个人主页：医学影像深度学习、多智能体系统与工程实践',
      themeConfig: {
        logo: '/avatar.svg',
        siteTitle: 'LiteBlackSheep',
        nav: [
          { text: '关于', link: '/' },
          { text: '经历', link: '/experiences' },
          { text: '论文', link: '/publications' },
          { text: '项目', link: '/projects' },
          { text: '获奖', link: '/awards' },
          { text: '技能', link: '/skills' },
          { text: '笔记', link: '/notes/' },
          { text: 'CV', link: '/cv' },
          { text: '致谢', link: '/acknowledgements' }
        ],
        sidebar: {
          '/notes/': [
            {
              text: '智能体协作方法',
              items: [
                { text: '全部笔记', link: '/notes/' },
                { text: '半年里用过的四套框架：数据复盘', link: '/notes/agent-frameworks-retrospective' },
                { text: '把问题拆成可执行的任务', link: '/notes/task-decomposition' },
                { text: 'AI 时代的工程能力', link: '/notes/skills-in-agent-era' },
                { text: '上下文管理', link: '/notes/context-management' },
                { text: '多智能体分工：角色、并行与验收', link: '/notes/multi-agent-roles' },
                { text: '长任务的工程化', link: '/notes/long-task-engineering' },
                { text: '记忆与规则：把踩过的坑变成制度', link: '/notes/memory-and-rules' },
                { text: '协作与交付', link: '/notes/collaboration-and-delivery' },
                { text: '工具选型与迁移', link: '/notes/agent-tool-selection' }
              ]
            },
            {
              text: '能力扩展与自研工具',
              items: [
                { text: 'MCP 服务与插件体系', link: '/notes/agent-capability-plugins' },
                { text: '自研编码智能体', link: '/notes/own-coding-agent' },
                { text: 'WeftMesh：设备互联', link: '/notes/weftmesh-device-mesh' },
                { text: '多智能体做硬件设计', link: '/notes/pcb-multi-agent-pipeline' }
              ]
            },
            {
              text: '工程实践',
              items: [
                { text: '论文语料摄取流水线', link: '/notes/paper-corpus-pipeline' },
                { text: '科研流程工具化', link: '/notes/research-workflow-suite' },
                { text: 'Agent 服务公网部署', link: '/notes/agent-service-public' },
                { text: '医学软件离线交付', link: '/notes/medical-software-delivery' },
                { text: '算子层实践', link: '/notes/chip-operator-practice' }
              ]
            },
            {
              text: '研究记录',
              items: [{ text: '负面结果也是一份结果', link: '/notes/negative-results' }]
            }
          ]
        },
        socialLinks: [{ icon: 'github', link: 'https://github.com/MakeBlackSheepGreat' }],
        outline: { level: [2, 3], label: '本页目录' },
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
              modal: {
                noResultsText: '没有找到相关内容',
                resetButtonTitle: '清除',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
              }
            }
          }
        },
        footer: {
          message: '由 VitePress 构建 · 部署于 Cloudflare Pages 与 GitHub Pages',
          copyright: '© 2026 杨智杰 ZhiJie Yang'
        },
        docFooter: { prev: '上一页', next: '下一页' },
        lastUpdated: { text: '最后更新于' },
        notFound: {
          title: '页面不存在',
          quote: '这个地址没有对应的内容，可能是链接已过期或路径写错了。',
          linkLabel: '回到首页',
          linkText: '返回首页'
        },
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
      title: 'LiteBlackSheep',
      description: 'ZhiJie Yang — medical imaging deep learning, multi-agent systems and engineering practice',
      themeConfig: {
        logo: '/avatar.svg',
        siteTitle: 'LiteBlackSheep',
        nav: [
          { text: 'about', link: '/en/' },
          { text: 'experiences', link: '/en/experiences' },
          { text: 'publications', link: '/en/publications' },
          { text: 'projects', link: '/en/projects' },
          { text: 'awards', link: '/en/awards' },
          { text: 'skills', link: '/en/skills' },
          { text: 'notes', link: '/en/notes/' },
          { text: 'cv', link: '/en/cv' },
          { text: 'thanks', link: '/en/acknowledgements' }
        ],
        sidebar: {
          '/en/notes/': [
            {
              text: 'Working with agents',
              items: [
                { text: 'All notes', link: '/en/notes/' },
                { text: 'Four agent frameworks in half a year', link: '/en/notes/agent-frameworks-retrospective' },
                { text: 'Decomposing problems into tasks', link: '/en/notes/task-decomposition' },
                { text: 'Engineering skills in the agent era', link: '/en/notes/skills-in-agent-era' },
                { text: 'Context management', link: '/en/notes/context-management' },
                { text: 'Multi-agent division of labour', link: '/en/notes/multi-agent-roles' },
                { text: 'Long-running tasks', link: '/en/notes/long-task-engineering' },
                { text: 'Memory and rules', link: '/en/notes/memory-and-rules' },
                { text: 'Collaboration and delivery', link: '/en/notes/collaboration-and-delivery' },
                { text: 'Choosing and switching frameworks', link: '/en/notes/agent-tool-selection' }
              ]
            },
            {
              text: 'Capability and tooling',
              items: [
                { text: 'MCP services and plugins', link: '/en/notes/agent-capability-plugins' },
                { text: 'Building my own coding agent', link: '/en/notes/own-coding-agent' },
                { text: 'WeftMesh: device mesh', link: '/en/notes/weftmesh-device-mesh' },
                { text: 'Multi-agent hardware design', link: '/en/notes/pcb-multi-agent-pipeline' }
              ]
            },
            {
              text: 'Engineering practice',
              items: [
                { text: 'Paper corpus pipeline', link: '/en/notes/paper-corpus-pipeline' },
                { text: 'Research workflow tooling', link: '/en/notes/research-workflow-suite' },
                { text: 'Publishing an agent service', link: '/en/notes/agent-service-public' },
                { text: 'Shipping medical software on a disc', link: '/en/notes/medical-software-delivery' },
                { text: 'Operator-level practice', link: '/en/notes/chip-operator-practice' }
              ]
            },
            {
              text: 'Research notes',
              items: [{ text: 'Negative results count too', link: '/en/notes/negative-results' }]
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
                resetButtonTitle: 'Reset',
                footer: { selectText: 'select', navigateText: 'navigate', closeText: 'close' }
              }
            }
          }
        },
        footer: {
          message: 'Powered by VitePress · Deployed on Cloudflare Pages and GitHub Pages',
          copyright: '© 2026 ZhiJie Yang'
        },
        docFooter: { prev: 'Previous', next: 'Next' },
        lastUpdated: { text: 'Last updated' },
        notFound: {
          title: 'Page not found',
          quote: 'There is no content at this address — the link may be outdated or the path mistyped.',
          linkLabel: 'go to home',
          linkText: 'Take me home'
        },
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
