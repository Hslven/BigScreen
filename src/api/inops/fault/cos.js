import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/cos/fault`

// 删除故障案例
export function cosListPageAPI (params, data) {
  return request({
    url: `${url}/listPage`,
    method: 'post',
    params,
    data
  })
}
