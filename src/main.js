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
import VueJWT from 'vuejs-jwt'

Vue.use(VueAxios, axios)
Vue.use(Toasted)
Vue.use(VueJWT)

let token = localStorage.getItem('token') || null;

const devServer = 'http://localhost:6500/api/';
const prodServer = 'http://217.71.202.185/api/';

axios.defaults.baseURL = `${devServer}`;
axios.defaults.headers.common['Authorization'] = token !== null ? `Bearer ${token}` : null;

axios.interceptors.request.use(
  function (config) {
    const access_token = store.getters.token
    if (access_token) config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      store.dispatch('logout')
      router.push('/')
      Vue.toasted.error('انتهت فترة الاتصال بالمزود يرجى تسجيل الدخول مرة اخرى', {
        position: 'top-center',
        duration: 3000,
      })
    }
  }
);


Vue.config.productionTip = false

export const bus = new Vue()

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
