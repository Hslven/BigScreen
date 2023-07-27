<template>
  <div class="bg-mod-card" style="padding: 15px">
    <t-row v-show="!isExpand">
      <t-col :md="3" :sm="4" :xs="6" v-for="(item, index) in simpleField" :key="index">
        <t-row align="center" class="pb-4">
          <t-col :span="4"><span>{{ item.name }}</span></t-col>
          <t-col :span="8">
            <t-input v-if="item.type === 'input'" v-model.trim="simple[item.value]" clearable style="width: 80%"></t-input>
            <t-select v-else-if="item.type === 'select'" v-model="simple[item.value]" :options="dict[item.value]" clearable filterable style="width: 80%"></t-select>
          </t-col>
        </t-row>
      </t-col>
      <t-col :md="3" :sm="4" :xs="6">
        <t-row>
          <t-button class="mr-5" theme="primary" @click="onApply">查询</t-button>
          <t-button theme="default" @click="onResetSimple">重置</t-button>
        </t-row>
      </t-col>
    </t-row>
    <t-card v-show="isExpand" bordered style="background-color: #F7F8FA; margin-top: 8px">
      <t-row :gutter="[0, 15]">
        <t-col :md="3" :sm="4" :xs="6" v-for="(item, index) in fieldList" :key="index" v-show="item.isSelect">
          {{ item.name }}
          <t-row align="center">
            <t-col :span="3">
              <t-select
                v-model="complexData.condition[item.value]"
                :options="item.statusList"
                style="width: 100%; border-top-right-radius: 0px; border-bottom-right-radius: 0px"
                @change="changeSelectValue(item)"></t-select>
            </t-col>
            <t-col :span="9" v-if="item.isShow">
              <t-input
                v-if="item.type === 'input'"
                v-model.trim="complex[item.value]"
                clearable
                :placeholder="complexData.condition[item.value] === 'in' ?'请输入关键字，多值用逗号隔开': item.placeholder"
                style="width: 80%"></t-input>
              <t-select
                v-else-if="item.type === 'select'"
                v-model="complex[item.value]"
                clearable filterable
                :minCollapsedNum="1"
                :options="dict[item.value]"
                :multiple="item.isMultiple[complexData.condition[item.value]]"
                style="width: 80%"></t-select>
            </t-col>
          </t-row>
        </t-col>
        <t-col :md="3" :sm="4" :xs="6">
          <t-row style="margin-top: 22px">
            <t-button class="mr-5" theme="primary" @click="onApply">查询</t-button>
            <t-button theme="default" @click="onResetComplex">重置</t-button>
          </t-row>
        </t-col>
      </t-row>
    </t-card>
    <t-divider align="center">
      <t-button variant="text" theme="primary" @click="isExpand = !isExpand">
        <span style="align-items: center">更多<mod-icon :name="isExpand ? 'expand_less' : 'expand_more'"></mod-icon></span>
      </t-button>
    </t-divider>
    <div style="margin-top: 5px">
      <t-row align="center">
        <t-col :span="3">
          <t-button theme="primary" @click="onAdd"><span style="align-items: center"><mod-icon name="add" style="margin-right: 8px"></mod-icon>新增设备</span></t-button>
        </t-col>
        <t-col :span="9">
          <t-row justify="end">
            <t-button variant="outline" theme="default" style="margin-right: 15px" @click="table.showColumnController = !table.showColumnController">
              <span style="align-items: center">
                <mod-icon name="o_playlist_add" style="margin-right: 8px" />指标管理
              </span>
            </t-button>
            <!--        <t-upload v-model="fileData" theme="file" style="margin-right: 15px" action="http://192.168.3.17/modrequest/hosts/import"/>-->
            <t-popconfirm theme="default" content="确认删除任务吗" @confirm="delEvent">
              <t-button variant="outline" theme="default">删除数据</t-button>
            </t-popconfirm>
          </t-row>
        </t-col>
      </t-row>
    </div>
    <div style="margin-top: 15px">
      <t-table
        hover resizable selectOnRowClick multipleSort
        row-key="id"
        size="small"
        table-layout="fixed"
        cell-empty-content="-"
        :display-columns.sync="table.displayColumn"
        :column-controller-visible.sync="table.showColumnController"
        :column-controller="{
          fields: ['hostName', 'osIp', 'bmcIp', 'resourcePool', 'hostRoom', 'sysArea', 'major', 'hostMfgr', 'hostType', 'hostModel', 'hostSource'],
          dialogProps: { preventScrollThrough: true },
          hideTriggerButton: true,
        }"
        :max-height="`${isExpand ? height * 0.29 : height * 0.45}`"
        :empty="table.empty"
        :data="table.data"
        :columns="table.column"
        :loading="table.loading"
        :selected-row-keys="table.select"
        :sort="table.sort"
        @display-columns-change="onColumnChange"
        @sort-change="onSort"
        @select-change="onSelectChange"
      >
        <template #slot-field="{ row, col }">
          {{ formatField(dict[col.colKey], 'label', row[col.colKey]) }}
        </template>
        <template #operator="{ row }">
          <t-button variant="text" theme="primary" @click="editEvent(row)">编辑</t-button>
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
        @change="handPages"
      />
    </div>
  </div>
