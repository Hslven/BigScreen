import request from '@/axios/http'
const url = process.env.VUE_APP_MONITOR_SIGN_URL
// 查询列表
export function listApi (name, params) {
  return request({
    url: `${url}${name}`,
    method: 'get',
    params
  })
}

export function getNetworkCpuAvgDataAPI (params) {
  return request({
    url: `${url}/edge/networkCpuAvgData`,
    method: 'get',
    params
  })
}

export function getNetworkPortTopDataAPI (params) {
  return request({
    url: `${url}/edge/networkPortTopData`,
    method: 'get',
    params
  })
}

export function getNetworkPortCountDataAPI (params) {
  return request({
    url: `${url}/edge/networkPortCountData`,
    method: 'get',
    params
  })
}
