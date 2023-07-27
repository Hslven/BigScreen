import request from '@/axios/http'
const url = process.env.VUE_APP_INOPS_SIGN_URL

// 任务执行结果接口
export function getHostListAPI (params, data, type) {
  return request({
    url: `${url}/taskResult/listBy${type}Host`,
    method: 'post',
    params,
    data
  })
}
