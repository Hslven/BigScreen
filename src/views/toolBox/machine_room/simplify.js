// 比较两个数组是否前缀相同
function arraysEqual (a, b) {
  let flag = true
  if (a.length === b.length) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        flag = false
      }
    }
  } else {
    flag = false
  }
  return flag
}
// 判断数组是否连续并拆分
function splitArray (arr) {
  const result = []
  let tempArr = []
  for (let i = 0; i < arr.length; i++) {
    if (i === 0 || arr[i] - arr[i - 1] === 1) {
      // 数组连续
      tempArr.push(arr[i])
    } else {
      // 数组不连续
      result.push(tempArr)
      tempArr = [arr[i]]
    }
  }
  // 处理最后一个子数组
  result.push(tempArr)
  return result
}
// 快速排序
function quickSort (arr) {
  if (arr.length <= 1) {
    return arr
  }
  const pivot = arr[0]
  const left = []
  const right = []
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return [...quickSort(left), pivot, ...quickSort(right)]
}
// 简化函数
export function simplifyName (arr, mark) {
  const newArr = arr.map(item => item.split('-'))
  const group = [] // 前缀分组结果
  const groupData = [] // 最后分组数据
  newArr.reduce((prev, cur, index, arr) => {
    let flag = true
    for (const element of group) {
      if (arraysEqual(cur.slice(0, cur.length - 1), element)) {
        flag = false
      }
    }
    if (flag) {
      group.push(cur.slice(0, cur.length - 1))
    }
    return cur
  })
  // 根据group分组并排序
  for (const element of group.sort()) {
    let temp = []
    for (let j = 0; j < newArr.length; j++) {
      if (arraysEqual(newArr[j].slice(0, newArr[j].length - 1), element)) {
        temp.push(parseInt(newArr[j][newArr[j].length - 1]))
      }
      if (j === newArr.length - 1) {
        // 排序
        temp = quickSort(temp)
        // 排序后判断是否连续
        temp = splitArray(temp)
        // 添加前缀分组
        temp.push(element.join('-'))
        groupData.push(temp)
      }
    }
  }
  const result = []
  for (const element of groupData) {
    for (let j = 0; j < element.length; j++) {
      if (j !== element.length - 1) {
        if (mark !== 'shorthand') {
          if (element[j].length === 1) {
            result.push(element[element.length - 1] + '-' + element[j][0])
          } else {
            result.push(element[element.length - 1] +
                      '-' + element[j][0] +
                      '~' + element[j][element[j].length - 1])
          }
        } else {
          if (element[j].length === 1) {
            result.push(element[element.length - 1].substring(20) + '-' + element[j][0])
          } else {
            result.push(element[element.length - 1].substring(20) +
                      '-' + element[j][0] +
                      '~' + element[j][element[j].length - 1])
          }
        }
      }
    }
  }
  return result
}
