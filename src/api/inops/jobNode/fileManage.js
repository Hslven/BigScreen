import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/fileRecords`

// 获取文件上传记录（分页）
export function getFilelist (param, data) {
  return request({
    url: `${url}/listPage`,
    method: 'post',
    params: param,
    data
  })
}

// 删除指定文件
export function delFileApi (ids) {
  return request({
    url: `${url}/del/${ids}`,
    method: 'delete'
  })
}
// 上传文件
export function uploadFileApi (data) {
  return request({
    Headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: `${url}/upload`,
    method: 'post',
    data: data
  })
}
// 通过ID获取文件记录
export function getFileAPI (id) {
  return request({
    url: `${url}/get/${id}`,
    method: 'get'
  })
}
// 下载文件
export function getFiledownloadAPI (params) {
  return request({
    url: `${url}/download`,
    responseType: 'blob',
    method: 'get',
    params
  })
}

// 上传文件到节点
export function getupload2TerminalApi (data) {
  return request({
    url: `${url}/upload2Terminal`,
    method: 'post',
    data
  })
}

// 指定节点部署
export function getdeploy2NodeApi (data) {
  return request({
    url: `${url}/deploy2Node`,
    method: 'post',
    data
  })
}
