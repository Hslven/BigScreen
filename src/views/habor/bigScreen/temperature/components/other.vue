<template>
  <div
    class="pb-4 temperatureComp_other"
    id="temperatureComp_other"
    style="overflow: hidden"
    v-if="Object.keys(echartParams).length > 0"
  >
    <div v-show="!screen">
      <!-- title -->
      <t-row class="py-4 pr-2" :gutter="5" style="align-items: center">
        <t-col :span="1" class="">
          <div @click="back" class="back">
            <img
              src="~@/assets/images/screen/temperatureComp/arrow_back.png"
              alt=""
              style="width: 45px; display: inline; margin: 0 15px"
            />
            <span class="panel-text">返回</span>
          </div>
        </t-col>
        <t-col :span="3" class="col-flex">
          <img
            src="~@/assets/images/screen/temperatureComp/arrow_white_left.png"
            alt=""
            style="
              width: 20px;
              display: inline;
              margin: 0 15px;
              transform: rotate(180deg);
            "
          />
          <span class="panel-text px-2">{{ echartParams.aliasName }}</span>
          <img
            src="~@/assets/images/screen/temperatureComp/arrow_white_left.png"
            alt=""
            style="width: 20px; display: inline; margin: 0 15px"
          />
        </t-col>
        <!-- <t-col
        :span="5"
        class="time"
        style="display: flex; justify-content: flex-end"
      >
        <t-time-picker
          format="HH:mm"
          v-model="timevalue"
          @change="handleTimeChange"
          class="big-screen-time-select"
          :popup-props="{ attach: '.big-screen-time-select' }"
          style="width: 244px !important"
        />
      </t-col> -->
        <t-col :span="3" class="group" :offset="5">
          <t-select
            v-model="currentGroup"
            :popupProps="popupProps"
            :options="[
              { label: '主机组', value: 'host' },
              { label: '模块组', value: 'modules' },
            ]"
            @change="changeGroup"
            hideAfterItemClick
            trigger="click"
          />
        </t-col>
      </t-row>
      <!-- contain -->
      <t-loading size="medium" :loading="loading" showOverlay>
        <t-row
          style="
            flex-wrap: nowrap;
            padding: 0 10px;
            justify-content: space-between;
          "
        >
          <t-row
            style="flex-wrap: nowrap; justify-content: space-around"
            v-show="currentGroup === 'host'"
            id="host"
            ref="containLeft"
          >
            <t-row style="flex-wrap: nowrap">
              <div>
                <t-row class="justify-center pb-4">
                  <div class="title-left">
                    <p class="title-text">
                      HA：{{ echartParams.leftPort.azName.split("|").pop() }}
                    </p>
                  </div>
                </t-row>
                <!-- box-left -->
                <div class="other-box" ref="otherBox">
                  <div
                    class="other-left-panel p-4"
                    v-for="(item, index) in echartParams.leftPort.panel"
                    :key="index"
                    @click.stop="beGoData(item, $event)"
                  >
                    <t-col>
                      <t-row>
                        <span class="panel-text">主机组</span>
                      </t-row>
                      <t-row>
                        <span class="panel__text">
                          {{ item.hostName.split("|").pop() }}
                        </span>
                      </t-row>
                      <t-row class="diamond">
                        <div>
                          <div style="display: flex">
                            <span
                              v-for="(_sum, index) in distribute(item).error"
                              :key="index"
                              :id="index"
                              class="error"
                            ></span>
                          </div>
                          <p class="status" v-show="item.error > 0">
                            {{ item.error }}
                          </p>
                        </div>
                        <div>
                          <div style="display: flex">
                            <span
                              v-for="(_sum, index) in distribute(item).danger"
                              :id="index"
                              :key="index"
                              class="danger"
                            ></span>
                          </div>
                          <p class="status" v-show="item.danger > 0">
                            {{ item.danger }}
                          </p>
                        </div>
                        <div>
                          <div style="display: flex">
                            <span
                              v-for="(sum, index) in distribute(item).default"
                              :id="index"
                              :key="index"
                              class="default"
                            ></span>
                          </div>
                          <p class="status" v-show="item.default > 0">
                            {{ item.default }}
                          </p>
                        </div>
                      </t-row>
                    </t-col>
                  </div>
                </div>
              </div>
              <!-- box-divider -->
              <t-divider
                v-show="currentGroup === 'host'"
                layout="vertical"
                style="border: 1px solid rgb(90, 103, 135); margin: 12px"
                :style="{ height: dividerHeight }"
              />
              <div>
                <t-row
                  class="justify-center pb-4"
                  v-if="currentGroup == 'host'"
                >
                  <div class="title-right">
                    <p class="title-text">
                      HA：{{ echartParams.rightPort.azName.split("|").pop() }}
                    </p>
                  </div>
                </t-row>
                <!-- box-right -->
                <div class="other-box">
                  <div
                    class="other-right-panel p-4"
                    v-for="(item, index) in echartParams.rightPort.panel"
                    :key="index"
                    @click.stop="beGoData(item, $event)"
                  >
                    <t-col>
                      <t-row>
                        <span class="panel-text">主机组</span>
                      </t-row>
                      <t-row>
                        <span class="panel__text">
                          {{ item.hostName.split("|").pop() }}
                        </span>
                      </t-row>
                      <t-row class="diamond">
                        <div>
                          <div style="display: flex">
                            <span
                              v-for="(_sum, index) in distribute(item)
                                .unrecoverable"
                              :key="index"
                              :id="index"
                              class="unrecoverable"
                            ></span>
                          </div>
                          <p class="status" v-show="item.unrecoverable > 0">
                            {{ item.unrecoverable }}
                          </p>
                        </div>
                        <div>
                          <div style="display: flex">
                            <span
                              v-for="(_sum, index) in distribute(item).error"
                              :key="index"
                              :id="index"
                              class="error"
                            ></span>
                          </div>
                          <p class="status" v-show="item.error > 0">
                            {{ item.error }}
                          </p>
                        </div>
                        <div>
                          <div style="display: flex">
                            <span
                              v-for="(_sum, index) in distribute(item).danger"
                              :id="index"
                              :key="index"
                              class="danger"
                            ></span>
                          </div>
                          <p class="status" v-show="item.danger > 0">
                            {{ item.danger }}
                          </p>
                        </div>
                        <div>
                          <div style="display: flex">
                            <span
                              v-for="(_sum, index) in distribute(item).default"
                              :id="index"
                              :key="index"
                              class="default"
                            ></span>
                          </div>
                          <p class="status" v-show="item.default > 0">
                            {{ item.default }}
                          </p>
                        </div>
                      </t-row>
                    </t-col>
                  </div>
                </div>
              </div>
            </t-row>
          </t-row>

          <t-row
            style="flex-wrap: nowrap; justify-content: space-around; z-index: 0"
            id="modules"
            v-show="currentGroup === 'modules'"
          >
            <t-row style="flex-wrap: nowrap">
              <div>
                <!-- box -->
                <t-swiper
                  :navigation="{ showSlideBtn: 'never' }"
                  :autoplay="false"
                  placement="outside"
                  direction="vertical"
                >
                  <t-swiper-item
                    v-for="(_swiper, swindex) in Math.ceil(
                      groupData.length / 24
                    )"
                    :key="swindex"
                  >
                    <div
                      style="
                        display: grid;
                        justify-content: space-between;
                        padding: 5px;
                        grid-template-columns: 1fr 1fr 1fr 1fr;
                        gap: 11px;
                        width: 1366px;
                        padding-bottom: 80px !important;
                      "
                      class="other-modules-box"
                    >
                      <div
                        v-for="(item, index) in groupData.slice(
                          24 * swindex,
                          24 * (swindex + 1)
                        )"
                        :key="index"
                        class="other-center-panel p-4"
                        @click.stop="beGoData(item, $event)"
                      >
                        <t-col>
                          <t-row>
                            <span class="panel-text">模块组</span>
                          </t-row>
                          <t-row>
                            <span class="panel__text" style="letter-spacing: 1px;">
                              {{ item.hostName }}
                            </span>
                          </t-row>
                          <t-row class="diamond">
                            <div>
                              <div style="display: flex">
                                <span
                                  v-for="(_sum, index) in distribute(item)
                                    .error"
                                  :key="index"
                                  :id="index"
                                  class="error"
                                ></span>
                              </div>
                              <p class="status" v-show="item.error > 0">
                                {{ item.error }}
                              </p>
                            </div>
                            <div>
                              <div style="display: flex">
                                <span
                                  v-for="(_sum, index) in distribute(item)
                                    .danger"
                                  :id="index"
                                  :key="index"
                                  class="danger"
                                ></span>
                              </div>
                              <p class="status" v-show="item.danger > 0">
                                {{ item.danger }}
                              </p>
                            </div>
                            <div>
                              <div style="display: flex">
                                <span
                                  v-for="(sum, index) in distribute(item)
                                    .default"
                                  :id="index"
                                  :key="index"
                                  class="default"
                                ></span>
                              </div>
                              <p class="status" v-show="item.default > 0">
                                {{ item.default }}
                              </p>
                            </div>
                          </t-row>
                        </t-col>
                      </div>
                    </div>
                  </t-swiper-item>
                </t-swiper>
              </div>
            </t-row>
          </t-row>

          <t-row class="px-3" style="width: 500px">
            <div
              style="
                width: 100%;
                height: 890px;
                background-color: #024aaf;
                display: flex;
                flex-direction: column;
              "
            >
              <div class="nav-title px-4">
                <span style="font-size: 15px; letter-spacing: 2px"
                  >主机业务拓扑</span
                >
                <span
                  >
                  {{this.currentGroup=== 'host'? '主机组名':'模块组名'}}
                  {{
                    this.currentCanvasName.split("|")[1] ||
                    this.currentCanvasName ||
                    ""
                  }}
                </span>
              </div>
              <div
                class="mx-2 my-2"
                id="g2Contain"
                style="flex: 1; background-color: #09182c; position: relative"
              >
                <li @click="autoZoom" style="position: absolute">
                  <svg
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="24"
                    fill="#fff"
                  >
                    <path
                      d="M684.288 305.28l0.128-0.64-0.128-0.64V99.712c0-19.84 15.552-35.904 34.496-35.712a35.072 35.072 0 0 1 34.56 35.776v171.008h170.944c19.648 0 35.84 15.488 35.712 34.432a35.072 35.072 0 0 1-35.84 34.496h-204.16l-0.64-0.128a32.768 32.768 0 0 1-20.864-7.552c-1.344-1.024-2.816-1.664-3.968-2.816-0.384-0.32-0.512-0.768-0.832-1.088a33.472 33.472 0 0 1-9.408-22.848zM305.28 64a35.072 35.072 0 0 0-34.56 35.776v171.008H99.776A35.072 35.072 0 0 0 64 305.216c0 18.944 15.872 34.496 35.84 34.496h204.16l0.64-0.128a32.896 32.896 0 0 0 20.864-7.552c1.344-1.024 2.816-1.664 3.904-2.816 0.384-0.32 0.512-0.768 0.768-1.088a33.024 33.024 0 0 0 9.536-22.848l-0.128-0.64 0.128-0.704V99.712A35.008 35.008 0 0 0 305.216 64z m618.944 620.288h-204.16l-0.64 0.128-0.512-0.128c-7.808 0-14.72 3.2-20.48 7.68-1.28 1.024-2.752 1.664-3.84 2.752-0.384 0.32-0.512 0.768-0.832 1.088a33.664 33.664 0 0 0-9.408 22.912l0.128 0.64-0.128 0.704v204.288c0 19.712 15.552 35.904 34.496 35.712a35.072 35.072 0 0 0 34.56-35.776V753.28h170.944c19.648 0 35.84-15.488 35.712-34.432a35.072 35.072 0 0 0-35.84-34.496z m-593.92 11.52c-0.256-0.32-0.384-0.768-0.768-1.088-1.088-1.088-2.56-1.728-3.84-2.688a33.088 33.088 0 0 0-20.48-7.68l-0.512 0.064-0.64-0.128H99.84a35.072 35.072 0 0 0-35.84 34.496 35.072 35.072 0 0 0 35.712 34.432H270.72v171.008c0 19.84 15.552 35.84 34.56 35.776a35.008 35.008 0 0 0 34.432-35.712V720l-0.128-0.64 0.128-0.704a33.344 33.344 0 0 0-9.472-22.848zM512 374.144a137.92 137.92 0 1 0 0.128 275.84A137.92 137.92 0 0 0 512 374.08z"
                    ></path>
                  </svg>
                </li>
                <li style="position: absolute; right: 0;display: none;" @click="openScreen" ref="fullBtn">
                  <AddIcon size="30px"></AddIcon>
                  <!-- 显示全部 -->
                </li>
              </div>
              <div class="mx-2 nav-table" style="flex: 1">
                <mod-scroll-board
                  :config="showConfig ? configNew : config"
                  style="width: 100%; height: 400px"
                ></mod-scroll-board>
                <!-- stop -->
              </div>
            </div>
          </t-row>
        </t-row>
      </t-loading>
    </div>
    <div
      v-show="screen"
      id="screen"
      style="position: relative; width: 100%;height:100%"
    >
      <RemoveIcon
        size="50px"
        style="position: absolute; left: 0; top: 0"
        @click="screen = false,graphFull.clear();"
      ></RemoveIcon>
      <div class="minimap" id="minimap" style="position: absolute;right:0;top:1%; background-color: #000;solid:1px solid #333;
      "></div>
    </div>
  </div>
