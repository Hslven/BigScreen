export function userFilter (value, update, list) {
  let dictList = []
  update(() => {
    const needle = value.toLowerCase()
    dictList = JSON.parse(JSON.stringify(list.filter(v => v.label.toLowerCase().indexOf(needle) > -1)))
  })
  return dictList
}

export function fieldFilter (event, type) {
  let dictList = []
  event[1](() => {
    const needle = event[0].toLowerCase()
    dictList = JSON.parse(window.localStorage.getItem(type)).filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
  return dictList
}
