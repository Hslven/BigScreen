<template>
  <div style="width: 100%">
    <div style="padding: 8px 0px 16px 0px">
      <div style="width: 80px; font-size: 12px;letter-spacing: 1px; color: #242e42">
        校验规则
      </div>
      <t-input v-model="inputOptionsForm.options.regular"></t-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'objectCompNew',
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
