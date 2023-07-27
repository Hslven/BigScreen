<template>
  <div @mousemove="handleMousemove">
    <div style="display: flex; flex-direction: column;height: 100vh">
      <div style="flex: 1 0 45%;">
        <div style="display: flex; flex-direction: row;">
          <div style="width: 60%;">
            <div class="swiper swiper-container-count" style="height: 45vh;">
              <div class="swiper-wrapper" id="index-count">
                <div class="swiper-slide" v-for="(pool, index) in resourcePoolArray" :key="index">
                  <iframe style="height: 100%; width: 100%" class="top" :id="'count'+index" :name="pool" src="" scrolling="no"
                          marginwidth="0" marginheight="0" frameborder="0"></iframe>
                </div>
              </div>
              <div class="swiper-button-prev swiper-button-prev-count"></div>
              <div class="swiper-button-next swiper-button-next-count"></div>
            </div>
          </div>
          <div style="width: 40%;" class="swiper">
            <iframe style="height: 100%; width: 100%" class="top alarm" :src="urlAlarm" scrolling="no" marginwidth="0"
                    marginheight="0" frameborder="0"></iframe>
          </div>
        </div>
      </div>
      <div style="flex: 1 0 55%;">
        <div class="swiper swiper-container-pool" style="height: 55vh;">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(pool, index) in resourcePoolArray" :key="index">
              <div :class="'swiper swiper-container-top '+pool" :id="'top-'+pool" style="height: 55vh;">
                <div class="swiper-wrapper">
                  <div class="swiper-slide" v-for="(topItem, key) in poolTopData[pool]" :key="`${pool}-${key}`">
                    <iframe style="height: 100%; width: 100%" class="top" :type="topItem.host_type" :name="`${topItem.resource_pool}-${topItem.host_type}`" src="" scrolling="no"
                            marginwidth="0"
                            marginheight="0" frameborder="0"></iframe>
                    <div>{{ topItem }}</div>
                  </div>
                </div>
                <!-- 如果需要分页器 -->
                <div class="swiper-pagination swiper-pagination-top" id="swiper-pagination-top"></div>
                <!-- 如果需要导航按钮 -->
                <div class="swiper-button-prev swiper-button-prev-top" id="swiper-button-prev-top"></div>
                <div class="swiper-button-next swiper-button-next-top" id="swiper-button-next-top"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getResourcePoolAndTopAPI } from '@/api/monitor/opticalModule'
