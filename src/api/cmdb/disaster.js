import request from '@/axios/http'

const auth = process.env.VUE_APP_CLOUNDDDTS_SIGN_URL

// 获取网元容灾判断依据清单数据
export function getDisasterVnfExplainsAPI () {
  return request({
    url: auth + 'disaster/explains',
    method: 'get'
  })
}

// 获取单个网元容灾分析详情数据
export function getDisasterVnfAPI (data) {
  return request({
    url: auth + 'disaster/vnf_dts_detail',
    method: 'get',
    params: data
  })
}

// 获取所有业务网元容灾数据
export function getAllDisasterVnfAPI (data) {
  return request({
    url: auth + 'disaster/vnfs',
    method: 'get',
    params: data
  })
}
