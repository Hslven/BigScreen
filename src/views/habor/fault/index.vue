<template>
  <div>
    <div class="bg-mod-card py-4 w-full" style="position: relative;">
      <t-form
        :data="formData"
        layout="inline"
        ref="form"
        @submit="onSubmit"
        :rules="rules"
      >
        <t-form-item name="neObj" style="width: 400px" label="网元：">
          <t-select
            :scroll="{ type: 'virtual' }"
            :popup-props="{ overlayInnerStyle: { height: '300px' } }"
            valueType="object"
            filterable
            v-model="formData.neObj"
            :options="networkElemtOptions"
            placeholder="请选择网元"
            @change="handleSelectChange"
          />
        </t-form-item>
        <t-form-item name="dateRange" label="时间范围：">
          <t-date-range-picker enable-time-picker allow-input clearable v-model="formData.dateRange" @change="handleDateRangeChange" />
        </t-form-item>
        <t-form-item>
          <t-button theme="primary" type="submit">查询</t-button>
        </t-form-item>
      </t-form>
      <div style="position: absolute; right: 20px; bottom: 20px">
        <div>{{ resourcePool }}</div>
      </div>
    </div>
    <div ref="contentRef" class="pt-4">
      <t-row :gutter="16" v-show="isShow">
        <t-col :span="8">
          <div id="qCard" class="bg-mod-card rounded-sm" style="height: 780px">
            <div style="position: relative" class="p-4">
              <!-- <div style="float: right" @click="setFullScreen">
                <mod-icon class="cursor-pointer" size="sm" color="primary"
                        :name="isFullScreen ? 'fullscreen' : 'fullscreen_exit'"/>
              </div> -->
              <div>
                <t-radio-group variant="primary-filled" @change="handleTypeChange" default-value="net">
                  <t-radio-button value="net">网络拓扑</t-radio-button>
                  <t-radio-button value="db">存储拓扑</t-radio-button>
                </t-radio-group>
              </div>
              <div>
                <transition
                  appear
                  enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut"
                >
                  <div id="topologyTree" style="width: 100%;"></div>
                </transition>
              </div>
            </div>
          </div>
        </t-col>
        <t-col :span="4">
          <div>
            <div class="bg-mod-card rounded-sm px-4 py-2" style="height: 384px">
              <div style="font-size: 12px" class="pb-2 font-bold">告警</div>
              <div>
                <vxe-table
                  ref="alarmInfo"
                  id="alarmInfo"
                  empty-text="暂无告警信息！"
                  border="default"
                  stripe
                  auto-resize
                  keep-source
                  highlight-hover-row
                  highlight-current-row
                  highlight-hover-column
                  highlight-current-column
                  resizable
                  max-height="220"
                  size="mini"
                  :loading="alarm.table.loading"
                  :import-config="{}"
                  :export-config="{}"
                  :checkbox-config="{reserve: true}"
                  :data="alarm.table.infoData"
                  row-id='id'
                >
                  <vxe-table-column v-for="(config, index) in alarm.table.tableColumn" :key="index" v-bind="config">
                    <template v-if="config.field === 'alarmName'" v-slot="{ row }">
                      <span class="text_click text-primary" @click="alarmDialogEvent(row)">{{ row.alarmName }}</span>
                    </template>
                    <template v-else-if="config.field === 'perceivedSeverity'" v-slot="{ row }">
                      <span v-if="row.perceivedSeverity === '1'"><div class="status-point bg-red"/>一级</span>
                      <span v-else-if="row.perceivedSeverity === '2'"><div class="status-point bg-orange"/>二级</span>
                      <span v-else-if="row.perceivedSeverity === '3'"><div class="status-point bg-yellow"/>三级</span>
                      <span v-else><div class="status-point bg-grey"/>四级</span>
                    </template>
                  </vxe-table-column>
                </vxe-table>
                <vxe-pager
                  background
                  size="small"
                  class="q-mt-sm"
                  :current-page="alarm.pages.currentPage"
                  :total="alarm.pages.totalResult"
                  :page-size="alarm.pages.size"
                  :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'FullJump', 'Total']"
                  @page-change="alarmPagesEvent">
                </vxe-pager>
              </div>
            </div>
            <div class="bg-mod-card rounded-sm px-4 py-2 mt-4" style="height: 380px">
              <div style="font-size: 12px">变更工单 <span v-show="hostName">({{
                  hostName
                }})</span>
              </div>
              <div>
                <vxe-table
                  ref="orderInfo"
                  id="orderInfo"
                  empty-text="暂无变更工单信息！"
                  border="default"
                  stripe
                  auto-resize
                  keep-source
                  highlight-hover-row
                  highlight-current-row
                  highlight-hover-column
                  highlight-current-column
                  resizable
                  max-height="220"
                  size="mini"
                  :loading="order.table.loading"
                  :import-config="{}"
                  :export-config="{}"
                  :checkbox-config="{reserve: true}"
                  :data="order.table.infoData"
                  row-id='id'
                >
                  <vxe-table-column v-for="(config, index) in order.table.tableColumn" :key="index" v-bind="config">
                    <template v-if="config.field === 'title'" v-slot="{ row }">
                      <span class="text_click text-primary">{{ row.title }}</span>
                    </template>
                  </vxe-table-column>
                </vxe-table>
                <vxe-pager
                  background
                  size="small"
                  class="q-mt-sm"
                  :current-page="order.pages.currentPage"
                  :total="order.pages.totalResult"
                  :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'FullJump', 'Total']"
                  @page-change="orderPagesEvent">
                </vxe-pager>
              </div>
            </div>
          </div>
        </t-col>
      </t-row>
    </div>
    <t-dialog width="30%" :visible.sync="dialog.alarmShow" v-if="dialog.alarmShow" header="告警信息" :cancelBtn="null" :confirm-btn="null" :footer="null">
      <div>
        <p>告警名称：{{ alarm.table.detailInfo.alarmName }}</p>
        <p>设备名称：{{ alarm.table.detailInfo.name }}</p>
        <p>清除状态：{{ alarm.table.detailInfo.clearedState }}</p>
        <p>告警时间：{{ alarm.table.detailInfo.latestLogTime }}</p>
      </div>
    </t-dialog>
    <t-drawer
      :visible.sync="visibleNode"
      placement="right"
      size="80%"
      :onConfirm="() => (visibleNode = false)"
      header="抽屉标题"
    >
      <div>
        <second-info :obj.sync="nodeInfo"></second-info>
      </div>
    </t-drawer>
  </div>
