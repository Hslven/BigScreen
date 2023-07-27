// 仅执行一次表达式
export function expreOfOnly (dateTime) {
  const date = dateTime.split(' ')[0]
  const time = dateTime.split(' ')[1]
  const year = date.split('-')[0]
  const month = date.split('-')[1]
  const day = date.split('-')[2]
  const hour = time.split(':')[0]
  const min = time.split(':')[1]
  const seconds = time.split(':')[2]
  return `${seconds} ${min} ${hour} ${day} ${month} ? ${year}`
}

// 周期执行表达式
export function expreOfCycle (mode, dateTime, week = null, day = null) {
  const hour = dateTime.split(':')[0]
  const min = dateTime.split(':')[1]
  const seconds = dateTime.split(':')[2]
  if (mode === 'day') {
    return `${seconds} ${min} ${hour} * * ?`
  } else if (mode === 'week') {
    return `${seconds} ${min} ${hour} ? * ${week}`
  } else if (mode === 'month') {
    return `${seconds} ${min} ${hour} ${day} * ?`
  }
}

// 间隔执行表达式
export function expreOfInterval (mode, startTime, endTime, duration, week = null, day = null) {
  const text = duration === '60' ? '0' : `0/${duration}`
  if (mode === 'day') {
    return `0 ${text} ${startTime}-${endTime} * * ?`
  } else if (mode === 'week') {
    return `0 ${text} ${startTime}-${endTime} ? * ${week}`
  } else if (mode === 'month') {
    return `0 ${text} ${startTime}-${endTime} ${day} * ?`
  }
}
