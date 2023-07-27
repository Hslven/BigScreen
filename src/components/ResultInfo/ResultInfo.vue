<template>
  <div class="bg-mod-card" style="padding: 15px">
    <t-row>
      <t-col :span="3" v-for="(item, index) in filed" :key = index>
        <t-row align="center">
          <span style="margin-right: 15px">{{ item.title }}</span>
          <t-input v-model.trim="condition[item.value]" clearable :type="item.input" style="width: 60%"></t-input>
        </t-row>
      </t-col>
      <t-col :span="3">
        <t-space size="15px">
          <t-button theme="primary" @click="onApply">查询</t-button>
          <t-button theme="default" @click="onReset">重置</t-button>
        </t-space>
      </t-col>
    </t-row>
    <div style="margin-top: 15px">
      <t-table
        stripe bordered hover showHeader resizable
        rowKey="id"
        size="small"
        table-layout="fixed"
        cellEmptyContent="-"
        :empty="table.empty"
        :data="table.data"
        :columns="table.column"
        :loading="table.loading"
        :selected-row-keys="table.select"
        style="font-size: 12px"
      >
        <template #slot-status="{ row, col }">
          {{ formatField(dict.taskStatus, 'label', row[col.colKey]) }}
        </template>
        <template #slot-msg="{ row, col }">
          <span style="cursor: pointer; text-decoration: underline; color: #165DFF"
                @click="showInfo(col.title, row[col.colKey])">{{ row[col.colKey] }}</span>
        </template>
        <template #operator="{ row }">
          <t-button variant="text" theme="primary" @click="downloadFile('single', row.id)">下载</t-button>
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
    <t-dialog v-if="dialog" preventScrollThrough destroyOnClose placement="center" width="640px" :header="title" :footer="false" :visible.sync="dialog">
      <div class="scrollbar-style msg">
        <pre>{{ msg }}</pre>
      </div>
      <t-divider></t-divider>
      <t-row justify="end">
        <t-button variant="text" theme="primary" @click="dialog = false">退出</t-button>
      </t-row>
    </t-dialog>
  </div>
</template>

<script>
import { pageList, getDictList } from '@/utils/inops/u'
import { formatField } from '@/utils/inops/formatUtils'
import { onDownTResult, onMonitorDTResult } from '@/utils/inops/file'
export default {
  name: 'ResultInfo',
  props: {
    fileType: {
      type: String,
      default: ''
    },
    value: {
      type: Object
    },
    infoData: {
      type: Array
    },
    pageInfo: {
      type: Object
    }
  },
  data () {
    return {
      dict: {
        resourcePool: [],
        taskStatus: []
      },
      filed: [
        { title: '设备名称', value: 'hostName', type: 'input', input: 'text' },
        { title: '设备IP', value: 'hostIp', type: 'input', input: 'text' },
        { title: '执行步骤', value: 'taskNum', type: 'input', input: 'number' }
      ],
      condition: {
        hostName: '',
        hostType: '',
        taskNum: ''
      },
      table: {
        ref: 'tbHost',
        empty: '暂无任务执行情况',
        loading: false,
        data: [],
        column: [
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'hostName', title: '主机名称', align: 'left', ellipsis: true },
          { colKey: 'hostIp', title: '主机Ip', align: 'left', ellipsis: true },
          { colKey: 'taskInfo', title: '执行步骤', align: 'center', ellipsis: true },
          { colKey: 'status', title: '执行状态', align: 'center', ellipsis: true, cell: 'slot-status' },
          { colKey: 'detailMsg', title: '执行详情', align: 'center', ellipsis: true, cell: 'slot-msg' },
          { colKey: 'orgMsg', title: '执行日志', align: 'center', ellipsis: true, cell: 'slot-msg' },
          { colKey: 'operator', title: '操作', width: 80, align: 'center' }
        ]
      },
      pages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 30,
        align: 'right'
      },
      dialog: false,
      title: '',
      msg: ''
    }
  },
  async mounted () {
    await this.getDict()
    this.initData()
  },
  methods: {
    formatField,
    initData () {
      this.table.data = this.infoData
      Object.assign(this.pages, this.pageInfo)
    },
    async getDict () {
      for (const item of Object.keys(this.dict)) {
        this.dict[item] = await getDictList(item)
      }
    },
    onApply () {
      this.$emit('onApply', this.condition)
    },
    onReset () {
      this.condition = {
        hostName: '',
        hostType: '',
        taskNum: ''
      }
    },
    onPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      const obj = {
        size: pageSize,
        current: current
      }
      this.$emit('onPages', obj)
    },
    showInfo (type, msg) {
      this.title = type
      this.msg = msg
      this.dialog = true
    },
    downloadFile (type, id) {
      if (this.fileType === 'monitor') {
        onMonitorDTResult(type, id)
      } else {
        onDownTResult(type, this.fileType, id)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .scrollbar-style::-webkit-scrollbar
  /*滚动条整体样式*/
  width : 6px !important /*高宽分别对应横竖滚动条的尺寸*/
/deep/ .scrollbar-style::-webkit-scrollbar-thumb
  /*滚动条里面小方块*/
  border-radius: 5px !important
  background: #90caf9 !important
.msg
  color: #ffffff
  overflow-y: scroll
  height: 550px
  padding: 15px
pre
  white-space: pre-wrap
  white-space: -moz-pre-wrap
  white-space: -pre-wrap
  white-space: -o-pre-wrap
  word-wrap: break-word
/deep/ .t-table.t-size-s td
  padding: 3px 10px
/deep/ .t-dialog__body
  background-color: #000000
/deep/ .t-divider
  margin: 8px 0px
</style>
