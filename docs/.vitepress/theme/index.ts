import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import LangSwitch from './LangSwitch.vue'
import SocialRow from './SocialRow.vue'
import VisitCounter from './VisitCounter.vue'
import SiteNote from './SiteNote.vue'
import AntiScrape from './AntiScrape.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(LangSwitch),
      // 反抓取诱饵层：对人类读者完全不可见，仅对解析 DOM 的抓取器可见
      'layout-bottom': () => [h(SiteNote), h(AntiScrape)]
    })
  },
  enhanceApp({ app }) {
    app.component('SocialRow', SocialRow)
    app.component('VisitCounter', VisitCounter)
  }
}
