<template>
<!-- 大屏 -->
  <div v-if="isScreen">
    <router-view :key="$route.fullPath" />
  </div>
  <t-layout v-else class="tdesign-wrapper">
    <!-- 侧滑菜单 -->
    <t-aside style="width: fit-content;">
      <base-menu/>
    </t-aside>
    <!-- 头部 -->
    <t-layout style="width: 80vw">
      <t-header>
        <t-head-menu theme="light" class="bg-mod-bg">
          <template>
            <breadcrumbs />
          </template>
          <template #operations>
            <toolbar-item-right/>
          </template>
        </t-head-menu>
      </t-header>
      <div class="bg-mod-bg" :style="!isMultTag?'height: 15px':'height:auto'">
        <tag-view v-show="isMultTag" />
      </div>
      <!-- 内容路由 -->
      <t-content class="bg-mod-bg" style="overflow: auto !important; padding: 16px 8px 10px 10px;">
        <!-- <transition name="fade-transform" mode="out-in" v-if="isRouterAlive"> -->
          <div v-if="isRouterAlive">
            <keep-alive>
              <router-view :key="$route.fullPath" v-if="$route.meta.isFrame && !$route.meta.noCache" />
            </keep-alive>
          </div>
        <!-- </transition> -->
        <router-view :key="$route.fullPath" v-if="isRouterAlive && $route.meta.isFrame && $route.meta.noCache" />
        <iframe-view v-if="isRouterAlive && !$route.meta.isFrame" />
      </t-content>
    </t-layout>
  </t-layout>
</template>

<script>
import BaseMenu from '@/Layout/components/Menu/BaseMenu'
import TagView from '@/Layout/components/TagView/TagView'
import ToolbarItemRight from '@/Layout/components/Toolbar/ToolbarItemRight'
import Breadcrumbs from '@/Layout/components/Breadcrumbs/Breadcrumbs'
import IframeView from '@/Layout/components/IframeView/index'
export default {
  name: 'Index',
  provide () {
    return {
      reload: this.reload
    }
  },
  components: {
    ToolbarItemRight,
    TagView,
    BaseMenu,
    IframeView,
    Breadcrumbs
  },
  data () {
    return {
      isRouterAlive: true,
      viewStyle: this.$SildeBar,
      leftDrawerOpen: false,
      Max_keepAlive: this.$Max_KeepAlive
    }
  },
  computed: {
    key () {
      return this.$route.fullPath
    },
    isMultTag () {
      return this.$store.getters.getIsTag
    },
    isScreen () {
      return this.$store.getters.getIsScreen
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => (this.isRouterAlive = true))
    }
  }
}
</script>
<style scoped>
.tdesign-wrapper {
  height: 100vh;
}
/deep/ .t-default-menu .t-menu__item.t-is-active:not(.t-is-opened) {
  @apply bg-mod-card
}
/deep/ .t-default-menu .t-menu__sub.t-is-opened {
  overflow: auto;
}
/deep/ .t-default-menu .t-menu__operat ions:not(:empty) {
  text-align: right !important;
  border-top: solid 0px #fff !important;
}
/deep/ .t-default-menu__inner .t-menu__logo:not(:empty) {
  border-bottom: solid 0px #fff !important;
}
</style>
