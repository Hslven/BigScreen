<template>
  <div>
    <content-header></content-header>
    <div class="bg-mod-card rounded-sm">
      <t-row>
        <t-col :flex="3">
        </t-col>
        <t-col :flex="2">
          <div style="float: right" class="m-4">
            <t-button variant="outline" class="mr-4" @click="columnControllerVisible = true">
              <setting-icon slot="icon" />
              列配置
            </t-button>
            <t-button variant="outline"  @click="expanded = !expanded" class="mr-4">
              <search-icon slot="icon" />
              高级搜索
            </t-button>
            <t-button shape="circle" variant="outline" class="mr-4" @click="exportEvent">
              <cloud-download-icon slot="icon" />
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
        <div>
          <t-config-provider :globalConfig="globalLocale">
            <t-table
              rowKey="name"
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
            </t-table>
          </t-config-provider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'
import { cmnetIpTable } from '@/dict/columns'
import { parseColumnToDict, parseColumnToForm } from '@/utils/index'
import { cmdbInstanceSearchlAPI } from '@/api/openapi/index'
import { SearchIcon, CloudDownloadIcon, SettingIcon } from 'tdesign-icons-vue'
import { cloneDeep } from 'lodash'

export default {
  name: 'cmnetIp',
  components: {
    ContentHeader,
    SearchIcon,
    CloudDownloadIcon,
    SettingIcon
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
      columns: cmnetIpTable.columns,
      visibleColumns: cmnetIpTable.visibleColumns,
      visibleForm: parseColumnToForm(cmnetIpTable.columns),
      columnsDict: parseColumnToDict(cmnetIpTable.columns),
      globalLocale: {
        table: {
          sortIcon: (h) => h && <mod-icon name="arrow_drop_down" size="22px" style="color: #cccccc !important" />
        }
      }
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
        const params = {
          query: {},
          fields: {
            name: true,
            ip: true,
            resource_type: true,
            type: true,
            city: true,
            data_src_type: true,
            desc: true,
            domain_name: true,
            project_period: true,
            purpose: true,
            remark: true,
            related_fwnat_ip: true,
            belong_hardware: true,
            related_logic_port: true
          },
          page: 1,
          page_size: 1000
        }
        cmdbInstanceSearchlAPI(params, 'PUBLIC_CMNET_IP').then(response => {
          const { data } = response
          if (data.code === 0) {
            this.pagination.total = data.data.total
            this.data = data.data.list.map((item) => {
              item.belong_hardware = item.belong_hardware.map(item => { return item.name }).join(';')
              item.related_fwnat_ip = item.related_fwnat_ip.map(item => { return item.name }).join(';')
              item.related_logic_port = item.related_logic_port.map(item => { return item.name }).join(';')
              return {
                name: item.name,
                ip: item.ip,
                resource_type: item.resource_type,
                type: item.type,
                city: item.city,
                data_src_type: item.data_src_type,
                desc: item.desc,
                domain_name: item.domain_name,
                project_period: item.project_period,
                purpose: item.purpose,
                remark: item.remark,
                related_fwnat_ip: item.related_fwnat_ip,
                belong_hardware: item.belong_hardware,
                related_logic_port: item.related_logic_port
              }
            })
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
      this.visibleForm = parseColumnToForm(this.columns)
    },
    exportEvent () {
      const header = []
      this.visibleColumns.forEach((val, index) => {
        header.push(this.columnsDict[val])
      })
      require.ensure([], () => {
        const { exportJsonToExcel } = require('@/utils/excel/Export2Excel')
        const tabledata = this.formatJson(this.visibleColumns, this.data)
        exportJsonToExcel(header, tabledata, '公网CMNET_IP数据')
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
