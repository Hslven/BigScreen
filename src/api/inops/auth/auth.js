import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/auth`

// inops授权接口
// 更新指定角色下的用户列表
export function updateUsersAPI (data) {
  return request({
    url: `${url}/updateUsers`,
    method: 'post',
    data
  })
}
