import Vue from 'vue'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import { transToQuarts } from '../utils/inops/transExpression'

Vue.use(VXETable)
Vue.prototype.$XModal = VXETable.modal
Vue.prototype.$XSaveFile = VXETable.saveFile
VXETable.setup({
  zIndex: 6000
})

VXETable.formats.add('formatField', ({ cellValue }, list) => {
  const index = list.findIndex(item => item.value === cellValue)
  return index !== -1 ? list[index].label : cellValue
})

VXETable.formats.add('formatTaskStatus', ({ cellValue }, list) => {
  let bgColor = ''
  if (cellValue === 'ok') {
    bgColor = 'bg-green'
  } else if (cellValue === 'failed') {
    bgColor = 'bg-red'
  } else if (cellValue === 'skipped') {
    bgColor = 'bg-blue-grey'
  } else if (cellValue === 'unreachable') {
    bgColor = 'bg-deep-orange'
  }
  const index = list.findIndex(item => item.value === cellValue)
  const label = index !== -1 ? list[index].label : cellValue
  const item = `<span class="q-badge ${bgColor}">${label}</span>`
  return item
})

VXETable.formats.add('formatUser', ({ cellValue }, list) => {
  const index = list.findIndex(item => item.userId === Number(cellValue))
  if (index !== -1) {
    return list[index].nickName
  } else {
    return 'admin'
  }
})

VXETable.formats.add('formatExpression', ({ cellValue }) => {
  if (cellValue !== '' && cellValue !== null) {
    const obj = transToQuarts(cellValue)
    return obj.text
  } else if (cellValue === '') {
    return '暂未配置执行周期'
  } else if (cellValue === null) {
    return '手动执行'
  }
})

VXETable.formats.add('formatExecuteType', ({ cellValue }) => {
  return cellValue === '0' ? '自动（周期）执行' : '手动执行'
})

VXETable.formats.add('formatterIgnore', ({ cellValue }) => {
  return cellValue === '0' ? '否' : '是'
})
