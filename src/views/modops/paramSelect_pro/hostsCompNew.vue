<template>
  <div style="width: 50%">
    <div style="padding: 0 0 16px 0">
      <t-button theme="primary" @click="selectHost = !selectHost, onRequest()">
        已选择 {{ inputOptionsForm.options.default.length }}台主机
      </t-button>
    </div>
    <t-dialog
      width="90%"
      placement="center"
      :visible.sync="selectHost"
      header="主机选择器"
      :onConfirm="selectedEnd">
      <t-row :gutter="16">
        <t-col :span="6">
          <t-card title="未选主机" class="w-full">
            <t-space class="w-full pb-2">
              <t-input v-model="hostFilter" style="width: 100%" placeholder="主机名模糊查询" class="pr-2"></t-input>
              <t-button theme="primary" @click="searchHost">提交</t-button>
            </t-space>
            <t-table
              rowKey="name"
              :columns="columns"
              :data.sync="data"
              size="small"
              :pagination="pagination"
              @page-change="onPageChange"
              @select-change="rehandleSelectChange"
              cellEmptyContent = "-"
              style="font-size: 12px;"
              class="px-8"
              >
            </t-table>
          </t-card>
        </t-col>
        <t-col :span="6">
          <t-card title="已选主机" class="w-full">
            <div class="font-main">已选<span>{{ selected.length }}台主机</span></div>
            <t-table
              rowKey="name"
              :columns="selectedColumns"
              :data.sync="selected"
              size="small"
              :pagination="selectedPagination"
              cellEmptyContent = "-"
              style="font-size: 12px;"
              class="px-8"
              >
            </t-table>
          </t-card>
        </t-col>
      </t-row>
    </t-dialog>
  </div>
</template>

<script>
import { cmdbSingleModelAPI } from '@/api/openapi/index'
import { cmdbSingleModelPath } from '@/dict/cmdbPath'
export default {
  name: 'hostsCompNew',
  props: ['serviceInputForm', 'isSatisfy'],
  data () {
    return {
      inputOptionsForm: this.serviceInputForm,
      hostFilter: '',
      selected: [],
      selectHost: false,
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      },
      selectedPagination: {
        defaultCurrent: 1,
        defaultPageSize: 20,
        total: 0
      },
      data: [],
      columns: [
        {
          colKey: 'row-select',
          type: 'multiple',
          width: 50
        },
        {
          colKey: 'name',
          title: '主机名'
        }
      ],
      selectedColumns: [
        {
          colKey: 'name',
          title: '主机名'
        }
      ]
    }
  },
  watch: {
    inputOptionsForm: {
      // 监听参数类型变化，载入不同的tag
      handler (newval, oldvalue) {
        this.$emit('update:serviceInputForm', newval)
      },
      deep: true
    }
  },
  mounted () {
    if (this.inputOptionsForm.options.default === null) {
      this.inputOptionsForm.options.default = []
    }
    if (this.inputOptionsForm.options.default.length !== 0) {
      this.selected = this.inputOptionsForm.options.default
    }
    this.hostFilter = ''
  },
  methods: {
    rehandleSelectChange (value, { selectedRowData }) {
      this.selected = selectedRowData
      this.selectedPagination.total = this.selected.length
    },
    getCMDBHosts (postData) {
      return new Promise((resolve, reject) => {
        cmdbSingleModelAPI(postData, cmdbSingleModelPath, 'COMPUTER_SERVER').then(response => {
          const { data } = response
          this.data = data.data.list
          this.pagination.current = data.data.page
          this.pagination.pageSize = data.data.page_size
          this.pagination.total = data.data.total
        }).catch(error => {
          this.$message.error(error.data.message)
        })
      })
    },
    async onPageChange (pageInfo) {
      const postData = {
        pageData: {
          page: pageInfo.current,
          rowsPerPage: pageInfo.pageSize
        },
        filterData: this.hostFilter
      }
      await this.getCMDBHosts(postData)
    },
    async onRequest () {
      const postData = {
        pageData: {
          page: this.pagination.current,
          rowsPerPage: this.pagination.pageSize
        },
        filterData: this.hostFilter
      }
      await this.getCMDBHosts(postData)
    },
    searchHost () {
      const postData = {
        pageData: {
          page: this.pagination.current,
          rowsPerPage: this.pagination.pageSize
        },
        filterData: this.hostFilter
      }
      this.getCMDBHosts(postData)
    },
    selectedEnd () {
      this.inputOptionsForm.options.default = this.selected
      this.selectHost = false
    }
  }
}
</script>
