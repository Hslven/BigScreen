<template>
  <div class="swiper-container" id="duty" @mousemove="handleMousemove">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(dutyId) in dutyData" :key="dutyId">
        <iframe class="top" :id="dutyId" :src="getUrl(dutyId)" scrolling="no" marginwidth="0" marginheight="0"
                frameborder="0" style="overflow: scroll; border: 0px; height: 100%; width: 100%"></iframe>
      </div>
    </div>
    <div class="swiper-button-prev swiper-button-prev-count hide"></div>
    <div class="swiper-button-next swiper-button-next-count hide"></div>
  </div>
</template>

<script>
import Swiper from 'swiper/swiper-bundle'
export default {
  name: 'onDuty',
  data () {
    return {
      dutyData: ['duty-server', 'duty-storage', 'duty-network', 'duty-network-firewall-temperature'],
      swiperStatus: true,
      dutySwiper: null,
      moveTime: new Date().getTime()
    }
  },
  mounted () {
    this.swiperObj()
    this.swiperEvent()
    this.go()
    this.timer = setInterval(this.go, 10000)
  },
  methods: {
    getUrl (type) {
      // 拼接页面名 如：http://127.0.0.1:3000/d/duty-network/duty-network?orgId=1&kiosk
      return `http://${process.env.VUE_APP_IFRAME_TWO}/d/${type}/${type}?orgId=1&kiosk`
    },
    swiperObj () {
      this.dutySwiper = new Swiper('#duty', {
        effect: 'slide', // slide的切换效果，默认为"slide"（位移切换），可设置为'slide'（普通切换、默认）,"fade"（淡入）"cube"（方块）"coverflow"（3d流）"flip"（3d翻转）
        fadeEffect: {
          crossFade: true
        },
        mousewheel: true, // 鼠标切换
        loop: true, // 循环模式选项
        autoplay: {
          delay: 10000, // 10秒切换一次
          stopOnLastSlide: false,
          disableOnInteraction: true
        },
        // 如果需要前进后退按钮
        navigation: {
          nextEl: '.swiper-button-next-count',
          prevEl: '.swiper-button-prev-count'
        },
        // 监听事件
        on: {
          // 切换事件
          slideChange: function (swiper) {}
        }
      })
    },
    startCountSwiper () {
      this.dutySwiper.autoplay.start()
      this.swiperStatus = true
      this.dutySwiper.navigation.$nextEl.addClass('hide')
      this.dutySwiper.navigation.$prevEl.addClass('hide')
    },
    stopCountSwiper () {
      this.dutySwiper.autoplay.stop()
      this.swiperStatus = false
      this.dutySwiper.navigation.$nextEl.removeClass('hide')
      this.dutySwiper.navigation.$prevEl.removeClass('hide')
    },
    swiperEvent () {
      const that = this
      // 鼠标覆盖停止自动切换,隐藏左右箭头
      this.dutySwiper.el.onmouseover = function () {
        that.stopCountSwiper()
      }
      // 鼠标离开开始自动切换,隐藏左右箭头
      this.dutySwiper.el.onmouseout = function () {
        that.startCountSwiper()
      }
    },
    handleMousemove (e) {
      this.moveTime = new Date().getTime()
    },
    go () {
      const timeOut = 2 * 60 * 1000
      const curTime = new Date().getTime()
      if (curTime - this.moveTime > timeOut) {
        // 长时间未操作，开始轮播
        if (!this.swiperStatus) {
          this.startCountSwiper()
        }
      }
    }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.swiper-container {
  width: 100%;
  height: 92vh;
}

.swiper-slide {
  text-align: center;
  font-size: 14px;
  background: #0B0C0E;

  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
}

.swiper-pagination li {
  background-color: #5FB878;
}

.swiper-container {
  --swiper-theme-color: #ff6600; /* 设置Swiper风格 */
  --swiper-navigation-color: #009E94; /* 单独设置按钮颜色 */
  --swiper-navigation-size: 30px; /* 设置按钮大小 */
}

.swiper-container .hide {
  opacity: 0;
}

.swiper-button-next, .swiper-button-prev {
  transition: opacity 0.5s;
}

.top {
  width: 100%;
  height: 100%;
}

</style>
