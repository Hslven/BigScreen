// import constructionRouters from '@/router/permissionUtils'
import { routerGenerator } from '@/router/generatorRouters'
import { resetRouter } from '@/router'

const state = {
  routes: []
}

const mutations = {
  // 设置面包屑
  SET_ROUTES: (state, payload) => {
    state.routes = payload
  }
}

const actions = {
  set_menus ({ commit, state }, data) {
    const resRouter = routerGenerator(data)
    commit('SET_ROUTES', resRouter)
  },
  clear_routes ({ commit, state }, data) {
    commit('SET_ROUTES', data)
    resetRouter()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
