import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { MessagePlugin } from 'tdesign-vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { storage, createStorage } from '@/utils/Storage'
const Storage = createStorage({ storage: localStorage })

// create an axios instance
const authService = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 1000000
})
// request interceptor
authService.interceptors.request.use(
  config => {
    const token = Storage.get(ACCESS_TOKEN, '')
    if (token) {
      config.headers.token = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

authService.interceptors.response.use(
  response => {
    if (response.status === 200) {
      // 200: 接口访问成功，但是需要通过code进一步判断
      switch (response.data.code) {
      // 401: token过期
      // 未登录则跳转登录页面，并携带当前页面的路径
      case 401:
        store.dispatch('user/resetToken')
        MessagePlugin('warning', { content: '登录信息已过期，请重新登录' })
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
        break

        // 其他code，交由api层自行处理
      default:
        return Promise.resolve(response)
      }
      // 命中异常code，reject
      return Promise.resolve(response)
    } else {
      console.log('status is not 200')
      // 非200 http status，reject
      return Promise.reject(response)
    }
  },
  error => {
    console.log('error')
    if (error.response.status) {
      switch (error.response.status) {
      // 401: 未登录或者token过期
      // 未登录则跳转登录页面，并携带当前页面的路径
      // 在登录成功后返回当前页面，这一步需要在登录页操作。
      case 401:
        storage.remove(ACCESS_TOKEN)
        MessagePlugin('warning', { content: '登陆失败，请重新登录' })
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
        break

        // 其他错误，直接抛出错误提示
      default:
      }
      return Promise.reject(error.response)
    }
  }
)

export default authService
