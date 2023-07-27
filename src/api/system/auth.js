import request from '@/axios/http'
import qs from 'qs'

const auth = process.env.VUE_APP_AUTH_SIGN_URL
// 新增授权权限API
export function addPermissionsAPI (data) {
  return request({
    url: auth + '/auth/addPermissions',
    method: 'post',
    params: data
  })
}

// 新增授权角色API
export function addRolesAPI (data) {
  return request({
    url: auth + '/auth/addRoles',
    method: 'post',
    params: data
  })
}

// 新增授权菜单API
export function addMenusAPI (data) {
  return request({
    url: auth + '/auth/addMenus',
    method: 'post',
    params: data,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

// 取消授权菜单API
export function delMenusAPI (data) {
  return request({
    url: auth + '/auth/delMenus',
    method: 'post',
    params: data,
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

// 更新授权菜单API，先清空再添加
export function updateMenusAPI (data) {
  return request({
    url: auth + '/auth/updateMenus',
    method: 'post',
    params: data,
    // 处理传递数组参数的情况
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

// 更新授权权限API，先清空再添加
export function updatePermissionsAPI (data) {
  return request({
    url: auth + '/auth/updatePermissions',
    method: 'post',
    params: data,
    // 处理传递数组参数的情况
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

// 更新角色赋予用户，先清空再添加
export function updateUsersAPI (data) {
  return request({
    url: auth + '/auth/updateUsers',
    method: 'post',
    params: data,
    // 处理传递数组参数的情况
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}

// 新增授权应用API
export function addAppPermissionsAPI (data) {
  return request({
    url: auth + '/auth/addAppPermissions',
    method: 'post',
    params: data
  })
}

// 更新授权权限API，先清空再添加
export function updateAppPermissionsAPI (data) {
  return request({
    url: auth + '/auth/updateAppPermissions',
    method: 'post',
    params: data,
    // 处理传递数组参数的情况
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}
