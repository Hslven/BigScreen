<template>
  <div>
    <div style="display: grid;grid-template-columns: 1fr 4fr;letter-spacing: 1px" class="view-height">
      <div style="display: flex;flex-direction: column;flex-wrap: nowrap;" class="mr-4">
        <div class="bg-mod-card rounded-sm w-full h-full pl-4">
          <div class="py-4">
            <t-button variant="text" @click="backTo">
              <chevron-left-icon slot="icon" />
              返回
            </t-button>
          </div>
          <div>
            <div class="BaseInfo-name text-mod-title">{{ modObj.mod.name }}</div>
          </div>
          <div>
            <div style="letter-spacing: 1px;font-size: 12px" class="text-mod-body">{{ modObj.mod.description }}</div>
          </div>
          <div class="py-4">
            <div class="h6 text-mod-title py-4">详情</div>
            <t-row>
              <t-col :span="4" class="p-2 text-mod-body" style="font-size: 12px">
                执行者:
              </t-col>
              <t-col :span="8" class="p-2 text-mod-body" style="font-size: 12px">
                {{ modObj.userid }}
              </t-col>
              <t-col :span="4" class="p-2 text-mod-body" style="font-size: 12px">
                状态:
              </t-col>
              <t-col :span="8" class="p-2 text-mod-body" style="font-size: 12px">
                <mod-status :status="modObj.status"></mod-status>
              </t-col>
              <t-col :span="4" class="p-2 text-mod-body" style="font-size: 12px">
                执行时间:
              </t-col>
              <t-col :span="8" class="p-2 text-mod-body" style="font-size: 12px">
                {{ dateData(modObj.createdAt) }}
              </t-col>
            </t-row>
            <div class="h6 text-mod-title pt-4">模组参数</div>
            <div>
              <div style="max-height: 330px; overflow: auto">
                <div
                  class="item-hover-style px-4 py-2 my-2"
                  v-for="(param, index) in modObj.params"
                  v-bind:key="index"
                  style="border-radius: 5px; margin: 8px 12px 8px 0; font-size: 12px; background-color: #eff4f9"
                >
                  <div>
                    <div>{{ param.name }}</div>
                    <!-- <span>{{ param.type }}</span><span v-if="param.tag">:{{ param.tag }}</span> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="display: flex;flex-direction: column;" class="view-max-height">
        <div style="display: flex; justify-content: center; align-items: center">
          <div class="w-full card-content-style rounded-sm" style="background-color: #242e42 !important; padding-bottom: 12px;">
            <t-tag theme="success" class="ml-4 mt-3">执行记录</t-tag>
          </div>
        </div>
        <div style="flex: 1;" id="modX6" class="width-adapt rounded-sm"></div>
      </div>
    </div>
    <t-drawer :visible.sync="result_dialog" :closeBtn="false" :showOverlay="false" size="26%">
      <template #header>
        <div class="mod-img p-4">
          <div class="BaseInfo-name">{{ clickStep.name }}</div>
          <div style="color: #57727F;letter-spacing: 1px;font-size: 12px">{{ clickStep.description }}</div>
        </div>
      </template>
      <div class="py-4">
        <div class="h6 text-mod-title pb-4">详情</div>
        <t-row>
          <t-col :span="4" class="p-2 text-mod-body" style="font-size: 12px">
            执行结果:
          </t-col>
          <t-col :span="8" class="p-2 text-mod-body" style="font-size: 12px">
            <mod-status :status="clickStep.status"></mod-status>
          </t-col>
          <!-- <t-col :span="12" class="p-2 text-mod-body" style="font-size: 12px" v-if="data_check">
            <t-button variant="outline" @click="onClickFilter">
              详情
            </t-button>
          </t-col> -->
        </t-row>
        <component height="700px" :is="resultDisplay" :outputParamData="resultData"></component>
      </div>
      <template #footer>
        <t-button variant="outline" @click="result_dialog = false">关闭</t-button>
      </template>
    </t-drawer>
  </div>
</template>

