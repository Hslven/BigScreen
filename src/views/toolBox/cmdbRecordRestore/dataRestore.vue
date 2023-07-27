<template>
  <div>
    <content-header></content-header>
    <div class="bg-mod-card rounded-sm">
      <t-tabs :value="tablePancel" @change="(newValue) => (tablePancel = newValue)" class="text-mod-title">
        <t-tab-panel value="vm">
          <template #label> 无主虚拟机 </template>
          <vm-record></vm-record>
        </t-tab-panel>
        <t-tab-panel value="vnf">
          <template #label> 无主VNF </template>
          <vnf-record></vnf-record>
        </t-tab-panel>
      </t-tabs>
    </div>
  </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'
// import { formatterDate } from '@/utils/index'
import vmRecord from '@/views/toolBox/cmdbRecordRestore/vmRecord'
import vnfRecord from '@/views/toolBox/cmdbRecordRestore/vnfRecord'
export default {
  name: 'dataRestore',
  components: {
    vmRecord,
    vnfRecord,
    ContentHeader
  },
  data () {
    return {
      tablePancel: 'vm'
    }
  }
  // computed: {
  //   dateFormat () {
  //     // 格式化时间
  //     return function (date) {
  //       if (!date) {
  //         return ''
  //       }
  //       return formatterDate(date)
  //     }
  //   }
  // },
}
</script>

<style scoped>
</style>
