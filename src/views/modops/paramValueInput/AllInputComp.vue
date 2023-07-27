<template>
  <div>
    <t-space class="pl-4">
      <div style="font-size: 12px;letter-spacing: 1px;" class="mr-4">
        可接受类型
      </div>
      <t-tag theme="primary" size="small" v-for="(val, key) in inputOptionsForm.options.scope" :key="key">{{ val }}</t-tag>
    </t-space>
  </div>
</template>

<script>
export default {
  name: 'AllInputComp',
  props: ['serviceInputForm', 'isSatisfy'],
  data () {
    return {
      inputOptionsForm: this.serviceInputForm
    }
  }
}
</script>

<style scoped>
</style>
