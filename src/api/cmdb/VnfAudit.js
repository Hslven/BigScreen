import request from '@/axios/http'
import qs from 'qs'

const auth = process.env.VUE_APP_CLOUNDCMDB_SIGN_URL
// 获取所有网元名称数据
export function getAllVnfNameAPI () {
  return request({
    url: auth + 'audit/vnf_names/',
    method: 'get'
  })
}

// 获取指定网元占用资源概述数据
export function getVnfResourceAPI (data) {
  return request({
    url: auth + 'audit/vnf_resource/',
    method: 'get',
    params: {
      network_element: data
    }
  })
}

// 获取指定网元资源HA分布数据
export function getVnfHaResourceAPI (data) {
  return request({
    url: auth + 'audit/vnf_ha_resource/',
    method: 'get',
    params: {
      network_element: data
    }
  })
}

// 资源预审信息提交接口
export function SubmitAuditFormAPI (formData) {
  return request({
    url: auth + 'audit/resource_preaudit/',
    method: 'post',
    data: formData
  })
}

// 资源预审评估结论更新接口
export function UpdateAuditResultAPI (formData) {
  return request({
    url: auth + 'audit/resource_conclusion/',
    method: 'post',
    data: formData
  })
}

// 资源预审记录列表条件查询接口
export function getAuditHistoryDataAPI (data) {
  return request({
    url: auth + 'audit/resource_report/',
    method: 'get',
    params: data
  })
}

// 资源预审数据删除接口
export function deleteAuditHistoryDataAPI (formData) {
  return request({
    url: auth + 'audit/resource_report/',
    method: 'delete',
    data: formData,
    // 处理传递数组参数的情况
    paramsSerializer: params => {
      return qs.stringify(params, { indices: false })
    }
  })
}
