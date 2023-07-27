import request from '@/axios/http'
const url = process.env.VUE_APP_INOPS_SIGN_URL

// 作业状态接口
export function getJobStatusListAPI (params, data) {
  return request({
    url: `${url}/jobStatus/listPage`,
    method: 'post',
    params,
    data
  })
}

// 查询脚本执行记录
export function getScriptDebugAPI (params, data) {
  return request({
    url: `${url}/jobStatus/scriptDebug/listPage`,
    method: 'post',
    params,
    data
  })
}

// 查询任务执行记录
export function getTaskJobAPI (params, data) {
  return request({
    url: `${url}/jobStatus/schedule/listPage`,
    method: 'post',
    params,
    data
  })
}

// 查询巡检执行记录
export function getInspectLogAPI (params, data) {
  return request({
    url: `${url}/jobStatus/inspect/listPage`,
    method: 'post',
    params,
    data
  })
}

// 查询验收执行记录
export function countOfTaskAPI (params, data) {
  return request({
    url: `${url}/accept/taskResult/countOfTask`,
    method: 'post',
    params,
    data
  })
}

export function getConfigLogAPI (params, data) {
  return request({
    url: `${url}/jobStatus/listPage`,
    method: 'post',
    params,
    data
  })
}

export function getChangeLogAPI (params, data) {
  return request({
    url: `${url}/jobStatus/accept/listPage`,
    method: 'post',
    params,
    data
  })
}

export function getBackupLogAPI (params, data) {
  return request({
    url: `${url}/backupJobStatus/listPage`,
    method: 'post',
    params,
    data
  })
}
