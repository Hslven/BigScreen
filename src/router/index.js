import Vue from 'vue'
import VueRouter from 'vue-router'
import constantRoutes from './constantRoutes'
import { PageLayout } from '@/router/constant'

Vue.use(VueRouter)
export const asyncRoutes = [
  {
    path: '/',
    name: 'index',
    // redirect: (process.env.VUE_APP_SYSTEM_OA) ? '/monitor/haborScreen/screenIndex' : '/system/userInfo',
    redirect: '/monitor/haborScreen/screenIndex',
    component: PageLayout,
    children: []
  }
]

// 解决路由守卫重定向时报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

// 重置路由方法
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

// 定义创建路由方法，方便重置路由时调用
const createRouter = () => new VueRouter({
  routes: constantRoutes
})

const router = createRouter()

export default router
