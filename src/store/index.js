import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoggedIn: !!localStorage.getItem('token') || false,
    appName: localStorage.getItem('appName') || null,
    appVersion: localStorage.getItem('appVersion') || null,
    loading: false,
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    user: (state) => state.user,
    token: (state) => state.token,
    isLoading: (state) => state.loading,
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      state.isLoggedIn = !!token
    },

    setUser(state, user) {
      state.user = user
    },

    logout(state) {
      state.token = null
      state.user = null
      state.isLoggedIn = false
    },

    startLoading(state) {
      state.loading = true
    },

    stopLoading(state) {
      state.loading = false
    }
  },
  actions: {
    setToken({ commit }, token) {
      commit('setToken', token)
    },

    setUser({ commit }, user) {
      commit('setUser', user)
    },

    logout({ commit }) {
      commit('logout')
    },

    startLoading({ commit }) {
      commit('startLoading')
    },

    stopLoading({ commit }) {
      commit('stopLoading')
    }
  },
  modules: {},
})
