import request from '@/axios/http'

const auth = process.env.VUE_APP_AUTH_SIGN_URL

export function loginAPI (data) {
  return request({
    url: auth + '/login',
    method: 'post',
    params: data
  })
}

export function loginHabor (data) {
  return request({
    url: auth + '/loginSys',
    method: 'post',
    params: { ...data, sysName: 'habor' }
  })
}

export function tokenRefreshAPI (data) {
  return request({
    url: auth + '/getLoginUser',
    method: 'post',
    params: data
  })
}

export function logoutAPI () {
  return request({
    url: auth + '/logout',
    method: 'post'
  })
}

// 新增用户API
export function addUserAPI (data) {
  return request({
    url: auth + '/sys/user',
    method: 'post',
    params: data
  })
}

// 获取用户列表API
export function getUserListApi () {
  return request({
    url: auth + '/sys/user',
    method: 'get'
  })
}

// 获取用户详情API
export function getUserInfoApi (id) {
  return request({
    url: auth + `/sys/user/${id}`,
    method: 'get'
  })
}

// 删除用户API
export function deleteUserAPI (id) {
  return request({
    url: auth + `/sys/user/${id}`,
    method: 'delete'
  })
}

// 更新用户信息API
export function updateUserInfoApi (data) {
  return request({
    url: auth + '/sys/user',
    method: 'put',
    params: data
  })
}

// 更新用户密码API
export function updatePasswordApi (data) {
  return request({
    url: auth + '/sys/user/updatePassword',
    method: 'post',
    params: data
  })
}

// 重置用户密码API
export function resetPasswordApi (id) {
  return request({
    url: auth + `/sys/user/resetPassword/${id}`,
    method: 'post'
  })
}
