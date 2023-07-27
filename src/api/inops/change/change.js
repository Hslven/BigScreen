import request from '@/axios/http'
const url = process.env.VUE_APP_INOPS_SIGN_URL
export function getTaskAPI (params, data) {
  return request({
    url: `${url}/changeJob/listPage`,
    method: 'post',
    params,
    data
  })
}

export function getTaskByIdAPI (id) {
  return request({
    url: `${url}/changeJob/get/${id}`,
    method: 'get'
  })
}

export function saveTaskAPI (data) {
  return request({
    url: `${url}/changeJob/save`,
    method: 'post',
    data
  })
}

export function delTaskAPI (id) {
  return request({
    url: `${url}/changeJob/del/${id}`,
    method: 'delete'
  })
}

export function manualExecuteAPI (data) {
  return request({
    url: `${url}/changeJob/manualExecute`,
    method: 'post',
    data
  })
}

export function executeOnce (id) {
  return request({
    url: `${url}/changeJob/executeOnce/${id}`,
    method: 'get'
  })
}

export function getJobHostsAPI (id) {
  return request({
    url: `${url}/changeJob/getJobHosts/${id}`,
    method: 'get'
  })
}

export function taskResultAPI (param, data) {
  return request({
    url: `${url}/change/taskResult/listPage`,
    method: 'post',
    param,
    data
  })
}

export function getRelatedDevicesAPI (data) {
  return request({
    url: `${url}/changeJob/getRelatedDevices`,
    method: 'post',
    data
    // data: qs.stringify(data)
  })
}

export function updateChangeStatusAPI (data) {
  return request({
    url: `${url}/changeJob/updateChangeStatus`,
    method: 'post',
    data
  })
}

export function getScoreByIdAPI (id) {
  return request({
    url: `${url}/changeJob/getScore/${id}`,
    method: 'post'
  })
}

export function getChangeJobAPI (data) {
  return request({
    url: `${url}/changeJob/listPage`,
    method: 'post',
    data
    // data: qs.stringify(data)
  })
}
