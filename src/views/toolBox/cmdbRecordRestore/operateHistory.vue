<template>
  <div>
    <t-row>
      <t-col :span="12">
        <div class="my-4 ml-4">
          <t-input v-model="globalFilter" placeholder="全局搜索">
            <search-icon slot="prefix-icon"></search-icon>
          </t-input>
        </div>
      </t-col>
      <t-col :span="12">
        <t-space style="float: right">
          <t-date-range-picker allow-input clearable v-model="dateSelect" class="mr-4"/>
          <t-button @click="onSubmit">
            <time-icon slot="icon" />
              查询
            </t-button>
        </t-space>
      </t-col>
    </t-row>
    <t-table
      rowKey="index"
      :columns="columns"
      :data.sync="data"
      size="small"
      :pagination="pagination"
      @data-change="dataChange"
      style="font-size: 12px;"
      class="px-8"
    >
      <template #date="{ row }">
        {{ dateFormat(row.date) }}
      </template>
      <template #operation="{ row }">
      <t-link class="pr-2" theme="primary" hover="color" @click="onDataRestore(row)">
        同步
      </t-link>
    </template>
    </t-table>
  </div>
</template>

<script>
import { formatterDate } from '@/utils/index'
import { getHistoryDataApi } from '@/api/cmdb/cmdb_record_restore'
import { SearchIcon, TimeIcon } from 'tdesign-icons-vue'
import { cloneDeep } from 'lodash'
import globalSearch from '@/mixins/globalSearch'

const vmColumns = [
  { colKey: 'name', title: '无主虚拟机', align: 'left', className: () => 'table-font-main', width: '230' },
  { colKey: 'record.data.mgmSys', title: '所属管理系统', align: 'left' },
  { colKey: 'record.data.remark', title: '备注', align: 'left' },
  { colKey: 'record.data.vnf', title: '所属VNF', align: 'left' },
  { colKey: 'date', title: '操作时间', align: 'left', width: '230' },
  { colKey: 'operator', title: '操作人', align: 'left' },
  { colKey: 'record.record_id', title: '档案ID', align: 'left' },
  { colKey: 'record.name', title: '档案名称', align: 'left' },
  { colKey: 'record.type', title: '档案类型', align: 'left' },
  { colKey: 'record.createTime', title: '档案创建时间', align: 'left' },
  { colKey: 'record.author', title: '档案创建人', align: 'left' }
]

const vnfColumns = [
  { colKey: 'name', title: '无主VNF', align: 'left', className: () => 'table-font-main', width: '230' },
  { colKey: 'record.data.networkElemt', title: '所属网元', align: 'left' },
  { colKey: 'date', title: '操作时间', align: 'left', width: '230' },
  { colKey: 'operator', title: '操作人', align: 'left' },
  { colKey: 'record.record_id', title: '档案ID', align: 'left' },
  { colKey: 'record.name', title: '档案名称', align: 'left' },
  { colKey: 'record.type', title: '档案类型', align: 'left' },
  { colKey: 'record.createTime', title: '档案创建时间', align: 'left' },
  { colKey: 'record.author', title: '档案创建人', align: 'left' }
]
export default {
  name: 'operateHistory',
  mixins: [globalSearch],
  components: {
    SearchIcon, TimeIcon
  },
  data () {
    return {
      // 表格数据
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 12,
        total: 0,
        showJumper: true
      },
      columns: this.recordInfo.type === 'vm' ? vmColumns : vnfColumns,
      data: [],
      dateSelect: []
    }
  },
  props: {
    recordInfo: {
      type: Object,
      default: () => {
        return {
          type: 'vm',
          name: ''
        }
      }
    }
  },
  watch: {
    recordInfo: {
      handler (newVal, oldVal) {
        this.columns = newVal.type === 'vm' ? vmColumns : vnfColumns
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    dateFormat () {
      return function (date) {
        return formatterDate(date)
      }
    }
  },
  mounted () {
    this.getHistoryData(this.recordInfo)
  },
  methods: {
    dataChange (data) {
      this.data = data
    },
    getHistoryData (formData) {
      return new Promise((resolve, reject) => {
        getHistoryDataApi(formData).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.data = data.data
            this.getInitData(this.data)
            this.pagination.total = this.data.length
          } else {
            this.$message.error(`获取${formData.name}历史操作数据失败：${data.message}`)
          }
        }).catch(error => {
          this.$message.error(`获取${formData.name}历史操作数据失败：${error}`)
        })
      })
    },
    onSubmit () {
      if (this.dateSelect.length < 2) {
        this.$message.error('请选择时间范围')
      } else {
        console.log(this.dateSelect)
        const formData = cloneDeep(this.recordInfo)
        formData.beginDate = this.dateSelect[0]
        formData.endDate = this.dateSelect[1]
        this.getHistoryData(formData)
      }
    }
  }
}
</script>

<style scoped>

</style>
