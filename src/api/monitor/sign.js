import qs from 'qs'
import request from '@/axios/http'
const url = `${process.env.VUE_APP_MONITOR_SIGN_URL}/optical/fault`
export function saveSignAPI (data) {
  return request({
    url: `${url}/save`,
    method: 'post',
    data: qs.stringify(data)
  })
}

export function updateSignAPI (data) {
  return request({
    url: `${url}/update`,
    method: 'put',
    data: qs.stringify(data)
  })
}

export function signListAPI (data) {
  return request({
    url: `${url}/page`,
    method: 'post',
    data
  })
}

export function delSignAPI (data) {
  return request({
    url: `${url}/delete`,
    method: 'delete',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data)
  })
}

export function signDetailAPI (id) {
  return request({
    url: `${url}/look/${id}`,
    method: 'get'
  })
}
