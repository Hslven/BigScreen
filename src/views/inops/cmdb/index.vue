<template>
  <div class="bg-mod-card" style="padding: 15px">
    <t-tabs v-model="tab">
      <t-tab-panel value="list" :destroyOnHide="false">
        <template #label><mod-icon name="o_widgets" style="margin-right: 4px" />CMDB设备</template>
        <list v-if="tab === 'list'" :tab.sync = tab :obj.sync = obj @changeTab = changeTab></list>
      </t-tab-panel>
      <t-tab-panel value="edit" :destroyOnHide="false">
        <template #label><mod-icon :name="obj.editType === 'add' ? 'o_add' : 'o_edit'" style="margin-right: 4px" />{{ obj.editType === 'add' ? '新增设备' : '编辑设备' }}</template>
        <edit v-if="tab !== 'list'" :tab.sync = tab :obj.sync = obj @changeTab = changeTab></edit>
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<script>
import list from './list'
import edit from './edit'
import ModIcon from '@/ui/ModIcon/ModIcon'
export default {
  name: 'index',
  components: { ModIcon, list, edit },
  data () {
    return {
      tab: 'list',
      obj: {
        editType: 'add',
        hostId: ''
      }
    }
  },
  watch: {
    tab: {
      handler (newVal) {
        if (newVal === 'list') {
          this.obj.editType = 'add'
          this.obj.hostId = ''
        }
      }
    }
  },
  methods: {
    changeTab (obj) {
      const { tab, hostId, editTyp } = obj
      this.tab = tab
      this.obj.hostId = hostId
      this.obj.editType = editTyp
    }
  }
}
</script>

<style scoped>

</style>
