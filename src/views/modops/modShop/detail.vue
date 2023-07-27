<template>
  <div>
    <div style="display: grid;grid-template-columns: 1fr 4fr;letter-spacing: 1px" class="view-height">
      <div style="display: flex;flex-direction: column;flex-wrap: nowrap;">
        <div class="bg-mod-card rounded-sm w-full h-full pl-4">
          <div class="py-4">
            <t-button variant="text" @click="backTo">
              <chevron-left-icon slot="icon" />
              返回
            </t-button>
          </div>
          <div>
            <div class="BaseInfo-name text-mod-title">{{ modObj.name }}</div>
          </div>
          <div>
            <div style="letter-spacing: 1px;font-size: 12px" class="text-mod-body">{{ modObj.description }}</div>
          </div>
          <div class="my-3">
            <t-space>
              <t-button
                v-if="isPermission('mod_execute')"
                v-show="!executeSign"
                :disable="is_none_mod"
                theme="success"
                shape="round"
                variant="base"
                @click="executeEvent"
                class="mr-2"
                >
                执行
              </t-button>
              <t-button
                v-if="isPermission('mod_execute')"
                v-show="executeSign"
                theme="danger"
                shape="round"
                variant="base"
                @click="stopExecuteEvent"
                class="mr-2"
                >
                停止
              </t-button>
              <t-dropdown :options="options" v-if="isPermission('mod_schedule')">
                <t-button theme="primary" shape="round">
                  <span class="tdesign-demo-dropdown__text">
                    调度
                    <chevron-down-icon size="16" slot="suffix" />
                  </span>
                </t-button>
              </t-dropdown>
            </t-space>
            <t-dialog :visible.sync="is_schedule" :header="schedule_format(plan.type)" @confirm="addSchduleEvent">
              <div>
                <div>模组参数</div>
                  <div
                    class="item-hover-style px-4 py-2 my-2"
                    :style="{cursor: executeSign ? 'not-allowed' : 'pointer', 'background-color': modParamStatus(param.value)}"
                    v-for="(param, index) in instanceObj.params"
                    v-bind:key="index"
                    @click="ValueInputEvent(param, index)"
                    style="border-radius: 5px; margin: 8px 12px 8px 0"
                    >
                      <div>
                        <div>{{ param.name }}</div>
                        <span>{{ param.type }}</span><span v-if="param.tag">:{{ param.tag }}</span>
                      </div>
                  </div>
                <t-divider></t-divider>
                <div>任务设置</div>
                <t-date-picker class="w-full" valueType="YYYY-MM-DD HH:mm:ss" v-if="plan.type==='schedule'" enable-time-picker allow-input clearable v-model="plan.when" />
                <t-input class="w-full" v-else v-model="plan.when" placeholder="* * * * *" tips="crontab语法：*(每分钟) *(每小时) *(每天) *(每月) *(每周)">
                </t-input>
              </div>
            </t-dialog>
          </div>
          <div class="py-4">
            <div class="h6 text-mod-title py-4">详情</div>
            <t-row>
              <t-col :span="4" class="p-2 text-mod-body" style="font-size: 12px">
                作者:
              </t-col>
              <t-col :span="8" class="p-2 text-mod-body" style="font-size: 12px">
                {{ modObj.author }}
              </t-col>
              <t-col :span="4" class="p-2 text-mod-body" style="font-size: 12px">
                状态:
              </t-col>
              <t-col :span="8" class="p-2 text-mod-body" style="font-size: 12px">
                <mod-status status="Success"></mod-status>
              </t-col>
              <t-col :span="4" class="p-2 text-mod-body" style="font-size: 12px">
                创建时间:
              </t-col>
              <t-col :span="8" class="p-2 text-mod-body" style="font-size: 12px">
                {{ dateData(modObj.createdAt) }}
              </t-col>
              <t-col :span="4" class="p-2 text-mod-body" style="font-size: 12px">
                更新时间:
              </t-col>
              <t-col :span="8" class="p-2 text-mod-body" style="font-size: 12px">
                {{ dateData(modObj.updatedAt) }}
              </t-col>
            </t-row>
            <div class="h6 text-mod-title pt-4">模组参数</div>
            <div>
              <t-tabs :value="modTab" size="medium" @change="(newValue) => (modTab = newValue)">
                <t-tab-panel value="value" label="参数赋值">
                  <div style="max-height: 330px; overflow: auto">
                    <div
                      class="item-hover-style px-4 py-2 my-2"
                      :style="{cursor: executeSign ? 'not-allowed' : 'pointer', 'background-color': modParamStatus(param.value)}"
                      v-for="(param, index) in instanceObj.params"
                      v-bind:key="index"
                      @click="ValueInputEvent(param, index)"
                      style="border-radius: 5px; margin: 8px 12px 8px 0; font-size: 12px"
                    >
                      <div>
                        <div>{{ param.name }}</div>
                        <span>{{ param.type }}</span><span v-if="param.tag">:{{ param.tag }}</span>
                      </div>
                    </div>
                  </div>
                </t-tab-panel>
                <t-tab-panel value="json" label="参数视图">
                  <json-viewer
                    style="max-height: 330px"
                    :value="modParamView(instanceObj.params)"
                    :expand-depth=5
                    copyable
                    boxed></json-viewer>
                </t-tab-panel>
              </t-tabs>
            </div>
          </div>
        </div>
      </div>
      <div style="display: flex;flex-direction: column; padding: 0px 8px 0px 8px;" class="view-max-height">
        <div style="display: flex; justify-content: center; align-items: center">
          <div v-if="executeSign" class="w-full card-content-style rounded-sm" style="background-color: #242e42 !important; padding-bottom: 8px; padding-top: 8px; display: flex;align-items: center">
            <t-loading class="ml-4 text-white" text="正在执行..." size="small"></t-loading>
          </div>
          <div v-else class="w-full card-content-style rounded-sm" style="background-color: #242e42 !important; padding-bottom: 8px; padding-top: 8px; display: flex;align-items: center">
            <t-tag theme="success" class="ml-4">模组实例</t-tag>
          </div>
        </div>
        <div style="flex: 1" id="modX6" class="width-adapt rounded-sm bg-mod-card"></div>
      </div>
    </div>
    <t-drawer :visible.sync="serviceDialog" v-if="serviceDialog" :closeBtn="false" :showOverlay="false" size="30%">
      <template #header>
        <div class="mod-img p-4">
          <div class="BaseInfo-name">{{ clickService.name }}</div>
          <div style="color: #57727F;letter-spacing: 1px;font-size: 12px">{{ clickService.description }}</div>
        </div>
      </template>
      <div class="py-4">
        <div class="h6 text-mod-title pb-4">详情</div>
        <t-row>
          <t-col :span="4" class="p-2 text-mod-body" style="font-size: 12px">
            id:
          </t-col>
          <t-col :span="8" class="p-2 text-mod-body" style="font-size: 12px">
            {{ clickService._id }}
          </t-col>
          <t-col :span="4" class="p-2 text-mod-body" style="font-size: 12px">
            key:
          </t-col>
          <t-col :span="8" class="p-2 text-mod-body" style="font-size: 12px">
            {{ clickService.key }}
          </t-col>
          <t-col :span="4" class="p-2 text-mod-body" style="font-size: 12px">
            作者:
          </t-col>
          <t-col :span="8" class="p-2 text-mod-body" style="font-size: 12px">
            {{ clickService.author }}
          </t-col>
          <t-col :span="4" class="p-2 text-mod-body" style="font-size: 12px">
            执行结果:
          </t-col>
          <t-col :span="8" class="p-2 text-mod-body" style="font-size: 12px">
            <mod-status :status="clickService.status"></mod-status>
          </t-col>
          <t-col :span="4" class="p-2 text-mod-body" style="font-size: 12px">
            创建时间:
          </t-col>
          <t-col :span="8" class="p-2 text-mod-body" style="font-size: 12px">
            {{ dateData(clickService.createdAt) }}
          </t-col>
          <t-col :span="4" class="p-2 text-mod-body" style="font-size: 12px">
            更新时间:
          </t-col>
          <t-col :span="8" class="p-2 text-mod-body" style="font-size: 12px">
            {{ dateData(modObj.updatedAt) }}
          </t-col>
          <!-- <t-col :span="12" class="p-2 text-mod-body" style="font-size: 12px" v-if="data_check">
            <t-button variant="outline" @click="onClickFilter">
              详情
            </t-button>
          </t-col> -->
        </t-row>
        <component height="500px" :is="paramDisplay" :outputParamData.sync="outputParamData"></component>
      </div>
      <template #footer>
        <t-button variant="outline" @click="serviceDialog = false">关闭</t-button>
      </template>
    </t-drawer>
    <t-dialog :destroyOnClose="true" :closeOnOverlayClick="false" :closeOnEscKeydown="false" :visible.sync="is_valueInput" header="自定义模组参数值" :cancelBtn="null" :confirm-btn="null" :footer="false">
      <div v-if="is_valueInput">
        <param-value-input :modParam="modParamsInfo" @onInstanceObjParam="onInstanceObjParam"></param-value-input>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import 'vue-json-viewer/style.css'
