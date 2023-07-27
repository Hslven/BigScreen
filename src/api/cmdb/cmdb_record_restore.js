import request from '@/axios/http'
const auth = process.env.VUE_APP_CLOUNDCMDB_SIGN_URL

const getCookie = (val) => {
  const reg = new RegExp('(^| )' + val + '=([^;]*)(;|$)')
  const arr = document.cookie.match(reg)
  if (arr) {
    return unescape(arr[2])
  } else {
    return null
  }
}

// 建立档案API
export function addRecordsApi (data) {
  return request({
    url: auth + 'data_backups/records/',
    method: 'post',
    data: data
  })
}

// 获取档案列表API
export function getRecordsApi () {
  return request({
    url: auth + 'data_backups/records/',
    method: 'get'
  })
}

// 删除档案API
export function deleteRecordAPI (data) {
  return request({
    url: auth + 'data_backups/records/',
    method: 'delete',
    data: data,
    headers: { 'x-csrf-token': getCookie('csrfToken') }
  })
}

// 获取异常数据API
export function getAbnormalDataApi (type) {
  return request({
    url: auth + 'data_backups/abnormal_data/',
    method: 'get',
    params: type
  })
}

// 获取异常数据的档案信息API
export function getDataRecordInfoApi (data) {
  return request({
    url: auth + 'data_backups/data_record_info/',
    method: 'get',
    params: data
  })
}

// 同步档案值API
export function restoreDataApi (data) {
  return request({
    url: auth + 'data_backups/restore_data/',
    method: 'post',
    data: data
  })
}

// 获取历史操作记录API
export function getHistoryDataApi (data) {
  return request({
    url: auth + 'data_backups/history_data/',
    method: 'get',
    params: data
  })
}
