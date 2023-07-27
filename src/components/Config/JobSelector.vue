<template>
  <div style="padding: 15px">
    <t-row align="center">
      <div style="border: 1px solid #165DFF; height: 14px;"></div>
      <span style="margin-left: 10px">脚本配置</span>
    </t-row>
<!--    <t-form ref="form" @submit="onApply" @reset="onReset">-->
<!--      <t-row>-->
<!--        <t-col :span="3">-->
<!--          <t-form-item labelAlign="right" label="脚本名称" name="name">-->
<!--            <t-input v-model.trim="condition.name" clearable style="width: 208px"></t-input>-->
<!--          </t-form-item>-->
<!--        </t-col>-->
<!--        <t-col :span="3">-->
<!--          <t-form-item labelAlign="right" label="脚本类型" name="type">-->
<!--            <t-select v-model="condition.type" clearable filterable :options="dict.scriptType" style="width: 208px">-->
<!--            </t-select>-->
<!--          </t-form-item>-->
<!--        </t-col>-->
<!--        <t-col :span="3">-->
<!--          <t-form-item>-->
<!--            <t-space size="10px">-->
<!--              <t-button theme="primary" type="submit">提交</t-button>-->
<!--              <t-button theme="default" variant="base" type="reset">重置</t-button>-->
<!--            </t-space>-->
<!--          </t-form-item>-->
<!--        </t-col>-->
<!--      </t-row>-->
<!--    </t-form>-->
    <t-button variant="outline" theme="default" style="margin-top: 25px;" @click="dialog.job = true">
      <t-row align="center">
        <mod-icon class="mr-2" name="add"></mod-icon>
        <span>新增脚本</span>
      </t-row>
    </t-button>
    <div style="margin-top: 15px">
      <t-table
        hover resizable selectOnRowClick multipleSort bordered
        row-key="id"
        size="small"
        table-layout="fixed"
        cell-empty-content="-"
        max-height="600"
        :empty="table.empty"
        :data="table.data"
        :columns="table.column"
        :loading="table.loading"
        :selected-row-keys="table.select"
        :sort="table.sort"
        style="font-size: 12px"
        @select-change="onSelectChange"
      >
<!--        <template #type="{ row }">-->
<!--          {{ formatField(dict.scriptType, 'label', row.type) }}-->
<!--        </template>-->
        <template #operator="{ row }">
          <t-row justify="center">
            <t-button class="mr-5" variant="text" theme="primary" @click="showJobInfo(row)">查看脚本</t-button>
            <t-popconfirm theme="default" content="确认删除脚本吗" @confirm="remove(row)">
              <t-button variant="text" theme="danger">删除</t-button>
            </t-popconfirm>
          </t-row>
        </template>
      </t-table>
    </div>
    <t-dialog header="选择脚本" placement="center" width="90%" preventScrollThrough v-if="dialog.job" :visible.sync="dialog.job" :footer="false">
      <job :jobList.sync="jobList" @jobCheck="jobCheck"></job>
    </t-dialog>
    <t-drawer
      :visible.sync="dialog.info"
      placement="right"
      size="800px"
      header="脚本内容"
      :footer="false"
    >
      <div id="codeParent" style="height: 100%">
        <CodeInfo v-if="dialog.info" ref="codeInfo" :codeInfo.sync="codeInfo"></CodeInfo>
      </div>
    </t-drawer>
  </div>
</template>

<script>
import { formatField } from '@/utils/inops/formatUtils'
import { getDictList } from '@/utils/inops/u'
import Job from '@/components/Selector/Job'
import CodeInfo from '@/components/Code/CodeInfo'
export default {
  name: 'JobSelector',
  components: { Job, CodeInfo },
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
      codeHeight: 0, // codemirror高度
      dict: {
        scriptType: []
      },
      condition: {
        name: '',
        type: ''
      },
      table: {
        ref: 'jobInfo',
        empty: '暂无脚本数据',
        loading: false,
        select: [],
        data: [],
        column: [
          // { colKey: 'drag', title: '排序', cell: (h) => (<span><MoveIcon /></span>), width: 46 },
          // { colKey: 'row-select', title: '选择', type: 'multiple', width: 50 },
          // { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'name', title: '脚本名称', align: 'left', ellipsis: true, ellipsisTitle: true },
          // { colKey: 'type', title: '脚本类型', align: 'left', ellipsis: true, ellipsisTitle: true },
          // { colKey: 'lang', title: '脚本语言', align: 'center', ellipsis: true, ellipsisTitle: true },
          // { colKey: 'version', title: '版本', align: 'center', ellipsis: true, ellipsisTitle: true },
          { colKey: 'createDate', title: '创建时间', align: 'center', ellipsis: true, ellipsisTitle: true },
          { colKey: 'operator', title: '操作', align: 'center', width: 250, ellipsis: true, ellipsisTitle: true }
        ]
      },
      jobList: [],
      dialog: {
        job: false,
        info: false
      },
      codeInfo: {
        code: '',
        lang: ''
      }
    }
  },
  mounted () {
    this.initData()
  },
  watch: {
    jobList: {
      handler (newVal) {
        this.$emit('update:list', newVal)
      }
    }
  },
  methods: {
    formatField,
    initData () {
      this.jobList = JSON.parse(JSON.stringify(this.list))
      this.table.data = JSON.parse(JSON.stringify(this.list))
    },
    /**
     * 获取字典
     * @returns {Promise<void>}
     */
    async getDict () {
      const keys = Object.keys(this.dict)
      for (const item of keys) {
        this.dict[item] = await getDictList(item)
      }
    },
    onApply () {
      const list = this.jobList.filter(item => {
        return item.name.indexOf(this.condition.name) > -1
      })
      const list2 = list.filter(item => {
        return item.type.indexOf(this.condition.type) > -1
      })
      this.table.data = list2
    },
    onReset () {
      this.condition = {
        name: '',
        type: ''
      }
    },
    jobCheck (data) {
      if (data.length === 0) {
        this.$message.error({ content: '暂未选择脚本', placement: 'center' })
        this.dialog.job = true
      } else {
        this.table.data = JSON.parse(JSON.stringify(data))
        this.jobList = JSON.parse(JSON.stringify(data))
        this.dialog.job = false
      }
    },
    remove (row) {
      const index = this.table.data.findIndex(item => item.id === row.id)
      this.table.data.splice(index, 1)
      const index2 = this.jobList.findIndex(item => item.id === row.id)
      this.jobList.splice(index2, 1)
    },
    showJobInfo (row) {
      const { code, lang } = row
      this.codeInfo.code = code
      this.codeInfo.lang = lang
      this.dialog.info = true
    },
    /**
     * 脚本列表选择
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
/deep/ .t-drawer__body
  padding: 0px
/deep/ .t-divider--horizontal
  margin: 0px
</style>
