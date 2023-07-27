<template>
  <t-swiper
    :current="currentTab"
    :navigation="{ showSlideBtn: 'never', type: 'fraction' }"
    :autoplay="false"
    style="width: 1900px; height: 968px"
    id="temp"
  >
    <t-swiper-item>
      <Index @echartClick="receive" />
    </t-swiper-item>

    <t-swiper-item>
      <Other
        ref="other"
        :echartParams="echartParams"
        @goBack="goBack"
        v-if="Object.keys(echartParams).length > 0"
      />
    </t-swiper-item>
  </t-swiper>
</template>

<script>
import Index from './components/index.vue'
import Other from './components/other.vue'

export default {
  name: 'temperatureComp',
  components: {
    Index,
    Other
  },
  data () {
    return {
      currentTab: 0,
      echartParams: {}
    }
  },
  methods: {
    receive (val, move = true) {
      this.echartParams = val
      // 放入宏任务队列，等待dom渲染完成
      // 调用Other组件的beGoData方法,默认展示第一个面板
      setTimeout(() => {
        if (!this.echartParams.leftPort || !this.echartParams.leftPort) return this.$message.error({ content: '暂无数据', placement: 'center' })
        // 调用Other组件的beGoData方法,默认展示第一个面板
        this.$refs.other.beGoData(this.echartParams.leftPort.panel[0])
        // 给组件中的data里的this.selectedElement = document.querySelector('.other-box').children[0]
        this.$refs.other.selectedElement =
          document.querySelector('.other-box').children[0]
        this.$refs.other.selectedElement.classList.add('other-panel-focus')
        if (move) {
          this.currentTab = 1
        }
      }, 10)
    },
    goBack () {
      this.$refs.other.clear()
      this.currentTab = 0
    }
  },
  mounted () {}
}
</script>

<style scoped lang="scss">
/deep/ .nav-table .dv-scroll-board .header .header-item {
  font-family: logo-font;
  color: #fff !important;
  height: 35px !important;
  line-height: 40px !important;
}
/deep/ .nav-table .dv-scroll-board .header {
  background-image: url("~@/assets/images/screen/temperatureComp/nav-title.png");
  background-size: cover;
  background-repeat: round;
  height: 35px;
  margin-bottom: 0;
}
/deep/ .nav-table .dv-scroll-board .row-item {
  border-top: 1px solid rgba(255, 255, 255, 0.5);
}
</style>
