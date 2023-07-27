<template>
  <div style="display: grid;grid-template-columns: 1fr 4fr 1fr;letter-spacing: 1px" class="view-height">
    <div class="bg-mod-card rounded-sm" style="display: flex;flex-direction: column;flex-wrap: nowrap;padding: 16px 8px 8px 16px">
      <t-image :src="leftTopImg" style='background-size: cover'/>
      <div style="flex: 1 1 6%">
        <div class="font-main">
          <div style="font-size: 12px">构件池
          </div>
        </div>
        <t-row class="justify-between" style="margin: 6px 0 6px 0;">
          <t-col :span="12">
            <t-input-adornment :prepend="protocolSelect">
              <t-input v-model="filter" />
            </t-input-adornment>
          </t-col>
        </t-row>
      </div>
      <div style="flex: 2 1 64%; position: relative;contain: strict;">
        <div style="height: 100% !important; width: 100% !important;overflow: auto;" class="scrollbar-style">
          <div style="padding: 7px 6px;" v-for="(service, key) in filterData" v-bind:key="key" nodeType="step" @mousedown="createNode($event, service)">
            <i class="category-service-style category-service-size" :style="{ backgroundColor: serviceCategoryColor[service.category] }"></i>
            <span style="letter-spacing: 1px" class="text-xs">{{ service.name }}</span>
          </div>
        </div>
      </div>
      <div style="flex: 1 1 4%;padding: 20px 6px 4px 0px">
        <div class="font-main">
          <div style="font-size: 12px; display: inline-block">模组参数</div>
          <t-button style="font-size: 12px; float: right;" shape="circle" variant="text" @click="is_edit = true"><add-icon slot="icon" /></t-button>
        </div>
      </div>
      <div style="flex: 2 1 26%;position: relative;contain: strict;">
        <div style="height: 100% !important; width: 100% !important;position: relative;overflow: auto"  class="scrollbar-style">
          <div style="padding: 7px 6px;" v-for="(param, key) in modObj.params" v-bind:key="key" nodeType="param" @mousedown="createNode($event, param)">
            <i class="category-service-style category-param-size"></i>
            <span style="letter-spacing: 1px; font-size: 12px">{{ param.name }}</span>
            <span class="text-mod-body" style="float: right"><span>{{ param.type }}</span><span v-if="param.tag">:{{ param.tag }}</span></span>
          </div>
        </div>
      </div>
    </div>
    <div style="display: flex;flex-direction: column; padding: 8px; margin-left: 8px" class="bg-mod-card rounded-sm view-max-height">
      <div id="modX6" style="flex: 1;" class="width-adapt rounded-sm"></div>
    </div>
    <div style="display: flex;flex-direction: column;flex-wrap: nowrap; padding: 0px 0px 0px 8px;">
      <div class="bg-mod-card rounded-sm w-full h-full pl-4">
        <div class="py-4">
          <t-button variant="text" @click="backTo">
            <chevron-left-icon slot="icon" />
            返回
          </t-button>
        </div>
        <div>
          <t-popup :overlayInnerStyle="{ width: '350px', textAlign: 'center' }">
            <div class="BaseInfo-name text-mod-title font-semibold">{{ modObj.name }}</div>
            <!-- <t-space slot="content">触发元素是指触发浮层内容显示的元素</t-space> -->
            <template #content>
              <t-input-adornment prepend="模组名称">
                <t-input v-model="modObj.name">
                </t-input>
              </t-input-adornment>
            </template>
          </t-popup>
        </div>
        <div>
          <t-popup placement="bottom" :overlayInnerStyle="{ width: '350px', textAlign: 'center' }">
            <div style="letter-spacing: 1px;font-size: 12px" class="text-mod-body">{{ modObj.description }}</div>
            <!-- <t-space slot="content">触发元素是指触发浮层内容显示的元素</t-space> -->
            <template #content>
              <t-input-adornment prepend="描述">
                <t-textarea v-model="modObj.description" />
              </t-input-adornment>
            </template>
          </t-popup>
        </div>
        <div class="pt-4">
          <t-button @click="saveMod" theme="primary" shape="round">
            保存
          </t-button>
        </div>
        <div class="py-4">
          <div class="h6 q-pb-sm text-mod-title py-4">详情</div>
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
              {{ dateFormat(modObj.createdAt) }}
            </t-col>
            <t-col :span="4" class="p-2 text-mod-body" style="font-size: 12px">
              更新时间:
            </t-col>
            <t-col :span="8" class="p-2 text-mod-body" style="font-size: 12px">
              {{ dateFormat(modObj.updatedAt) }}
            </t-col>
          </t-row>
        </div>
      </div>
      <div class="py-4 bg-mod-card">
        <t-image fit="contain" :src="rightBottomImg" style='background-size: cover;'/>
      </div>
    </div>
    <t-dialog :destroyOnClose="true" width="40%" :visible.sync="is_edit" header="模组参数" :cancelBtn="null" :confirm-btn="null" :footer="false">
      <div>
        <div style="display: flex; flex-direction: row; flex-wrap: wrap">
          <div
              style="position: relative"
              v-for="(item, index) in modObj.params"
              :key='index + "12"'>
                <div style="cursor:pointer;padding: 4px 8px 4px 8px" @click="editParam(item)">
                  <div style="background-color: rgb(1,47,75); color: white;display: inline-block; padding: 4px 8px;border: 1px solid rgb(1,47,75);border-radius: 5px 0px 0px 5px">{{ item.name }}
                  </div>
                  <div style="background-color: white;color: #012f4b;border: 1px solid rgb(1,47,75);border-radius: 0px 3px 3px 0px;display: inline-block;padding: 4px 8px;border: 1px solid rgba(36,46,66,0.2)">
                    {{ item.type }}
                    <span v-if="item.tag">
                      : {{ item.tag }}
                    </span>
                  </div>
                </div>
                <close-circle-filled-icon style="position: absolute; bottom: 28px; right: 2px; color: red" @click="removeParamter(index, item)"></close-circle-filled-icon>
          </div>
        </div>
        <t-button theme="primary" @click="addParam" block class="mt-2">
          <add-icon slot="icon" />
        </t-button>
        <t-dialog :destroyOnClose="true" :closeOnOverlayClick="false" :closeOnEscKeydown="false" width="30%" :visible.sync="paramDialog" header="新增参数" :cancelBtn="null" :confirm-btn="null" :footer="false">
          <comp-entrance :paramsForm="modParamsForm" @addParameter="onParamsComp" paramSign="mod"></comp-entrance>
        </t-dialog>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import CompEntrance from '../paramSelect_pro/compEntrance'
