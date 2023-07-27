import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/nodeHandle`

// 变更记录查询
export function nodeHandleApi (params) {
  return request({
    url: `${url}/get`,
    method: 'get',
    params: params
  })
}
