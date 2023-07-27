// inops文件下载工具类
import axios from 'axios'
import { MessagePlugin } from 'tdesign-vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { createStorage } from '@/utils/Storage'
const Storage = createStorage({ storage: localStorage })

// 任务结果下载
// 任务类结果下载类型地址映射
const filePathMapper = {
  // 全量下载-txt格式
  txt: `${process.env.VUE_APP_BASE_URL}/inops/taskResult/batchOrgMsgDownload?`,
  // 全量下载-excel格式
  excel: `${process.env.VUE_APP_BASE_URL}/inops/taskResult/excelDownload/`,
  // 单文件下载
  single: `${process.env.VUE_APP_BASE_URL}/inops/taskResult/orgMsgDownload?`
}

/**
 * 文件下载
 * @param fileType  文件类型（txt：txt格式  excel：Excel格式  single：单文件下载）
 * @param type  下载类型（script：脚本  accept：验收  inspect：巡检  schedule：调度任务  monitor：监控）
 * @param id  下载ID（作业ID/记录ID）
 */
export function onDownTResult (fileType, type, id) {
  let url = ''
  // 通过文件类型获取下载地址url映射
  if (fileType !== 'single') {
    url = fileType === 'excel' ? `${filePathMapper[fileType]}${id}` : `${filePathMapper[fileType]}jobId=${id}&type=${type}`
  } else {
    url = `${filePathMapper[fileType]}id=${id}&type=${type}`
  }
  // axios调用接口
  axios({
    method: 'get',
    url,
    // 响应类型为blob大文件类型
    responseType: 'blob',
    // 设置头部token
    headers: {
      token: Storage.get(ACCESS_TOKEN, '')
    }
  }).then(res => {
    parseResponse(res)
  })
}

// --------------------------------------------------------------
// 监控文件下载
// 监控任务文件类型地址映射
const monitorMapper = {
  txt: `${process.env.VUE_APP_BASE_URL}/inops/taskResult/batchOrgMsgDownload/`,
  excel: `${process.env.VUE_APP_BASE_URL}/inops/taskResult/excelDownload/`,
  single: `${process.env.VUE_APP_BASE_URL}/inops/taskResult/orgMsgDownload/`
}

export function onMonitorDTResult (fileType, id) {
  axios({
    method: 'get',
    url: `${monitorMapper[fileType]}${id}`,
    responseType: 'blob',
    headers: {
      token: Storage.get(ACCESS_TOKEN, '')
    }
  }).then(res => {
    parseResponse(res)
  })
}

// --------------------------------------------------------------
// 备份文件下载
const backupMapper = {
  single: `${process.env.VUE_APP_BASE_URL}/inops/backupRecords/fileDownload/`,
  batch: `${process.env.VUE_APP_BASE_URL}/inops/backupRecords/batchFileDownload`
}
export function onBackupDownload (type, id, data) {
  const url = type === 'single' ? `${backupMapper.single}${id}` : backupMapper.batch
  axios({
    method: type === 'single' ? 'get' : 'post',
    url: url,
    data: data || undefined,
    // 响应类型为blob大文件类型
    responseType: 'blob',
    // 设置头部token
    headers: {
      token: Storage.get(ACCESS_TOKEN, '')
    }
  }).then(res => {
    parseResponse(res)
  })
}
export function batchDownload (url, data, filename) {
  axios({
    method: 'post',
    url,
    data,
    responseType: 'blob',
    headers: { token: Storage.get(ACCESS_TOKEN, '') }
  }).then(res => {
    if (res.headers['content-type'] === 'application/zip') {
      const href = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.setAttribute('href', href)
      a.setAttribute('download', filename)
      a.click()
      URL.revokeObjectURL(href)
    } else {
      MessagePlugin.error({ placement: 'center', content: '文件下载失败，请联系系统管理员' })
    }
  })
}

function parseResponse (response) {
  // 获取响应headers的content-type字段  判断是否为文件
  const contentType = response.headers['content-type']
  // 当content-type不为application/json时表示为文件
  if (contentType.indexOf('application/json') === -1) {
    /*
    * 通过响应字段content-disposition属性获取文件名
    * 使用filename对值进行分割
    * decodeURI解析文件名
    * */
    const filename = decodeURI(response.headers['content-disposition'].split('filename=')[1])
    // 创建隐式a连接
    const a = document.createElement('a')
    // 设置a href属性
    a.href = window.URL.createObjectURL(new Blob([response.data]), { type: 'application/octet-stream' })
    a.setAttribute('download', filename.replaceAll('"', ''))
    a.click()
    a.remove()
    URL.revokeObjectURL(a.href)
  } else {
    MessagePlugin.error({ placement: 'center', content: '文件下载失败，请联系系统管理员' })
  }
}

export function downloadFault (url, fileName) {
  axios.get(url, { responseType: 'blob' }).then(res => {
    const href = URL.createObjectURL(res.data)
    const a = document.createElement('a')
    a.setAttribute('href', href)
    a.setAttribute('download', fileName)
    a.click()
    URL.revokeObjectURL(href)
  })
}
