<template>
  <t-row class="pb-4" :gutter="12">
    <t-col flex="1460px">
      <div style="position: relative" class="pt-2" id="alarm-view">
        <!-- <div style="position: absolute; right: 5px; top: -6px">
          <t-time-picker class="big-screen-time-select" :popup-props="{ attach: '.big-screen-time-select' }" format="HH:mm" v-model="value" @change="handleTimeChange" />
        </div> -->
        <div v-for="(item, label) in resourcePoolAlarmEventData" :key="label" class="pool-card">
          <div style="font-family: logo-font; font-size: 18px; line-height: 23px; margin-top: 8px;">{{ label }}</div>
          <div style="display: grid;grid-template-columns: 1fr 1fr 1fr 1fr 1fr; row-gap: 14px; column-gap: 14px;">
            <div v-for="(content, index) in item" :key="index" :class="contentColor(content)" @click="onResourcePoolDetail(content)">
              <div style="position: relative; cursor: pointer;" class="h-full">
                <t-row class="text-white pt-6 pl-4 flex items-center">
                  <t-col flex="auto">
                    <div style="font-family: logo-font; font-size: 32px; line-height: 23px; text-shadow: 2px 0px 21px #1A5AB4; letter-spacing: 6px;">
                      {{ content.name }}
                    </div>
                  </t-col>
                  <t-col flex="140px">
                    <div class="flex justify-end" style="color: #DFEAFE;">
                      <div>
                          <div
                            :id="`container-${projectPeriodFormat(label)}-${index}`"
                            style="height: 40px; width: 120px"
                        ></div>
                      </div>
                    </div>
                  </t-col>
                </t-row>
                <div style="position: absolute; bottom: 24px; left: 4px;">
                  <div style="display: grid;grid-template-columns: 2fr 0.5fr 3fr 0.5fr 3fr 0.5fr 3fr; padding: 0px 0px 0px 12px" class="h-full items-center">
                    <div>
                      <div style="font-size: 20px; color: #ffffff; font-weight: 900;" class="mod-flex-center bin-light-font">{{ content.eventAlarmSum }}</div>
                      <div style="font-size: 12px; line-height: 23px; letter-spacing: 2px; color: #ABBEE3;" class="mod-flex-center">事件</div>
                    </div>
                    <t-divider layout="vertical" />
                    <div>
                      <div style="font-size: 20px; color: #ea6094; font-weight: 900;" class="mod-flex-center bin-light-font">{{ content.oneAlarmSum }}</div>
                      <div style="font-size: 12px; line-height: 23px; letter-spacing: 2px; color: #ABBEE3;" class="mod-flex-center">一级告警</div>
                    </div>
                    <t-divider layout="vertical" />
                    <div>
                      <div style="font-size: 20px; color: #ffaa15; font-weight: 900;" class="mod-flex-center bin-light-font">{{ content.twoAlarmSum }}</div>
                      <div style="font-size: 12px; line-height: 23px; letter-spacing: 2px; color: #ABBEE3;" class="mod-flex-center">二级告警</div>
                    </div>
                    <t-divider layout="vertical" />
                    <div>
                      <div style="font-size: 20px; color: #ffec13; font-weight: 900;" class="mod-flex-center bin-light-font">{{ content.threeAlarmSum }}</div>
                      <div style="font-size: 12px; line-height: 23px; letter-spacing: 2px; color: #ABBEE3;" class="mod-flex-center">三级告警</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </t-col>
    <t-col flex="auto">
      <div>
        <div class="active-event-bg mt-4">
          <div class="title-bg" style="height: 54px;">
            <div class="h-full" style="margin-left: 18px; display: flex; flex-direction: row; align-items: center;">
              <div class="title-left-icon"></div>
              <div style="font-family: logo-font;color: #fff;font-size: 18px; line-height: 23px;letter-spacing: 4px;" class="mr-4">总活动告警</div>
              <div style="font-size: 12px; color: #B5B5B5;letter-spacing: 2px;">Total activity alarm</div>
            </div>
          </div>
          <div class="mod-flex-center" style="padding: 26px 0;">
            <div id="pieEchart" style="height: 236px; width: 420px"></div>
          </div>
        </div>
        <div class="active-event-bg mt-4">
          <div class="title-bg" style="height: 42px;">
            <div class="h-full" style="margin-left: 18px; display: flex; flex-direction: row; align-items: center;">
              <div class="title-left-icon"></div>
              <div style="font-family: logo-font;color: #fff;font-size: 18px; line-height: 23px;letter-spacing: 4px;" class="mr-4">活动告警事件</div>
              <div style="font-size: 12px; color: #B5B5B5;letter-spacing: 2px;">Active alarm events</div>
            </div>
          </div>
          <div style="padding: 12px 12px 40px 16px;" id="alarm-event">
            <mod-scroll-board :config="alarmData" style="width:100%;height:500px"></mod-scroll-board>
          </div>
        </div>
      </div>
    </t-col>
    <t-dialog attach="#big-screen" placement="center" width="1450px" class="h-full" :visible.sync="isPoolDetail" header="资源池详情" :cancelBtn="null" :confirm-btn="null">
      <div>
        <t-row :gutter="16">
          <t-col flex="349px" class="w-full">
            <div style="background: #0048AE" class="w-full">
              <div id="pieDetailEchart" style="height: 320px; width: 349px"></div>
            </div>
          </t-col>
          <t-col flex="auto">
            <div style="background: #0048AE; height: 320px; width: 100%" class="flex items-center justify-center">
              <div>
                <div class="placeholder-style"></div>
                <div style="color: white; text-align: center;" class="pt-4">该功能暂未开放</div>
              </div>
              <!-- <div id="lineDetailEchart" style="height: 320px; width: 1010px"></div> -->
            </div>
          </t-col>
        </t-row>
      </div>
      <div class="mt-4">
        <t-table
          rowKey="index"
          :columns="columns"
          :data="tableData"
          :bordered="false"
          size="small"
          style="font-size: 12px; color: #86A1C8; letter-spacing: 2px"
          :pagination="pagination"
        >
          <template #status="{ row }">
            <div>
              <t-space>
                <div class="h-full flex justify-center items-center">
                  <div style="height: 8px; width: 8px; border-radius: 50%" :style="{background: row.status === 'success' ? '#24FFC8' : '#CF595F'}"></div>
                </div>
                <div>{{ statusFormatter(row.status) }}</div>
              </t-space>
            </div>
          </template>
          <template #level="{ row }">
            <div :style="{ color: row.level === '重要' ? '#FF935F' : '#CF595F' }">{{ row.level }}</div>
          </template>
        </t-table>
      </div>
    </t-dialog>
  </t-row>
