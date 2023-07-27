import { cloneDeep } from 'lodash'

// 获取对象的第一个元素
export function set16ToRgb (str) {
  let i
  const reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
  if (!reg.test(str)) { return }
  let newStr = (str.toLowerCase()).replace(/#/g, '')
  const len = newStr.length
  if (len === 3) {
    let t = ''
    for (i = 0; i < len; i++) {
      t += newStr.slice(i, i + 1).concat(newStr.slice(i, i + 1))
    }
    newStr = t
  }
  const arr = [] // 将字符串分隔，两个两个的分隔
  for (i = 0; i < 6; i = i + 2) {
    const s = newStr.slice(i, i + 2)
    arr.push(parseInt('0x' + s))
  }
  return arr
}

export function formatDate (str) {
  /*
    replace第一个参数正则
    (?<=\/|-|\.|:|\b)\d{1}  用的是后顾，查找 / 或者 - 或者 . 或者 : 或者 单词边界 或者 T 后面的一个数字
    \d{1}(?=\/|-|\.|:|\b)   用的是前瞻，查找 / 或者 - 或者 . 或者 : 或者 单词边界  或者 T 前面的一个数字
    replace 第二个参数"0$&" 匹配到的字符串前置补0
*/
  return str.replace(/(?<=\/|-|\.|:|\b|T)\d{1}(?=\/|-|\.|:|\b|T)/g, '0$&')
}

/**
 * 密码强度检验
 */
export function passwordStrength (str) {
  let score = 0
  const pwdArr = str.split('')
  if (pwdArr.length > 8) {
    score += 25
  } else if (pwdArr.length > 4 && pwdArr.length <= 7) {
    score += 15
  }
  if (pwdArr.some(item => { return /^[a-z]$/.test(item) })) {
    if (pwdArr.some(item => { return /^[A-Z]$/.test(item) })) {
      score += 20
    } else {
      score += 15
    }
  } else if (pwdArr.some(item => { return /^[A-Z]$/.test(item) })) {
    score += 5
  }

  if (pwdArr.some(item => { return /^[0-9]$/.test(item) })) {
    let count = 0
    pwdArr.forEach(item => {
      if (/^[0-9]$/.test(item)) {
        count++
      }
    })
    if (count > 5) {
      score += 25
    } else {
      score += 10
    }
  }
  if (pwdArr.some(item => { return /^[\^%&'*.,;=+\-?@#》《><!$\x22]$/.test(item) })) {
    let count = 0
    pwdArr.forEach(item => {
      if (/^[\^%&'*.,;=+\-?@#!$\x22]$/.test(item)) {
        count++
      }
    })
    if (count > 3) {
      score += 25
    } else {
      score += 20
    }
  }
  let level = 0
  if (score < 25) {
    level = 1
  } else if (score >= 25 && score < 50) {
    level = 1
  } else if (score >= 50 && score < 60) {
    level = 2
  } else if (score >= 60 && score < 70) {
    level = 2
  } else if (score >= 70 && score < 80) {
    level = 3
  } else if (score >= 86 && score < 90) {
    level = 4
  } else {
    level = 4
  }
  return level
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return timeStr
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime (time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * 格式化后端传递过来的时间字符，如：2020-11-27T12:01:50.942 00:000
 * @param {String} string
 */
export function formatterDate (originVal) {
  if (originVal === '') {
    return originVal
  } else {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    // 月份从0开始,使她变成字符串,不足两位时,前面补个0.
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
}

/**
 * 解决antv/g2 宽度自适应问题
 */
export function antvChartWidthAdaption () {
  const e = document.createEvent('Event')
  e.initEvent('resize', true, true)
  window.dispatchEvent(e)
}

export function parseColumnToDict (column) {
  const columnDict = {}
  column.forEach(item => {
    columnDict[item.colKey] = item.title
  })
  return columnDict
}

export function parseColumnToForm (column) {
  const columnDict = {}
  column.forEach(item => {
    columnDict[item.colKey] = ''
  })
  return columnDict
}

export function parseColumnToDetail (column) {
  const columnList = [
    { label: '全选', checkAll: true }
  ]
  column.forEach(item => {
    const columnDict = {}
    columnDict.label = item.title
    columnDict.value = item.colKey
    columnList.push(cloneDeep(columnDict))
  })
  return columnList
}

export function convertStorage (str) {
  // num和str类型 取整后 统一转为 str
  const string = parseInt(str).toString()
  if (string.length > 10) {
    const num = ~~((+parseInt(string) || 0) / 1024 / 1024)
    return num.toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ',')) + ' Tb'
  } else if (string.length > 7) {
    const num = ~~((+parseInt(string) || 0) / 1024)
    return num.toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ',')) + ' Gb'
  } else if (string.length < 4) {
    const num = ~~((+parseInt(string) || 0) / 1024)
    return num.toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ',')) + ' Kb'
  } else {
    return (+parseInt(string) || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ',')) + ' Mb'
  }
}

export function getCurrentDate () {
  const vWeek = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const date = new Date()
  return {
    // dateTime: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    week: vWeek[date.getDay()]
  }
}

/**
 * @param {Function} fn 防抖函数
 * @param {Number} delay 延迟时间
 */
export function debounce (fn, delay) {
  var timer
  return function () {
    var context = this
    var args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

/**
*判断对象是否是一个纯粹的对象
*/
function isPlainObject (obj) {
  return typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Object]'
}

/**
*深度合并多个对象的方法
*/
export function deepMerge () {
  const len = arguments.length; let target = arguments[0]
  if (!isPlainObject(target)) {
    target = {}
  }
  for (let i = 1; i < len; i++) {
    const source = arguments[i]
    if (isPlainObject(source)) {
      for (const s in source) {
        if (s === '__proto__' || target === source[s]) {
          continue
        }
        if (isPlainObject(source[s])) {
          target[s] = deepMerge(target[s], source[s])
        } else {
          target[s] = source[s]
        }
      }
    }
  }
  return target
}

export function observerDomResize (dom, callback) {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

  const observer = new MutationObserver(callback)

  observer.observe(dom, { attributes: true, attributeFilter: ['style'], attributeOldValue: true })

  return observer
}

/**
*获取前几天的日期
*/
export function getBeforeDate (num) {
  var n = num
  var d = new Date()
  var year = d.getFullYear()
  var mon = d.getMonth() + 1
  var day = d.getDate()
  if (day <= n) {
    if (mon > 1) {
      mon = mon - 1
    } else {
      year = year - 1
      mon = 12
    }
  }
  d.setDate(d.getDate() - n)
  year = d.getFullYear()
  mon = d.getMonth() + 1
  day = d.getDate()
  var s = year + '-' + (mon < 10 ? ('0' + mon) : mon) + '-' + (day < 10 ? ('0' + day) : day)
  return s
}
