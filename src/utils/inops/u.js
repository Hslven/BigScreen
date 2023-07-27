import axios from 'axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { createStorage } from '@/utils/Storage'
const Storage = createStorage({ storage: localStorage })

const { value } = JSON.parse(window.localStorage.getItem('ACCESS-TOKEN'))
function toCamelCase (item) {
  return item.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase()
}

export const pageList = [
  { label: '每页 30 条', value: 30 },
  { label: '每页 60 条', value: 60 },
  { label: '每页 90 条', value: 90 },
  { label: '每页 180 条', value: 180 },
  { label: '每页 300 条', value: 300 },
  { label: '每页 500 条', value: 500 },
  { label: '全部', value: '' }]

export function getDictList (type) {
  const item = window.localStorage.getItem(type)
  if (!item) {
    return new Promise(resolve => {
      axios({
        method: 'get',
        headers: {
          token: Storage.get(ACCESS_TOKEN, '')
        },
        url: `${process.env.VUE_APP_BASE_URL}${process.env.VUE_APP_INOPS_SIGN_URL}/dict/typeOf/${toCamelCase(type)}`
      }).then(res => {
        const { data } = res
        if (data.code === 200) {
          const list = []
          data.data.forEach(i => {
            list.push({ label: i.label, value: i.value })
          })
          window.localStorage.setItem(type, JSON.stringify(list))
          resolve(list)
        }
      })
    })
  } else {
    return JSON.parse(item)
  }
}

export function getWSURL (id, type) {
  /*
  webteminal    页面ssh
  approve       审批流程
   */
  return `${process.env.VUE_APP_INOPS_WS_URL}${id}?token=${value}&type=${type}`
}
export function getSSHURL (id) {
  /*
  taskresult    远程控制获取
  webteminal    页面ssh
  WebSsh
   */
  return `${process.env.VUE_APP_INOPS_WS_URL}webssh/connection2node/${id}`
}

export function objectDistinct (list, key) {
  const copyList = JSON.parse(JSON.stringify(list))
  const result = new Map()
  return copyList.filter(item => {
    !result.has(item[key]) && result.set(item.id, item.id)
    return item
  })
}
