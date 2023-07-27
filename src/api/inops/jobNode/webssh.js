import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/webssh`

// 连接作业节点
export function connection2nodeAPI (id) {
  return request({
    url: `${url}/connection2node/${id}`,
    method: 'get'
  })
}

// 断开连接
export function closeAPI (id) {
  return request({
    url: `${url}/close/${id}`,
    method: 'get'
  })
}

// ssh会话尺寸调整
export function resizePtyAPI (id, params) {
  return request({
    url: `${url}/resizePty/${id}`,
    method: 'post',
    params
  })
}
