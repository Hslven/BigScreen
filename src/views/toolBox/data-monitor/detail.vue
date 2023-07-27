<template>
  <div style="position: relative;">
    <chevron-left-icon @click="backTo" style="position: absolute; top: 20px; left: 20px;"></chevron-left-icon>
    <div>
      <div class="pb-4">
        <div style='display: grid; grid-template-columns: 1fr 1.5fr 1.5fr;width: 100%;column-gap: 10px'>
          <div class="bg-mod-card bg-img" style='height: 358px; border-radius: 5px; box-shadow: 0 1px 2px 0 rgb(36 46 66 / 6%);'>
            <div style='text-align: center; font-size: 16px; font-weight: bold; letter-spacing: 4px; padding: 20px'>
              <span>{{ modelData.name }}</span>
            </div>
            <t-row :gutter="16">
              <t-col :span="6">
                <div>
                  <div style='font-weight: 600;font-size: 14px;letter-spacing: 1px; text-align: center'>
                    {{ modelData.total }}
                  </div>
                  <div style='letter-spacing: 1px; text-align: center'>数据总量</div>
                </div>
              </t-col>
              <t-col :span="6">
                <div>
                  <div style='font-weight: 600;font-size: 14px;letter-spacing: 1px; text-align: center'>
                    {{ modelData.error_duration }}
                  </div>
                  <div style='letter-spacing: 1px; text-align: center'>违规时长(天)</div>
                </div>
              </t-col>
            </t-row>
            <div class="m-6">
              <div class="font-bold mb-2" style="font-size: 12px">选择资源池</div>
              <t-checkbox-group v-model="poolGroup" :options="poolList" style="overflow: auto; height: 130px;" />
              <t-button variant="outline" @click="changePools" block class="mt-4">
                切换
              </t-button>
            </div>
            <!-- <div style='width: 100%; display: flex; justify-content: center; align-items: center'>
              <div style='width: 200px;'>
                <t-image :src="img" style='background-size: cover; display: flex; justify-content: center; align-items: center; background-color: #242E42;'/>
              </div>
            </div> -->
          </div>
          <div class="bg-mod-card rounded-sm" style='box-shadow: 0 1px 2px 0 rgb(36 46 66 / 6%);'>
            <div style='padding: 20px 0px 0px 20px'>
              <div class="text-mod-body" style="display: inline-block; font-size: 12px; letter-spacing: 1px;">单个模型平均违规率变化情况
              </div>
            </div>
            <div id='modelLine' style='height: 80%'></div>
          </div>
          <div class="bg-mod-card rounded-sm" style='box-shadow: 0 1px 2px 0 rgb(36 46 66 / 6%);'>
            <div style='padding: 20px 10px 0 20px; width: 70%'>
              <t-select label="单个检查项违规率变化情况：" v-model="selectedCheck" :options="checkOptions" size="small" />
            </div>
            <div id='signleCheckLine' style='height: 80%'></div>
          </div>
        </div>
      </div>
      <div>
        <t-row :gutter="16">
          <t-col :span="6">
            <div class="bg-mod-card rounded-sm" style="border-radius: 5px; box-shadow: 0 1px 2px 0 rgb(36 46 66 / 6%);">
              <div style='padding: 20px 0px 0px 20px'>
                <div style="display: inline-block; font-size: 12px; letter-spacing: 1px;">各检查项违规个数变化情况
                </div>
              </div>
              <div id='multChecks' style='height: 80%' class="p-2"></div>
            </div>
          </t-col>
          <t-col :span="6">
            <div class="bg-mod-card rounded-sm" style="border-radius: 5px; box-shadow: 0 1px 2px 0 rgb(36 46 66 / 6%)">
              <div style="border-bottom: 1px solid rgba(233,234,236,0.5)">
                <div style='font-size: 12px; padding: 1rem 1.6rem;letter-spacing: 2px'>违规时长统计</div>
              </div>
              <div style="background: rgba(2,141,216,0.05); padding: 10px 10px; margin: 10px 20px; border-radius: 5px 5px 0px 0px">
                <div class="text-mod-title" style='font-size: 12px; font-weight: bold; display: inline-block;letter-spacing: 2px'>
                  检查项
                </div>
                <div class="text-mod-title" style='font-size: 12px; font-weight: bold; display: inline-block;float: right;letter-spacing: 2px'>
                  时长(天)
                </div>
              </div>
              <div style="overflow: auto; height: 340px">
                <div style="padding: 10px 20px; margin: 0px 20px; border-bottom: 1px solid rgba(233,234,236,0.5)" v-for="checkItem in modelCheckData" :key="checkItem.check_id">
                  <div style='display: inline-block;' class="text-mod-title">
                    {{ checkItem.label }}
                    <div class="text-mod-body truncate" style="font-size: 12px; max-width: 600px">{{ checkItem.desc }}</div>
                  </div>
                  <div style='font-size: 12px; font-weight: bold; display: inline-block;float: right'>
                    {{ checkItem.error_duration  }}
                  </div>
                </div>
              </div>
            </div>
          </t-col>
        </t-row>
      </div>
    </div>
  </div>
