<template>
  <t-form
    :data="serviceInputForm"
    :rules="rules"
    labelAlign="top"
    class="p-4"
    @submit="addParameter"
    >
    <t-form-item label="参数名" name="name">
      <t-input v-model="serviceInputForm.name" placeholder="请输入参数名"></t-input>
    </t-form-item>
    <t-form-item label="参数类型" name="type">
      <t-select
        v-model="serviceInputForm.type"
        clearable
        :options="inputOptions"
      >
      </t-select>
    </t-form-item>
    <t-form-item v-if="tags" label="参数标签" name="tag">
      <t-select
        v-model="serviceInputForm.tag"
        clearable
      >
        <t-option v-for="(item, index) in tags" :key="index" :label="item" :value="item" />
      </t-select>
    </t-form-item>
    <t-form-item>
      <component :is="paramSelector" :serviceInputForm.sync="serviceInputForm" :isSatisfy.sync="isSatisfy"></component>
    </t-form-item>
    <t-form-item>
      <t-button theme="primary" type="submit" block :disable="!isSatisfy">确认</t-button>
    </t-form-item>
  </t-form>
</template>

<script>
import { cloneDeep } from 'lodash'
import { serviceInputTypeOptions, modInputTypeOptions, paramsTags, tagSelectDict, cmdbType } from '../utils/type'
import { inputDefaultInit } from '../utils/dataObject'
export default {
  name: 'compEntrance',
  components: {
    StringCompNew: () => import('../paramSelect_pro/stringCompNew'),
    BooleanCompNew: () => import('../paramSelect_pro/booleanCompNew'),
    IntCompNew: () => import('../paramSelect_pro/intCompNew'),
    AllCompNew: () => import('../paramSelect_pro/allCompNew'),
    ObjectCompNew: () => import('../paramSelect_pro/objectCompNew'),
    ListObjectCompNew: () => import('../paramSelect_pro/listObjectCompNew'),
    ListStringCompNew: () => import('../paramSelect_pro/listStringCompNew'),
    HostsCompNew: () => import('../paramSelect_pro/hostsCompNew')
    // NetworksCompNew: () => import('../paramSelect_pro/networksCompNew')
  },
  props: ['paramsForm', 'paramSign'],
  data () {
    return {
      rules: {
        name: [{ required: true, message: '参数名必填', type: 'error' }],
        type: [{ required: true, message: '参数类型必填', type: 'error' }]
      },
      isSatisfy: true,
      serviceInputForm: cloneDeep(this.paramsForm),
      tags: [],
      paramSelector: '',
      inputOptions: this.paramSign === 'service' ? serviceInputTypeOptions : modInputTypeOptions
    }
  },
  mounted () {
    this.tags = paramsTags[this.serviceInputForm.type]
    if (this.serviceInputForm.type === 'list_string') {
      if (cmdbType.indexOf(this.serviceInputForm.tag) > -1) {
        this.paramSelector = tagSelectDict[this.serviceInputForm.tag]
      } else {
        this.paramSelector = tagSelectDict[this.serviceInputForm.type]
      }
    } else {
      this.paramSelector = tagSelectDict[this.serviceInputForm.type]
    }
  },
  watch: {
    'serviceInputForm.type': {
      // 监听type变化，载入不同的选择器
      handler (newval, oldvalue) {
        this.paramSelector = tagSelectDict[newval]
        this.serviceInputForm.tag = ''
        this.tags = paramsTags[newval]
        this.initParamsOptions()
      },
      deep: true
    },
    'serviceInputForm.tag': {
      handler (newval, oldvalue) {
        // type为list_string类型，tag变化时，加载不同的选择器
        if (this.serviceInputForm.type === 'list_string') {
          if (cmdbType.indexOf(newval) > -1) {
            this.paramSelector = tagSelectDict[newval]
          } else {
            this.paramSelector = tagSelectDict[this.serviceInputForm.type]
          }
        }
        this.initParamsOptions()
      },
      deep: true
    }
  },
  methods: {
    addParameter () {
      this.$emit('addParameter', this.serviceInputForm)
    },
    initParamsOptions () {
      // tag和type变化时，初始化options内的内容
      this.serviceInputForm.options.default = cloneDeep(inputDefaultInit[this.serviceInputForm.type])
      this.serviceInputForm.options.enumeration = []
      this.serviceInputForm.options.regular = ''
      this.serviceInputForm.options.scope = []
      this.isSatisfy = true
    }
  }
}
</script>

<style scoped>
</style>
