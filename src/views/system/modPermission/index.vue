<template>
    <div>
      <content-header></content-header>
      <div class="bg-mod-card rounded-sm" style="-webkit-box-shadow: 0 4px 8px 0 rgba(36,46,66,.06);box-shadow: 0 4px 8px 0 rgba(36,46,66,.06);overflow: hidden;">
        <t-tabs :value="tab" @change="(newValue) => (tab = newValue)" class="text-mod-title">
          <t-tab-panel value="roles">
            <template #label> 角色 </template>
            <role-tab></role-tab>
          </t-tab-panel>
          <t-tab-panel value="permissions">
            <template #label> 权限 </template>
            <permission-tab></permission-tab>
          </t-tab-panel>
        </t-tabs>
      </div>
    </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'
import RoleTab from './roleTab/roleTab'
import PermissionTab from './permissionTab/permissionTab'
export default {
  name: 'index',
  components: {
    PermissionTab,
    RoleTab,
    ContentHeader
  },
  data () {
    return {
      tab: 'roles',
      filter: '',
      data: []
    }
  }
}
</script>

<style scoped>
/deep/ .t-tabs__nav-wrap {
  margin-left: 10px !important;
}
/deep/ .t-transfer__search .t-transfer__list {
  height: 500px !important;
}
</style>
