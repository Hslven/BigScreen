<!-- eslint-disable vue/no-unused-components -->
<template>
  <div>
    <div style="width: 100%;
    height: 90vh; position: relative" id="screen">
      <div id="stencil"></div>
      <div id="container"></div>
      <div id="screen-select" style="position: absolute; right: 0%; top: 1%">
        <t-row :gutter="20" style="width: 500px">
          <t-col :span="6" class="group1">
            <t-select
              class="pool"
              v-model="currentSourcePool"
              :options="graphListOptions"
              @change="changeGraph"
              hideAfterItemClick
              :popup-props="{ attach: '#big-screen' }"
              trigger="click"
            />
          </t-col>
          <t-col :span="6">
            <t-select
              class="time"
              v-model="intervalUnit"
              @change="changeTime"
              :options="intervalOptions"
              :popup-props="{ attach: '#big-screen' }"
            />
          </t-col>
        </t-row>

        <!-- <t-row>
          <t-col :span="12">
            <t-button @click="saveTo">获取当前图表数据</t-button>
            <t-button @click="fullScreen">全屏</t-button>
          </t-col>
        </t-row> -->
      </div>
      <div
        id="minimap"
        style="position: absolute; left: 0%; bottom: 1%;z-index:9"
      ></div>
      <div style="position: absolute; right: 0%; bottom: 1%" class="legend">
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
<code>右键</code>拖动画布
<code>ctrl + 鼠标滚轮</code>放大缩小</pre>
        </t-row>
      </div>
      <div>
        <t-dialog
          :visible.sync="dialog.edgeForm"
          :footer="false"
          :header="false"
          showInAttachedElement
        >
          <t-form :data="formData" ref="form" @submit="onSubmit">
            <t-form-item label="资源端口" v-show="formData.type == 'edge0'">
              <t-select
                v-model="formData.edgePort0"
                :options="sourcePortOptions"
                placeholder="请选择资源端口"
                empty="请先选择资源池"
              />
            </t-form-item>
            <t-form-item label="资源端口" v-show="formData.type == 'edge1'">
              <t-select
                v-model="formData.edgePort1"
                :options="sourcePortOptions"
                placeholder="请选择资源端口"
                empty="请先选择资源池"
              />
            </t-form-item>

            <t-form-item label="流">
              <t-input
                ref="edgeLabel"
                v-model="formData.edgeLabel"
                placeholder="请输入大小"
                clearable
              ></t-input>
            </t-form-item>

            <t-row>
              <t-col :span="10"></t-col>
              <t-col :span="2">
                <t-button theme="primary" type="submit">确定</t-button>
              </t-col>
            </t-row>
          </t-form>
        </t-dialog>

        <t-dialog
          :visible.sync="dialog.nodeForm"
          :header="false"
          :footer="false"
          showInAttachedElement
        >
          <t-form :data="formData" @submit="onSubmitNode">
            <t-form-item label="资源池" name="nodeText">
              <t-select
                v-model="formData.nodeText"
                :options="sourcePoolOptions"
                placeholder="请选择云解决方案"
                :keys="{ label: 'alias', value: 'alias' }"
              />
            </t-form-item>
            <t-form-item label="资源设备" v-show="formData.type == 'edge0'">
              <t-select
                v-model="formData.edgeDevice0"
                :options="sourceDeviceOptions"
                placeholder="请选择资源设备"
                empty="请先选择资源池"
              />
            </t-form-item>
            <t-row>
              <t-col :span="10"></t-col>
              <t-col :span="2">
                <t-button ref="com" id="com" theme="primary" type="submit"
                  >确定</t-button
                >
              </t-col>
            </t-row>
          </t-form>
        </t-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import createGraph from './createGraph/graph'
// import graphEvent from './createGraph/event'
import { line } from './createGraph/lineStyle.js'

