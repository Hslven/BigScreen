<template>
  <div class="bg-mod-card" style="padding: 15px">
    <t-row :gutter="[0, 16]">
      <t-col :md="3" :sm="4" :xs="6" v-for="(item, index) in field" :key="index">
        <t-row align="center">
          <t-col :md="4" :sm="5" :xs="4">
            <span>{{ item.name }}</span>
          </t-col>
          <t-col :md="8" :sm="7" :xs="8">
            <t-input v-if="item.type === 'input'" v-model.trim="query[item.value]" clearable style="width: 90%"></t-input>
            <t-select v-else-if="item.type === 'select'" v-model="query[item.value]" clearable filterable style="width: 90%">
              <t-option v-for="(item, index) in dict[item.options]" :key="index" :label="item.label" :value="item.value" />
            </t-select>
          </t-col>
        </t-row>
      </t-col>
      <t-col :md="3" :sm="4" :xs="6">
        <t-button theme="primary" style="margin-right: 15px" @click="onApply">查询</t-button>
        <t-button theme="default" @click="onReset()">重置</t-button>
      </t-col>
    </t-row>
    <t-divider style="margin-top: 30px"></t-divider>
     <div style="margin-top: 10px">
      <t-row>
        <t-button variant="outline" theme="default" @click="manageApprove">
          <t-row align="center">
            <mod-icon name="how_to_reg" ></mod-icon>
            <span style="color: rgba(80, 89, 104, 1);margin-left: 5px">管理员审批</span>
          </t-row>
        </t-button>
      </t-row>
    </div>
    <div style="margin-top: 15px">
      <t-table
        stripe bordered hover showHeader resizable
        rowKey="index"
        size="small"
        table-layout="fixed"
        cellEmptyContent="-"
        :empty="table.empty"
        :data="table.data"
        :columns="table.column"
        :loading="table.loading"
        :selected-row-keys="table.select"
        style="color: #000000"
      >
        <template #slot-user="{ row, col }">
          {{ formatField(dict.user, 'label', row[col.colKey]) }}
        </template>
        <template #slot-timeLimit="{ row }">
          {{ approveTime(row.startTime, row.expireTime) }}
        </template>
        <template #slot-approveType="{ row }">
          {{ formatField(dict.approveState, 'label', row.approveState) }}
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
    <t-dialog :visible.sync="dialog.visible" header="管理员审批" width="40%" :footer="false">
      <div style="padding-left: 20px;" align="center">
        <t-row style="padding-top: 20px;">
            <t-col :span="2"><span>审批用户：</span></t-col>
            <t-col :span="6">
              <t-select  style="width: 100%" :options="dict.userList" v-model="approveQuery.approveBy" clearable></t-select></t-col>
        </t-row>
        <t-row align="center" style="padding-top: 20px;">
          <t-col :span="2">
            <span>添加权限：</span>
          </t-col>
          <t-col :span="6">
            <t-select  style="width: 100%" :options="dict.approve" v-model="approveQuery.approveType" clearable multiple :minCollapsedNum="1"></t-select>
          </t-col>
        </t-row>
         <t-row align="center" style="padding-top: 20px;">
          <t-col :span="2">
            <span>审批时效：</span>
          </t-col>
          <t-col :span="6">
            <t-date-range-picker
            enable-time-picker
            allow-input clearable
            v-model="approveQuery.date"
            :disable-date="disableDate"
            style="width: 110%"/>
          </t-col>
        </t-row>
        </div>
        <div style="padding-top: 40px;margin: -12px;">
            <t-row class="footer">
            <t-col :span="2">
              <t-button style="width: 80px;height: 40px;" @click="approveConfirm">审批</t-button>
            </t-col>
            <t-col :span="2"><t-button theme="default" @click="approveCanal" class="mr-5" variant="outline" style="width: 80px;height: 40px;">取消</t-button></t-col>
            </t-row>
        </div>
    </t-dialog>
  </div>
</template>

