import request from '@/axios/http'
const auth = process.env.VUE_APP_CLOUNDCMDB_SIGN_URL
// 获取单个硬件资源池下网元的资源占比数据
export function getPoolNetworkAPI (data) {
  return request({
    url: auth + 'cmdb/pools_network_element/',
    method: 'get',
    params: {
      pool_name: data
    }
  })
}

// 获取硬件资源池列表数据
export function getPoolsListAPI () {
  return request({
    url: auth + 'cmdb/pools_infos/',
    method: 'get'
  })
}

// 获取单个硬件资源池下HA的资源使用情况占比数据
export function getPoolsHaAPI (data) {
  return request({
    url: auth + 'cmdb/pools_ha/',
    method: 'get',
    params: {
      pool_name: data
    }
  })
}

// 获取单个硬件资源池下总览数据
export function getPoolsOverviewAPI (data) {
  return request({
    url: auth + 'cmdb/pools_pandect/',
    method: 'get',
    params: {
      pool_name: data
    }
  })
}

// 获取HA资源数据
export function getHADataAPI (data) {
  return request({
    url: auth + 'cmdb/ha/',
    method: 'get',
    params: data
  })
}

// 获取存储池资源占用情况数据
export function getStoragePoolAPI (data) {
  return request({
    url: auth + 'cmdb/storage_pool/',
    method: 'get',
    params: data
  })
}

// 获取存储池资源占用情况数据
export function getHaResourceAPI (data) {
  return request({
    url: auth + 'cmdb/ha_resource/',
    method: 'get',
    params: data
  })
}

// 省表生成接口
export function groupExcelGenAPI (formData) {
  return request({
    url: auth + 'province_excel/download_excel/',
    method: 'post',
    data: formData,
    responseType: 'blob'
  })
}

// 获取历史分布式存储池数据
export function getHistoryStoragePoolAPI (data) {
  return request({
    url: auth + 'resource_snapshot/resource_storage/',
    method: 'get',
    params: {
      pool: data
    }
  })
}

// 获取历史Ha数据
export function getHistoryHaAPI (data) {
  return request({
    url: auth + 'resource_snapshot/resource_vcpu/',
    method: 'get',
    params: {
      pool: data
    }
  })
}

// 历史数据对比接口
export function compareHistoryDataApi (data) {
  return request({
    url: auth + 'resource_snapshot/compare_data/',
    method: 'post',
    data: data
  })
}
