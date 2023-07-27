<template>
  <div class="p-4">
      <t-button @click="execute">send websocket</t-button>
  </div>
</template>

<script>
import { scriptCodeDebugAPI } from '@/api/inops/job/job'
import { getWSURL } from '@/utils/inops/u'

export default {
  name: 'ws',
  data () {
    return {
      prefixUrl: '',
      token: ''
    }
  },
  methods: {
    execute () {
      const data = require('./data.json')
      scriptCodeDebugAPI(data).then(res => {
        const { data } = res
        if (data.code === 200) {
          if (data.data.taskId) {
            this.initws(data.data.taskId)
          } else {
            this.$message.error(data.data.msg)
            this.executeWait = false
          }
        } else {
          this.$message.error('脚本执行失败')
        }
      })
    },
    initws (id) {
      this.ws = new WebSocket(getWSURL(id, 'taskresult'))
      this.ws.onmessage = this.onMessage
      this.ws.error = (e) => {
        this.onError(e)
      }
      this.ws.onclose = (e) => {
        this.onClose(e)
      }
    },
    onMessage (e) {
      const data = JSON.parse(e.data)
      console.log(data)
    },
    onError (e) {
      console.log(e)
      console.log(`websocket异常: ${e.code}  ${e.reason}  ${e.wasClean} `)
    },
    onClose (e) {
      console.log(e)
      console.log(`websocket关闭: ${e.code}  ${e.reason}  ${e.wasClean} `)
    }
  }
}
</script>

<style scoped>

</style>
