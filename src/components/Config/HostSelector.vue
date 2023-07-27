<template>
  <div style="padding: 15px">
    <t-row align="center">
      <div style="border: 1px solid #165DFF; height: 14px;"></div>
      <span style="margin-left: 10px">设备配置</span>
    </t-row>
    <t-button variant="outline" theme="default" style="margin-top: 25px;" @click="dialog.host = true">
      <t-row align="center">
        <mod-icon class="mr-2" name="add"></mod-icon>
        <span>新增设备</span>
      </t-row>
    </t-button>
    <div style="margin-top: 15px">
      <t-table
        hover resizable selectOnRowClick bordered
        row-key="id"
        size="small"
        table-layout="fixed"
        cell-empty-content="-"
        :empty="table.empty"
        max-height="600"
        :data="table.data"
        :columns="table.column"
        :loading="table.loading"
        :selected-row-keys="table.select"
        @select-change="onSelectChange"
      >
        <template #slot-field="{ row, col }">
          {{ formatField(dict[col.colKey], 'label', row[col.colKey]) }}
        </template>
        <template #operator="{ row }">
          <t-popconfirm theme="default" content="确认删除设备吗" @confirm="remove(row)">
            <t-button variant="text" theme="danger">删除</t-button>
          </t-popconfirm>
<!--          <t-button variant="text" theme="primary" @click="remove(row)">删除</t-button>-->
        </template>
      </t-table>
    </div>
    <t-dialog v-if="dialog.host" header="设备选择" placement="center" width="90%" preventScrollThrough  :visible.sync="dialog.host" :footer="false">
      <Host :hostList.sync="hostList" @hostCheck="hostCompCtl"></Host>
    </t-dialog>
  </div>
</template>

<script>
import { formatField } from '@/utils/inops/formatUtils'
import { getDictList, pageList } from '@/utils/inops/u'
import Host from '@/components/Selector/Host'
export default {
  name: 'HostSelector',
  components: { Host },
  props: {
    list: {
      type: Array,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      dict: {
        resourcePool: [],
        hostRoom: [],
        hostType: [],
        hostMfgr: [],
        hostSource: [],
        sysArea: [],
        major: []
      },
      condition: {
        hostName: '',
        osIp: '',
        bmcIp: ''
      },
      hostList: [],
      table: {
        ref: 'tbHost',
        empty: '无纳管资源数据',
        loading: false,
        select: [],
        data: [],
        infoData: [],
        column: [
          { colKey: 'hostName', title: '设备名称', align: 'left', ellipsis: true, ellipsisTitle: true, sortType: 'all', width: 80 },
          { colKey: 'osIp', title: '管理IP', align: 'left', ellipsis: true, ellipsisTitle: true, sortType: 'all', width: 80 },
          { colKey: 'bmcIp', title: '硬管IP', align: 'left', ellipsis: true, ellipsisTitle: true, sortType: 'all', width: 80 },
          { colKey: 'operator', title: '操作', width: '80', align: 'center', fixed: 'right' }
        ]
      }, // 表格
      pages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 30,
        align: 'right'
      }, // 分页
      dialog: {
        host: false
      }
    }
  },
  async mounted () {
    await this.getDict()
    this.initData()
  },
  watch: {
    hostList: {
      handler (newVal) {
        this.$emit('update:list', newVal)
      }
    }
  },
  methods: {
    formatField,
    async getDict () {
      const keys = Object.keys(this.dict)
      for (const item of keys) {
        this.dict[item] = await getDictList(item)
      }
    },
    initData () {
      this.hostList = JSON.parse(JSON.stringify(this.list))
      this.table.data = JSON.parse(JSON.stringify(this.list))
      // this.table.infoData = JSON.parse(JSON.stringify(this.list))
      // this.setHostItem()
    },
    onApply () {
      const list = this.hostList.filter(item => {
        return item.hostName.indexOf(this.condition.hostName) > -1
      })
      const list2 = list.filter(item => {
        if (item.osIp) {
          return item.osIp.indexOf(this.condition.osIp) > -1
        }
      })
      const list3 = list2.filter(item => {
        if (item.bmcIp) {
          return item.bmcIp.indexOf(this.condition.bmcIp) > -1
        }
      })
      this.table.data = list3
      // this.table.infoData = list3
      // this.setHostItem()
    },
    onReset () {
      this.condition = {
        hostName: '',
        osIp: '',
        bmcIp: ''
      }
    },
    remove (row) {
      const index = this.hostList.findIndex(item => item.id === row.id)
      this.hostList.splice(index, 1)
      const index2 = this.table.infoData.findIndex(item => item.id === row.id)
      this.table.data.splice(index2, 1)
    },
    hostCompCtl (data) {
      this.hostList = data
      this.table.data = data
      this.dialog.host = false
    },
    /**
     * 设备列表选择
     * @param value 选择项
     * @param selectedRowData 选择行数据
     * @param type 选择类型 check uncheck check_all_box
     * @param currentRowKey 当前行id
     */
    onSelectChange (value) {
      this.table.select = value
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-dialog__body
  max-height: 850px !important
</style>
