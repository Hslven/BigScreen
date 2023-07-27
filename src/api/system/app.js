import request from '@/axios/http'

const auth = process.env.VUE_APP_AUTH_SIGN_URL
// 新增APP API
export function addAppAPI (data) {
  return request({
    url: auth + '/sys/app',
    method: 'post',
    params: data
  })
}

// 获取APP列表API
export function getAppListApi () {
  return request({
    url: auth + '/sys/app',
    method: 'get'
  })
}

// 获取单个APP详情API
export function getAppInfoApi (id) {
  return request({
    url: auth + `/sys/app/${id}`,
    method: 'get'
  })
}

// 删除APP API
export function deleteAppAPI (id) {
  return request({
    url: auth + `/sys/app/${id}`,
    method: 'delete'
  })
}

// 更新APP信息API
export function updateAppInfoApi (data) {
  return request({
    url: auth + '/sys/app',
    method: 'put',
    params: data
  })
}
