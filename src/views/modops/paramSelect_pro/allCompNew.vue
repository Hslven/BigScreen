<template>
  <div style="width: 100%">
    <div style="padding: 0 0 16px 0">
      <div style="font-size: 12px;letter-spacing: 1px;">
        可接受类型
      </div>
      <t-select
        v-model="inputOptionsForm.options.scope"
        clearable
        :options="inputOptions"
      >
      </t-select>
    </div>
  </div>
</template>

<script>
import { serviceOutputTypeOptions } from '@/dict/dict'
export default {
  name: 'allCompNew',
  props: ['serviceInputForm', 'isSatisfy'],
  data () {
    return {
      inputOptionsForm: this.serviceInputForm,
      inputOptions: serviceOutputTypeOptions
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
