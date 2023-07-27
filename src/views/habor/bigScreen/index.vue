<template>
  <div :style="[isScreen ? '' : flexLayout]">
    <div id="big-screen" ref="appRef" :class="{'screen-app': isScreen}">
    <div class="screen-bg" style="width: 1920px; height: 1080px">
      <header>
        <div style="position: relative;" class="h-full">
          <t-row class="h-full text-white">
            <t-col :span="3" class="mod-flex-center h-full">
              <div>
                <div class="sys-name">运维大屏</div>
              </div>
            </t-col>
            <t-col :span="5" class="h-full flex items-end">
              <div class="tab-grid">
                <div v-for="item in tabRouter" :key="item.value" class="mod-flex-center tab-bg">
                  <div :class="[tab === item.value ? 'nav-selected-bg' : 'nav-unselect-bg']" @click="tab = item.value"></div>
                  <div :class="[tab === item.value ? '' : 'tab-unselec-font-color']" class="tab-style" @click="tab = item.value">{{ item.name }}</div>
                </div>
              </div>
            </t-col>
            <t-col :span="4" class="h-full flex justify-end items-center">
              <div class="mr-2 header-right-style">
                <div style="display: inline-block;margin-top: 5px;">{{ currentDate }} {{ currentWeek }}</div>
                <div style="display: inline-block; margin-left: 8px">
                  <div v-show="!isSwipper" @click="viewChange">
                    <mod-icon name="play_circle" class="fullscreen-icon-style"></mod-icon>
                  </div>
                  <div v-show="isSwipper" @click="clear">
                    <mod-icon name="pause_circle" class="fullscreen-icon-style"></mod-icon>
                  </div>
                </div>
                <div style="display: inline-block; margin-left: 8px">
                  <div v-show="!isScreen" @click="openScreen">
                    <mod-icon name="fullscreen" class="fullscreen-icon-style"></mod-icon>
                  </div>
                  <div v-show="isScreen" @click="closeScreen">
                    <mod-icon name="fullscreen_exit" class="fullscreen-icon-style"></mod-icon>
                  </div>
                </div>
              </div>
            </t-col>
          </t-row>
        </div>
      </header>
      <div class="my-2 mx-4">
        <transition name="component-fade" mode="out-in">
          <!-- <keep-alive> -->
            <component :is="tabComp"  class="text-white"></component>
          <!-- </keep-alive> -->
        </transition>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import screenMixin from '@/mixins/screenMixin'
import { getCurrentDate } from '@/utils'
export default {
  name: 'screen',
  mixins: [screenMixin],
  components: {
    alarmComp: () => import('./alarm/alarmComp'),
    performanceComp: () => import('./performance/performanceComp'),
    businessComp: () => import('./business/businessComp'),
    resourceComp: () => import('./resource/resourceComp'),
    temperatureComp: () => import('./temperature/temperatureComp'),
    flowComp: () => import('./flow/flowComp')
  },
  data () {
    return {
      // 是否开启轮播
      isSwipper: false,
      tab: 'alarm',
      currentDate: getCurrentDate().date,
      currentWeek: getCurrentDate().week,
      currentView: 0,
      intervalId: null,
      tabRouter: [
        {
          name: '告警视图',
          value: 'alarm'
        },
        {
          name: '流量视图',
          value: 'flow'
        },
        {
          name: '温度热力视图',
          value: 'temperature'
        }
        // {
        //   name: '资源视图',
        //   value: 'resource'
        // }
      ],
      tabComp: 'alarmComp',
      tabCompDict: {
        alarm: 'alarmComp',
        performance: 'performanceComp',
        business: 'businessComp',
        resource: 'resourceComp',
        temperature: 'temperatureComp',
        flow: 'flowComp'
      },
      testTime: 0,
      debounce: (func, wait) => {
        let timeout
        let previous = 0
        return function () {
          const context = this
          const args = arguments
          const now = Date.now()
          if (!previous) previous = now
          const remaining = wait - (now - previous)
          if (remaining <= 0) {
            if (timeout) {
              clearTimeout(timeout)
              timeout = null
            }
            previous = now
            func.apply(context, args)
          } else if (!timeout) {
            timeout = setTimeout(() => {
              previous = Date.now()
              timeout = null
              func.apply(context, args)
            }, remaining)
          }
        }
      }

    }
  },
  watch: {
    tab: {
      handler (newVal) {
        this.tabComp = this.tabCompDict[newVal]
      }
    }
  },
  mounted () {
    this.viewChange()
    // this.clear()
    // 移动鼠标重置定时器
    this.debouncedGraphModule = () => {
      if (this.isSwipper === false) return
      if (this.intervalId) {
        // console.log('清除大屏轮播')
        clearInterval(this.intervalId)
        // clearInterval(this.test)
        // this.testTime = 0
      }
      // 测试用
      // this.test = setInterval(() => {
      //   this.testTime += 3
      //   console.log(this.testTime, '大屏切换')
      // }, 3000)
      // 5分钟刷新一次
      this.intervalId = setInterval(() => {
        // 测试用
        // this.testTime = 0
        if (!this.isSwipper) {
          this.isSwipper = true
        }
        if (this.currentView < this.tabRouter.length - 1) {
          this.currentView += 1
        } else {
          this.currentView = 0
        }
        this.tab = this.tabRouter[this.currentView].value
      }, 1000 * 60 * 5)
    }
    this.debouncedGraphModule()
    this.template = this.debounce(this.debouncedGraphModule, 2000)
    window.addEventListener('mousemove', this.template)
  },
  methods: {
    viewChange () {
      this.isSwipper = true
      // if (this.intervalId != null) {
      //   return
      // }
      if (this.intervalId) clearInterval(this.intervalId)
      // 5分钟刷新一次
      this.intervalId = setInterval(() => {
        if (!this.isSwipper) {
          this.isSwipper = true
        }
        if (this.currentView < this.tabRouter.length) {
          this.currentView += 1
        } else {
          this.currentView = 0
        }
        this.tab = this.tabRouter[this.currentView].value
      }, 1000 * 60 * 5)
    },
    clear () {
      this.isSwipper = false
      clearInterval(this.intervalId)
      // clearInterval(this.test)
      this.intervalId = null
    }
  },
  destroyed () {
    this.clear()
    window.removeEventListener('mousemove', this.template)
  }
}
</script>
<style scoped>
@import "./index.css";
@import "./tdesign-big-screen.scss";
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to {
  opacity: 0;
}
</style>
<style lang="scss">
@import "@/assets/scss/style.scss";
@import '@/assets/scss/index.scss';
</style>
