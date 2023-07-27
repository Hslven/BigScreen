import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/jobNode`

// 获取节点列表（分页）
export function getJobNodelist (param, data) {
  return request({
    url: `${url}/listPage`,
    method: 'post',
    params: param,
    data
  })
}

// 获取指定节点关联设备（分页）
export function getAssociateApi (param, data) {
  return request({
    url: `${url}/getAssociate`,
    method: 'post',
    params: param,
    data
  })
}

// 根据id获取节点信息
export function getIdNodeAPI (id) {
  return request({
    url: `${url}/get/${id}`,
    method: 'get'
  })
}

// 暂停任务
export function pauseAPI (id) {
  return request({
    url: `${url}/disable/${id}`,
    method: 'get'
  })
}

// 启动任务
export function activeAPI (id) {
  return request({
    url: `${url}/enable/${id}`,
    method: 'get'
  })
}

// 删除指定节点
export function delNodeApi (params) {
  return request({
    url: `${url}/del`,
    method: 'delete',
    params
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

// 暂停节点任务
export function shutdownNodeAPI (params) {
  return request({
    url: `${url}/shutdownNode`,
    method: 'post',
    params
  })
}

// 启动节点任务
export function startupNodeAPI (params) {
  return request({
    url: `${url}/startupNode`,
    method: 'post',
    params
  })
}
