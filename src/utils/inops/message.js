import { Notify } from 'quasar'
// 全局函数
// 定义消息提出框
function message (position, type, message, timeout) {
  Notify.create({
    position,
    type,
    message,
    timeout,
    textColor: 'white',
    progress: true
  })
}

export default {
  message
}
