<template>
  <div class="flex items-center">
    <div>
      <t-button v-if="dark" shape="circle" variant="text" @click="changeDark(false)"><mod-icon slot="icon" style="font-size: 16px" name="light_mode"></mod-icon></t-button>
      <t-button v-else shape="circle" variant="text" @click="changeDark(true)"><mod-icon slot="icon" style="font-size: 16px" name="dark_mode"></mod-icon></t-button>
    </div>
    <t-button shape="circle" variant="text" @click="open('right')"><mod-icon slot="icon" style="font-size: 16px" name="settings"></mod-icon></t-button>
    <t-dropdown :options="options">
      <t-button variant="text">
        <div class="flex items-center justify-center">
          <t-avatar :alt="username">{{ nickName }}</t-avatar>
          <div class="pl-2 text-mod-body">
            {{ username }}
          </div>
        </div>
      </t-button>
    </t-dropdown>
    <t-drawer :showOverlay="false" placement="right" :visible.sync="dialog" style="z-index: 1" header="系统配置" :confirm-btn="null">
      <div>
        <div class="text-mod-body">
          主题颜色(Primary Colors)
        </div>
        <div class="pt-1">
          <button
            v-for="(value, key) in themeList"
            class="css-color-selector bg-mod-primary mr-2"
            :key="key"
            :style="{background: value}"
            :class="{'select-active': key === themeIndex}"
            tabindex="0"
            type="button"
            @click="changePrimary(key, value)"
          >
            <span class="css-w0pj6f"></span>
          </button>
        </div>
        <div class="text-mod-body py-4">
          <t-space>
            <div>页面导航</div>
            <div>
              <t-switch v-model="isTag" :label="['开', '关']" @change="changeTag"></t-switch>
            </div>
          </t-space>
        </div>
      </div>
    </t-drawer>
  </div>
</template>

<script>
import userImage from '@/assets/images/avataaars.png'
import userGirlImage from '@/assets/images/girl_avataaars.png'
import { set16ToRgb } from '@/utils'
import { storage, createStorage } from '@/utils/Storage'
import { DARK_THEME, IS_TABS, APP_PRIMARY } from '@/store/mutation-types'
const Storage = createStorage({ storage: localStorage })
export default {
  name: 'ToolbarItemRight',
  data () {
    return {
      // userImage: this.$store.getters.info === '女' ? userGirlImage : userImage,
      userImage: this.$store.getters.getInfo === '女' ? userGirlImage : userImage,
      username: this.$store.getters.getInfo.userName,
      nickName: this.$store.getters.getInfo.nickName,
      mobileData: false,
      bluetooth: true,
      dark: Storage.get(DARK_THEME, false),
      isTag: Storage.get(IS_TABS, false),
      position: 'top',
      dialog: false,
      color: 'orange',
      themeList: this.$store.getters.getAppPrimaryList,
      themeIndex: 0,
      options: [
        {
          content: '个人信息',
          value: 1,
          onClick: () => this.toHome()
        },
        {
          content: '退出',
          value: 2,
          onClick: () => this.logout()
        }
      ]
    }
  },
  mounted () {
    this.themeIndex = Storage.get(APP_PRIMARY, false) ? this.themeList.indexOf(Storage.get(APP_PRIMARY)) : this.themeList.indexOf(this.$store.getters.getAppPrimary)
    this.changeDark(this.dark)
  },
  methods: {
    changeDark (value) {
      this.dark = value
      // 这个条件用于判断当前系统应用模式是否开启了“暗”模式（win10在   个性化-颜色-选择默认应用模式  中修改）
      // if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      value ? document.documentElement.classList.add('theme-dark') : document.documentElement.classList.remove('theme-dark')
      value ? document.documentElement.setAttribute('theme-mode', 'dark') : document.documentElement.removeAttribute('theme-mode')
      // if (value) {
      //   this.$q.dark.set(true)
      // } else {
      //   this.$q.dark.set(false)
      // }
      storage.set(DARK_THEME, value)
      this.$store.commit('appTheme/SET_DARK_THEME', value)
    },
    changeTag (value) {
      storage.set(IS_TABS, value)
      this.$store.commit('appProject/SET_TAG', value)
    },
    changePrimary (key, value) {
      this.themeIndex = key
      const rgbValue = set16ToRgb(value).join(' ')
      const r = document.querySelector(':root')
      r.style.setProperty('--sys-primary-rgb', rgbValue)
      r.style.setProperty('--td-brand-color', value)
      this.$store.commit('appTheme/SET_APP_PRIMARY', value)
      storage.set(APP_PRIMARY, value)
    },
    logout () {
      this.$store.dispatch('user/logout').then(() => {
        this.$router.push({ name: 'Login' })
      })
    },
    open (position) {
      this.position = position
      this.dialog = true
    },
    toHome () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.css-2hb8f {
  flex-shrink: 0;
  border-top: 0px solid rgba(0, 0, 0, 0.12);
  border-right: 0px solid rgba(0, 0, 0, 0.12);
  border-left: 0px solid rgba(0, 0, 0, 0.12);
  background-color: transparent;
  height: 0.0625rem;
  border-bottom: none;
  opacity: 0.25;
  background-image: linear-gradient(to right, rgba(52, 71, 103, 0), rgba(52, 71, 103, 0.4), rgba(52, 71, 103, 0)) !important;
}
.css-color-selector {
  border-radius: 50%;
  width: 24px;
  height: 24px;
}
.select-active {
  border: 2px solid #000000;
}
</style>
