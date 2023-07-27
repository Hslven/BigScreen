export function unitTrans (value) {
  if (value < 1024) {
    return `${value.toFixed(2)} byte`
  } else if (value / 1024 < 1024) {
    return `${(value / 1024).toFixed(2)} k`
  } else if (value / 1024 / 1024 < 1024) {
    return `${(value / 1024 / 1024).toFixed(2)} M`
  } else if (value / 1024 / 1024 / 1024 < 1024) {
    return `${(value / 1024 / 1024 / 1024).toFixed(2)} G`
  }
}
