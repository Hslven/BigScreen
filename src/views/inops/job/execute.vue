<template>
  <div>
    <div style="background-color:  rgba(242, 243, 245, 1)">
      <t-row align="center">
        <t-button variant="text" style="margin-right: 10px">
          <t-row align="center">
            <mod-icon class="mr-1" name="arrow_back_ios" style="color: rgba(38, 110, 255, 1)"></mod-icon>
            <span style="color:rgba(38, 110, 255, 1);" @click="back">返回</span>
          </t-row>
        </t-button>
        <span style="font-size: 14px; font-weight: 400; color: rgba(177, 177, 177, 1)">功能指令/脚本执行</span>
      </t-row>
    </div>
    <div class="bg-mod-card" style="margin-top: 16px; padding: 22px 34px">
      <t-row>
        <t-col :md="8" :sm="6">
          <div>
            <span style="margin-right: 10px"><span style="font-size: 20px; font-weight: 700">{{ transProgress }}</span>通过</span>
            <span v-show="isFinish">已通过<span style="font-size: 20px; font-weight: 700">{{ countInfo[0].sum }}</span>/{{ countInfo[0].sum + countInfo[1].sum + countInfo[2].sum }}</span>
          </div>
          <div style="margin-top: 10px">
            <t-progress theme="plump" :percentage="paroProgress" :label="ture" />
          </div>
        </t-col>
        <t-col :offset="1" :md="3" :sm="5">
          <t-row style="padding-top: 2px">
            <t-col :span="4" align="center" v-for="(item, index) in countInfo" :key="index">
              <div style="font-size: 24px; font-weight: 700;">{{ item.sum}}</div>
              <div style="margin-top: 11px">{{ item.name}}</div>
            </t-col>
          </t-row>
        </t-col>
      </t-row>
    </div>
    <div class="bg-mod-card" style="margin-top: 20px; padding: 20px 16px">
      <t-row>
        <div style="margin-right: 60px">
          <div style="font-size: 12px; font-weight: 400; color: rgba(102, 102, 102, 1)">作业名称</div>
          <div style="font-size: 14px; font-weight: 400; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ info.name }}</div>
        </div>
        <div style="margin-right: 60px">
          <div style="font-size: 12px; font-weight: 400; color: rgba(102, 102, 102, 1)">脚本类型</div>
          <div style="font-size: 14px; font-weight: 400">{{ info.type }}</div>
        </div>
        <div style="margin-right: 60px">
          <div style="font-size: 12px; font-weight: 400; color: rgba(102, 102, 102, 1)">开始时间</div>
          <div style="font-size: 14px; font-weight: 400">{{ info.startTime }}</div>
        </div>
        <div style="margin-right: 60px">
          <div style="font-size: 12px; font-weight: 400; color: rgba(102, 102, 102, 1)">结束时间</div>
          <div style="font-size: 14px; font-weight: 400">{{ info.endTime }}</div>
        </div>
      </t-row>
      <t-divider style="margin-top: 21px; margin-bottom: 20px"></t-divider>
      <t-row>
        <t-col :md="4" :sm="6" :xs="6" >
          <t-radio-group default-value="" v-model="condition.execType">
            <t-radio-button v-for="(item, index) in condition.execList" :key="index" :value="item.value">{{ item.label }}</t-radio-button>
          </t-radio-group>
        </t-col>
        <t-col :md="8" :sm="6" :xs="6" >
          <t-row justify="end" align="center">
            <span style="margin-right: 26px">设备名称或IP</span>
            <t-input v-model.trim="condition.value" clearable style="width: 316px; margin-right: 30px"></t-input>
            <t-dropdown
              class="mr-5"
              trigger="click"
              :options="[{ content: 'Excel格式', value: 'excel' }, { content: 'TXT格式', value: 'txt' }]"
              @click="(data) => { downLoad(data, info.jobId) }"
            >
              <t-button variant="outline" theme="default">
                <t-row align="center">
                  <svg-icon class="mr-2" color="rgba((80, 89, 104, 1)" name="export"></svg-icon>
                  <span style="color: rgba(80, 89, 104, 1)">导出数据</span>
                </t-row>
              </t-button>
            </t-dropdown>
          </t-row>
        </t-col>
      </t-row>
      <t-row>
        <t-col :span="6">
          <div style="margin-top: 15px">
            <t-table
              hover resizable bordered
              row-key="id"
              size="small"
              table-layout="fixed"
              cell-empty-content="-"
              height="460"
              :empty="table.empty"
              :data="table.data"
              :columns="table.column"
              :loading="table.loading"
              style="font-size: 12px"
            >
              <template #status="{ row }">
                <t-tag style="color: #ffffff" :style="{ backgroundColor: statusMapper[row.status].color}">{{ statusMapper[row.status].text }}</t-tag>
              </template>
              <template #detailMsg="{ row }">
                <span @click="showMsg(row.detailMsg)" style="text-decoration: underline; cursor: pointer;">{{ row.detailMsg }}</span>
              </template>
              <template #orgMsg="{ row }">
                <span @click="showMsg(row.orgMsg)" style="text-decoration: underline; cursor: pointer;">{{ row.orgMsg }}</span>
              </template>
            </t-table>
          </div>
          <div style="margin-top: 15px">
            <t-pagination
              v-model="pages.current"
              show-sizer
              show-jumper
              size="small"
              :total="pages.total"
              :page-size.sync="pages.size"
              :page-size-options="pages.list"
              @change="handPages"
            />
          </div>
        </t-col>
        <t-col :span="6">
          <div id="scroll" style="background-color: #000000; padding: 15px; margin-top: 15px; height: 500px; overflow-y: auto; white-space: pre-wrap">
            <div v-for="(item, index) in wsMes" :key="index">
              <t-row align="center" style="color: #ffffff;">
                <span class="mr-5">设备名称</span>
                <span>{{ item.hostName }}</span>
              </t-row>
              <t-row align="center" style="color: #ffffff;">
                <span class="mr-5">设备IP</span>
                <span>{{ item.hostIp }}</span>
              </t-row>
              <t-row align="top" style="color: #ffffff;">
                <span class="mr-5">结果详情</span>
                <span>{{ item.detailMsg }}</span>
              </t-row>
              <t-row align="top" style="color: #ffffff;">
                <span class="mr-5">日志详情</span>
                <span>{{ item.orgMsg }}</span>
              </t-row>
              <t-divider style="margin-top: 8px; margin-bottom: 8px"></t-divider>
            </div>
          </div>
        </t-col>
      </t-row>
    </div>
    <t-dialog v-if="dialog.info" preventScrollThrough destroyOnClose placement="center" width="640px" header="结果详情" :footer="false" :visible.sync="dialog.info">
      <div class="scrollbar-style msg">
        <pre>{{ orgMsg }}</pre>
      </div>
      <t-divider></t-divider>
      <t-row justify="end">
        <t-button variant="text" theme="primary" @click="dialog.info = false">退出</t-button>
      </t-row>
    </t-dialog>
  </div>
