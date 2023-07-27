<template>
  <div>
    <content-header></content-header>
      <div style="position: relative">
        <div class="analy-box">
          <div class="bg-mod-card">
            <div class="text-mod-title py-3 px-4" style="font-size: 12px; font-weight: bold">cmdb-server服务</div>
            <div class="mod-flex-center" style="height: 75%">
              <div id="cmdbServer" style="width: 250px; height: 250px"></div>
            </div>
          </div>
          <div class="bg-mod-card">
            <div class="text-mod-title py-3 px-4" style="font-size: 12px; font-weight: bold">系统可用时长</div>
            <div class="mod-flex-center" style="height: 75%">
              <div id="container" style="width: 250px; height: 250px"></div>
            </div>
          </div>
          <div class="bg-mod-card">
            <div class="text-mod-title py-3 px-4" style="font-size: 12px; font-weight: bold">cmdb-login 服务</div>
            <div class="mod-flex-center" style="height: 75%">
              <div id="cmdbLogin" style="width: 250px; height: 250px"></div>
            </div>
          </div>
          <div class="bg-mod-card">
            <div>
              <t-calendar @cell-click="cellClick" ref="myCalendar" :range="['2020-01', '2029-12']" theme="full" multiple :value.sync="valueList" :controllerConfig="controllerConfig" :isCurrent="false">
                <!-- <div slot="head">{{ valueList }}</div> -->
                <template slot="cellAppend" slot-scope="data">
                  <div v-if="getShow(data)" class="cell-append-demo-outer">
                    <span style="display: flex;line-height: 20px;">
                      <i :class="[percentStyle(allDayData[data.formattedDate].status)]" class="Indicator-icon Status-indicator" style="margin-right: 0px; padding-top: 0px"></i>
                    </span>
                    <!-- <t-tag size="small" :theme="allDayData[data.formattedDate].status === 'green' ? 'success' : allDayData[data.formattedDate].status === 'red' ? 'danger' : 'warning'">
                      {{ allDayData[data.formattedDate].status === 'green' ? '优' : allDayData[data.formattedDate].status === 'red' ? '差' : '中' }}
                    </t-tag> -->
                  </div>
                </template>
              </t-calendar>
            </div>
            <div class="p-4">
              <t-button block @click="onDateSelected">
                确定
              </t-button>
            </div>
          </div>
        </div>
        <t-row style="padding-top: 8px" :gutter="16">
          <t-col :span="6" style="position: relative">
            <div class="bg-mod-card rounded-sm">
              <div class="text-mod-title" style="position: absolute; top: 10px; left: 24px; letter-spacing: 1px; font-size: 12px; font-weight: bold">CMDB系统可用时长统计</div>
              <div id="analyLineOne" style="height: 376px"></div>
            </div>
          </t-col>
          <t-col :span="6" style="position: relative" class="bg-mod-card rounded-sm">
            <div class="bg-mod-card rounded-sm">
              <div class="text-mod-title" style="position: absolute; top: 10px; left: 24px; letter-spacing: 1px; font-size: 12px; font-weight: bold">CMDB组件可用时长统计</div>
              <div id="analyLineTwo" style="height: 376px"></div>
            </div>
          </t-col>
        </t-row>
      </div>
  </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'
