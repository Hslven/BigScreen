<!--
   动态菜单 item 递归实现
   myRouter ： 菜单列表
   initLevel ： 菜单初始化缩进等级
   bgColorLevel ：菜单背景色
   basePath : 上级菜单
-->
<template>
  <div style="font-size: 12px;">
    <template v-for="(item) in sonMenu">
      <template v-if="!item.meta.visible">
        <t-menu-item
          class="text-mod-title"
          :value="item.meta.menuId"
          v-if="!item.children"
          :key="item.meta.label"
          :style="{textIndent: level > 1 ? 10*level + 'px' : '0'}"
          :to="handleLink(basePath, item.path)"
           @click="externalLink(basePath, item.path)"
        >
          <template #icon v-if="!level">
            <mod-icon class="px-2" size="xs" :name="item.meta.icon" />
          </template>
          {{item.meta.label}}
        </t-menu-item>
        <t-submenu :title="item.meta.label" :value="item.meta.menuId" v-else :key="`${item.meta.label}-submenu`" :style="{textIndent: level > 1 ? 10*level + 'px' : '0'}">
          <template #icon v-if="!level">
            <mod-icon class="px-2" size="xs" :name="item.meta.icon" />
          </template>
          <base-menu-item
            :son-menu="item.children"
            :level="level+1"
            :base-path="basePath === undefined ? item.path : basePath + '/' + item.path"
          ></base-menu-item>
        </t-submenu>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'base-menu-item',
  props: ['sonMenu', 'level', 'basePath'],
  methods: {
    /**
     * 处理内部链接
     * @param basePath
     * @param itemPath
     */
    handleLink (basePath, itemPath) {
      const link = basePath === undefined ? itemPath : basePath + '/' + itemPath
      if (link.indexOf('http') !== -1) {
        return ''
      }
      return link
    },

    /**
     * 处理外部链接
     * @param basePath
     * @param itemPath
     * @returns {boolean}
     */
    externalLink (basePath, itemPath) {
      const link = basePath === undefined ? itemPath : basePath + '/' + itemPath
      const i = link.indexOf('http')
      if (i !== -1) {
        const a = document.createElement('a')
        a.setAttribute('href', link.slice(i))
        a.setAttribute('target', '_blank')
        a.click()
        return false
      }
    }
  }
}
</script>
