import projectSetting from '@/settings/projectSetting'
import router from '@/router'
import { removeATagView, removeOneSide } from '@/Layout/components/TagView/TagViewUtils'
// import { ACCESS_TOKEN, CURRENT_USER, USER_ROLE } from '@/store/mutation-types'
import { TABS_ROUTES } from '@/store/mutation-types'
import { createStorage } from '@/utils/Storage'
const Storage = createStorage({ storage: localStorage })
// import { createStorage } from '@/utils/Storage'
// const Storage = createStorage({ storage: localStorage })

const {
  multiTabsSetting,
  menuSetting,
  isScreen
} = projectSetting

const state = {
  tagView: [],
  keepAliveList: [],
  // isTag: Storage.get(IS_TABS, multiTabsSetting.show),
  multiTabsSetting,
  menuSetting,
  isScreen
}

const mutations = {
  SET_TAG: (state, payload) => {
    state.multiTabsSetting.show = payload
  },
  SET_SCREEN: (state, payload) => {
    state.isScreen.show = payload
  },
  // 新增 tagView
  ADD_TAG_VIEW: (state, payload) => {
    const size = state.tagView.length
    // 首次进入或刷新页面时，当前路由不是根路由
    if (!size && payload.fullPath !== '/') {
      state.tagView.push(payload)
      return
    }
    // 为了避免 tagView 重复添加。 构建一个以 fullPath 为标识的数组 t[]
    const t = []
    for (let i = 0; i < size; i++) {
      t.push(state.tagView[i].fullPath)
    }
    if (t.indexOf(payload.fullPath) === -1) {
      state.tagView.push(payload)
    }
  },

  SET_TAG_VIEW: (state, payload) => {
    state.tagView = payload
  },

  /**
   * 移除 tagView
   * case 'undefined' : 移除所有 tagView
   * case 'object' : 移除某一侧 tagView
   * default '要删除元素的下标 i ' : 移除某一个 tagView
   *          如果移除的是第一个 tagView，则跳转到当前的第一个 tagView
   *          如果移除的是最后一个 tagView，则跳转到当前的最后一个 tagView
   * @param state
   * @param payload
   * @constructor
   */
  REMOVE_TAG_VIEW: (state, payload) => {
    switch (typeof payload) {
      case 'undefined':
        state.tagView = []
        Storage.remove(TABS_ROUTES)
        // window.sessionStorage.setItem('tagView', '[]')
        router.push('/')
        break
      case 'object':
        removeOneSide(state, payload)
        break
      default:
        removeATagView(state, payload)
    }
  },

  /**
   * 设置缓存列表
   * @param payload tagView[]
   */
  SET_KEEPALIVE_LIST: (state, payload) => {
    state.keepAliveList = []
    for (let i = 0; i < payload.length; i++) {
      if (!payload[i].keepAlive) {
        state.keepAliveList.push(payload[i].name)
      }
    }
    // 如果需要缓存首页，如下方所示，在方法最后 push 对应的路由组件名称即可
    // state.keepAliveList.push('home')
    return state.keepAliveList
  }
}

const actions = {
  set_keep_alive ({ commit }, value) {
    commit('SET_KEEPALIVE_LIST', value)
  },
  set_tag ({ commit }, value) {
    commit('SET_TAG', value)
  },
  clear_tabs ({ commit, state }, data) {
    commit('SET_TAG_VIEW', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
