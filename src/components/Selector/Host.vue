<template>
  <div style="width: 100%">
    <t-row>
      <!-- xs:小于760 sm:大于760 md:大于992 -->
      <t-col  :md="9" >
        <t-space v-show="!isExpand" style="margin-bottom: 15px">
          <t-row align="center" :gutter="[8, 12]">
            <t-col :span="3"  v-for="(item, index) in simpleFiledList" :key="index">
              <span class="text_font_size">{{ item.name }}</span>
              <t-input v-model.trim="simple[item.value]" v-if="item.type === 'input'" clearable style="width: 90%"></t-input>
              <t-select v-model="simple[item.value]" v-if="item.type === 'select'" clearable filterable style="width: 90%">
                <t-option v-for="(item, index) in dict[item.value]" :key="index" :label="item.label" :value="item.value" />
              </t-select>
            </t-col>
            <t-col :span="3" style="margin-top: 22px">
              <t-button theme="primary" style="margin-right: 8px" @click="onApply">查询</t-button>
              <t-button theme="default" variant="outline" @click="onResetSimple">重置</t-button>
            </t-col>
          </t-row>
        </t-space>
        <t-button size="small" variant="text" theme="primary" style="margin-bottom: 8px" @click="isExpand = !isExpand">
          <caret-down-icon slot="icon" v-show="!isExpand"  />
          <caret-up-icon slot="icon" v-show="isExpand"  />高级搜索
        </t-button>
        <t-card v-show="isExpand" bordered size="small" style="width: 100%; background-color: #F7F8FA; margin-bottom: 8px">
          <t-space>
            <t-row align="center" :gutter="[8, 12]">
              <t-col :span="4" v-for="(item, index) in fieldList" :key="index">
                <span class="text_font_size">{{ item.name }}</span>
                <t-row>
                  <t-col :span="3">
                    <t-select v-model="complexData.condition[item.value]" clearable filterable style="width: 100%">
                      <t-option v-for="(item, index) in item.statusList" :key="index" :label="item.label" :value="item.value" />
                    </t-select>
                  </t-col>
                  <t-col :span="9">
                    <t-input v-model.trim="complex[item.value]" v-if="item.type === 'input'" clearable  :placeholder="complexData.condition[item.value] === 'in' ?'请输入关键字，多值用逗号隔开': item.placeholder" style="width: 100%"></t-input>
                    <t-select
                      v-model="complex[item.value]"
                      v-else-if="item.type === 'select'"
                      clearable filterable
                      :minCollapsedNum="1"
                      :multiple="item.isMultiple[complexData.condition[item.value]]"
                      :options="dict[item.value]"
                      style="width: 100%">
                    </t-select>
                  </t-col>
                </t-row>
              </t-col>
              <t-col :span="4" style="margin-top: 22px">
                <t-button class="mr-5" theme="primary" style="margin-right: 8px" @click="onApply">查询</t-button>
                <t-button theme="default" variant="outline" @click="onResetComplex">重置</t-button>
              </t-col>
            </t-row>
          </t-space>
        </t-card>
        <div style="margin-top: 0px" :style="{ height: `${isExpand ? height * 0.35 : height * 0.35}px` }">
          <t-table
            hover resizable selectOnRowClick multipleSort
            row-key="id"
            size="small"
            table-layout="fixed"
            cell-empty-content="-"
            :max-height="`${isExpand ? height * 0.35 : height * 0.35}`"
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
            <template #slot-field="{ row, col }">
              {{ formatField(dict[col.colKey], 'label', row[col.colKey]) }}
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
              <t-input v-model.trim="filter" style="width: 60%; margin-right: 5px" placeholder="输入设备名称或设备IP"></t-input>
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
            <div class="scrollbar-style" style="padding-right: 3px;">
              <t-table
                bordered hover showHeader
                rowKey="id"
                size="small"
                table-layout="fixed"
                cellEmptyContent="-"
                :max-height="`${height * 0.44}`"
                :empty="checkTable.empty"
                :data="checkTable.data"
                :columns="checkTable.column"
                :loading="checkTable.loading"
                :selected-row-keys="checkTable.select"
                style="font-size: 12px"
                @select-change="onCheckSelectChange"
              >
                <template #icon="{ row }">
                  <svg-icon color="#165DFF" :name="row.hostType ? row.hostType : ''"></svg-icon>
                </template>
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
    <t-divider></t-divider>
    <t-row align="center">
      <t-col :span="11">
        <span style="color: #AAAEB7">共选择<span style="font-size: 16px; margin: 0px 8px; font-weight: bold; color: #507EF7">{{ checkList.length }}</span>台设备</span>
      </t-col>
      <t-col :span="1" style="text-align: end">
        <t-button theme="primary" @click="confirm" >确认选择</t-button>
      </t-col>
    </t-row>
  </div>
