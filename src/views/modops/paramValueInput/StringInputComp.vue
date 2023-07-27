<template>
  <div>
    <t-form
        ref="formRef"
        :data="paramForm"
        :rules="rules"
        @submit="addParameter"
        labelWidth="80px"
    >
      <t-form-item label="固定值" name="model">
        <t-input v-if="valueOptions.length === 0" v-model="paramForm.model" style="width: 100%" />
        <t-select v-if="valueOptions.length !== 0" v-model="paramForm.model" filterable>
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
import { ruleDict } from '@/dict/dict'
export default {
  name: 'StringInputComp',
  props: ['serviceInputForm', 'isSatisfy'],
  data () {
    return {
      rules: {
        model: [{ validator: this.ruleMethod }]
      },
      paramForm: {
        model: this.serviceInputForm.value.length ? this.serviceInputForm.value[0] : ''
      },
      ruleRes: true,
      input_value: '',
      valueOptions: [],
      inputOptionsForm: this.serviceInputForm
    }
  },
  watch: {
    // inputOptionsForm: {
    //   // 监听参数类型变化，载入不同的tag
    //   handler (newval, oldvalue) {
    //     this.$emit('update:serviceInputForm', newval)
    //   },
    //   deep: true
    // },
    ruleRes: {
      handler (newval, oldvalue) {
        this.$emit('update:isSatisfy', newval)
      },
      deep: true
    }
    // model: {
    //   // 监听参数类型变化，载入不同的tag
    //   handler (newval, oldvalue) {
    //     if (newval) {
    //       this.inputOptionsForm.value = [newval]
    //       this.inputOptionsForm.connected = true
    //       this.inputOptionsForm.source = 'value'
    //     } else {
    //       this.inputOptionsForm.value = []
    //       this.inputOptionsForm.connected = false
    //       this.inputOptionsForm.source = ''
    //     }
    //   },
    //   deep: true
    // }
  },
  mounted () {
    this.valueOptions = cloneDeep(this.inputOptionsForm.options.enumeration)
  },
  methods: {
    ruleMethod (val) {
      if (this.inputOptionsForm.tag && ruleDict[this.inputOptionsForm.tag] !== null) {
        const ruleReg = ruleDict[this.inputOptionsForm.tag]
        this.ruleRes = ruleReg.test(val)
        if (this.ruleRes) {
          return { result: true }
        } else {
          return { result: false, message: `${this.inputOptionsForm.tag}格式不正确`, type: 'error' }
        }
      } else {
        return { result: true }
      }
    },
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
