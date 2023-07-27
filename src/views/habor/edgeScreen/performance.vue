<template>
  <t-row :gutter="16" class="mt-4">
    <t-col :span="3">
      <div style="width: 100%;">
        <t-card :bordered="false">
          <div class="mod-flex-center">
            <div>服务器</div>
          </div>
          <div class="mod-flex-center">
            <div style="color: #51c2d5" class="text-3xl font-bold my-4">
              <countTo :startVal='0' :endVal='14' :duration='2500'/>
                <span> / </span>
              <countTo :startVal='0' :endVal='14' :duration='2500'/>
            </div>
          </div>
        </t-card>
      </div>
      <div style="width: 100%;" class="my-4">
        <t-card :bordered="false">
          <div class="mod-flex-center">
            <div>数通</div>
          </div>
          <div class="mod-flex-center">
            <div style="color: #51c2d5" class="text-3xl font-bold my-4">
              <countTo :startVal='0' :endVal='6' :duration='2500'/>
                <span> / </span>
              <countTo :startVal='0' :endVal='6' :duration='2500'/>
            </div>
          </div>
        </t-card>
      </div>
      <div style="width: 100%;">
        <t-card :bordered="false">
          <div class="mod-flex-center">
            <div>总带宽</div>
          </div>
          <div class="mod-flex-center">
            <div style="color: #51c2d5" class="text-3xl font-bold my-4">
              <countTo :startVal='0' :endVal='430' :duration='2500'/> Gb
                <span> / </span>
              <countTo :startVal='0' :endVal='430' :duration='2500'/> Gb
            </div>
          </div>
        </t-card>
      </div>
      <div class="mt-4 bg-mod-card" style="width: 100%">
        <div style="padding: 10px">
          <div class="mb-4" style="text-align: center">地市资源池流量 Top 5</div>
          <div id="cityRankContainer" />
        </div>
      </div>
    </t-col>
    <t-col :span="6">
      <div class="bg-white" style="width: 100%">
        <div style="min-height: 790px; justify-content: center;position: relative" id="map" ref="mapRef"/>
      </div>
    </t-col>
    <t-col :span="3">
      <div class="bg-mod-card" style="width: 100%">
        <div style="padding: 10px">
          <div class="text-2xl font-bold mb-4">关键设备 CPU</div>
          <div id="cpuContainer" />
        </div>
      </div>
      <div class="mt-4 bg-mod-card" style="width: 100%">
        <div style="padding: 10px">
          <div class="text-2xl font-bold mb-4">关键设备 流量</div>
          <div id="flowContainer" />
        </div>
      </div>
    </t-col>
  </t-row>
</template>

<script>
import { Line, Bar } from '@antv/g2plot'
import * as Echarts from 'echarts' // echarts 5.3.3
import countTo from 'vue-count-to'
import data from './bigScreenData'
import { getNetworkCpuAvgDataAPI, getNetworkPortTopDataAPI, getNetworkPortCountDataAPI } from '@/api/monitor/screen'
import { parseTime, convertStorage } from '@/utils'

