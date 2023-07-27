import _Vue from 'vue'
import router from './index'
import store from '../store/index'
import { storage, createStorage } from '@/utils/Storage'
import { MessagePlugin, LoadingPlugin } from 'tdesign-vue'
import constantRoutes from './constantRoutes'
import { addTagView, setTagView } from '@/Layout/components/TagView/TagViewUtils'
import { setBreadcrumbs } from '@/Layout/components/Breadcrumbs/BreadcrumbsUtils'
import { ACCESS_TOKEN, TABS_ROUTES } from '@/store/mutation-types'
const Storage = createStorage({ storage: localStorage })
router.beforeEach((to, from, next) => {
  if (to.path === '/auto') {
    next()
  }
  // 该公共路由单独作为一个页面
  if (to.path === '/prometheus/alarm') {
    store.commit('appProject/SET_SCREEN', true)
    setTimeout(() => {
      document.querySelector('#app').classList.remove('big-screen-bg')
    }, 0)
  } else {
    store.commit('appProject/SET_SCREEN', false)
  }
  document.title = to.meta.label + _Vue.prototype.$title
  // 成功登录后处理 TAGVIEW 和 面包屑
  handleTagViewAndBreadcrumbsAndKeepAlive(to)
  // sso登陆时从cookie获取token存到localStorage
  if (Storage.getCookie('token')) {
    const ex = 7 * 24 * 60 * 60 * 1000
    storage.set(ACCESS_TOKEN, Storage.getCookie('token'), ex)
  }
  const token = Storage.get(ACCESS_TOKEN, '')
  if (token) {
    // 登录过就不能访问登录界面
    if (to.path === '/login') {
      next({ path: '/' })
    }
    // 存在用户权限，并且路由不为空则放行
    if (store.getters.getRoutes.length) {
      next()
    } else {
      store.dispatch('user/tokenRefresh')
        .then(() => {
          MessagePlugin('success', `hi，${store.getters.getInfo.userName} 欢迎回来`)
          store.dispatch('user/getModPermission')
          next({ ...to, replace: true })
        })
        .catch((err) => {
          MessagePlugin('error', `认证登陆：${JSON.stringify(err)}`)
        })
    }
  } else {
    // 如果要前往不需要授权的路由，则放行
    if (constantRoutes.some((item) => { return item.path === to.path })) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  LoadingPlugin(false)
})

export default router

/**
 * 处理 tagView
 * @param to
 */
function handleTagViewAndBreadcrumbsAndKeepAlive (to) {
  if (to.name !== null) {
    LoadingPlugin(true)
    // 判断要添加的 to 是否是公共路由
    for (let i = 0; i < constantRoutes.length; i++) {
      if (constantRoutes[i].path === to.path) {
        return
      }
    }
    // 判断是否为刷新操作，如果是刷新操作则从 sessionStorage 获取保存的 tagView 信息
    let tagViewOnSS = []
    JSON.parse(Storage.get(TABS_ROUTES)) === null ? storage.set(TABS_ROUTES, '[]') : tagViewOnSS = JSON.parse(Storage.get(TABS_ROUTES))
    if (store.getters.getTagView.length === 0 && tagViewOnSS.length !== 0) {
      setTagView(tagViewOnSS)
      store.commit('appProject/SET_KEEPALIVE_LIST', tagViewOnSS, { root: true })
    } else {
      addTagView(to)
    }
    setBreadcrumbs(to.matched, to.query)
    // handleKeepAlive(to)
  }
}
