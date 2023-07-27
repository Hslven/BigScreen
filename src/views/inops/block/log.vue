<template>
  <div class="bg-mod-card" style="padding: 15px">
    <t-form :data="condition" ref="form" @submit="onApply" @reset="onReset">
      <t-row>
        <t-col class="mb-5" :span="3" v-for="(item, index) in filed" :key="index">
          <t-form-item labelAlign="left" :label="item.name" :name="item.value">
            <t-input v-if="item.type === 'input'" v-model.trim="condition[item.value]" clearable style="width: 80%"></t-input>
            <t-select v-if="item.type === 'select'" v-model="condition[item.value]" :options="dict[item.value]" clearable filterable style="width: 80%"></t-select>
            <t-date-picker v-if="item.type === 'date'" v-model="condition[item.value]" allow-input clearable style="width: 80%"/>
          </t-form-item>
        </t-col>
        <t-col :span="3">
          <t-row>
            <t-button class="mr-3" theme="primary" type="submit">提交</t-button>
            <t-button theme="default" variant="base" type="reset">重置</t-button>
          </t-row>
        </t-col>
      </t-row>
    </t-form>
    <div style="margin-top: 15px">
      <t-table
        hover resizable
        row-key="id"
        size="small"
        table-layout="fixed"
        cell-empty-content="-"
        max-height="500"
        :empty="table.empty"
        :data="table.data"
        :columns="table.column"
        :loading="table.loading"
        style="font-size: 12px"
      >
        <template #blockStatus="{ row }">
          {{ formatField(dict.blockState, 'label', row.blockStatus) }}
        </template>
        <template #callbackStatus="{ row }">
          {{ formatField(dict.blockCallbackState, 'label', row.callbackStatus) }}
        </template>
        <template #ipType="{ row }">
          <t-tag :theme="row.ipType === '0' ? 'primary' : 'success'" variant="outline">{{ row.ipType === '0' ? 'IPV4' : 'IPV6' }}</t-tag>
        </template>
        <template #actionType="{ row }">
          <span :style="{ color: row.actionType === 'deny' ? '#AAAEB7' : '#2BA471' }">{{ row.actionType === 'deny' ? '封堵' : '解封' }}</span>
        </template>
        <template #autoBlock="{ row }">
          <span>{{ row.autoBlock === '0' ? '手动封堵' : '自动封堵' }}</span>
        </template>
        <template #policyFailTime="{ row }">
          <span>{{ row.policyFailTime | dateFilter }}</span>
        </template>
        <template #operator="{ row }">
          <t-button theme="primary" size="small" @click="showRecords(row)">查看记录</t-button>
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
        @change="onPages"
      />
    </div>
    <t-dialog v-if="dialog.record" preventScrollThrough destroyOnClose placement="top" width="80%" header="封堵记录" :footer="false" :visible.sync="dialog.record">
      <div>
        <t-table
          hover resizable
          row-key="id"
          size="small"
          table-layout="fixed"
          cell-empty-content="-"
          max-height="500"
          :empty="record.empty"
          :data="record.data"
          :columns="record.column"
          :loading="record.loading"
          style="font-size: 12px"
        >
          <template #blockStatus="{ row }">
            {{ formatField(dict.blockState, 'label', row.blockStatus) }}
          </template>
          <template #hostMfgr="{ row }">
            {{ formatField(dict.hostMfgr, 'label', row.hostMfgr) }}
          </template>
          <template #action="{ row }">
            <span :style="{ color: row.action === 'deny' ? '#AAAEB7' : '#2BA471' }">{{ row.action === 'deny' ? '封堵' : '解封' }}</span>
          </template>
        </t-table>
      </div>
      <div style="margin-top: 15px">
        <t-pagination
          v-model="recordPage.current"
          show-sizer
          show-jumper
          size="small"
          :total="recordPage.total"
          :page-size.sync="recordPage.size"
          :page-size-options="recordPage.list"
          @change="onRecordPage"
        />
      </div>
    </t-dialog>
   </div>
</template>

<script>
import { formatField } from '@/utils/inops/formatUtils'
import { getDictList, pageList } from '@/utils/inops/u'
import { listPageAPI } from '@/api/inops/block/records'
import { formatTime } from '@/utils/inops/dateUtils'
import { getFirewallDetailAPI } from '@/api/inops/block/detail'

