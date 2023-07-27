// 返回结果对象，对应配置任务中的字段
const result = {
  type: '',
  date: '',
  quart: '',
  week: '',
  month: '',
  isInterVal: false,
  timeWithSeconds: '',
  interVal: {
    start: '',
    end: '',
    duration: ''
  },
  text: ''
}

// 周字典
const weekDict =
  [{ label: '星期一', value: '2' },
    { label: '星期二', value: '3' },
    { label: '星期三', value: '4' },
    { label: '星期四', value: '5' },
    { label: '星期五', value: '6' },
    { label: '星期六', value: '7' },
    { label: '星期日', value: '1' }]

export function transToQuarts (str) {
  // 获取秒分时日月周
  const { seconds, min, hour, day, month, week } = splitStr(str)
  // 当分割长度等于7时，为仅执行一次（年月日 时分秒执行）
  if (str.split(' ').length === 7) {
    // 调用仅执行一次转译函数
    return quartYear(str.split(' ')[6], month, day, hour, min, seconds)
  } else {
    // 当day为*并且week为?时，为每天执行
    // 当day为?时，为梅州执行
    if (day === '*' && week === '?') {
      return quartDay(month, day, hour, min, seconds)
    } else if (day === '?') {
      return quartWeek(month, week, day, hour, min, seconds)
    } else if (month === '*') {
      return quartMonth(month, day, hour, min, seconds)
    }
  }
}

// 字符串分割函数
function splitStr (str) {
  const list = str.split(' ')
  const seconds = list[0]
  const min = list[1]
  const hour = list[2]
  const day = list[3]
  const month = list[4]
  const week = list[5]
  return { seconds, min, hour, day, month, week }
}

// '仅执行一次'转译函数
function quartYear (year, month, day, hour, min, seconds) {
  result.type = '0'
  result.date = `${year}-${month}-${day} ${hour}:${min}:${seconds}`
  result.text = `${year}年${month}月${day}日${hour}时${min}分${seconds}秒执行一次`
  return result
}

// '每天执行'转译函数
function quartDay (month, day, hour, min, seconds) {
  // 是否间隔执行文案
  const msg = min.split('/')[1] ? `每隔${min.split('/')[1]}分钟执行一次` : '每小时执行一次'
  // 是否包含'-'判断是否为间隔执行
  const index = hour.indexOf('-')
  result.type = '1'
  result.quart = 'onDay'
  if (index > -1) {
    result.isInterVal = true
    result.interVal.start = hour.split('-')[0]
    result.interVal.end = hour.split('-')[1]
    result.interVal.duration = min.split('/')[1] ? min.split('/')[1] : 60
    result.text = `每天${hour.split('-')[0]}时至${hour.split('-')[1]}时${msg}`
    console.log(result)
  } else {
    result.timeWithSeconds = `${hour}:${min}:${seconds}`
    result.text = `每天${hour}时${min}分${seconds}执行一次`
  }
  return result
}

// '每周执行'转译函数
function quartWeek (month, week, day, hour, min, seconds) {
  // 是否间隔执行文案
  const msg = min.split('/')[1] ? `每隔${min.split('/')[1]}分钟执行一次` : '每小时执行一次'
  const label = weekDict[weekDict.findIndex(item => item.value === week)].label
  // 是否包含'-'判断是否为间隔执行
  const index = hour.indexOf('-')
  result.type = '1'
  result.quart = 'onWeek'
  result.week = week
  if (index > -1) {
    result.isInterVal = true
    result.interVal.start = hour.split('-')[0]
    result.interVal.end = hour.split('-')[1]
    result.duration = min.split('/')[1] ? min.split('/')[1] : 60
    result.text = `每周${label}${hour.split('-')[0]}时至${hour.split('-')[1]}时${msg}`
  } else {
    result.timeWithSeconds = `${hour}:${min}:${seconds}`
    result.text = `每周${label}${hour}时${min}分${seconds}执行一次`
  }
  return result
}

// '每月执行'转译函数
function quartMonth (month, day, hour, min, seconds) {
  // 是否间隔执行文案
  const msg = min.split('/')[1] ? `每隔${min.split('/')[1]}分钟执行一次` : '每小时执行一次'
  // const label = day === 'L' ? { label: '最后一天', value: day } : { label: day, value: day }
  // 是否包含'-'判断是否为间隔执行
  const index = hour.indexOf('-')
  result.type = '1'
  result.quart = 'onMonth'
  result.month = day
  if (index > -1) {
    result.isInterVal = true
    result.interVal.start = hour.split('-')[0]
    result.interVal.end = hour.split('-')[1]
    result.duration = min.split('/')[1] ? min.split('/')[1] : 60
    result.text = day === 'L' ? `每月最后一天${hour.split('-')[0]}时至${hour.split('-')[1]}时${msg}` : `每月${day}日${hour.split('-')[0]}时至${hour.split('-')[1]}时${msg}`
  } else {
    result.timeWithSeconds = `${hour}:${min}:${seconds}`
    result.text = day === 'L' ? `每月最后一天${hour}时${min}分${seconds}执行一次` : `每月${day}日${hour}时${min}分${seconds}执行一次`
  }
  return result
}
