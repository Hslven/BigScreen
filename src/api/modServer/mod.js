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

// 获取模组列表API
export function getModListApi (data) {
  const paramObj = Object.assign({}, data, { user_id: store.getters.getInfo.userId, operation_type: 'look' })
  return request({
    url: auth + '/mod',
    method: 'get',
    params: paramObj
  })
}

// 添加模组API
export function addModApi (paramObj) {
  const data = Object.assign({}, paramObj, { user_id: store.getters.getInfo.userId, operation_type: 'add' })
  return request({
    url: auth + '/mod',
    method: 'post',
    data,
    headers: { 'x-csrf-token': getCookie('csrfToken') }
  })
}

// 获取单个模组API
export function getModApi (id) {
  return request({
    url: auth + `/mod/${id}`,
    method: 'get',
    params: { user_id: store.getters.getInfo.userId, operation_type: 'look' }
  })
}

// 删除模组API
export function deleteModAPI (id) {
  return request({
    url: auth + `/mod/${id}`,
    method: 'delete',
    data: { user_id: store.getters.getInfo.userId, operation_type: 'delete' },
    headers: { 'x-csrf-token': getCookie('csrfToken') }
  })
}

// 更新模组API
export function updateModApi (id, params) {
  const data = Object.assign({}, params, { user_id: store.getters.getInfo.userId, operation_type: 'update' })
  return request({
    url: auth + `/mod/${id}`,
    method: 'put',
    data,
    headers: { 'x-csrf-token': getCookie('csrfToken') }
  })
}

// 模组发布API
export function releaseModApi (id, params) {
  const data = Object.assign({}, params, { user_id: store.getters.getInfo.userId, operation_type: 'publish' })
  return request({
    url: auth + `/mod/release/${id}`,
    method: 'put',
    data,
    headers: { 'x-csrf-token': getCookie('csrfToken') }
  })
}

// 调度执行API
export function instanceApi (params) {
  const data = Object.assign({}, params, { user_id: store.getters.getInfo.userId, operation_type: 'execute' })
  return request({
    url: auth + '/instance',
    method: 'post',
    data,
    headers: { 'x-csrf-token': getCookie('csrfToken') }
  })
}

// 获取模组执行记录列表API
export function getModLogListApi (data) {
  const paramObj = Object.assign({}, data, { user_id: store.getters.getInfo.userId, operation_type: 'look' })
  return request({
    url: auth + '/instance',
    method: 'get',
    params: paramObj
  })
}

// 删除模组记录API
export function deleteModLogAPI (id) {
  return request({
    url: auth + '/instance/' + id,
    method: 'delete',
    headers: { 'x-csrf-token': getCookie('csrfToken') }
  })
}

// 获取单个模组记录API
export function getModLogApi (id, modId) {
  return request({
    url: auth + `/instance/${id}`,
    method: 'get',
    params: { user_id: store.getters.getInfo.userId, operation_type: 'look', data_id: modId }
  })
}

// 获取构件执行详情API
export function getServiceDetailApi (instanceId, stepId) {
  return request({
    url: auth + `/instance/${instanceId}/step/${stepId}`,
    method: 'get',
    params: { user_id: store.getters.getInfo.userId, operation_type: 'use' }
  })
}