export default {
  name: 'performance',
  components: {
    countTo
  },
  data () {
    return {
      tab: '', // tab
      date: new Date(),
      cpuLineChartData: data.lineCpuData,
      flowLineChartData: data.lineFlowData,
      cityChartData: data.cityData,
      mapsChartData: data.mapsData,
      mapsChartData2: data.mapsData2,
      map: {},
      charts: '', // 图表实例
      index: 1, // 定时器方法 数组下标
      totalBandwidth: 0, // 总带宽
      cpuUrl: 'monitor/edge/networkCpuAvgData',
      flowUrl: 'monitor/edge/networkPortTopData',
      cityUrl: 'monitor/edge/networkPortCountData'
    }
  },
  filters: {
    // 设置一个函数来进行过滤
    formatDate () {
      return parseTime(new Date(), '')
    }
  },
  mounted () {
    this.getApi()
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    getApi () {
      const end = (Date.parse(new Date()) / 1000).toString()
      const start = (Date.parse(new Date()) / 1000 - 21600).toString()
      const params = {
        starTime: start,
        endTime: end
      }
      this.getCpuApi(params)
      this.getFlowApi(params)
      this.getCityApi(params)
    },
    getCpuApi (params) {
      return new Promise((resolve, reject) => {
        getNetworkCpuAvgDataAPI(params).then(response => {
          const { data } = response.data
          if (data.code === 0) {
            this.cpuLineChartData = data.data
            this.$nextTick(() => {
              this.setCpuChartOption()
            })
          } else {
            this.$message.error(JSON.stringify(data))
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error))
        })
      })
    },
    getFlowApi (params) {
      return new Promise((resolve, reject) => {
        getNetworkPortTopDataAPI(params).then(response => {
          const { data } = response.data
          if (data.code === 0) {
            this.flowLineChartData = data.data
            this.$nextTick(() => {
              this.setFlowChartOption()
            })
          } else {
            this.$message.error(JSON.stringify(data))
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error))
        })
      })
    },
    getCityApi (params) {
      return new Promise((resolve, reject) => {
        getNetworkPortCountDataAPI(params).then(response => {
          const { data } = response.data
          if (data.code === 0) {
            this.cityChartData = data.data
            this.$nextTick(() => {
              this.setCityChartOption()
            })
          } else {
            this.$message.error(JSON.stringify(data))
          }
        }).catch(error => {
          this.$message.error(JSON.stringify(error))
        })
      })
    },
    initChart () {
      this.setMapsChartOption()
      this.setCpuChartOption()
      this.setFlowChartOption()
      this.setCityChartOption()
    },
    setCpuChartOption () {
      const COLOR_PLATE_10 = [
        '#5B8FF9',
        '#5AD8A6',
        '#5D7092',
        '#F6BD16',
        '#E8684A',
        '#6DC8EC',
        '#9270CA',
        '#FF9D4D',
        '#269A99',
        '#FF99C3'
      ]
      const container = document.getElementById('cpuContainer')
      const data = this.cpuLineChartData.data.flat(Infinity)
      const linePlot = new Line(container, {
        data,
        height: 325,
        // autoFit: true,
        xField: 'time',
        yField: 'value',
        seriesField: 'name',
        yAxis: {
          max: 100,
          label: {
            formatter: (v) => `${(v / 1).toFixed(2)} %`
          }
        },
        xAxis: {
          label: {
            formatter: (v) => `${parseTime(v, '{m}-{d} {h}:{i}')}`
          }
        },
        tooltip: {
          formatter: (v) => ({
            title: parseTime(v.time, '{m}-{d} {h}:{i}'),
            name: v.name,
            value: `${(v.value / 1).toFixed(2)} %`
          })
        },
        legend: false, // 关闭图例
        // legend: {
        //   flipPage: false,
        //   position: 'bottom'
        //   // itemWidth: 50
        // },
        color: COLOR_PLATE_10,
        smooth: true,
        // @TODO 后续会换一种动画方式
        animation: {
          appear: {
            animation: 'path-in',
            duration: 5000
          }
        }
      })
      linePlot.render()
    },
    setFlowChartOption () {
      const data = this.flowLineChartData.data.flat(Infinity)
      for (let i = 0; i < data.length; i++) {
        data[i].resourcePool = data[i].name + ':' + data[i].modelName
        data[i].time = ~~data[i].time
      }

      const COLOR_PLATE_10 = [
        '#5B8FF9',
        '#5AD8A6',
        '#5D7092',
        '#F6BD16',
        '#E8684A',
        '#6DC8EC',
        '#9270CA',
        '#FF9D4D',
        '#269A99',
        '#FF99C3'
      ]
      const container = document.getElementById('flowContainer')
      const linePlot = new Line(container, {
        data: data,
        height: 325,
        xField: 'time',
        yField: 'value',
        seriesField: 'resourcePool',
        yAxis: {
          label: {
            formatter: v => convertStorage(v)
          }
        },
        xAxis: {
          label: {
            formatter: (v) => `${parseTime(v, '{m}-{d} {h}:{i}')}`
          }
        },
        tooltip: {
          formatter: (v) => ({
            title: parseTime(v.time, '{m}-{d} {h}:{i}'),
            name: v.resourcePool,
            value: convertStorage(v.value)
          })
        },
        legend: false, // 关闭图例
        color: COLOR_PLATE_10,
        smooth: true,
        // @TODO 后续会换一种动画方式
        animation: {
          appear: {
            animation: 'path-in',
            duration: 5000
          }
        }
      })

      linePlot.render()
    },
    setCityChartOption () {
      const COLOR_PLATE_10 = [
        '#5B8FF9',
        '#5AD8A6',
        '#5D7092',
        '#F6BD16',
        '#E8684A',
        '#6DC8EC',
        '#9270CA',
        '#FF9D4D',
        '#269A99',
        '#FF99C3'
      ]
      const data = this.cityChartData.data
      const b = []
      for (let i = 0; i < data.length; i++) {
        b.unshift(data[i].slice(-1))
      }
      console.log('b', b)
      const cityData = b.flat(Infinity)

      // 计算对象数组中某个属性合计
      // const countTotal = (arr, keyName) => {
      //   let $total = 0
      //   $total = arr.reduce(function (total, currentValue, currentIndex, arr) {
      //     return currentValue[keyName] ? (total + currentValue[keyName]) : total
      //   }, 0)
      //   return parseInt($total)
      // }
      // this.totalBandwidth = countTotal(cityData, 'value')
      const bar = new Bar('cityRankContainer', {
        data: cityData,
        height: 245,
        xField: 'value',
        yField: 'resourcePoolAlias',
        seriesField: 'resourcePoolAlias',
        color: COLOR_PLATE_10,
        xAxis: {
          label: {
            formatter: v => convertStorage(v)
          }
        },
        legend: false,
        tooltip: {
          formatter: (v) => ({
            title: parseTime(new Date(), '{y}-{m}-{d}'),
            name: v.resourcePoolAlias,
            value: convertStorage(v.value)
          })
        }
      })
      bar.render()
    },
    setMapsChartOption () {
      const geoJson = this.mapsChartData // 地图数据
      const chartDom = document.getElementById('map')
      if (chartDom) {
        const myChart = Echarts.init(chartDom)
        Echarts.registerMap('GD', geoJson)
        myChart.on('click', (params) => {
          // 获取点击区域名称
          const regionName = params.name
          // 调用 handleClick 函数并传入区域名称
          this.provinceEvents(regionName)
        })
        const option = {
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0)',
            trigger: 'item'
          },
          geo: [
            // 灰色底geo
            {
              type: 'geoJSON',
              map: 'GD',
              show: true,
              roam: false,
              /* 地区样式排除 */
              regions: [
                {
                  name: '南海诸岛',
                  value: 0,
                  itemStyle: {
                    normal: {
                      opacity: 0,
                      label: {
                        show: false
                      }
                    }
                  }
                }
              ],
              layoutSize: '100%',
              // 偏移
              // center: [104.2, 34],
              itemStyle: {
                normal: {
                  borderColor: '#CADBF4',
                  borderWidth: 8,
                  areaColor: '#CADBF4'
                },
                emphasis: {
                  areaColor: '#CADBF4'
                }
              },
              label: {
                emphasis: {
                  show: false
                }
              }
            },
            // 白色边框geo
            {
              type: 'geoJSON',
              map: 'GD',
              show: true,
              roam: false,
              /* 区域样式排除 */
              regions: [
                {
                  name: '南海诸岛',
                  value: 0,
                  itemStyle: {
                    normal: {
                      opacity: 0,
                      label: {
                        show: false
                      }
                    }
                  }
                }
              ],
              label: {
                emphasis: {
                  show: false
                }
              },
              layoutSize: '100%',
              // 偏移
              aspectScale: 0.76,
              itemStyle: {
                normal: {
                  borderColor: 'white',
                  borderWidth: 4,
                  areaColor: '#CADBF4'
                },
                emphasis: {
                  areaColor: '#CADBF4'
                }
              }
            }
          ],
          series: [
            {
              name: 'GD PopEstimates',
              type: 'map',
              map: 'GD',
              boxDepth: 100, // 地图倾斜度
              regionHeight: 4, // 地图厚度
              aspectScale: 0.75,
              emphasis: {
                label: {
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  borderColor: '#F6FBFE',
                  borderWidth: 0.8,
                  areaColor: {
                    type: 'linear-gradient',
                    x: 0,
                    y: 900,
                    x2: 300,
                    y2: 0,
                    colorStops: [
                      {
                        offset: 0.5,
                        color: '#5FACF2' // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#B2F5F0' // 100% 处的颜色B3F6F0
                      }
                    ],
                    global: true // 缺省为 false
                  }
                },
                emphasis: {
                  show: false
                }
              },
              selectedMode: 'single',
              data: this.mapsChartData2
            }
          ]
        }
        this.charts = myChart // 保存实例
        this.mapActive()
        this.mouseEvents()
        // this.defaultEvent()
        option && myChart.setOption(option)
        window.addEventListener('resize', function () {
          myChart.resize() // 页面大小变化后Echarts也更改大小
        })
      }
    },
    // 轮播
    mapActive () {
      const dataLength = this.mapsChartData.features.length
      console.log('dataLength', dataLength)
      // 用定时器控制高亮
      this.mTime = setInterval(() => {
        // 清除之前高亮
        this.charts.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: this.index
        })
        // this.index++
        // 当前下标高亮
        this.charts.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: this.index
        })
        this.charts.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: this.index
        })
        if (this.index > dataLength) {
          this.index = -1
        }
      }, 3000)
    },
    mouseEvents () {
      // 鼠标划入
      this.charts.on('mouseover', () => {
        // 停止定时器，清除之前的高亮
        clearInterval(this.mTime)
        this.mTime = ''
        this.charts.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: this.index
        })
      })
      // 鼠标划出重新定时器开始
      this.charts.on('mouseout', () => {
        this.mapActive()
      })
    },
    // 省份点击触发参数
    provinceEvents (params) {
      console.log('点击事件触发')
      console.log(params)
    },
    defaultEvent () {
      // 高亮 但没效果
      this.charts.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: this.index
      })
    }
  }
}
</script>
