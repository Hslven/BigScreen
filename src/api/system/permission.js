import request from '@/axios/http'

const auth = process.env.VUE_APP_AUTH_SIGN_URL
// 新增用户API
export function addPermissionAPI (data) {
  return request({
    url: auth + '/sys/permission',
    method: 'post',
    params: data
  })
}

// 获取用户列表API
export function getPermissionListApi () {
  return request({
    url: auth + '/sys/permission',
    method: 'get'
  })
}

// 获取用户详情API
export function getPermissionInfoApi (id) {
  return request({
    url: auth + `/sys/permission/${id}`,
    method: 'get'
  })
}

// 删除用户API
export function deletePermissionAPI (id) {
  return request({
    url: auth + `/sys/permission/${id}`,
    method: 'delete'
  })
}

// 更新用户信息API
export function updatePermissionInfoApi (data) {
  return request({
    url: auth + '/sys/permission',
    method: 'put',
    params: data
  })
}
