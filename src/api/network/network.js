import request from '@/axios/http'

const auth = process.env.VUE_APP_NETWORK_SIGN_URL

// 获取业务系统vlan数据
export function getBusinessVlan () {
  return request({
    url: auth + 'business_vlan/',
    method: 'get'
  })
}

// 获取vlan视图数据
export function getPoolVlan (data) {
  return request({
    url: auth + 'pool_vlan/',
    method: 'get'
  })
}

// 获取公网CMNET_IP数据
export function getCmnetIpApi (data) {
  return request({
    url: auth + 'public_cmnet_ip/',
    method: 'get'
  })
}

// 获取垂直地图数据
export function getVerticalMapApi (data) {
  return request({
    url: '/cloudnetwork/api/v1/network_new/network_vertical_map/',
    method: 'post',
    data
  })
}

// 获取垂直地图数据
export function getVerticalMapNewApi (data) {
  return request({
    url: '/cloudnetwork/api/v1/network_vm_basic/network_vertical_map/',
    method: 'post',
    data
  })
}

// // 获取垂直地图HA下虚拟机数据
// export function getVerticalMapHaVmsApi (data) {
//   return request({
//     url: auth + 'vertical_map_ha_vms/',
//     method: 'get',
//     params: data
//   })
// }

// 垂直地图数据导出接口
export function downloadVerticalMapApi (formData) {
  return request({
    url: '/cloudnetwork/api/v1/network_new/vertical_map_download/',
    method: 'post',
    data: formData,
    responseType: 'blob'
  })
}

// 垂直地图数据导出接口
export function downloadVerticalMapNewApi (formData) {
  return request({
    url: '/cloudnetwork/api/v1/network_vm_basic/vertical_map_download/',
    method: 'post',
    data: formData,
    responseType: 'blob'
  })
}
