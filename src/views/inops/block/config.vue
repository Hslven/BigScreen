<template>
  <div class="bg-mod-card" style="padding: 15px">
    <div class="pl-3" style="border-left: 4px solid #165DFF">
      封堵设备
    </div>
    <t-row class="mt-5 row">
      <t-button variant="outline" theme="default" @click="dialog.host = true">
        <t-row align="center">
          <mod-icon name="add"></mod-icon>
          <span>添加设备</span>
        </t-row>
      </t-button>
      <t-col flex="auto">
        <t-row justify="end">
          <t-button theme="primary" @click="saveHost">保存</t-button>
        </t-row>
      </t-col>
    </t-row>
    <div style="margin-top: 15px">
      <t-table
        hover resizable
        row-key="id"
        size="small"
        table-layout="fixed"
        cell-empty-content="-"
        :max-height="table.maxHeight"
        :empty="table.empty"
        :data="table.data"
        :columns="table.column"
        :loading="table.loading"
        style="font-size: 12px"
      >
        <template #resourcePool="{ row }">
          <t-tag theme="primary" variant="outline">{{ formatField(dict.resourcePool, 'label', row.resourcePool) }}</t-tag>
        </template>
        <template #hostMfgr="{ row }">
          <t-tag :theme="hostMfgrAndModel.includes(`${row.hostMfgr}${row.hostModel}`) ? 'success' : 'danger'" variant="outline">{{ formatField(dict.hostMfgr, 'label', row.hostMfgr) }}</t-tag>
        </template>
        <template #hostModel="{ row }">
          <t-tag :theme="hostMfgrAndModel.includes(`${row.hostMfgr}${row.hostModel}`) ? 'success' : 'danger'" variant="outline">{{ row.hostMfgr }}</t-tag>
        </template>
        <template #operator="{ row }">
          <t-popconfirm theme="default" content="确认删除任务吗" @confirm="delHost(row.isRecord ? 'id' : 'hostId', row.id)">
            <t-button variant="text" theme="danger" size="small">删除</t-button>
          </t-popconfirm>
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
    <t-divider></t-divider>
    <div class="pl-3 mt-5" style="border-left: 4px solid #165DFF">
      封堵策略
    </div>
    <div class="mt-5">
      <t-row>
        <t-button theme="primary" @click="insertEvent(-1)">新增</t-button>
      </t-row>
      <div style="margin-top: 15px">
        <t-table
          hover resizable selectOnRowClick multipleSort
          row-key="id"
          size="small"
          table-layout="fixed"
          cell-empty-content="-"
          :max-height="strategy.maxHeight"
          :empty="strategy.empty"
          :data="strategy.data"
          :columns="getCoulumns"
          :loading="strategy.loading"
          style="font-size: 12px"
        >
          <template #job="{ row }">
            <t-button class="mr-3" variant="text" theme="primary" size="small" @click="onEdit(row)">编辑脚本</t-button>
            <t-button variant="text" theme="primary" size="small" @click="onSelect(row)">选择脚本</t-button>
          </template>
          <template #operator="{ row }">
            <t-button class="mr-3" variant="text" theme="primary" size="small" @click="onSaveStrategy(row)">保存</t-button>
            <t-button variant="text" theme="danger" size="small" @click="onDelStrategy(row.isNewRecord ? 'newRecord' : 'record', row)">删除</t-button>
          </template>
        </t-table>
      </div>
      <div style="margin-top: 15px">
        <t-pagination
          v-model="strategyPage.current"
          show-sizer
          show-jumper
          size="small"
          :total="strategyPage.total"
          :page-size.sync="strategyPage.size"
          :page-size-options="strategyPage.list"
          @change="onStrategyPage"
        />
      </div>
    </div>
    <t-dialog v-if="dialog.host" header="设备选择" placement="center" width="90%" preventScrollThrough  :visible.sync="dialog.host" :footer="false">
      <Host :hostList.sync="hostList" :obj="{ value: { hostType: 'firewall' }, condition: { hostType: 'eq' } }" @hostCheck="checkHost"></Host>
    </t-dialog>
    <t-drawer
      :visible.sync="dialog.code"
      placement="right"
      size="800px"
      header="脚本内容"
      :footer="false"
    >
      <div id="codeParent" style="height: 100%">
        <code-info v-if="dialog.code" ref="codeInfo" :codeInfo.sync="codeObj" :isReadOnly=false @save="saveCode"></code-info>
      </div>
    </t-drawer>
    <t-dialog v-if="dialog.job" header="脚本选择" placement="center" width="90%" preventScrollThrough  :visible.sync="dialog.job" :footer="false">
      <job :jobList.sync="jobList" @jobCheck="jobCheck"></job>
    </t-dialog>
  </div>
