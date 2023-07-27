<template>
  <div>未替换为新UI</div>
  <!-- <base-content>
    <div class="q-pa-lg">
      <q-tabs
        v-model="tab"
        inline-label
        class="bg-primary text-white shadow-2"
        align="left"
      >
        <q-tab name="CMDB" icon="blur_on" label="CMDB设备" />
        <q-tab v-for="(item) in tabObj" :key="item.id" :name="item.name" :label="item.label" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated keep-alive>
        <q-tab-panel name="CMDB">
          <div class="row">
              <q-input
                v-model="formData.hostName"
                class="q-mr-md"
                dense
                outlined
                label="设备名称"
                style="width: 250px"
              />
              <q-select
                v-model="hostType"
                class="q-mr-md"
                dense
                outlined
                multiple
                label="设备类型"
                :options="dict.hostType"
                style="width: 250px"
              />
              <q-select
                v-model="formData.sysArea"
                class="q-mr-md"
                dense
                outlined
                label="所属区域"
                :options="dict.sysArea"
                style="width: 250px"
              />
              <q-btn class="q-mr-md" unelevated color="primary" label="查询" @click="submitEvent"/>
              <q-btn unelevated color="grey" label="重置" @click="resetEvent"/>
            </div>
          <div class="q-mt-lg" style="border-radius: 6px">
            <vxe-table
              ref="infoTable"
              id="infoTable"
              empty-text="暂无设备信息！"
              border="default"
              stripe
              auto-resize
              keep-source
              highlight-hover-row
              highlight-current-row
              highlight-hover-column
              highlight-current-column
              resizable
              max-height="500"
              size="mini"
              :loading="table.loading"
              :import-config="{}"
              :export-config="{}"
              :seq-config="{startIndex: (pages.currentPage - 1) * pages.pageSize }"
              :checkbox-config="{reserve: true}"
              :data="table.infoData"
              row-id = 'id'
            >
              <vxe-table-column v-for="(config, index) in table.column" :key="index" v-bind="config" :formatter="config.formatList ? ['formatField', dict[config.formatList]] : ''" />
              <vxe-table-column field="operation" title="操作" align="center">
                <template class="row" v-slot="{ row }">
                  <q-btn  flat dense color="primary" label="连接终端" icon="earbuds" size="sm" @click="execute(row)">
                  </q-btn>
                </template>
              </vxe-table-column>
            </vxe-table>
            <vxe-pager
              class="q-mt-md"
              background
              size="small"
              :current-page="pages.currentPage"
              :page-size="pages.pageSize"
              :total="pages.totalResult"
              :page-sizes="pages.pageSizeList"
              :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"
              @page-change="handlePageChange">
            </vxe-pager>
          </div>
        </q-tab-panel>
        <q-tab-panel class="q-pa-none" :class="item.fullScreen ? 'fullscreen': ''" v-for="(item) in tabObj" :key="item.id" :name="item.name" :style="{ height: item.fullScreen ? '100vh' : '70vh' }">
          <div class="row justify-end" style="height: 8%">
            <q-btn flat dense :icon="item.fullScreen ? 'fullscreen' : 'fullscreen_exit'" color="primary" @click="changeFullScreen">
              <q-tooltip>{{item.fullScreen ? '退出全屏' : '全屏'}}</q-tooltip>
            </q-btn>
            <q-btn flat dense icon="close" color="primary" @click="closeDev">
              <q-tooltip>关闭终端</q-tooltip>
            </q-btn>
          </div>
          <div class="bg-white text-black" :id="item.wsId" style="width: 100%; height: 92%;"/>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <q-dialog v-model="dialog" >
      <q-card style="width: 600px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">终端连接</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="dialogClose" />
        </q-card-section>
        <q-card-section>
          <div class="row items-center vertical-middle">
            <span class="q-mr-md">连接方式：</span>
            <q-select
              v-model="config.connectionType"
              dense
              outlined
              :options="connectionTypeOptions"
              style="width: 200px"
            />
          </div>
          <div class="row q-mt-lg items-center vertical-middle">
            <span>使用默认账号：</span>
            <q-toggle v-model="isDefaultNumber" dense/>
          </div>
          <div v-show="!isDefaultNumber" class="row q-mt-lg items-center vertical-middle">
            <span class="q-mr-md">用户名：</span>
            <q-input
              v-model="config.userName"
              dense
              outlined
              style="width: 300px"/>
          </div>
          <div v-show="!isDefaultNumber" class="row q-mt-lg items-center vertical-middle">
            <span class="q-mr-md">密码：</span>
            <q-input
              v-model="config.password"
              dense
              outlined
              type="password"
              style="width: 300px"/>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-primary">
          <q-btn flat label="连接终端" v-close-popup @click="connectionDev" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </base-content> -->
</template>

