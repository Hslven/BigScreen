<template>
  <div class="bg-mod-card" style="padding: 15px; border-radius: 5px">
    <div style="font-weight: bold; font-size: 16px"> 光模块AI预测 </div>
    <div style="margin-top: 15px; color: #165DFF; font-weight: bold; font-size: 14px">算法参数配置</div>
    <t-row class="mt-5">
      <span class="mr-3">拟合范围：</span>
      <t-select v-model="infoParam.intime" :options="[{ label: '最近三天', value: '3' }, { label: '最近七天', value: '7' }]" clearable filterable :minCollapsedNum="1" style="width: 400px"></t-select>
    </t-row>
    <t-row class="mt-5">
      <span class="mr-3">预测时间：</span>
      <t-select v-model="infoParam.intime" :options="[{ label: '未来七天', value: '7' }, { label: '未来半个月', value: '15' }, { label: '未来一个月', value: '30' }]" clearable filterable :minCollapsedNum="1" style="width: 400px"></t-select>
    </t-row>
    <div style="font-weight: bold; font-size: 16px"> 选择光模块 </div>
    <t-form :data="condition" ref="form" @submit="submit">
      <t-row>
        <t-col :span="3">
          <t-form-item labelAlign="left" label="设备名" name="hostName">
            <t-input v-model.trim="condition.hostName" clearable style="width: 80%"></t-input>
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
        max-height="500"
        empty="暂无设备光模块收发光数据信息"
        :data="table.infoData"
        :columns="table.column"
        :loading="table.loading"
        :selected-row-keys="table.select"
        style="font-size: 12px"
        @select-change="onSelectChange"
      >
        <template #receivedPower="{ row }">
          {{ formatDecimal(row.receivedPower)}}
        </template>
        <template #transmitPower="{ row }">
          {{ formatDecimal(row.transmitPower)}}
        </template>
      </t-table>
    </div>
    <div style="margin-top: 15px">
      <t-pagination
        v-model="pages.current"
        show-sizer
        show-jumper
        size="small"
        :total="pages.total"
        :page-size.sync="pages.size"
        :page-size-options="pages.list"
        @change="pagesLimit"
      />
    </div>
    <t-row justify="end" style="margin-top: 15px">
      <t-button theme="primary" @click="predictAnalysis">提交</t-button>
    </t-row>
    <t-dialog header="结果" placement="center" width="90%" preventScrollThrough v-if="dialog" :visible.sync="dialog" :footer="false">
      <t-row justify="end" style="margin-top: 15px;">
        <t-button variant="outline" @click="exportResult">导出结果</t-button>
      </t-row>
      <div style="margin-top: 15px">
        <vxe-table
          class="text-black"
          stripe
          auto-resize
          keep-source
          highlight-hover-row
          highlight-current-row
          highlight-hover-column
          highlight-current-column
          resizable
          ref="predictTable"
          id="predictTable"
          row-id='id'
          empty-text="暂无光模块预测信息！"
          border="default"
          max-height="500"
          size="mini"
          :tooltip-config="{showAll: true}"
          :loading="infoTable.loading"
          :seq-config="{startIndex: (infoPages.current - 1) * infoPages.size }"
          :checkbox-config="{reserve: true}"
          :data="infoTable.infoDataPages"
        >
          <vxe-table-column
            v-for="(config, index) in infoTable.column"
            :key="index" v-bind="config"
          >
            <template v-slot="{ row }" v-if="config.field === 'receivedPowerForecast'">
              <span>{{row.receivedPowerForecast ? row.receivedPowerForecast : row.receivedPower | formatValue }}</span>
            </template>
            <template v-slot="{ row }" v-else-if="config.field === 'transmitPowerForecast'">
              <span>{{row.transmitPowerForecast ? row.transmitPowerForecast : row.transmitPower | formatValue }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="result" title="验收结果" align="center" width="150px">
            <template v-slot="{ row }">
                  <span :class="formatValueClass(row)">
                    {{ formatValue(row) }}
                  </span>
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
      <div style="margin-top: 15px">
        <vxe-pager
          class="q-mt-md"
          background
          size="small"
          :current-page="infoPages.current"
          :page-size="infoPages.size"
          :total="infoPages.total"
          :page-sizes="infoPages.pageSizeList"
          :page-count=5
          :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"
          @page-change="predictPageLimit">
        </vxe-pager>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import { getPageForecastAPI } from '@/api/monitor/opticalLink'
import { formatDate } from '@/utils/inops/dateUtils'
import { pageList } from '@/utils/inops/u'
export default {
  name: 'optical',
  filters: {
    formatValue (value) {
      return value.toFixed(2)
    }
  },
  data () {
    return {
      hosts: [],
      condition: {
        forecastType: '40GE',
        resourcePool: '',
        hostName: '',
        portName: '',
        date: '',
        orderAsc: '',
        orderDesc: ''
      },
      resourcePoolOptions: [],
      predict: '',
      table: {
        loading: false,
        select: [],
        data: [],
        filterData: [],
        infoData: [],
        column: [
          { colKey: 'row-select', title: '选择', type: 'multiple', width: 50 },
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'hostName', title: '设备名称', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'portName', title: '端口', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'receivedPower', title: '光模块接收功率', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'transmitPower', title: '光模块发送功率', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true }
        ]
      },
      pages: {
        pageSizeList: pageList,
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      infoTable: {
        loading: false,
        infoData: [],
        infoDataPages: [],
        column: [
          // { type: 'checkbox', align: 'center', width: '40' },
          { type: 'seq', title: '序号', align: 'center', width: '50' },
          { field: 'hostName', title: '设备名称', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          { field: 'portName', title: '端口', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          { field: 'receivedPower', title: '光模块接收功率', align: 'center', formatter: this.formatDecimal, showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          { field: 'receivedPowerForecast', title: '光模块接收功率预测值', align: 'center', formatter: this.formatDecimal, showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          { field: 'transmitPower', title: '光模块发送功率', align: 'center', formatter: this.formatDecimal, showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          { field: 'transmitPowerForecast', title: '光模块发送功率预测值', align: 'center', formatter: this.formatDecimal, showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true }
        ]
      },
      infoPages: {
        pageSizeList: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      selectHost: [],
      dialog: false,
      infoParam: {
        received: '-10',
        transmit: '-7',
        intime: '3',
        predit: '7'
      }
    }
  },
  async mounted () {
    this.hosts = this.$route.query.hosts
    this.initDate()
    // await this.getResourcePool()
    await this.getPageForecast()
  },
  methods: {
    initDate () {
      const yesterDay = new Date().setTime(new Date().getTime() - 3600 * 1000 * 24)
      this.condition.date = formatDate(yesterDay)
    },
    async getPageForecast () {
      this.table.loading = true
      this.table.data = []
      for (const item of this.hosts) {
        const data = {
          forecastType: this.$route.query.major === '网络' ? '40GE' : '10GE',
          resourcePool: item.resourcePool,
          hostName: item.hostName,
          portName: '',
          date: this.condition.date,
          orderAsc: '',
          orderDesc: '',
          page: 1,
          pageSize: 1000
        }
        await getPageForecastAPI(data).then(async res => {
          const { data } = res
          if (data.code === 0) {
            data.data.records.forEach(value => {
              this.table.data.push(value)
            })
          }
        })
      }
      this.table.filterData = this.table.data
      this.setPages()
      this.table.loading = false
    },
    submit () {
      this.pages.current = 1
      this.pages.size = 10
      this.table.filterData = this.table.data.filter(item => {
        return item.hostName.indexOf(this.condition.hostName) > -1
      })
      this.setPages()
    },
    pagesLimit ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.setPages()
    },
    predictPageLimit ({ currentPage, pageSize }) {
      this.pages.current = currentPage
      this.pages.size = pageSize
      this.setInfoPages()
    },
    async predictAnalysis () {
      if (this.selectHost.length === 0) {
        this.$message.warning({ content: '请选择预测设备', placement: 'center' })
        return false
      } else if (!this.infoParam.received && !this.infoParam.transmit) {
        this.$message.warning({ content: '请输入收发光功率阈值', placement: 'center' })
        return false
      } else {
        this.infoTable.infoData = []
        for (const item of this.selectHost) {
          const data = {
            forecastType: this.$route.query.major === '网络' ? '40GE' : '10GE',
            resourcePool: item.resourcePool,
            hostName: item.hostName,
            portName: item.portName,
            // date: '2022-09-18',
            date: this.condition.date,
            orderAsc: '',
            orderDesc: '',
            page: 1,
            pageSize: 10
          }
          await getPageForecastAPI(data).then(res => {
            const { data } = res
            if (data.code === 0) {
              data.data.records.forEach(item => {
                this.infoTable.infoData.push(item)
              })
            }
          })
        }
        this.setInfoPages()
      }
      this.dialog = true
    },
    setPages () {
      this.pages.total = this.table.filterData.length
      this.table.infoData = this.table.filterData.slice((this.pages.current - 1) * this.pages.size, this.pages.current * this.pages.size)
      const index = this.pages.pageSizeList.findIndex(item => item.label === '全部')
      this.pages.pageSizeList[index].value = this.pages.total
    },
    setInfoPages () {
      this.infoPages.total = this.infoTable.infoData.length
      this.infoTable.infoDataPages = this.infoTable.infoData.slice((this.infoPages.current - 1) * this.infoPages.size, this.infoPages.current * this.infoPages.size)
      const index = this.infoPages.pageSizeList.findIndex(item => item.label === '全部')
      this.infoPages.pageSizeList[index].value = this.infoPages.total
    },
    hostSelect ({ row, checked }) {
      if (checked) {
        const index = this.table.infoData.findIndex(item => item.id === row.id)
        this.selectHost.push(this.table.infoData[index])
      } else {
        const index = this.selectHost.findIndex(item => item.id === row.id)
        this.selectHost.splice(index, 1)
      }
    },
    selectAll ({ records, checked }) {
      if (checked) {
        records.forEach(item => {
          const index = this.table.infoData.findIndex(value => value.id === item.id)
          this.selectHost.push(this.table.infoData[index])
        })
        this.selectHost = [...new Set(this.selectHost)]
      } else {
        this.table.infoData.forEach(item => {
          const index = this.selectHost.findIndex(value => value.id === item.id)
          this.selectHost.splice(index, 1)
        })
      }
    },
    formatDecimal ({ cellValue }) {
      return cellValue ? cellValue.toFixed(2) : cellValue
    },
    formatValueClass (row) {
      if (row.receivedPowerForecast !== -40 && row.transmitPowerForecast !== -40) {
        if (row.receivedPowerForecast > this.infoParam.received && row.transmitPowerForecast > this.infoParam.transmit) {
          return 'text-positive'
        } else {
          return 'text-red-7'
        }
      } else {
        return 'text-grey'
      }
    },
    formatValue (row) {
      if (row.receivedPowerForecast !== -40 && row.transmitPowerForecast !== -40) {
        if (row.receivedPowerForecast > this.infoParam.received && row.transmitPowerForecast > this.infoParam.transmit) {
          return '通过'
        } else {
          return '未通过'
        }
      } else {
        return '未启用'
      }
    },
    exportResult () {
      this.$refs.predictTable.exportData({
        filename: '光模块验收结果',
        type: 'csv',
        isHeader: true,
        isFooter: true,
        data: this.infoTable.infoData,
        columnFilterMethod ({ column }) {
          return ['hostName', 'portName', 'receivedPower', 'receivedPowerForecast', 'transmitPower', 'transmitPowerForecast', 'result'].includes(column.property)
        }
      })
    },
    onSelectChange (value) {
      this.table.select = value
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .q-field__control
  height: 32px !important
/deep/ .q-field__marginal
  height: 32px !important
/deep/ .q-field--auto-height.q-field--dense .q-field__control
  min-height: 32px !important
/deep/ .q-field--auto-height.q-field--dense .q-field__native
  min-height: 32px !important
</style>
