<template>
  <div>
    <t-space class="pl-4">
      <div style="font-size: 12px;letter-spacing: 1px;" class="mr-4">
        固定值
      </div>
      <t-switch size="large" v-model="model" :label="['开', '关']"></t-switch>
    </t-space>
    <t-button @click="addParameter" block class="mt-4">
      确认
    </t-button>
  </div>
</template>

<script>
export default {
  name: 'BooleanInputComp',
  props: ['serviceInputForm', 'isSatisfy'],
  data () {
    return {
      inputOptionsForm: this.serviceInputForm,
      model: this.serviceInputForm.value[0]
    }
  },
  // watch: {
  //   model: {
  //     // 监听参数类型变化，载入不同的tag
  //     handler (newval, oldvalue) {
  //       this.inputOptionsForm.value = [newval]
  //       this.inputOptionsForm.connected = true
  //       this.inputOptionsForm.source = 'value'
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    addParameter () {
      this.inputOptionsForm.value = [this.model]
      this.inputOptionsForm.connected = true
      this.inputOptionsForm.source = 'value'
      this.$emit('addParameter', this.inputOptionsForm)
    }
  }
}
</script>

<style scoped>
</style>
