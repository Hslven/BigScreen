import settings from '@/settings/appThemeSetting'

const {
  // 深色主题
  darkTheme,
  // 系统主题色
  appPrimary,
  appPrimaryList
} = settings

const state = {
  darkTheme,
  appPrimary,
  appPrimaryList
}

const mutations = {
  SET_DARK_THEME: (state, payload) => {
    state.darkTheme = payload
  },
  SET_APP_PRIMARY: (state, payload) => {
    state.appPrimary = payload
  }
}

const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