</template>

<script>
import G6 from '@antv/g6'
import { Register } from './register'
import { getAppListAPI, getTopuAPI, getAlarmPageAPI, getOrderPageAPI } from '@/api/monitor/faultCheck'
import { LoadingPlugin } from 'tdesign-vue'
import firewall from '@/assets/images/topology/firewall.png'
import routeImg from '@/assets/images/topology/router.png'
import srv from '@/assets/images/topology/server.png'
import switchImg from '@/assets/images/topology/switch.png'
import db from '@/assets/images/topology/database.png'
import vm from '@/assets/images/topology/host.png'
import secondInfo from './secondInfo.vue'
export default {
  components: { secondInfo },
  name: 'mainInfo',
  data () {
    return {
      visibleNode: false,
      nodeInfo: {},
      hostName: {},
      networkElemtOptions: [],
      filterNeList: [],
      formData: {
        neObj: '',
        dateRange: []
      },
      rules: {
        neObj: [{
          required: true,
          message: '网元必选',
          type: 'error'
        }],
        dateRange: [{
          required: true,
          message: '日期必选',
          type: 'error'
        }]
      },
      condition: {
        ne: '',
        app: '',
        startDate: '',
        endDate: ''
      },
      resourcePool: '',
      isShow: true,
      toplogyShow: false,
      isFullScreen: false,
      alarm: {
        table: {
          loading: false,
          infoData: [],
          detailInfo: '',
          tableColumn: [
            { id: 1, field: 'alarmName', title: '告警名称', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
            { id: 2, field: 'name', title: '设备名称', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
            { id: 3, field: 'perceivedSeverity', type: 'html', title: '告警级别', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
            { id: 4, field: 'clearedState', title: '清除状态', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
            { id: 5, field: 'latestLogTime', title: '时间', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true }
          ]
        },
        pages: {
          totalResult: 0,
          currentPage: 1,
          size: 5,
          align: 'right'
        }
      },
      order: {
        table: {
          loading: false,
          infoData: [],
          tableColumn: [
            { id: 1, field: 'title', title: '标题', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
            { id: 2, field: 'info', title: '内容', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
            { id: 4, field: 'time', title: '时间', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true }
          ]
        },
        pages: {
          totalResult: 5,
          currentPage: 1,
          align: 'right'
        }
      },
      hostNameArray: [],
      hostList: [],
      netNodeData: [],
      dbNodeData: [],
      topologyData: {
        nodes: [],
        edges: []
      },
      graph: null,
      dialog: {
        alarmShow: false
      }
    }
  },
  mounted () {
    this.registerG6()
    this.initG6()
    this.getAppList()
  },
  methods: {
    handleSelectChange (value, context) {
      this.condition.ne = context.option.ne
      this.condition.app = context.option.app
    },
    handleDateRangeChange (value, context) {
      this.condition.startDate = value[0]
      this.condition.endDate = value[1]
    },
    handleTypeChange (checkedValues) {
      this.toplogyShow = true
      if (checkedValues === 'net') {
        this.topologyData.nodes = this.netNodeData
        this.$nextTick(() => {
          this.graph.read(this.topologyData)
          this.graph.fitView()
        })
      } else {
        this.topologyData.nodes = this.dbNodeData
        this.$nextTick(() => {
          this.graph.read(this.topologyData)
          this.graph.fitView()
        })
      }
      this.toplogyShow = true
      this.toplogyShow = false
    },
    registerG6 () {
      const registerObj = new Register()
      registerObj.registerEdge()
      registerObj.registerNotClearedNode()
      registerObj.registerClearedNode()
    },
    initG6 () {
      const card = document.getElementById('qCard')
      window.document.getElementById('topologyTree').innerHTML = ''
      const tooltip = new G6.Tooltip({
        offsetX: 10,
        offsetY: 10,
        itemTypes: ['node'],
        getContent: (e) => {
          const outDiv = document.createElement('div')
          outDiv.style.width = '500px'
          outDiv.innerHTML = `
            <div class="p-2">
            <span style="font-weight: bold; color: #1976D2">设备信息</span>
            <div>设备名称: <br />${e.item._cfg.model.id}</div>
            <div>类型: ${e.item._cfg.model.devType}</div>
            <div>设备厂家: ${e.item._cfg.model.manufacturer}</div>
            <div>已清除告警: ${e.item._cfg.model.clearedList ? e.item._cfg.model.clearedList.length : 0}</div>
            <div>未清除告警: ${e.item._cfg.model.notClearedList ? e.item._cfg.model.notClearedList.length : 0}</div>
            <div>相关事件数量: ${e.item._cfg.model.eventList ? e.item._cfg.model.eventList.length : 0}</div></div>`
          return outDiv
        }
      })
      const container = document.getElementById('topologyTree')
      const width = card.scrollWidth
      const height = card.offsetHeight * 0.9
      const grid = new G6.Grid()
      this.graph = new G6.Graph({
        container,
        width,
        height,
        plugins: [tooltip, grid],
        fitView: true,
        fitViewPadding: [20, 20, 20, 20],
        linkCenter: false,
        controlPoints: false,
        modes: {
          default: ['drag-canvas', 'drag-node', 'zoom-canvas']
        },
        layout: {
          type: 'dagre',
          nodesep: 30,
          ranksep: 60,
          rankdir: 'BT',
          controlPoints: true
        },
        animate: true,
        defaultNode: {
          // type: 'image',
          // size: [50, 40],
          labelCfg: {
            style: {
              fontSize: 16
            }
          }
        },
        defaultEdge: {
          type: 'circle-running',
          labelCfg: {
            autoRotate: true,
            style: {
              fill: '#1890ff',
              fontSize: 14,
              background: {
                fill: '#ffffff',
                stroke: '#9EC9FF',
                padding: [2, 2, 2, 2],
                radius: 2
              }
            }
          }
        }
      })
      this.graph.on('node:mouseenter', (e) => {
        this.graph.setItemState(e.item, 'active', true)
      })
      this.graph.on('node:mouseleave', (e) => {
        this.graph.setItemState(e.item, 'active', false)
      })
      this.graph.on('node:click', evt => {
        console.log('evt.item._cfg.model: ', evt.item._cfg.model)
        this.nodeInfo = {
          resourcePool: this.resourcePool,
          label: evt.item._cfg.model.id,
          manufacturer: evt.item._cfg.model.manufacturer,
          type: evt.item._cfg.model.devType,
          info: this.condition,
          alarmList: []
        }
        if (evt.item._cfg.model.notClearedList) {
          this.nodeInfo.alarmList.push(evt.item._cfg.model.notClearedList)
        }
        if (evt.item._cfg.model.clearedList) {
          this.nodeInfo.alarmList.push(evt.item._cfg.model.clearedList)
        }
        this.visibleNode = true
      })
    },
    getAppList () {
      getAppListAPI().then(response => {
        const { data } = response
        if (data.code === 0) {
          this.networkElemtOptions = data.data.map((item) => {
            return {
              label: item.neName === null ? item.appName : `${item.appName} [${item.neName}]`,
              value: item.neName === null ? item.appName : `${item.appName} [${item.neName}]`,
              ne: item.neName ? item.neName : '',
              app: item.appName ? item.appName : ''
            }
          })
        } else {
          this.$messgae.error('请求失败')
        }
      })
    },
    async getTopu () {
      const loadingAttachInstance = LoadingPlugin({
        attach: () => this.$refs.contentRef,
        showOverlay: true,
        size: '20px',
        text: '正在请求中，请耐心等候......'
      })
      this.alarm.table.loading = true
      this.order.table.loading = true
      this.topologyData = {
        nodes: [],
        edges: []
      }
      const data = {
        ne: this.condition.ne,
        app: this.condition.app,
        startTime: this.condition.startDate,
        endTime: this.condition.endDate
      }
      await getTopuAPI(data).then(async response => {
        const { data } = response
        if (data.code === 0) {
          if (JSON.stringify(data.data) !== '{}') {
            await this.topuDataGenerate(data.data.fws, 'fw', firewall, '', 'net')
            await this.topuDataGenerate(data.data.ces, 'ce', routeImg, '', 'net')
            await this.topuDataGenerate(data.data.tors, 'tor', switchImg, '', 'net')
            await this.topuDataGenerate(data.data.eors, 'eor', switchImg, '', 'net')
            await this.topuDataGenerate(data.data.hosts, 'srv', srv, '', 'net')
            await this.topuDataGenerate(data.data.storagePools, 'storagePool', db, 'sp', 'db')
            await this.topuDataGenerate(data.data.luns, 'lun', vm, 'lun', 'db')
            await this.topuDataGenerate(data.data.vms, 'vm', vm, 'vm', 'db')
            this.topologyData.nodes = this.netNodeData
            await data.data.links.forEach(item => {
              const params = {
                source: item.source,
                target: item.target
              }
              this.topologyData.edges.push(params)
            })
            this.resourcePool = data.data.resourcePool
            loadingAttachInstance.hide()
            this.isShow = true
          } else {
            loadingAttachInstance.hide()
            this.$message.error('查无数据')
          }
        } else {
          this.$message.error('请求失败，请稍后再试')
          loadingAttachInstance.hide()
        }
      })
    },
    getAlarmPage () {
      this.alarm.table.loading = true
      const params = {
        name: '',
        resourcePool: this.resourcePool,
        startTime: this.condition.startDate,
        endTime: this.condition.endDate,
        limit: 5,
        page: this.alarm.pages.currentPage
      }
      getAlarmPageAPI(params).then(response => {
        const { data } = response
        if (data.code === 0) {
          this.alarm.table.infoData = data.data.records
          this.alarm.pages.currentPage = data.data.current
          this.alarm.pages.totalResult = data.data.total
          this.alarm.table.loading = false
        }
      })
    },
    getOrderPage () {
      this.order.table.loading = true
      const params = {
        ne: this.condition.ne,
        beginTime: this.condition.startDate,
        endTime: this.condition.endDate,
        limit: 5,
        page: this.order.pages.currentPage
      }
      getOrderPageAPI(params).then(response => {
        const { data } = response
        if (data.code === 0) {
          this.order.table.infoData = data.data.records
          this.order.pages.currentPage = data.data.current
          this.order.pages.totalResult = data.data.total
          this.order.table.loading = false
        }
      })
    },
    topuDataGenerate (list, devType, img, prefix, type) {
      if (list) {
        list.forEach(async (item, index) => {
          let imgType = 'image'
          if (item.alarmNotClearedList !== null) {
            imgType = 'notCleared'
          } else if (item.alarmClearedList !== null) {
            imgType = 'cleared'
          }
          const params = {
            id: item.name,
            label: prefix ? `${prefix}-${index + 1}` : item.name.slice(20),
            img,
            size: 30,
            type: imgType,
            devType,
            manufacturer: item.manufacturer,
            notClearedList: item.alarmNotClearedList === null ? [] : item.alarmNotClearedList,
            clearedList: item.alarmClearedList === null ? [] : item.alarmClearedList,
            eventList: item.eventList === null ? [] : item.eventList
          }
          if (type === 'net') {
            await this.netNodeData.push(params)
          } else if (type === 'db') {
            await this.dbNodeData.push(params)
          }
          // await this.topologyData.nodes.push(params)
        })
      }
    },
    topologyChart () {
      this.graph.data(this.topologyData)
      this.graph.render()
      this.graph.fitView()
      if (typeof window !== 'undefined') {
        window.onresize = () => {
          const card = document.getElementById('qCard')
          this.graph.changeSize(card.offsetWidth * 0.98, card.offsetHeight * 0.9)
          this.graph.read(this.topologyData)
          this.graph.fitView()
        }
      }
    },
    async onSubmit ({ validateResult, firstError }) {
      if (validateResult === true) {
        await this.getTopu()
        this.topologyChart()
        await this.getAlarmPage()
        await this.getOrderPage()
        this.graph.read(this.topologyData)
      } else {
        this.$message.warning(firstError)
      }
    },
    alarmPagesEvent ({ currentPage }) {
      this.alarm.pages.currentPage = currentPage
      this.getAlarmPage()
    },
    alarmDialogEvent (value) {
      this.alarm.table.detailInfo = value
      this.dialog.alarmShow = true
    },
    orderPagesEvent ({ currentPage }) {
      this.order.pages.currentPage = currentPage
      this.getOrderPage()
    },
    setFullScreen () {
      this.isFullScreen = !this.isFullScreen
      if (this.isFullScreen) {
        this.graph.cfg.layout.ranksep = 60
        this.graph.cfg.layout.nodesep = 50
        this.graph.cfg.fitView = false
        this.graph.cfg.fitCenter = true
        this.$nextTick(() => {
          const card = document.getElementById('qCard')
          const width = card.offsetWidth * 0.98
          this.graph.changeSize(width, card.offsetHeight * 0.9)
          this.graph.read(this.topologyData)
        })
      } else {
        this.graph.cfg.fitCenter = false
        this.graph.cfg.layout.ranksep = 60
        this.graph.cfg.layout.nodesep = 30
        this.$nextTick(() => {
          const card = document.getElementById('qCard')
          const width = card.offsetWidth * 0.98
          this.graph.changeSize(width, card.offsetHeight * 0.9)
          this.graph.read(this.topologyData)
          this.graph.fitView()
        })
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.text_click
  text-decoration: underline
  cursor: pointer
.status-point
  display: inline-block
  width: 5px
  height: 5px
  border-radius: 50%
  margin-right: 5px
.g6-component-tooltip
  background-color: rgba(255, 255, 255, 0.8)
  padding: 0px 10px 24px 10px
  box-shadow: rgb(174, 174, 174) 0px 0px 10px
/deep/ .q-card__section--vert
  height: 5%
  padding: 10px 10px 10px 10px
/deep/ .q-date__view
  min-height: 0px
  padding: 10px
/deep/ .q-date__calendar-days-container
  min-height: 0px
/deep/ .q-date__actions
  padding: 0px 5px 0px 0px
/deep/ .q-field__native span
  width: 80%
  overflow: hidden
  text-overflow: ellipsis
</style>
