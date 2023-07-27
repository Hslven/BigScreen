// 日期转换工具
// 当月或日小于10时  补0
function setZero (str) {
  return str < 10 ? '0' + str : str
}

// 日期格式化   YYYY-MM-DD
export function formatDate (time) {
  const date = new Date()
  date.setTime(time)
  let str = ''
  const list = []
  list.push(setZero(date.getFullYear()))
  list.push(setZero(date.getMonth() + 1))
  list.push(setZero(date.getDate()))
  str = list.join('-')
  return str
}

// 时间格式化 YYYY-MM-DD hh:mm:ss
export function formatTime (time) {
  const date = new Date()
  date.setTime(time)
  let str = ''
  const dateList = []
  dateList.push(setZero(date.getFullYear()))
  dateList.push(setZero(date.getMonth() + 1))
  dateList.push(setZero(date.getDate()))
  const timeList = []
  timeList.push(setZero(date.getHours()))
  timeList.push(setZero(date.getMinutes()))
  timeList.push(setZero(date.getSeconds()))
  str = dateList.join(('-')) + ' ' + timeList.join(':')
  return str
}

// 审批时间格式化 YYYY-MM-DD hh:mm:ss
export function approveTime (startTime, endTime) {
  const begin = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  const usedTime = end - begin
  // 计算小时数
  const leave1 = usedTime % (24 * 3600 * 1000)
  const hour2 = Math.floor(leave1 / (3600 * 1000))
  const leave2 = leave1 % (3600 * 1000)
  const minutes = Math.floor(leave2 / (60 * 1000))
  const time = hour2 + '小时' + minutes + '分钟'
  return time
}
