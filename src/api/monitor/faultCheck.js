import request from '@/axios/http'
const url = process.env.VUE_APP_MONITOR_SIGN_URL

export function getAppListAPI () {
  return request({
    url: `${url}/faultCheck/getAppList`,
    method: 'get'
  })
}

export function getTopuAPI (params) {
  return request({
    url: `${url}/faultCheck/getTopu`,
    method: 'post',
    params
  })
}

export function getAlarmPageAPI (params) {
  return request({
    url: `${url}/faultCheck/getAlarmPage`,
    method: 'post',
    params
  })
}

export function getOrderPageAPI (params) {
  return request({
    url: `${url}/faultCheck/getOrderPage`,
    method: 'post',
    params
  })
}

export function getLogNetworkAPI (params) {
  return request({
    url: `${url}/faultCheck/getLogNetwork`,
    method: 'post',
    params
  })
}

export function getLogHostAPI (params) {
  return request({
    url: `${url}/faultCheck/getLogHost`,
    method: 'post',
    params
  })
}
