import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/faultCase`

// 删除故障案例
export function delFaultCaseAPI (id) {
  return request({
    url: `${url}/del/${id}`,
    method: 'delete'
  })
}
// 获取故障案例
export function getFaultCaseByIdAPI (id) {
  return request({
    url: `${url}/get/${id}`,
    method: 'get'
  })
}
// 获取案例信息（分页）
export function getFaultCaseListAPI (params, data) {
  return request({
    url: `${url}/listPage`,
    method: 'post',
    params,
    data
  })
}
// 新增/修改故障案例
export function saveFaultCaseAPI (data) {
  return request({
    url: `${url}/save`,
    method: 'post',
    data
  })
}
// 下载故障案例
export function downloadCaseAPI (id) {
  return request({
    responseType: 'arraybuffer',
    url: `${url}/download/${id}`,
    method: 'get'
  })
}
// 上传故障案例
export function uploadCaseAPI (id, data) {
  return request({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `${url}/upload/${id}`,
    method: 'post',
    data
  })
}
// ai案例推荐
export function aiSuggestionAPI (data) {
  return request({
    url: `${url}/aiSuggestion`,
    method: 'post',
    data
  })
}
// 新增告警枚举值
export function addAlarmEnumAPI (alarmName) {
  return request({
    url: `${url}/addAlarmEnum/${alarmName}`,
    method: 'post'
  })
}
// 告警枚举列表
export function alarmEnumListAPI () {
  return request({
    url: `${url}/alarmEnumList`,
    method: 'get'
  })
}
// 删除告警枚举值
export function delAlarmEnumAPI (alarmName) {
  return request({
    url: `${url}/delAlarmEnum/${alarmName}`,
    method: 'delete'
  })
}
// 已绑定列表
export function bindingListAPI () {
  return request({
    url: `${url}/bindingList`,
    method: 'get'
  })
}
// 案例绑定告警
export function bindingAlarmAPI (data) {
  return request({
    url: `${url}/bindingAlarm`,
    method: 'post',
    data
  })
}
// 案例绑定告警（更新）
export function updateBindingAPI (data) {
  return request({
    url: `${url}/updateBinding`,
    method: 'post',
    data
  })
}
// 案例已绑定告警
export function getBindingAlarmAPI (id) {
  return request({
    url: `${url}/bindingList/${id}`,
    method: 'get'
  })
}
// 获取故障案例（告警查看方案）
export function getBindCaseAPI (alarmName) {
  return request({
    url: `${url}/getBingCase/${alarmName}`,
    method: 'get'
  })
}
