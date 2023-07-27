import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/an`

// 东信-网络云存储服务器异常定界定位
export function hostHealthInspectAPI (data) {
  return request({
    url: `${url}/hostHealthInspect`,
    method: 'post',
    data
  })
}

export function rpHealthInspectAPI (data) {
  return request({
    url: `${url}/rpHealthInspect`,
    method: 'post',
    data
  })
}

export function neLogListAPI () {
  return request({
    url: `${url}/neLogList`,
    method: 'post'
  })
}

export function vmLogInspectAPI (data) {
  return request({
    url: `${url}/vmLogInspect`,
    method: 'post',
    data
  })
}

export function predictSuggestionAPI (data) {
  return request({
    url: `${url}/predictSuggestion`,
    method: 'post',
    data
  })
}

export function changeForecastAPI (data) {
  return request({
    url: `${url}/changeForecast`,
    method: 'post',
    data
  })
}

export function interfaceInspectAPI (data) {
  return request({
    url: `${url}/interfaceInspect`,
    method: 'post',
    data
  })
}

export function interfaceTrafficForecastAPI (data) {
  return request({
    url: `${url}/interfaceTrafficForecast`,
    method: 'post',
    data
  })
}
