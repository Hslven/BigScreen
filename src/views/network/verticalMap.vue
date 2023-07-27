<template>
  <div>
    <content-header></content-header>
    <div class="bg-mod-card rounded-sm">
      <t-row>
        <t-col :span="3">
          <div class="pt-4 pl-4">
            <t-select label="聚合维度：" v-model="dataDimension" :options="dimensionOptions" placeholder="请选择聚合维度" @change="dimensionChange" />
          </div>
        </t-col>
        <t-col :span="9">
          <div style="float: right;" class="pt-4 pl-4">
            <t-button variant="outline"  @click="expanded = !expanded" class="mr-4 mb-2">
              <caret-down-icon slot="icon" v-show="expanded"  />
              <caret-up-icon slot="icon" v-show="!expanded"  />
              筛选
            </t-button>
            <t-button variant="outline" class="mr-4 mb-2" @click="columnControllerVisible = true">
              <setting-icon slot="icon" />
              属性设置
            </t-button>
            <t-button variant="outline" class="mr-4 mb-2" @click="isDetail = true">
              <setting-icon slot="icon" />
              省略设置
            </t-button>
            <t-button variant="outline" class="mr-4 mb-2" @click="exportEvent">
              <cloud-download-icon slot="icon" />
              导出
            </t-button>
          </div>
        </t-col>
      </t-row>
      <div>
        <t-card v-show="expanded" class="m-2">
          <t-row>
            <t-col flex="510px" v-for="(formItem) in visibleColumns" :key="formItem" class="m-2">
              <t-input-adornment :prepend="columnsDict[formItem]">
                <t-input placeholder="多值查询采用英文分号分隔" v-model="visibleForm[formItem]" />
              </t-input-adornment>
            </t-col>
            <t-col :xs="12" :sm="12" :md="6" :lg="3" :xl="2" class="m-2">
              <t-button theme="primary" @click="filterEvent" class="mr-2">查询</t-button>
              <t-button variant="outline" @click="resertEvent">重置</t-button>
            </t-col>
          </t-row>
        </t-card>
      </div>
      <div style="max-width: 100%">
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
          cellEmptyContent = "-"
          @page-change="onPageChange"
          :loading="loading"
          class="px-8"
        >
        </t-table>
      </div>
      <t-dialog :visible.sync="isDetail" header="省略显示" :cancelBtn="null" @confirm="onDetail">
        <t-checkbox-group v-model="detailList" :options="detailColumns" />
      </t-dialog>
    </div>
  </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'
import { parseColumnToDict, parseColumnToForm, parseColumnToDetail } from '@/utils/index'
import { verticalMapTable } from '@/dict/columns'
import { getVerticalMapNewApi, downloadVerticalMapNewApi } from '@/api/network/network'
import { CaretDownIcon, SettingIcon, CaretUpIcon, CloudDownloadIcon } from 'tdesign-icons-vue'
import { cloneDeep } from 'lodash'
export default {
  name: 'verticalMap',
  components: {
    ContentHeader,
    CaretDownIcon,
    SettingIcon,
    CaretUpIcon,
    CloudDownloadIcon
  },
  data () {
    return {
      isDetail: false,
      detailList: verticalMapTable.columns.map(item => item.colKey),
      detailColumns: parseColumnToDetail(verticalMapTable.columns),
      expanded: false,
      pagination: {
        current: 1,
        pageSize: 50,
        total: 0,
        showJumper: true
      },
      backupsData: [],
      data: [],
      columns: verticalMapTable.columns,
      visibleColumns: verticalMapTable.visibleColumns,
      visibleForm: parseColumnToForm(verticalMapTable.columns),
      columnsDict: parseColumnToDict(verticalMapTable.columns),
      columnControllerVisible: false,
      dataDimension: 'computer_server',
      dimensionOptions: [
        {
          label: '计算服务器',
          value: 'computer_server'
        },
        {
          label: '虚拟机',
          value: 'vm'
        },
        {
          label: '主机组',
          value: 'ha'
        },
        {
          label: '计算服务器的存储TOR',
          value: 'computer_server_st_tor'
        },
        {
          label: '计算服务器业务TOR',
          value: 'computer_server_s_tor'
        },
        {
          label: '计算服务器管理TOR',
          value: 'computer_server_m_tor'
        }
      ],
      loading: false
    }
  },
  mounted () {
    this.visibleForm.page = this.pagination.current
    this.visibleForm.page_size = this.pagination.pageSize
    this.visibleForm.dimension = this.dataDimension
    this.onDetail()
    this.getData(this.visibleForm)
  },
  watch: {
    visibleColumns: {
      handler (newVal, oldVal) {
        this.detailColumns = parseColumnToDetail(verticalMapTable.columns.filter(item => {
          return newVal.includes(item.colKey)
        }))
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    dimensionChange (val) {
      this.visibleForm.page = 1
      this.visibleForm.page_size = 50
      this.visibleForm.dimension = val
      this.getData(this.visibleForm)
    },
    getData (fromData) {
      this.loading = true
      return new Promise((resolve, reject) => {
        getVerticalMapNewApi(fromData).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.data = data.data.list
            this.pagination.current = data.data.page
            this.pagination.pageSize = data.data.page_size
            this.pagination.total = data.data.total
            this.backupsData = cloneDeep(this.data)
          } else {
            this.$message.error(data.message)
          }
          this.loading = false
        }).catch(error => {
          this.loading = false
          reject(error)
        })
      })
    },
    onDetail () {
      this.columns = cloneDeep(verticalMapTable.columns).map(item => {
        if (this.detailList.includes(item.colKey)) {
          item.ellipsis = {
            props: {
              theme: 'light',
              placement: 'bottom-right'
            },
            content: (h, { row }) => {
              return (
                <div>
                  <p style="white-space:pre-line">
                    {row[item.colKey] ? row[item.colKey].replace(/^(\s|;)+|(\s|;)+$/g, '').replaceAll(';;', '\n').replaceAll(';', '\n') : row[item.colKey]}
                  </p>
                </div>
              )
            }
          }
        }
        return item
      })
      this.isDetail = false
    },
    filterEvent () {
      this.visibleForm.page = 1
      this.visibleForm.page_size = 50
      this.getData(this.visibleForm)
    },
    async onPageChange (pageInfo) {
      this.visibleForm.page = pageInfo.current
      this.visibleForm.page_size = pageInfo.pageSize
      await this.getData(this.visibleForm)
    },
    resertEvent () {
      this.visibleForm = parseColumnToForm(verticalMapTable.columns)
      this.visibleForm.page = 1
      this.visibleForm.page_size = 50
      this.getData(this.visibleForm)
    },
    exportEvent () {
      return new Promise((resolve, reject) => {
        const downloadVisibleForm = {
          dimension: this.dataDimension
        }
        this.visibleColumns.forEach(item => {
          downloadVisibleForm[item] = this.visibleForm[item]
        })
        downloadVerticalMapNewApi(downloadVisibleForm).then(response => {
          const blob = new Blob([response.data], {
            type: 'application/vnd.ms-excel'
          })
          const fileNameEncode = response.headers['content-disposition'].split('filename=')[1]
          const fileName = decodeURIComponent(fileNameEncode)
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName)
          } else {
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            window.URL.revokeObjectURL(link.href)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style scoped>
/deep/ .t-checkbox {
  margin: 4px !important
}
/* 表格table-layout="auto"模式 */
/* /deep/ .t-table .t-text-ellipsis {
  max-width: 300px;
}
/deep/ .t-table.t-size-s th, .t-table.t-size-s td {
  min-width: 300px;
} */
</style>
