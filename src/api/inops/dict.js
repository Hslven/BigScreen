import request from '@/axios/http'
const url = process.env.VUE_APP_INOPS_SIGN_URL

// 获取根据字典类型获取字典
export function getDictAPI (type) {
  return request({
    url: `${url}/dict/typeOf/${type}`,
    method: 'get'
  })
}
