<template>
  <div class="bg-mod-card" style="padding: 15px">
    <div class="pl-3" style="font-size: 14px; font-weight: bold; letter-spacing: 2px; border-left: 4px solid #2196f3">
      {{ condition.actionType === 'deny' ? '封堵' : '解封'}}模拟请求
    </div>
    <div class="mt-5">
      <t-form :data="condition" ref="form" @submit="onApply" @reset="onReset">
        <t-row>
          <t-col class="mb-5" :span="4" v-for="(item, index) in filed" :key="index">
            <t-form-item labelAlign="left" :label="item.name" :name="item.value">
              <t-input v-if="item.type === 'input'" v-model.trim="condition[item.value]" clearable style="width: 80%"></t-input>
              <t-select v-if="item.type === 'select'" v-model="condition[item.value]" :options="dict[item.value]" clearable filterable style="width: 80%"></t-select>
              <t-date-picker v-if="item.type === 'date'" v-model="condition[item.value]" enable-time-picker allow-input clearable format="YYYY-MM-DD hh:mm:ss" style="width: 80%"/>
            </t-form-item>
          </t-col>
          <t-col :span="4">
            <t-row>
              <t-button class="mr-3" theme="primary" type="submit">{{ condition.actionType === 'permit' ? '解除封堵' : '发起封堵' }}</t-button>
              <t-button theme="default" variant="base" type="reset">重置</t-button>
            </t-row>
          </t-col>
        </t-row>
      </t-form>
    </div>
  </div>
</template>

<script>
import { processTestAPI } from '@/api/inops/block/records'
import { nanoid } from 'nanoid'
export default {
  name: 'formData',
  data () {
    return {
      dict: {
        ipType: [{ label: 'IPV4', value: '0' }, { label: 'IPV6', value: '1' }],
        actionType: [{ label: '封堵', value: 'deny' }, { label: '解封', value: 'permit' }],
        autoBlock: [{ label: '手动封堵', value: '0' }, { label: '自动封堵', value: '1' }]
      },
      filed: [
        // { name: '任务单号', value: 'taskCode', type: 'input' },
        { name: '需求来源', value: 'taskSource', type: 'input' },
        { name: '源IP', value: 'sourceIp', type: 'input' },
        { name: 'IP类型', value: 'ipType', type: 'select' },
        { name: '动作', value: 'actionType', type: 'select' },
        { name: '是否自动封堵', value: 'autoBlock', type: 'select' },
        { name: '操作原因', value: 'sourceFor', type: 'input' },
        { name: '操作人', value: 'operatorName', type: 'input' },
        { name: '操作编号', value: 'operatorCode', type: 'input' },
        { name: '所属部门', value: 'section', type: 'input' },
        { name: '业务系统编号', value: 'systemCode', type: 'input' },
        { name: '策略失效时间', value: 'policyFailTime', type: 'date' }
      ],
      condition: {
        taskCode: '',
        taskSource: '',
        sourceIp: '',
        ipType: '0',
        actionType: 'deny',
        autoBlock: '0',
        sourceFor: '',
        operatorName: '',
        operatorCode: '',
        section: '',
        systemCode: '',
        policyFailTime: ''
      }
    }
  },
  methods: {
    onApply () {
      this.condition.taskCode = nanoid(32)
      processTestAPI(this.condition).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '发起封堵成功', placement: 'center' })
        }
      })
    },
    onReset () {
      this.deny.condition = {
        taskCode: '',
        taskSource: '',
        sourceIp: '',
        ipType: '',
        actionType: '',
        autoBlock: '',
        sourceFor: '',
        operatorName: '',
        operatorCode: '',
        section: '',
        systemCode: '',
        policyFailTime: ''
      }
    },
    validateIPV4 () {
      const reg = new RegExp(
        '^(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|[1-9])\\.' +
        '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
        '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)\\.' +
        '(1\\d{2}|2[0-4]\\d|25[0-5]|[1-9]\\d|\\d)$')
      return reg.test(this.condition.sourceIp)
    },
    validateIPV6 () {
      const reg = new RegExp(
        '^\\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}' +
        '(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}' +
        '(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}' +
        '(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|' +
        '(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|' +
        '(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|' +
        '(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:))|' +
        '(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(\\.(25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}))|:)))(%.+)?\\s*$'
      )
      return reg.test(this.condition.sourceIp)
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
