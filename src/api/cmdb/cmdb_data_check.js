import request from '@/axios/http'
const auth = process.env.VUE_APP_CLOUNDCMDB_SIGN_URL

// 获取CMDB各资源池列表数据
export function getPoolInfosApi () {
  return request({
    url: auth + 'compliance_check/pools_infos/',
    method: 'get'
  })
}

// 获取CMDB各模型违规数据统计结果
export function getCheckDataApi (data) {
  return request({
    url: auth + 'compliance_check/cmdb_violation_data/',
    method: 'post',
    data: data
  })
}

// 获取单个检查项历史处理记录接口
export function getCheckHistoryRecordApi (data) {
  return request({
    url: auth + 'compliance_check/check_history_record/',
    method: 'post',
    data: data
  })
}

// 添加检查项处理记录接口
export function addCheckHistoryRecordApi (data) {
  return request({
    url: auth + 'compliance_check/check_data_records/',
    method: 'post',
    data: data
  })
}

// CMDB各模型违规数据导出接口
export function downloadCheckDataApi (data) {
  return request({
    url: auth + 'compliance_check/download/',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
