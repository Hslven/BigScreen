<template>
  <div class="px-4">
    <!-- <t-time-picker
      format="HH:mm"
      v-model="timevalue"
      @change="handleTimeChange"
      class="big-screen-time-select"
      :popup-props="{ attach: '.big-screen-time-select' }"
    /> -->
    <div class="active-event-bg mt-4">

      <div id="temperatureComp" style="width: 100%; min-height: 980px"></div>
    </div>
  </div>
</template>

<script>
import threeIcon from '@/assets/images/screen/temperatureComp/three_icon.png'
import options from './utils/echart.js'
import {
  getTemperatureCompResourcePoolAzTempAPI,
  getTemperatureCompEchartsAPI
} from '@/api/monitor/bigScreen'
import * as echarts from 'echarts' // echarts 5.3.3
// import { cloneDeep } from 'lodash'

export default {
  name: 'temperatureComp',
  data () {
    return {
      threeIcon,
      myChart: null,
      timevalue: '',
      transportData: {},
      options
    }
  },
  methods: {
    resize () {
      const _W = document.querySelector('#temperatureComp').offsetWidth
      this.myChart.resize({
        width: _W,
        height: _W / (_W / 800)
      })
    },
    // handleTimeChange (val) {
    //   console.log(val)
    // },
    getListData () {
      console.log(1)
      this.loadingAttachInstance = this.$loading({
        attach: '#temperatureComp',
        text: '数据加载中...',
        size: '40px'
      })

      return getTemperatureCompEchartsAPI().then((res) => {
        const data = res.data.data
        for (const i in data) {
          // console.log(data[i])
          switch (i) {
            case 'threshold0':
              this.options.series[0].name = ' 未采集'
              break
            case 'threshold1':
              this.options.series[1].name = data[i] + ' 正常'
              break
            case 'threshold2':
              this.options.series[2].name = data[i] + ' 警戒'
              break
            case 'threshold3':
              this.options.series[3].name = data[i] + ' 危险'
              break
            case 'threshold4':
              this.options.series[4].name = data[i] + ' 临界'
              break
            case 'resourcePoolTemp':
              if (this.options.xAxis.data.length > 0) break
              for (const ar of data.resourcePoolTemp) {
                // console.log(ar)
                this.options.xAxis.data.push(ar.resourcePoolAlias)
                this.options.aliasName.push({
                  name: ar.resourcePoolName,
                  aliasName: ar.resourcePoolAlias
                })
                this.options.series[0].data.push(ar.threshold0Value)
                this.options.series[1].data.push(ar.threshold1Value)
                this.options.series[2].data.push(ar.threshold2Value)
                this.options.series[3].data.push(ar.threshold3Value)
                this.options.series[4].data.push(ar.threshold4Value)
              }
              break
          }
        }
        this.loadingAttachInstance.hide()
      }).finally(() => {
        setTimeout(() => {
          this.myChart.setOption(this.options)
        }, 100)
      })
    }
  },
  async mounted () {
    await this.getListData()
    this.myChart = echarts.init(document.getElementById('temperatureComp'))
    this.echartsLoop = setInterval(() => {
      this.getListData()
      // 写一个更新chart数据的方法
      this.myChart.setOption(this.options)
    }, 1000 * 60 * 5)

    this.myChart.on('click', (params) => {
      const loadingAttachInstance = this.$loading({
        attach: '#temperatureComp',
        text: '数据加载中...',
        size: '40px'
      })
      const index = this.options.aliasName.findIndex((item) => {
        // console.log(item, params.name)
        return item.aliasName === params.name
      })

      // 没有响应式的问题，解决1使用$set
      // this.$set(this.transportData, 'name', this.options.aliasName[index].name)
      // this.$set(this.transportData, 'aliasName', this.options.aliasName[index].aliasName)

      this.transportData.name = this.options.aliasName[index].name
      this.transportData.aliasName = this.options.aliasName[index].aliasName
      const temp = {
        resourcePool: this.transportData.name,
        time: this.timevalue
      }
      getTemperatureCompResourcePoolAzTempAPI(temp).then((res) => {
        // this.loadingAttachInstance = this.$loading({
        //   attach: '#temperatureComp',
        //   text: '数据加载中...',
        //   size: '40px'
        // })
        const port = res.data.data
        this.transportData.leftPort = port[0]
        this.transportData.rightPort = port[1]
        // this.$set(this.transportData, 'leftPort', port[0])
        // this.$set(this.transportData, 'rightPort', port[1])
        // 解决2创建新对象
        const test = Object.assign({}, this.user, this.transportData)
        // console.log(test)
        // setTimeout(() => {
        this.$emit('echartClick', test)
        loadingAttachInstance.hide()
        // }, 4000)
      })

      if (this.otherLoop) {
        clearInterval(this.otherLoop)
      }
      this.otherLoop = setInterval(() => {
      // 写一个更新other数据的方法
        const loadingAttachInstance = this.$loading({
          attach: '#temperatureComp',
          text: '数据更新中...',
          size: '40px'
        })
        getTemperatureCompResourcePoolAzTempAPI(temp).then((res) => {
          const port = res.data.data
          this.transportData.leftPort = port[0]
          this.transportData.rightPort = port[1]
          // this.$set(this.transportData, 'leftPort', port[0])
          // this.$set(this.transportData, 'rightPort', port[1])
          // 解决2创建新对象
          const test = Object.assign({}, this.user, this.transportData)
          // console.log(test)
          this.$emit('echartClick', test, false)
          loadingAttachInstance.hide()
        })
      }, 1000 * 5 * 60)
    })
    // window.addEventListener('resize', this.resize)
  },
  beforeDestroy () {
    // window.removeEventListener('resize', this.resize)
    clearInterval(this.echartsLoop)
    clearInterval(this.otherLoop)
  }
}
</script>