export default {
  name: 'log',
  filters: {
    dateFilter (val) {
      if (val) {
        return formatTime(val)
      } else {
        return ''
      }
    }
  },
  data () {
    return {
      dict: {
        list: ['hostMfgr', 'blockState', 'blockCallbackState'],
        ipType: [{ label: 'IPV4', value: '0' }, { label: 'IPV6', value: '1' }],
        hostMfgr: [],
        blockState: [],
        blockCallbackState: [],
        actionType: [{ label: '封堵', value: 'deny' }, { label: '解封', value: 'permit' }],
        autoBlock: [{ label: '手动封堵', value: '0' }, { label: '自动封堵', value: '1' }]
      },
      filed: [
        {
          name: '任务单号',
          value: 'taskCode',
          type: 'input'
        },
        {
          name: '源IP',
          value: 'sourceIp',
          type: 'input'
        },
        {
          name: 'IP类型',
          value: 'ipType',
          type: 'select'
        },
        {
          name: '状态',
          value: 'blockStatus',
          type: 'select'
        },
        {
          name: '操作人',
          value: 'sourceFor',
          type: 'input'
        },
        {
          name: '动作',
          value: 'actionType',
          type: 'select'
        },
        {
          name: '是否自动封堵',
          value: 'autoBlock',
          type: 'select'
        },
        {
          name: '操作时间',
          value: 'operateTime',
          type: 'date'
        }
      ],
      condition: {
        taskCode: '',
        sourceIp: '',
        ipType: '',
        blockStatus: '',
        sourceFor: '',
        actionType: '',
        autoBlock: '',
        operateTime: ''
      },
      table: {
        ref: 'tb_info',
        empty: '暂未无封堵IP日志',
        loading: false,
        data: [],
        column: [
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'taskCode', title: '任务单号', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true, cell: 'slot-user' },
          { colKey: 'taskSource', title: '需求来源', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'sourceIp', title: '源IP', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'ipType', title: 'IP类型', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'actionType', title: '动作', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'autoBlock', title: '是否自动封堵', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'sourceFor', title: '操作原因', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'operatorName', title: '操作人', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'systemCode', title: '业务系统', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'createDate', title: '操作时间', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'policyFailTime', title: '策略失效时间', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'blockStatus', title: '封堵状态', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'callbackStatus', title: '反馈状态', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'operator', title: '操作', align: 'center' }
        ]
      },
      pages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 30,
        align: 'right'
      },
      dialog: {
        record: false
      },
      record: {
        ref: 'tb_record',
        empty: '暂无记录信息',
        loading: false,
        data: [],
        column: [
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'hostName', title: '设备', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true, cell: 'slot-user' },
          { colKey: 'bmcIp', title: 'IP', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'hostMfgr', title: '厂家', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'hostModel', title: '型号', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'action', title: '动作', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'sourceIp', title: '源IP', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'blockStatus', title: '操作状态', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true }
        ]
      },
      recordPage: {
        list: pageList,
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      taskCode: ''
    }
  },
  async mounted () {
    await this.getDict()
    this.getData()
  },
  methods: {
    formatField,
    async getDict () {
      for (const item of this.dict.list) {
        this.dict[item] = await getDictList(item)
      }
    },
    getData () {
      const params = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      listPageAPI(params, this.condition).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.table.data = data.data.records
          const { total, size, current } = data.data
          this.pages = Object.assign(this.pages, { total, size, current })
          this.pages.list[this.pages.list.length - 1].value = total
          this.table.loading = false
        }
      })
    },
    getDetail () {
      this.record.loading = true
      const params = {
        pageSize: this.recordPage.size,
        pageNum: this.recordPage.current
      }
      let data = {
        taskCode: this.taskCode
      }
      data = Object.assign(data, this.condition)
      getFirewallDetailAPI(params, data).then(async res => {
        const { data } = res
        if (data.code === 200) {
          const records = []
          await data.data.records.forEach(item => {
            const { hostName, bmcIp, hostMfgr, hostModel } = item.firewall
            const { action, sourceIp, blockStatus } = item
            const obj = Object.assign({ hostName, bmcIp, hostMfgr, hostModel }, { action, sourceIp, blockStatus })
            records.push(obj)
          })
          this.record.data = records
          const { total, size, current } = data.data
          this.recordPage = Object.assign(this.pages, { total, size, current })
          this.recordPage.list[this.recordPage.list.length - 1].value = total
          this.record.loading = false
          this.dialog.record = true
        }
      })
    },
    onApply () {
      this.getData()
    },
    onReset () {
      this.condition = {
        taskCode: '',
        sourceIp: '',
        ipType: '',
        blockStatus: '',
        sourceFor: '',
        actionType: '',
        autoBlock: '',
        operateTime: ''
      }
    },
    onPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.getData()
    },
    showRecords (row) {
      this.taskCode = row.taskCode
      this.getDetail()
    },
    onRecordPage ({ current, pageSize }) {
      this.recordPage.current = current
      this.recordPage.size = pageSize
      this.getDetail()
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