import {
  getPortData,
  getViewByResourcePool,
  getViewName,
  // 保存与更新接口
  saveOrUpdate
} from '@/api/monitor/bigScreen'
const INITIAL_DATA = {
  edgeLabel: '0',
  edgeDevice: '',
  edgePort0: '',
  edgePort1: '',
  nodeText: '',
  type: '',
  edgePosition: {},
  nodePosition: { x: 400, y: 400 }
}
export default {
  components: {},
  data () {
    return {
      autoChange: null,
      IntervalTime: null,
      mouseMoveHandler: null,
      graph: null,
      edge: null,
      node: null,
      graphMove: null,
      dialog: {
        nodeForm: false,
        edgeForm: false,
        saveForm: false
      },
      formData: { ...INITIAL_DATA },
      sourceDeviceOptions: [],
      sourcePoolOptions: [],
      sourcePortOptions: [],
      graphListOptions: [],
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
      graphAllData: [],
      graphCurrentData: [],
      intervalUnit: '1m',
      currentSourcePool: '',
      isHiddenPort: false,
      loopGraph: 0,
      // 在加载后变成true开启监听时间获取间隔选项
      templateCalculagraph: false,
      testTime: 0,
      debounce: (func, wait) => {
        let timeout
        let previous = 0
        return function () {
          const context = this
          const args = arguments
          const now = Date.now()
          if (!previous) previous = now
          const remaining = wait - (now - previous)
          if (remaining <= 0) {
            if (timeout) {
              clearTimeout(timeout)
              timeout = null
            }
            previous = now
            func.apply(context, args)
          } else if (!timeout) {
            timeout = setTimeout(() => {
              previous = Date.now()
              timeout = null
              func.apply(context, args)
            }, remaining)
          }
        }
      }

    }
  },
  async mounted () {
    // const graph = createGraph('container', this)
    const graph = createGraph('container', this)

    this.edge = graph.getEdges()
    this.graph = graph

    /* setting Background */
    this.graph.drawBackground({
      position: 'center',
      size: '100% 100%'
      // image: require("../static/images/background.png"),
    })

    // getGraphList
    await this.getGraphList()
    // 传入第一个画布
    await this.changeGraph(this.graphListOptions[0].value)

    // 设置地图的线条框为正常显示
    document.querySelector('.x6-widget-minimap-viewport').style.width = '1px'
    document.querySelector('.x6-widget-minimap-viewport').style.height = '1px'
    // console.log(document.querySelector('#container').clientWidth)
    // console.log(document.querySelector('#container').clientHeight)
    // setTimeout(() => {
    //   console.log(document.querySelector('#container').clientWidth)
    //   console.log(document.querySelector('#container').clientHeight)
    // }, 10)
    this.graphMove = () => {
      console.log(1)
      if (this.autoChange) {
        // console.log('清除画布轮播')
        clearInterval(this.autoChange)
        this.autoChange = null
        // clearInterval(this.test)
        // this.testTime = 0
      }

      // 测试用
      // this.test = setInterval(() => {
      //   this.testTime += 3
      //   console.log(this.testTime, '流量视图切换画布，,', 1000 * 60 * 5 / this.graphListOptions.length, '后切换')
      // }, 3000)
      this.autoChange = setInterval(() => {
        // this.testTime = 0
        // console.log(this.graphListOptions, this.loopGraph)
        this.changeGraph(this.graphListOptions[this.loopGraph].value)
        // console.log(this.autoChange)
        if (this.loopGraph >= this.graphListOptions.length - 1) {
          this.loopGraph = 0
        }
        this.loopGraph += 1
      // }, 1000 * 60 * 5 / this.graphListOptions.length)
      }, 1000 * 60 * 5 / this.graphListOptions.length)
    }
    this.graphMove()
    // 监听用户鼠标移动，如果有则清空记时，如果没有则重新计时
    this.mouseMoveHandler = this.debounce(this.graphMove, 2000)
    window.addEventListener('mousemove', this.mouseMoveHandler)
  },
  activated () {
    // 切换画布定时
  },
  methods: {
    getGraphList () {
      /* get all graph list to graphListOptions and map graphListOptions */
      return getViewName().then((res) => {
        // console.log(res)
        // this.graphAllData = res.data
        // console.log(this.graphAllData)
        this.graphListOptions = res.data.data.map((item) => {
          return {
            label: item,
            value: item
          }
        })
        // console.log(this.graphListOptions)
      })
    },
    hiddenPort () {
      // this.isHiddenPort = !this.isHiddenPort
      const elements = document.querySelectorAll('.x6-port-in')
      // if (this.isHiddenPort) {
      elements.forEach((el) => {
        el.setAttribute('visibility', 'hidden')
        // })
        // } else {
        //   elements.forEach((el) => {
        //     el.setAttribute('visibility', 'visible')
      })
      // }
    },
    getPortInformation () {
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
      getPortData(params).then((res) => {
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
      }).finally(() => {
        loadingAttachInstance.hide()
        // console.log(this.graphCurrentData.viewCode.interval_updata_time)
        /* 端口数据成功请求后开始定时请求数据 */
        if (this.graphCurrentData.viewCode.interval_updata_time === 0) return
        this.calculagraph(this.graphCurrentData.viewCode.interval_updata_time)
        // 允许监听获取数据
        this.templateCalculagraph = true
      })
    },
    changeGraph (data, context) {
      const change = () => {
        this.graph.clearCells()
        const timeU = this.graphCurrentData.viewCode.interval_updata_time
        const watchUnit = (timeU) => {
          if (timeU >= 1000 * 60 * 60 * 24) {
            this.intervalUnit = timeU / 1000 / 60 / 60 / 24 + 'd'
          } else if (timeU >= 1000 * 60 * 60) {
            this.intervalUnit = timeU / 1000 / 60 / 60 + 'h'
          } else if (timeU >= 1000 * 60) {
            this.intervalUnit = timeU / 1000 / 60 + 'm'
          } else if (timeU >= 1000) {
            this.intervalUnit = timeU / 1000 + 's'
          } else if (timeU === 0) {
            this.intervalUnit = 'off'
          }
        }
        watchUnit(timeU)
        this.graphCurrentData.viewCode.intervalUnit = this.intervalUnit
        // console.log(
        //   this.graphCurrentData.viewCode.intervalUnit,
        //   this.intervalUnit,
        //   2
        // )

        // 视图加载数据
        this.currentSourcePool = data
        this.graph.fromJSON(this.graphCurrentData.viewCode)

        // 获取端口数据和颜色
        this.getPortInformation()

        // 选择视图后重置数据定时刷新计时
        this.calculagraph(this.graphCurrentData.viewCode.interval_updata_time)

        setTimeout(() => {
          this.hiddenPort()
        }, 400)
        return setTimeout(() => {
          this.graph.zoomToFit({ maxScale: 1 })
        }, 400)
      }
      return getViewByResourcePool({ viewName: data }).then((res) => {
        if (res.data.code === 0) {
          // 如果是生产环境
          this.graphCurrentData = res.data.data[0]
          this.graphCurrentData.viewCode = JSON.parse(
            res.data.data[0].viewCode
          )
          // console.log(this.graphCurrentData, 2)
          change()
        } else {
          this.$message.error({ content: res.data.msg, placement: 'center' })
        }
      })
    },
    //  修改时间获取间隔触发事件
    // Modify the time interval to trigger the event
    changeTime (data, content) {
      // data 5s 10s 30s 1m 5m 15m 30m 1h 2h 1d'
      // 存档数据库并且更新定时器
      if (!data) return
      this.graphCurrentData.viewCode.intervalUnit = data
      if (data === 'off') {
        console.log('off')
        if (this.IntervalTime) {
          clearInterval(this.IntervalTime)
        }
        this.graphCurrentData.viewCode.interval_updata_time = 0
      } else {
        this.graphCurrentData.viewCode.interval_updata_time = +data.substring(
          0,
          data.length - 1
        )
        const Unit = data.substring(data.length - 1)
        switch (Unit) {
        case 's':
          this.graphCurrentData.viewCode.interval_updata_time *= 1000
          break
        case 'm':
          this.graphCurrentData.viewCode.interval_updata_time *= 1000 * 60
          break
        case 'h':
          this.graphCurrentData.viewCode.interval_updata_time *=
              1000 * 60 * 60
          break
        case 'd':
          this.graphCurrentData.viewCode.interval_updata_time *=
              1000 * 60 * 60 * 24
          break
        }
      }
      // console.log(this.graphCurrentData)

      // 将视图代码转以及转换后的定时时间换成字符串更新到数据库
      const params = JSON.parse(JSON.stringify(this.graphCurrentData))
      params.viewCode = JSON.stringify(params.viewCode)
      saveOrUpdate(params).then(res => {
        if (res.data.code !== 0) {
          return this.$message.error({ content: res.data.msg, placement: 'center' })
        }
        // 开始定时任务
        if (this.templateCalculagraph) {
          this.calculagraph(this.graphCurrentData.viewCode.interval_updata_time)
        }
      })
    },
    // edge的提交
    onSubmit ({ validateResult, firstError }) {
      if (validateResult === true) {
        this.$message.success({ content: '提交成功', placement: 'center' })
        this.visible = false
      } else {
        this.$message.warning({ content: firstError, placement: 'center' })
      }
    },

    // node的提交
    onSubmitNode ({ validateResult, firstError }) {
      if (validateResult === true) {
        this.$message.success({ content: '提交成功', placement: 'center' })
        // 这是修改前使用的text
        // this.node.portProp("in", "attrs/text/text", this.formData.nodeText);
        // this.node.ports.groups.in.attrs.text.text = this.formData.nodeText;
        // 更新后使用label易于维护
        this.node.attr('label/text', this.formData.nodeText)

        this.visible2 = false
      } else {
        this.$message.warning({ content: firstError, placement: 'center' })
      }
    },
    //    定时    刷新    端口数据
    // Regulary refresh port data
    calculagraph (time) {
      if (this.IntervalTime) {
        clearInterval(this.IntervalTime)
      }
      if (this.graphCurrentData.viewCode.interval_updata_time === 0) return
      this.IntervalTime = setInterval((val) => {
        this.getPortInformation()
        console.log(this.graphCurrentData.viewCode.interval_updata_time)
      }, time)
    }
  },
  beforeDestroy () {
    console.log('off')
    // 监听鼠标移动重置定时(必须第一个清除)
    window.removeEventListener('mousemove', this.mouseMoveHandler)
    this.mouseMoveHandler = null
    setTimeout(() => {
      window.removeEventListener('mousemove', this.mouseMoveHandler)

      // 定时获取数据
      clearInterval(this.IntervalTime)
      // 定时刷新画布
      clearInterval(this.autoChange)
      this.autoChange = null
      this.IntervalTime = null
      console.log(this.autoChange)
      // 时间比节流的时间多一点
    }, 2100)
  },
  deactivated () {
    window.removeEventListener('mousemove', this.mouseMoveHandler)
    this.mouseMoveHandler = null
    setTimeout(() => {
      window.removeEventListener('mousemove', this.mouseMoveHandler)

      // 定时获取数据
      clearInterval(this.IntervalTime)
      // 定时刷新画布
      clearInterval(this.autoChange)
      this.autoChange = null
      this.IntervalTime = null
      console.log(this.autoChange)
      // 时间比节流的时间多一点
    }, 2100)
  }
}
</script>
<style scoped lang="scss">
body {
  user-select: none;
}

#container {
  transition: all 0.5s;
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

/* 整个滚动条 */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #f1f1f1;
}

::-webkit-scrollbar-button {
  background-color: #f1f1f1;
}

/* 滚动条上的滚动滑块 */
::-webkit-scrollbar-thumb {
  background-color: #000;
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
  height: 100%;
  z-index: 1;
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
  margin: 23px 4px;
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
  border-color: #54dcff;
}
::v-deep .t-input {
  color: #54dcff !important;
  border-radius: 0px !important;
  height: 40px !important;
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

:v-deep .x6-widget-stencil-group.collapsed {
  max-height: 60px !important;
}

code {
  background-color: #e9e9e9;
  color: #000;
  border: 3px solid #e9e9e9;
  border-radius: 5px;
  margin-right: 5px;
}

/deep/ .x6-widget-minimap {
  background-color: #183066!important;

}
</style>
