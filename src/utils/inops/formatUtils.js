import { transToQuarts } from './transExpression'

export function formatField (list, key, value) {
  const index = list.findIndex(item => item.value === value)
  return index === -1 ? '' : list[index][key]
}

export function formatExecuteType (value) {
  return value === '0' ? '自动（周期）执行' : '手动执行'
}

export function formatIgnore (value) {
  return value === '0' ? '否' : '是'
}

export function formatExpression (value) {
  if (value !== '' && value !== null) {
    const obj = transToQuarts(value)
    return obj.text
  } else if (value === '') {
    return '暂未配置执行周期'
  } else if (value === null) {
    return '手动执行'
  }
}

export function formatDuration (value) {
  if (value) {
    if (value < 60) {
      return `${value}s`
    } else if (value >= 60 && value < 3600) {
      const min = parseInt(value / 60)
      const seconds = value - (min * 60)
      return `${min}m${seconds}s`
    } else if (value >= 3600) {
      const hour = parseInt(value / 3600)
      const min = parseInt((value - (hour * 3600)) / 60)
      const seconds = value - (hour * 3600) - (min * 60)
      return `${hour}h${min}m${seconds}s`
    }
  } else {
    return ''
  }
}

export function timestampToTime (timestamp) {
  var date = new Date(timestamp)
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  var h = date.getHours() + ':'
  var m = date.getMinutes() + ':'
  var s = date.getSeconds()
  return Y + M + D + h + m + s
}

// 转换 年月日显示
export function getNextDate (date, day) {
  var dd = new Date(date) // '2022-10-11' 转换为中国标准时间
  console.log('测试', dd)
  dd.setDate(dd.getDate() + day)
  var y = dd.getFullYear()
  var m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1
  var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()
  return y + '年' + m + '月' + d + '日'
}

// 转换 年月日时秒分显示
export function getNextDateTwo (time) {
  var date = new Date(time)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  var d = date.getDate()
  d = d < 10 ? ('0' + d) : d
  var h = date.getHours()
  h = h < 10 ? ('0' + h) : h
  var minute = date.getMinutes()
  minute = minute < 10 ? ('0' + minute) : minute
  var s = date.getSeconds()
  s = s < 10 ? ('0' + s) : s
  return y + '年' + m + '月' + d + '日' + '' + h + ':' + minute + ':' + s
}

// 转换 年月日时秒分显示
export function getNextDateTest (time) {
  var date = new Date(time)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? ('0' + m) : m
  return y + '年' + m + '月'
}