import Swiper from 'swiper/swiper-bundle'
import { cloneDeep } from 'lodash'
// import axios from 'axios'
export default {
  name: 'index',
  data () {
    return {
      resourcePoolArray: [],
      resourcePool: '',
      resourcePoolNum: 0,
      countSwiper: null,
      poolSwiper: null,
      topSwiper: null,
      // top轮播元素数组
      topSwiperArray: [],
      // 轮播是否开始状态
      flagPool: true,
      flagTop: true,
      moveTime: new Date().getTime(),
      // baseUrl: 'https://www.naiveui.com/',
      baseUrl: `http://${process.env.VUE_APP_IFRAME_TWO}`,
      endUrl: '?orgId=1&kiosk&refresh=5m&var-top=5&var-resource_pool=',
      urlCount: `http://${process.env.VUE_APP_IFRAME_TWO}/d/monitor-oa-index-count/monitor-oa-index-count?orgId=1&kiosk&refresh=5m&var-top=5&var-resource_pool=`,
      urlAlarm: `http://${process.env.VUE_APP_IFRAME_TWO}/d/monitor-oa-index-alarm/monitor-oa-index-alarm?orgId=1&kiosk&refresh=5m&var-top=5&var-resource_pool=`,
      iframeMap: [],
      timer: null,
      poolTopData: {}
    }
  },
  mounted () {
    this.getResourcePoolAndTop()
  },
  methods: {
    collectIframe (rp, allPoolTop) {
      // 收集iframe DOM 元素
      const iframeElemtList = [
        {
          name: rp + '-countElemt',
          elemt: document.querySelector("#index-count iframe[name='" + rp + "']"),
          // src: 'https://www.naiveui.com/zh-CN/light'
          src: this.urlCount + rp
        }
      ]
      allPoolTop[rp].forEach((item) => {
        const topData = {
          name: `${rp}-${item.host_type}`,
          elemt: document.querySelector(`iframe[name='${rp}-${item.host_type}']`),
          src: `${this.baseUrl}${item.top_path}`
        }
        iframeElemtList.push(topData)
      })
      this.iframeMap.push(cloneDeep(iframeElemtList))
    },
    setIframeSrc (iframes, index, key) {
      // 递归插入iframe src属性，等待上一个iframe加载完成再进行下一个iframe src属性插入
      if (index <= iframes.length - 1) {
        if (iframes[index].elemt) {
          iframes[index].elemt.setAttribute('src', iframes[index].src)
          if (iframes[index].elemt.attachEvent) {
            iframes[index].elemt.attachEvent('onload', () => {
              this.setIframeSrc(iframes, index + 1, key)
            })
          } else {
            iframes[index].elemt.onload = () => {
              this.setIframeSrc(iframes, index + 1, key)
            }
          }
        } else {
          this.setIframeSrc(iframes, index + 1, key)
        }
      } else {
        if (key < this.iframeMap.length - 1) {
          this.recursionIframe(this.iframeMap[key + 1], key + 1)
        } else {
          console.log('递归结束！')
        }
      }
    },
    recursionIframe (iframeMap, index) {
      this.setIframeSrc(iframeMap, 0, index)
    },
    topLeftSwiper () {
      const that = this
      this.countSwiper = new Swiper('.swiper-container-count', {
        effect: 'slide', // slide的切换效果，默认为"slide"（位移切换），可设置为'slide'（普通切换、默认）,"fade"（淡入）"cube"（方块）"coverflow"（3d流）"flip"（3d翻转）
        fadeEffect: {
          crossFade: true
        },
        mousewheel: true, // 鼠标切换
        loop: true, // 循环模式选项
        direction: 'vertical', // 垂直
        autoplay: {
          delay: 64000, // 64秒切换一次
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
          slideChange: function (swiper) {
            // 当前活动统计页面
            let activeIndex = this.activeIndex
            if (activeIndex > that.resourcePoolNum) {
              activeIndex -= that.resourcePoolNum
            }
            // 统计页面切换时，其它轮播页面切换
            activeIndex -= 1
            that.poolSwiper.slideTo(activeIndex, 1000, false)
            if (that.topSwiperArray.length > 0) {
              // top页面轮播重新开始
              const topSwiperElement = that.topSwiperArray[activeIndex]
              topSwiperElement.slideTo(0, 1000, false)
              topSwiperElement.autoplay.start()
            }
          }
        }
      })
    },
    bottomPoolSwiper () {
      // 资源池轮播
      this.poolSwiper = new Swiper('.swiper-container-pool', {
        effect: 'slide', // slide的切换效果，默认为"slide"（位移切换），可设置为'slide'（普通切换、默认）,"fade"（淡入）"cube"（方块）"coverflow"（3d流）"flip"（3d翻转）
        fadeEffect: {
          crossFade: true
        },
        // loop: true,
        direction: 'vertical' // 垂直
      })
    },
    topPageSwiper () {
      // TOP页面轮播
      this.resourcePoolArray.forEach((item, index, array) => {
        // 执行代码
        this.topSwiper = new Swiper('#top-' + item, {
          effect: 'fade', // slide的切换效果，默认为"slide"（位移切换），可设置为'slide'（普通切换、默认）,"fade"（淡入）"cube"（方块）"coverflow"（3d流）"flip"（3d翻转）
          fadeEffect: {
            crossFade: true
          },
          mousewheel: true, // 鼠标切换
          loop: true, // 循环模式选项
          autoplay: {
            delay: 8000, // 8秒切换
            stopOnLastSlide: false,
            disableOnInteraction: true
          },
          // 如果需要分页器
          pagination: {
            el: '.swiper-pagination-top',
            type: 'bullets', // bullets’  圆点（默认）‘fraction’  分式 ‘progressbar’  进度条‘custom’ 自定义
            bulletElement: 'li',
            clickable: true // 可以点击跳转
          },
          // 如果需要前进后退按钮
          navigation: {
            nextEl: '#swiper-button-next-top',
            prevEl: '#swiper-button-prev-top'
          },
          // 监听事件
          on: {
            // 切换事件
            slideChange: function () {}
          }
        })
        this.topSwiperArray.push(this.topSwiper)
        const that = this
        // 鼠标覆盖停止自动切换,隐藏左右箭头
        this.topSwiper.el.onmouseover = function () {
          that.stopCountSwiper()
          that.stopTopSwiper(that.topSwiper)
        }
        // 鼠标离开开始自动切换,隐藏左右箭头
        this.topSwiper.el.onmouseout = function () {
          that.startCountSwiper()
          that.startTopSwiper(that.topSwiper)
        }
      })
    },
    // 统计页面开始轮播,隐藏左右箭头
    startCountSwiper () {
      this.countSwiper.autoplay.start()
      this.flagPool = true
      this.countSwiper.navigation.$nextEl.addClass('hide')
      this.countSwiper.navigation.$prevEl.addClass('hide')
    },
    // 统计页面停止轮播,隐藏左右箭头
    stopCountSwiper () {
      this.countSwiper.autoplay.stop()
      this.flagPool = false
      this.countSwiper.navigation.$nextEl.removeClass('hide')
      this.countSwiper.navigation.$prevEl.removeClass('hide')
    },
    // TOP页面轮播开始轮播,隐藏左右箭头
    startTopSwiper (topSwiper) {
      this.topSwiper.autoplay.start()
      this.flagTop = true
      this.topSwiper.navigation.$nextEl.addClass('hide')
      this.topSwiper.navigation.$prevEl.addClass('hide')
    },
    // TOP页面轮播停止轮播,隐藏左右箭头
    stopTopSwiper (topSwiper) {
      this.topSwiper.autoplay.stop()
      this.flagTop = false
      this.topSwiper.navigation.$nextEl.removeClass('hide')
      this.topSwiper.navigation.$prevEl.removeClass('hide')
    },
    handleMousemove (e) {
      this.moveTime = new Date().getTime()
    },
    go () {
      const timeOut = 10 * 60 * 1000
      const curTime = new Date().getTime()
      if (curTime - this.moveTime > timeOut) {
        // 长时间未操作，开始轮播
        if (!this.flagPool) {
          this.startCountSwiper()
        }
        if (!this.flagTop) {
          this.topSwiperArray.forEach((item, i) => {
            this.startTopSwiper(item)
          })
        }
      }
    },
    async getResourcePoolAndTop () {
      // 获取资源池TOP数据
      return new Promise((resolve, reject) => {
        getResourcePoolAndTopAPI().then(response => {
          const { data } = response
          if (data.code === 0) {
            data.data.forEach(element => {
              this.poolTopData[Object.keys(element)[0]] = element[Object.keys(element)[0]]
            })
            this.resourcePoolArray = Object.keys(this.poolTopData)
            this.resourcePool = this.resourcePoolArray[0]
            this.resourcePoolNum = this.resourcePoolArray.length
            this.$nextTick(() => {
              const that = this
              // 收集iframe DOM 元素
              for (let i = 0; i < this.resourcePoolArray.length; i++) {
                const rp = this.resourcePoolArray[i]
                this.collectIframe(rp, this.poolTopData)
              }
              // 启动递归
              this.recursionIframe(this.iframeMap[0], 0)
              this.bottomPoolSwiper()
              this.topLeftSwiper()
              // 鼠标覆盖停止自动切换,隐藏左右箭头
              this.countSwiper.el.onmouseover = function () {
                that.stopCountSwiper()
              }
              // 鼠标离开开始自动切换,隐藏左右箭头
              this.countSwiper.el.onmouseout = function () {
                that.startCountSwiper()
              }
              this.topPageSwiper()
              this.go()
              this.timer = setInterval(this.go, 10000)
            })
          } else {
            console.log(data.msg)
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  beforeDestroy () {
    // 清除定时器
    clearInterval(this.timer)
    console.log('beforeDestroy 清除定时器成功')
  }
}
</script>

<style scoped>
/deep/ .swiper-pagination li {
  background-color: #5FB878;
}

.swiper {
  background: #000;
  --swiper-theme-color: #ff6600; /* 设置Swiper风格 */
  --swiper-navigation-color: #009E94; /* 单独设置按钮颜色 */
  --swiper-navigation-size: 30px; /* 设置按钮大小 */
}

.swiper .hide {
  opacity: 0;
}

.swiper-button-next, .swiper-button-prev {
  transition: opacity 0.5s;
}
.swiper-button-next:after, .swiper-button-prev:after {
  font-size: 48px !important;
}
.top {
  width: 100%;
  height: 100%;
}
</style>
