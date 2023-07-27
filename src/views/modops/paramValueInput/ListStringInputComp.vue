<template>
  <div style="width: 100%">
    <t-space class="pl-4" style="width: 100%">
      <t-input-adornment style="width: 100%" v-if="valueOptions.length === 0" prepend="添加值">
        <t-tag-input :value="model" @change="onChangeDefault" />
      </t-input-adornment>
      <t-input-adornment v-if="valueOptions.length !== 0" prepend="可选值">
        <t-select multiple v-model="model" clearable filterable>
          <t-option v-for="(item, index) in valueOptions" :value="item" :label="item" :key="index">
            {{ item }}
          </t-option>
        </t-select>
      </t-input-adornment>
    </t-space>
    <t-button @click="addParameter" block class="mt-4">
      确认
    </t-button>
  </div>
</template>

<script>
import { ruleDict } from '@/dict/dict'
import { cloneDeep } from 'lodash'
export default {
  name: 'ListStringInputComp',
  props: ['serviceInputForm', 'sign', 'isSatisfy'],
  data () {
    return {
      ruleRes: true,
      inputOptionsForm: this.serviceInputForm,
      model: this.serviceInputForm.value.length === 0 ? [] : this.serviceInputForm.value[0],
      fixedValue: null,
      default_input_value: '',
      input_value: '',
      valueOptions: []
    }
  },
  watch: {
    ruleRes: {
      handler (newval, oldvalue) {
        this.$emit('update:isSatisfy', newval)
      },
      deep: true
    }
  },
  mounted () {
    this.valueOptions = cloneDeep(this.inputOptionsForm.options.enumeration)
  },
  methods: {
    onChangeDefault (val, context) {
      if (context.trigger === 'tag-remove') {
        this.removeValue(context.index)
      } else {
        this.addFixedValue(val, context)
      }
    },
    onChange (val, context) {
      if (context.trigger === 'tag-remove') {
        this.removeParamter(context.index)
      } else {
        this.addValue(val, context)
      }
    },
    addParameter () {
      if (this.model.length) {
        this.inputOptionsForm.connected = true
        this.inputOptionsForm.source = 'value'
      } else {
        this.inputOptionsForm.connected = false
        this.inputOptionsForm.source = ''
      }
      this.inputOptionsForm.value = [this.model]
      this.$emit('addParameter', this.inputOptionsForm)
    },
    removeValue (key) {
      this.model.splice(key, 1)
    },
    addFixedValue (val, context) {
      if (this.model.indexOf(context.item) < 0) {
        if (this.inputOptionsForm.tag && ruleDict[this.inputOptionsForm.tag] !== null) {
          const ruleReg = ruleDict[this.inputOptionsForm.tag]
          if (ruleReg.test(context.item)) {
            this.model = val
          } else {
            this.$message.error(this.inputOptionsForm.tag + '格式不正确')
          }
        } else if (this.inputOptionsForm.tag === '') {
          this.model = val
        }
      } else {
        this.$message.warning('值不能重复！')
      }
    }
  }
}
</script>

<style scoped>
</style>
