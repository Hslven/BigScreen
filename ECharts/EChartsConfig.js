import Vue from 'vue'

import ECharts from 'vue-echarts'

// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import 'echarts/lib/chart/pie'
// import darkTheme from './dark-theme.json'
// import lightTheme from './light-theme.json'
// ECharts.registerTheme('mod-dark', darkTheme)
// ECharts.registerTheme('mod-light', lightTheme)
// 注册 ECharts
Vue.component('v-chart', ECharts)
