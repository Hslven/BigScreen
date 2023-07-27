import request from '@/axios/http'
const url = process.env.VUE_APP_INOPS_SIGN_URL
// 设备组接口
// 获取设备组列表
export function getHostGroupListAPI () {
  return request({
    method: 'get',
    url: `${url}/hostgroup/list`
  })
}
// 新增/编辑设备组列表
export function saveHostGroupAPI (data) {
  return request({
    method: 'post',
    url: `${url}/hostGroup/save`,
    data
  })
}
// 根据ID获取设备组信息
export function getHostGroupByIDAPI (id) {
  return request({
    method: 'get',
    url: `${url}/hostGroup/get/${id}`
  })
}

// 删除设备组
export function delHostGroupAPI (id) {
  return request({
    method: 'delete',
    url: `${url}/hostGroup/del/${id}`
  })
}

// 设备组设备信息
// 获取设备组设备信息
export function getHostListPageAPI (data) {
  return request({
    method: 'post',
    url: `${url}/hostGroup/hostListPage`,
    data
  })
}

// 新增设备组设备
export function addHostsToHostGroupAPI (data) {
  return request({
    method: 'post',
    url: `${url}/hostGroup/addHosts`,
    data
  })
}

// 移除设备组设备
export function removeHostsToHostGroupAPI (data) {
  return request({
    method: 'post',
    url: `${url}/hostGroup/removeHosts`,
    data
  })
}

// 设备权限
// 获取设备组的角色权限
export function getRoleListByGroupIdAPI (groupId) {
  return request({
    method: 'get',
    url: `${url}/hostGroup/roleList/${groupId}`
  })
}

// 更新设备组下的角色权限
export function saveRolesByGroupIdAPI (data) {
  return request({
    method: 'post',
    url: `${url}/hostGroup/saveRolesByGroupId`,
    data
  })
}
// 获取角色的设备组
export function getGroupListByRoleIdAPI (roleId) {
  return request({
    method: 'get',
    url: `${url}/hostGroup/groupList/${roleId}`
  })
}

// 更新角色下的设备组权限
export function saveGroupsByRoleIdAPI (data) {
  return request({
    method: 'post',
    url: `${url}/hostGroup/saveGroupsByRoleId`,
    data
  })
}
