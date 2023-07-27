<template>
  <div style="width: 100%;" class="tdesign-demo-item">
    <t-space direction="vertical" style="overflow: auto">
      <t-tabs
        theme="normal"
        :value="$route.fullPath"
        @change="handleChangeCurrentTab"
        class="px-4 bg-mod-bg"
        style="overflow: auto"
      >
        <t-tab-panel value="/" class="bg-mod-bg">
          <template #label>
            <mod-icon size="xs" name="home" />
          </template>
        </t-tab-panel>
        <t-tab-panel
          v-for="(route, idx) in tagView"
          :value="route.fullPath"
          :key="`${route.fullPath}_${idx}`"
          :removable="!route.isHome"
          @remove="() => removeAtagView(idx)"
        >
          <template #label>
            <!-- <mod-icon class="pr-2" size="12px" :name="route.icon" /> -->
            <t-dropdown
              style="font-size: 12px;"
              trigger="context-menu"
              :minColumnWidth="128"
              :popupProps="{
                overlayClassName: 'route-tabs-dropdown',
                onVisibleChange: (visible, ctx) => handleTabMenuClick(visible, ctx, route.path),
                visible: activeTabPath === route.path,
              }"
            >
              <template>
                {{ route.title }}
              </template>
              <template #dropdown>
                <t-dropdown-menu>
                  <t-dropdown-item @click="refreshTagView()">
                    刷新
                  </t-dropdown-item>
                  <t-dropdown-item @click="removeOthersTagView(idx)">
                    关闭其他
                  </t-dropdown-item>
                  <t-dropdown-item @click="removeRightTagView(idx)">
                    关闭右侧
                  </t-dropdown-item>
                  <t-dropdown-item @click="removeLeftTagView(idx)">
                    关闭左侧
                  </t-dropdown-item>
                  <t-dropdown-item @click="removeAllTagView">
                    关闭所有
                  </t-dropdown-item>
                </t-dropdown-menu>
              </template>
            </t-dropdown>
          </template>
        </t-tab-panel>
      </t-tabs>
    </t-space>
  </div>
</template>

<script>
import { TABS_ROUTES } from '@/store/mutation-types'
import { storage } from '@/utils/Storage'
export default {
  name: 'TagView',
  inject: ['reload'],
  data () {
    return {
      tagView: this.$store.getters.getTagView,
      activeTabPath: ''
    }
  },
  computed: {
    getTagView () {
      return this.$store.getters.getTagView
    }
  },
  watch: {
    getTagView (n, o) {
      this.tagView = n
      this.$store.dispatch('appProject/set_keep_alive', this.tagView)
      storage.set(TABS_ROUTES, JSON.stringify(this.tagView))
    }
  },
  methods: {
    removeAllTagView () {
      this.$store.commit('appProject/REMOVE_TAG_VIEW')
    },
    removeAtagView (i) {
      this.$store.commit('appProject/REMOVE_TAG_VIEW', i)
    },
    refreshTagView () {
      this.reload()
      // this.$router.go(0)
    },
    removeLeftTagView (i) {
      this.$store.commit('appProject/REMOVE_TAG_VIEW', { side: 'left', index: i })
    },

    removeRightTagView (i) {
      this.$store.commit('appProject/REMOVE_TAG_VIEW', { side: 'right', index: i })
    },

    removeOthersTagView (i) {
      this.$store.commit('appProject/REMOVE_TAG_VIEW', { side: 'others', index: i })
    },
    handleChangeCurrentTab (path) {
      this.$router.push(path)
    },
    handleTabMenuClick (visible, ctx, path) {
      if (ctx?.trigger === 'document') this.activeTabPath = null
      if (visible) this.activeTabPath = path
    }
  }
}
</script>
<style scoped>
.tdesign-demo-item {
  display: flex;
  overflow:hidden;
}
/deep/ .t-tabs__nav-item.t-size-m {
  height: 32px !important;
}
/deep/ .t-tabs__btn.t-size-m {
  height: 32px !important;
}
</style>
