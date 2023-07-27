<template>
  <div class="bg-mod-card" style="padding: 15px">
    <div style="font-weight: bold">虚拟层日志AI分析</div>
    <t-form :data="condition" ref="form" @submit="searchE">
      <t-row>
        <t-col :span="3">
          <t-form-item labelAlign="left" label="网络云期数" name="projectPeriod">
            <t-select v-model="condition.projectPeriod" :options="[{ label: '一期', value: '一期' }, { label: '二期', value: '二期' }, { label: '三期', value: '三期' }]" clearable filterable style="width: 80%"></t-select>
          </t-form-item>
        </t-col>
        <t-col :span="3">
          <t-form-item labelAlign="left" label="网络云期数" name="resourcePool">
            <t-select v-model="condition.resourcePool" :options="[{ label: '可信1', value: '可信1' }, { label: '可信2', value: '可信2' }, { label: '可信3', value: '可信3' }]" clearable filterable style="width: 80%"></t-select>
          </t-form-item>
        </t-col>
        <t-col :span="3">
          <t-form-item labelAlign="left" label="时间" name="range">
            <t-date-range-picker v-model="condition.range" allow-input clearable />
          </t-form-item>
        </t-col>
        <t-col :span="3">
          <t-button theme="primary" type="submit">查询</t-button>
        </t-col>
      </t-row>
    </t-form>
    <div style="margin-top: 15px">
      <t-table
        hover resizable selectOnRowClick multipleSort
        row-key="id"
        size="small"
        table-layout="fixed"
        cell-empty-content="-"
        max-height="450"
        empty="暂无数据"
        :data="table.infoData"
        :columns="table.column"
        :loading="table.loading"
        :selected-row-keys="table.select"
        style="font-size: 12px"
        @select-change="onSelectChange"
      >
        <template #neLog="{ row }">
          <span v-for="(item, index) in row" :key="index">
              {{ JSON.stringify(item) }}
            </span>
        </template>
      </t-table>
    </div>
    <t-row justify="end" style="margin-top: 15px">
      <t-button theme="primary" @click="apply">提交</t-button>
    </t-row>
    <t-dialog header="结果" placement="center" width="90%" preventScrollThrough v-if="dialog.apply" :visible.sync="dialog.apply" :footer="false">
      <t-row style="margin-top: 15px;">通过AI能力，从海量网络云原始日志中，使用智能识别算法，自动识别故障异常</t-row>
      <div style="margin-top: 15px">
        <t-table
          hover resizable selectOnRowClick multipleSort
          row-key="id"
          size="small"
          table-layout="fixed"
          cell-empty-content="-"
          max-height="450"
          empty="暂无设备信息"
          :data="resTable.infoData"
          :columns="resTable.column"
          :loading="resTable.loading"
          :selected-row-keys="resTable.select"
          style="font-size: 12px"
          @select-change="onSelectChange"
        >
          <template #status="{ row }">
            <t-tag :theme="!row.alarm_list || row.alarm_list.length === 0 ? 'primary' : 'danger'" variant="outline">{{ !row.alarm_list || row.alarm_list.length === 0 ? '通过' : '不通过' }}}</t-tag>
          </template>
          <template #alarm_list="{ row }">
            <span v-if="row.alarm_list ? row.alarm_list.length === 0 : true">暂无异常日志</span>
          </template>
        </t-table>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import { neLogListAPI, vmLogInspectAPI } from '@/api/inops/AI/AI'
import { formatField } from '@/utils/inops/formatUtils'

export default {
  name: 'logAI',
  data () {
    return {
      condition: {
        projectPeriod: '',
        resourcePool: '',
        startTime: '',
        endTime: '',
        range: ''
      },
      table: {
        loading: false,
        select: [],
        infoData: [],
        column: [
          { colKey: 'row-select', title: '选择', type: 'multiple', width: 50 },
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'projectPeriod', title: '网络云期数', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'resourcePool', title: '资源池', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'hostName', title: '虚拟层承载网元', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'neLog', title: '虚层日志', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true }
        ]
      },
      pages: {
        pageSizeList: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      resTable: {
        loading: false,
        infoData: [],
        column: [
          { type: 'checkbox', align: 'center', width: '40' },
          { type: 'seq', title: '序号', align: 'center', width: '50' },
          { field: 'projectPeriod', title: '网络云期数', formatType: '', formatList: 'jobStatus', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'resourcePool', title: '资源池', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'hostName', title: '虚拟层承载网元', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'status', title: '验收状态', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'alarm_list', title: '异常日志', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' }
        ]
      },
      resPages: {
        pageSizeList: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      dialog: {
        apply: false
      }
    }
  },
  mounted () {
    this.getNeLogList()
  },
  methods: {
    formatField,
    getNeLogList () {
      neLogListAPI().then(res => {
        const { data } = res
        if (data.code === 200) {
          this.table.infoData = data.data
        }
      })
    },
    searchE () {
      console.log('查询')
    },
    apply () {
      this.resTable.infoData = []
      this.resTable.loading = true
      vmLogInspectAPI(this.table.select).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.resTable.infoData = data.data
          this.resTable.loading = false
        }
      })
      this.dialog.apply = true
    },
    onSelectChange (value) {
      this.table.select = value
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
