<template>
  <div class="bg-mod-card" style="padding: 15px">
    <t-row>
      <t-col :md="3" :sm="4" :xs="6">
        <t-row align="center">
          <t-col :span="3">
            <span>审批人</span>
          </t-col>
          <t-col :span="9">
            <t-input v-model.trim="query.username" clearable style="width: 90%"></t-input>
          </t-col>
        </t-row>
      </t-col>
      <t-col :md="3" :sm="4" :xs="6">
        <t-row align="center">
          <t-col :span="3">
            <span>手机号码</span>
          </t-col>
          <t-col :span="9">
            <t-input v-model.trim="query.phone" clearable style="width: 90%"></t-input>
          </t-col>
        </t-row>
      </t-col>
      <t-col :md="3" :sm="4" :xs="6">
        <t-button theme="primary" style="margin-right: 15px" @click="onApply">查询</t-button>
        <t-button theme="default" @click="onReset">重置</t-button>
      </t-col>
    </t-row>
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
  </div>
</template>

<script>
import { pageList } from '@/utils/inops/u'
import { formatField } from '@/utils/inops/formatUtils'
import { getUserListApi } from '@/api/system/user'
import { getApproveListAPI } from '@/api/inops/approve/approveUser'

export default {
  name: 'user',
  data () {
    return {
      dict: {
        user: []
      },
      query: {
        username: '',
        phone: ''
      },
      table: {
        ref: 'tb_task',
        empty: '暂无数据',
        loading: false,
        maxHeight: '500',
        select: [],
        data: [],
        column: [
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'username', title: '用户名称', align: 'center', ellipsisTitle: true, cell: 'slot-user' },
          { colKey: 'phone', title: '审批号码', align: 'center', ellipsisTitle: true },
          { colKey: 'description', title: '备注信息', align: 'center', ellipsisTitle: true },
          { colKey: 'createBy', title: '创建人', align: 'center', ellipsisTitle: true, cell: 'slot-user' },
          { colKey: 'createDate', title: '创建时间', align: 'center', ellipsisTitle: true },
          { colKey: 'updateBy', title: '更新人', align: 'center', ellipsisTitle: true, cell: 'slot-user' },
          { colKey: 'updateDate', title: '更新时间', align: 'center', ellipsisTitle: true }
        ]
      },
      pages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 30,
        align: 'right'
      }
    }
  },
  async mounted () {
    await this.getUser()
    this.getData()
  },
  methods: {
    formatField,
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
            }
          }
        }
      })
    },
    getData () {
      const params = { pageSize: this.pages.size, pageNum: this.pages.current }
      getApproveListAPI(params, this.query).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.table.data = data.data.records
          const { total, size, current } = data.data
          this.pages = Object.assign(this.pages, { total, size, current })
          this.pages.list.push({ label: '全部', value: total })
          this.table.loading = false
        }
      })
    },
    onApply () {
      this.getData()
    },
    onReset () {
      this.query = {
        username: '',
        phone: ''
      }
    },
    onPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.getData()
    }
  }
}
</script>

<style scoped>

</style>
