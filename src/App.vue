<template>
  <div id="app" class="text-mod-body" :class="[$store.getters.getIsScreen ? 'big-screen-bg' : 'bg-mod-bg']">
    <router-view></router-view>
  </div>
</template>

<script>
import { createStorage } from '@/utils/Storage'
import { APP_PRIMARY } from '@/store/mutation-types'
import { set16ToRgb } from '@/utils'
const Storage = createStorage({ storage: localStorage })
export default {
  name: 'App',
  mounted () {
    if (Storage.get(APP_PRIMARY, false)) {
      this.changeColorCode(Storage.get(APP_PRIMARY))
    } else {
      this.changeColorCode(this.$store.getters.getAppPrimary)
    }
  },
  methods: {
    changeColorCode (value) {
      const rgbValue = set16ToRgb(value).join(' ')
      const r = document.querySelector(':root')
      r.style.setProperty('--sys-primary-rgb', rgbValue)
      r.style.setProperty('--td-brand-color', value)
    }
  }
}
</script>

<style>
  .big-screen-bg {
    background: #000
  }
  @import "./assets/css/main.css";
  @import "./assets/css/replace.css";
  @import './assets/scss/transition.scss';
  @import "./assets/css/cimo.css";
  @import "./assets/font/font.css";
</style>
