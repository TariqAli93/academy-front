import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Toasted from 'vue-toasted';

Vue.use(VueAxios, axios)
Vue.use(Toasted)

const devServer = 'http://localhost:5000/api/';
const prodServer = 'http://217.71.202.185/api/';
axios.defaults.baseURL = `${devServer}`;


Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