</template>

<script>
import { formatField } from '@/utils/inops/formatUtils'
import { pageList, getDictList } from '@/utils/inops/u'
// eslint-disable-next-line no-unused-vars
import { listPageAPI, delHostAPI, uploadFileAPI } from '@/api/inops/CMDB/cmdbDevice'
import ModIcon from '@/ui/ModIcon/ModIcon'
// 输入框查询条件
const inputCondition = [
  { label: '包含', value: 'like' },
  { label: '等于', value: 'eq' },
  { label: '包括', value: 'in' },
  { label: '为空', value: 'empty' },
  { label: '不为空', value: 'nempty' }
]
// 下拉框查询条件
const selectCondition = [
  { label: '等于', value: 'eq' },
  { label: '包括', value: 'in' },
  { label: '为空', value: 'empty' },
  { label: '不为空', value: 'nempty' }
]
// 查询条件是否支持多选
const selectMultiple = { eq: false, in: true, empty: false, nempty: false }
// 表格列配置显示列
const displayColumn = ['row-select', 'serial-number', 'hostName', 'osIp', 'bmcIp', 'projectPeriod', 'resourcePool', 'hostRoom', 'sysArea', 'major', 'hostMfgr', 'hostType', 'hostModel', 'hostSource', 'updateDate', 'operator']
export default {
  name: 'list',
  components: { ModIcon },
  data () {
    return {
      height: 0, // 获取屏幕高度
      dict: {
        resourcePool: [],
        hostRoom: [],
        hostType: [],
        hostMfgr: [],
        hostSource: [],
        sysArea: [],
        major: []
      }, // 字典
      // dataFile: null, // 文件
      // fileData: new FormData(),
      // fileData: [], // 文件
      // fileLoading: false,
      simpleField: [
        {
          name: '设备名称',
          type: 'input',
          value: 'hostName',
          placeholder: '请输入关键字，多值用逗号隔开'
        },
        {
          name: '管理IP',
          type: 'input',
          value: 'osIp',
          placeholder: '请输入关键字，多值用逗号隔开'
        },
        {
          name: '硬管IP',
          type: 'input',
          value: 'bmcIp',
          placeholder: '请输入关键字，多值用逗号隔开'
        },
        {
          name: '资源池',
          type: 'select',
          value: 'resourcePool',
          placeholder: '请输入关键字，多值用逗号隔开'
        },
        {
          name: '所属厂家',
          type: 'select',
          value: 'hostMfgr',
          placeholder: '请输入关键字，多值用逗号隔开'
        },
        {
          name: '设备类型',
          type: 'select',
          value: 'hostType',
          placeholder: '请输入关键字，多值用逗号隔开'
        },
        {
          name: '设备型号',
          type: 'input',
          value: 'hostModel',
          placeholder: '请输入关键字，多值用逗号隔开'
        }
      ], // 简单搜素字段
      simple: {
        condition: {
          hostName: 'like',
          osIp: 'like',
          bmcIp: 'like',
          resourcePool: 'eq',
          hostMfgr: 'eq',
          hostModel: 'like',
          hostType: 'eq'
        },
        hostName: '',
        osIp: '',
        bmcIp: '',
        resourcePool: '',
        hostMfgr: '',
        hostModel: '',
        hostType: '',
        orders: []
      }, // 简单搜索对象
      isExpand: false, // 控制是否展开更多搜索
      fieldList: [
        {
          name: '设备名称',
          type: 'input',
          value: 'hostName',
          statusList: inputCondition,
          isSelect: true,
          isShow: true,
          placeholder: '请输入'
        },
        {
          name: '管理IP',
          type: 'input',
          value: 'osIp',
          statusList: inputCondition,
          isSelect: true,
          isShow: true,
          placeholder: '请输入'
        },
        {
          name: '硬管IP',
          type: 'input',
          value: 'bmcIp',
          statusList: inputCondition,
          isSelect: true,
          isShow: true,
          placeholder: '请输入'
        },
        {
          name: '资源池',
          type: 'select',
          value: 'resourcePool',
          statusList: selectCondition,
          isSelect: true,
          isShow: true,
          isMultiple: selectMultiple,
          placeholder: '请输入'
        },
        {
          name: '所属专业',
          type: 'select',
          value: 'major',
          statusList: selectCondition,
          isSelect: true,
          isShow: true,
          isMultiple: selectMultiple,
          placeholder: '请输入'
        },
        {
          name: '所属机房',
          type: 'select',
          value: 'hostRoom',
          statusList: selectCondition,
          isSelect: true,
          isShow: true,
          isMultiple: selectMultiple,
          placeholder: '请输入'
        },
        {
          name: '所属厂家',
          type: 'select',
          value: 'hostMfgr',
          statusList: selectCondition,
          isSelect: true,
          isShow: true,
          isMultiple: selectMultiple,
          placeholder: '请输入'
        },
        {
          name: '设备类型',
          type: 'select',
          value: 'hostType',
          statusList: selectCondition,
          isSelect: true,
          isShow: true,
          isMultiple: selectMultiple,
          placeholder: '请输入'
        },
        {
          name: '设备型号',
          type: 'input',
          value: 'hostModel',
          statusList: inputCondition,
          isSelect: true,
          isShow: true,
          placeholder: '请输入'
        },
        {
          name: '归属',
          type: 'select',
          value: 'sysArea',
          statusList: selectCondition,
          isSelect: true,
          isShow: true,
          isMultiple: selectMultiple,
          placeholder: '请输入'
        },
        {
          name: '数据来源',
          type: 'select',
          value: 'hostSource',
          statusList: selectCondition,
          isSelect: true,
          isShow: true,
          isMultiple: selectMultiple,
          placeholder: '请输入'
        }
      ], // 高级搜索字段
      complex: {
        hostName: '',
        osIp: '',
        bmcIp: '',
        resourcePool: [],
        hostRoom: [],
        hostMfgr: [],
        hostType: [],
        hostModel: '',
        major: [],
        sysArea: [],
        hostSource: []
      }, // 高级搜索对象
      complexData: {
        condition: {
          hostName: 'like',
          osIp: 'like',
          bmcIp: 'like',
          resourcePool: 'eq',
          major: 'eq',
          hostRoom: 'eq',
          hostMfgr: 'eq',
          hostType: 'eq',
          hostModel: 'like',
          sysArea: 'eq',
          hostSource: 'eq'
        },
        hostName: '',
        osIp: '',
        bmcIp: '',
        resourcePool: '',
        major: '',
        hostRoom: '',
        hostMfgr: '',
        hostType: '',
        hostModel: '',
        sysArea: '',
        hostSource: '',
        orders: []
      }, // 高级搜索对象格式化
      table: {
        ref: 'tbHost',
        empty: '无纳管资源数据',
        loading: false,
        displayColumn,
        showColumnController: false,
        sort: [],
        select: [],
        data: [],
        column: [
          { colKey: 'row-select', title: '选择', type: 'multiple', width: 50 },
          { colKey: 'serial-number', title: '序号', width: 60, align: 'center' },
          { colKey: 'hostName', title: '设备名称', align: 'left', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', width: 80 },
          { colKey: 'osIp', title: '管理IP', align: 'left', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', width: 80 },
          { colKey: 'bmcIp', title: '硬管IP', align: 'left', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', width: 80 },
          { colKey: 'projectPeriod', title: '工程期数', align: 'center', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', width: 80 },
          { colKey: 'resourcePool', title: '资源池', align: 'left', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', cell: 'slot-field', width: 80 },
          { colKey: 'hostRoom', title: '所属机房', align: 'left', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', cell: 'slot-field', width: 80 },
          { colKey: 'sysArea', title: '归属', align: 'left', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', cell: 'slot-field', width: 80 },
          { colKey: 'major', title: '所属专业', align: 'center', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', cell: 'slot-field', width: 80 },
          { colKey: 'hostMfgr', title: '所属厂家', align: 'center', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', cell: 'slot-field', width: 80 },
          { colKey: 'hostType', title: '设备类型', align: 'center', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', cell: 'slot-field', width: 80 },
          { colKey: 'hostModel', title: '设备型号', align: 'center', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', width: 80 },
          { colKey: 'hostSource', title: '数据来源', align: 'center', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', cell: 'slot-field', width: 80 },
          { colKey: 'updateDate', title: '更新时间', align: 'center', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', width: 80 },
          { colKey: 'operator', title: '操作', width: 60, align: 'center', fixed: 'right' }
        ]
      }, // 表格
      pages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 30,
        align: 'right'
      } // 分页
    }
  },
  watch: {
    /**
     * 监听更多搜索中条件查询范围
     * 控制是否显示输入框或下拉框
     */
    'complex.condition': {
      handler (newVal) {
        Object.keys(this.complex.condition).forEach(item => {
          if (newVal[item] === 'empty' || newVal[item] === 'nempty') {
            const index = this.fieldList.findIndex(value => value.value === item)
            this.fieldList[index].isShow = false
          } else {
            const index = this.fieldList.findIndex(value => value.value === item)
            this.fieldList[index].isShow = true
          }
        })
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
    await this.getDict()
    this.getListPage()
  },
  methods: {
    /**
     * 表格字段格式化
     */
    formatField,
    /**
     * 屏幕高度获取
     */
    calsize () {
      this.height = window.screen.height
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
     * 获取纳管资源列表
     * 根据是否展开 传入 简单搜索对象或高级搜索对象
     */
    getListPage () {
      this.table.loading = true
      const params = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      this.handleData()
      listPageAPI(params, this.isExpand ? this.complexData : this.simple).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.table.data = data.data.records
          const { total, size, current } = data.data
          this.pages = Object.assign(this.pages, { total, size, current })
          this.pages.list[this.pages.list.length - 1].value = total
          this.table.loading = false
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
          this.table.loading = false
        }
      })
    },
    /**
     * 处理搜索对象数据
     * 如果为多选数据则将数组格式化为 ','拼接的字符串
     */
    handleData () {
      const { hostName, osIp, bmcIp, hostModel, resourcePool, major, hostRoom, hostMfgr, hostType, sysArea, hostSource } = this.complex
      this.complexData = Object.assign(this.complexData, { hostName, osIp, bmcIp, hostModel })
      this.complexData.resourcePool = Array.isArray(resourcePool) ? resourcePool.join(',') : resourcePool
      this.complexData.major = Array.isArray(major) ? major.join(',') : major
      this.complexData.hostRoom = Array.isArray(hostRoom) ? hostRoom.join(',') : hostRoom
      this.complexData.hostMfgr = Array.isArray(hostMfgr) ? hostMfgr.join(',') : hostMfgr
      this.complexData.hostType = Array.isArray(hostType) ? hostType.join(',') : hostType
      this.complexData.sysArea = Array.isArray(sysArea) ? sysArea.join(',') : sysArea
      this.complexData.hostSource = Array.isArray(hostSource) ? hostSource.join(',') : hostSource
    },
    /**
     * 新增设备
     */
    onAdd () {
      const obj = {
        editType: 'edit'
      }
      this.$router.push({
        path: '/inops/resource/edit',
        query: {
          obj
        }
      })
    },
    /**
     * 提交查询
     */
    onApply () {
      this.pages.current = 1
      this.pages.size = 10
      this.getListPage()
    },
    /**
     * 简单查询条件重置
     */
    onResetSimple () {
      this.simple = {
        condition: {
          hostName: 'like',
          osIp: 'like',
          bmcIp: 'like',
          resourcePool: 'eq',
          hostMfgr: 'eq',
          hostModel: 'like',
          hostType: 'eq'
        },
        hostName: '',
        osIp: '',
        bmcIp: '',
        resourcePool: '',
        hostMfgr: '',
        hostModel: '',
        hostType: ''
      }
    },
    /**
     * 高级查询条件重置
     */
    onResetComplex () {
      this.complex = {
        condition: {
          hostName: 'like',
          osIp: 'like',
          bmcIp: 'like',
          resourcePool: 'eq',
          hostRoom: 'eq',
          hostMfgr: 'eq',
          hostType: 'eq',
          hostModel: 'like',
          sysArea: 'eq',
          hostSource: 'eq'
        },
        hostName: '',
        osIp: '',
        bmcIp: '',
        resourcePool: [],
        hostRoom: [],
        hostMfgr: [],
        hostType: [],
        hostModel: '',
        sysArea: [],
        hostSource: []
      }
    },
    /**
     * 分页
     * @param current  当前页
     * @param pageSize 页码大小
     */
    handPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.getListPage()
    },
    /**
     * 删除事件
     */
    delEvent () {
      // 选中数据
      // const records = this.$refs.tbHost.getCheckboxRecords()
      // const ids = []
      if (this.table.select.length) {
        delHostAPI(this.table.select).then(res => {
          const { data } = res
          if (data.code === 200) {
            this.$message.success({ content: '删除成功', placement: 'center' })
            this.getListPage()
          }
        })
      } else {
        this.$message.error({ content: '请至少选择一条数据', placement: 'center' })
      }
    },
    /**
     * 编辑事件
     * @param row  选中行
     */
    editEvent (row) {
      const obj = {
        hostId: row.id,
        editType: 'edit',
        tab: 'edit'
      }
      this.$router.push({
        path: '/inops/resource/edit',
        query: {
          obj
        }
      })
    },
    /**
     * 字段设置（根据列设置是否显示同步搜索字段是否显示）
     * @param params 表格展示列
     * @returns {boolean}
     */
    setFields (params) {
      const excludeTitle = ['projectPeriod', 'updateDate']
      const excludeType = ['row-select', 'serial-number', 'operator']
      if (excludeType.includes(params) || excludeTitle.includes(params)) {
        return false
      }
      this.fieldList.forEach(item => {
        item.isSelect = params.includes(item.value)
      })
    },
    /**
     * 改变条件搜索范围时重置
     * @param value
     */
    changeSelectValue (value) {
      this.complex[value.value] = null
    },
    /**
     * 上传文件  todo
     * @returns {Promise<void>}
     */
    async uploadFile () {
      console.log(this.fileData)
      // this.fileLoading = true
      // this.fileData.append('file', this.dataFile)
      // await uploadFileAPI(this.fileData).then(async res => {
      //   const { data } = res
      //   if (data.code === 200) {
      //     this.$msg.message('center', 'positive', '导入成功', 1000)
      //     await this.getDeviceListOfPage()
      //     this.fileLoading = false
      //   }
      // })
    },
    /**
     * 表格排序
     * @param sortList
     */
    onSort (val) {
      this.simple.orders = []
      this.complexData.orders = []
      this.table.sort = val
      val.forEach(item => {
        if (this.isExpand) {
          this.complexData.orders.push({
            column: `a.${item.sortBy.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase()}`,
            asc: !item.descending
          })
        } else {
          this.simple.orders.push({
            column: `a.${item.sortBy.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase()}`,
            asc: !item.descending
          })
        }
      })
      this.getListPage()
    },
    /**
     * 表格列设置
     * @param params  选择列列名
     */
    onColumnChange (params) {
      this.setFields(params)
    },
    onSelectChange (value) {
      this.table.select = value
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-divider
  margin: 8px 0px 0px 0px
///deep/ .t-table.t-size-s td
//  padding: 3px 10px
/deep/ .t-table__header.t-table__header--fixed
    top: -2px
</style>
