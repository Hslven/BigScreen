<template>
  <div style="width: 100%">
    <t-row>
      <t-col :xs="10" :sm="9" :md="9">
        <t-form ref="form" @submit="onApply" @reset="onReset">
          <t-row>
            <t-col :span="3">
              <t-form-item labelAlign="right" label="脚本名称" name="name">
                <t-input v-model.trim="condition.name" clearable style="width: 208px"></t-input>
              </t-form-item>
            </t-col>
            <t-col :span="3">
              <t-form-item labelAlign="right" label="脚本类型" name="type">
                <t-select v-model="condition.type" clearable filterable :options="dict.scriptType" style="width: 208px">
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="3" style="margin-left: 20px;">
              <t-form-item>
                <t-space size="10px">
                  <t-button theme="primary" type="submit">提交</t-button>
                  <t-button theme="default" variant="base" type="reset">重置</t-button>
                </t-space>
              </t-form-item>
            </t-col>
          </t-row>
        </t-form>
        <div style="margin-top: 15px" :style="{ height: `${height * 0.5}px` }">
          <t-table
            hover resizable selectOnRowClick multipleSort
            row-key="id"
            size="small"
            table-layout="fixed"
            cell-empty-content="-"
            :max-height="`${height * 0.5}`"
            :empty="table.empty"
            :data="table.data"
            :columns="table.column"
            :loading="table.loading"
            :selected-row-keys="table.select"
            :sort="table.sort"
            style="font-size: 12px"
            @sort-change="onSort"
            @select-change="onSelectChange"
          >
            <template #type="{ row }">
              {{ formatField(dict.scriptType, 'label', row.type) }}
            </template>
            <template #slot-user="{ row, col }">
              {{ formatField(dict.user, 'label', row[col.colKey]) }}
            </template>
          </t-table>
        </div>
        <div style="margin-top: 10px">
          <t-pagination
            v-model="pages.current"
            show-sizer
            show-jumper
            size="small"
            :total="pages.total"
            :page-size.sync="pages.size"
            :page-size-options="pages.list"
            @change="handPages"
          />
        </div>
      </t-col>
      <t-col :xs="2" :sm="3" :md="3" style="padding-left: 15px">
        <t-row justify="center">
          <div class="text_title">已选设备</div>
        </t-row>
        <t-row style="margin-top: 10px;">
          <t-col :span="11">
            <t-row>
              <t-input v-model.trim="filter" style="width: 70%;" placeholder="输入设备名称或设备IP"></t-input>
              <t-button theme="primary" @click="onFilter">查询</t-button>
            </t-row>
          </t-col>
          <t-col :span="1">
            <t-tooltip content="批量移除" placement="bottom">
              <t-button variant="text" shape="circle" theme="danger" @click="removeItem('batch', null)">
                <mod-icon name="delete"></mod-icon>
              </t-button>
            </t-tooltip>
          </t-col>
        </t-row>
        <t-row style="margin-top: 12px;">
          <div style="width: 100%;">
            <div class="scrollbar-style" style="padding-right: 3px">
              <t-table
                bordered hover showHeader
                rowKey="id"
                size="small"
                table-layout="fixed"
                cellEmptyContent="-"
                :max-height="`${height * 0.43}`"
                :empty="checkTable.empty"
                :data="checkTable.data"
                :columns="checkTable.column"
                :loading="checkTable.loading"
                :selected-row-keys="checkTable.select"
                style="font-size: 12px"
                @select-change="onCheckSelectChange"
              >
                <template #operator="{ row }">
                  <t-button variant="text" shape="circle" theme="danger" @click="removeItem('single', row)">
                    <mod-icon name="delete"></mod-icon>
                  </t-button>
                </template>
              </t-table>
            </div>
            <div style="margin-top: 15px">
              <t-pagination
                v-model="checkPages.current"
                show-sizer
                size="small"
                :total-content="false"
                :total="checkPages.total"
                :page-size.sync="checkPages.size"
                :page-size-options="checkPages.list"
                :folded-max-page-btn="3"
                :max-page-btn="5"
                @change="onPages"
              />
            </div>
          </div>
        </t-row>
      </t-col>
    </t-row>
    <t-divider style="margin: 15px 0px;"></t-divider>
    <t-row align="center">
      <t-col :span="11">
        <span style="color: #AAAEB7">共选择<span style="font-size: 16px; margin: 0px 8px; font-weight: bold; color: #507EF7">{{ checkList.length }}</span>个脚本</span>
      </t-col>
      <t-col :span="1" style="text-align: end">
        <t-button theme="primary" @click="confirm">确认选择</t-button>
      </t-col>
    </t-row>
  </div>
