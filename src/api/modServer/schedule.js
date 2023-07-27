import request from '@/axios/http'
import store from '@/store'

const auth = process.env.VUE_APP_MODSERVER_SIGN_URL

const getCookie = (val) => {
  const reg = new RegExp('(^| )' + val + '=([^;]*)(;|$)')
  const arr = document.cookie.match(reg)
  if (arr) {
    return unescape(arr[2])
  } else {
    return null
  }
}

// 获取调度任务列表API
export function getScheduleListApi (data) {
  const paramObj = Object.assign({}, data, { user_id: store.getters.getInfo.userId, operation_type: 'schedule' })
  return request({
    url: auth + '/schedule',
    method: 'get',
    params: paramObj
  })
}

// 添加调度任务API
export function addScheduleApi (params) {
  const data = Object.assign({}, params, { user_id: store.getters.getInfo.userId, operation_type: 'schedule' })
  return request({
    url: auth + '/schedule',
    method: 'post',
    data,
    headers: { 'x-csrf-token': getCookie('csrfToken') }
  })
}

// // 获取单个调度任务API
// export function getScheduleApi (id) {
//   return request({
//     url: auth + `/schedule/${id}`,
//     method: 'get'
//   })
// }

// 删除单个调度任务API
export function deleteScheduleApi (id, dataId) {
  return request({
    url: auth + `/schedule/${id}`,
    method: 'delete',
    data: { user_id: store.getters.getInfo.userId, operation_type: 'schedule', data_id: dataId },
    headers: { 'x-csrf-token': getCookie('csrfToken') }
  })
}