</template>

<script>
import { formatField } from '@/utils/inops/formatUtils'
import { getDictList, pageList, objectDistinct } from '@/utils/inops/u'
import { listPageAPI } from '@/api/inops/CMDB/cmdbDevice'
import { CaretDownIcon, CaretUpIcon } from 'tdesign-icons-vue'
const inputCondition = [
  { label: '包含', value: 'like' },
  { label: '等于', value: 'eq' },
  { label: '包括', value: 'in' },
  { label: '为空', value: 'empty' },
  { label: '不为空', value: 'nempty' }
]
const selectCondition = [
  { label: '等于', value: 'eq' },
  { label: '包括', value: 'in' },
  { label: '为空', value: 'empty' },
  { label: '不为空', value: 'nempty' }
]
const selectMultiple = { eq: false, in: true, empty: false, nempty: false }
export default {
  name: 'Host',
  components: {
    CaretDownIcon,
    CaretUpIcon
  },
  props: {
    hostList: {
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
      width: 0, // 宽度
      dict: {
        resourcePool: [], // 资源池
        hostRoom: [], // 机房
        hostType: [], // 设备类型
        hostMfgr: [], // 所属厂家
        hostSource: [], // 设备来源
        sysArea: [], // 网络区域
        major: [] // 所属专业
      }, // 字典
      simpleFiledList: [
        { name: '设备名称', type: 'input', value: 'hostName' },
        { name: '管理IP', type: 'input', value: 'osIp' },
        { name: '硬管IP', type: 'input', value: 'bmcIp' },
        { name: '资源池', type: 'select', value: 'resourcePool' },
        { name: '所属厂家', type: 'select', value: 'hostMfgr' },
        { name: '设备类型', type: 'select', value: 'hostType' },
        { name: '设备型号', type: 'input', value: 'hostModel' }
      ], // 简单查询字段
      simple: {
        // 条件（默认）
        condition: {
          hostName: 'like',
          osIp: 'like',
          bmcIp: 'like',
          resourcePool: 'eq',
          hostMfgr: 'eq',
          hostModel: 'like',
          hostType: 'eq'
        },
        hostName: '', // 主机名
        osIp: '', // 管理IP
        bmcIp: '', // bmcIP
        resourcePool: '', // 资源池
        hostMfgr: '', // 所属厂家
        hostModel: '', // 设备型号
        hostType: '', // 设备类型
        orders: [] // 排序
      }, // 简单查询对象
      isExpand: false, // 是否展开更多搜索
      fieldList: [
        {
          name: '设备名称',
          type: 'input',
          value: 'hostName',
          statusList: inputCondition,
          isShow: true,
          placeholder: '请输入'
        },
        {
          name: '管理IP',
          type: 'input',
          value: 'osIp',
          statusList: inputCondition,
          isShow: true,
          placeholder: '请输入'
        },
        {
          name: '硬管IP',
          type: 'input',
          value: 'bmcIp',
          statusList: inputCondition,
          isShow: true,
          placeholder: '请输入'
        },
        {
          name: '资源池',
          type: 'select',
          value: 'resourcePool',
          statusList: selectCondition,
          isShow: true,
          isMultiple: selectMultiple,
          placeholder: '请输入'
        },
        {
          name: '所属专业',
          type: 'select',
          value: 'major',
          statusList: selectCondition,
          isShow: true,
          isMultiple: selectMultiple,
          placeholder: '请输入'
        },
        {
          name: '所属机房',
          type: 'select',
          value: 'hostRoom',
          statusList: selectCondition,
          isShow: true,
          isMultiple: selectMultiple,
          placeholder: '请输入'
        },
        {
          name: '所属厂家',
          type: 'select',
          value: 'hostMfgr',
          statusList: selectCondition,
          isShow: true,
          isMultiple: selectMultiple,
          placeholder: '请输入'
        },
        {
          name: '设备类型',
          type: 'select',
          value: 'hostType',
          statusList: selectCondition,
          isShow: true,
          isMultiple: selectMultiple,
          placeholder: '请输入'
        },
        {
          name: '设备型号',
          type: 'input',
          value: 'hostModel',
          statusList: inputCondition,
          isShow: true,
          placeholder: '请输入'
        },
        {
          name: '归属',
          type: 'select',
          value: 'sysArea',
          statusList: selectCondition,
          isShow: true,
          isMultiple: selectMultiple,
          placeholder: '请输入'
        },
        {
          name: '数据来源',
          type: 'select',
          value: 'hostSource',
          statusList: selectCondition,
          isShow: true,
          isMultiple: selectMultiple,
          placeholder: '请输入'
        }
      ], // 更多查询字段
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
      }, // 更多查询对象
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
        hostName: '', // 设备名
        osIp: '', // 管理IP
        bmcIp: '', // bmcIP
        resourcePool: '', // 资源池
        major: '', // 专业
        hostRoom: '', // 机房
        hostMfgr: '', // 所属厂家
        hostType: '', // 设备类型
        hostModel: '', // 设备型号
        sysArea: '', // 网络区域
        hostSource: '', // 设备来源
        orders: [] // 排序
      }, // 更多查询处理对象
      table: {
        ref: 'tbHost',
        empty: '无纳管资源数据',
        loading: false,
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
          { colKey: 'updateDate', title: '更新时间', align: 'center', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', width: 80 }
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
          { colKey: 'icon', width: 50, align: 'center' },
          { colKey: 'hostName', title: '设备名称', align: 'left', ellipsis: true },
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
    },
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
    this.checkList = JSON.parse(JSON.stringify(this.hostList))
    this.setCheck()
    await this.getDict()
    await this.setValue()
    this.getListPage()
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
        this.isExpand = true
        Object.assign(this.complex, this.obj.value)
        Object.assign(this.complexData.condition, this.obj.condition)
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
     * 获取设备列表
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
        } else {
          this.$message.error({ content: '获取数据失败，请联系管理员', placement: 'center' })
        }
        this.table.loading = false
      })
    },
    /**
     * 查询参数处理
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
     * 提交查询
     */
    onApply () {
      this.pages.current = 1
      this.pages.size = 30
      this.getListPage()
    },
    /**
     * 简单查询重置
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
     * 复杂查询重置
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
     * @param current 当前页
     * @param pageSize 页大小
     */
    handPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.getListPage()
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
        let list = []
        const hostNameList = this.checkList.filter(item => {
          if (item.hostName) return item.hostName.indexOf(this.filter) > -1
        })
        const osIpList = this.checkList.filter(item => {
          if (item.osIp) return item.osIp.indexOf(this.filter) > -1
        })
        const bmcIpList = this.checkList.filter(item => {
          if (item.bmcIp) return item.bmcIp.indexOf(this.filter) > -1
        })
        list = objectDistinct([...hostNameList, ...osIpList, ...bmcIpList], 'id')
        this.checkPages.total = list.length
        this.checkTable.data = list.slice((this.checkPages.current - 1) * this.checkPages.size, this.checkPages.current * this.checkPages.size)
        this.checkPages.list[this.checkPages.list.length - 1].value = list.total
      } else {
        this.checkPages.total = this.checkList.length
        this.checkTable.data = this.checkList.slice((this.checkPages.current - 1) * this.checkPages.size, this.checkPages.current * this.checkPages.size)
        this.checkPages.list[this.checkPages.list.length - 1].value = this.checkPages.total
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
      this.$emit('hostCheck', this.checkList)
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
.text_font_size
  font-size: 12px
  color: #505968
.text_title
  color: #000000
  font-weight: bold
  font-size: 14px
  padding: 0px 15px
  //width: 93%
  //background-color: #165DFF
  text-align: center
  border-radius: 5px
  letter-spacing: 4px
//box-shadow: 5px 10px 10px -3px #AAAEB7
/deep/ .t-divider
  margin: 5px 0px 8px 0px
/deep/ .scrollbar-style::-webkit-scrollbar
  /*滚动条整体样式*/
  width : 6px !important /*高宽分别对应横竖滚动条的尺寸*/
/deep/ .scrollbar-style::-webkit-scrollbar-thumb
  /*滚动条里面小方块*/
  border-radius: 5px !important
  background: #027be3 !important
/deep/ .scrollbar-style::-webkit-scrollbar-track
  /*滚动条里面轨道*/
  border-radius: 50px !important
  background   : #ededed !important
/deep/ .t-table__header--fixed:not(.t-table__header--multiple) > tr > th
  color: #000000
/deep/ .t-table.t-size-s td
  padding: 1px 15px
/deep/ .t-dialog t-dialog--default t-dialog__modal-default
  position:fixed
  top: 0px

</style>
