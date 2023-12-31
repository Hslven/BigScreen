import store from '@/store/index'
import router from '@/router'
import { getFirst } from '@/utils/CloneUtils'
import { storage } from '@/utils/Storage'
import { TABS_ROUTES } from '@/store/mutation-types'
// 构造 tag-view 的元信息，如果符合条件( 不是公共路由 )就提交到 store，生成 tagView 元素
export function addTagView (to) {
  // console.log('to: ', to)
  // if (to.meta.visible) return
  // 构造临时 tagView 对象
  const t = {
    fullPath: to.fullPath,
    name: to.name,
    title: to.meta.label,
    icon: to.meta.icon,
    keepAlive: to.meta.keepAlive || 1,
    path: to.path,
    isFrame: to.meta.isFrame,
    iframeLink: !to.meta.isFrame ? to.meta.iframeLink === '' ? to.meta.component : to.meta.iframeLink : 'component'
  }
  getFirst(to.query) !== undefined && (t.title += '：' + getFirst(to.query))
  if (t.title !== null && t.title !== undefined && t.fullPath !== '/' && t.fullPath.indexOf('#') === -1) {
    store.commit('appProject/ADD_TAG_VIEW', t, { root: true })
  }
}

export function setTagView (tagView) {
  store.commit('appProject/SET_TAG_VIEW', tagView, { root: true })
}

// 只移除一个 tagView
export function removeATagView (state, payload) {
  // 记录被移除的路由
  const removedTagView = state.tagView[payload]
  state.tagView.splice(payload, 1)
  // 如果移除后， tagView 为空
  if (state.tagView.length === 0) {
    storage.set(TABS_ROUTES, '[]')
    router.push('/')
  } else {
    // 如果移除的是最后一个 tagView 则路由跳转移除后的最后一个 tagView
    if (payload === state.tagView.length && window.location.href.indexOf(removedTagView.fullPath) !== -1) {
      router.push(state.tagView[payload - 1].fullPath)
      return
    }
    // 如果移除的是第一个 tagView 则路由跳转移除后的第一个 tagView
    if (payload === 0 && window.location.href.indexOf(removedTagView.fullPath) !== -1) {
      router.push(state.tagView[0].fullPath)
      return
    }
    if (window.location.href.indexOf(removedTagView.fullPath) !== -1) {
      router.push(state.tagView[payload - 1].fullPath)
    }
  }
}

// 移除某一侧 tagView
export function removeOneSide (state, payload) {
  switch (payload.side) {
    case 'right':
      state.tagView = state.tagView.slice(0, payload.index + 1)
      if (state.tagView.length === 1) {
        router.push(state.tagView[0].fullPath)
      }
      if (state.tagView.length === payload.index + 1) {
        router.push(state.tagView[payload.index].fullPath)
      }
      break
    case 'left':
      state.tagView = state.tagView.slice(payload.index, state.tagView.length)
      if (state.tagView.length === 1) {
        router.push(state.tagView[0].fullPath)
      }
      if (state.tagView.length <= payload.index) {
        router.push(state.tagView[0].fullPath)
      }
      break
    case 'others':
      state.tagView = state.tagView.splice(payload.index, 1)
      router.push(state.tagView[0].fullPath)
      break
    default:
      break
  }
}
