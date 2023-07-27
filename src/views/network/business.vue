<template>
  <div>
    <content-header></content-header>
    <div class="bg-mod-card rounded-sm">
      <t-row>
        <t-col :span="11">
          <div class="mt-6 ml-4">
            <t-input v-model="globalFilter" placeholder="全局搜索">
              <search-icon slot="prefix-icon"></search-icon>
            </t-input>
          </div>
        </t-col>
        <t-col :span="1">
          <div class="mt-6" style="float: right">
            <t-button variant="outline"  @click="expanded = !expanded" class="mr-4">
              <filter-icon slot="icon" />
              更多筛选
            </t-button>
          </div>
        </t-col>
      </t-row>
      <t-row>
        <t-col :span="12">
          <div style="float: right;" class="py-4 pl-4">
            <t-button variant="outline" class="mr-2" @click="columnControllerVisible = true">
              <setting-icon slot="icon" />
              列配置
            </t-button>
            <t-button variant="outline" class="mr-4" @click="exportEvent">
              <download-icon slot="icon" />
              导出数据
            </t-button>
          </div>
        </t-col>
      </t-row>
      <div>
        <t-card v-show="expanded" class="m-4">
          <t-row>
            <t-col :span="2 " v-for="(formItem) in visibleColumns" :key="formItem" class="m-4">
              <t-input-adornment :prepend="columnsDict[formItem]">
                <t-input placeholder="请输入内容" v-model="visibleForm[formItem]" />
              </t-input-adornment>
            </t-col>
            <t-col :span="2" class="m-4">
              <t-button theme="primary" @click="filterEvent" class="mr-4">查询</t-button>
              <t-button variant="outline" @click="resertEvent">重置</t-button>
            </t-col>
          </t-row>
        </t-card>
      </div>
      <div>
        <t-table
          rowKey="index"
          :columns="columns"
          :data="data"
          size="small"
          :pagination="pagination"
          :columnControllerVisible.sync="columnControllerVisible"
          style="font-size: 12px;"
          :displayColumns.sync="visibleColumns"
          :columnController="{
            dialogProps: { preventScrollThrough: true },
            hideTriggerButton: true
          }"
          table-layout="fixed"
          class="px-8"
        >
          <template #ip-slot="{ col, row }">
            <t-tooltip>
              <t-tag theme="primary">{{ row[col.colKey].length }}</t-tag>
              <div slot="content">{{ row[col.colKey] }}</div>
            </t-tooltip>
          </template>
        </t-table>
      </div>
    </div>
  </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'
import { businessTable } from '@/dict/columns'
import { parseColumnToDict, parseColumnToForm } from '@/utils/index'
import { getBusinessVlan } from '@/api/network/network'
import globalSearch from '@/mixins/globalSearch'
import { FilterIcon, SettingIcon, DownloadIcon, SearchIcon } from 'tdesign-icons-vue'
import { cloneDeep } from 'lodash'
export default {
  name: 'business',
  mixins: [globalSearch],
  components: {
    ContentHeader,
    FilterIcon,
    SettingIcon,
    DownloadIcon,
    SearchIcon
  },
  data () {
    return {
      columnControllerVisible: false,
      expanded: false,
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 20,
        total: 0
      },
      backupsData: [],
      data: [],
      columns: businessTable.columns,
      visibleColumns: businessTable.visibleColumns,
      visibleForm: parseColumnToForm(businessTable.columns),
      columnsDict: parseColumnToDict(businessTable.columns)
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    filterEvent () {
      this.data = this.backupsData.filter((item) => {
        let result = true
        for (const key in this.visibleForm) {
          if (result && this.visibleForm[key]) {
            if (!item[key]) {
              result = false
            } else {
              result = item[key].includes(this.visibleForm[key])
            }
          }
        }
        return result
      })
      this.pagination.total = this.data.length
    },
    getData () {
      return new Promise((resolve, reject) => {
        getBusinessVlan({}).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.data = data.data.list
            this.getInitData(this.data)
            this.pagination.total = this.data.length
            this.backupsData = cloneDeep(this.data)
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    resertEvent () {
      this.getData()
      this.visibleForm = parseColumnToForm(businessTable.columns)
    },
    exportEvent () {
      const header = []
      this.visibleColumns.forEach((val, index) => {
        header.push(this.columnsDict[val])
      })
      require.ensure([], () => {
        const { exportJsonToExcel } = require('@/utils/excel/Export2Excel')
        const tabledata = this.formatJson(this.visibleColumns, this.data)
        exportJsonToExcel(header, tabledata, '业务系统数据')
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style scoped>
</style>
