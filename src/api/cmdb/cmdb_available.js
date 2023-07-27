import request from '@/axios/http'
const auth = process.env.VUE_APP_CLOUNDCMDB_SIGN_URL

// 获取cmdb-server、cmdb-login服务每天的可用时长指标API
export function getServerAvailDurationAllApi (data) {
  return request({
    url: auth + 'server_avail/all/',
    method: 'get',
    params: data
  })
}

// 获取cmdb-server、cmdb-login服务在指定时间段内的可用时长指标API
export function getServerAvailDurationDaysApi (data) {
  return request({
    url: auth + 'server_avail/days/',
    method: 'get',
    params: data
  })
}

// 获取cmdb-server、cmdb-login服务在指定时间段内每小时的可用时长指标API
export function getServerAvailDurationHoursApi (data) {
  return request({
    url: auth + 'server_avail/hours/',
    method: 'get',
    params: data
  })
}
