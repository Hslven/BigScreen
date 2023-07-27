import Vue from 'vue'
import App from './App.vue'
import store from './store'

import * as components from './uiComps'
// 前端根据角色处理路由
import router from './router/permission'

// 系统全局配置
import './settings/config'

// 引入svg.js
import './assets/icons/index'

// 第三方组件
import './plugins/tdesign'
import './plugins/antv'
import './plugins/vx-table'
import './plugins/vue-codemirror'
import echarts from 'echarts'
import animated from 'animate.css'
import './assets/css/tailwindcss.css'
import jsonView from 'vue-json-views'
import 'swiper/swiper-bundle.min.css'
// 图标库
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'

// markdown
import './components/Markdown/Markdown'

// ECharts
import './components/ECharts/EChartsConfig'
const startTime = new Date()

// import message from './utils/global'
// todo 生产环境需注释掉，不注释会导致导出的文件数据损坏
// 动态导入 mock 数据
process.env.NODE_ENV === 'development' && require('./mock/index.js')

// 全局提示栏
// Vue.prototype.$msg = message
Vue.config.productionTip = false
Vue.use(animated)
Vue.use(jsonView)

// 注册全局UI组件
components && Object.keys(components).forEach(key => {
  const c = components[key]
  if (typeof c === 'function') {
    Vue.component(c.options.name, c)
  }
})

// 前往 public 文件夹的路径
Vue.prototype.$PUBLIC_PATH = process.env.BASE_URL
// 挂载到vue实例中
Vue.prototype.$echarts = echarts
const vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.directive('permission', {
  inserted (el, binding) {
    const permissionList = store.getters.getModPermission
    if (store.getters.name !== 'admin' && !permissionList.includes(binding.value)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
})

export default vue
const endTime = new Date()
console.log(`启动时间: ${endTime - startTime}ms`)
