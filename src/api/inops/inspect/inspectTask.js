import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/inspectJob`
// 巡检任务配置 接口
export function getTaskAPI (params, data) {
  return request({
    url: `${url}/listPage`,
    method: 'post',
    params,
    data
  })
}

export function getTaskByIdAPI (id) {
  return request({
    url: `${url}/get/${id}`,
    method: 'get'
  })
}

export function getHostByTaskIdAPI (id) {
  return request({
    url: `${url}/getInspectHosts/${id}`,
    method: 'get'
  })
}

export function getInspectItemByTaskIdAPI (id) {
  return request({
    url: `${url}/getInspectTasks/${id}`,
    method: 'get'
  })
}

export function pauseTaskAPI (id) {
  return request({
    url: `${url}/pause/${id}`,
    method: 'get'
  })
}

export function resumeTaskAPI (id) {
  return request({
    url: `${url}/resume/${id}`,
    method: 'get'
  })
}

export function saveTaskAPI (data) {
  return request({
    url: `${url}/save`,
    method: 'post',
    data
  })
}

export function delTaskAPI (id) {
  return request({
    url: `${url}/del/${id}`,
    method: 'delete'
  })
}

export function manualExecuteAPI (data) {
  return request({
    url: `${url}/manualExecute`,
    method: 'post',
    data
  })
}

export function executeOnce (id) {
  return request({
    url: `${url}/executeOnce/${id}`,
    method: 'get'
  })
}
