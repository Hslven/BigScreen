import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/blockFirewallConfigure`

// 分页列表
export function getFirewallAPI (params, data) {
  return request({
    url: `${url}/listPage`,
    method: 'post',
    params,
    data
  })
}

// 删除
export function delFirewallAPI (id) {
  return request({
    url: `${url}/del/${id}`,
    method: 'delete'
  })
}

// 新增/修改
export function saveFirewallAPI (data) {
  return request({
    url: `${url}/save`,
    method: 'post',
    data
  })
}

// 批量保存（新增/修改）
export function saveFirewallBatchAPI (data) {
  return request({
    url: `${url}/saveBatch`,
    method: 'post',
    data
  })
}

// 批量更新（先删除后插入）
export function updateFirewallAPI (data) {
  return request({
    url: `${url}/updateAll`,
    method: 'post',
    data
  })
}
