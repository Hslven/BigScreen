<template>
  <div>
    <t-row>
      <t-col :flex="3">
        <div class="my-6 mx-5">
          <t-select @change="changeResourceType" label="云资源类型：" v-model="resourceType" :options="resourceCategory" placeholder="请选择云资源类型：" />
        </div>
      </t-col>
      <t-col :flex="20">
        <div class="my-6">
          <t-input v-model="globalFilter" placeholder="全局搜索">
            <search-icon slot="prefix-icon"></search-icon>
          </t-input>
        </div>
      </t-col>
      <t-col :flex="5">
        <div class="my-6 mr-4" style="float: right">
          <t-button @click="onDataRestore" class="mr-4">
            <refresh-icon slot="icon" />
            一键同步
          </t-button>
          <t-button @click="downloadFile">
            <download-icon slot="icon" />
            数据导出
          </t-button>
        </div>
      </t-col>
    </t-row>
    <t-config-provider :globalConfig="globalLocale">
      <t-table
        rowKey="name"
        :columns="columns"
        :data.sync="data"
        size="small"
        :sort.sync="sort"
        :pagination="pagination"
        @select-change="rehandleSelectChange"
        @sort-change="sortChange"
        @data-change="dataChange"
        style="font-size: 12px;"
        cellEmptyContent = "-"
        class="px-8"
        >
        <template #operation="{ row }">
          <t-link class="pr-2" theme="primary" hover="color" @click="onHistory('vnf', row.name)">
            历史操作记录
          </t-link>
          <t-link class="pr-2" theme="primary" hover="color" v-if="row.record" @click="otherRecord('vnf', row.name)">
            其他档案
          </t-link>
        </template>
      </t-table>
    </t-config-provider>
    <t-dialog width="80%" :visible.sync="isOtherRecords" header="其他档案" :cancelBtn="null" :confirm-btn="null">
      <other-vnf-records v-if="isOtherRecords" @refreshData="getData" :isOtherRecords.sync="isOtherRecords" :recordInfo="otherRecordInfo"></other-vnf-records>
    </t-dialog>
    <t-dialog width="80%" :visible.sync="isHistoryData" header="历史操作记录" :cancelBtn="null" :confirm-btn="null">
      <operate-history v-if="isHistoryData" :recordInfo="otherRecordInfo"></operate-history>
    </t-dialog>
  </div>
</template>

<script>
import {
  restoreDataApi,
  getAbnormalDataApi
} from '@/api/cmdb/cmdb_record_restore'
import { SearchIcon, DownloadIcon, RefreshIcon } from 'tdesign-icons-vue'
import OtherVnfRecords from '@/views/toolBox/cmdbRecordRestore/otherVmRecords'
import OperateHistory from '@/views/toolBox/cmdbRecordRestore/operateHistory'
import globalSearch from '@/mixins/globalSearch'
export default {
  name: 'vnfRecord',
  mixins: [globalSearch],
  components: { SearchIcon, DownloadIcon, RefreshIcon, OtherVnfRecords, OperateHistory },
  data () {
    return {
      resourceType: '网络云',
      resourceCategory: [
        { label: '网络云', value: '网络云' },
        { label: '移动边缘云', value: '移动边缘云' },
        { label: '一朵云', value: '一朵云' },
        { label: '边缘云', value: '边缘云' },
        { label: '松山湖', value: '松山湖' },
        { label: '生态园', value: '生态园' }
      ],
      dataSelected: [],
      isHistoryData: false,
      isOtherRecords: false,
      otherRecordInfo: {},
      sort: {},
      data: [],
      columns: [
        {
          colKey: 'row-select',
          type: 'multiple',
          width: 50
        },
        {
          colKey: 'name',
          title: '无主VNF',
          align: 'left',
          ellipsis: {
            theme: 'light',
            placement: 'bottom'
          },
          width: '200',
          className: () => 'table-font-main'
        },
        { colKey: 'record.record_id', title: '档案ID', align: 'left' },
        { colKey: 'record.name', title: '档案名称', align: 'left' },
        { colKey: 'record.type', title: '档案类型', align: 'left' },
        { colKey: 'record.createTime', title: '档案创建时间', align: 'left' },
        { colKey: 'record.author', title: '档案创建人', align: 'left' },
        { colKey: 'record.data.networkElemt', title: '所属网元', ellipsis: { theme: 'light', placement: 'bottom' }, align: 'left', sortType: 'all', sorter: (a, b) => a.record.data ? 1 : b.record.data ? -1 : 0 },
        { colKey: 'operation', align: 'left', title: '操作', ellipsis: { theme: 'light', placement: 'bottom' } }
      ],
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 12,
        total: 0,
        showJumper: true
      },
      globalLocale: {
        table: {
          sortIcon: (h) => h && <mod-icon name="arrow_drop_down" size="22px" style="color: #cccccc !important" />
        }
      }
    }
  },
  created () {},
  mounted () {
    this.getData()
  },
  methods: {
    changeResourceType (value, content) {
      this.getData()
    },
    sortChange (sort) {
      this.sort = sort
    },
    dataChange (data) {
      this.data = data
    },
    otherRecord (type, name) {
      this.otherRecordInfo = {
        type,
        name
      }
      this.isOtherRecords = true
    },
    onHistory (type, name) {
      this.otherRecordInfo = {
        type,
        name
      }
      this.isHistoryData = true
    },
    getData () {
      // 请求用户列表接口
      return new Promise((resolve, reject) => {
        getAbnormalDataApi({ type: 'vnf', resource_type: this.resourceType }).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.data = data.data
            this.getInitData(this.data)
            this.pagination.total = this.data.length
          } else {
            this.$message.error(`获取无主VNF数据失败：${data.message}`)
          }
        }).catch(error => {
          this.$message.error(`获取无主VNF数据失败：${error}`)
        })
      })
    },
    rehandleSelectChange (value, { selectedRowData }) {
      this.dataSelected = selectedRowData
    },
    onDataRestore () {
      const restoreFrom = { data: [] }
      restoreFrom.data = this.dataSelected.filter((item) => {
        return item.record.data !== undefined
      }).map((selected) => {
        return {
          record_id: selected.record.record_id,
          record_data_id: selected.record.data.record_data_id,
          type: selected.record.type,
          name: selected.name,
          operator: this.$store.getters.getInfo.userName
        }
      })
      return new Promise((resolve, reject) => {
        restoreDataApi(restoreFrom).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.$message.success('vnf类型同步档案成功!')
            this.getData()
          } else {
            this.$message.error(`vnf类型档案同步失败：${data.message}`)
          }
        }).catch(error => {
          this.$message.error(`vnf类型档案同步失败：${error.data.message}`)
        })
      })
    },
    downloadFile () {
      const header = ['无主VNF']
      const { exportJsonToExcel } = require('@/utils/excel/Export2Excel')
      let fileData = []
      if (this.data.length === 0) {
        this.$message.error('无主VNF数据')
        return
      }
      fileData = this.data.map((selected) => {
        return {
          name: selected.name
        }
      })
      const jsonData = this.formatJson(['name'], fileData)
      exportJsonToExcel(header, jsonData, 'VNF名称')
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style scoped>
</style>
