import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import LangSwitch from './LangSwitch.vue'
import SocialRow from './SocialRow.vue'
import VisitCounter from './VisitCounter.vue'
import SiteNote from './SiteNote.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(LangSwitch),
      'layout-bottom': () => h(SiteNote)
    })
  },
  enhanceApp({ app }) {
    app.component('SocialRow', SocialRow)
    app.component('VisitCounter', VisitCounter)
  }
}
