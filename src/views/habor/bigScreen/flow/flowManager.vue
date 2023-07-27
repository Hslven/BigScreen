<!-- newPersion--------test  -->
<template>
  <div id="flow_man">
    <div style="width: 100%;
    height: 90vh; position: relative" id="screen">
      <div id="container"></div>
      <div id="stencil"  ref="stencil" style="transition:all 1s">
      </div>
      <div style="position: absolute;
    left: -10px;
    z-index: 1;
    top: 49%;">
        <t-button shape="circle" theme="primary"  @click="()=>{
      this.btn = false
      $refs.stencil.style.transform = 'translateX(-300px)'
      }"
      v-show="this.btn"
      >
      <CaretLeftIcon />
    </t-button>
    <t-button shape="circle" theme="primary"  @click="()=>{
      this.btn = true
      $refs.stencil.style.transform = 'translateX(0px)'
      }"
      v-show="!this.btn"
      >
      <CaretRightIcon />
    </t-button>
      </div>
      <div id="screen-select" style="position: absolute; right: 2%; top: 3%">
        <t-row :gutter="20" style="width: 400px; justify-content: flex-end">
          <t-col :span="2">
            <!-- <t-popconfirm
              content="确认新建吗"
              theme="default"
              @visible-change="newGraph"
              placement="bottom"
            > -->
              <t-button variant="outline" ghost @click="newGraph">新建</t-button>
            <!-- </t-popconfirm> -->
          </t-col>
          <t-col :span="2">
            <t-button variant="outline" ghost @click="openTo()">打开</t-button>
          </t-col>
          <t-col :span="2">
            <t-button variant="outline" ghost @click="saveTo()">保存</t-button>
            <!-- <t-button variant="outline" ghost @click="test()">比较</t-button> -->
          </t-col>
          <t-col :span="2">
            <t-popconfirm
              content="确认清空吗"
              theme="default"
              @visible-change="clearTo"
              placement="bottom"
            >
              <t-button variant="outline" ghost
              >清空</t-button
              >
            </t-popconfirm>
          </t-col>
          <t-col :span="2">
            <t-popconfirm
              :content="popConfirmRenter1"
              theme="danger"
              @visible-change="removeTo"
              placement="left"
            >
              <t-button variant="outline" ghost :disabled="removeForm.disabled"
                >删除</t-button
              >
            </t-popconfirm>
          </t-col>
        </t-row>
        <t-row
          style="width: 400px; justify-content: flex-end; margin-top: 10px"
        >
          <!-- <t-popconfirm
            :content="popConfirmRenter2"
            theme="default"
            @visible-change="getPortInformation"
            placement="bottom"
          >
            <t-button
              variant="outline"
              ghost
              style="width: calc(23% + 3px); height: 40px"
              >测试数据</t-button
            >
          </t-popconfirm> -->
          <t-select
            class="time"
            style="width: 60%; padding: 0 7px"
            v-model="intervalUnit"
            :options="intervalOptions"
            :popup-props="{ attach: '#flow_man' }"
          />
          <!-- @change="graphCurrentData.intervalUnit = intervalUnit" -->
        </t-row>

      </div>
      <div style="position: absolute; right: 2%; bottom: 5%" class="legend">
        <t-row
          style="
            color: rgba(255, 255, 255, 0.6);
            padding: 5px;
            align-items: center;
          "
        >
          <t-col :span="6">图例</t-col>
          <div
            style="
              box-shadow: 0 0 3px 0px #7efffc;
              text-align: center;
              cursor: pointer;
              padding: 0 10px;
            "
            @click="graph.zoomToFit({ maxScale: 1 })"
          >
            ⚙居中
          </div>
          <!-- <div
            style="
              box-shadow: 0 0 3px 0px #7efffc;
              text-align: center;
              cursor: pointer;
              padding:0 10px;
            "
            v-show="!isHiddenPort"
            @click="hiddenPort"
            >隐藏</div
          > -->
        </t-row>
        <t-row
          style="
            color: rgba(255, 255, 255, 0.6);
            padding: 5px;
            align-items: center;
          "
        >
          <span class="default"></span>
          0-30%
        </t-row>
        <t-row
          style="
            color: rgba(255, 255, 255, 0.6);
            padding: 5px;
            align-items: center;
          "
        >
          <span class="danger"></span>

          30%-60%
        </t-row>
        <t-row
          style="
            color: rgba(255, 255, 255, 0.6);
            padding: 5px;
            align-items: center;
          "
        >
          <span class="error"></span>

          60%-100%
        </t-row>
        <t-row
          style="
            color: rgba(255, 255, 255, 0.6);
            padding: 5px;
            padding-bottom: 10px;
            align-items: center;
          "
        >
          <pre>
