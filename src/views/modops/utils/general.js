export function showPorts (ports, isShow) {
  for (let i = 0, len = ports.length; i < len; i = i + 1) {
    ports[i].style.visibility = isShow ? 'visible' : 'hidden'
  }
}
