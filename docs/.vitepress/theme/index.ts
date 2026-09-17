import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import LangSwitch from './LangSwitch.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(LangSwitch)
    })
  }
}
