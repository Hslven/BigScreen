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

// 获取构件列表API
export function getServiceListApi (data) {
  const paramObj = Object.assign({}, data, { user_id: store.getters.getInfo.userId, operation_type: 'use' })
  return request({
    url: auth + '/service',
    method: 'get',
    params: paramObj
  })
}

// 添加构件API
export function addServiceApi (param) {
  const data = Object.assign({}, param, { user_id: store.getters.getInfo.userId, operation_type: 'add' })
  return request({
    url: auth + '/service',
    method: 'post',
    data,
    headers: { 'x-csrf-token': getCookie('csrfToken') }
  })
}

// 获取单个构件API
export function getServiceApi (id) {
  return request({
    url: auth + `/service/${id}`,
    method: 'get',
    params: { user_id: store.getters.getInfo.userId, operation_type: 'use' }
  })
}

// 删除构件API
export function deleteServiceAPI (id) {
  return request({
    url: auth + `/service/${id}`,
    method: 'delete',
    data: { user_id: store.getters.getInfo.userId, operation_type: 'delete' },
    headers: { 'x-csrf-token': getCookie('csrfToken') }
  })
}

// // 更新构件API
// export function updateServiceApi (id, data) {
//   return request({
//     url: auth + '/service/' + id,
//     method: 'put',
//     data,
//     headers: { 'x-csrf-token': getCookie('csrfToken') }
//   })
// }
