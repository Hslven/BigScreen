import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/inspectJob`

// 巡检权限接口
// 获取指定角色下的巡检任务列表
export function getInspectByRoleIdAPI (id) {
  return request({
    url: `${url}/authorization/getJobs/${id}`,
    method: 'get'
  })
}

// 获取指定巡检任务所授权的角色列表
export function getRoleByInspectIdAPI (id) {
  return request({
    url: `${url}/authorization/getRoles/${id}`,
    method: 'get'
  })
}

// 获取当前用户可授权的角色列表
export function ownedRolesAPI () {
  return request({
    url: `${url}/authorization/ownedRoles`,
    method: 'get'
  })
}

// 更新指定角色下的巡检任务
export function updateInspectAPI (data) {
  return request({
    url: `${url}/authorization/updateJobs`,
    method: 'post',
    data
  })
}

// 修改指定巡检任务的授权范围
export function changeAuthScopeAPI (data) {
  return request({
    url: `${url}/changeAuthScope`,
    method: 'post',
    data
  })
}
