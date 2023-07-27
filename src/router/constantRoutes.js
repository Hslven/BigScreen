import { ErrorPage, Login, prometheus, AutoLogin } from '@/router/constant'
/**
 * 公共路由
 */
const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      label: '登录'
    },
    component: Login
  },
  {
    path: '/auto',
    name: 'Auto',
    meta: {
      label: '自动登录'
    },
    component: AutoLogin
  },
  {
    path: '/NoFound404',
    name: 'NoFound404',
    meta: {
      label: '404',
      icon: 'sentiment_dissatisfied',
      visible: 1
    },
    component: ErrorPage
  },
  {
    path: '/prometheus/alarm',
    name: 'prometheus',
    meta: {
      label: '告警事件',
      icon: 'sentiment_dissatisfied',
      visible: 1
    },
    component: prometheus
  }
]

export default constantRoutes
