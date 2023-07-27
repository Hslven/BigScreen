import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/blockApiOperationRecords`

// 封堵操作记录
export function listPageAPI (params, data) {
  return request({
    url: `${url}/listPage`,
    method: 'post',
    params,
    data
  })
}

// 模拟封堵
export function processTestAPI (data) {
  return request({
    url: `${url}/processTest`,
    method: 'post',
    data
  })
}
