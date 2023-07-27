import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/taskItem`

// 巡检权限接口
// 获取指定角色下的巡检项列表
export function getItemByRoleIdAPI (id) {
  return request({
    url: `${url}/authorization/getItems/${id}`,
    method: 'get'
  })
}

// 更新指定角色下的巡检任务
export function updateInspectItemOfRoleAPI (data) {
  return request({
    url: `${url}/authorization/updateItems`,
    method: 'post',
    data
  })
}
