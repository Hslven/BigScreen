import request from '@/axios/http'

const auth = process.env.VUE_APP_AUTH_SIGN_URL

// 获取菜单列表API
export function getMenuListApi () {
  return request({
    url: auth + '/sys/menu/tree',
    method: 'get'
  })
}

// 新增菜单API
export function addMenuApi (data) {
  return request({
    url: auth + '/sys/menu',
    method: 'post',
    params: data
  })
}

// 更新菜单信息API
export function updateMenuApi (data) {
  return request({
    url: auth + '/sys/menu',
    method: 'put',
    params: data
  })
}

// 获取单个菜单API
export function getMenuApi (id) {
  return request({
    url: auth + `/sys/menu/${id}`,
    method: 'get'
  })
}

// 删除菜单API
export function deleteMenuApi (id) {
  return request({
    url: auth + `/sys/menu/${id}`,
    method: 'delete'
  })
}
