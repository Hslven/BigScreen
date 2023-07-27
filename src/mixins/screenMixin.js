
// * 默认缩放值
const scale = {
  width: '1',
  height: '1'
}

// * 设计稿尺寸（px）
const baseWidth = 1920
const baseHeight = 1080

// * 需保持的比例（默认1.77778）
const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5))
export default {
  data () {
    return {
      drawTiming: null,
      isScreen: this.$store.getters.getIsScreen,
      flexLayout: {
        position: 'relative',
        transform: 'scale(0.86)',
        transformOrigin: '0 0'
      }
    }
  },
  mounted () {
    this.calcRate()
    window.addEventListener('resize', this.resize)
  },
  methods: {
    openScreen () {
      this.$store.commit('appProject/SET_SCREEN', true)
      document.documentElement.webkitRequestFullscreen()
    },
    closeScreen () {
      document.webkitExitFullscreen()
      this.$store.commit('appProject/SET_SCREEN', false)
    },

    calcRate () {
      const appRef = this.$refs.appRef
      if (!appRef) return
      // 当前宽高比
      const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5))
      if (appRef) {
        if (this.$store.getters.getIsScreen) {
          if (currentRate > baseProportion) {
            // 表示更宽
            scale.width = ((window.innerHeight * baseProportion) / baseWidth).toFixed(5)
            scale.height = (window.innerHeight / baseHeight).toFixed(5)
          } else {
            // 表示更高
            scale.height = ((window.innerWidth / baseProportion) / baseHeight).toFixed(5)
            scale.width = (window.innerWidth / baseWidth).toFixed(5)
          }
          appRef.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
        }
      }
    },
    resize () {
      clearTimeout(this.drawTiming)
      this.drawTiming = setTimeout(() => {
        this.calcRate()
      }, 200)
    }
  },
  beforeDestroy () {
    clearInterval(this.timing)
    window.removeEventListener('resize', this.resize)
  }
  /* 解决全屏状态下由于安全机制导致按下esc的无法完全退出全屏问题
  1.document.addEventListener("fullscreenchange", function () {
    if (!document.fullscreenElement) {
      // 推出全屏后触发对应方法
      this.$store.commit("appProject/SET_SCREEN", false);
    }
  });

  2.监听界面宽高等于浏览器内置宽高，不等于即没有进入全屏

  3.exitFullscreen | webkitExitFullscreen | mozCancelFullScreen | msExitFullscreen 判断当前是否进入全屏

  */

}