</template>

<script>
import { onDownTResult } from '@/utils/inops/file'
import { getWSURL, objectDistinct, pageList } from '@/utils/inops/u'
export default {
  name: 'execute',
  props: {
    tab: {
      type: String,
      default: ''
    },
    obj: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      // 状态文本映射
      statusMapper: {
        ok: {
          color: '#008858',
          text: '成功'
        },
        failed: {
          color: '#E33092',
          text: '失败'
        },
        unreachable: {
          color: '#ED9B1F',
          text: '无法连接'
        }
      },
      height: 0, // 高度
      progress: 0, // 进度条
      oldTaskId: '', // 旧任务id
      intervalId: '', // 定时器id
      ws: null, // websocket
      info: {
        jobId: '',
        name: '',
        type: '',
        startTime: '-',
        consuming: '-',
        endTime: '-'
      }, // 执行信息
      wsMes: [], // websocket消息
      dataList: [
        { label: 'hostName', value: '设备名称' },
        { label: 'hostIp', value: '设备IP' },
        { label: 'status', value: '执行状态' },
        { label: 'detailMsg', value: '结果描述' },
        { label: 'orgMsg', value: '日志详情' }
      ], // 数据字段映射
      countInfo: [
        {
          label: 'ok',
          name: '执行成功',
          sum: 0,
          color: 'text-positive'
        },
        {
          label: 'fail',
          name: '执行失败',
          sum: 0,
          color: 'text-negative'
        },
        {
          label: 'unreachable',
          name: '无法连接',
          sum: 0,
          color: 'text-warning'
        }
      ], // 统计数据
      condition: {
        execType: '',
        execList: [
          { label: '所有结果', value: '' },
          { label: '执行成功', value: 'ok' },
          { label: '执行失败', value: 'failed' },
          { label: '无法连接', value: 'unreachable' }
        ],
        type: 'hostName',
        value: ''
      }, // 查询条件
      table: {
        ref: 'tbInfo',
        empty: '暂无脚本执行情况',
        loading: false,
        data: [],
        infoData: [],
        column: [
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'hostName', title: '设备名称', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'hostIp', title: '设备IP', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'detailMsg', title: '结果描述', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'orgMsg', title: '日志详情', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'status', title: '执行状态', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true }
        ]
      }, // 表格
      pages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 30,
        align: 'right'
      }, // 分页
      isFinish: false, // 是否结束
      dialog: {
        info: false
      }, // 弹窗
      orgMsg: '',
      url: ''
    }
  },
  computed: {
    // 进度条转换
    transProgress () {
      return (this.progress * 100).toFixed(2) + '%'
      // const progressmum = this.countInfo[0].sum + this.countInfo[1].sum + this.countInfo[2].sum
      // if (this.countInfo[0].sum === 0) {
      //   return (this.countInfo[0].sum * progressmum).toFixed(2) + '%'
      // } else {
      //   return ((this.countInfo[0].sum / progressmum) * 100).toFixed(2) + '%'
      // }
    },
    paroProgress () {
      return (this.progress * 100).toFixed(2)
    }
  },
  watch: {
    'condition.execType': {
      handler (newVal) {
        if (newVal) {
          this.table.data = this.wsMes.filter(item => {
            return item.status.indexOf(this.condition.execType) > -1
          })
        } else {
          this.table.data = this.wsMes
        }
        this.handPages({ currentPage: 1, pageSize: 10 })
      },
      deep: true
    },
    'condition.value': {
      handler (newVal) {
        if (newVal) {
          const hostNameList = this.wsMes.filter(item => {
            return item.hostName.indexOf(this.condition.value) > -1
          })
          const hostIpList = this.wsMes.filter(item => {
            return item.hostIp.indexOf(this.condition.value) > -1
          })
          const list = [...hostNameList, ...hostIpList]
          this.table.data = objectDistinct(list, 'id')
        } else {
          this.table.data = this.wsMes
        }
        this.handPages({ current: 1, pageSize: 10 })
      }
    }
  },
  activated () {
    this.setData()
    this.isNewData()
  },
  deactivated () {
    clearInterval(this.intervalId)
    this.onClose()
  },
  methods: {
    /**
     * 返回
     */
    back () {
      this.$emit('update:tab', 'online')
    },
    /**
     * 获取信息
     */
    getInfo () {
      if (this.condition.value) {
        if (this.condition.type === 'hostName') {
          this.table.data = this.wsMes.filter(item => {
            return item.hostName.indexOf(this.condition.value) > -1
          })
        } else if (this.condition.type === 'hostIp') {
          this.table.data = this.wsMes.filter(item => {
            return item.hostIp.indexOf(this.condition.value) > -1
          })
        }
      }
      this.handPages({ currentPage: 1, pageSize: 10 })
    },
    /**
     * 判断是否为新执行
     */
    isNewData () {
      if (this.obj.isNew) {
        this.initData()
        this.initws(this.obj.taskId)
      }
    },
    /**
     * data设置
     */
    setData () {
      const { name, type } = this.obj
      this.info.name = name
      this.info.type = type
    },
    /**
     * 初始化数据
     */
    initData () {
      this.countInfo[0].sum = 0
      this.countInfo[1].sum = 0
      this.countInfo[2].sum = 0
      this.progress = 0
      this.progressCount = 0
      this.wsMes = []
      this.table.infoData = []
      this.table.data = []
      this.info = Object.assign(this.info, { jobId: '', startTime: '-', endTime: '-', consuming: '-' })
      this.isFinish = false
      this.condition.execType = ''
      this.condition.value = ''
      this.pages.total = 0
    },
    /**
     * 初始化websocket
     * @param id 任务id
     */
    initws (id) {
      this.table.loading = true
      this.wsMes = []
      this.ws = new WebSocket(getWSURL(id, 'taskresult'))
      this.ws.onopen = this.onOpen
      this.ws.onmessage = this.onMessage
      this.ws.error = (e) => {
        this.onError(e)
      }
      this.ws.onclose = (e) => {
        this.onClose(e)
      }
    },
    /**
     * 分页
     * @param current 当前页
     * @param pageSize 页大小
     */
    handPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.table.infoData = this.table.data.slice((this.pages.current - 1) * this.pages.size, this.pages.current * this.pages.size)
    },
    /**
     * websocket 开启连接
     * @param e
     */
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
      this.table.loading = false
      const data = JSON.parse(e.data)
      this.info.jobId = this.info.jobId ? this.info.jobId : data.jobId
      const floatNum = data.progress.toFixed(3)
      this.progress = Number(floatNum.substring(0, floatNum.length - 1))
      this.setInfo(data)
      const scroll = document.getElementById('scroll')
      this.$nextTick(() => {
        scroll.scrollTop = scroll.scrollHeight
      })
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
      clearInterval(this.intervalId)
    },
    /**
     * 处理websocket接收消息
     * @param data
     */
    setInfo (data) {
      if (data.resultType !== 'play_summary') {
        const { id, detailMsg, hostIp, hostName, orgMsg, progress, status } = data
        const obj = { id, detailMsg, hostIp, hostName, orgMsg, progress, status }
        if (this.info.startTime === '-') {
          this.info.startTime = data.startTime
        }
        this.wsMes.push(obj)
        this.table.data.push(obj)
        const list = JSON.parse(JSON.stringify(this.wsMes))
        this.pages.total = list.length
        if (this.pages.current === Math.ceil(list.length / this.pages.size)) {
          this.pages.current = Math.ceil(list.length / this.pages.size)
        }
        this.table.infoData = list.slice((this.pages.current - 1) * this.pages.size, this.pages.current * this.pages.size)
      } else {
        this.info.endTime = data.endTime
        this.info.consuming = data.duration / 1000 + '″'
        this.countInfo[0].sum = data.okCount
        this.countInfo[1].sum = data.failCount
        this.countInfo[2].sum = data.unreachableCount
        this.isFinish = true
      }
    },
    /**
     * 展示执行详情
     * @param value
     */
    showMsg (value) {
      this.orgMsg = value
      this.dialog.info = true
    },
    /**
     * 下载
     * @param data
     * @param id
     */
    downLoad (data, id) {
      const { value } = data
      onDownTResult(value, 'script', id)
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-progress--plump
  border-radius: 0px
  height: 11px
/deep/ .t-progress__inner
  border-radius: 0px
  background: rgba(43, 164, 113, 1)
/deep/ .t-drawer__body
  padding: 0px
/deep/ .t-divider--horizontal
  margin: 0px
/deep/ .scrollbar-style::-webkit-scrollbar
  /*滚动条整体样式*/
  width : 6px !important /*高宽分别对应横竖滚动条的尺寸*/
/deep/ .scrollbar-style::-webkit-scrollbar-thumb
  /*滚动条里面小方块*/
  border-radius: 5px !important
  background: #90caf9 !important
.msg
  color: #ffffff
  overflow-y: scroll
  height: 550px
  padding: 15px
pre
  white-space: pre-wrap
  white-space: -moz-pre-wrap
  white-space: -pre-wrap
  white-space: -o-pre-wrap
  word-wrap: break-word
/deep/ .t-dialog__body
  background-color: #000000
</style>
