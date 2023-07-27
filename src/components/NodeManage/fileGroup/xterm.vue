<template>
  <div>
    <div id='xterm' style="width: 100%; height: 100%; display: block" />
  </div>
</template>

<script>
import { getWSURL } from '@/utils/inops/u'
import { connection2nodeAPI, closeAPI, resizePtyAPI } from '@/api/inops/jobNode/webssh'
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
export default {
  name: 'Xterm',
  data () {
    return {
      nodeId: '',
      success: '',
      code: ''
    }
  },
  props: {
    sshId: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  computed: {
  },
  watch: {
    sshId: {
      handler (newVal) {
        if (newVal !== '') {
          this.nodeConcat()
        }
      },
      deep: true
    }
  },
  mounted () {
  },
  methods: {
    async nodeConcat () {
      await connection2nodeAPI(this.sshId).then(res => {
        const { data } = res
        this.nodeId = data.data
        this.success = data.message
        this.code = data.code
        this.$nextTick(() => {
          this.initTerm()
          this.initSocket()
        })
        setTimeout(() => {
          this.fitAddon.fit()
        }, 60)
      })
      const terminalContainer = document.getElementById('xterm')
      const width = terminalContainer.parentElement.clientWidth
      const height = terminalContainer.parentElement.clientHeight
      const params = {
        cols: 120,
        rows: this.term.rows,
        width: width,
        height: height
      }
      await resizePtyAPI(this.nodeId, params).then(res => {
        const { data } = res
        console.log('ssh会话尺寸调整', data)
      })
    },
    initTerm () {
      const term = new Terminal({
        rendererType: 'dom', //  渲染类型
        convertEol: true, //  启用时，光标将设置为下一行的开头
        scrollback: 50, //  终端中的回滚量
        disableStdin: false, //  是否应禁用输入
        cursorStyle: 'underline', //  光标样式
        cursorBlink: true, //  光标闪烁
        windowsMode: false,
        theme: {
          foreground: 'yellow',
          background: '#060101',
          cursor: 'help'
        }
      })
      this.term = term
      const that = this
      const fitAddon = new FitAddon()
      this.term.loadAddon(fitAddon)
      this.fitAddon = fitAddon
      const element = document.getElementById('xterm')
      term.open(element)
      // 自适应大小(使终端的尺寸和几何尺寸适合于终端容器的尺寸)，初始化的时候宽高都是对的
      term.focus()
      //  监视命令行输入
      this.term.onData(function (data) {
        let dataWrapper = data
        if (dataWrapper === '\r') {
          dataWrapper = '\n'
        } else if (dataWrapper === '\u0003') {
          // 输入ctrl+c
          dataWrapper += '\n'
        }
        const sendData = {
          heartbeat: false,
          data: data
        }
        // 将输入的命令通知给后台，后台返回数据。
        that.socket.send(JSON.stringify(sendData))
      })
    },
    async onTerminalResize () {
      const terminalContainer = document.getElementById('xterm')
      // const width = terminalContainer.parentElement.clientWidth
      const height = terminalContainer.parentElement.clientHeight
      const { term } = this
      // 计算cols，rows
      const cols = 120
      const rows = height / term._core._renderService._renderer.dimensions.actualCellHeight
      this.term.resize(
        cols,
        parseInt(rows.toString(), 10)
      )
    },
    initSocket () {
      this.socket = new WebSocket(getWSURL(this.nodeId, 'webterminal'))
      this.socketOnOpen()
      this.socketOnmessage()
      this.socketOnClose()
      this.socketOnError()
    },
    socketOnOpen () {
      this.socket.onopen = () => {
        console.log('链接成功')
        if (this.code !== 200) {
          this.term.write(this.success)
          this.onTerminalResize()
        }
        // 链接成功后
        // this.initTerm()
      }
    },
    socketOnmessage () {
      this.socket.onmessage = (evt) => {
        const msg2 = JSON.parse(evt.data)
        const closed = msg2.closed
        if (closed) {
          this.term.write('链接已关闭')
          this.onTerminalResize()
        } else {
          // 将返回的数据写入xterm，回显在webshell上
          this.term.write(msg2.message)
          this.onTerminalResize()
        }
      }
    },
    socketOnClose () {
      this.socket.onclose = () => {
        console.log('关闭 socket')
        this.socket.close()
      }
    },
    async closeSsh () {
      this.socket.close()
      this.term && this.term.dispose()
      await closeAPI(this.nodeId).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '远程连接已关闭', placement: 'center' })
        }
      })
      this.socketOnClose()
      window.removeEventListener('resize', this.onTerminalResize)
    },
    socketOnError () {
      this.socket.onerror = () => {
        console.log('socket 链接失败')
      }
    }
  }
}
</script>
<style lang='sass' scoped>
</style>
