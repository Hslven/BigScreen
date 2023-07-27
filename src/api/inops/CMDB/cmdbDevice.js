import request from '@/axios/http'
const url = process.env.VUE_APP_INOPS_SIGN_URL

// CMDB纳管设备接口
// 设备列表（分页）
export function listPageAPI (params, data) {
  return request({
    url: `${url}/hosts/listPage`,
    method: 'post',
    params: params,
    data: data || {}
  })
}

// 获取设备与连接账号（ID）
export function getHostInfoAPI (hostId) {
  return request({
    url: `${url}/hosts/getHostAndUser/${hostId}`,
    method: 'get'
  })
}

// 获取账号密码（明文）
export function getDecryptPswAPI (pass) {
  return request({
    method: 'post',
    headers: {
      'Content-Type': 'text/xml'
    },
    url: `${url}/hosts/decryptPass`,
    data: pass
  })
}

// 新增/编辑设备
export function saveHostAPI (data) {
  return request({
    method: 'post',
    url: `${url}/hosts/save`,
    data: data
  })
}

// 删除设备
export function delHostAPI (ids) {
  return request({
    method: 'delete',
    url: `${url}/hosts/del/${ids}`
  })
}

// 上传文件
export function uploadFileAPI (data) {
  return request({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `${url}/hosts/import`,
    method: 'post',
    data
  })
}
