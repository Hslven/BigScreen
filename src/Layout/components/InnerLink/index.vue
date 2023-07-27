<template>
<div>
    <div style="height: 100vh; padding: 0px">
      <component v-show="!isFrameSrc" :is="loader"></component>
      <iframe
        v-show="isFrameSrc"
        :id="iframeId"
        style="overflow: scroll; height: 90%; width: 100%; border: 0px"
        :src="src"
      ></iframe>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      default: '/'
    },
    iframeId: {
      type: String
    }
  },
  data () {
    return {
      loading: false,
      height: document.documentElement.clientHeight - 94.5 + 'px;'
    }
  },
  computed: {
    isFrameSrc () {
      return this.src.includes('http')
    },
    loader () {
      if (!this.src.includes('http')) {
        return resolve => require([`@/views${this.src}`], resolve)
      }
      return null
    }
  },
  mounted () {
    const _this = this
    const iframeId = ('#' + this.iframeId).replace(/\//g, '\\/')
    const iframe = document.querySelector(iframeId)
    // iframe页面loading控制
    if (iframe.attachEvent) {
      this.loading = true
      iframe.attachEvent('onload', function () {
        _this.loading = false
      })
    } else {
      this.loading = true
      iframe.onload = function () {
        _this.loading = false
      }
    }
  }
}
</script>
