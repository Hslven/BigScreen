// webSSH API
import request from '@/axios/http'
const url = process.env.VUE_APP_INOPS_SIGN_URL

export function connectionOSAPI (hostId) {
  return request({
    url: `${url}/webssh/connection2os/${hostId}`,
    method: 'get'
  })
}

export function connectionBMCAPI (hostId) {
  return request({
    url: `${url}/webssh/connection2bmc/${hostId}`,
    method: 'get'
  })
}

export function closeAPI (connectionId) {
  return request({
    url: `${url}/webssh/close/${connectionId}`,
    method: 'get'
  })
}
