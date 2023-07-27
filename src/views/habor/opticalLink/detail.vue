<template>
  <div class="p-4">
    <t-button theme="primary" @click="back">
      <ChevronLeftIcon slot="icon" />
      返回
    </t-button>
    <div class="bg-mod-card rounded-sm mt-2">
      <div class="p-4 items-center">
        <t-row
          class="p-4"
          style="border: 1px solid #eeeeee"
        >
        <t-col :span="2">
          <div>
            <div>链路类型：</div>
            <div>{{ info.type }}</div>
          </div>
        </t-col>
        <t-col :span="4">
          <t-space>
            <div>
              <div>设备名：</div>
              <div>{{ info.hostName }}</div>
            </div>
            <div>
              <div>端口名：</div>
              <div>{{ info.portName }}</div>
            </div>
          </t-space>
        </t-col>
        <t-col :span="6">
          <t-space>
            <div>
              <div>对端设备名：</div>
              <div>{{ info.toHostName }}</div>
            </div>
            <div>
              <div>对端端口名：</div>
              <div>{{ info.toPortName }}</div>
            </div>
          </t-space>
        </t-col>
        </t-row>
      </div>
      <div>
        <div class="chart"></div>
        <div class="chart">
          <div>
            <transition
                appear
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
              >
                <div
                  class="chartDetail"
                  id="scoreChart"
                  style="padding: 12px"
                  ref="scoreChart"
                ></div>
              </transition>
          </div>
          <div>
            <transition
                appear
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
              >
                <div
                  class="chartDetail"
                  id="statusChart"
                  style="padding: 12px"
                ></div>
              </transition>
          </div>
          <div style="padding: 0px"
            v-for="(item, index) in chartRef"
            :key="index">
              <transition
                appear
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
              >
                <div
                  class="chartDetail"
                  :id="item"
                  style="padding: 12px"
                ></div>
              </transition>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { signDetailAPI } from '@/api/monitor/sign'
import { formatTime, formatDate } from '@/utils/inops/dateUtils'
import {
  ChevronLeftIcon
} from 'tdesign-icons-vue'

