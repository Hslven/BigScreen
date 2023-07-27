import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/approveUser`

// 获取审批人列表
export function getApproveListAPI (params, data) {
  return request({
    url: `${url}/listPage`,
    params,
    data,
    method: 'post'
  })
}

// 获取当前用户的审批人列表
export function getApproverOfUserAPI () {
  return request({
    url: `${url}/approverList`,
    method: 'get'
  })
}
