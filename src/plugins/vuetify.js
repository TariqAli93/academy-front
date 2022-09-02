import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import ar from 'vuetify/lib/locale/ar'

Vue.use(Vuetify)

export default new Vuetify({
  rtl: true,
  theme: {
    dark: false,
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#505168',
        secondary: '#93A8AC',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      },

      dark: {
        primary: '#2D0081',
        secondary: '#93A8AC',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      },
    },
  },
  lang: {
    locales: { ar },
    current: 'ar',
  },
  icons: {
    iconfont: 'md',
  },
})
