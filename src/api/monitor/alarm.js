import request from '@/axios/http'
const url = process.env.VUE_APP_MONITOR_SIGN_URL

export function getAlarmListAPI (params) {
  return request({
    url: `${url}/alarm/list`,
    method: 'post',
    params
  })
}

export function getAlarmTableAPI (params) {
  return request({
    url: `${url}/ops/alarm/getTableData`,
    method: 'post',
    params
  })
}

export function getAlarmAvgAPI (params) {
  return request({
    url: `${url}/ops/alarm/getAvgData`,
    method: 'post',
    params
  })
}

export function uploadAlarmAPI (params) {
  return request({
    url: `${url}/ops/alarm/upload`,
    method: 'post',
    data: params
  })
}
export function tableDataHandle (params) {
  return request({
    url: `${url}/ops/alarm/getData`,
    method: 'post',
    params
  })
}
