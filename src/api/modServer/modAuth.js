import request from '@/axios/http'
import store from '@/store'

const auth = process.env.VUE_APP_MODSERVER_SIGN_URL

// 获取角色列表API
export function getModRoleListApi (data) {
  return request({
    url: auth + '/rbac/roles',
    method: 'get',
    params: data
  })
}

// 获取角色详情API
export function getModRoleInfoApi (id) {
  return request({
    url: auth + `/rbac/roles/${id}`,
    method: 'get'
  })
}

// 创建角色API
export function addModRoleApi (data) {
  return request({
    url: auth + '/rbac/roles',
    method: 'post',
    data
  })
}

// 更新角色API
export function updateModRoleApi (data) {
  return request({
    url: auth + '/rbac/roles',
    method: 'put',
    data
  })
}

// 删除角色API
export function deleteModRoleApi (id) {
  return request({
    url: auth + `/rbac/roles/${id}`,
    method: 'delete'
  })
}

// 获取基础权限列表API
export function getModBasePermissionListApi (data) {
  return request({
    url: auth + '/rbac/base_permission',
    method: 'get',
    params: data
  })
}

// 获取基础权限列表API
export function getModPermissionListApi (data) {
  return request({
    url: auth + '/rbac/permission',
    method: 'get',
    params: data
  })
}

// 创建权限API
export function addModPermissionApi (data) {
  return request({
    url: auth + '/rbac/permission',
    method: 'post',
    data
  })
}

// 更新权限API
export function updateModPermissionApi (data) {
  return request({
    url: auth + '/rbac/permission',
    method: 'put',
    data
  })
}

// 删除基础权限API
export function deleteModPermissionApi (id) {
  return request({
    url: auth + `/rbac/base_permission/${id}`,
    method: 'delete'
  })
}

//  数据授权角色接口API
export function addRoleToDataApi (params) {
  const data = Object.assign({}, params, { user_id: store.getters.getInfo.userId, operation_type: 'auth' })
  return request({
    url: auth + '/rbac/data_to_role',
    method: 'post',
    data
  })
}

//  删除数据已授权角色接口API
export function deleteRoleToDataApi (params) {
  const data = Object.assign({}, params, { user_id: store.getters.getInfo.userId, operation_type: 'auth' })
  return request({
    url: auth + '/rbac/data_to_role',
    method: 'delete',
    data
  })
}

//  用户授权角色接口API
export function addUserToRoleApi (data) {
  return request({
    url: auth + '/rbac/role_to_user',
    method: 'post',
    data
  })
}

//  删除已授权用户接口API
export function deleteUserToRoleApi (data) {
  return request({
    url: auth + '/rbac/role_to_user',
    method: 'delete',
    data
  })
}

//  权限授权角色接口API
export function addPermissionToRoleApi (data) {
  return request({
    url: auth + '/rbac/per_to_role',
    method: 'post',
    data
  })
}

//  删除已权限授权角色接口API
export function deletePermissionToRoleApi (data) {
  return request({
    url: auth + '/rbac/per_to_role',
    method: 'delete',
    data
  })
}

// 获取数据绑定的角色列表API
export function getDataRolesApi (params) {
  return request({
    url: auth + '/rbac/data_roles',
    method: 'get',
    params: params
  })
}

// 获取modops用户权限信息API
export function getModUserPermissionApi (id) {
  return request({
    url: auth + `/rbac/user/${id}`,
    method: 'get'
  })
}
