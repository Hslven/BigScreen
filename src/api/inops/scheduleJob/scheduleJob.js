import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/scheduleJob`

// 调度任务接口
// 新增/修改任务配置
export function saveScheduleJobAPI (data) {
  return request({
    url: `${url}/save`,
    method: 'post',
    data
  })
}

// 通过ID获取任务
export function getTaskByIdAPI (id) {
  return request({
    url: `${url}/get/${id}`,
    method: 'get'
  })
}

// 删除任务
export function delTaskAPI (id) {
  return request({
    url: `${url}/del/${id}`,
    method: 'delete'
  })
}

// 获取任务配置列表
export function getScheduleJobAPI (params, data) {
  return request({
    url: `${url}/listPage`,
    method: 'post',
    params,
    data
  })
}

// 执行指定任务
export function executeOnceAPI (id) {
  return request({
    url: `${url}/executeOnce/${id}`,
    method: 'get'
  })
}

// 暂停任务
export function pauseTaskAPI (id) {
  return request({
    url: `${url}/pause/${id}`,
    method: 'get'
  })
}

// 启动任务
export function resumeTaskAPI (id) {
  return request({
    url: `${url}/resume/${id}`,
    method: 'get'
  })
}

// 获取指定任务的执行设备
export function getHostsByIdAPI (id) {
  return request({
    url: `${url}/getHosts/${id}`,
    method: 'get'
  })
}

// 获取指定任务的执行步骤（脚本）
export function getTasksByIdAPI (id) {
  return request({
    url: `${url}/getTasks/${id}`,
    method: 'get'
  })
}
