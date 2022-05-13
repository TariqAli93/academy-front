import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoggedIn: !!localStorage.getItem('token') || false,
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    user: (state) => state.user,
    token: (state) => state.token,
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
  },
  modules: {},
})
