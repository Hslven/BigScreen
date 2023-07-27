
const state = {
  breadcrumbs: []
}

const mutations = {
  // 设置面包屑
  SET_BREADCRUMBS: (state, payload) => {
    state.breadcrumbs = payload
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
