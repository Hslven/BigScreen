import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/configJob`

export function executeConfigJob (data) {
  return request({
    url: `${url}/execute`,
    method: 'post',
    data
  })
}
