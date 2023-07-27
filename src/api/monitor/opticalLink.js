import request from '@/axios/http'
const url = process.env.VUE_APP_MONITOR_SIGN_URL

// 算法排名预测接口
export function getPageForecastAPI (params) {
  return request({
    url: `${url}/optical/pageForecast`,
    method: 'post',
    params
  })
}

export function getRankingChangeTopAPI (params) {
  return request({
    url: `${url}/optical/getRankingChangeTop`,
    method: 'get',
    params
  })
}

export function getPortAPI (params) {
  return request({
    url: `${url}/optical/getPort`,
    method: 'get',
    params
  })
}
