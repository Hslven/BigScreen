import request from '@/axios/http'
const url = process.env.VUE_APP_INOPS_SIGN_URL
// 巡检任务配置 接口
export function getTaskAPI (params, data) {
  return request({
    url: `${url}/acceptJob/listPage`,
    method: 'post',
    params,
    data
  })
}

export function getTaskByIdAPI (id) {
  return request({
    url: `${url}/acceptJob/get/${id}`,
    method: 'get'
  })
}

export function saveTaskAPI (data) {
  return request({
    url: `${url}/acceptJob/save`,
    method: 'post',
    data
  })
}

export function delTaskAPI (id) {
  return request({
    url: `${url}/acceptJob/del/${id}`,
    method: 'delete'
  })
}

export function manualExecuteAPI (data) {
  return request({
    url: `${url}/acceptJob/manualExecute`,
    method: 'post',
    data
  })
}

export function executeOnce (id) {
  return request({
    url: `${url}/acceptJob/executeOnce/${id}`,
    method: 'get'
  })
}

export function getJobHostsAPI (id) {
  return request({
    url: `${url}/acceptJob/getJobHosts/${id}`,
    method: 'get'
  })
}

export function taskResultAPI (params, data) {
  return request({
    url: `${url}/accept/taskResult/listPage`,
    method: 'post',
    params,
    data
  })
}
