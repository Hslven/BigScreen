<template>
  <div>
    <t-tabs :value="tab" @change="(newValue) => (tab = newValue)">
      <t-tab-panel value="performance">
        <template #label> 性能视图 </template>
        <performance :tab.sync = tab @changeTab = changeTab />
      </t-tab-panel>
      <t-tab-panel value="alarm">
        <template #label> 告警视图 </template>
        <alarm :tab.sync = tab @changeTab = changeTab />
      </t-tab-panel>
      <t-tab-panel value="business">
        <template #label> 业务视图 </template>
        <business :tab.sync = tab @changeTab = changeTab />
      </t-tab-panel>
      <t-tab-panel value="resources">
        <template #label> 资源视图 </template>
        <resources :tab.sync = tab @changeTab = changeTab />
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<script>
import performance from './performance'
import alarm from './alarm'
import business from './business'
import resources from './resources'
export default {
  name: 'index',
  components: { performance, alarm, business, resources },
  data () {
    return {
      tab: 'performance'
    }
  },
  watch: {
    tab: {
      handler (newVal) {
        if (newVal === 'list') {
          this.obj.hostId = ''
        }
      }
    }
  },
  methods: {
    changeTab (obj) {
      const { tab } = obj
      this.tab = tab
    }
  }
}
</script>

<style scoped>
/deep/ .t-tabs__content {
  @apply bg-mod-bg
}
</style>
