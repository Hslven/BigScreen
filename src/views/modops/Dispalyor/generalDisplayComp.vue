<template>
  <div>
    <div v-if="typeof res === 'string' || typeof res.data === 'string'">
      <div style="font-size: 14px, font-weight: bold">评估结果</div>
      <div v-html="typeof res === 'string' ? res : res.data"></div>
    </div>
    <div v-else>
      <div v-if="res && res.type && res.type === 'echarts'">
        <div style="font-size: 14px; font-weight: bold">{{res.title}}</div>
        <div style="height: 360px; width: 520px;">
          <div id="echartsId" style="height: 360px; width: 520px"></div>
        </div>
      </div>
      <div v-else>
        <json-viewer
          :style="{ minHeight: viewHeight }"
          :value="res"
          :expand-depth=1
          copyable
          boxed></json-viewer>
      </div>
    </div>
  </div>
</template>

<script>
import JsonViewer from 'vue-json-viewer'
import 'vue-json-viewer/style.css'
export default {
  name: 'generalDisplayComp',
  components: {
    JsonViewer
  },
  props: ['outputParamData', 'height'],
  data () {
    return {
      res: this.outputParamData,
      viewHeight: this.height
    }
  },
  watch: {
    outputParamData: {
      // 监听输入参数类型变化，加载对应的选择器
      handler (newval, oldvalue) {
        this.res = newval
      }
    }
  },
  mounted () {
    if (this.res.type === 'echarts') {
      this.initChart()
    }
  },
  methods: {
    initChart () {
      const treeMapChart = this.$echarts.init(document.getElementById('echartsId'))
      const option = {
        backgroundColor: '#000',
        title: {
          text: this.res.subnet,
          subtext: 'plan' in this.res ? `规划预警值：${this.res.plan}${this.res.unit}` : '',
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          padding: [10, 0, 15, 30]
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: 100,
          bottom: 40
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          // data: this.res.x,
          axisLabel: {
            formatter: '{value}',
            textStyle: {
              color: '#5b657f'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#191514'
            }
          }
        },
        yAxis: {
          type: 'value',
          min: this.res.min,
          max: this.res.max,
          axisLabel: {
            formatter: `{value}${this.res.unit}`,
            textStyle: {
              color: '#5b657f'
            }
          },
          nameTextStyle: {
            color: '#fff',
            fontSize: 12,
            lineHeight: 40
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#283352'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#283352'
            }
          }
        },
        series: [
          {
            name: this.res.real_y.name,
            type: 'line',
            data: this.res.real_y.data,
            smooth: true,
            symbol: 'emptyCircle',
            symbolSize: 2,
            showSymbol: true,
            itemStyle: {
              normal: {
                label: {
                  show: false // 顶端内容显示
                },
                color: '#25a4fb',
                lineStyle: {
                  color: '#25a4fb'
                }
              }
            },
            areaStyle: {
              normal: {
                color: this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [{
                    offset: 0,
                    color: 'rgba(37, 164, 251,0.4)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(37, 164, 251, 0)'
                  }
                  ],
                  false
                )
              }
            }
          },
          {
            name: this.res.pre_y.name,
            type: 'line',
            data: this.res.pre_y.data,
            smooth: true,
            symbol: 'emptyCircle',
            symbolSize: 2, // 圆点大小
            itemStyle: {
              normal: {
                label: {
                  show: false // 顶端内容显示
                },
                color: '#ffa422',
                lineStyle: {
                  width: 2,
                  color: '#ffa422',
                  type: 'dashed'
                }
              }
            },
            areaStyle: {
              normal: {
                color: this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [{
                    offset: 0,
                    color: 'rgba(255,164,34,0.4)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(255,164,34,0)'
                  }
                  ],
                  false
                )
              }
            }
          }
        ]
      }
      // if ('plan' in this.res) {
      //   option.yAxis.max = Math.max(this.res.max, this.res.plan)
      //   option.series[0].markLine = {
      //     symbol: 'circle',
      //     lineStyle: { normal: { type: 'dashed' } },
      //     data: [
      //       {
      //         yAxis: this.res.plan,
      //         lineStyle: { width: 1.656, color: '#ff6367' },
      //         label: {
      //           position: 'middle',
      //           formatter: `规划预警线-{c}${this.res.unit}`,
      //           show: true,
      //           color: '#ff6367',
      //           fontSize: 10
      //         }
      //       }
      //     ]
      //   }
      // }
      treeMapChart.setOption(option)
    }
  }
}
</script>
