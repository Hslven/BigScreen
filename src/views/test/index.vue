<template>
  <div class="bg-mod-card" style="padding: 15px">
    <t-button class="mr-5" theme="primary" @click="connect2Node">连接</t-button>
    <t-dialog v-if="dialog" header="terminal测试"  placement="center" width="80%" preventScrollThrough  :visible.sync="dialog" :footer="false">
      <div id="termId" style="height: 650px; width: 100%; white-space: pre-wrap"></div>
      <t-row justify="end">
        <t-button class="mr-5" theme="primary" @click="resizeTerminal">重置大小</t-button>
      </t-row>
    </t-dialog>
<!--    <t-dialog v-if="v" header="terminal测试"  placement="center" width="80%" preventScrollThrough  :visible.sync="v" :footer="false">-->
<!--      <div id="termId" style="height: 650px; width: 100%; white-space: pre-wrap">123123</div>-->
<!--    </t-dialog>-->
  </div>
</template>

<script>

import { getWSURL } from '@/utils/inops/u'
import { connection2nodeAPI, closeAPI } from '@/api/inops/jobNode/webssh'
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
export default {
  name: 'index',
  data () {
    return {
      // nodeId: '306c49b81ed111eeb019000c292ed594',
      nodeId: '10f23efa0ba044db823eb01885682349',
      dialog: false,
      v: true,
      terminal: null,
      fitAddon: null,
      intervalId: null,
      ws: null,
      wsId: '',
      isClose: false
    }
  },
  watch: {
    dialog: {
      handler (newVal) {
        if (!newVal) {
          this.terminal.dispose()
          this.closeConnection()
          // window.removeEventListener('resize', () => {
          //   this.fitAddon.fit()
          //   this.terminal.scrollToBottom()
          // })
        }
      }
    }
  },
  destroyed () {
    this.closeConnection()
  },
  mounted () {
    // this.connect2Node()
  },
  methods: {
    connect2Node () {
      connection2nodeAPI(this.nodeId).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.wsId = data.data
          this.dialog = true
          this.$nextTick(() => {
            this.initTerm()
            this.initws(data.data)
          })
        }
      })
    },
    initTerm () {
      const element = document.getElementById('termId')
      this.terminal = new Terminal({
        rendererType: 'dom', // 渲染类型：dom / canvas
        disableStdin: false, // 禁止输入
        windowsMode: true, // 根据窗口换行
        convertEol: true, // 光标设置为下一行开头
        cursorBlink: true, // 光标闪烁
        cursorStyle: 'block', // 光标类型 underline block bar
        scrollback: 50, // 回滚行数
        theme: {
          foreground: '#ffffff', // 字体
          background: '#000000', // 背景色
          cursor: 'help'// 设置光标
        }
      })
      this.fitAddon = new FitAddon()
      this.terminal.loadAddon(this.fitAddon)
      this.terminal.open(element)
      this.terminal.focus()
      this.terminal.onData(data => {
        if (!this.isClose) {
          const sendData = {
            // id: this.wsId,
            heartbeat: false,
            // type: 'webssh',
            data: data
          }
          this.ws.send(JSON.stringify(sendData))
        } else {
          this.terminal.write('\r\n设备已登出，请重新登录。')
        }
      })
      this.$nextTick(() => {
        this.fitAddon.fit()
        this.terminal.resize(80, this.terminal.rows)
      })
      // window.addEventListener('resize', () => {
      //   this.terminal.loadAddon(this.fitAddon)
      //   this.fitAddon.fit()
      //   this.terminal.scrollToBottom()
      //   this.terminal.resize(100, this.terminal.rows)
      // })
    },
    initws (id) {
      this.ws = new WebSocket(getWSURL(id, 'webterminal'))
      this.ws.onopen = this.onOpen
      this.ws.onmessage = this.onMessage
      this.ws.error = (e) => {
        this.onError(e)
      }
      this.ws.onclose = (e) => {
        this.onClose(e)
      }
      this.intervalId = setInterval(() => {
        this.ws.send(JSON.stringify({ heartbeat: true }))
      }, 5 * 60 * 1000)
    },
    onOpen (e) {
      this.intervalId = setInterval(() => {
        this.ws.send(JSON.stringify({ heartbeat: true }))
      }, 5 * 60 * 1000)
    },
    /**
     * webscoket接收消息
     * @param e
     */
    onMessage (e) {
      const eData = JSON.parse(e.data)
      if (eData.success) {
        if (eData.closed) {
          this.isClose = eData.closed
          this.terminal.write('\r\n设备已登出，请重新登录。')
          clearInterval(this.intervalId)
        } else {
          this.terminal.write(eData.message)
        }
      } else {
        this.$message.error({ content: '连接失败', placement: 'center' })
        this.closeConnection()
        clearInterval(this.intervalId)
      }
    },
    /**
     * websocket 错误事件
     * @param e
     */
    onError (e) {
      console.log(e)
      console.log(`websocket异常: ${e.code}  ${e.reason}  ${e.wasClean} `)
      clearInterval(this.intervalId)
    },
    /**
     * websocket断开连接
     * @param e
     */
    onClose (e) {
      console.log(e)
      clearInterval(this.intervalId)
    },
    closeConnection () {
      closeAPI(this.wsId).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '已关闭连接', placement: 'center' })
        }
      })
    },
    resizeTerminal () {
      this.terminal.resize(90, this.terminal.rows)
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-dialog__body
  max-height: 850px !important
</style>
