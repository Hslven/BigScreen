import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/approve/authorization`

// 审批权限接口
/**
 * 根据角色id获取审批用户
 * @param id 角色id
 * @returns {{method: string, url: string}}
 */
export function getApproveUserOfRoleAPI (id) {
  return request({
    url: `${url}/userList/${id}`,
    method: 'get'
  })
}

export function updatApproveUserOfRoleAPI (data) {
  return request({
    url: `${url}/updateUsers`,
    method: 'post',
    data
  })
}