</template>
<script>
import { TinyArea } from '@antv/g2plot'
import { getViewDataAPI, getAlarmDataAPI, getDetailDataAPI } from '@/api/monitor/bigScreen'
import { cloneDeep } from 'lodash'
export default {
  name: 'alarmComp',
  data () {
    return {
      intervalId: null,
      isPoolDetail: false,
      resourcePoolAlarmEventData: {
        一期: [],
        二期: [],
        三期: []
      },
      totalAlarmEchartPie: null,
      totalAlarmEchartData: [
        { name: '事件', value: 0 },
        { name: '一级告警', value: 0 },
        { name: '二级告警', value: 0 },
        { name: '三级告警', value: 0 }
      ],
      alarmData: {
        header: ['等级', '类型', '资源池', '名称', '时间'],
        data: [],
        rowNum: 15, // 表格行数
        headerHeight: 23,
        oddRowBGC: 'rgba(6, 17, 32, 0.15)', // 奇数行
        evenRowBGC: 'rgba(121, 176, 255, 0.12)', // 偶数行
        columnWidth: [54, 54, 70, 140, 80],
        align: ['left']
      },
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 12,
        total: 10,
        showJumper: false
      },
      columns: [
        {
          colKey: 'type',
          align: 'left',
          title: '类型'
        },
        {
          colKey: 'status',
          align: 'left',
          title: '状态'
        },
        {
          colKey: 'start_time',
          align: 'left',
          title: '发生时间',
          width: '240',
          ellipsis: true
        },
        {
          colKey: 'level',
          align: 'left',
          title: '级别'
        },
        {
          colKey: 'title',
          align: 'left',
          title: '标题',
          width: '300',
          ellipsis: true
        },
        {
          colKey: 'device_name',
          align: 'left',
          title: '设备名称',
          width: '500',
          ellipsis: true
        }
      ],
      tableData: []
    }
  },
  mounted () {
    this.getResourcePoolViewData()
    this.getAlarmData()
    this.dataRefreh()
  },
  computed: {
    statusFormatter () {
      return function (status) {
        if (status) {
          return '已恢复'
        } else {
          return '未恢复'
        }
      }
    }
  },
  methods: {
    dataRefreh () {
      // 计时器正在进行中，退出函数
      if (this.intervalId != null) {
        return
      }
      // 5分钟刷新一次
      this.intervalId = setInterval(() => {
        this.getResourcePoolViewData()
        this.getAlarmData()
      }, 300000)
    },
    clear () {
      clearInterval(this.intervalId) // 清除计时器
      this.intervalId = null // 设置为null
    },
    projectPeriodFormat (data) {
      const dictObj = {
        一期: 1,
        二期: 2,
        三期: 3
      }
      return dictObj[data]
    },
    getResourcePoolViewData () {
      const loadingAttachInstance = this.$loading({
        attach: '#alarm-view',
        text: '数据加载中...',
        size: '40px'
      })
      return new Promise((resolve, reject) => {
        getViewDataAPI().then(response => {
          const { data } = response
          if (data.code === 0) {
            this.dataProcess(data.data)
          }
          loadingAttachInstance.hide()
        }).catch(error => {
          loadingAttachInstance.hide()
          this.$message.error(error)
        })
      })
    },
    getAlarmData () {
      const loadingAttachInstance = this.$loading({
        attach: '#alarm-event',
        text: '告警事件加载中...',
        size: '40px'
      })
      return new Promise((resolve, reject) => {
        getAlarmDataAPI().then(response => {
          const { data } = response
          if (data.code === 0) {
            const alarmDataBack = {
              header: ['等级', '类型', '资源池', '名称', '时间'],
              data: [],
              rowNum: 15, // 表格行数
              headerHeight: 23,
              oddRowBGC: 'rgba(6, 17, 32, 0.15)', // 奇数行
              evenRowBGC: 'rgba(121, 176, 255, 0.12)', // 偶数行
              columnWidth: [54, 54, 70, 100, 100],
              align: ['left']
            }
            data.data.forEach(item => {
              alarmDataBack.data.push([item.level, item.type, item.name, item.title, item.start_time || 'null'])
            })
            // 更新事件轮播数据
            this.alarmData = cloneDeep(alarmDataBack)
          }
          loadingAttachInstance.hide()
        }).catch(error => {
          loadingAttachInstance.hide()
          this.$message.error(error.response.data.message)
        })
      })
    },
    onResourcePoolDetail (data) {
      return new Promise((resolve, reject) => {
        getDetailDataAPI({ resourcePool: data.pool_name }).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.isPoolDetail = true
            const resourcePoolDetail = [
              { name: '事件', value: data.data.eventAlarmSum },
              { name: '一级告警', value: data.data.oneAlarmSum },
              { name: '二级告警', value: data.data.twoAlarmSum },
              { name: '三级告警', value: data.data.threeAlarmSum }
            ]
            this.initDetailChart(resourcePoolDetail)
            this.tableData = data.data.detail
          }
        }).catch(error => {
          this.$message.error(`获取资源池详情数据失败：${error}`)
        })
      })
    },
    dataProcess (data) {
      const resourcePoolAlarmEventDataBack = {
        一期: [],
        二期: [],
        三期: []
      }
      let eventAlarmSum = 0
      let oneAlarmSum = 0
      let twoAlarmSum = 0
      let threeAlarmSum = 0
      data.forEach(item => {
        resourcePoolAlarmEventDataBack[item.project_period].push(item)
        eventAlarmSum += item.eventAlarmSum
        oneAlarmSum += item.oneAlarmSum
        twoAlarmSum += item.twoAlarmSum
        threeAlarmSum += item.threeAlarmSum
      })
      this.totalAlarmEchartData[0].value = eventAlarmSum
      this.totalAlarmEchartData[1].value = oneAlarmSum
      this.totalAlarmEchartData[2].value = twoAlarmSum
      this.totalAlarmEchartData[3].value = threeAlarmSum
      // 更新资源池卡片数据
      this.resourcePoolAlarmEventData = cloneDeep(resourcePoolAlarmEventDataBack)
      // 更新饼图数据
      if (this.totalAlarmEchartPie) {
        const option = this.totalAlarmEchartPie.getOption()
        option.series[0].data = this.totalAlarmEchartData
        this.totalAlarmEchartPie.setOption(option)
      } else {
        this.initChart()
      }
    },
    renderLine (content, key, index) {
      const antvData = [
        264,
        417,
        438,
        887,
        309,
        397,
        550,
        575,
        563,
        430,
        525,
        592,
        492,
        467,
        513,
        546,
        983,
        340,
        539,
        243,
        226,
        192
      ]
      const idSign = `container-${key}-${index}`
      const linePlot = new TinyArea(idSign, {
        data: antvData,
        autoFit: false,
        smooth: true,
        line: {
          color: content.isAlarm ? '#ffffff' : '#7ffffd'
        },
        areaStyle: {
          fill: content.isAlarm ? 'l(270) 0:rgba(255,255,255, 0) 0.5:rgba(255,255,255, 0.5) 1:rgba(255,255,255, 0.7)' : 'l(270) 0:rgba(127,255,253, 0) 0.5:rgba(127,255,253, 0.5) 1:rgba(127,255,253, 0.7)'
        }
      })
      linePlot.render()
    },
    initChart () {
      this.totalAlarmEchartPie = this.$echarts.init(document.getElementById('pieEchart'))
      const legendFormat = (data) => {
        for (let index = 0; index < this.totalAlarmEchartData.length; index++) {
          if (this.totalAlarmEchartData[index].name === data) {
            return this.totalAlarmEchartData[index].value
          }
        }
        return 0
      }
      const option = {
        title: {
          text: '总预警数',
          subtext: `${this.totalAlarmEchartData.reduce((prev, curr) => prev + parseInt(curr.value), 0)}`,
          textStyle: {
            fontSize: 12,
            color: '#8C9CB4',
            lineHeight: 16
          },
          subtextStyle: {
            fontSize: 26,
            color: '#fff',
            fontFamily: 'din-light'
          },
          textAlign: 'center',
          left: '25%',
          top: '39%'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: '12%',
          top: 'center',
          itemGap: 20,
          selectedMode: false,
          icon: 'square',
          data: ['事件', '一级告警', '二级告警', '三级告警'],
          textStyle: {
            color: '#8C9CB4',
            rich: {
              uname: {
                width: 64
              },
              unum: {
                fontSize: 14,
                color: '#fff',
                width: 40,
                align: 'right',
                fontFamily: 'din-light'
              }
            }
          },
          formatter (name) {
            return `{uname|${name}}{unum|${legendFormat(name)}}条`
          }
        },
        color: ['#7FFFFD ', '#DD5B5B', '#FF9360', '#feca78'],
        series: [
          {
            name: '总活动告警事件',
            type: 'pie',
            radius: [58, 75],
            center: ['26%', '50%'],
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            itemStyle: false,
            data: this.totalAlarmEchartData
          }
        ]
      }
      this.totalAlarmEchartPie.setOption(option)
    },
    initDetailChart (resourcePoolDetail) {
      const pieChart = this.$echarts.init(document.getElementById('pieDetailEchart'))
      const legendFormat = (data) => {
        for (let index = 0; index < resourcePoolDetail.length; index++) {
          if (resourcePoolDetail[index].name === data) {
            return resourcePoolDetail[index].value
          }
        }
        return 0
      }
      const option = {
        title: {
          text: '总预警数',
          subtext: `${resourcePoolDetail.reduce((prev, curr) => prev + parseInt(curr.value), 0)}`,
          textStyle: {
            fontSize: 12,
            color: '#fff',
            lineHeight: 16
          },
          subtextStyle: {
            fontSize: 26,
            color: '#fff',
            fontFamily: 'din-light'
          },
          textAlign: 'center',
          left: '49%',
          top: '27%'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          itemWidth: 20,
          orient: 'vertical',
          top: '78%',
          left: '8%',
          icon: 'square',
          data: ['一级告警', '二级告警', '三级告警', '事件'],
          textStyle: {
            color: '#8C9CB4',
            rich: {
              uname: {
                width: 64
              },
              unum: {
                fontSize: 14,
                color: '#fff',
                width: 40,
                align: 'right',
                fontFamily: 'din-light'
              }
            }
          },
          formatter (name, item) {
            return `{uname|${name}}{unum|${legendFormat(name)}}条`
          }
        },
        color: ['#7FFFFD ', '#DD5B5B', '#FF9360', '#3585FF'],
        series: [
          {
            name: '事件',
            type: 'pie',
            radius: [70, 90],
            center: ['50%', '35%'],
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            itemStyle: false,
            data: resourcePoolDetail
          }
        ]
      }
      pieChart.setOption(option)
    },
    initDetailLine () {
      const lineChart = this.$echarts.init(document.getElementById('lineDetailEchart'))
      const option = {
        legend: {
          itemWidth: 10,
          bottom: '4%',
          icon: 'square',
          data: ['事件', '一级告警', '二级告警', '三级告警'],
          textStyle: {
            color: '#8C9CB4'
          }
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            animation: false,
            type: 'line',
            axis: 'x'
          }
        },
        grid: {
          top: '10%',
          left: '3%',
          right: '0',
          bottom: '16%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['0点', '1点', '2点', '3点', '4点', '5点', '6点', '7点', '8点', '9点', '10点', '11点', '12点', '13点', '14点', '15点', '16点', '17点', '18点', '19点', '20点', '21点', '22点', '23点', '24点'],
          axisLine: {
            show: true,
            lineStyle: {
              color: '#6CA9FF',
              width: 1
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(136, 159, 204, .2)'
            }
          },
          axisTick: {
            show: false,
            alignWithLabel: true
          },
          axisLabel: {
            showMinLabel: false,
            textStyle: {
              color: '#6CA9FF'
            }
          }
        },
        color: ['#7FFFFD', '#CF5A60', '#EABE7E', '#FFB5E8'],
        series: [
          {
            name: '事件',
            type: 'line',
            showSymbol: false,
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 12, 12, 43]
          },
          {
            name: '一级告警',
            type: 'line',
            showSymbol: false,
            stack: '总量',
            data: [101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 12, 12, 43, 120, 132]
          },
          {
            name: '二级告警',
            type: 'line',
            showSymbol: false,
            stack: '总量',
            data: [210, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 12, 12, 43, 120, 132, 101, 134, 90, 230]
          },
          {
            name: '三级告警',
            type: 'line',
            showSymbol: false,
            stack: '总量',
            data: [90, 230, 210, 120, 132, 101, 134, 90, 230, 210, 12, 12, 43, 120, 132, 101, 134, 90, 230, 210, 120, 132, 101, 134]
          }
        ]
      }
      lineChart.setOption(option)
    },
    contentColor (content) {
      if (
        content.oneAlarmSum !== 0 || content.eventAlarmSum !== 0 || content.twoAlarmSum !== 0 || content.threeAlarmSum !== 0
      ) {
        return 'content-bg-red'
      } else {
        return 'content-bg'
      }
    }
  },
  destroyed () {
    // 在页面销毁后，清除计时器
    this.clear()
  }
}
</script>