<script>
import { getModLogApi, getServiceDetailApi } from '@/api/modServer/mod'
import { formatterDate } from '@/utils/index'
import { thumbStyle } from '@/Layout/components/BaseContent/ThumbStyle'
import { X6Graph } from '../utils/antvX6'
import { Register } from '../utils/register'
import { modObj, modExtra } from '../utils/dataObject'
import { ChevronLeftIcon } from 'tdesign-icons-vue'
// import { paramDisplayDict } from '@/assets/dict/dict'
import ModStatus from '@/components/modComp/modStatus'
import { cloneDeep } from 'lodash'
export default {
  name: 'detail',
  components: {
    ModStatus,
    ChevronLeftIcon,
    GeneralDisplayComp: () => import('../Dispalyor/generalDisplayComp')
  },
  data () {
    return {
      // 仅在data_check下显示按钮
      data_check: false,
      filter_sign: false,
      detail_dialog: false,
      result_dialog: false,
      resultData: '结果',
      // is_params: false,
      dialogData: null,
      thumbStyle,
      tab: 'mod',
      fromPath: '',
      modLogId: '',
      clickStep: {},
      resultDisplay: 'generalDisplayComp',
      modObj: cloneDeep({ ...modObj, ...modExtra }),
      instanceId: '',
      graph: null
    }
  },
  created () {
    this.initMod()
  },
  mounted () {
    this.registerX6()
    this.initGraph()
  },
  computed: {
    dateData () {
      return function (date) {
        return formatterDate(date)
      }
    },
    timeInterval () {
      // 求时间间隔
      return function (endTime, startTime) {
        const endData = new Date(endTime)
        const startData = new Date(startTime)
        const date3 = endData.getTime() - startData.getTime()
        const leave1 = date3 % (24 * 3600 * 1000)
        const hours = Math.floor(leave1 / (3600 * 1000))
        const leave2 = leave1 % (3600 * 1000)
        const minutes = Math.floor(leave2 / (60 * 1000))
        const leave3 = leave2 % (60 * 1000)
        const seconds = Math.round(leave3 / 1000)
        return hours + ' 小时 ' + minutes + ' 分钟 ' + seconds + ' 秒 '
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
      registerObj.registerModLogStepNode()
    },
    initMod () {
      this.modLogId = this.$route.params.instanceId
      return new Promise((resolve, reject) => {
        getModLogApi(this.modLogId, this.$route.query.modId).then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.modObj = data.data
            // 模组参数去重
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
          cell.nodeCell.shape = 'mod-log-node-pro'
          cell.nodeCell.data.status = cell.status
        } else {
          cell.nodeCell.shape = 'param-node-pro'
        }
        cell.nodeCell.ports.groups.out.attrs.circle.style.visibility = 'hidden'
        cell.nodeCell.ports.groups.in.attrs.circle.style.visibility = 'hidden'
        this.graph.addNode(cell.nodeCell)
      })
      // 在antv/x6画布上添加边
      this.modObj.orders.forEach((cell, index) => {
        this.graph.addEdge(cell.edgeCell)
      })
      // 渲染边状态
      this.edgeStatus()
    },
    edgeStatus () {
      const allNodes = this.graph.getNodes()
      allNodes.forEach((node, index) => {
        const nodeData = node.getData()
        if (nodeData.nodeType === 'param') {
          const connectedEdges = this.graph.getConnectedEdges(node)
          if (connectedEdges.length) {
            connectedEdges.forEach((edgeCell, index) => {
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
            })
          }
        } else {
          if (nodeData.status === 'Success') {
            // 获取该节点所有边
            const connectedEdges = this.graph.getConnectedEdges(node)
            if (connectedEdges.length) {
              connectedEdges.forEach((edgeCell, index) => {
                const sourceCellId = edgeCell.getSourceCellId()
                if (sourceCellId === node.id) {
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
          } else if (nodeData.status === 'Failed') {
            // 获取该节点所有边
            const connectedEdges = this.graph.getConnectedEdges(node)
            if (connectedEdges.length) {
              connectedEdges.forEach((edgeCell, index) => {
                const sourceCellId = edgeCell.getSourceCellId()
                if (sourceCellId === node.id) {
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
          } else {
            // 获取该节点所有边
            const connectedEdges = this.graph.getConnectedEdges(node)
            if (connectedEdges.length) {
              connectedEdges.forEach((edgeCell, index) => {
                const sourceCellId = edgeCell.getSourceCellId()
                if (sourceCellId === node.id) {
                  const edgeAttrs = cloneDeep(edgeCell.getAttrs())
                  edgeAttrs.line.sourceMarker.fill = '#00bbec'
                  edgeAttrs.line.sourceMarker.stroke = '#00bbec'
                  edgeAttrs.line.targetMarker.fill = '#00bbec'
                  edgeAttrs.line.targetMarker.stroke = '#00bbec'
                  edgeAttrs.line.stroke = '#00bbec'
                  edgeAttrs.line.strokeDasharray = 5
                  edgeAttrs.line.style = {
                    animation: 'ant-line 30s infinite linear'
                  }
                  edgeCell.setAttrs(edgeAttrs)
                }
              })
            }
          }
        }
      })
    },
    initGraph () {
      const modX6Id = document.getElementById('modX6')
      const graph = new X6Graph(modX6Id).createActuator()
      this.graph = graph
      this.graph.zoom(-0.4)
      this.graph.hideGrid()
      this.graphOnEvent()
    },
    graphOnEvent () {
      this.graph.on('node:click', ({ node }) => {
        const nodeData = node.getData()
        if (nodeData.nodeType === 'step') {
          this.result_dialog = true
          this.clickStep = nodeData
          return new Promise((resolve, reject) => {
            getServiceDetailApi(this.modLogId, node.id).then(response => {
              const { data } = response
              if (data.status === 'success') {
                this.resultData = data.data.output
                if (this.resultData.options.tag === 'dataCheck') {
                  this.data_check = true
                }
              } else {
                this.$message.error(data)
              }
            }).catch(error => {
              this.$message.error(error)
            })
          })
        }
      })
    },
    backTo () {
      this.fromPath = window.sessionStorage.getItem('fromPath')
      this.$router.push({ path: this.fromPath })
    }
    // onClickFilter () {
    //   this.detail_dialog = true
    //   if (this.resultData.data.collect['模型'].indexOf('"') === -1 && this.filter_sign === false) {
    //     this.filter_sign = true
    //     const tempList = []
    //     for (const i of this.resultData.data.collect['模型']) {
    //       const temp = i.split('"')
    //       tempList.push(temp[temp.length - 2])
    //     }
    //     this.resultData.data.collect['模型'] = tempList
    //   }
    // }
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
  background-size: cover;
  border-radius: 4px 4px 0 0;
  background-image: url(~@/assets/images/background/login-background-01.png);
}
/deep/ .jv-container .jv-code.boxed {
  max-height: 500px !important;
}
/deep/ .t-drawer__header {
  padding-right: 0px !important
}
/* .q-dia1 {
  padding: 0;
  max-width: 1500px;
  min-height: 1000px;
} */
</style>