<code>Ctrl + C</code>复制
<code>Ctrl + X</code>剪切
<code>Ctrl + V</code>粘贴
<code>Ctrl + Z</code>撤销
<code>Shift + 左键</code>选择区域</pre>
        </t-row>
      </div>
      <div>
        <!-- edgeForm -->
        <t-dialog
          :visible.sync="edgeForm.dialog"
          :cancelBtn="null"
          :confirm-btn="null"
          width="650px"
          ref="edgeForm"
          :header="edgeForm.AOrZ + '端口配置' ||'端口配置'"
          showInAttachedElement
          class="flowDialog"
        >
          <t-form :rules="rules" @submit="onSubmitEdge" :data="edgeForm">
            <t-form-item :label="edgeForm.AOrZ + '设备' || '资源设备'">
              <h6 style="padding-top: 10px;color:#fff;font-weight: 100;box-shadow: 0px 3px #fff;">{{ nodeForm.nodeText|| nodeForm.temNodeText}}</h6>
            </t-form-item>
            <t-form-item :label="edgeForm.AOrZ + '端口' ||'资源端口'" v-show="edgeForm.type == 'edge0'">
              <t-select
                v-model="edgeForm.edgePort0"
                :options="edgeForm.resourcePortOptions"
                :popup-props="{ attach: '#flow_man' }"
                placeholder="请先设置资源配置"
                filterable
                />
                <!-- :disabled="edgeForm.disabled" -->
            </t-form-item>
            <t-form-item :label="edgeForm.AOrZ + '端口' ||'资源端口'" v-show="edgeForm.type == 'edge1'">
              <t-select
                v-model="edgeForm.edgePort1"
                :options="edgeForm.resourcePortOptions"
                :disabled="edgeForm.disabled"
                :popup-props="{ attach: '#flow_man' }"
                placeholder="请先设置资源配置"
                clearable
                filterable
              />
            </t-form-item>
            <!-- <t-form-item label="带宽大小">
              <t-input
                v-model="edgeForm.edgeLabel"
                :popup-props="{ attach: '#flow_man' }"
                placeholder="请输入大小"
                clearable
              ></t-input
              ><span style="color: #fff; width: 40px; text-align: center"
                >GB</span
              >
            </t-form-item> -->
            <t-row>
              <t-col :span="8"></t-col>
              <t-col :span="4">
                <t-row :gutter="20" style="text-align: right">
                  <t-col :span="8">
                    <t-button theme="primary" type="submit">确定</t-button>

                  </t-col>
                  <t-col :span="4">
                    <t-button
                      theme="default"
                      variant="base"
                      @click="edgeForm.dialog = false"
                      >取消</t-button
                    >
                  </t-col>
                </t-row>
              </t-col>
            </t-row>
          </t-form>
        </t-dialog>

        <!-- nodeForm -->
        <t-dialog
          :visible.sync="nodeForm.dialog"
          :header="node? node.data.device+'配置' : '设备配置'"
          :cancelBtn="null"
          :confirm-btn="null"
          width="650px"
          showInAttachedElement
          class="flowDialog"
        >
          <t-form @submit="onSubmitNode"  :rules="rules" :data="nodeForm">
            <t-form-item label="资源池"  >
              <t-select
              :popup-props="{ attach: '#flow_man' }"
              v-model="nodeForm.resource"
                placeholder="请先选择资源池"
                :options="nodeForm.resourcePoolOptions"
                @change="resourcePoolSelect"
                filterable
              />
            </t-form-item>
            <t-form-item label="设备名称">
              <t-select
                v-model="nodeForm.nodeText"
                :popup-props="{ attach: '#flow_man' }"
                placeholder="请先选择资源池"
                :options="nodeForm.nodeTextOptions"
                :disabled="nodeForm.nameDisabled"
                filterable
              />
              <!-- :options="nodeForm.nodeTextOptions" -->
            </t-form-item>
            <t-row>
              <t-col :span="8"></t-col>
              <t-col :span="4">
                <t-row :gutter="20" style="text-align: right">
                  <t-col :span="8">

                    <t-button theme="primary" type="submit">确定</t-button>

                  </t-col>
                  <t-col :span="4">
                    <t-button
                      theme="default"
                      variant="base"
                      @click="()=>{
                        nodeForm.dialog = false
                      }"
                      >取消</t-button
                    >
                  </t-col>
                </t-row>
              </t-col>
            </t-row>
          </t-form>
        </t-dialog>

        <!-- openForm -->
        <t-dialog
          :visible.sync="openForm.dialog"
          :cancelBtn="null"
          :confirm-btn="null"
          width="650px"
          header="选择界面"
          showInAttachedElement
          class="flowDialog"
        >
          <t-form @submit="onSubmitOpen">
            <t-form-item label="图分类">
              <t-select
                :options="openForm.groupOptions"
                :popup-props="{ attach: '#flow_man' }"
                hideAfterItemClick
                trigger="click"
                @change="openFormGroupSelectChange"
                v-model="openForm.group"
                placeholder="请选择图分类"
                filterable
              />
              <!-- @change="changeGraph" -->
              <!-- :keys="{ label: 'alias', value: 'alias' }" -->
            </t-form-item>
            <t-form-item label="图名字">
              <t-select
                :disabled="openForm.nameDisabled"
                :options="openForm.nameOptions"
                :popup-props="{ attach: '#flow_man' }"
                hideAfterItemClick
                trigger="click"
                v-model="openForm.name"
                placeholder="请先选择图分类"
                filterable
              />
              <!-- :keys="{ label: 'alias', value: 'alias' }" -->
            </t-form-item>

            <t-row>
              <t-col :span="8"></t-col>
              <t-col :span="4">
                <t-row :gutter="20" style="text-align: right">
                  <t-col :span="8">
                    <t-button theme="primary" type="submit">确定</t-button>

                  </t-col>
                  <t-col :span="4">
                    <t-button
                      theme="default"
                      variant="base"
                      @click="openForm.dialog = false"
                      >取消</t-button
                    >
                  </t-col>
                </t-row>
              </t-col>
            </t-row>
          </t-form>
        </t-dialog>

        <!-- saveForm -->
        <t-dialog
          :visible.sync="saveForm.dialog"
          :cancelBtn="null"
          :confirm-btn="null"
          width="650px"
          header="保存设置"
          showInAttachedElement
          class="flowDialog"
        >
          <t-form  @submit="onSubmitSave"  :data="saveForm" :rules="rules">
            <t-form-item label="资源池">
              <t-select
                v-model="saveForm.resourcePool"
                :popup-props="{ attach: '#flow_man' }"
                :options="saveForm.resourcePoolOptions"
                placeholder="请选择资源池"
                filterable
              />
              <!-- :keys="{ label: 'alias', value: 'alias' }" -->
            </t-form-item>
            <t-form-item label="图分类" help="支持直接输入来创建新的图分类">
              <t-select
                v-model="saveForm.group"
                :popup-props="{ attach: '#flow_man' }"
                :options="saveForm.groupOptions"
                placeholder="请选择或输入图分类"
                @create="createOptions"
                filterable
                creatable
              />
            </t-form-item>
            <t-form-item label="图名字">
              <t-input
                :disabled="saveForm.nameDisabled"
                clearable
                filterable
                v-model="saveForm.name"
                placeholder="请输入图名字"
              ></t-input>
            </t-form-item>
            <t-row>
              <t-col :span="8"></t-col>
              <t-col :span="4">
                <t-row :gutter="20" style="text-align: right">
                  <t-col :span="8">
                    <t-button theme="primary" type="submit">确定</t-button>
                  </t-col>
                  <t-col :span="4">
                    <t-button
                      theme="default"
                      variant="base"
                      @click="saveForm.dialog = false"
                      >取消</t-button
                    >
                  </t-col>
                </t-row>
              </t-col>
            </t-row>
          </t-form>
        </t-dialog>

        <!-- confirm -->
        <t-dialog
          :visible.sync="confirm.dialog"
          :cancelBtn="null"
          :confirm-btn="null"
          width="650px"
          header="是否保存文档"
          showInAttachedElement
          class="flowDialog"
        >
        <t-row style="margin-left: 0px;
    margin-right: 0px;
    color: #fff;
    font-size: 16px;
    padding: 20px 0px;">
          <ErrorCircleFilledIcon style="font-size: 21px;margin-right: 5px;"/>是否保存对“{{ this.graphCurrentData.viewName || "未命名视图" }}”的更改？
        </t-row>
            <t-row>
              <t-col :span="7"></t-col>
              <t-col :span="5">
                <t-row style="text-align: center">
                  <t-col :span="4">
                    <t-button theme="primary" @click="confirm.dialog=false;saveTo()">保存</t-button>
                  </t-col>
                  <t-col :span="4">
                    <t-button theme="default" variant="base" @click="unSaveTo(btnEvent)">不保存</t-button>
                  </t-col>
                  <t-col :span="4">
                    <t-button
                      theme="default"
                      variant="base"
                      @click="confirm.dialog = false"
                      >取消</t-button
                    >
                  </t-col>
                </t-row>
              </t-col>
            </t-row>
        </t-dialog>

      </div>
    </div>
  </div>
