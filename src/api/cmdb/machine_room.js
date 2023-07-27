import request from '@/axios/http'
const auth = process.env.VUE_APP_CLOUNDCMDB_SIGN_URL

// 获取机房概述数据
export function getMachineRooms () {
  return request({
    url: auth + 'machine_rooms/machine_rooms',
    method: 'get'
  })
}

// 获取计算模块数据
export function getModuleData (id) {
  return request({
    url: auth + 'machine_rooms/module_detail',
    method: 'get',
    params: { id: id }
  })
}