import { Gauge, Line } from '@antv/g2plot'
import { parseTime } from '@/utils'
import img from '@/assets/images/business.png'
import { cloneDeep } from 'lodash'
import { getServerAvailDurationAllApi, getServerAvailDurationDaysApi, getServerAvailDurationHoursApi } from '@/api/cmdb/cmdb_available'
export default {
  name: 'cmdbAvailable',
  components: {
    ContentHeader
  },
  data () {
    return {
      test: '',
      gauge: null,
      businessImg: img,
      allDayData: {},
      sysServerGauge: null,
      cmdbServerGauge: null,
      cmdbLoginGauge: null,
      sysServerLine: null,
      cmdbCompLine: null,
      valueList: [],
      controllerConfig: {
        visible: true,
        disabled: false, // 是否禁用（全部控件）
        // 年份选择框组件相关设置
        year: {
          visible: true, // 是否显示
          selectProps: {
            // 用于透传props给该select组件
            disabled: false,
            size: 'small'
          }
        },
        // 月份选择框组件相关设置
        month: {
          visible: true, // 是否显示（“year”模式下本身是不显示该组件的）
          selectProps: {
            // 用于透传props给该select组件
            disabled: false,
            size: 'small'
          }
        },
        // 模式切换单选组件设置
        mode: {
          visible: false, // 是否显示
          radioGroupProps: {
            disabled: false,
            size: 'small'
          }
        },
        // 隐藏\显示周末按钮组件相关设置
        weekend: {
          visible: false, // 是否显示
          showWeekendButtonProps: {
            // 用于透传props给显示周末按钮组件
            disabled: false,
            size: 'medium'
          },
          hideWeekendButtonProps: {
            // 用于透传props给隐藏周末按钮组件
            disabled: false,
            variant: 'base',
            size: 'medium'
          }
        },
        // “今天\本月”按钮组件相关设置
        current: {
          visible: true, // 是否显示
          currentDayButtonProps: {
            // 用于透传props给“今天”钮组件（“month”模式下有效）
            disabled: false,
            size: 'small',
            theme: 'warning'
          },
          currentMonthButtonProps: {
            // 用于透传props给“本月”按钮组件（“year”模式下有效）
            disabled: false,
            size: 'small',
            theme: 'success'
          }
        }
      }
    }
  },
  mounted () {
    this.sysServerLine = this.renderLineTotal([])
    this.cmdbCompLine = this.renderLine([])
    this.sysServerGauge = this.renderG2('container', '系统可用时长', 1, { titleFontSize: '18px', contentFontSize: '14px' })
    this.cmdbServerGauge = this.renderG2('cmdbServer', 'cmdb-server 服务', 1, { titleFontSize: '18px', contentFontSize: '14px' })
    this.cmdbLoginGauge = this.renderG2('cmdbLogin', 'cmdb-login 服务', 1, { titleFontSize: '18px', contentFontSize: '14px' })
    this.getServerAvailDurationAll()
  },
  computed: {
    percentStyle () {
      return function (sign) {
        if (sign === 'green') {
          return 'successStatus'
        } else if (sign === 'red') {
          return 'failStatus'
        } else {
          return 'warningStatus'
        }
      }
    }
  },
  methods: {
    cellClick (options) {
      if (this.valueList.includes(options.cell.formattedDate)) {
        this.valueList.splice(this.valueList.findIndex(item => item === options.cell.formattedDate), 1)
      } else {
        this.valueList.push(options.cell.formattedDate)
      }
    },
    getServerStatus (item) {
      const sysServer = item.cmdbServer <= item.cmdbLogin ? item.cmdbServer : item.cmdbLogin
      return sysServer < 0.7 ? sysServer < 0.4 ? 'red' : 'orange' : 'green'
    },
    getServerAvailDurationAll () {
      return new Promise((resolve, reject) => {
        getServerAvailDurationAllApi().then(response => {
          const { data } = response
          if (data.code === 0) {
            const allServerData = {}
            data.data.forEach((item) => {
              allServerData[item.datetime] = {
                status: this.getServerStatus(item),
                sysServer: item.cmdbServer <= item.cmdbLogin ? item.cmdbServer : item.cmdbLogin,
                datetime: item.datetime,
                cmdbServer: item.cmdbServer,
                cmdbLogin: item.cmdbLogin
              }
            })
            this.allDayData = cloneDeep(allServerData)
            const date = new Date()
            if (this.allDayData) {
              const currentDate = parseTime(date.toLocaleDateString(), '{y}-{m}-{d}')
              this.sysServerGauge.changeData(this.allDayData[currentDate].sysServer)
              this.cmdbServerGauge.changeData(this.allDayData[currentDate].cmdbServer)
              this.cmdbLoginGauge.changeData(this.allDayData[currentDate].cmdbLogin)
              this.getServerAvailDurationhours({ start_date: currentDate, end_date: currentDate })
            }
          } else {
            this.$message.error(data.msg)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    getServerAvailDurationDays (dateData) {
      return new Promise((resolve, reject) => {
        getServerAvailDurationDaysApi({ start_date: dateData[0], end_date: dateData[dateData.length - 1] }).then(response => {
          const { data } = response
          if (data.code === 0) {
            if (data.data) {
              this.sysServerGauge.changeData(data.data.cmdbServer <= data.data.cmdbLogin ? data.data.cmdbServer : data.data.cmdbLogin)
              this.cmdbServerGauge.changeData(data.data.cmdbServer)
              this.cmdbLoginGauge.changeData(data.data.cmdbLogin)
              this.getServerAvailDurationhours({ start_date: dateData[0], end_date: dateData[dateData.length - 1] })
            }
          } else {
            this.$message.error(data.msg)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    getServerAvailDurationhours (dateData) {
      return new Promise((resolve, reject) => {
        getServerAvailDurationHoursApi(dateData).then(response => {
          const { data } = response
          if (data.code === 0) {
            if (data.data) {
              data.data.forEach((item) => {
                item.sysServer = item.cmdbServer <= item.cmdbLogin ? item.cmdbServer : item.cmdbLogin
              })
            }
            this.sysServerLine.changeData(data.data)
            const compLineData = []
            data.data.forEach((item) => {
              compLineData.push({
                datetime: item.datetime,
                name: 'cmdb-server',
                data: item.cmdbServer
              })
              compLineData.push({
                datetime: item.datetime,
                name: 'cmdb-login',
                data: item.cmdbLogin
              })
            })
            this.cmdbCompLine.changeData(compLineData)
          } else {
            this.$message.error(data.msg)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    renderG2 (id, name, data, font) {
      const gauge = new Gauge(id, {
        percent: data,
        range: {
          ticks: [0, 1],
          color: ['l(0) 0:#F4664A 0.5:#FAAD14 1:#30BF78']
        },
        indicator: {
          pointer: {
            style: {
              stroke: '#D0D0D0'
            }
          },
          pin: {
            style: {
              stroke: '#D0D0D0'
            }
          }
        },
        statistic: {
          title: {
            formatter: ({ percent }) => {
              return `${(percent * 100).toFixed(1)}%`
            },
            style: ({ percent }) => {
              return {
                fontSize: font.titleFontSize,
                color: percent < 0.7 ? percent < 0.4 ? '#F4664A' : '#FAAD14' : '#30BF78'
              }
            }
          }
        },
        animation: false
      })
      gauge.render()
      return gauge
    },
    renderLineTotal (data) {
      const line = new Line('analyLineOne', {
        data,
        xField: 'datetime',
        yField: 'sysServer',
        appendPadding: [40, 40, 20, 40],
        title: {
          text: '系统可用时长统计'
        },
        tooltip: {
          formatter: (datum) => {
            return { name: '系统可用时长', value: datum.sysServer * 100 + '%' }
          }
        },
        smooth: true,
        xAxis: {
          label: {
            // formatter: (v) => `${v.slice(5, 13)}`,
            style: {
              opacity: 0.8,
              fontSize: 12
            }
          }
        },
        yAxis: {
          label: {
            // 数值格式化为千分位
            formatter: (v) => `${v * 100}%`,
            style: {
              opacity: 0.8,
              fontSize: 12
            }
          },
          grid: null
        },
        slider: {
          start: 0.1,
          end: 0.5
        }
      })
      line.render()
      return line
    },
    renderLine (data) {
      const line = new Line('analyLineTwo', {
        data,
        xField: 'datetime',
        yField: 'data',
        seriesField: 'name',
        appendPadding: [60, 40, 20, 40],
        xAxis: {
          label: {
            // formatter: (v) => `${v.slice(5, 13)}`,
            style: {
              opacity: 0.8,
              fontSize: 12
            }
          }
        },
        yAxis: {
          label: {
            formatter: (v) => `${v * 100}%`,
            style: {
              opacity: 0.8,
              fontSize: 12
            }
          },
          grid: null
        },
        legend: false,
        tooltip: {
          formatter: (datum) => {
            return { name: datum.name + '组件可用时长', value: datum.data * 100 + '%' }
          }
        },
        smooth: true,
        // @TODO 后续会换一种动画方式
        animation: {
          appear: {
            animation: 'path-in',
            duration: 5000
          }
        },
        slider: {
          start: 0.1,
          end: 0.5
        }
      })
      line.render()
      return line
    },
    getShow (data) {
      return data.formattedDate in this.allDayData
    },
    onDateSelected () {
      if (this.valueList.length === 1) {
        if (this.valueList[0] in this.allDayData) {
          this.sysServerGauge.changeData(this.allDayData[this.valueList[0]].sysServer)
          this.cmdbServerGauge.changeData(this.allDayData[this.valueList[0]].cmdbServer)
          this.cmdbLoginGauge.changeData(this.allDayData[this.valueList[0]].cmdbLogin)
          this.getServerAvailDurationhours({ start_date: this.valueList[0], end_date: this.valueList[0] })
        } else {
          this.sysServerGauge.changeData(1)
          this.cmdbServerGauge.changeData(1)
          this.cmdbLoginGauge.changeData(1)
        }
      } else {
        if (this.valueList) {
          this.valueList.sort()
          let isContinuousDate = true
          for (var i = 1; i < this.valueList.length; i++) {
            const startDate = new Date(this.valueList[i - 1])
            const endDate = new Date(this.valueList[i])
            const days = (startDate - endDate) / 86400000
            console.log('days: ', days)
            if (days !== -1) {
              isContinuousDate = false
              break
            }
          }
          if (isContinuousDate) {
            this.getServerAvailDurationDays(this.valueList)
          } else {
            this.$message.warning('日期不连续，请选择连续的日期！')
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.analy-box {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 0.4fr;
  grid-column-gap: 10px;
  width: 100%
}
.t-calendar {
  border: 0px solid #000 !important;
  border-radius: 0px !important;
  padding: 16px 16px 0 16px
}
/deep/ .t-calendar--full .t-calendar__table-body-cell-content {
  padding: 0 !important;
  display: flex !important;
  justify-content: center !important;
}
/deep/ .t-calendar--full {
  min-width: 400px !important;
}
/deep/ .t-calendar--full .t-calendar__panel {
  max-height: 240px !important;
  overflow: auto;
}
/deep/ .t-calendar__table-head-cell {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}
/deep/ .t-calendar--full .t-calendar__table-body-cell {
  border-top: 0px solid #111100 !important;
  height: 40px !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  margin-bottom: 2px;
}
/deep/ .t-calendar--full .t-calendar__table-body-cell.t-is-checked {
  border-radius: 8px !important;
  background-color: rgba(22, 93, 255, 0.4) !important;
}
/deep/ .t-calendar__table-body-cell-display {
  font-size: 12px !important;
}
.Status-indicator {
  margin-top: 0px !important;
}
</style>