export default {
  name: 'detail',
  components: {
    ChevronLeftIcon
  },
  data () {
    return {
      // 新增
      info: {
        type: '10GE',
        resourcePool: 'NFV-RP-HNGZ-08A',
        hostName: 'NFV-D-HNGZ-08A-3502-AC09-M-TOR-02',
        portName: '10GE1/0/17',
        toHostName: 'NFV-D-HNGZ-08A-3502-AC09-S-SRV-05',
        toPortName: 'ens2f1',
        occurrenceTime: '2023-02-21 16:00:00',
        discoveryPath: '发现途径1',
        alarmDescription: '告警描述1',
        immediateCause: '直接原因1'
      },
      chartRef: [
        'transmitChart',
        'receiveChart',
        'biasChart',
        'tpturesChart',
        'crcChart',
        'voltagesChart'
      ],
      chart: {
        scoreChart: {
          title: '劣化度变化图',
          dom: null,
          options: null,
          data1: []
        },
        statusChart: {
          title: '状态变化图',
          dom: null,
          options: null,
          adminStatus: [],
          linkStatus: [],
          toAdminStatus: [],
          toLinkStatus: []
        },
        transmitChart: {
          title: '发送功率变化图',
          dom: null,
          options: null,
          dateList: [],
          data1: [],
          data2: []
        },
        receiveChart: {
          title: '接收功率变化图',
          dom: null,
          options: null,
          data1: [],
          data2: []
        },
        biasChart: {
          title: '电流变化图',
          dom: null,
          options: null,
          data1: [],
          data2: []
        },
        tpturesChart: {
          title: '温度变化图',
          dom: null,
          options: null,
          data1: [],
          data2: []
        },
        crcChart: {
          title: 'CRC错误变化图',
          dom: null,
          options: null,
          data1: [],
          data2: []
        },
        voltagesChart: {
          title: '电压变化图',
          dom: null,
          options: null,
          data1: [],
          data2: []
        }
      },
      isShow: {
        scoreChart: true,
        statusChart: true,
        transmitChart: true,
        receiveChart: true,
        biasChart: true,
        tpturesChart: true,
        crcChart: true,
        voltagesChart: true
      }
    }
  },
  mounted () {
    this.getData()
    window.onresize = () => {
      const chart = echarts.init(document.getElementById('scoreChart'))
      chart.resize()
    }

    // 劣化变化图触摸显示数据
    // this.chart.scoreChart.options.series[0].label.show = false;
    // this.chart.scoreChart.options &&
    //   this.chart.scoreChart.dom.setOption(this.chart.scoreChart.options);
    // this.$refs.scoreChart.addEventListener("mouseout", () => {
    //   this.chart.scoreChart.options.series[0].label.show = false;
    //   this.chart.scoreChart.options &&
    //     this.chart.scoreChart.dom.setOption(this.chart.scoreChart.options);
    // });
  },
  methods: {
    back () {
      this.$router.push({
        path: '/monitor/analysis/record'
      })
    },
    test () {
      const data = require('./data.json')
      const {
        hostName,
        immediateCause,
        discoveryPath,
        portName,
        type,
        toHostName,
        alarmDescription,
        toPortName,
        occurrenceTime,
        createTime
      } = data.data
      this.info = Object.assign(this.info, {
        hostName,
        immediateCause,
        discoveryPath,
        portName,
        type,
        toHostName,
        alarmDescription,
        toPortName,
        occurrenceTime,
        createTime
      })
      const obj = data.data.data[0]
      this.chart.scoreChart.data1 = JSON.parse(obj.scores)
      this.isShow.scoreChart = false
      this.scoreChartInit()
      this.chart.statusChart.adminStatus = JSON.parse(obj.adminStatus)
      this.chart.statusChart.linkStatus = JSON.parse(obj.linkStatus)
      this.chart.statusChart.toAdminStatus = JSON.parse(obj.toAdminStatus)
      this.chart.statusChart.toLinkStatus = JSON.parse(obj.toLinkStatus)
      this.isShow.statusChart = false
      this.statusChartInit()
      this.chart.biasChart.data1 = JSON.parse(obj.biasCurrents)
      this.chart.biasChart.data2 = JSON.parse(obj.toBiasCurrents)
      this.chart.crcChart.data1 = JSON.parse(obj.crcs)
      this.chart.crcChart.data2 = JSON.parse(obj.toCrcs)
      this.chart.receiveChart.data1 = JSON.parse(obj.receivedPowers)
      this.chart.receiveChart.data2 = JSON.parse(obj.toReceivedPowers)
      this.chart.transmitChart.data1 = JSON.parse(obj.transmitPowers)
      this.chart.transmitChart.data2 = JSON.parse(obj.toTransmitPowers)
      this.chart.tpturesChart.data1 = JSON.parse(obj.temperatures)
      this.chart.tpturesChart.data2 = JSON.parse(obj.toTemperatures)
      this.chart.voltagesChart.data1 = JSON.parse(obj.voltages)
      this.chart.voltagesChart.data2 = JSON.parse(obj.toVoltages)
      this.isShow.biasChart = false
      this.isShow.crcChart = false
      this.isShow.receiveChart = false
      this.isShow.transmitChart = false
      this.isShow.tpturesChart = false
      this.isShow.voltagesChart = false
      this.chartInit()
    },
    getData () {
      // test合并时删掉
      this.test()

      signDetailAPI(this.$route.query.id).then((r) => {
        const { data } = r
        if (data.code === 0) {
          const {
            hostName,
            immediateCause,
            discoveryPath,
            portName,
            type,
            toHostName,
            alarmDescription,
            toPortName,
            occurrenceTime,
            createTime
          } = data.data
          this.info = Object.assign(this.info, {
            hostName,
            immediateCause,
            discoveryPath,
            portName,
            type,
            toHostName,
            alarmDescription,
            toPortName,
            occurrenceTime,
            createTime
          })
          const obj = data.data.data[0]
          this.chart.scoreChart.data1 = JSON.parse(obj.scores)
          this.isShow.scoreChart = false
          this.scoreChartInit()
          this.chart.statusChart.adminStatus = JSON.parse(obj.adminStatus)
          this.chart.statusChart.linkStatus = JSON.parse(obj.linkStatus)
          this.chart.statusChart.toAdminStatus = JSON.parse(obj.toAdminStatus)
          this.chart.statusChart.toLinkStatus = JSON.parse(obj.toLinkStatus)
          this.isShow.statusChart = false
          this.statusChartInit()
          this.chart.biasChart.data1 = JSON.parse(obj.biasCurrents)
          this.chart.biasChart.data2 = JSON.parse(obj.toBiasCurrents)
          this.chart.crcChart.data1 = JSON.parse(obj.crcs)
          this.chart.crcChart.data2 = JSON.parse(obj.toCrcs)
          this.chart.receiveChart.data1 = JSON.parse(obj.receivedPowers)
          this.chart.receiveChart.data2 = JSON.parse(obj.toReceivedPowers)
          this.chart.transmitChart.data1 = JSON.parse(obj.transmitPowers)
          this.chart.transmitChart.data2 = JSON.parse(obj.toTransmitPowers)
          this.chart.tpturesChart.data1 = JSON.parse(obj.temperatures)
          this.chart.tpturesChart.data2 = JSON.parse(obj.toTemperatures)
          this.chart.voltagesChart.data1 = JSON.parse(obj.voltages)
          this.chart.voltagesChart.data2 = JSON.parse(obj.toVoltages)
          this.isShow.biasChart = false
          this.isShow.crcChart = false
          this.isShow.receiveChart = false
          this.isShow.transmitChart = false
          this.isShow.tpturesChart = false
          this.isShow.voltagesChart = false
          this.chartInit()
        }
      })
    },
    scoreChartInit () {
      const dom = document.getElementById('scoreChart')
      this.chart.scoreChart.dom = echarts.init(dom)
      this.chart.scoreChart.options = null
      // 新增
      var options = {
        title: {
          text: this.chart.scoreChart.title,
          textStyle: {
            fontSize: 14,
            color: '#42a5f5'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: function (params) {
            let result = '1'
            result +=
              formatDate(params[0].axisValue) +
              '</br>' +
              `<span class="q-mr-lg">${params[0].seriesName}</span>${Number(
                params[0].data[1]
              ).toFixed(2)}</br>`
            return result
          }
        },
        legend: {
          orient: 'vertical',
          right: '3%',
          data: ['劣化度']
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '12%'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisPointer: {
            type: 'shadow',
            label: {
              show: true,
              formatter: function (params) {
                return formatTime(params.value)
              }
            }
          },
          axisLabel: {
            overflow: 'breakAll',
            formatter: function (value) {
              return formatDate(value)
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '劣化度',
            type: 'line',
            data: this.chart.scoreChart.data1,
            // symbolSize: 10,
            symbol: 'circle',
            itemStyle: {
              color: '#beaed4'
            },
            label: {
              show: false,
              formatter: function (val) {
                return Number(val.data[1]).toFixed(2)
              }
            }
          }
        ]
      }
      this.chart.scoreChart.options = options
      this.chart.scoreChart.options &&
        this.chart.scoreChart.dom.setOption(this.chart.scoreChart.options)
    },
    statusChartInit () {
      const dom = document.getElementById('statusChart')
      this.chart.statusChart.dom = echarts.init(dom)
      this.chart.statusChart.options = null
      this.chart.statusChart.options = {
        title: {
          text: this.chart.statusChart.title,
          textStyle: {
            fontSize: 14,
            color: '#42a5f5'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: function (params) {
            let result = ''
            result += formatTime(params[0].axisValue) + '</br>'
            for (let i = 0; i < params.length; i++) {
              result += `<span class="q-mr-lg">${
                params[i].seriesName
              }</span>${Number(params[i].data[1]).toFixed(2)}</br>`
            }
            return result
          }
        },
        legend: {
          type: 'scroll',
          orient: 'horizontal',
          right: '3%',
          data: [
            '端口admin状态',
            '对端端口admin状态',
            '端口链路物理状态',
            '对端端口链路物理状态'
          ]
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '12%'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisPointer: {
            type: 'shadow',
            label: {
              formatter: function (params) {
                return formatTime(params.value)
              }
            }
          },
          axisLabel: {
            overflow: 'breakAll',
            formatter: function (value) {
              const a = formatTime(value).split(' ')
              return a[0] + '\n' + a[1]
            }
          }

        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '端口admin状态',
            type: 'line',
            zlevel: 1,
            z: 1,
            selectedMode: true,
            select: {
              disabled: true
            },
            data: this.chart.statusChart.adminStatus,
            label: {
              show: false,
              formatter: function (val) {
                return Number(val.data[1]).toFixed(2)
              }
            }
          },
          {
            name: '对端端口admin状态',
            type: 'line',
            zlevel: 2,
            z: 2,
            data: this.chart.statusChart.toAdminStatus,
            label: {
              show: false,
              formatter: function (val) {
                return Number(val.data[1]).toFixed(2)
              }
            }
          },
          {
            name: '端口链路物理状态',
            type: 'line',
            zlevel: 3,
            z: 3,
            data: this.chart.statusChart.linkStatus,
            label: {
              show: false,
              formatter: function (val) {
                return Number(val.data[1]).toFixed(2)
              }
            }
          },
          {
            name: '对端端口链路物理状态',
            type: 'line',
            zlevel: 4,
            z: 4,
            data: this.chart.statusChart.toLinkStatus,
            label: {
              show: false,
              formatter: function (val) {
                return Number(val.data[1]).toFixed(2)
              }
            }
          }
        ]
      }
      this.chart.statusChart.options &&
        this.chart.statusChart.dom.setOption(
          this.chart.statusChart.options,
          true
        )
    },
    chartInit () {
      this.chartRef.forEach((item) => {
        const dom = document.getElementById(item)
        this.chart[item].dom = echarts.init(dom)
        this.chart[item].options = null
        this.chart[item].options = {
          title: {
            text: this.chart[item].title,
            textStyle: {
              fontSize: 14,
              color: '#42a5f5'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            },
            formatter: function (params) {
              let result = ''
              result += formatTime(params[0].axisValue) + '</br>'
              for (let i = 0; i < params.length; i++) {
                result += `<span class="q-mr-lg">${
                  params[i].seriesName
                }</span>${Number(params[i].data[1]).toFixed(2)}</br>`
              }
              return result
            }
          },
          legend: {
            type: 'scroll',
            orient: 'horizontal',
            right: '3%',
            data: [this.info.hostName, this.info.toHostName]
          },
          grid: {
            left: '5%',
            right: '5%',
            bottom: '12%'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisPointer: {
              type: 'shadow',
              label: {
                formatter: function (params) {
                  return formatTime(params.value)
                }
              }
            },
            axisLabel: {
              overflow: 'break',
              formatter: function (value) {
                const a = formatTime(value).split(' ')
                return a[0] + '\n' + a[1]
              }
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: this.info.hostName,
              type: 'line',
              zlevel: 1,
              z: 1,
              data: this.chart[item].data1,
              itemStyle: {
                color: '#beaed4'
              },
              label: {
                show: false,
                formatter: function (val) {
                  return Number(val.data[1]).toFixed(2)
                }
              }
            },
            {
              name: this.info.toHostName,
              type: 'line',
              zlevel: 2,
              z: 2,
              data: this.chart[item].data2,
              itemStyle: {
                color: '#7fc97f'
              },
              label: {
                show: false,
                formatter: function (val) {
                  return Number(val.data[1]).toFixed(2)
                }
              }
            }
          ]
        }
        this.chart[item].options &&
          this.chart[item].dom.setOption(this.chart[item].options)
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.chart
  display: grid
  grid-gap: 20px
  grid-template-columns: 1fr 1fr
  justify-items: stretch
.chartDetail
  border: 1px solid #eeeeee
  height: 300px
</style>