import ModStatus from '@/components/modComp/modStatus'
import Stomp from 'stompjs'
import JsonViewer from 'vue-json-viewer'
import { getModApi, instanceApi, getServiceDetailApi } from '@/api/modServer/mod'
import { addScheduleApi } from '@/api/modServer/schedule'
import { formatterDate } from '@/utils/index'
import { thumbStyle } from '@/Layout/components/BaseContent/ThumbStyle'
import { InputInitObj, modObj, InstanceObj, scheduleObj } from '../utils/dataObject'
import { X6Graph } from '../utils/antvX6'
import { Register } from '../utils/register'
import { Utils } from '../utils/utils'
import { cloneDeep, random } from 'lodash'
import { customAlphabet } from 'nanoid'
import { ChevronDownIcon, ChevronLeftIcon } from 'tdesign-icons-vue'
export default {
  name: 'detail',
  components: {
    ParamValueInput: () => import('./paramValueInput'),
    ModStatus,
    JsonViewer,
    ChevronDownIcon,
    ChevronLeftIcon,
    GeneralDisplayComp: () => import('../Dispalyor/generalDisplayComp')
  },
  data () {
    return {
      isClicked: false,
      // 模组调度任务所需数据
      plan: {
        type: 'schedule',
        when: ''
      },
      is_schedule: false,
      // 模组执行所需数据
      modTab: 'value',
      is_none_mod: false,
      thumbStyle,
      is_valueInput: false,
      paramDisplay: 'generalDisplayComp',
      paramIndex: 0,
      executeSign: false,
      tab: 'mod',
      fromPath: '',
      modId: '',
      serviceDialog: false,
      modObj: cloneDeep(modObj),
      instanceObj: cloneDeep(InstanceObj(this.$route.params.modId)),
      graph: null,
      clickService: {
        outputType: null
      },
      client: null,
      modParamsInfo: InputInitObj('string'),
      outputParamData: '',
      // 仅在data_check下显示按钮
      data_check: false,
      filter_sign: false,
      detail_dialog: false,
      options: [
        {
          content: '定时任务设置',
          value: 1,
          onClick: () => {
            this.is_schedule = !this.is_schedule
            this.plan.type = 'schedule'
            this.plan.when = ''
          }
        },
        {
          content: '周期任务设置',
          value: 2,
          onClick: () => {
            this.is_schedule = !this.is_schedule
            this.plan.type = 'every'
            this.plan.when = ''
          }
        }
      ]
    }
  },
  created () {},
  mounted () {
    this.initMod()
    // 注册antv/X6
    this.registerX6()
    // 初始antv/x6画布
    this.initGraph()
  },
  computed: {
    dateData () {
      return function (date) {
        return formatterDate(date)
      }
    },
    isPermission () {
      // 判断是否有权限
      return function (sign) {
        let permission = false
        const permissionList = JSON.parse(window.sessionStorage.getItem('modPermissions'))
        permissionList.forEach((item) => {
          if (item.element_id === sign) {
            permission = true
          }
        })
        return permission
      }
    },
    schedule_format () {
      return function (value) {
        const scheduleDict = {
          every: '周期任务',
          schedule: '定时任务'
        }
        return scheduleDict[value]
      }
    },
    modParamView () {
      // 模组参数的json视图字典
      return function (params) {
        const res = []
        params.length && params.forEach((val, index) => {
          const param = {}
          param['参数名'] = val.name
          param['参数类型'] = val.type
          param['参数标签'] = val.tag
          param['参数值'] = val.value
          res.push(param)
        })
        return res
      }
    },
    modParamStatus () {
      return function (value) {
        if (value.length) {
          if (Array.isArray(value[0]) && value[0].length === 0) {
            return '#eff4f9'
          }
          return '#cdeed2'
        } else {
          return '#eff4f9'
        }
      }
    },
    onDarkTheme () {
      return this.$store.getters.getModDarkTheme
    }
  },
  watch: {
    result_dialog (newval, oldvalue) {
      if (newval === false) {
        this.filter_sign = false
        this.data_check = false
      }
    },
    onDarkTheme (newValue) {
      if (newValue) {
        this.graph.drawBackground({
          color: 'rgb(43, 40, 47)'
        })
      } else {
        this.graph.drawBackground({
          color: 'rgb(255, 255, 255)'
        })
      }
    }
  },
  methods: {
    registerX6 () {
      const registerObj = new Register()
      registerObj.registerEdge()
      registerObj.registerParamNode()
      registerObj.registerInstanceStepNode()
    },
    initMod () {
      // 获取指定modId的模组信息数据
      this.modId = this.$route.params.modId
      return new Promise((resolve, reject) => {
        getModApi(this.modId).then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.modObj = data.data
            if (this.modObj.steps.length === 0) {
              this.is_none_mod = true
            }
            const utilsObj = new Utils()
            this.modObj.params.length && this.modObj.params.forEach((param, index) => {
              utilsObj.setInputValue(param)
              this.instanceObj.params.push(cloneDeep(param))
            })
            this.initNode()
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    initNode () {
      // 在antv/x6画布上添加节点
      this.modObj.steps.forEach((cell, index) => {
        if (cell.nodeCell.data.nodeType === 'step') {
          cell.nodeCell.shape = 'instance-node-pro'
        } else {
          cell.nodeCell.shape = 'param-node-pro'
        }
        cell.nodeCell.ports.groups.out.attrs.circle.style.visibility = 'hidden'
        cell.nodeCell.ports.groups.in.attrs.circle.style.visibility = 'hidden'
        cell.nodeCell.ports.items.forEach((val) => {
          if (val && val.attrs) {
            val.attrs.text = ''
          }
        })
        this.graph.addNode(cell.nodeCell)
      })
      // 在antv/x6画布上添加边
      this.modObj.orders.forEach((cell, index) => {
        this.graph.addEdge(cell.edgeCell)
      })
    },
    initGraph () {
      const modX6Id = document.getElementById('modX6')
      const graph = new X6Graph(modX6Id).createActuator()
      this.graph = graph
      this.graph.zoom(-0.3)
      // 引入多个节点\线的监听事件
      this.graphOnEvent()
    },
    graphOnEvent () {
      // 监听节点的点击事件
      this.graph.on('node:click', ({ node }) => {
        if (!this.executeSign && this.isClicked) {
          this.clickService = node.getData()
          this.clickService.ports = node.getPorts()
          this.clickService.id = node.id
          if (this.clickService.nodeType !== 'param') {
            this.clickService.outputType = this.clickService.output.type
            // 获取构件执行详情
            if (this.instanceObj.instanceId) {
              return new Promise((resolve, reject) => {
                getServiceDetailApi(this.instanceObj.instanceId, node.id).then(response => {
                  const { data } = response
                  if (data.status === 'success') {
                    this.outputParamData = data.data.output.data
                    if (data.data.output.options.tag === 'dataCheck') {
                      this.data_check = true
                    }
                    this.clickService.status = data.status
                    this.serviceDialog = true
                  } else {
                    this.outputParamData = ''
                    this.$message.warning(data)
                  }
                }).catch(error => {
                  this.$message.error(error)
                })
              })
            }
          }
        }
      })
    },
    backTo () {
      // 返回到模组商场列表页
      if (this.executeSign) {
        const alertDia = this.$dialog.alert({
          header: '退出',
          body: '模组正在执行中，确认退出？',
          confirmBtn: {
            content: '确定!',
            variant: 'base',
            theme: 'danger'
          },
          onConfirm: ({ e }) => {
            this.fromPath = window.sessionStorage.getItem('fromPath')
            this.$router.push({ path: this.fromPath })
            alertDia.hide()
          },
          onClose: ({ e, trigger }) => {
            alertDia.hide()
          }
        })
      } else {
        this.fromPath = window.sessionStorage.getItem('fromPath')
        this.$router.push({ path: this.fromPath })
      }
    },
    executeEvent () {
      this.isClicked = true
      const allNodes = this.graph.getNodes()
      allNodes.forEach((nodeCell, index) => {
        nodeCell.setData({ status: 'Waitting' })
      })
      // 初始化节点状态，设置为等待状态
      let isParamsSatisfy = true
      this.instanceObj.params.forEach((val, key) => {
        // 排查模组参数是否存在没有设置值的情况
        if (!val.value.length) {
          isParamsSatisfy = false
        }
      })
      if (isParamsSatisfy) {
        const nanoid = customAlphabet('1234567890abcdef', 24)
        this.instanceObj.instanceId = nanoid()
        this.instanceObj.userid = this.$store.getters.getInfo.userName
        // 设置antv/x6的节点和边的执行状态
        this.edgeStatusChange()
        // 连接MQ
        this.connect()
      } else {
        this.$message.error('请为模组参数设置值！')
      }
    },
    stopExecuteEvent () {
      this.client.disconnect()
      this.executeSign = !this.executeSign
      // 移除所有边
      const allNodes = this.graph.getNodes()
      allNodes.forEach((nodeCell, index) => {
        nodeCell.setData({ status: 'Waitting' })
      })
      const allEdges = this.graph.getEdges()
      this.graph.removeCells(allEdges)
      // 重新渲染边
      this.modObj.orders.forEach((cell, index) => {
        this.graph.addEdge(cell.edgeCell)
      })
    },
    edgeStatusChange () {
      const allEdges = this.graph.getEdges()
      allEdges.forEach((edge, key) => {
        const sourceCellId = edge.getSourceCellId()
        const sourceCell = this.graph.getCellById(sourceCellId)
        const edgeAttrs = cloneDeep(edge.getAttrs())
        const sourceCellData = sourceCell.getData()
        if (sourceCellData.nodeType !== 'param') {
          edgeAttrs.line.sourceMarker.fill = '#00bbec'
          edgeAttrs.line.sourceMarker.stroke = '#00bbec'
          edgeAttrs.line.targetMarker.fill = '#00bbec'
          edgeAttrs.line.targetMarker.stroke = '#00bbec'
          edgeAttrs.line.stroke = '#00bbec'
          edgeAttrs.line.strokeDasharray = 5
          edgeAttrs.line.style = {
            animation: 'ant-line 30s infinite linear'
          }
          edge.setAttrs(edgeAttrs)
        } else {
          edgeAttrs.line.sourceMarker.fill = 'rgba(85,188,138,0.6)'
          edgeAttrs.line.sourceMarker.stroke = 'rgba(85,188,138,0.6)'
          edgeAttrs.line.targetMarker.fill = 'rgba(85,188,138,0.6)'
          edgeAttrs.line.targetMarker.stroke = 'rgba(85,188,138,0.6)'
          edgeAttrs.line.stroke = 'rgba(85,188,138,0.6)'
          edge.setAttrs(edgeAttrs)
        }
      })
    },
    testProcess () {
      const allNodes = this.graph.getNodes()
      const randomNum1 = random(0, 8)
      const randomNum2 = random(8, 13)
      allNodes.forEach((node, index) => {
        const nodeData = node.getData()
        let content = {}
        if (nodeData.nodeType === 'step') {
          if (index === randomNum1 || index === randomNum2) {
            content = {
              id: node.id,
              status: 'Failed'
            }
            this.responseCallback(content)
          } else {
            content = {
              id: node.id,
              status: 'Success'
            }
            this.responseCallback(content)
          }
        }
      })
    },
    onConnected (frame) {
      // MQ订阅频道
      const topic = '/exchange/reporter/instance.' + this.instanceObj.instanceId
      this.client.subscribe(topic, this.responseCallback, this.onFailed)
      // 触发模组执行接口
      return new Promise((resolve, reject) => {
        instanceApi(this.instanceObj).then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.executeSign = true
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },
    onFailed (frame) {
      this.connect()
      this.$message.error(frame)
    },
    responseCallback (frame) {
      // // 获取MQ的数据，并处理
      const message = JSON.parse(frame.body)
      // const message = frame
      if ('terminate' in message && message.terminate) {
        this.client.disconnect()
        this.executeSign = false
        this.$message.success('流程执行结束！')
        // frame.ack()
      } else {
        const currentCell = this.graph.getCellById(message.id)
        // 设置单个节点的状态
        if (message.status === 'Running') {
          currentCell.setData({ status: 'Running' })
        } else if (message.status === 'Success') {
          currentCell.setData({ status: 'Success' })
          // 获取该节点所有边
          const connectedEdges = this.graph.getConnectedEdges(currentCell)
          if (connectedEdges.length) {
            connectedEdges.forEach((edgeCell, index) => {
              const sourceCellId = edgeCell.getSourceCellId()
              if (sourceCellId === message.id) {
                const edgeAttrs = cloneDeep(edgeCell.getAttrs())
                edgeAttrs.line.sourceMarker.fill = '#55BC8A'
                edgeAttrs.line.sourceMarker.stroke = '#55BC8A'
                edgeAttrs.line.targetMarker.fill = '#55BC8A'
                edgeAttrs.line.targetMarker.stroke = '#55BC8A'
                edgeAttrs.line.stroke = '#55BC8A'
                edgeAttrs.line.strokeDasharray = 0
                edgeAttrs.line.style = {
                  animation: ''
                }
                edgeCell.setAttrs(edgeAttrs)
              }
            })
          }
        } else if (message.status === 'Failed') {
          currentCell.setData({ status: 'Failed' })
          // 获取该节点所有边
          const connectedEdges = this.graph.getConnectedEdges(currentCell)
          if (connectedEdges.length) {
            connectedEdges.forEach((edgeCell, index) => {
              const sourceCellId = edgeCell.getSourceCellId()
              if (sourceCellId === message.id) {
                const edgeAttrs = cloneDeep(edgeCell.getAttrs())
                edgeAttrs.line.sourceMarker.fill = '#AB2F29'
                edgeAttrs.line.sourceMarker.stroke = '#AB2F29'
                edgeAttrs.line.targetMarker.fill = '#AB2F29'
                edgeAttrs.line.targetMarker.stroke = '#AB2F29'
                edgeAttrs.line.stroke = '#AB2F29'
                edgeAttrs.line.strokeDasharray = 0
                edgeAttrs.line.style = {
                  animation: ''
                }
                edgeCell.setAttrs(edgeAttrs)
              }
            })
          }
        }
        // frame.ack()
      }
    },
    connect () {
      // 连接MQ
      if (this.client === null || !this.client.connected) {
        const wsServer = `${location.protocol === 'https'
          ? 'wss' : 'ws'}://${process.env.NODE_ENV === 'production'
          ? location.host : process.env.VUE_APP_MQ_URL}/ws`
        const ws = new WebSocket(wsServer)
        // 获得Stomp client对象
        this.client = Stomp.over(ws)
        this.client.debug = null
        const headers = {
          login: process.env.VUE_APP_MQ_USERNAME,
          passcode: process.env.VUE_APP_MQ_PASSWORD
        }
        this.client.connect(headers, this.onConnected, this.onFailed)
      } else {
        console.log('当前处于连接状态', this.client)
      }
    },
    ValueInputEvent (paramDict, index) {
      this.modParamsInfo = cloneDeep(paramDict)
      this.paramIndex = index
      this.is_valueInput = true
    },
    onInstanceObjParam (data) {
      this.instanceObj.params[this.paramIndex] = data
      this.is_valueInput = false
    },
    addSchduleEvent () {
      /*
      * 创建调度任务
      * */
      // 组装请求表单
      const scheduleForm = cloneDeep(scheduleObj)
      scheduleForm.mod.id = this.modObj._id
      scheduleForm.mod.name = this.modObj.name
      scheduleForm.plan = this.plan
      scheduleForm.user = this.$store.getters.getInfo.userName
      // 判断模组参数的值是否存在为空的情况
      let isParamsSatisfy = true
      this.instanceObj.params.forEach((val, key) => {
        scheduleForm.mod.params.push(cloneDeep(val))
        // 排查模组参数是否存在没有设置值的情况
        if (!val.value.length) {
          isParamsSatisfy = false
        }
      })
      if (isParamsSatisfy && this.plan.when !== '') {
        // 满足条件，发起创建请求
        return new Promise((resolve, reject) => {
          addScheduleApi(scheduleForm).then(response => {
            const { data } = response
            if (data.status === 'success') {
              this.$message.success(data.message)
              this.is_schedule = false
            } else {
              this.$message.error(data.message)
            }
          }).catch(error => {
            this.$message.error(error.response.message)
          })
        })
      } else {
        this.$message.error('请为模组参数或任务配置设置值')
      }
    },
    onClickFilter () {
      this.detail_dialog = true
      if (this.outputParamData.collect['模型'].indexOf('"') === -1 && this.filter_sign === false) {
        this.filter_sign = true
        const tempList = []
        for (const i of this.outputParamData.collect['模型']) {
          const temp = i.split('"')
          tempList.push(temp[temp.length - 2])
        }
        this.outputParamData.collect['模型'] = tempList
      }
    }
  },
  beforeDestroy () {
    if (this.client) {
      this.client.disconnect()
    }
  }
}
</script>

<style scoped>
.view-height {
  height: calc(100vh - 84px)
}
.view-max-height {
  max-height: calc(100vh - 84px) !important
}
.width-adapt {
  margin-top: 8px !important;
  width: 100% !important;
}
.mod-img {
  background-color: #f9fbfd;
  background-repeat: no-repeat;
  background-size: 100% auto;
  border-radius: 4px 4px 0 0;
  background-image: url(~@/assets/images/background/login-background-01.png);
}
.item-hover-style:hover {
  background-color: #242e42 !important;
  color: #ffffff !important;
}
/deep/ .jv-container .jv-code.boxed {
  max-height: 500px !important;
  font-family: "PingFang SC", "Lantinghei SC", "Helvetica Neue", Helvetica, Arial, "Microsoft YaHei", 微软雅黑, STHeitiSC-Light, simsun, 宋体, "WenQuanYi Zen Hei", "WenQuanYi Micro Hei", sans-serif;
  font-size: 12px;
}
/deep/ .mod-json .jv-container .jv-code.boxed {
  max-height: 325px !important;
  font-family: "PingFang SC", "Lantinghei SC", "Helvetica Neue", Helvetica, Arial, "Microsoft YaHei", 微软雅黑, STHeitiSC-Light, simsun, 宋体, "WenQuanYi Zen Hei", "WenQuanYi Micro Hei", sans-serif;
  font-size: 12px;
}
/deep/ .t-drawer__header {
  padding-right: 0px !important
}
</style>
