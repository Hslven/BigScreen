<template>
  <div style="width: 100%">
    <t-row>
      <t-col :span="3" v-for="(item, index) in fieldList" :key="index">
        <t-row>
          <t-col :span="2">
            <span class="text_font_size">{{ item.name }}</span>
          </t-col>
          <t-col :span="10">
            <t-input v-model.trim="valueObj[item.value]" v-if="item.type === 'input'" clearable size="small" style="width: 90%"></t-input>
            <t-select v-model="valueObj[item.value]" v-if="item.type === 'select'" clearable filterable size="small" style="width: 90%">
              <t-option v-for="(item, index) in dict[item.options]" :key="index" :label="item.label" :value="item.value" />
            </t-select>
          </t-col>
        </t-row>
      </t-col>
      <t-col :span="3">
        <t-button theme="primary" size="small" style="margin-right: 8px" @click="onApply">查询</t-button>
      </t-col>
    </t-row>
    <div style="margin-top: 15px" :style="{ height: `${height * 0.4}px` }">
      <vxe-table
        class="text-black"
        stripe
        auto-resize
        keep-source
        highlight-hover-row
        highlight-current-row
        highlight-hover-column
        highlight-current-column
        row-id='id'
        border="default"
        height="100%"
        size="mini"
        checkField="id"
        :empty-text="table.empty"
        :ref="table.ref"
        :column-config="{resizable: true}"
        :loading="table.loading"
        :seq-config="{startIndex: (pages.current - 1) * pages.size }"
        :checkbox-config="{reserve: true, trigger: 'row'}"
        :data="table.data"
        @checkbox-change="check"
        @checkbox-all="checkAll"
      >
        <vxe-table-column
          v-for="(config, index) in table.column"
          :key="index" v-bind="config"
          :formatter="config.formatType ? [config.formatType, config.formatType ? dict[config.formatList] : null] : ''">
          <template v-slot="{ row }" v-if="config.field === 'authScope'">
            <span v-if="row.authScope === 'role'" style="color: #2BCA0C; font-weight: bold">角色共享</span>
            <span v-else-if="row.authScope === 'public'" style="color: #165DFF; font-weight: bold">公开任务</span>
            <span v-else style="color: #AAAEB7; font-weight: bold">私有任务</span>
          </template>
        </vxe-table-column>
      </vxe-table>
    </div>
    <div style="margin-top: 10px">
      <vxe-pager
        class="q-mt-sm"
        background
        size="mini"
        :current-page="pages.current"
        :page-size="pages.size"
        :total="pages.total"
        :page-sizes="pages.list"
        :page-count=5
        :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"
        @page-change="onPages">
      </vxe-pager>
    </div>
    <t-divider></t-divider>
    <t-row align="center">
      <t-col :span="11">
        <span style="color: #AAAEB7">共选择<span style="font-size: 16px; margin: 0px 8px; font-weight: bold; color: #507EF7">{{ checkList.length }}</span>条数据</span>
      </t-col>
      <t-col :span="1" style="text-align: end">
        <t-button theme="primary" size="small" @click="confirm">确认选择</t-button>
      </t-col>
    </t-row>
  </div>
</template>

<script>
import { getDictList } from '@/utils/inops/u'
import { getUserListApi } from '@/api/system/user'

export default {
  name: 'Common',
  props: {
    // 接收父组件字段
    field: { type: Array },
    // 接收父组件赋值对象
    value: { type: Object },
    // 接收父组件表格信息
    tableInfo: { type: Object },
    // 接收父组件分页信息
    pagesInfo: { type: Object },
    // 已选列表
    list: { type: Array }
  },
  data () {
    return {
      height: 0, // 获取窗口高度
      dict: {
        list: ['scriptType', 'taskStatus', 'jobSheduleState'],
        scriptType: [],
        taskStatus: [],
        jobSheduleState: [],
        user: []
      }, // 字典
      fieldList: [], // 字段描述列表
      valueObj: {}, // 字段对象
      table: {
        ref: 'info',
        empty: '暂无数据',
        loading: false,
        data: [],
        column: []
      },
      pages: {
        list: [30, 60, 90, 180, 300, 500, { label: '全部', value: '' }],
        total: 0,
        current: 1,
        size: 30,
        align: 'right'
      },
      checkList: [] // 选择列表
    }
  },
  watch: {
    tableInfo: {
      handler (newVal) {
        this.setData()
      },
      deep: true
    }
  },
  async mounted () {
    this.table.loading = true
    window.addEventListener('resize', () => {
      this.calsize()
    })
    this.calsize()
    this.checkList = JSON.parse(JSON.stringify(this.list))
    this.fieldList = this.field
    this.valueObj = this.value
    await this.getDict()
    await this.getUserDict()
    this.setData()
  },
  methods: {
    calsize () {
      this.height = window.screen.height
      this.width = window.screen.width
    },
    setData () {
      this.table.loading = true
      this.table = Object.assign(this.table, this.tableInfo)
      this.pages = Object.assign(this.pages, this.pagesInfo)
      this.setCheck()
      this.table.loading = false
    },
    async getDict () {
      for (const item of this.dict.list) {
        this.dict[item] = await getDictList(item)
      }
    },
    async getUserDict () {
      await getUserListApi().then(response => {
        const { data } = response
        if (data.code === 0) {
          for (const item of data.data) {
            this.dict.user.push(item)
          }
        }
      })
    },
    onApply () {
      this.$emit('apply', this.valueObj, this.pages.current, this.pages.size)
    },
    setCheck () {
      this.$refs.info.clearCheckboxRow()
      const list = []
      this.checkList.forEach((selected) => {
        this.table.data.forEach(v => {
          if (selected.id === v.id) {
            list.push(v)
          }
        })
      })
      this.$refs.info.setCheckboxRow(list, true)
    },
    check ({ row, checked }) {
      if (checked) {
        this.checkList.push(row)
      } else {
        const index = this.checkList.findIndex(v => v.id === row.id)
        this.checkList.splice(index, 1)
      }
    },
    checkAll ({ records, checked }) {
      if (checked) {
        records.forEach(record => {
          const index = this.checkList.findIndex(item => item.id === record.id)
          if (index === -1) {
            this.checkList.push(record)
          }
        })
      } else {
        this.table.data.forEach(v => {
          const index = this.checkList.findIndex(checked => checked.id === v.id)
          this.checkList.splice(index, 1)
        })
      }
    },
    onPages ({ currentPage, pageSize }) {
      this.pages.current = currentPage
      this.pages.size = pageSize
      this.$emit('apply', this.valueObj, this.pages.current, this.pages.size)
    },
    confirm () {
      this.$emit('confirm', this.checkList)
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-divider
  margin: 5px 0px 8px 0px
</style>