</template>

<script>
import workImg from '@/assets/images/business.png'
import { Line, G2 } from '@antv/g2plot'
import { cloneDeep } from 'lodash'
import { getCheckDataApi, getPoolInfosApi } from '@/api/cmdb/cmdb_data_check'
import { ChevronLeftIcon } from 'tdesign-icons-vue'
function parsePoolInfo (poolData) {
  const columnList = [
    { label: '全选', checkAll: true }
  ]
  poolData.forEach(item => {
    const columnDict = {}
    columnDict.label = item.name
    columnDict.value = item.label
    columnList.push(cloneDeep(columnDict))
  })
  return columnList
}
export default {
  name: 'detail',
  components: {
    ChevronLeftIcon
  },
  data () {
    return {
      isSelectedPool: false,
      img: workImg,
      group: [],
      showing: false,
      poolList: [],
      poolGroup: [],
      modelData: {
        name: this.$route.query.modelName,
        total: '',
        error_duration: 0
      },
      modelRenderData: [],
      modelCheckData: {},
      singleModelCheckData: [],
      multiModelCheckData: [],
      checkOptions: [],
      selectedCheck: '',
      checkLine: null,
      modelLine: null,
      multiCheckLine: null
    }
  },
  mounted () {
    this.poolGroup = this.$route.query.pools
    this.getPoolsListData()
    this.getCheckData({ pools: this.poolGroup, model_name: this.$route.query.modelName }, 'init')
  },
  watch: {
    selectedCheck: {
      handler (newval, oldvalue) {
        if (newval === '') {
          this.checkLine.changeData([])
        } else {
          this.checkLine.changeData(this.modelCheckData[newval].value)
        }
      },
      deep: true
    }
  },
  methods: {
    // 请求事件：获取硬件资源池列表数据
    getPoolsListData () {
      return new Promise((resolve, reject) => {
        getPoolInfosApi().then(response => {
          const { data } = response
          if (data.code === 0) {
            this.poolList = parsePoolInfo(cloneDeep(data.data))
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    // 获取CMDB指定资源池下各模型违规数据统计结果
    getCheckData (params, sign) {
      getCheckDataApi(params).then(response => {
        const { data } = response
        if (data.code === 0) {
          data.data.forEach((item) => {
            this.modelData.total = item.model_total.length ? item.model_total[item.model_total.length - 1] : 0
            item.dates.length && item.dates.forEach((date, index) => {
              // 整理出模型违规率所需数据格式
              const modelDataFormat = {
                date: date,
                total: item.model_total[index],
                rate: item.error_pure_rate[index] * 100,
                status: this.checkStatus(index, item.error_pure_rate)
              }
              this.modelRenderData.push(cloneDeep(modelDataFormat))
            })
            item.check_data.length && item.check_data.forEach((checkItem) => {
              // 检查项切换时所需的数据格式
              this.checkOptions.push({
                label: checkItem.check_name,
                value: checkItem.check_id
              })
              // 获取模型的最久违规时长
              if (checkItem.error_duration > this.modelData.error_duration) {
                this.modelData.error_duration = checkItem.error_duration
              }
              this.modelCheckData[checkItem.check_id] = {
                check_id: checkItem.check_id,
                label: checkItem.check_name,
                desc: checkItem.check_desc,
                error_duration: checkItem.error_duration,
                value: []
              }
              // 整理出模型各个检查项违规率所需数据格式
              checkItem.check_dates.forEach((checkDate, index) => {
                const todayRate = (checkItem.check_error_datas[index] / checkItem.check_sum[index]).toFixed(3) * 100
                let yesRate = 0
                if (index !== 0) {
                  yesRate = (checkItem.check_error_datas[index - 1] / checkItem.check_sum[index - 1]).toFixed(3) * 100
                }
                const modelCheckDataFormat = {
                  label: checkItem.check_name,
                  date: checkDate,
                  total: checkItem.check_sum[index],
                  rate: todayRate,
                  error: checkItem.check_error_datas[index],
                  status: index === 0 ? 0 : todayRate - yesRate >= 30 ? 1 : todayRate - yesRate * 100 <= -30 ? -1 : 0
                }
                this.modelCheckData[checkItem.check_id].value.push(cloneDeep(modelCheckDataFormat))
              })
            })
            this.selectedCheck = this.checkOptions.length ? this.checkOptions[0].value : ''
          })
          if (sign === 'init') {
            this.initEchartLine()
          } else {
            this.updateEchartLine()
          }
          this.isSelectedPool = false
        } else {
          this.$message.error(data)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    checkStatus (index, errorPureRate) {
      if (errorPureRate.length <= 1 || index === 0) {
        return 0
      }
      if (errorPureRate[index] * 100 - errorPureRate[index - 1] * 100 >= 30) {
        return 1
      }
      if (errorPureRate[index] * 100 - errorPureRate[index - 1] * 100 <= -30) {
        return -1
      }
      return 0
    },
    changePools () {
      this.checkOptions = []
      this.modelRenderData = []
      this.modelCheckData = {}
      this.singleModelCheckData = []
      this.multiModelCheckData = []
      if (this.poolGroup.length) {
        this.getCheckData({ pools: this.poolGroup, model_name: this.$route.query.modelName })
      } else {
        this.$message.warning('请选择至少一个资源池！')
      }
    },
    initEchartLine () {
      this.renderModelLine(this.modelRenderData)
      this.signleModelCheckLine(this.selectedCheck ? this.modelCheckData[this.selectedCheck].value : [])
      const data = []
      Object.keys(this.modelCheckData).forEach((key) => {
        data.push(...this.modelCheckData[key].value)
      })
      this.renderMultCheckLine(data)
    },
    updateEchartLine () {
      this.modelLine.changeData(this.modelRenderData)
      this.checkLine.changeData(this.selectedCheck ? this.modelCheckData[this.selectedCheck].value : [])
      const data = []
      Object.keys(this.modelCheckData).forEach((key) => {
        data.push(...this.modelCheckData[key].value)
      })
      this.multiCheckLine.changeData(data)
    },
    backTo () {
      this.fromPath = window.sessionStorage.getItem('fromPath')
      this.$router.push({ path: this.fromPath })
    },
    renderModelLine (data) {
      G2.registerShape('point', 'breath-point', {
        draw (cfg, container) {
          const data = cfg.data
          const point = { x: cfg.x, y: cfg.y }
          const group = container.addGroup()
          if (data.status > 0) {
            const decorator1 = group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: '#2B84E7',
                opacity: 0.5
              }
            })
            const decorator2 = group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: '#2B84E7',
                opacity: 0.5
              }
            })
            const decorator3 = group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: '#2B84E7',
                opacity: 0.5
              }
            })
            decorator1.animate(
              {
                r: 10,
                opacity: 0
              },
              {
                duration: 1800,
                easing: 'easeLinear',
                repeat: true
              }
            )
            decorator2.animate(
              {
                r: 10,
                opacity: 0
              },
              {
                duration: 1800,
                easing: 'easeLinear',
                repeat: true,
                delay: 600
              }
            )
            decorator3.animate(
              {
                r: 10,
                opacity: 0
              },
              {
                duration: 1800,
                easing: 'easeLinear',
                repeat: true,
                delay: 1200
              }
            )
            group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: '#2B84E7',
                opacity: 0.7
              }
            })
            group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 1.5,
                fill: '#2B84E7'
              }
            })
          } else if (data.status < 0) {
            const decorator1 = group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: '#2B84E7',
                opacity: 0.5
              }
            })
            const decorator2 = group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: '#2B84E7',
                opacity: 0.5
              }
            })
            const decorator3 = group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: '#2B84E7',
                opacity: 0.5
              }
            })
            decorator1.animate(
              {
                r: 10,
                opacity: 0
              },
              {
                duration: 1800,
                easing: 'easeLinear',
                repeat: true
              }
            )
            decorator2.animate(
              {
                r: 10,
                opacity: 0
              },
              {
                duration: 1800,
                easing: 'easeLinear',
                repeat: true,
                delay: 600
              }
            )
            decorator3.animate(
              {
                r: 10,
                opacity: 0
              },
              {
                duration: 1800,
                easing: 'easeLinear',
                repeat: true,
                delay: 1200
              }
            )
            group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: '#2B84E7',
                opacity: 0.7
              }
            })
            group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 1.5,
                fill: '#2B84E7'
              }
            })
          }

          return group
        }
      })
      this.modelLine = new Line('modelLine', {
        data,
        padding: [24, 60, 20, 74],
        xField: 'date',
        yField: 'rate',
        smooth: true,
        lineStyle: {
          lineWidth: 0.75
        },
        point: {
          shape: 'breath-point'
        },
        xAxis: {
          label: {
            style: {
              fill: 'rgba(121,135,156,0.6)'
            }
          }
        },
        yAxis: {
          grid: {
            line: {
              style: {
                stroke: 'rgba(121,135,156,0.2)',
                lineWidth: 1,
                strokeOpacity: 0.7
              }
            }
          },
          label: {
            style: {
              fill: 'rgba(121,135,156,0.6)'
            },
            formatter: (v) => `${v} %`
          },
          max: 100,
          min: 0,
          tickInterval: 20
        },
        tooltip: {
          customContent: (title, data) => {
            if (data.length) {
              const content = data[0].data
              return `<div style="padding: 10px 5px; color: #79879c">
                       <div style="padding-bottom: 5px">${title}</div>
                       <div style="padding-bottom: 5px">
                          <div style="height: 8px; width: 8px;border-radius: 50px; background-color: #242E42; display: inline-block; margin-right: 4px"></div>
                          <div style="display: inline-block">数据总量：${content.total}</div>
                       </div>
                       <div>
                          <div style="height: 8px; width: 8px;border-radius: 50px; background-color: #2B84E7; display: inline-block; margin-right: 4px"></div>
                          <div style="display: inline-block">违规率：${content.rate} %</div>
                       </div>
                   </div>`
            }
          }
        }
      })
      this.modelLine.render()
    },
    signleModelCheckLine (data) {
      G2.registerShape('point', 'breath-point', {
        draw (cfg, container) {
          const data = cfg.data
          const point = { x: cfg.x, y: cfg.y }
          const group = container.addGroup()
          if (data.status > 0) {
            const decorator1 = group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: '#ff9f43',
                opacity: 0.5
              }
            })
            const decorator2 = group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: '#ff9f43',
                opacity: 0.5
              }
            })
            const decorator3 = group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: '#ff9f43',
                opacity: 0.5
              }
            })
            decorator1.animate(
              {
                r: 10,
                opacity: 0
              },
              {
                duration: 1800,
                easing: 'easeLinear',
                repeat: true
              }
            )
            decorator2.animate(
              {
                r: 10,
                opacity: 0
              },
              {
                duration: 1800,
                easing: 'easeLinear',
                repeat: true,
                delay: 600
              }
            )
            decorator3.animate(
              {
                r: 10,
                opacity: 0
              },
              {
                duration: 1800,
                easing: 'easeLinear',
                repeat: true,
                delay: 1200
              }
            )
            group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 4,
                fill: '#ff9f43',
                opacity: 0.7
              }
            })
            group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 1.5,
                fill: '#ff9f43'
              }
            })
          } else if (data.status < 0) {
            const decorator1 = group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: '#ff9f43',
                opacity: 0.5
              }
            })
            const decorator2 = group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: '#ff9f43',
                opacity: 0.5
              }
            })
            const decorator3 = group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 5,
                fill: '#ff9f43',
                opacity: 0.5
              }
            })
            decorator1.animate(
              {
                r: 10,
                opacity: 0
              },
              {
                duration: 1800,
                easing: 'easeLinear',
                repeat: true
              }
            )
            decorator2.animate(
              {
                r: 10,
                opacity: 0
              },
              {
                duration: 1800,
                easing: 'easeLinear',
                repeat: true,
                delay: 600
              }
            )
            decorator3.animate(
              {
                r: 10,
                opacity: 0
              },
              {
                duration: 1800,
                easing: 'easeLinear',
                repeat: true,
                delay: 1200
              }
            )
            group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 4,
                fill: '#ff9f43',
                opacity: 0.7
              }
            })
            group.addShape('circle', {
              attrs: {
                x: point.x,
                y: point.y,
                r: 1.5,
                fill: '#ff9f43'
              }
            })
          }

          return group
        }
      })

      this.checkLine = new Line('signleCheckLine', {
        data,
        padding: [24, 60, 20, 74],
        xField: 'date',
        yField: 'rate',
        color: '#ff9f43',
        smooth: true,
        lineStyle: {
          lineWidth: 0.75
        },
        point: {
          shape: 'breath-point'
        },
        xAxis: {
          label: {
            style: {
              fill: 'rgba(121,135,156,0.6)'
            }
          }
        },
        yAxis: {
          grid: {
            line: {
              style: {
                stroke: 'rgba(121,135,156,0.2)',
                lineWidth: 1,
                strokeOpacity: 0.7
              }
            }
          },
          label: {
            style: {
              fill: 'rgba(121,135,156,0.6)'
            },
            formatter: (v) => `${v} %`
          },
          max: 100,
          min: 0,
          tickInterval: 20
        },
        tooltip: {
          customContent: (title, data) => {
            if (data.length) {
              const content = data[0].data
              return `<div style="padding: 10px 5px; color: #79879c">
                       <div style="padding-bottom: 5px">${title}</div>
                       <div>
                          <div style="height: 8px; width: 8px;border-radius: 50px; background-color: #ff9f43; display: inline-block; margin-right: 4px"></div>
                          <div style="display: inline-block">模型数据总量：${content.total}</div>
                       </div>
                       <div>
                          <div style="height: 8px; width: 8px;border-radius: 50px; background-color: #ff9f43; display: inline-block; margin-right: 4px"></div>
                          <div style="display: inline-block">违规率：${content.rate}%</div>
                       </div>
                   </div>`
            }
          }
        }
      })
      this.checkLine.render()
    },
    renderMultCheckLine (data) {
      this.multiCheckLine = new Line('multChecks', {
        data,
        xField: 'date',
        yField: 'error',
        padding: [24, 60, 20, 74],
        seriesField: 'label',
        lineStyle: {
          lineWidth: 0.75
        },
        xAxis: {
          label: {
            style: {
              fill: 'rgba(121,135,156,0.6)'
            }
          }
        },
        yAxis: {
          grid: {
            line: {
              style: {
                stroke: 'rgba(121,135,156,0.2)',
                lineWidth: 1,
                strokeOpacity: 0.7
              }
            }
          },
          label: {
            style: {
              fill: 'rgba(121,135,156,0.6)'
            },
            formatter: (v) => `${v}`
          }
          // max: 100,
          // min: 0,
          // tickInterval: 20
        },
        legend: false,
        smooth: true,
        // @TODO 后续会换一种动画方式
        animation: {
          appear: {
            animation: 'path-in',
            duration: 5000
          }
        }
      })
      this.multiCheckLine.render()
    }
  }
}
</script>

<style scoped>
.ad-info-card,
.ad-info-card:hover {
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
}

.ad-info-card {
  overflow: hidden;
  transform: translateY(0);
}

.ad-info-card:after {
  content: "";
  width: 50px;
  height: 50px;
  background: #49b2f6;
  position: absolute;
  top: -20px;
  left: -20px;
  z-index: 0;
  border-radius: 100px;
  animation: zoom 5s infinite linear;
  opacity: 0.2;
}

.ad-info-card:before {
  content: "";
  width: 80px;
  height: 80px;
  background: #49b2f6;
  position: absolute;
  bottom: -10px;
  right: -10px;
  z-index: 0;
  border-radius: 100px;
  animation: zoom 4s infinite linear;
  opacity: 0.2;
}
/deep/ .t-checkbox {
  padding: 0 12px 0 0 !important;
}
/deep/ .t-checkbox__label {
  font-size: 12px !important;
}
.bg-img {
  background-color: #f9fbfd;
  background-repeat: no-repeat;
  background-size: 100% auto;
  border-radius: 4px 4px 0 0;
  background-image: url(~@/assets/images/background/login-background-01.png);
}
</style>