import ModStatus from '@/components/modComp/modStatus'
import workImg from '@/assets/images/work.png'
import homeImg from '@/assets/images/Home.png'
import { InputInitObj, OrderInitObj, CellInitObj, modObj } from '../utils/dataObject'
import { Dnd } from '@antv/x6-plugin-dnd'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { thumbStyleOfMenu } from '@/Layout/components/BaseContent/ThumbStyle'
import { updateModApi, getModApi } from '@/api/modServer/mod'
import { getServiceListApi } from '@/api/modServer/service'
import { formatterDate } from '@/utils/index'
import { X6Graph, EventListener } from '../utils/antvX6'
import { Register } from '../utils/register'
import { Utils } from '../utils/utils'
import { cloneDeep } from 'lodash'
import { AddIcon, CloseCircleFilledIcon, ChevronLeftIcon } from 'tdesign-icons-vue'
export default {
  name: 'detail',
  components: {
    ModStatus,
    CompEntrance,
    AddIcon,
    CloseCircleFilledIcon,
    ChevronLeftIcon
  },
  data () {
    return {
      filter: '',
      rightBottomImg: workImg,
      leftTopImg: homeImg,
      servicesData: [],
      serviceCategoryOptions: [
        {
          label: '执行器',
          data: [],
          value: '执行器'
        },
        {
          label: '转换器',
          data: [],
          value: '转换器'
        },
        {
          label: '触发器',
          data: [],
          value: '触发器'
        },
        {
          label: '逻辑器',
          data: [],
          value: '逻辑器'
        }
      ],
      serviceCategoryModel: '执行器',
      serviceCategoryColor: {
        执行器: '#55a532',
        转换器: '#4FC1E9',
        触发器: '#FF9933',
        逻辑器: '#AB2F29'
      },
      protocolSelect: () => (
        <t-select autoWidth v-model={this.serviceCategoryModel} options={this.serviceCategoryOptions} />
        // <t-select
        //   autoWidth
        //   options={['执行器', '转换器', '触发器', '逻辑器'].map((value) => ({ label: value, value }))}
        //   defaultValue="执行器"
        // />
      ),
      // 模组参数数据
      paramDialog: false,
      fromPath: '',
      modId: '',
      modObj: cloneDeep(modObj),
      thumbStyleOfMenu,
      modParamsForm: InputInitObj('string'),
      is_edit: false,
      initScale: 1,
      graph: null,
      selectCell: null,
      node: null
    }
  },
  created () {
    this.initMod()
  },
  mounted () {
    // 注册antv/X6
    this.registerX6()
    // 获取构件数据
    this.getServiceList()
    // 初始antv/x6画布
    this.initGraph()
  },
  computed: {
    dateFormat () {
      // 格式化时间
      return function (date) {
        return formatterDate(date)
      }
    },
    filterData () {
      if (this.filter) {
        return this.servicesData.filter(item => item.name.indexOf(this.filter) > -1)
      }
      return this.servicesData
    },
    onDarkTheme () {
      return this.$store.getters.getModDarkTheme
    }
  },
  watch: {
    serviceCategoryModel: {
      // 监听构件类型变化，加载相应数据
      handler (newval, oldvalue) {
        if (newval === null) {
          // 将所有分类的data展开合并
          this.servicesData = [].concat(...this.serviceCategoryOptions.map(item => {
            return item.data
          }))
        } else {
          this.servicesData = this.serviceCategoryOptions.filter(item => {
            return item.value === newval
          })[0].data
        }
      },
      deep: true
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
      registerObj.registerModStepNode()
    },
    initGraph () {
      const modX6Id = document.getElementById('modX6')
      const graph = new X6Graph(modX6Id).createGrapher()
      this.graph = graph
      // 引入多个节点\线的监听事件
      this.graphOnEvent(modX6Id)
      // 监听节点选中事件
      this.graph.on('cell:click', data => {
        this.selectCell = data.cell
      })
      // 注册构件拖拽事件
      this.dnd = new Dnd({
        target: this.graph,
        scaled: false,
        animation: true
      })
      this.graph.zoom(-0.2)
      // 绑定Delete快捷键
      this.graph.use(
        new Keyboard({
          enabled: true,
          global: true
        })
      )
      this.graph.bindKey('delete', () => { this.deleteCell() })
    },
    graphOnEvent (modX6Id) {
      const GraphEvent = new EventListener(this.graph, modX6Id)
      // 鼠标悬停节点，显示连接桩
      GraphEvent.onNodeMouseenter()
      // 鼠标移开节点，隐藏连接桩
      GraphEvent.onNodeMouseleave()
      // 节点连接事件
      GraphEvent.connectedEvent()
      // 边移除事件
      GraphEvent.removedEdgeEvent()
      // 鼠标移到边时的事件
      GraphEvent.mouseenterEdgeEvent()
      // 鼠标移开边时的事件
      GraphEvent.mouseleaveEdgeEvent()
    },
    initMod () {
      // 获取指定modId的模组信息数据
      this.modId = this.$route.params.modId
      return new Promise((resolve, reject) => {
        getModApi(this.modId).then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.modObj = data.data
            this.renderNode()
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.data.message)
        })
      })
    },
    renderNode () {
      // 在antv/x6画布上添加节点和边
      this.modObj.cells.forEach((item) => {
        if (item.component) {
          item.shape = item.component
        }
        if (item && item.ports && item.ports.items) {
          item.ports.items.forEach((val) => {
            if (val && val.attrs) {
              val.attrs.text = ''
            }
          })
        }
      })
      this.graph.fromJSON({ cells: this.modObj.cells })
    },
    createNode (e, nodeObj) {
      const nodePorts = []
      // 获取拖拽出来的节点类型
      const target = e.currentTarget
      nodeObj.nodeType = target.getAttribute('nodeType')
      const utilsObj = new Utils()
      if (nodeObj.nodeType === 'step') {
        // 输入桩的初始位置定位
        let portPositionY = 34
        const portPositionX = -16
        // 输入桩数据
        nodeObj.input.forEach((element, index) => {
          portPositionY += 46
          // 初始输入桩的数据格式
          element.args.x = portPositionX
          element.args.y = portPositionY
          element.index = index

          // 存在默认值的情况，设置参数的值，并设置连接状态
          utilsObj.setInputValue(element)
          nodePorts.push(cloneDeep(element))
        })

        // 计算顺序桩的位置
        portPositionY += 46
        // 初始化顺序桩信息
        const orderData = cloneDeep(OrderInitObj)
        orderData.args.x = portPositionX
        orderData.args.y = portPositionY

        // 输出桩数据
        // nodeObj.output.attrs = {
        //   text: { text: nodeObj.output.type }
        // }
        // 计算输出桩的位置
        nodeObj.output.args.x = 250
        nodeObj.output.args.y = 76 + (nodeObj.input.length) * 24
        nodePorts.push(cloneDeep(nodeObj.output))
        nodePorts.push(orderData)
      } else {
        // 节点是模组参数的情况
        nodeObj.group = 'out'
        // nodeObj.attrs = {
        //   text: { text: nodeObj.type }
        // }
        // 计算输出桩的位置
        nodeObj.args.x = 250
        nodeObj.args.y = 33
        utilsObj.setInputValue(nodeObj)
        nodePorts.push(cloneDeep(nodeObj))
      }
      nodeObj.ports = nodePorts
      // 添加节点
      this.addNode(nodeObj)
      // 创建拖拽节点
      this.dnd.start(this.node, e)
    },
    addNode (nodeObj) {
      // 计算节点的高度
      let nodeHeight = 0
      if (nodeObj.nodeType === 'step') {
        nodeHeight = 80 + (nodeObj.input.length + 1) * 70
      } else {
        nodeHeight = 50
      }
      // 初始化antv/x6的节点信息，并创建相应的节点
      const cellObjValue = {
        nodeHeight: nodeHeight,
        nodeObj: nodeObj,
        nodeName: 'mod-node-pro',
        paramName: 'param-node-pro',
        visibility: 'visible'
      }
      const cellObj = cloneDeep(CellInitObj(cellObjValue))
      this.node = this.graph.createNode(cellObj)
    },
    deleteCell () {
      // 节点删除事件
      if (this.selectCell) {
        if (this.graph.isNode(this.selectCell)) {
          // 获取被删节点的所有边
          const connectedEdges = this.graph.getConnectedEdges(this.selectCell)
          if (connectedEdges.length) {
            for (let i = 0; i < connectedEdges.length; i++) {
              this.graph.removeEdge(connectedEdges[i], { triggerByFunction: true })
            }
          }
          this.graph.removeCell(this.selectCell)
          this.selectCell = null
        }
      }
    },
    saveMod () {
      let isSatisfy = true
      // 模组表单格式
      const modData = {
        name: this.modObj.name,
        description: this.modObj.description,
        author: this.$store.getters.getInfo.userName,
        params: this.modObj.params,
        steps: [],
        orders: [],
        cells: this.graph.toJSON().cells,
        release: false
      }
      // 获取所有边
      const allEdges = this.graph.getEdges()
      allEdges.forEach((edge, index) => {
        const edgeData = edge.getData()
        edgeData.id = edge.id
        edgeData.edgeCell = edge.toJSON()
        modData.orders.push(edgeData)
      })
      // 获取所有节点
      const allNodes = this.graph.getNodes()
      for (let i = 0; i < allNodes.length; i++) {
        const nodeData = allNodes[i].getData()
        const nodePortList = allNodes[i].getPorts()
        // 节点数据格式
        const stepObj = {
          id: allNodes[i].id,
          type: nodeData.nodeType,
          serviceid: allNodes[i].shape === 'param-node-pro' ? '' : nodeData._id,
          params: [],
          output: nodeData.output,
          nodeCell: allNodes[i].toJSON()
        }
        if (allNodes[i].shape === 'param-node-pro') {
          nodeData.data = nodeData.value
          stepObj.output = nodeData
        }
        nodePortList.forEach((port, index) => {
          if (port.group === 'in') {
            if (!port.source) {
              isSatisfy = false
            }
            if (port.source === 'mod') {
              const modParamCell = this.graph.getCellById(port.value[0])
              const modParamCellData = modParamCell.getData()
              const modParamIndex = this.modObj.params.findIndex(v => v.name === modParamCellData.name && v.type === modParamCellData.type)
              port.value = [modParamIndex]
            }
            stepObj.params.push(cloneDeep(port))
          }
        })
        nodeData.ports = cloneDeep(nodePortList)
        allNodes[i].setData(nodeData, { overwrite: true })
        modData.steps.push(cloneDeep(stepObj))
      }
      if (isSatisfy) {
        return new Promise((resolve, reject) => {
          updateModApi(this.modObj._id, modData).then(response => {
            const { data } = response
            if (data.status === 'success') {
              this.$message.success('更新模组成功')
              this.backTo()
            } else {
              this.$message.error(data.message)
            }
          }).catch(error => {
            this.$message.error(error)
          })
        })
      } else {
        this.$message.error('保存失败，存在某些节点的输入为空')
      }
    },
    scaleView (e, flag) {
      // antv/x6画布扩大和缩小事件
      e.preventDefault()
      if (flag === 'up') {
        this.initScale = 0.1
      } else {
        this.initScale = -0.1
      }
      this.graph.zoom(this.initScale)
    },

    backTo () {
      // 返回到模组列表页
      this.fromPath = window.sessionStorage.getItem('fromPath')
      this.$router.push({ path: this.fromPath })
    },
    getServiceList () {
      // 请求用户列表接口
      return new Promise((resolve, reject) => {
        getServiceListApi({ page: 1, page_size: 200 }).then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.servicesData = data.data.list
            this.filterServices()
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },
    filterServices () {
      this.servicesData.forEach((item, key) => {
        switch (item.category) {
          case '执行器': this.serviceCategoryOptions[0].data.push(item); break
          case '转换器': this.serviceCategoryOptions[1].data.push(item); break
          case '触发器': this.serviceCategoryOptions[2].data.push(item); break
          case '逻辑器': this.serviceCategoryOptions[3].data.push(item); break
          default: console.log('该构件没有类别：', item); break
        }
      })
    },
    // ===== 模组参数添加/移除事件 =====
    onParamsComp (data) {
      if (!data.name) {
        this.$message.error('参数名称不能为空！')
      } else {
        if (!this.modObj.params.length) {
          this.modObj.params.push(cloneDeep(data))
        } else {
          // 判断新增的模组参数是否已存在，存在则更新，不存在则添加
          for (let i = 0; i < this.modObj.params.length; i++) {
            if (this.modObj.params[i].name !== data.name) {
              if (this.modObj.params.length === (i + 1)) {
                this.modObj.params.push(cloneDeep(data))
              }
            } else {
              this.modObj.params[i] = cloneDeep(data)
              break
            }
          }
        }
        this.paramDialog = false
      }
    },
    removeParamter (index, param) {
      const confirmDia = this.$dialog.confirm({
        header: '删除模组参数',
        theme: 'warning',
        body: '删除该模组参数，将同时删除已编排的参数节点，是否确认删除？',
        confirmBtn: '确定',
        cancelBtn: '取消',
        onConfirm: ({ e }) => {
          this.graph.getNodes().forEach((cell, index) => {
          // 遍历画布内的所有节点，获取删除参数的节点id
            const elemtData = cell.getData()
            if (elemtData.nodeType === 'param' && elemtData.name === param.name && elemtData.type === param.type) {
              const connectedEdges = this.graph.getConnectedEdges(cell)
              if (connectedEdges.length) {
                // 初始化与该模组参数节点相连的节点输入桩
                for (let i = 0; i < connectedEdges.length; i++) {
                  const targetCell = connectedEdges[i].getTargetCell()
                  const targetCellPortId = connectedEdges[i].getTargetPortId()
                  targetCell.removePortProp(targetCellPortId, 'value')
                  targetCell.setPortProp(
                    targetCellPortId,
                    {
                      connected: false,
                      source: '',
                      value: []
                    }
                  )
                }
              }
              this.graph.removeCell(cell)
            }
          })
          this.modObj.params.splice(index, 1)
          confirmDia.destroy()
        },
        onClose: ({ e, trigger }) => {
          confirmDia.hide()
        }
      })
    },
    addParam () {
      this.paramDialog = true
      this.modParamsForm = InputInitObj('string')
      this.modParamsForm.nodeType = 'mod'
    },
    editParam (item) {
      this.modParamsForm = item
      this.paramDialog = true
    }
  }
}
</script>

<style scoped>
  .add-param-style:hover {
    background-color: #242e42 !important;
    color: #fff;
  }
  .param-select-style:hover {
    background-color: #242e42 !important;
    color: #fff !important;
  }
  .view-height {
    height: calc(100vh - 84px)
  }
  .view-max-height {
    max-height: calc(100vh - 84px) !important
  }
  .width-adapt {
    width: 100% !important;
  }
  .category-service-style {
    display: inline-block;
    margin-right: 8px;
    margin-top: 4px;
    vertical-align: top !important;
  }
  .category-service-size {
    width: 10px;
    height: 10px;
    border-radius: 1px;
  }
  .category-param-size {
    width: 10px;
    height: 10px;
    border-radius: 1px;
    background-color: #242E42;
  }
  .scrollbar-style::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 2px;  /*高宽分别对应横竖滚动条的尺寸*/
  }
  .scrollbar-style::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    /*box-shadow   : inset 0 0 5px rgba(236, 229, 229, 0.16);*/
    background   : rgba(83, 83, 83, 0.4);
  }
  .scrollbar-style::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    /*box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);*/
    border-radius: 50px;
    background   : #ededed;
  }
</style>
