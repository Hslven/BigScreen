<template>
  <div>
    <content-header></content-header>
    <div class="bg-mod-card rounded-sm">
      <t-row :gutter="16">
        <t-col :span="12">
          <div class="m-4">
            <t-input v-model="globalFilter" placeholder="全局搜索">
              <search-icon slot="prefix-icon"></search-icon>
            </t-input>
          </div>
        </t-col>
      </t-row>
      <t-table
        rowKey="index"
        :columns="columns"
        :data.sync="data"
        size="small"
        :pagination="pagination"
        @data-change="dataChange"
        style="font-size: 12px;"
        cellEmptyContent = "-"
        class="px-8"
      >
        <template #plan="{ row }">
            <a class="table-main-font" style="text-decoration: none;">{{ row.plan.when }}</a>
            <p style="font-size: 12px;font-weight: 400;margin: 0 0 0px !important;" class="text-mod-body">{{ schedule_format(row.plan.type) }}</p>
        </template>
        <template #roles-slot="{ row }">
          <t-space v-for="(role, index) in row.roles" v-bind:key="index">
            <t-tag theme="primary" class="mr-2 mb-2" variant="light">{{ role }}</t-tag>
          </t-space>
        </template>
        <template #operation="{ row }">
          <t-link theme="primary" hover="color" @click="deleteSchedule(row)">
            删除
          </t-link>
        </template>
      </t-table>
    </div>
  </div>
</template>

<script>
import { getScheduleListApi, deleteScheduleApi } from '@/api/modServer/schedule'
import { SearchIcon } from 'tdesign-icons-vue'
import ContentHeader from '@/components/contentHeader/header'
import globalSearch from '@/mixins/globalSearch'
import { scheduleTable } from '@/dict/columns'
export default {
  name: 'index',
  mixins: [globalSearch],
  components: {
    ContentHeader,
    SearchIcon
  },
  data () {
    return {
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 12,
        total: 0,
        showJumper: true
      },
      data: [],
      // 表格列名字段
      columns: scheduleTable.columns
    }
  },
  created () {},
  mounted () {
    this.getScheduleList()
  },
  computed: {
    schedule_format () {
      return function (value) {
        const scheduleDict = {
          every: '周期任务',
          schedule: '定时任务'
        }
        return scheduleDict[value]
      }
    }
  },
  methods: {
    dataChange (data) {
      this.data = data
    },
    getScheduleList () {
      return new Promise((resolve, reject) => {
        getScheduleListApi().then(response => {
          const { data } = response
          const scheduleList = []
          if (data.status === 'success') {
            const scheduleDict = {}
            data.data.forEach((val, index) => {
              scheduleDict.schedule_id = val.id
              scheduleDict.name = val.data.mod.name
              scheduleDict.mod_id = val.data.mod.id
              scheduleDict.params = val.data.mod.params
              scheduleDict.user = val.data.user
              scheduleDict.plan = val.data.plan
              scheduleList.push(JSON.parse(JSON.stringify(scheduleDict)))
            })
            this.data = scheduleList
            this.getInitData(this.data)
            this.pagination.total = this.data.length
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.message)
        })
      })
    },
    deleteSchedule (row) {
      const confirmDia = this.$dialog.confirm({
        header: '删除调度任务',
        theme: 'warning',
        body: `是否确定删除该调度任务: ${row.name}`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        onConfirm: ({ e }) => {
          return new Promise((resolve, reject) => {
            deleteScheduleApi(row.schedule_id, row.mod_id).then(response => {
              const { data } = response
              if (data.status === 'success') {
                this.$message.success('删除成功')
                this.getScheduleList()
                confirmDia.destroy()
              } else {
                this.$message.error(data.msg)
              }
            }).catch(error => {
              this.$message.error(error.response.data.msg)
            })
          })
        },
        onClose: ({ e, trigger }) => {
          confirmDia.hide()
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
