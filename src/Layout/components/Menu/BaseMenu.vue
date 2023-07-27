<template>
  <t-menu class="bg-mod-bg" theme="light" :defaultValue="$route.meta.menuId" expandMutex :collapsed="collapsed">
    <template #logo>
      <img v-if="collapsed" src="~@/assets/images/logo.png" alt="logo" style="height: 35px; padding-left: 15px;" />
      <div v-else class="flex items-center">
        <!-- <img src="~@/assets/images/logo.png" style="height: 20px; padding: 0 8px 0 8px"> -->
        <span style="font-size:16px; color: #2d3356; font-family: logo-font;">云基础设施运维自动化平台</span>
      </div>
    </template>
      <!-- <img class="ml-4" :width="collapsed ? 35 : 136" :src="iconUrl" alt="logo" /> -->
    <base-menu-item :son-menu="menuList" :level="0"></base-menu-item>
    <template #operations>
      <t-button class="t-demo-collapse-btn" variant="text" shape="square" @click.native="changeCollapsed">
        <mod-icon name="menu" />
      </t-button>
    </template>
  </t-menu>
</template>

<script>
import BaseMenuItem from '@/Layout/components/Menu/BaseMenuItem'
export default {
  name: 'base-menu',
  components: { BaseMenuItem },
  data () {
    return {
      menuList: this.$store.getters.getRoutes[0].children,
      collapsed: false
    }
  },
  methods: {
    changeCollapsed () {
      this.collapsed = !this.collapsed
    }
  }
}
</script>
<style scoped>
/deep/ .t-menu__popup.t-is-opened .t-menu__popup {
  overflow: visible !important;
}
</style>