</template>

<script>
import { formatField } from '@/utils/inops/formatUtils'
import { getDictList, pageList } from '@/utils/inops/u'
import Job from '@/components/Selector/Job'
import Host from '@/components/Selector/Host'
import CodeInfo from '@/components/Code/CodeInfo'
import { saveAPI, listPageAPI, delAPI } from '@/api/inops/block/configure'
import { getFirewallAPI, updateFirewallAPI, delFirewallAPI } from '@/api/inops/block/firewall'
import { Input, Select } from 'tdesign-vue'
export default {
  name: 'config',
  components: { Host, CodeInfo, Job },
  data () {
    return {
      dict: {
        list: ['hostMfgr', 'resourcePool', 'hostType'],
        hostMfgr: [],
        resourcePool: [],
        hostType: [],
        action: [{ label: '封堵', value: 'deny' }, { label: '解封', value: 'permit' }]
      },
      table: {
        ref: 'tb_host',
        empty: '暂无封堵设备',
        loading: false,
        maxHeight: '300',
        data: [],
        column: [
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'hostName', title: '设备名称', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'bmcIp', title: '设备IP', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'resourcePool', title: '所属资源池', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'hostMfgr', title: '设备厂家', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'hostModel', title: '设备型号', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true },
          {
            colKey: 'denyRuleName',
            title: '封堵规则名称',
            align: 'left',
            resizable: true,
            ellipsis: true,
            ellipsisTitle: true,
            edit: {
              component: Input,
              props: {
                clearable: true,
                autofocus: true
              },
              onEdited: (context) => {
                this.table.data.splice(context.rowIndex, 1, context.newRowData)
              }
            }
          },
          {
            colKey: 'permitRuleName',
            title: '解封规则名称',
            align: 'left',
            resizable: true,
            ellipsis: true,
            ellipsisTitle: true,
            edit: {
              component: Input,
              props: {
                clearable: true,
                autofocus: true
              },
              onEdited: (context) => {
                this.table.data.splice(context.rowIndex, 1, context.newRowData)
              }
            }
          },
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
      strategy: {
        ref: 'tb_strategy',
        empty: '暂无策略配置',
        loading: false,
        maxHeight: '300',
        records: [],
        data: [],
        columns: []
      },
      strategyPage: {
        list: pageList,
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      hostList: [],
      dialog: {
        host: false,
        code: false,
        job: false
      },
      hostType: 'firewall',
      hostMfgrAndModel: [],
      codeObj: {
        id: '',
        name: '',
        code: '',
        type: 'forward_online_script',
        lang: 'python'
      },
      selectRow: '',
      jobList: []
    }
  },
  async mounted () {
    await this.getDict()
    this.getStrategy()
    this.getAllStrategy()
    this.getHost()
  },
  computed: {
    getCoulumns () {
      return [
        { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
        {
          colKey: 'hostMfgr',
          title: '设备厂家',
          align: 'left',
          resizable: true,
          ellipsis: true,
          ellipsisTitle: true,
          cell: (h, { row }) => this.dict.hostMfgr.find((t) => t.value === row.hostMfgr)?.label,
          edit: {
            component: Select,
            props: {
              multiple: false,
              options: this.dict.hostMfgr
            },
            onEdited: (context) => {
              this.strategy.data.splice(context.rowIndex, 1, context.newRowData)
            }
          }
        },
        {
          colKey: 'hostModel',
          title: '设备型号',
          align: 'left',
          resizable: true,
          ellipsis: true,
          ellipsisTitle: true,
          edit: {
            component: Input,
            props: {
              clearable: true,
              autofocus: true
            },
            onEdited: (context) => {
              this.strategy.data.splice(context.rowIndex, 1, context.newRowData)
            }
          }
        },
        {
          colKey: 'action',
          title: '动作',
          align: 'left',
          resizable: true,
          ellipsis: true,
          ellipsisTitle: true,
          cell: (h, { row }) => this.dict.action.find((t) => t.value === row.action)?.label,
          edit: {
            component: Select,
            props: {
              multiple: false,
              options: this.dict.action
            },
            onEdited: (context) => {
              this.strategy.data.splice(context.rowIndex, 1, context.newRowData)
            }
          }
        },
        { colKey: 'job', title: '封堵脚本', align: 'center' },
        { colKey: 'operator', title: '操作', align: 'center' }
      ]
    }
  },
  methods: {
    formatField,
    async getDict () {
      for (const item of this.dict.list) {
        this.dict[item] = await getDictList(item)
      }
    },
    // 获取封堵设备
    getHost () {
      const params = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      getFirewallAPI(params, {}).then(res => {
        const { data } = res
        if (data.code === 200) {
          const records = []
          data.data.records.forEach(item => {
            const obj = {
              id: item.firewall.id,
              denyRuleName: item.denyRuleName,
              permitRuleName: item.permitRuleName,
              hostName: item.firewall.hostName,
              bmcIp: item.firewall.bmcIp,
              hostMfgr: item.firewall.hostMfgr,
              resourcePool: item.firewall.resourcePool,
              hostModel: item.firewall.hostModel,
              isRecord: true
            }
            records.push(obj)
          })
          this.table.data = records
          const { total, size, current } = data.data
          this.pages = Object.assign(this.pages, { total, size, current })
          this.pages.list[this.pages.list.length - 1].value = total
          this.table.loading = false
        }
      })
    },
    // 获取封堵策略
    async getStrategy () {
      this.strategy.loading = true
      const params = {
        pageSize: this.strategyPage.size,
        pageNum: this.strategyPage.current
      }
      await listPageAPI(params, {}).then(res => {
        const { data } = res
        if (data.code === 200) {
          data.data.records.forEach(item => {
            const str = item.hostMfgr + item.hostModel
            this.hostMfgrAndModel.push(str)
          })
          this.strategy.data = data.data.records
          const { total, size, current } = data.data
          this.strategyPage = Object.assign(this.strategyPage, { total, size, current })
          this.strategyPage.list[this.strategyPage.list.length - 1].value = total
          this.strategy.loading = false
        }
      })
    },
    // 获取所有封堵策略
    getAllStrategy () {
      const params = {
        pageSize: 1000,
        pageNum: 1
      }
      listPageAPI(params, {}).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.strategy.records = data.data.records
        }
      })
    },
    // 设备分页
    onPages ({ currentPage, pageSize }) {
      this.pages.current = currentPage
      this.pages.size = pageSize
      this.getHost()
    },
    // 策略分页
    onStrategyPage ({ current, pageSize }) {
      this.strategyPage.current = current
      this.strategyPage.size = pageSize
      this.getStrategy()
    },
    // 设备选择
    async checkHost (data) {
      await data.forEach(item => {
        const index = this.table.data.findIndex(v => v.id === item.id)
        if (index === -1) {
          this.$set(item, 'denyRuleName', '')
          this.$set(item, 'permitRuleName', '')
          this.table.data.push(item)
        }
      })
      this.dialog.host = false
    },
    // 保存设备
    saveHost () {
      const data = []
      for (let i = 0; i < this.table.data.length; i++) {
        if (this.hostMfgrAndModel.includes(`${this.table.data[i].hostMfgr}${this.table.data[i].hostModel}`)) {
          const obj = {
            denyRuleName: this.table.data[i].denyRuleName,
            permitRuleName: this.table.data[i].permitRuleName,
            firewall: {
              id: this.table.data[i].id
            }
          }
          data.push(obj)
        }
        this.$message.warning({ content: '存在设备未匹配到封堵策略，请新增策略后保存', placement: 'center' })
        return false
      }
      updateFirewallAPI(data).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '保存成功', placement: 'center' })
          this.getHost()
        }
      })
    },
    // 删除设备
    delHost (type, id) {
      if (type === 'id') {
        delFirewallAPI(id).then(res => {
          const { data } = res
          if (data.code === 200) {
            this.$message.success({ content: '删除成功', placement: 'center' })
            this.getHost()
          } else {
            this.$message.error({ content: '删除失败，请联系管理员', placement: 'center' })
          }
        })
      } else {
        const dataIndex = this.table.data.findIndex(item => item.id === id)
        this.table.data.splice(dataIndex, 1)
        const hostIndex = this.hostList.findIndex(item => item.id === id)
        this.hostList.splice(hostIndex, 1)
      }
    },
    // 添加策略
    async insertEvent (row) {
      const $table = this.$refs.tb_strategy
      const record = {
        hostModel: '',
        hostMfgr: '',
        action: '',
        isNewRecord: true
      }
      // const record = {}
      const { row: newRow } = await $table.insert(record)
      await $table.setActiveRow(newRow)
    },
    // 保存策略
    onSaveStrategy (row) {
      let obj = JSON.parse(JSON.stringify(row))
      if (row.isNewRecord) {
        this.$delete(obj, 'id')
      }
      const { id, name, type, code, lang } = this.codeObj
      const scriptInfo = {
        scriptId: id,
        scriptName: name,
        scriptCode: code,
        scriptType: type,
        scriptLang: lang
      }
      obj = Object.assign(obj, scriptInfo)
      saveAPI(obj).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '新增成功', placement: 'center' })
          this.getStrategy()
          this.getAllStrategy()
        } else {
          this.$message.error({ content: '新增失败，请联系管理员', placement: 'center' })
        }
      })
    },
    // 删除策略
    onDelStrategy (type, row) {
      this.$XModal.confirm('确定要删除选中的数据吗?').then(confirmType => {
        if (confirmType === 'confirm') {
          if (type === 'record') {
            delAPI(row.id).then(res => {
              const { data } = res
              if (data.code === 200) {
                this.$message.success({ content: '删除成功', placement: 'center' })
                this.getStrategy()
              } else {
                this.$message.error({ content: '删除失败，请联系系统管理员', placement: 'center' })
              }
            })
          } else {
            this.$refs.tb_strategy.remove(row)
          }
        }
      })
    },
    saveCode (code) {
      this.codeObj.code = code
      this.$message.success({ content: '保存成功', placement: 'center' })
    },
    onEdit (row) {
      if (this.selectRow !== row.id) {
        this.selectRow = row.id
        this.codeObj.id = ''
        this.codeObj.name = ''
        this.codeObj.code = ''
      }
      if (!this.codeObj.code) {
        if (!row.isNewRecord) {
          this.codeObj.id = this.codeObj.id ? this.codeObj.id : row.scriptId
          this.codeObj.name = this.codeObj.name ? this.codeObj.name : row.scriptName
          this.codeObj.code = this.codeObj.code ? this.codeObj.code : row.scriptCode
        }
      }
      this.dialog.code = true
    },
    onSelect (row) {
      this.selectRow = row.id
      this.dialog.job = true
    },
    jobCheck (data) {
      if (data.length === 1) {
        this.codeObj.id = data[0].id
        this.codeObj.name = data[0].name
        this.codeObj.code = data[0].code
      } else {
        this.$message.warning({ content: '请选择一个脚本作为该策略封堵脚本', placement: 'center' })
        this.dialog.job = true
      }
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-drawer__body
  padding: 0px
</style>
