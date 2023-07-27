import request from '@/axios/http'
const url = process.env.VUE_APP_INOPS_SIGN_URL

// 脚本组接口
// 获取脚本组列表
export function getJobGroupListAPI () {
  return request({
    method: 'get',
    url: `${url}/scriptGroup/list`
  })
}

// 新增/编辑脚本组列表
export function saveJobGroupAPI (data) {
  return request({
    method: 'post',
    url: `${url}/scriptGroup/save`,
    data
  })
}
// 根据ID获取脚本组信息
export function getJobGroupByIDAPI (id) {
  return request({
    method: 'get',
    url: `${url}/scriptGroup/get/${id}`
  })
}

// 删除脚本组
export function delJobGroupAPI (id) {
  return request({
    method: 'delete',
    url: `${url}/scriptGroup/del/${id}`
  })
}

// 脚本组脚本信息
// 获取脚本组脚本信息
export function getJobListPageAPI (data) {
  return request({
    method: 'post',
    url: `${url}/scriptGroup/scriptListPage`,
    data
  })
}

// 新增脚本组脚本
export function addJobToJobGroupAPI (data) {
  return request({
    method: 'post',
    url: `${url}/scriptGroup/addScripts`,
    data
  })
}

// 移除脚本组脚本
export function removeJobToJobGroupAPI (data) {
  return request({
    method: 'post',
    url: `${url}/scriptGroup/removeScripts`,
    data
  })
}

// 脚本权限
// 获取脚本组的角色权限
export function getRoleListByGroupIdAPI (groupId) {
  return request({
    method: 'get',
    url: `${url}/scriptGroup/roleList/${groupId}`
  })
}

// 更新脚本组下的角色权限
export function saveRolesByGroupIdAPI (data) {
  return request({
    method: 'post',
    url: `${url}/scriptGroup/saveRolesByGroupId`,
    data
  })
}
// 获取角色的脚本组
export function getGroupListByRoleIdAPI (roleId) {
  return request({
    method: 'get',
    url: `${url}/scriptGroup/groupList/${roleId}`
  })
}

// 更新角色下的脚本组权限
export function saveGroupsByRoleIdAPI (data) {
  return request({
    method: 'post',
    url: `${url}/scriptGroup/saveGroupsByRoleId`,
    data
  })
}

// 获取指定脚本归属的脚本组
export function getListByScriptIdAPI (scriptId) {
  return request({
    url: `${url}/scriptGroup/listByScriptId/${scriptId}`,
    method: 'get'
  })
}

// 获取当前用户拥有的脚本组列表
export function getOwnedGroupsAPI () {
  return request({
    url: `${url}/scriptGroup/ownedGroups`,
    method: 'get'
  })
}
// 新增脚本至多个脚本组
export function addScriptToGroupsAPI (data) {
  return request({
    url: `${url}/scriptGroup/addGroups`,
    data,
    method: 'post'
  })
}

// 移除脚本脚本组
export function removeScriptToGroupAPI (data) {
  return request({
    url: `${url}/scriptGroup/removeGroups`,
    data,
    method: 'post'
  })
}