<script>
import { getUserListApi } from '@/api/system/user'
import { formatField } from '@/utils/inops/formatUtils'
import { approveTime } from '@/utils/inops/dateUtils'
import { pageList } from '@/utils/inops/u'
import { getApproveRecordsAPI } from '@/api/inops/approve/records'
import { approveByAdminAPI } from '@/api/inops/approve/approve'
import moment from 'moment'
export default {
  name: 'records',
  data () {
    return {
      dict: {
        user: [],
        userList: [],
        approve: [
          { label: 'assignUser (指定账号)', value: 'assignUser' },
          { label: 'become (su提权)', value: 'become' },
          { label: 'large (大设备)', value: 'large' }
        ],
        approveState: [{ label: '不通过', value: '0' }, { label: '通过', value: '1' }, { label: '审批中', value: '2' }]
      },
      // 查询字段
      field: [
        { name: '用户ID', value: 'userId', type: 'input' },
        { name: '审批类型', value: 'approveType', type: 'input' },
        { name: '审批状态', value: 'approveState', type: 'select', options: 'approveState' },
        { name: '审批人', value: 'approveBy', type: 'select', options: 'user' },
        { name: '申请人', value: 'createBy', type: 'select', options: 'user' }
      ],
      // 查询条件
      query: {
        userId: '', // 用户ID
        approveType: '', // 审批类型
        approveState: '', // 审批状态
        approveBy: '', // 审批人
        createBy: '' // 申请人
      },
      approveQuery: {
        approveBy: '',
        approveType: [],
        date: []
      },
      dialog: {
        visible: false
      },
      // 表格
      table: {
        ref: 'tb_task',
        empty: '暂无数据',
        loading: false,
        maxHeight: '600',
        select: [],
        data: [],
        column: [
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'userId', title: '审批用户', align: 'center', ellipsis: true, cell: 'slot-user' },
          { colKey: 'approveType', title: '审批类型', align: 'center', ellipsis: true },
          { colKey: 'approveState', title: '审批状态', align: 'center', ellipsis: true, cell: 'slot-approveType' },
          { colKey: 'approveBy', title: '审批人', align: 'center', ellipsis: true, cell: 'slot-user' },
          { colKey: 'timeLimit', title: '申请时效', align: 'center', ellipsis: true, cell: 'slot-timeLimit' },
          { colKey: 'approveTime', title: '审批时间', align: 'center', ellipsis: true },
          { colKey: 'startTime', title: '开始时间', align: 'center', ellipsis: true },
          { colKey: 'expireTime', title: '过期时间', align: 'center', ellipsis: true },
          { colKey: 'createBy', title: '创建人', align: 'center', ellipsis: true, cell: 'slot-user' },
          { colKey: 'createDate', title: '创建时间', align: 'center', ellipsis: true },
          { colKey: 'updateBy', title: '更新人', align: 'center', ellipsis: true, cell: 'slot-user' },
          { colKey: 'updateDate', title: '更新时间', align: 'center', ellipsis: true }
        ]
      },
      // 分页
      pages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 30,
        align: 'right'
      },
      selectPriceDate: '',
      offsetDays: 6 * 24 * 60 * 60 * 1000 // 最多选择范围6天ms
    }
  },
  async mounted () {
    this.table.loading = true
    await this.getUser()
    this.getData()
  },
  watch: {
    approveQuery: {
      handler (newVal) {
        if (newVal.date[0] !== '' && newVal.date[1] !== '') {
          const begin = new Date(newVal.date[0]).getTime()
          const end = new Date(newVal.date[1]).getTime()
          const hour = parseInt(end - begin) / 1000 / 60 / 60
          if (hour > 5) {
            this.$message.error({ content: '时效不能超过5个小时，请重新选择', placement: 'center' })
            this.approveQuery.date = []
          }
        }
        console.log('审批用户信息', newVal)
      },
      deep: true
    }
  },
  methods: {
    formatField,
    approveTime,
    /**
     * 获取用户列表
     * @returns {Promise<void>}
     */
    async getUser () {
      await getUserListApi().then(res => {
        const { data } = res
        if (data.code === 0) {
          for (const item of data.data) {
            if (item.delFlag === '0') {
              const params = {
                label: item.userName,
                value: (item.userId).toString(),
                name: item.nickName
              }
              this.dict.user.push(params)
              this.dict.userList.push({ label: item.nickName, value: item.userId.toString() })
            }
          }
        }
      })
    },
    getData () {
      this.table.loading = true
      const params = { pageSize: this.pages.size, pageNum: this.pages.current }
      getApproveRecordsAPI(params, this.query).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.table.data = data.data.records
          const { total, size, current } = data.data
          this.pages = Object.assign(this.pages, { total, size, current })
          this.pages.list.push({ label: '全部', value: total })
          this.table.loading = false
        } else {
          this.$message.error({ content: '查询数据失败，请联系管理员', placement: 'center' })
          this.table.loading = false
        }
      })
    },
    onApply () {
      this.getData()
    },
    onReset () {
      this.query = {
        userId: '',
        approveType: '',
        approveState: '',
        approveBy: '',
        createBy: ''
      }
    },
    onPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.getData()
    },
    // 管理员审批
    manageApprove () {
      this.dialog.visible = true
    },
    async approveConfirm () {
      const params = {
        userId: this.approveQuery.approveBy,
        approveType: this.approveQuery.approveType.join(','),
        startTime: this.approveQuery.date[0],
        expireTime: this.approveQuery.date[1]
      }
      await approveByAdminAPI(params).then(res => {
        const { data } = res
        console.log('data', data)
        if (data.code === 200) {
          this.$message.success({ content: '添加审批成功', placement: 'center' })
          this.dialog.visible = false
          this.getData()
        } else {
          this.$message.success({ content: '添加审批失败，请联系管理员', placement: 'center' })
          this.dialog.visible = false
          this.getData()
        }
      })
    },
    disableDate (current) {
      return current && current < moment().subtract(1, 'days').endOf('day')
    },
    approveCanal () {
      this.dialog.visible = false
      this.approveQuery.approveBy = ''
      this.approveQuery.approveType = []
      this.approveQuery.date = []
    }
  }
}
</script>

<style lang="sass" scoped>
.footer
  display: flex
  flex-direction: row-reverse
  align-content: space-around
  align-items: center
  height: 95px
  opacity: 1
  background: rgba(247, 248, 250, 1)
  border: 1px solid rgba(224, 225, 230, 1)
</style>
