// 防火墙封堵详情
import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/blockFirewallDetail`

// 分页列表
export function getFirewallDetailAPI (params, data) {
  return request({
    url: `${url}/listPage`,
    method: 'post',
    params,
    data
  })
}
