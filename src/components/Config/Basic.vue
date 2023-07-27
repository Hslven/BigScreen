<template>
  <div style="padding: 15px">
    <t-row align="center">
      <div style="border: 1px solid #165DFF; height: 14px;"></div>
      <span style="margin-left: 10px">基础配置</span>
    </t-row>
    <t-form :data="value" ref="form" style="margin-top: 20px">
      <t-form-item v-for="(item, index) in field" v-show="isShow[item.value]" :key="index" labelAlign="right" :label="item.name" :name="item.value">
        <t-input
          v-if="item.type === 'input'"
          :type="item.input"
          v-model.trim="value[item.value]"
          clearable
          :suffix="item.suffix"
          :style="{ width: item.value === 'jobName' ? '532px' : '208px' }"></t-input>
        <t-select
          v-else-if="item.type === 'select'"
          v-model="value[item.value]"
          :options="dict[item.value]"
          clearable filterable
          :multiple="item.isMultiple"
          :minCollapsedNum="4"
          :style="{ width: item.value === 'jobLabel' ? '532px' : '208px'}"></t-select>
        <t-input-number
          v-else-if="item.type === 'input-number'"
          v-model="value[item.value]"
          min="0" theme="column"
          :decimalPlaces=0
          :suffix="item.suffix"
          style="width: 208px"></t-input-number>
      </t-form-item>
      <schedule ref="shedule" class="mt-5" :expression.sync="taskExpression" :taskType.sync="tType"></schedule>
    </t-form>
  </div>
</template>

<script>
import schedule from './schedule'
import { configShow } from './dict'
import { getDictList } from '@/utils/inops/u'
export default {
  name: 'Basic',
  components: { schedule },
  props: {
    basic: {
      type: Object,
      default () {
        return {}
      }
    },
    expression: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    taskType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dict: {
        list: ['backupType'],
        jobLabel: [{ label: '普通', value: 'normal' },
          { label: '监控', value: 'monitor' },
          { label: '拨测', value: 'polling' },
          { label: '测试', value: 'test' }],
        backupType: []
      },
      isShow: {
        jobName: true,
        jobLabel: true,
        backupType: true,
        jobTimeout: true,
        retentionTime: true
      },
      field: [
        { name: '任务名称', value: 'jobName', type: 'input', required: true, placeholder: '' },
        { name: '任务类型', value: 'jobLabel', type: 'select', required: false, isMultiple: true },
        { name: '备份类型', value: 'backupType', type: 'select', required: true, options: 'backupType', isMultiple: false },
        { name: '超时时间', value: 'jobTimeout', type: 'input-number', required: false, placeholder: '默认超时时间：1500s', suffix: '秒' },
        { name: '备份时长', value: 'retentionTime', type: 'input-number', required: false, placeholder: '', suffix: '天' }
      ],
      value: {
        jobName: '',
        jobLabel: [],
        backupType: '',
        jobTimeout: '',
        retentionTime: 7
      },
      tType: '',
      taskExpression: ''
    }
  },
  created () {
    this.getDict()
    this.initData()
  },
  watch: {
    value: {
      handler (newVal) {
        const obj = {
          jobName: newVal.jobName,
          jobLabel: newVal.jobLabel.join(','),
          jobTimeout: newVal.jobTimeout,
          backupType: newVal.backupType,
          retentionTime: newVal.retentionTime
        }
        this.$emit('update:basic', obj)
      },
      deep: true
    },
    tType: {
      handler (newVal) {
        this.$emit('update:taskType', newVal)
      }
    },
    taskExpression: {
      handler (newVal) {
        this.$emit('update:expression', newVal)
      }
    }
  },
  methods: {
    initData () {
      this.isShow = configShow[this.type]
      const { jobName, backupType, jobLabel, jobTimeout, retentionTime } = this.basic
      const obj = jobLabel ? { jobLabel: jobLabel === '' ? [] : this.basic.jobLabel.split(',') } : {}
      this.value = Object.assign(this.value, { jobName, backupType, jobTimeout, retentionTime }, obj)
      this.taskExpression = this.expression
      this.tType = this.taskType
    },
    /**
     * 获取字典
     * @returns {Promise<void>}
     */
    async getDict () {
      for (const item of this.dict.list) {
        this.dict[item] = await getDictList(item)
      }
    },
    async childInitData () {
      await this.initData()
      this.$refs.shedule.initData()
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-input-number.t-is-controls-right .t-input-number__decrease
  opacity: 5
  visibility: initial
/deep/ .t-input-number.t-is-controls-right .t-input-number__increase
  opacity: 9
  visibility: initial
</style>
