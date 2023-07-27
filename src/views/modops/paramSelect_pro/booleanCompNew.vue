<template>
  <div style="width: 100%">
    <div style="padding: 0 0 16px 0">
      <t-space>
        <div style="font-size: 12px;letter-spacing: 1px;" class="mr-4">
          默认值
        </div>
        <t-switch size="large" v-model="inputOptionsForm.options.default" :label="['开', '关']"></t-switch>
      </t-space>
    </div>
  </div>
</template>

<script>
export default {
  name: 'booleanCompNew',
  props: ['serviceInputForm', 'isSatisfy'],
  data () {
    return {
      inputOptionsForm: this.serviceInputForm
    }
  },
  watch: {
    inputOptionsForm: {
      // 监听参数类型变化，载入不同的tag
      handler (newval, oldvalue) {
        this.$emit('update:serviceInputForm', newval)
      },
      deep: true
    }
  }
}
</script>

<style scoped>
</style>