</template>
<script>
import createGraph from './createGraph/graph'
import graphEvent from './createGraph/event'
import createStencil from './createGraph/stencil'
import { line } from './createGraph/lineStyle.js'
import {
  // 获取视图所有数据包括代码
  // getViewByResourcePool,
  // 获得视图分类、不为空则获取视图名称
  getViewTypeOrViewName,
  // 获取流量视图
  // getViewName,
  // 获取对应端口数据以及颜色
  getPortData,
  // 保存与更新接口
  saveOrUpdate,
  // 删除接口
  viewDelete,
  // 根据资源池和设备类型获取设备列表
  getHostNameList,
  // 根据流量图名称和流量图类型查询流量图
  getViewByViewNameAndViewType
} from '@/api/monitor/bigScreen'
import {
  // 获取资源池
  getResourcePoolAPI
} from '@/api/monitor/opticalModule'
import { CaretLeftIcon, CaretRightIcon, ErrorCircleFilledIcon } from 'tdesign-icons-vue' // 获取全部图标的列表
import { isEqual, isEmpty } from 'lodash'
export default {
  components: {
    CaretLeftIcon, CaretRightIcon, ErrorCircleFilledIcon
  },
  data () {
    return {
      graph: null,
      edge: null,
      node: null,
      btn: true,
      btnEvent: '',
      intervalUnit: '5m',
      openForm: {
        dialog: false,
        group: '',
        name: '',
        groupOptions: [],
        nameOptions: [],
        nameDisabled: true
      },
      saveForm: {
        dialog: false,
        // 如果有打开图就会把id保存到这里，用于更新数据库
        id: '',
        group: '',
        groupOptions: [],
        name: '',
        resourcePool: '',
        resourcePoolOptions: [],
        nameDisabled: true
      },
      removeForm: {
        dialog: false,
        disabled: true
      },
      nodeForm: {
        dialog: false,
        // 资源池
        resource: '',
        // 设备名称
        nodeText: '',
        // 临时存放设备名称
        temNodeText: '',
        // 设备弹窗资源池选项
        resourcePoolOptions: [],
        // 设备弹窗设备名称选项
        nodeTextOptions: [],
        nameDisabled: true,
        nodePosition: { x: 400, y: 400 }
      },
      edgeForm: {
        dialog: false,
        // 判断端口1-2
        type: '',
        // 端口1名称
        edgePort0: '',
        // 端口2名称
        edgePort1: '',
        // 带宽大小
        edgeLabel: '0',
        // 端口选项
        resourcePortOptions: [],
        disabled: true,
        AOrZ: 'A端'
      },
      confirm: {
        dialog: false
      },
      // graphListOptions: [],
      intervalOptions: [
        { value: 'off' },
        { value: '5s' },
        { value: '10s' },
        { value: '30s' },
        { value: '1m' },
        { value: '5m' },
        { value: '15m' },
        { value: '30m' },
        { value: '1h' },
        { value: '2h' },
        { value: '1d' }
      ],
      graphCurrentData: [],
      graphOriginalData: [],
      // edgeForm表单添加规则无论怎么加都无法通过，取消规则
      rules: {
        nodeResource: [
          { required: true, message: '请选择资源池' }
        ],
        nodeText: [
          { required: true, message: '请选择设备名称' }
        ],
        edgePort0: [
          { required: true, message: '请选择端口名称' }
        ],
        edgePort1: [
          { required: true, message: '请选择端口名称' }
        ],
        saveName: [
          { required: true, message: '请选择图名字' }
        ]
      }
    }
  },
  async mounted () {
    /* Create the graph and the toolbar */
    const graph = createGraph('container', this, true)
    createStencil(graph, this)
    graphEvent(graph, this)
    // 获取资源池--保存和设备配置使用--加载一次就可以
    getResourcePoolAPI().then((res) => {
      if (res.data.code === 0) {
        this.nodeForm.resourcePoolOptions = res.data.data.map((item) => {
          return { label: item.alias, value: item.name }
        })
        this.saveForm.resourcePoolOptions = this.nodeForm.resourcePoolOptions
      } else {
        this.nodeForm.resourcePoolOptions = []
        this.$message.error({ content: res.data.msg, placement: 'center' })
      }
    })
    this.graph = graph
    /* setting Background */
    this.graph.drawBackground({
      position: 'center',
      size: '100% 100%'
    })
  },
  methods: {
    getViewGroup () {
      getViewTypeOrViewName().then((res) => {
        if (res.data.code === 0) {
          this.openForm.groupOptions = res.data.data.map((item) => {
            return {
              label: item,
              value: item
            }
          })
          this.saveForm.groupOptions = this.openForm.groupOptions
        } else {
          return this.$message.error({
            content: res.data.msg,
            placement: 'center'
          })
        }
      })
    },
    // 重置数据和设置
    // reset data and settings
    reset (boolean) {
      // 重置重要数据（删除和新建按钮才用这个）
      if (boolean) {
        this.saveForm.id = ''
        this.intervalUnit = '5m'
        this.graphCurrentData = []
      }
      // 重置数据
      this.graphCurrentData.viewCode = []
      this.saveForm.group = ''
      this.saveForm.resourcePool = ''
      this.saveForm.name = ''
      // 重置设置
      this.graph.clearCells()
      setTimeout(() => {
        this.graph.zoomTo(1)
        this.graph.centerContent()
      }, 110)
    },
    // 新建的点击
    // New click
    newGraph (_val, _context = {}) {
      this.btnEvent = 'new'
      if (this.equation()) {
        return (this.confirm.dialog = true)
      }
      this.reset(true)
      this.$message.success({ content: '新建成功', placement: 'center' })
    },
    // 删除的点击
    // Delete click
    removeTo (_val, context = {}) {
      this.btnEvent = 'delete'
      if (context && context.trigger !== 'confirm') return
      // console.log(this.equation())
      // 再次判断
      if (this.saveForm.id === '') {
        return this.$message.error({
          content: '当前没有图表数据',
          placement: 'center'
        })
      }
      // 删除数据库数据
      viewDelete([this.saveForm.id]).then((res) => {
        if (res.data.code === 0) {
          // 清空打开表单的变量
          this.openForm.group = ''
          this.openForm.name = ''
          this.openForm.nameOptions = []
          this.reset(true)
          this.$message.success({ content: '删除成功', placement: 'center' })
        } else {
          return this.$message.error({
            content: res.data.msg,
            placement: 'center'
          })
        }
      })
    },
    getPortInformation (_val, context = {}) {
      if (context && context.trigger !== 'confirm') return
      console.log(context)
      const loadingAttachInstance = this.$loading({
        attach: '#container',
        text: '接口数据加载中...',
        size: '40px'
      })
      /**
       * @param id 边的id
       * @param source 边对应的source节点的名称
       * @param target 边对应的target节点的名称
       * @param sourcePort 边对应source的端口
       * @param targetPort 边对应target的端口
       */
      const params = []
      const changeColor = (edge, color) => {
        // 文本框的颜色
        edge.prop('labels/0/attrs/labelBody/fill', color)
        edge.prop('labels/1/attrs/labelBody/fill', color)
        // 线条的颜色
        edge.attr('line/stroke', color)
        edge.attr('arrow/fill', color)
      }
      this.graph.getEdges().forEach((item, index) => {
        // 处理提供后端的数据
        params.push({
          id: item.id,
          source: this.graph.getCellById(item.source.cell).attrs.label.text,
          target: this.graph.getCellById(item.target.cell).attrs.label.text,
          sourcePort: item.labels[3].attrs.labelText.text,
          targetPort: item.labels[2].attrs.labelText.text
        })
      })
      // console.log(params)
      getPortData(params)
        .then((res) => {
          // console.log(res)
          if (res.data.code === 0) {
            const edges = res.data.data
            edges.forEach((item, index) => {
              // 写入数据和单位
              this.graph
                .getCellById(item.id)
                .prop(
                  'labels/0/attrs/labelText/text',
                  item.sourcePortData + item.dataUnit
                )
              this.graph
                .getCellById(item.id)
                .prop(
                  'labels/1/attrs/labelText/text',
                  item.targetPortData + item.dataUnit
                )
              // 写入端口
              this.graph
                .getCellById(item.id)
                .prop('labels/3/attrs/labelText/text', item.sourcePort)
              this.graph
                .getCellById(item.id)
                .prop('labels/2/attrs/labelText/text', item.targetPort)
              // 写入带宽
              this.graph.getCellById(item.id).data.bandWidth = item.bandWidth
              // 写入颜色
              if (item.dataProportion <= 30) {
                changeColor(this.graph.getCellById(item.id), line().default)
              } else if (
                item.dataProportion <= 60 &&
                item.dataProportion > 30
              ) {
                changeColor(this.graph.getCellById(item.id), line().danger)
              } else {
                changeColor(this.graph.getCellById(item.id), line().error)
              }
            })
          } else {
            this.$message.error({ content: res.data.msg, placement: 'center' })
          }
        })
        .finally(() => {
          loadingAttachInstance.hide()
        })
    },
    // 线条的提交
    // edgeForm submission
    onSubmitEdge ({ validateResult, firstError }) {
      if (validateResult === true) {
        // 显示端口
        if (this.edgeForm.type === 'edge0') {
          if (this.edgeForm.edgePort0.trim() === '') return this.$message.warning({ content: '请选择端口名称', placement: 'center' })
          this.edge.prop(
            'labels/3/attrs/labelText/text',
            this.edgeForm.edgePort0.trim()
          )
        } else if (this.edgeForm.type === 'edge1') {
          if (this.edgeForm.edgePort1.trim() === '') return this.$message.warning({ content: '请选择端口名称', placement: 'center' })

          this.edge.prop(
            'labels/2/attrs/labelText/text',
            this.edgeForm.edgePort1.trim()
          )
        }
        // 修改带宽
        this.edge.prop('data/bandWidth', this.edgeForm.edgeLabel)
        // this.$message.success({ content: '提交成功', placement: 'center' })

        this.edgeForm.dialog = false
        this.graphCurrentData.viewCode = JSON.stringify(this.graph.toJSON().cells)
      } else {
        this.$message.warning({ content: firstError, placement: 'center' })
      }
    },

    // 节点表单的提交
    // nodeForm submission
    onSubmitNode ({ validateResult, firstError }) {
      if (validateResult === true) {
        // 这是修改前使用的text
        // this.node.portProp("in", "attrs/text/text", this.nodeForm.nodeText);
        // this.node.ports.groups.in.attrs.text.text = this.nodeForm.nodeText;
        if (this.nodeForm.nodeText.trim() === '') return this.$message.warning({ content: '请选择设备名称', placement: 'center' })
        // 更新后使用label易于维护
        this.node.attr('label/text', this.nodeForm.nodeText)
        this.edgeForm.disabled = false
        this.nodeForm.dialog = false
        // 清空当前节点的data.text，用于判断是否选了值，用于渲染线条表单的对应设备名称
        // 和点击节点的时候，如果不为空则显示默认设备名称（TOR交换机），如果为空则显示当前的设备名
        this.node.data.text = ''
        // this.$message.success({ content: '提交成功', placement: 'center' })
        this.graphCurrentData.viewCode = JSON.stringify(this.graph.toJSON().cells)
      } else {
        this.$message.warning({ content: firstError, placement: 'center' })
      }
    },
    // 节点表单资源池的选择
    // nodeForm resourcePool select
    resourcePoolSelect (_value) {
      this.nodeForm.nodeText = ''
      const params = {
        resourcePool: this.nodeForm.resource,
        device: this.node.data.device
      }
      getHostNameList(params).then(res => {
        console.log(res.data.data)
        if (res.data.code === 0) {
          this.nodeForm.nodeTextOptions = res.data.data.map((item) => {
            return { label: item, value: item }
          })
          this.$nextTick(() => {
            // 在这里检查 nodeForm.nodeTextOptions 的长度
            if (this.nodeForm.nodeTextOptions.length === 0) {
              this.nodeForm.nameDisabled = true
            } else {
              this.nodeForm.nameDisabled = false
            }
          })
        } else {
          this.nodeForm.nodeTextOptions = []
          this.nodeForm.nodeText = ''
          this.nodeForm.nameDisabled = false
          this.$nextTick(() => {
            this.nodeForm.nameDisabled = true
          })
          this.$message.error({ content: res.data.msg, placement: 'center' })
        }
      }).catch(() => {
        this.nodeForm.nodeTextOptions = []
        this.nodeForm.nodeText = ''
        this.$nextTick(() => {
          this.nodeForm.nameDisabled = true
        })
        this.$message.error({ content: '获取失败', placement: 'center' })
      })
    },
    // 清空的点击
    // clear clcik
    clearTo (_val, context = {}) {
      if (context && context.trigger !== 'confirm') return
      this.btnEvent = 'clear'
      this.reset()
    },
    // 保存的点击
    // save click
    saveTo () {
      this.btnEvent = 'save'
      // 视图不为空打开
      if (JSON.stringify(this.graph.toJSON().cells) === '[]') {
        return this.$message.warning({
          content: '当前没有图表数据',
          placement: 'center'
        })
      }
      // 获取图分类--打开和保存使用
      this.getViewGroup()
      this.saveForm.dialog = true
      // 如果存在id，代表打开了视图
      if (this.saveForm.id) {
        this.saveForm.resourcePool = this.graphCurrentData.resourcePool
        this.saveForm.group = this.graphCurrentData.viewType
        this.saveForm.name = this.graphCurrentData.viewName
      }
    },
    // 保存表单的提交
    // saveForm submitssions
    onSubmitSave () {
      // 拿到转换的时间获取间隔
      let intervalUpdataTime = +this.intervalUnit.substring(
        0,
        this.intervalUnit.length - 1
      )
      const Unit = this.intervalUnit.substring(this.intervalUnit.length - 1)
      switch (Unit) {
      case 's':
        intervalUpdataTime *= 1000
        break
      case 'm':
        intervalUpdataTime *= 1000 * 60
        break
      case 'h':
        intervalUpdataTime *= 1000 * 60 * 60
        break
      case 'd':
        intervalUpdataTime *= 1000 * 60 * 60 * 24
        break
      default:
        intervalUpdataTime = 0
        break
      }

      if (this.saveForm.name.trim() === '') {
        return this.$message.error({
          content: '请输入图名字',
          placement: 'center'
        })
      }
      // 如果打开了视图，部分按照视图原本的配置
      const data = {
        cells: this.graph.toJSON().cells,
        interval_updata_time: intervalUpdataTime,
        intervalUnit: this.intervalUnit
      }
      const params = {
        // 打开了视图会保存id，否则为空，有id会更新,没有id后端自增id并存入数据
        // 注意新建和删除需要清空这个id
        id: this.saveForm.id || '',
        resourcePool: this.saveForm.resourcePool,
        viewName: this.saveForm.name.trim(),
        viewType: this.saveForm.group,
        // 视图代码需要转换成字符串
        viewCode: JSON.stringify(data),
        operator: this.$store.getters.getInfo.userName
      }

      saveOrUpdate(params).then((res) => {
        if (res.data.code === 0) {
          this.graphCurrentData = params
          console.log(params, data)

          // 保存成功后端自动赋给id,请求接口获取id
          getViewByViewNameAndViewType({ viewName: params.viewName, viewType: params.viewType }).then((res) => {
            console.log('id获取', res)
            if (res.data.code === 0) {
              const result = res.data.data[0]
              if (result.length <= 0) {
                return this.$message.error({
                  content: '没有找到视图id',
                  placement: 'center'
                })
              }
              this.saveForm.id = result.id
              this.graphCurrentData.id = result.id
              // 存入原始数据用于判断是否修改
              this.graphOriginalData = JSON.parse(result.viewCode)
            }
          })
          this.saveForm.dialog = false
          // 保存的时候清空打开表单的数据,用于重新请求获得最新的视图选项
          this.openForm.nameOptions = []
          this.openForm.groupOptions = []
          this.openForm.group = ''
          this.openForm.name = ''
          this.openForm.nameDisabled = true

          this.$message.success({ content: res.data.msg, placement: 'center' })
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    // 不保存的点击
    // unsave click
    unSaveTo (event) {
      console.log(event)
      // this.reset(true)
      this.confirm.dialog = false
      if (event === 'open') {
        this.getViewGroup()
        this.openForm.dialog = true
      } else if (event === 'new') {
        this.reset(true)
        this.$message.success({ content: '新建成功', placement: 'center' })
      }
    },
    // 打开的点击
    // open click
    openTo () {
      this.btnEvent = 'open'
      // console.log(this.equation())
      if (this.equation()) {
        return (this.confirm.dialog = true)
      }
      // 获取图分类--打开和保存使用
      this.getViewGroup()
      this.openForm.dialog = true
    },
    // 选择图分类后触发的方法
    // Method triggered after selecting the graph category
    openFormGroupSelectChange (_value, _content) {
      // 获取图名称
      this.openForm.name = ''
      getViewTypeOrViewName({ viewType: _value })
        .then((res) => {
          if (res.data.code === 0) {
            this.openForm.nameOptions = res.data.data.map((item) => {
              return {
                label: item,
                value: item
              }
            })
          } else {
            return this.$message.error({
              content: res.data.msg,
              placement: 'center'
            })
          }
        })
        .catch((error) => {
          return this.$message.error({
            content: error,
            placement: 'center'
          })
        })
    },
    // 打开表单的提交
    // openForm submissions
    onSubmitOpen () {
      // if (JSON.stringify(this.graph.toJSON().cells) !== '[]') {
      //   return confirm('有尚未保存是否提交')
      //     ? this.saveTo() || this.graph.clearCells()
      //     : this.graph.clearCells()
      // }
      if (!this.openForm.name) {
        return this.$message.error({
          content: '请选择图名称',
          placement: 'center'
        })
      }
      // 获取视图数据
      // Get view data
      getViewByViewNameAndViewType({ viewName: this.openForm.name, viewType: this.openForm.group }).then((res) => {
        console.log(res.data)
        if (res.data.code === 0) {
          // 找到viewName等于openForm.group，viewType等于openForm.name的对象
          // const result = res.data.data.find((item) => {
          //   return (
          //     item.viewName === this.openForm.name &&
          //     item.viewType === this.openForm.group
          //   )
          // })
          const result = res.data.data[0]
          if (!result) {
            return this.$message.error({
              content: '没有找到视图',
              placement: 'center'
            })
          }
          // console.log(result)
          this.graphCurrentData = result
          this.saveForm.id = result.id
          // 清除视图数据
          this.graph.clearCells()
          // 导入视图数据
          this.graph.fromJSON(JSON.parse(result.viewCode))
          this.intervalUnit = JSON.parse(result.viewCode).intervalUnit
          this.edge = this.graph.getEdges()
          // this.getPortInformation()

          console.log(this.graphCurrentData)
          // 存入原始数据用于判断是否修改
          this.graphOriginalData = JSON.parse(result.viewCode)
          this.graph.zoomToFit({ maxScale: 1 })
          this.openForm.dialog = false
        } else {
          return this.$message.error({
            content: res.data.msg,
            placement: 'center'
          })
        }
      })
      // axios.get('http://localhost/graphList').then((res) => {
      //   this.graph.fromJSON(res.data[open.group])
      // })
    },
    // 需要在新建，打开的时候做判断
    equation () {
      // 返回false为没有修改
      // const result = JSON.stringify(JSON.parse(this.graphCurrentData.viewCode).cells)
      const result1 = this.graph.toJSON().cells
      console.log(isEmpty(result1), '导出的数据为空吗')
      // 如果他们长度不一样返回true，快速判断筛选掉大部分清空
      // if(result.length !== result1.length) return true
      // 如果视图清空，当前视图的id还在，则作为修改而不是没有修改
      // 这些if不能省略，因为不提前返回在第3、4个if会报错,前面2个if筛选了没有点击打开按钮的情况
      if (isEmpty(result1) && this.graphCurrentData.id) {
        console.log(2)
        return true
      } else if (isEmpty(result1) && !this.graphCurrentData.id) {
        console.log(3)
        return false
      } else if (!isEmpty(result1) && !this.graphCurrentData.id) {
        console.log(4)
        return true
      } else if (isEqual((JSON.parse(this.graphCurrentData.viewCode).cells), result1)) {
        console.log(5)
        return false
      }
      console.log(6)
      return true
    /*   const result = this.graph.toJSON().cells
      // 视图为空-没有修改
      if (JSON.stringify(result) === '[]') {
        return false
      }
      // 遍历当前cells里面每个对象position或者vertices[0]里的x和y是否相等
      // 相等-没有修改；不相等-有修改
      if (this.graphOriginalData.length === 0 && JSON.stringify(result) !== '[]') return true
      if (
        result.length === this.graphOriginalData.cells.length
      ) {
        for (let i = 0; i < result.length; i++) {
          if (result[i].position === undefined) {
            console.log(
              result[i].vertices[0].x,
              this.graphOriginalData.cells[i].vertices[0].x
            )

            if (
              result[i].vertices[0].x !==
                this.graphOriginalData.cells[i].vertices[0].x ||
              result[i].vertices[0].y !==
                this.graphOriginalData.cells[i].vertices[0].y
            ) {
              return true
            }
          } else if (
            result[i].position.x !==
              this.graphOriginalData.cells[i].position.x &&
            result[i].position.y !==
              this.graphOriginalData.cells[i].position.y
          ) {
            return true
          }
        }
      }
      // 有修改
      return true */
    },
    popConfirmRenter1 () {
      return (<div>该操作会删除当前图表数据<br />是否确认删除</div>)
    },
    popConfirmRenter2 () {
      return (<div>根据对应的设备配置<br/>和端口配置获取端口数据</div>)
    },
    popConfirmRenter3 () {
      return (<h3 style="color:#f59400">是否保存当前视图</h3>)
    },
    createOptions (value) {
      this.saveForm.groupOptions.push({
        value,
        label: value
      })
      console.log(value)
    }
    /*     test () {
      // 查找这两个不相等的地方输出出来
      const result = JSON.stringify(JSON.parse(this.graphCurrentData.viewCode).cells)
      const result1 = JSON.stringify(this.graph.toJSON().cells)
      console.log(result)
      console.log(result1)
      console.log('是否相等:', result === result1)
      console.log('长度：', result.length, result1.length)
      // 不相等的地方
      if (result.length === result1.length) {
        for (let i = 0; i < result.length; i++) {
          if (result[i] !== result1[i]) {
            console.log('不通的地方：', result[i], result[i + 1], result[i + 2], '位置：', i)
          }
        }
      }
    } */
  },
  watch: {
    // 选择图分类解控图名称
    // Select the graph group to control the graph name
    'openForm.group' (newval) {
      if (!newval) {
        this.openForm.nameDisabled = true
      } else {
        this.openForm.nameDisabled = false
      }
    },
    'saveForm.group' (newval) {
      if (!newval) {
        this.saveForm.nameDisabled = true
      } else {
        this.saveForm.nameDisabled = false
      }
    },
    // 选择资源池解控设备名称
    // Select resource pool to control device name
    'nodeForm.resource' (newval) {
      if (!newval) {
        this.nodeForm.nameDisabled = true
      }
    },
    // 获取id解控删除按钮
    // Get id to control delete button
    'saveForm.id' (newval) {
      if (!newval) {
        this.removeForm.disabled = true
      } else {
        this.removeForm.disabled = false
      }
    }
  },

  beforeDestroy () {
    // clearInterval(this.IntervalTime)
    // addEventListener.remove(this.keySave)
  }
}
</script>
<style scoped lang="scss">
#container {
  transition: all 0.5s;
}
.hidden{
  transform: translateX(-300px);
  transition: transform 1s;
}
#flow_man {
  overflow: hidden;
  /deep/ .t-is-disabled {
    filter: brightness(0.4);
  }
  /deep/ .t-select-option {
    color: #fff;
  }
  /deep/ .t-select-option:not(.t-is-disabled):not(.t-is-selected):hover {
    background-color: var(--td-bg-color-container-hover);
    color: #003582 !important;
  }
  /deep/ .t-select-option.t-is-selected {
    color: #003582 !important;
  }
  .t-drawer__content-wrapper {
    background-color: #f5f5f5;
    box-shadow: none;
    border-left: 1px solid #dfe3e8;
  }
  .t-drawer__content-wrapper {
    border: none;
  }
  .drawer_active {
    position: absolute;
    top: 50%;
    right: 34%;
    width: 50px;
    padding: 15px 14px 15px 7px;
    padding-top: -2px;
    height: 56px;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s;
  }

  .t-input {
    border-radius: 0 !important;
  }
  .legend {
    background-color: #152242;
    padding: 10px 30px;
    padding-bottom: 0;
    opacity: 0.8;
    box-shadow: 0 0 5px 1px #152242;
  }
  .legend div {
    font-size: 12px;
  }
  .legend span {
    position: relative;
    width: 40px;
    height: 2px;
    background-color: #83fffe;
    margin-right: 15px;
  }
  .legend span::before {
    content: "";
    position: absolute;
    right: 35%;
    top: -4px;
    border: 5px solid #83fffe;
    border-radius: 50%;
  }
  .legend .danger {
    background-color: #ffc97a;
  }
  .legend .danger::before {
    border: 5px solid #ffc97a;
  }
  .legend .error {
    background-color: #dd5b5b;
  }
  .legend .error::before {
    border: 5px solid #dd5b5b;
  }

  /* stencil */
  #stencil {
    position: absolute;
    width: 300px;
    height: 99%;
    z-index: 1;
    top: 5px;
  }
  ::v-deep .x6-widget-stencil {
    /* display: none; */
    background: none !important;
  }
  /* 设备图例 */
  ::v-deep .x6-widget-stencil-title {
    display: none;
  }
  ::v-deep .x6-widget-stencil-group-title {
    padding-left: 44px !important;
    // margin: 23px 4px;
    margin-bottom: 0;
    width: 98% !important;
    font-size: 14px !important;
    color: #fff !important;
    background: url("~@/assets/images/screen/flow/title.png") no-repeat !important;
  }
  ::v-deep .x6-widget-stencil-group-title::before {
    /* background-color: #000!important; */
    background-image: none !important;
  }
  ::v-deep .x6-widget-stencil-content {
    top: 0 !important;
    transition: all 0.4s;
    background-color: rgba(17, 34, 69, 0.6);
  }

  ::v-deep .t-input.t-is-readonly {
    background-color: transparent !important;
    color: #fff !important;
  }
  ::v-deep .t-input {
    border-radius: 0px !important;
    height: 40px !important;
    background-color: rgb(0, 53, 130);
  }
  ::v-deep .t-input__inner {
    font-size: 14px !important;
    color: white !important;
    letter-spacing: 2px;
  }
  ::v-deep .time .t-input__prefix::before {
    content: "刷新间隔";
    padding-right: 18px;
    margin-left: 8px;
    letter-spacing: 2px;
  }
  ::v-deep .pool .t-input__prefix::before {
    content: "资源池";
    padding-right: 18px;
    margin-left: 8px;
    letter-spacing: 2px;
  }
  ::v-deep .t-input--focused {
    box-shadow: 0px 0px 0px 0px;
  }
  ::v-deep .t-input.t-input--suffix > .t-input__suffix-icon {
    font-size: 20px !important;
  }
  ::v-deep .t-input .t-input__suffix > svg {
    fill: #ffffff;
    margin-right: 8px;
  }

  ::v-deep .x6-graph {
    padding-bottom: 10px;
    box-sizing: content-box;
  }

  ::v-deep .x6-widget-stencil-group.collapsed {
    max-height: 60px !important;
  }

  code {
    background-color: #e9e9e9;
    color: #000;
    border: 3px solid #e9e9e9;
    border-radius: 5px;
    margin-right: 5px;
  }

  /deep/ .t-popup__content {
    // transform: translateX(2px);
    // margin-top: -10px;
    background-color: #255ba3;
  }

  #screen {
    background-image: url("~@/assets/images/screen/screen_bg.png");
    background-size: 100% 100%;

    /deep/ .t-dialog {
      background-color: #003582 !important;
    }
    /deep/ .t-dialog__header {
      color: white !important;
      background-image: url("~@/assets/images/screen/dialog_header.png");
      background-size: 100% 100%;
      border: 0px solid #000 !important;
      border-radius: 0px !important;
      height: 50px !important;
    }
    /deep/ .t-dialog__header-content {
      font-family: logo-font;
      font-size: 16px !important;
      letter-spacing: 4px;
    }
    /deep/ .t-dialog__close {
      border: 1px solid #c9e3ff !important;
      color: white !important;
      border-radius: 0px !important;
      width: 24px !important;
      height: 24px !important;
    }
    /deep/ .t-dialog__footer {
      background-color: #003582 !important;
      border-radius: 0px !important;
      background-image: url("~@/assets/images/screen/dialog_fotter.png") !important;
      background-size: 100% 100%;
      height: 20px !important;
    }

    /deep/ .t-form__label--right {
      color: #fff !important;
      padding-top: 4px;
      font-family: "din-bold";
    }
    /deep/ .t-dialog__body::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 10px;
      /*高宽分别对应横竖滚动条的尺寸*/
    }

    /depp/ .t-dialog__body::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      /*box-shadow   : inset 0 0 5px rgba(236, 229, 229, 0.16);*/
      background: #63a3fb;
    }

    /deep/ .t-dialog__body::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      /*box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);*/
      border-radius: 50px;
      background: #003582;
    }
    /deep/ .t-dialog__ctx.t-dialog__ctx--absolute {
      z-index: 99;
    }
    /deep/ .t-input__help{
      color: #eee;
      letter-spacing: 2px;
    }
  }
}

.flowDialog {
  /deep/ input.t-input__inner::placeholder {
    color: #fff;
  }
}
</style>
