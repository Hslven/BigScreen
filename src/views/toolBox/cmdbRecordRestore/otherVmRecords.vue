<template>
  <div>
    <t-table
      rowKey="index"
      :columns="columns"
      :data.sync="data"
      size="small"
      :pagination="pagination"
      style="font-size: 12px;"
      class="px-8"
    >
      <template #createTime-slot="{ row }">
        {{ dateFormat(row.createTime) }}
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
import {
  restoreDataApi,
  getDataRecordInfoApi
} from '@/api/cmdb/cmdb_record_restore'
export default {
  name: 'otherVmRecords',
  props: {
    isOtherRecords: {
      type: Boolean,
      default: false
    },
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
  data () {
    return {
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 12,
        total: 0,
        showJumper: true
      },
      columns: [
        {
          colKey: 'name',
          title: '档案名称',
          align: 'left',
          className: () => 'table-font-main'
        },
        { colKey: 'record_id', title: '档案ID', align: 'left' },
        { colKey: 'data.name', title: '无主虚拟机', align: 'left' },
        { colKey: 'type', title: '档案类型', align: 'left' },
        { colKey: 'createTime', title: '档案创建时间', align: 'left', cell: 'createTime-slot' },
        { colKey: 'author', title: '档案创建人', align: 'left' },
        { colKey: 'data.mgmSys', title: '部署管理系统', align: 'left' },
        { colKey: 'data.remark', title: '备注', align: 'left' },
        { colKey: 'data.vnf', title: '所属VNF', align: 'left' },
        { colKey: 'operation', align: 'center', title: '操作' }
      ],
      data: []
    }
  },
  computed: {
    dateFormat () {
      // 格式化时间
      return function (date) {
        return formatterDate(date)
      }
    }
  },
  mounted () {
    this.getDataRecordInfo()
  },
  methods: {
    getDataRecordInfo () {
      return new Promise((resolve, reject) => {
        getDataRecordInfoApi(this.recordInfo).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.data = data.data
          } else {
            this.$message.error(`获取无主虚拟机档案数据失败：${data.message}`)
          }
        }).catch(error => {
          this.$message.error(`获取无主虚拟机档案数据失败：${error}`)
        })
      })
    },
    onDataRestore (row) {
      const restoreFrom = {
        data: [
          {
            record_id: row.record_id,
            record_data_id: row.data.record_data_id,
            type: row.type,
            name: row.data.name,
            operator: this.$store.getters.getInfo.userName
          }
        ]
      }
      return new Promise((resolve, reject) => {
        restoreDataApi(restoreFrom).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.$message.success('同步档案成功')
            this.$emit('refreshData') // 刷新数据列表
            this.$emit('update:isOtherRecords', false) // 关闭弹窗
          } else {
            this.$message.error(`档案同步失败：${data.message}`)
          }
        }).catch(error => {
          this.$message.error(`档案同步失败：${error.data.message}`)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