<style scoped>
  .placeholder-style {
    height: 150px;
    width: 230px;
    background-image: url("~@/assets/images/screen/placeholder.png");
    background-size: cover;
    background-position: center center;
  }
  .content-bg {
    width: 100%;
    height: 166px;
    border-radius: 9px;
    /* width: 100%;
    height: 100%; */
    background-image: url("~@/assets/images/screen/content_bg.png");
    background-size: cover;
    background-position: center center;
    transition: all 0.5s;
  }
  .content-bg:hover, .content-bg-red:hover {
    /* border: 3px solid #65E1DF;
    box-shadow: 7px 0px 10px 0px #65E1DF; */
    box-shadow: 7px 0px 10px 0px #65E1DF, 3px 0px 0px 0px #65E1DF, -3px 0px 0px 0px #65E1DF, 0px 3px 0px 0px #65E1DF, 0px -3px 0px 0px #65E1DF;
  }
  .content-bg-red {
    width: 100%;
    height: 166px;
    border-radius: 9px;
    /* width: 100%;
    height: 100%; */
    background-image: url("~@/assets/images/screen/content_bg_red.png");
    background-size: cover;
    background-position: center center;
  }
  /deep/ .t-divider--vertical {
    margin: 0 6px !important;
    height: 22px !important;
  }
  /deep/ .t-divider--vertical {
    border: 1px solid #A8AEBD !important;
  }
  .active-event-bg {
    background-color: rgba(37, 91, 163, 0.56);
    border-radius: 10px 10px 10px 10px;
  }
  .title-bg {
    background-image: url("~@/assets/images/screen/title_bg.png");
    background-size: cover;
    background-position: center center;
    width: 100%;
    border-radius: 10px;
    background-color: rgba(37, 91, 163, 0.56) !important;
  }
  .title-left-icon {
    background-image: url("~@/assets/images/screen/title_left_icon.png");
    background-size: cover;
    background-position: center center;
    height: 20px;
    width: 20px;
    margin-right: 12px;
    margin-top: 6px;
  }
  .sub-content-color {
    color: #A8AEBD;
  }
  .level-number-style {
    font-size: 16px;
    color: #fff;
    text-shadow: 0px 0px 4px #fff;
    letter-spacing: 2px;
  }
</style>
