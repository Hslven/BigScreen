import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/role`

// inops角色接口
// 获取角色列表
export function getRoleAPI (params, data) {
  return request({
    url: `${url}/listPage`,
    method: 'post',
    params,
    data
  })
}

// 获取角色通过ID
export function getRoleByIdAPI (id) {
  return request({
    url: `${url}/get/${id}`,
    method: 'get'
  })
}

// 新增/修改角色列表
export function saveRoleAPI (data) {
  return request({
    url: `${url}/save`,
    method: 'post',
    data
  })
}

// 删除角色
export function delRoleAPI (id) {
  return request({
    url: `${url}/del/${id}`,
    method: 'delete'
  })
}

// 获取指定角色的用户ID列表
export function getUserByRoleIdAPI (id) {
  return request({
    url: `${url}/userList/${id}`,
    method: 'get'
  })
}

// 获取指定用户的角色列表
export function getRolesByUserIdAPI (id) {
  return request({
    url: `${url}/list/${id}`,
    method: 'get'
  })
}
