import request from '@/axios/http'

const auth = process.env.VUE_APP_AUTH_SIGN_URL
// 新增用户API
export function addRoleApi (data) {
  return request({
    url: auth + '/sys/role',
    method: 'post',
    params: data
  })
}

// 获取用户列表API
export function getRoleListApi () {
  return request({
    url: auth + '/sys/role',
    method: 'get'
  })
}

// 获取单个用户详情API
export function getRoleInfoApi (id) {
  return request({
    url: auth + `/sys/role/${id}`,
    method: 'get'
  })
}

// 删除用户API
export function deleteRoleAPI (id) {
  return request({
    url: auth + `/sys/role/${id}`,
    method: 'delete'
  })
}

// 更新用户信息API
export function updateRoleInfoApi (data) {
  return request({
    url: auth + '/sys/role',
    method: 'put',
    params: data
  })
}