<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { listPageAPI } from '@/api/inops/CMDB/cmdbDevice'
import { getDictList, getWSURL } from '@/utils/inops/u'
import { connectionOSAPI, connectionBMCAPI, closeAPI } from '@/api/inops/webSsh/webssh'
export default {
  name: 'index',
  data () {
    return {
      dict: {
        resourcePool: [],
        hostRoom: [],
        hostType: [],
        hostMfgr: [],
        hostSource: [],
        sysArea: []
      },
      tab: 'CMDB',
      tabObj: [],
      hostType: [],
      formData: {
        hostName: '',
        hostType: '',
        sysArea: '',
        condition: {
          hostName: 'like',
          hostType: 'in',
          sysArea: 'eq'
        }
      },
      dialog: false,
      isDefaultNumber: true,
      connectionTypeOptions: [
        { label: '管理IP', value: 'os' },
        { label: '硬管IP', value: 'bmc' }
      ],
      config: {
        hostId: '',
        hostName: '',
        connectionType: { label: '管理IP', value: 'os' },
        userName: '',
        password: ''
      },
      table: {
        loading: false,
        infoData: [],
        column: [
          { id: 1, type: 'checkbox', align: 'center', width: '40' },
          { id: 2, type: 'seq', title: '序号', align: 'center', width: '60' },
          { id: 3, field: 'hostName', title: '设备名称', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          { id: 4, field: 'osIp', title: '管理IP', align: 'left', type: 'html', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          { id: 5, field: 'bmcIp', title: '硬管IP', align: 'left', type: 'html', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          { id: 6, field: 'projectPeriod', title: '工程期数', align: 'center', type: 'html', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          { id: 7, field: 'resourcePool', title: '资源池', formatList: 'resourcePool', align: 'center', type: 'html', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          { id: 8, field: 'hostRoom', title: '所属机房', formatList: 'hostRoom', align: 'center', type: 'html', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          // { id: 9, field: 'networkArea', title: '网络区域', align: 'center', type: 'html', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          { id: 10, field: 'sysArea', title: '归属', formatList: 'sysArea', align: 'center', type: 'html', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          // { id: 11, field: 'hostMfgr', title: '所属厂家', formatList: 'hostMfgr', align: 'center', type: 'html', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          { id: 12, field: 'hostType', title: '设备类型', formatList: 'hostType', align: 'center', type: 'html', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true }
          // { id: 13, field: 'hostModel', title: '设备型号', align: 'center', type: 'html', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          // { id: 14, field: 'hostSource', title: '数据来源', formatList: 'hostSource', align: 'center', type: 'html', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          // { id: 15, field: 'status', title: '状态', align: 'center', type: 'html', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          // { id: 15, field: 'updateDate', title: '更新时间', align: 'center', type: 'html', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true }
        ]
      },
      pages: {
        pageSizeList: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
        totalResult: 0,
        currentPage: 1,
        pageSize: 10,
        align: 'right'
      }
    }
  },
  async mounted () {
    await this.getDict()
    this.getDeviceListOfPage()
  },
  methods: {
    async getDict () {
      const keys = Object.keys(this.dict)
      for (const item of keys) {
        this.dict[item] = await getDictList(item)
      }
    },
    getDeviceListOfPage () {
      this.table.loading = true
      const params = {
        pageSize: this.pages.pageSize,
        pageNum: this.pages.currentPage
      }
      listPageAPI(params, this.formData).then(response => {
        const { data } = response
        if (data.code === 200) {
          this.table.infoData = data.data.records
          this.pages.totalResult = data.data.total
          const index = this.pages.pageSizeList.findIndex(v => v.label === '全部')
          this.pages.pageSizeList[index].value = Math.floor(this.pages.totalResult)
          this.pages.pageSize = data.data.size
          this.pages.currentPage = data.data.current
          this.table.loading = false
        }
      })
    },
    submitEvent () {
      this.pages.currentPage = 1
      this.hostType.forEach(item => {
        this.formData.hostType += item.value + ','
      })
      this.getDeviceListOfPage()
    },
    resetEvent () {
      this.condition.hostName = ''
      this.condition.hostType = []
      this.condition.sysArea = ''
    },
    async hostConnectionOfOs (hostId) {
      await connectionOSAPI(hostId).then(response => {
        const { data } = response
        if (data.code === 200) {
          const index = this.tabObj.findIndex(item => item.id === hostId)
          this.tabObj[index].wsId = data.data
        }
      })
    },
    async hostConnectionOfBMC (hostId) {
      await connectionBMCAPI(hostId).then(response => {
        const { data } = response
        if (data.code === 200) {
          const index = this.tabObj.findIndex(item => item.id === hostId)
          this.tabObj[index].wsId = data.data
        }
      })
    },
    closeConnection (wsId) {
      closeAPI(wsId).then(response => {
        const { data } = response
        if (data.code === 200) {
          console.log('websocket连接断开')
          console.log(data)
        }
      })
    },
    handlePageChange ({ currentPage, pageSize }) {
      this.pages.currentPage = currentPage
      this.pages.pageSize = pageSize
      this.getDeviceListOfPage()
    },
    initTerm (wsId) {
      const index = this.tabObj.findIndex(item => item.wsId === wsId)
      const element = document.getElementById(wsId)
      this.tabObj[index].term = new Terminal({
        rendererType: 'dom', // 渲染类型：dom / canvas
        disableStdin: false, // 禁止输入
        windowsMode: true, // 根据窗口换行
        convertEol: true, // 光标设置为下一行开头
        cursorBlink: true, // 光标闪烁
        cursorStyle: 'block', // 光标类型 underline block bar
        scrollback: 50,
        theme: {
          foreground: 'black', // 字体
          background: '#ffffff', // 背景色
          cursor: 'help'// 设置光标
        }
      })
      this.tabObj[index].fitAddon = new FitAddon()
      this.tabObj[index].term.loadAddon(this.tabObj[index].fitAddon)
      this.tabObj[index].term.open(element)

      this.tabObj[index].term.focus()
      this.tabObj[index].term.onData(data => {
        if (!this.tabObj[index].isClose) {
          const sendData = {
            id: this.tabObj[index].wsId,
            heartbeat: false,
            type: 'webssh',
            data: data
          }
          console.log(sendData)
          this.tabObj[index].ws.send(JSON.stringify(sendData))
        } else {
          this.tabObj[index].term.write('\r\n设备已登出，请重新登录。')
        }
      })
      this.$nextTick(() => {
        this.tabObj[index].fitAddon.fit()
      })
      window.addEventListener('resize', () => {
        this.tabObj[index].fitAddon.fit()
        this.tabObj[index].term.scrollToBottom()
      })
    },
    initWebSocket (wsId) {
      const index = this.tabObj.findIndex(item => item.wsId === wsId)
      const wsUrl = this.ws = new WebSocket(getWSURL(wsId, 'webterminal'))
      this.tabObj[index].ws = new WebSocket(wsUrl)
      this.tabObj[index].ws.onmessage = this.wsOnMessage
      this.tabObj[index].ws.error = (e) => {
        this.websocketOnError(e)
      }
      this.tabObj[index].ws.onclose = (e) => {
        this.websocketClose(e)
      }
      this.tabObj[index].intervalId = setInterval(() => {
        console.log('心跳检测')
        const heartCheck = {
          id: wsId,
          heartbeat: true,
          data: 'ping'
        }
        this.tabObj[index].ws.send(JSON.stringify(heartCheck))
      }, 3 * 60 * 1000)
      // 3*60*1000
    },
    async wsOnMessage (e) {
      const wsId = this.tab
      const index = this.tabObj.findIndex(item => item.wsId === wsId)
      const eData = JSON.parse(e.data)
      if (eData.success) {
        if (eData.closed) {
          this.tabObj[index].isClose = eData.closed
          this.tabObj[index].term.write('\r\n设备已登出，请重新登录。')
          clearInterval(this.tabObj[index].intervalId)
        } else {
          this.tabObj[index].term.write(eData.message)
        }
      } else {
        this.$message.error({ content: '连接失败', placement: 'center' })
        this.closeConnection(wsId)
        clearInterval(this.tabObj[index].intervalId)
        this.tabObj.splice(index, 1)
        this.tab = 'CMDB'
      }
    },
    websocketOnError (e) {
      console.log(e)
      console.log(`websocket异常: ${e.code}  ${e.reason}  ${e.wasClean} `)
    },
    websocketClose (e) {
      const wsId = this.tab
      console.log(e)
      console.log(`websocket断开: ${e.code}  ${e.reason}  ${e.wasClean} `)
      const index = this.tabObj.findIndex(item => item.wsId === wsId)
      clearInterval(this.tabObj[index].intervalId)
      this.closeConnection(wsId)
    },
    execute (item) {
      this.config.hostId = item.id
      this.config.hostName = item.hostName
      this.dialog = true
    },
    async connectionDev () {
      this.tabObj.push({
        id: this.config.hostId,
        name: '',
        label: this.config.hostName,
        term: null,
        fitAddon: null,
        ws: null,
        wsId: '',
        isClose: false,
        intervalId: '',
        fullScreen: false,
        showLoading: true
      })
      if (this.config.connectionType.value === 'os') {
        await this.hostConnectionOfOs(this.config.hostId)
      } else {
        await this.hostConnectionOfBMC(this.config.hostId)
      }
      const index = this.tabObj.findIndex(item => item.id === this.config.hostId)
      this.tabObj[index].name = this.tabObj[index].wsId
      this.tab = this.tabObj[index].wsId
      this.$nextTick(() => {
        this.initTerm(this.tabObj[index].wsId)
        this.initWebSocket(this.tabObj[index].wsId)
      })
    },
    changeFullScreen () {
      const wsId = this.tab
      const index = this.tabObj.findIndex(item => item.wsId === wsId)
      this.tabObj[index].fullScreen = !this.tabObj[index].fullScreen
      this.$nextTick(() => {
        this.tabObj[index].fitAddon.fit()
        this.tabObj[index].term.scrollToBottom()
      })
    },
    async closeDev () {
      const wsId = this.tab
      await this.closeConnection(wsId)
      const index = this.tabObj.findIndex(item => item.wsId === wsId)
      clearInterval(this.tabObj[index].intervalId)
      this.tabObj.splice(index, 1)
      this.tab = 'CMDB'
    },
    dialogClose () {
      this.dialog = false
      this.isDefaultNumber = true
    }
  }
}
</script>
