import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/backupJob`

// 删除任务
export function delJobAPI (id) {
  return request({
    url: `${url}/del/${id}`,
    method: 'delete'
  })
}

// 执行指定任务
export function executeOnceAPI (id) {
  return request({
    url: `${url}/executeOnce/${id}`,
    method: 'get'
  })
}

// 通过ID查询任务
export function getOfIdAPI (id) {
  return request({
    url: `${url}/get/${id}`,
    method: 'get'
  })
}

// 获取指定任务的执行设备
export function getHostsOfIdAPI (id) {
  return request({
    url: `${url}/getHosts/${id}`,
    method: 'get'
  })
}

// 获取指定任务的执行步骤
export function getTasksOfIdAPI (id) {
  return request({
    url: `${url}/getTasks/${id}`,
    method: 'get'
  })
}

// 任务列表
export function listPageAPI (params, data) {
  return request({
    url: `${url}/listPage`,
    method: 'post',
    params,
    data
  })
}

// 暂停任务
export function pauseAPI (id) {
  return request({
    url: `${url}/pause/${id}`,
    method: 'get'
  })
}

// 启动任务
export function resumeAPI (id) {
  return request({
    url: `${url}/resume/${id}`,
    method: 'get'
  })
}

// 新增
export function saveAPI (data) {
  return request({
    url: `${url}/save`,
    method: 'post',
    data
  })
}

// 查询脚本是否最新
export function getUpdateableJobAPI (data) {
  return request({
    url: `${url}/getUpdateableJob`,
    method: 'post',
    data
  })
}

// 更新指定步骤
export function updateTaskScriptAPI (params) {
  return request({
    url: `${url}/updateTaskScript`,
    method: 'post',
    params
  })
}

// 获取所有任务列表
export function listAllAPI () {
  return request({
    url: `${url}/listAll`,
    method: 'get'
  })
}
