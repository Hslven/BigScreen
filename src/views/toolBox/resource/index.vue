<template>
  <base-content>
    <div>
      <content-header></content-header>
      <div class="bg-mod-card rounded-sm">
        <t-tabs :value="tab" @change="(newValue) => (tab = newValue)" class="text-mod-title">
          <t-tab-panel value="storage">
            <template #label> 存储 </template>
            <storage></storage>
          </t-tab-panel>
          <t-tab-panel value="cpu">
            <template #label> CPU </template>
            <ha-cpu></ha-cpu>
          </t-tab-panel>
        </t-tabs>
      </div>
    </div>
  </base-content>
</template>

<script>
import BaseContent from '@/Layout/components/BaseContent/BaseContent'
import ContentHeader from '@/components/contentHeader/header'
import Storage from './storage'
import HaCpu from './haCpu'
export default {
  name: 'index',
  components: {
    HaCpu,
    Storage,
    BaseContent,
    ContentHeader
  },
  data () {
    return {
      tab: 'storage'
    }
  }
}
</script>

<style scoped>
</style>