</template>
<script>
import './utils/G6'
import G6 from '@antv/g6'
import { AddIcon, RemoveIcon } from 'tdesign-icons-vue'
import {
  getCanvasData,
  resourcePoolModulesTemp
  // getTemperatureCompResourcePoolAzTempAPI
} from '@/api/monitor/bigScreen'
export default {
  props: {
    echartParams: {
      type: Object,
      default: () => ({})
    }
  },
  components: { AddIcon, RemoveIcon },
  data () {
    return {
      currentGroup: 'host',
      currentCanvasName: '',
      timevalue: '',
      // 加载
      loading: false,
      configNew: {},
      showConfig: true,
      config: {
        header: ['设备', '状态', '温度'],
        data: [],
        rowNum: 10, // 表格行数
        headerHeight: 25,
        oddRowBGC: '#0c55b7', // 奇数行
        evenRowBGC: '#0c55b7', // 偶数行
        columnWidth: [370, 70, 70],
        align: ['left']
      },
      dividerHeight: '',
      // code: 'realzoom',
      // autoZoom
      popupProps: {
        overlayInnerStyle: (trigger) => ({
          width: `${trigger.offsetWidth}px`,
          // top: '-30px',
          color: '#ffffff',
          backgroundColor: '#196ee6!important'
        }),
        attach: '.group'
      },
      G6data: {},
      groupData: [],
      // 选定的元素
      selectedElement: null,
      screen: false
    }
  },
  methods: {
    clear () {
      // 切换模组清空右侧数据
      this.$set(this.configNew, 'data', [])
      this.graph.changeData({ nodes: [], edges: [] })
      this.currentCanvasName = ''
      // 由于vue2不能检测数组和对象的变化，清空configNew无法响应，改为来回切换显示config
      this.config.data = []
      this.showConfig = false
      // 清除元素对象
      if (this.selectedElement) {
        this.selectedElement.classList.remove('other-panel-focus')
      }
      this.selectedElement = null
    },
    back () {
      this.$emit('goBack')
    },
    changeGroup (data, _context) {
      this.clear()
      this.loading = true
      switch (data) {
        case 'modules': {
          resourcePoolModulesTemp({
            resourcePool: this.echartParams.name,
            time: ''
          })
            .then((res) => {
              if (res.data.code === 0) {
                if (this.groupData) {
                  this.groupData = []
                }
                this.groupData = res.data.data
              } else {
                this.$message.error(res.msg)
              }
            })
            .then(() => {
              this.beGoData(this.groupData[0])
              this.$nextTick(() => {
                this.selectedElement =
                  document.querySelector('.other-modules-box').children[0]
                this.selectedElement.classList.add('other-panel-focus')
              })
              this.loading = false
            })
          // 开启定时刷新
          if (this.modulesData) {
            clearInterval(this.modulesData)
          }
          this.modulesData = setInterval(() => {
            resourcePoolModulesTemp({
              resourcePool: this.echartParams.name,
              time: ''
            }).then((res) => {
              if (res.data.code === 0) {
                this.groupData = res.data.data
              } else {
                this.$message.error(res.msg)
              }
            })
          }, 1000 * 60 * 5)
          break
        }
        case 'host': {
          new Promise((resolve) => {
            resolve()
          }).then(() => {
            this.beGoData(this.echartParams.leftPort.panel[0])
            this.selectedElement =
              document.querySelector('.other-box').children[0]
            this.selectedElement.classList.add('other-panel-focus')
          })
          break
        }
      }
    },
    beGoData (val, event) {
      // 防止重复点击当前面板
      if (this.selectedElement && event.currentTarget.className.includes('other-panel-focus')) {
        return
      }
      this.$set(this.configNew, 'data', [])
      this.graph.changeData({ nodes: [], edges: [] })
      this.currentCanvasName = ''
      // 由于vue2不能检测数组和对象的变化，清空configNew无法响应，改为来回切换显示config
      this.config.data = []
      this.showConfig = false
      this.loading = true
      if (event) {
        // 修改当前元素点击后的样式
        Promise.resolve(event.currentTarget).then((ele) => {
          // 清除上一个元素的样式
          if (this.selectedElement) {
            this.selectedElement.classList.remove('other-panel-focus')
          }

          // 更新选中的元素
          this.selectedElement = ele
          this.selectedElement.classList.add('other-panel-focus')
          // console.log(this.selectedElement.classList)
        })
      }

      // 点击的时候获取中间分割线的高度
      this.dividerHeight = this.$refs.containLeft.$el.offsetHeight - 24 + 'px'
      // 获取主机名
      this.currentCanvasName = val.hostName || val.hostName
      const params = {
        // modelName: val.hostName,
        modelName: this.currentCanvasName,
        resourcePool: this.echartParams.name,
        type: this.currentGroup
      }
      // 少于6个不显示全屏按钮
      this.$refs.fullBtn.style.display =
        val.danger + val.default + val.error <= 6 ? 'none' : 'block'

      // 获取画布属性
      return getCanvasData(params).then((res) => {
        const data = res.data.data
        // 画布部分
        // 显示文本上头还是下头
        const nodeI = {
          position: 'top',
          style: {
            fill: '#fff',
            fontSize: 20
          }
        }
        const nodeO = {
          position: 'bottom',
          offset: 5,
          style: {
            fill: '#fff',
            fontSize: 20
          }
        }
        // 位置
        data.nodes.forEach((element, index) => {
          // const axisX = -300 + ((60 * index) % 200)
          // const axisY = 50 + index * 60
          const axisX = -250
          const axisY = (index - 1) * 100
          element.x = index === 0 ? 120 : axisX
          element.y = index === 0 ? 300 : axisY
          // 文本显示位置
          element.labelCfg = index === 0 ? nodeI : nodeO
        })
        data.nodes[0].img = require('@/assets/images/screen/temperatureComp/route_master.png')
        data.nodes[0].size = [80, 80]

        this.G6data.nodes = data.nodes
        this.G6data.edges = data.edges
        console.log(this.G6data, 1111)
        // 视图显示的连接的节点数量
        const nodeSum = 6
        this.graph.read({
          nodes: this.G6data.nodes.slice(0, nodeSum + 1),
          edges: this.G6data.edges.slice(0, nodeSum)
        })
        this.graph.fitView(0, undefined, false)
        // 表格部分
        const table = data.table
        let color = ''
        for (const i in table) {
          // 正常给#7bdad8，警戒给#f46368，危险给#dc8d67，临界给#dfc889
          switch (table[i].status) {
            case '正常': {
              color = '#7bdad8'
              break
            }
            case '警戒': {
              color = '#f46368'
              break
            }
            case '危险': {
              color = '#dc8d67'
              break
            }
            case '临界': {
              color = '#dfc889'
              break
            }
          }
          // 赋值
          const row = [
            table[i].name,
            `<div style="position: relative;padding-left: 15px;color: #fff;"><span style="position: absolute;top:36%;left:0px;border-radius: 50%;border:5px solid ${color}"></span>${table[i].status}</div>`,
            `<span style="color:${color}">${table[i].temperature}℃</span>`
          ]
          this.showConfig = true
          this.config.data[i] = row
          this.configNew = Object.assign({}, this.config)
        }
        this.loading = false
      })
      // setTimeout(() => {
      //   return loadingAttachInstance.hide()
      // }, 2000)
      // this.graph.read(val.G2)
    },
    handleTimeChange (time) {
      console.log(time)
    },
    // 分配方块类型,固定总数20
    distribute (data) {
      const how = 20
      const sum = data.error + data.default + data.danger + data.unrecoverable
      const ratios = {
        default: data.default / sum,
        danger: data.danger / sum,
        error: data.error / sum,
        unrecoverable: data.unrecoverable / sum
      }
      const counts = {
        default: Math.ceil(ratios.default * how),
        danger: Math.ceil(ratios.danger * how),
        error: Math.ceil(ratios.error * how),
        unrecoverable: Math.ceil(ratios.unrecoverable * how)
      }
      let target = Object.values(counts).reduce((a, b) => a + b)
      while (target > 20) {
        counts.default -= 1
        target--
      }
      while (target < 20) {
        counts.default += 1
        target++
      }
      return counts
    },
    autoZoom () {
      const animateCfg = { duration: 200, easing: 'easeCubic' }

      // if (this.code === 'realZoom') {
      //   this.graph.zoomTo(1, { x: 340, y: 120 }, true, animateCfg)
      //   this.code = 'autoZoom'
      // } else {
      this.graph.fitView(0, undefined, true, animateCfg)
      // this.code = 'realZoom'
      // }
    },
    openScreen () {
      if (!this.G6data) {
        return this.$message.error('暂无数据')
      }
      // // 阿基米德螺旋线
      // const centerX = 0 // 圆心的x坐标
      // const centerY = 0 // 圆心的y坐标
      // const radius = 4000 // 初始半径
      // const gap = 80 // 每个节点之间的间隔
      // this.G6data.nodes.forEach((element, index) => {
      //   // 计算极角
      //   const angle = (index / this.G6data.nodes.length) * 2 * Math.PI
      //   // 计算极径
      //   const r = radius + index * gap    width: 100%;
      //   // 计算直角坐标系下的坐标
      //   const x = centerX + r * Math.cos(angle)
      //   const y = centerY + r * Math.sin(angle)
      //   element.x = x
      //   element.y = y
      // })
      this.G6data.edges.slice(0, 6).forEach((element, index) => {
        element.style.lineWidth = 6
      })

      this.G6data.nodes.forEach((element, index) => {
        const axisX = -1000
        const axisY = index * 300
        element.x = index === 0 ? 1000 : axisX
        element.y = index === 0 ? (300 * +this.G6data.nodes.length / 2) : axisY
        // 文本显示位置
        // element.labelCfg = index === 0 ? nodeI : nodeO
        // 设置文本大小
        element.labelCfg.style.fontSize = 40
        // 大小
        element.size = [160, 160]
      })

      this.G6data.nodes[0].size = [210, 210]
      // this.graphFull.fitView(20, undefined, false)
      this.graphFull.read(this.G6data)
      // this.graphFull.fitCenter(true)
      console.log(this.G6data)
      this.screen = true
      // this.graphFull.fitView(-500, undefined, false)
      this.graphFull.fitCenter()
      this.graphFull.zoomTo(0.53, { x: this.G6data.nodes[0].x, y: 0 })
    }

  },
  mounted () {
    // 创建 G6 图实例
    this.graph = new G6.Graph({
      container: 'g2Contain',
      fitView: false,
      // width: 419,
      // height: 419,
      // 允许拖动
      /*       modes: {
        default: ['drag-canvas', 'zoom-canvas']
      }, */
      defaultEdge: {
        type: 'circle-running',
        style: {
          lineWidth: 2,
          stroke: 'rgba(255,255,255,.6)'
        }
      },
      defaultNode: {
        type: 'image',
        size: [60, 60],
        img: require('@/assets/images/screen/temperatureComp/route_out.png'),
        clipCfg: {
          show: false,
          // Clip type options: circle, ellipse, rect, path
          type: 'circle',
          // img: require('@/assets/images/screen/temperatureComp/route_out.png'),
          r: 10,
          // clip style
          style: {
            lineWidth: 1
          }
        }
      }
    })
    // const height = (this.G6data.nodes.length > 100 ? this.G6data.nodes.length : 300) || 300
    const minimap = new G6.Minimap({
      size: [150, 400],
      container: 'minimap',
      type: 'delegate',
      hideEdge: true
    })
    // G6大屏实例
    this.graphFull = new G6.Graph({
      container: 'screen',
      fitView: false,
      width: 1980,
      height: 1000,
      // 允许拖动
      modes: {
        default: ['drag-canvas', 'zoom-canvas']
      },
      defaultEdge: {
        type: 'circle-running',
        style: {
          lineWidth: 6,
          stroke: 'rgba(255,255,255,.6)'
        }
      },
      defaultNode: {
        type: 'image',
        size: [160, 160],
        img: require('@/assets/images/screen/temperatureComp/route_out.png'),
        clipCfg: {
          show: false,
          // Clip type options: circle, ellipse, rect, path
          type: 'circle',
          // img: require('@/assets/images/screen/temperatureComp/route_out.png'),
          r: 16,
          // clip style
          style: {
            lineWidth: 2
          }
        }
      },
      plugins: [minimap]
    })
    // // 调用Other组件的beGoData方法,默认展示第一个面板
    // this.beGoData(this.echartParams.leftPort.panel[0])
    // // 给组件中的data里的this.selectedElement = document.querySelector('.other-box').children[0]
    // this.selectedElement =
    //     document.querySelector('.other-box').children[0]
    // this.selectedElement.classList.add('other-panel-focus')
  },
  watch: {},
  beforeDestroy () {
    if (this.modulesData) {
      clearInterval(this.modulesData)
    }
  }
}
</script>

<style scoped lang="scss">
.temperatureComp_other {
  .status {
    font-family: logo-font;
    text-align: center;
    margin-top: 5px;
  }
  .panel__text {
    /* font-family: logo-font; */
    font-size: 16px;
    margin: 5px 0 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
    white-space: nowrap;
    width: 300px;
  }
  /deep/ .t-swiper__container {
    height: auto;
  }
  /deep/ .t-swiper--vertical .t-swiper__navigation {
    transform: rotate(-90deg) translate(-1580%, -133%);
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 500px;
  }

}
</style>
