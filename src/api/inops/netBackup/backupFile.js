import request from '@/axios/http'
const url = `${process.env.VUE_APP_INOPS_SIGN_URL}/backupRecords`

// 通过ID下载文件
export function downloadFileAPI (id) {
  return request({
    url: `${url}/downloadFile/${id}`,
    method: 'get'
  })
}

// 通过ID查询记录
export function getRecordOfIdAPI (id) {
  return request({
    url: `${url}/get/${id}`,
    method: 'get'
  })
}

// 通过ID获取文件内容（针对文本文件）
export function getFileOfIdAPI (id) {
  return request({
    url: `${url}/getFileContent/${id}`,
    method: 'get'
  })
}

// 备份记录列表
export function listPageAPI (params, data) {
  return request({
    url: `${url}/listPage`,
    method: 'post',
    params,
    data
  })
}

// 下载结果（执行记录/文件）
export function downloadAPI (data) {
  return request({
    url: `${url}/batchFileDownload`,
    method: 'post',
    data
  })
}

// 获取备份文件存储空间信息
export function getBackupSpaceAPI () {
  return request({
    url: `${url}/getBackupSpace`,
    method: 'get'
  })
}

// 备份文件大小统计
export function countFileAPI (data) {
  return request({
    url: `${url}/countFile`,
    method: 'post',
    data
  })
}

// 任务备份文件统计
export function countFileByTemplatedIdAPI (data) {
  return request({
    url: `${url}/countFileByDate`,
    method: 'post',
    data
  })
}

// 各资源池文件备份状态
export function countFileByRpAPI (data) {
  return request({
    url: `${url}/countFileByRp`,
    method: 'post',
    data
  })
}
