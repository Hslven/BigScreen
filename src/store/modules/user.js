import { ACCESS_TOKEN, TABS_ROUTES, IS_TABS } from '@/store/mutation-types'
import { storage, createStorage } from '@/utils/Storage'
import { loginAPI, loginHabor, tokenRefreshAPI, logoutAPI } from '@/api/system/user'
import { getModUserPermissionApi } from '@/api/modServer/modAuth'
import { MessagePlugin } from 'tdesign-vue'
const Storage = createStorage({ storage: localStorage })
const state = {
  info: {},
  token: Storage.get(ACCESS_TOKEN, ''),
  sysName: '',
  modPermission: []
}

const mutations = {
  SET_INFO: (state, info) => {
    state.info = info
  },

  SET_SYS_NAME: (state, sysName) => {
    state.sysName = name
  },

  SET_MOD_PERMISSION: (state, item) => {
    state.modPermission = item
  }
}

const actions = {
  login ({ commit, dispatch }, content) {
    if (process.env.VUE_APP_SYSTEM_OA) {
      return new Promise((resolve, reject) => {
        loginHabor(content).then(response => {
          const { data } = response
          if ([1001, 1002].indexOf(data.code) >= 0) {
          // 登录失败，账号不存在或密码错误
          // commit('SET_LOGIN', false)
            MessagePlugin('error', { content: `登陆失败: ${data.msg}` })
            reject(data.msg)
          } else if (data.code === 0) {
          // 登陆成功
            const { sysName, user, token, menus } = data.data
            const ex = 7 * 24 * 60 * 60 * 1000
            storage.set(ACCESS_TOKEN, token, ex)
            commit('SET_SYS_NAME', sysName)
            commit('SET_INFO', user)
            dispatch('route/set_menus', menus, { root: true }) // 调route module里的actions方法设置路由
            resolve()
          }
        }).catch(error => {
          MessagePlugin('error', { content: `登陆报错: ${error}` })
          reject(error)
        })
      })
    }
    return new Promise((resolve, reject) => {
      loginAPI(content).then(response => {
        const { data } = response
        if ([1001, 1002].indexOf(data.code) >= 0) {
          // 登录失败，账号不存在或密码错误
          // commit('SET_LOGIN', false)
          MessagePlugin('error', { content: `登陆失败: ${data.msg}` })
          reject(data.msg)
        } else if (data.code === 0) {
          // 登陆成功
          const { sysName, user, token, menus } = data.data
          const ex = 7 * 24 * 60 * 60 * 1000
          storage.set(ACCESS_TOKEN, token, ex)
          commit('SET_SYS_NAME', sysName)
          commit('SET_INFO', user)
          dispatch('route/set_menus', menus, { root: true }) // 调route module里的actions方法设置路由
          resolve()
        }
      }).catch(error => {
        MessagePlugin('error', { content: `登陆报错: ${error}` })
        reject(error)
      })
    })
  },

  // token login
  tokenRefresh ({ commit, dispatch }) {
    const token = Storage.get(ACCESS_TOKEN, '')
    return new Promise((resolve, reject) => {
      tokenRefreshAPI({ token }).then(response => {
        const { data } = response
        if ([1001, 1002, 401].indexOf(data.code) >= 0) {
          // 登录失败，账号不存在或密码错误
          MessagePlugin('error', { content: `token刷新失败: ${data.msg}` })
          reject(data)
        } else if (data.code === 0) {
          // 登陆成功
          const { sysName, user, token, menus } = data.data
          const ex = 7 * 24 * 60 * 60 * 1000
          storage.set(ACCESS_TOKEN, token, ex)
          commit('SET_SYS_NAME', sysName)
          commit('SET_INFO', user)
          dispatch('route/set_menus', menus, { root: true }) // 调route module里的actions方法设置路由
          resolve()
        }
      }).catch(error => {
        MessagePlugin('error', { content: `token刷新报错: ${error}` })
        commit('SET_LOGIN', false)
        // reject(error)
      })
    })
  },
  // user logout
  logout ({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      logoutAPI().then((response) => {
        const { data } = response
        if (data.code === 0) {
          // 登出成功
          commit('SET_SYS_NAME', '')
          commit('SET_INFO', {})
          dispatch('route/clear_routes', [], { root: true })
          dispatch('appProject/clear_tabs', [], { root: true })
          dispatch('appProject/set_tag', false, { root: true })
          Storage.remove(TABS_ROUTES)
          Storage.remove(ACCESS_TOKEN)
          Storage.remove(IS_TABS)
          resolve()
        } else {
        // 登出失败
          reject(data.msg)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken ({ commit, dispatch }) {
    return new Promise(resolve => {
      commit('SET_SYS_NAME', '')
      commit('SET_INFO', {})
      dispatch('appProject/clear_tabs', [], { root: true })
      Storage.remove(ACCESS_TOKEN)
      resolve()
    })
  },

  getModPermission ({ commit }) {
    return new Promise((resolve, reject) => {
      getModUserPermissionApi(state.info.userId).then(response => {
        const { data } = response
        if (data.status === 'success') {
          commit('SET_MOD_PERMISSION', data.data.elements)
        } else {
          console.log(data.message)
        }
      }).catch(error => {
        commit('SET_MOD_PERMISSION', null)
        console.log('获取modops用户权限失败', error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