</template>

<script>
import { formatField } from '@/utils/inops/formatUtils'
import { getDictList, pageList } from '@/utils/inops/u'
import { getUserListApi } from '@/api/system/user'
import { getJobListAPI } from '@/api/inops/job/job'
export default {
  name: 'Job',
  props: {
    jobList: {
      type: Array,
      default: () => {
        return []
      }
    },
    obj: {
      type: Object
    }
  },
  data () {
    return {
      height: 0, // 高度
      dict: {
        scriptType: [],
        user: []
      }, // 字典
      condition: {
        type: '',
        name: '',
        orders: []
      }, // 查询条件对象
      table: {
        ref: 'jobInfo',
        empty: '暂无脚本数据',
        loading: false,
        sort: [],
        select: [],
        data: [],
        column: [
          { colKey: 'row-select', title: '选择', type: 'multiple', width: 50 },
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'name', title: '脚本名称', align: 'left', ellipsis: true, ellipsisTitle: true },
          { colKey: 'type', title: '脚本类型', align: 'left', ellipsis: true, ellipsisTitle: true },
          { colKey: 'lang', title: '脚本语言', align: 'center', ellipsis: true, ellipsisTitle: true },
          { colKey: 'version', title: '版本', align: 'center', ellipsis: true, ellipsisTitle: true },
          { colKey: 'description', title: '脚本描述', align: 'left', ellipsis: true, ellipsisTitle: true },
          { colKey: 'createBy', title: '创建人', align: 'left', ellipsis: true, ellipsisTitle: true, cell: 'slot-user' },
          { colKey: 'createDate', title: '创建时间', align: 'center', ellipsis: true, ellipsisTitle: true },
          { colKey: 'updateDate', title: '更新时间', align: 'center', ellipsis: true, ellipsisTitle: true }
        ]
      }, // 表格
      pages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 30,
        align: 'right'
      }, // 分页
      filter: '', // 过滤字段
      checkList: [], // 已选列表（传值）
      checkTable: {
        ref: 'tb_task',
        empty: '暂无数据',
        loading: false,
        maxHeight: '500',
        select: [],
        allData: [], // 所有数据
        data: [], // 筛选后数据
        column: [
          { colKey: 'row-select', title: '选择', type: 'multiple', width: 50 },
          { colKey: 'name', title: '脚本名称', align: 'left', ellipsis: true },
          { colKey: 'operator', title: '操作', width: 50, align: 'center', ellipsis: true }
        ]
      }, // 勾选列表
      checkPages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 30
      } // 列表分页
    }
  },
  watch: {
    checkList: {
      handler () {
        this.onFilter()
      },
      deep: true
    }
  },
  async mounted () {
    window.addEventListener('resize', () => {
      this.calsize()
    })
    this.calsize()
    this.table.loading = true
    this.table.select = []
    this.checkList = JSON.parse(JSON.stringify(this.jobList))
    this.setCheck()
    await this.getDict()
    await this.getUserDict()
    await this.setValue()
    this.getJobList()
  },
  methods: {
    /**
     * 字段格式化
     */
    formatField,
    /**
     * 尺寸设置
     */
    calsize () {
      this.height = window.screen.height
      this.width = window.screen.width
    },
    /**
     * 设置传值查询条件参数
     */
    setValue () {
      if (this.obj) {
        Object.assign(this.condition, this.obj)
      }
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
    /**
     * 获取用户字典
     * @returns {Promise<void>}
     */
    async getUserDict () {
      await getUserListApi().then(response => {
        const { data } = response
        if (data.code === 0) {
          for (const item of data.data) {
            if (item.delFlag === '0') {
              this.dict.user.push({ label: item.nickName, value: item.userId.toString() })
            }
          }
        }
      })
    },
    /**
     * 获取脚本列表
     */
    getJobList () {
      this.table.loading = true
      const param = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      getJobListAPI(param, this.condition).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.table.data = data.data.records
          const { total, size, current } = data.data
          this.pages = Object.assign(this.pages, { total, size, current })
          this.pages.list[this.pages.list.length - 1].value = this.pages.total
          this.table.loading = false
        } else {
          this.$message.error({ content: '获取数据失败，请联系管理员', placement: 'center' })
          this.table.loading = false
        }
      })
    },
    /**
     * 提交查询
     */
    onApply () {
      this.pages.current = 1
      this.pages.size = 10
      this.getJobList()
    },
    /**
     * 简单查询重置
     */
    onReset () {
      this.condition = {
        name: '',
        type: ''
      }
    },
    /**
     * 分页
     * @param current 当前页
     * @param pageSize 页大小
     */
    handPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.getJobList()
    },
    // 设备表格设置勾选项
    setCheck () {
      const list = []
      this.checkList.forEach((selected) => {
        list.push(selected.id)
      })
      this.table.select = [...new Set(list)]
    },
    /**
     * 表格排序
     * @param val 排序对象
     */
    onSort (val) {
      this.condition.orders = []
      this.table.sort = val
      val.forEach(item => {
        this.condition.orders.push({
          column: `a.${item.sortBy.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase()}`,
          asc: !item.descending
        })
      })
      this.getJobList()
    },
    /**
     * 勾选列表分页
     * @param current 当前页
     * @param pageSize 页码大小
     */
    onPages ({ current, pageSize }) {
      this.checkPages.current = current
      this.checkPages.size = pageSize
      this.onFilter()
    },
    /**
     * 勾选列表过滤
     */
    onFilter () {
      if (this.filter) {
        this.checkPages.current = 1
        const list = this.checkList.filter(item => {
          return item.name.indexOf(this.filter) > -1
        })
        this.checkPages.total = list.length
        this.checkTable.data = list.slice((this.checkPages.current - 1) * this.checkPages.size, this.checkPages.current * this.checkPages.size)
        this.checkPages.list[this.checkPages.list.length - 1].value = list.total
      } else {
        this.checkPages.total = this.checkList.length
        this.checkTable.data = this.checkList.slice((this.checkPages.current - 1) * this.checkPages.size, this.checkPages.current * this.checkPages.size)
        this.checkPages.list[this.checkPages.list.length - 1].value = this.checkList.total
      }
    },
    /**
     * 移除勾选项
     * @param delType 删除类型  single：单选  else批量
     * @param row
     */
    removeItem (delType, row) {
      this.$XModal.confirm('是否删除选中数据?').then(type => {
        if (type === 'confirm') {
          if (delType === 'single') {
            const index = this.checkList.findIndex(v => v.id === row.id)
            this.checkList.splice(index, 1)
            const index2 = this.table.select.findIndex(item => item === row.id)
            if (index2 > -1) this.table.select.splice(index2, 1)
          } else {
            this.checkTable.select.forEach(item => {
              const index = this.checkList.findIndex(checked => checked.id === item)
              this.checkList.splice(index, 1)
              const index2 = this.table.select.findIndex(v => v === item)
              if (index2 > -1) this.table.select.splice(index2, 1)
            })
          }
          this.onFilter()
          this.checkTable.select = []
        }
      })
    },
    /**
     * 确认
     */
    confirm () {
      this.$emit('jobCheck', this.checkList)
    },
    /**
     * 设备列表选择变更
     * @param value 选择项
     * @param selectedRowData 选择行数据
     * @param type 选择类型 check uncheck check_all_box
     * @param currentRowKey 当前行id
     */
    onSelectChange (value, { selectedRowData, type, currentRowKey }) {
      this.checkPages.current = 1
      if (type === 'check') {
        selectedRowData.forEach(item => {
          if (item) {
            const index = this.checkList.findIndex(v => v.id === item.id)
            if (index === -1) this.checkList.push(item)
          }
        })
      } else if (type === 'uncheck') {
        if (currentRowKey === 'CHECK_ALL_BOX') {
          this.table.data.forEach(item => {
            const index = this.checkList.findIndex(v => v.id === item.id)
            this.checkList.splice(index, 1)
          })
        } else {
          const index = this.checkList.findIndex(v => v.id === currentRowKey.id)
          this.checkList.splice(index, 1)
        }
      }
      this.table.select = [...value]
    },
    /**
     * 勾选列表选择变更
     * @param value
     */
    onCheckSelectChange (value) {
      this.checkTable.select = value
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
