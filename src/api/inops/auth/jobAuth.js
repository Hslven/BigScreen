import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/script`

// 脚本权限接口
// inops脚本权限（脚本->用户）
// 获取指定脚本所授权的角色列表
export function getRolesOfJobAPI (scriptId) {
  return request({
    url: `${url}/authorization/getRoles/${scriptId}`,
    method: 'get'
  })
}

// 获取指定角色下的脚本列表
export function getScriptsOfRoleAPI (roleId) {
  return request({
    url: `${url}/authorization/getScripts/${roleId}`,
    method: 'get'
  })
}

// 获取当前用户所在角色下的用户列表
export function ownedRolesAPI () {
  return request({
    url: `${url}/authorization/ownedRoles`,
    method: 'get'
  })
}

// 授权指定脚本权限范围及角色
export function changeAuthScopeAPI (data) {
  return request({
    url: `${url}/changeAuthScope`,
    method: 'post',
    data
  })
}

// 更新指定角色下的脚本
export function updateScriptAPI (data) {
  return request({
    url: `${url}/authorization/updateScripts`,
    method: 'post',
    data
  })
}
