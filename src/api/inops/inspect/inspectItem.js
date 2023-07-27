import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/taskItem`

// 巡检项接口
export function saveItemAPI (data) {
  return request({
    url: `${url}/save`,
    method: 'post',
    data
  })
}

export function removeItemAPI (id) {
  return request({
    url: `${url}/del/${id}`,
    method: 'delete'
  })
}

export function getListAPI (data) {
  return request({
    url: `${url}/list`,
    method: 'post',
    data
  })
}

export function getListByIdAPI (id) {
  return request({
    url: `${url}/get/${id}`,
    method: 'get'
  })
}

export function getInspectSciptAPI (id) {
  return request({
    url: `${url}/getTaskScript/${id}`,
    method: 'get'
  })
}
