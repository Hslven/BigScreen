// 光模块预测
import request from '@/axios/http'
const url = process.env.VUE_APP_MONITOR_SIGN_URL

export function getOpticalListAPI (params) {
  return request({
    url: `${url}/optical/page`,
    method: 'post',
    params
  })
}

export function getResourcePoolAPI () {
  return request({
    url: `${url}/optical/getResourcePoolList`,
    method: 'get'
  })
}

export function getResourcePoolAndTopAPI () {
  return request({
    url: `${url}/carousel/getResourcePoolAndTop`,
    method: 'get'
  })
}

export function getPortsByHostNameAPI (hostName) {
  return request({
    url: `${url}/optical/getPortsByHostName?name=${hostName}`,
    method: 'get'
  })
}

export function getNetworkByResourcePoolAPI (resourcePool) {
  return request({
    url: `${url}/optical/getNetworkByResourcePool?resourcePool=${resourcePool}`,
    method: 'get'
  })
}

export function getHostListAPI (params) {
  return request({
    url: `${url}/optical/getHostList`,
    method: 'get',
    params
  })
}
