import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/approve`

// 获取审批记录
export function approveAPI (data) {
  return request({
    url: `${url}/approve`,
    data,
    method: 'post'
  })
}

// 查询当前用户指定权限审批通过
export function accessibleAPI (params) {
  return request({
    url: `${url}/accessible`,
    method: 'get',
    params
  })
}

// 已通过审批的权限列表
export function accessListAPI (params) {
  return request({
    url: `${url}/accessList`,
    method: 'get',
    params
  })
}

// 普通用户审批（短信）
export function approve (data) {
  return request({
    url: `${url}/approve`,
    method: 'post',
    data
  })
}

// 系统管理员审批（接口）
export function approveByAdminAPI (data) {
  return request({
    url: `${url}/approveByAdmin`,
    method: 'post',
    data
  })
}
