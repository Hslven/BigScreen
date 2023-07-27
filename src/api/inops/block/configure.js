// 封堵脚本配置
import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/blockScriptConfigure`

// 删除规则
export function delAPI (id) {
  return request({
    url: `${url}/del/${id}`,
    method: 'delete'
  })
}

// 映射列表（分页）
export function listPageAPI (params, data) {
  return request({
    url: `${url}/listPage`,
    method: 'post',
    params,
    data
  })
}

// 新增规则
export function saveAPI (data) {
  return request({
    url: `${url}/save`,
    method: 'post',
    data
  })
}

// 批量更新
export function updateAllAPI (data) {
  return request({
    url: `${url}/updateAll`,
    method: 'post',
    data
  })
}
