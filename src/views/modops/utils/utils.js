import { cloneDeep } from 'lodash'
import { serviceStatus } from './type'
export class Utils {
  setInputValue (element) {
    /*
   1. 将参数default设置为输入参数value
   2. 如若参数存在值，则将该输入桩设置为已连接状态
    */
    if (element.type !== 'boolean') {
      if (Array.isArray(element.options.default)) {
        if (['network', 'host'].includes(element.tag)) {
          if (element.options.default.length) {
            const items = []
            for (const item of element.options.default) {
              items.push(item.name)
            }
            element.value = [items] // items再嵌一层列表的原因：保证[]内的数据类型与type一致，如list_string类型的数据即为[[value]]
            element.source = 'value'
            element.connected = true
          }
        } else {
          if (element.options.default.length) {
            element.value = [cloneDeep(element.options.default)]
            element.source = 'value'
            element.connected = true
          }
        }
      } else if (typeof element.options.default === 'string') {
        if (element.options.default) {
          element.value.push(cloneDeep(element.options.default))
          element.source = 'value'
          element.connected = true
        }
      }
    } else {
      element.value.push(cloneDeep(element.options.default))
      element.source = 'value'
      element.connected = true
    }
  }
}

export function setEdgeStatus (edgeAttrs, status) {
  edgeAttrs.line.sourceMarker.fill = serviceStatus[status].color
  edgeAttrs.line.sourceMarker.stroke = serviceStatus[status].color
  edgeAttrs.line.targetMarker.fill = serviceStatus[status].color
  edgeAttrs.line.targetMarker.stroke = serviceStatus[status].color
  edgeAttrs.line.stroke = serviceStatus[status].color
  return edgeAttrs
}
