import qs from 'qs'
import request from '@/axios/http'
const url = process.env.VUE_APP_INOPS_SIGN_URL

// 脚本执行接口
// 获取作业脚本（分页）
export function getJobListAPI (param, data) {
  return request({
    url: `${url}/script/listPage`,
    method: 'post',
    params: param,
    data
  })
}

// 获取作业脚本（ID）
export function getJobByIdAPI (id) {
  return request({
    url: `${url}/script/get/${id}`,
    method: 'get'
  })
}

// 新增/编辑作业脚本
export function saveScriptAPI (data) {
  return request({
    url: `${url}/script/save`,
    method: 'post',
    data
  })
}

// 删除作业脚本
export function delJobAPI (id) {
  return request({
    url: `${url}/script/del/${id}`,
    method: 'delete'
  })
}

// 执行作业脚本
export function scriptCodeDebugAPI (data) {
  return request({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: `${url}/script/codeDebug`,
    method: 'post',
    data: qs.stringify(data)
  })
}

// 下载结果（txt）
export function downloadResultAPI (id) {
  return request({
    url: `${url}/taskResult/getOrgMsg/${id}`,
    method: 'get'
  })
}

// 获取当前用户脚本数量
export function getCountOfJobAPI () {
  return request({
    url: `${url}/script/countByScriptType`,
    method: 'get'
  })
}

// 更新作业脚本参数（先删除后新增）
export function updateParamAPI (data) {
  return request({
    url: `${url}/script/updateParam`,
    method: 'post',
    data
  })
}
