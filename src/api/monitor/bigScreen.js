import request from '@/axios/http'
const url = process.env.VUE_APP_MONITOR_SIGN_URL

// 温度热力视图
// 获取echarts数据
export function getTemperatureCompEchartsAPI () {
  return request({
    url: `${url}/largeScreen/resourcePoolTemp`,
    method: 'get'
  })
}
// 点击echart跳转并获取数据
export function getTemperatureCompResourcePoolAzTempAPI (params) {
  return request({
    url: `${url}/largeScreen/resourcePoolAzTemp`,
    method: 'post',
    data: params
  })
}
// 点击模块显示右侧画板和表格数据
export function getCanvasData (params) {
  return request({
    url: `${url}/largeScreen/getCanvasData`,
    method: 'post',
    data: params
  })
}
// 点击模块组
export function resourcePoolModulesTemp (params) {
  return request({
    url: `${url}/largeScreen/resourcePoolModulesTemp`,
    method: 'post',
    data: params
  })
}
// 流量视图
export function getViewById (params) {
  return request({
    url: `${url}/largeScreenPortView/getViewById`,
    method: 'post',
    data: params
  })
}
// 流量视图查询端口数据接口
export function getPortData (params) {
  return request({
    url: `${url}/largeScreenPortView/getPortData`,
    method: 'post',
    data: params
  })
}
// 流量视图根据资源池查询端口视图代码
export function getViewByResourcePool (params) {
  return request({
    url: `${url}/largeScreenPortView/getViewByViewName`,
    method: 'get',
    params
  })
}
/**
  @param viewType 必选。图类型 如果为空就返回图类型列表，不为空就返回图名称
  @returns 查询图类型或者图名称
*/
export function getViewTypeOrViewName (params) {
  return request({
    url: `${url}/largeScreenPortView/getViewTypeOrViewName`,
    method: 'get',
    params
  })
}
/**
 * @returns 获取所有的流量视图
 */
export function getViewName () {
  return request({
    url: `${url}/largeScreenPortView/getViewName`,
    method: 'get'
  })
}
/**
 * @returns 保存或者更新流量视图
 */
export function saveOrUpdate (params) {
  return request({
    url: `${url}/largeScreenPortView/saveOrUpdate`,
    method: 'post',
    data: params
  })
}
/**
 * @returns 根据设备名查询端口
 */
export function getPortsByHostName (params) {
  return request({
    url: `${url}/largeScreenPortView/getPortsByHostName`,
    method: 'get',
    params
  })
}
/**
 * @returns 根据资源池和设备类型获取设备列表
 */
export function getHostNameList (params) {
  return request({
    url: `${url}/largeScreenPortView/getHostNameList`,
    method: 'get',
    params
  })
}
/**
 * @returns 删除流量视图
 */
export function viewDelete (params) {
  return request({
    url: `${url}/largeScreenPortView/delete`,
    method: 'delete',
    data: params
  })
}
/**
 * @returns 根据流量图名称和流量图类型查询流量图
 */
export function getViewByViewNameAndViewType (params) {
  return request({
    url: `${url}/largeScreenPortView/getViewByViewNameAndViewType`,
    method: 'get',
    params
  })
}
// 告警视图
export function getResourcePoolAlarmEventAPI () {
  return request({
    url: `${url}/largeScreen/getAlarmViewData`,
    method: 'get'
  })
}

export function getViewDataAPI () {
  return request({
    url: `${url}/largeScreen/getCountOfAlarmEvents`,
    method: 'get'
  })
}

export function getAlarmDataAPI () {
  return request({
    url: `${url}/largeScreen/getAlarmEventsData`,
    method: 'get'
  })
}

export function getDetailDataAPI (data) {
  return request({
    url: `${url}/largeScreen/getPoolAlarmDetail`,
    method: 'get',
    params: data
  })
}
