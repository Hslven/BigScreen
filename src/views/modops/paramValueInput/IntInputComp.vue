<template>
  <div>
    <t-form
        ref="formRef"
        :data="paramForm"
        @submit="addParameter"
        labelWidth="80px"
    >
      <t-form-item label="固定值" name="model">
        <t-input-number v-if="valueOptions.length === 0" v-model="paramForm.model" :step="1" :allow-input-over-limit="false" style="width: 100%" />
        <t-select v-if="valueOptions.length !== 0" v-model="paramForm.model">
          <t-option v-for="(item, index) in valueOptions" :value="item" :label="item.toString()" :key="index">
            {{ item }}
          </t-option>
        </t-select>
      </t-form-item>
      <t-form-item>
        <t-button theme="primary" type="submit" block>确定</t-button>
      </t-form-item>
    </t-form>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
export default {
  name: 'IntInputComp',
  props: ['serviceInputForm', 'isSatisfy'],
  data () {
    return {
      paramForm: {
        model: this.serviceInputForm.value.length ? this.serviceInputForm.value[0] : ''
      },
      input_value: '',
      valueOptions: [],
      inputOptionsForm: this.serviceInputForm
    }
  },
  mounted () {
    this.valueOptions = cloneDeep(this.inputOptionsForm.options.enumeration)
  },
  // watch: {
  //   model: {
  //     // 监听参数类型变化，载入不同的tag
  //     handler (newval, oldvalue) {
  //       if (newval) {
  //         this.inputOptionsForm.value = [newval]
  //         this.inputOptionsForm.connected = true
  //         this.inputOptionsForm.source = 'value'
  //       } else {
  //         this.inputOptionsForm.value = []
  //         this.inputOptionsForm.connected = false
  //         this.inputOptionsForm.source = ''
  //       }
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    addParameter ({ validateResult, firstError }) {
      if (validateResult === true) {
        if (this.paramForm.model) {
          this.inputOptionsForm.value = [this.paramForm.model]
          this.inputOptionsForm.connected = true
          this.inputOptionsForm.source = 'value'
        } else {
          this.inputOptionsForm.value = []
          this.inputOptionsForm.connected = false
          this.inputOptionsForm.source = ''
        }
        this.$emit('addParameter', this.inputOptionsForm)
      } else {
        this.$message.warning(`错误：${firstError}`)
      }
    }
  }
}
</script>

<style scoped>
</style>
