import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/approveRecords`

// 获取审批记录
export function getApproveRecordsAPI (params, data) {
  return request({
    url: `${url}/listPage`,
    params,
    data,
    method: 'post'
  })
}
