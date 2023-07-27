<template>
  <div class="p-4">
    <div class="p-4 bg-white shadow-1" style="border-radius: 5px">
      <div class="l-row l-col-12 mt-2">
        <t-form class="l-row l-col-10" @submit="submit">
          <div class="l-row l-col-4 l-items-center l-vertical-middle">
            <span class="mr-4">变更任务名称：</span>
            <t-input
              v-model="condition.jobName"
              clearable
              style="width: 60%"
            />
          </div>
          <div class="l-row l-col-4 l-items-center l-vertical-middle">
            <span class="mr-4">执行方式：</span>
            <t-select
              v-model="condition.runOnly"
              clearable
              :options="[
                { label: '手动执行', value: '1' },
                { label: '自动（周期）执行', value: '0' },
              ]"
              style="width: 60%"
            />
          </div>
          <div class="l-row l-items-center justify-end l-vertical-middle">
            <t-button
              class="l-items-center l-vertical-middle"
              type="submit"
              content="查询"
              style="height: 32px"
            />
          </div>
        </t-form>
        <div class="l-row l-col-2 justify-end">
          <t-button
            class="l-items-center l-vertical-middle"
            ghost
            content="新增变更任务"
            style="height: 32px"
            @click="add"
          ></t-button>
        </div>
      </div>
      <div class="mt-4">
        <vxe-table
          class="text-black"
          align="left"
          auto-resize
          keep-source
          highlight-hover-row
          highlight-hover-column
          resizable
          ref="infoTable"
          id="infoTable"
          row-id="id"
          empty-text="暂无变更任务信息！"
          border="inner"
          max-height="500"
          size="mini"
          :loading="table.loading"
          :seq-config="{ startIndex: (pages.current - 1) * pages.size }"
          :checkbox-config="{ reserve: true }"
          :data="table.infoData"
        >
          <vxe-table-column
            v-for="(config, index) in table.column"
            :key="index"
            v-bind="config"
            :formatter="
              config.formatType
                ? [
                    config.formatType,
                    config.formatList ? dict[config.formatList] : null,
                  ]
                : ''
            "
          >
            <template v-slot="{ row }" v-if="config.field === 'status'">
              <!-- <q-chip
                v-if="row.changeStatus === 1"
                color="red-7"
                outline
                square
                size="sm"
                label="未执行（变更前）"
              ></q-chip> -->
              <span
                v-if="row.changeStatus === 1"
                class="px-6 text-mod-danger"
                style="
                  display: inline-block;
                  width: 96px;
                  height: 20px;
                  line-height: 18px;
                  border: 1px solid rgb(245 54 92);
                  border-radius: 4px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              >
                未执行(变更前)
              </span>
              <span
                v-else-if="row.changeStatus === 2"
                class="px-6 text-mod-primary"
                style="
                  display: inline-block;
                  width: 96px;
                  height: 20px;
                  line-height: 18px;
                  border: 1px solid rgb(94 114 228);
                  border-radius: 4px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              >
                已执行
              </span>
              <span
                v-else-if="row.changeStatus === 3"
                class="px-6 text-mod-danger"
                style="
                  display: inline-block;
                  width: 96px;
                  height: 20px;
                  line-height: 18px;
                  border: 1px solid rgb(245 54 92);
                  border-radius: 4px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              >
                未执行(变更后)
              </span>
              <span
                v-else-if="row.changeStatus === 4"
                class="px-6 text-mod-success"
                style="
                  display: inline-block;
                  width: 96px;
                  height: 20px;
                  line-height: 18px;
                  border: 1px solid rgb(45 206 137);
                  border-radius: 4px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                "
              >
                已完成
              </span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="operation"
            title="操作"
            align="center"
            width="450px"
          >
            <template v-slot="{ row }">
              <t-button
                size="small"
                variant="text"
                class="text-mod-primary"
                :disabled="row.changeStatus !== 1"
                content="变更前执行"
                @click="executeTask(row, 2)"
              />
              <t-button
                class="ml-1 text-mod-primary"
                variant="text"
                size="small"
                :disabled="row.changeStatus !== 2"
                content="确认变更"
                @click="changeStatus(row.id, 3)"
              />
              <t-button
                class="ml-1 text-mod-primary"
                variant="text"
                size="small"
                :disabled="row.changeStatus !== 3"
                content="变更后执行"
                @click="executeTask(row, 4)"
              />
              <t-button
                class="ml-1 text-mod-primary"
                variant="text"
                size="small"
                content="编辑"
                @click="edit(row.id)"
              />
              <t-button
                class="ml-1 text-mod-danger"
                variant="text"
                size="small"
                content="删除"
                @click="removeTask(row.id)"
              />
              <t-dropdown
                class="ml-1"
                :options="[
                  { content: '变更前导出', value: 1 },
                  { content: '变更后导出', value: 2 },
                ]"
                trigger="click"
                @click="clickHandler($event,row)"
              >
                <t-button class="text-mod-primary" variant="text" size="small"
                  >结果导出<span class="l-items-center"> <chevron-down-icon x size="12"
                /></span></t-button>
              </t-dropdown>

            </template>
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          class="pt-12 pb-16"
          size="mini"
          :current-page="pages.current"
          :page-size="pages.size"
          :total="pages.total"
          :page-sizes="pages.pageSizeList"
          :page-count="5"
        >
        </vxe-pager>
      </div>
    </div>
    <t-dialog
    :visible.sync="dialog.export"
        header="验收记录导出"
        width="1280px"
        placement="center"
        preventScrollThrough
        @confirm="dialog.export=false"
    >
      <t-card
        style="border-radius: 0px;min-height: 640px" :bordered="false"
      >
          <div class="l-row">
            <t-button
              class="mr-4"
              content="全量导出"
              @click="exportAll"
            ></t-button>
            <t-button
              content="导出选中"
  ghost
              @click="exportSelected"
            ></t-button>
          </div>
          <div class="mt-4">
            <vxe-table
              class="text-black"
              align="left"
              auto-resize
              keep-source
              highlight-hover-row
              highlight-hover-column
              resizable
              ref="itemTable"
              id="itemTable"
              row-id="id"
              empty-text="暂无验收项记录！"
              border="inner"
              max-height="500"
              size="mini"
              :loading="itemTable.loading"
              :checkbox-config="{ reserve: true }"
              :seq-config="{
                startIndex: (itemPages.current - 1) * itemPages.size,
              }"
              :data="itemTable.infoData"
            >
              <vxe-table-column
                v-for="(config, index) in itemTable.column"
                :key="index"
                v-bind="config"
                :formatter="
                  config.formatType
                    ? [
                        config.formatType,
                        config.formatType ? dict[config.formatList] : null,
                      ]
                    : ''
                "
              >
                <template
                  v-if="
                    config.field === 'hostCount' ||
                    config.field === 'okCount' ||
                    config.field === 'failCount' ||
                    config.field === 'unreachableCount'
                  "
                  v-slot="{ row }"
                >
                  <span
                    v-if="config.field === 'hostCount'"
                    class="text-mod-primary text-weight-bold cursor-pointer"
                    @click="getTaskResult(row, '')"
                    >{{ row.hostCount }}</span
                  >
                  <span
                    v-if="config.field === 'okCount'"
                    class="text-mod-success text-weight-bold cursor-pointer"
                    @click="getTaskResult(row, 'Ok')"
                    >{{ row.okCount }}</span
                  >
                  <span
                    v-if="config.field === 'failCount'"
                    class="text-mod-danger text-weight-bold cursor-pointer"
                    @click="getTaskResult(row, 'Fail')"
                    >{{ row.failCount }}</span
                    >
                    <span
                    v-if="config.field === 'unreachableCount'"
                    class="text-mod-warning text-weight-bold cursor-pointer"
                    @click="getTaskResult(row, 'Unreachable')"
                    >{{ row.unreachableCount }}</span
                  >
                </template>
              </vxe-table-column>
            </vxe-table>
          </div>
      </t-card>
    </t-dialog>
  </div>
</template>

<script>
import {
  getTaskAPI,
  executeOnce,
  delTaskAPI,
  updateChangeStatusAPI
} from '@/api/inops/change/change'
import { formatDate } from '@/utils/inops/dateUtils'
import { getUserListApi } from '@/api/system/user'
import { getDictList } from '@/utils/inops/u'
import { countOfTaskAPI } from '@/api/inops/job/jobStatus'
import { ChevronDownIcon } from 'tdesign-icons-vue'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
import axios from 'axios'

export default {
  name: 'taskList',
  components: { ChevronDownIcon },
  data () {
    return {
      dict: {
        list: ['jobStatus'],
        user: [],
        jobStatus: []
      },
      url: '',
      date: '',
      condition: {
        jobName: '',
        runOnly: '',
        type: 'change'
      },
      runOnly: '',
      table: {
        loading: true,
        infoData: [],
        column: [
          { type: 'checkbox', align: 'center', width: '40' },
          { type: 'seq', title: '序号', align: 'center', width: '50' },
          {
            field: 'jobName',
            title: '变更任务名称',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '14%'
          },
          {
            field: 'runOnly',
            title: '执行方式',
            formatType: 'formatExecuteType',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'status',
            title: '执行状态',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '150px'
          },
          {
            field: 'jobExpression',
            title: '执行周期',
            formatType: 'formatExpression',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'ignoreErrors',
            title: '忽略错误执行下一步骤',
            formatType: 'formatterIgnore',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '10%'
          },
          {
            field: 'createBy',
            title: '创建人',
            formatType: 'formatUser',
            formatList: 'user',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'createDate',
            title: '创建时间',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'updateDate',
            title: '更新时间',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          }
        ]
      },
      pages: {
        pageSizeList: [
          10,
          50,
          100,
          500,
          1000,
          2000,
          { label: '全部', value: '' }
        ],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      executeJob: {
        jobId: '',
        jobName: '',
        type: '验收任务'
      },
      dialog: {
        export: false
      },
      rowData: null,
      itemTable: {
        loading: false,
        infoData: [],
        column: [
          { type: 'checkbox', align: 'center', width: '40' },
          { type: 'seq', title: '序号', align: 'center', width: '50' },
          {
            field: 'jobName',
            title: '作业名称',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'taskName',
            title: '验收项',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'createBy',
            title: '创建人',
            formatType: 'formatUser',
            formatList: 'user',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'executeDate',
            title: '执行日期',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          }
        ]
      },
      itemPages: {
        total: 0,
        current: 1,
        size: 100,
        align: 'right'
      },
      itemCheck: []
    }
  },
  async mounted () {
    this.url = process.env.VUE_APP_BASE_URL
    const date = new Date()
    this.date = formatDate(date)
    await this.getDict()
    await this.getUserDict()
    this.getTaskList()
  },
  methods: {
    async getDict () {
      for (const item of this.dict.list) {
        this.dict[item] = await getDictList(item)
      }
    },
    async getUserDict () {
      await getUserListApi().then((response) => {
        const { data } = response
        if (data.code === 0) {
          for (const item of data.data) {
            this.dict.user.push(item)
          }
        }
      })
    },
    getTaskList () {
      const params = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      this.table.loading = true
      getTaskAPI(params, this.condition).then((response) => {
        const { data } = response
        if (data.code === 200) {
          this.table.infoData = data.data.records
          this.pages.total = data.data.total
          const index = this.pages.pageSizeList.findIndex(
            (v) => v.label === '全部'
          )
          this.pages.pageSizeList[index].value = Math.floor(this.pages.total)
          this.pages.size = data.data.size
          this.pages.current = data.data.current
          this.table.loading = false
        }
      })
    },
    submit () {
      this.getTaskList()
    },
    pagesLimit ({ currentPage, pageSize }) {
      this.pages.current = currentPage
      this.pages.size = pageSize
      this.getTaskList()
    },
    add () {
      this.$router.push({
        path: '/inops/changeCheck/task'
      })
    },
    removeTask (id) {
      this.$XModal.confirm('您确定要删除选中的数据吗?').then((type) => {
        if (type === 'confirm') {
          delTaskAPI(id).then((response) => {
            const { data } = response
            if (data.code === 200) {
              this.$message.success({ content: '删除成功', placement: 'center' })
            } else {
              this.$message.error({ content: '删除失败，请联系管理员', placement: 'center' })
            }
            this.getTaskList()
          })
        }
      })
    },
    edit (id) {
      const query = {
        // taskName: row.jobName,
        // taskType: 'change',
        // changeStatus: num,
        jobId: id
      }
      this.$router.push({
        path: '/inops/changeCheck/task',
        query
      })
    },
    async executeTask (row, num) {
      if (num === 2) {
        await executeOnce(row.id).then((response) => {
          const { data } = response
          if (data.code === 200) {
            const query = {
              id: data.data.taskId,
              taskName: row.jobName,
              taskType: 'change',
              changeStatus: num,
              jobId: row.id
            }
            this.$router.push({
              path: '/inops/changeCheck/execute',
              query
            })
          }
        })
        this.changeStatus(row.id, num)
      } else {
        const query = {
          taskName: row.jobName,
          taskType: 'change',
          changeStatus: num,
          jobId: row.id
        }
        this.$router.push({
          path: '/inops/changeCheck/task',
          query
        })
      }
      this.getTaskList()
    },
    changeStatus (id, status) {
      const data = {
        jobId: id,
        status
      }
      updateChangeStatusAPI(data).then((res) => {
        const { data } = res
        if (data.code !== 200) {
          this.$message.success({ content: '修改状态失败', placement: 'center' })
        }
      })
      if (status === 3) {
        this.getTaskList()
      }
    },
    exportEvent (row) {
      this.rowData = row
      const params = {
        pageSize: this.itemPages.size,
        pageNum: this.itemPages.current
      }
      const data = {
        templateId: row.id
      }
      countOfTaskAPI(params, data).then((res) => {
        const { data } = res
        if (data.code === 200) {
          this.itemTable.infoData = data.data.records
        }
      })
      this.dialog.export = true
    },
    exportAll () {
      this.$refs.itemTable.setAllCheckboxRow(true)
      this.downloadResult(this.rowData, 'All')
    },
    async exportSelected () {
      const records = this.$refs.itemTable.getCheckboxRecords()
      if (records.length === 0) {
        this.$message.warning({ content: '请至少选择一项验收项导出', placement: 'center' })
      } else {
        this.itemCheck = []
        for (const item of records) {
          await this.itemCheck.push(item.taskNum)
        }
        this.downloadResult(this.rowData, 'depart')
      }
    },
    // 单条结果下载
    downloadResult (row, isBefore) {
      // this.$message.error({ content: '下载失败，请联系管理员', placement: 'center' })
      const params = {
        jobId: row.id,
        before: isBefore
      }
      const exportUrl = `${this.url}/inops/change/taskResult/excelDownload`
      const fileName = `${row.jobName}_${this.date}.xls`
      // batchDownload(exportUrl, params, fileName)
      axios({
        method: 'get',
        url: exportUrl,
        params,
        responseType: 'blob'
        // headers: { token: Storage.get(ACCESS_TOKEN, '') }
      }).then(res => {
        // console.log(res)
        const href = URL.createObjectURL(new Blob([res.data]))
        // console.log(href)
        const a = document.createElement('a')
        a.setAttribute('href', href)
        a.setAttribute('download', fileName)
        a.click()
        URL.revokeObjectURL(href)
      }).catch(() => {
        this.$message.error({ placement: 'center', content: '文件下载失败，请联系系统管理员' })
      })
    },
    clickHandler (data, row) {
      if (data.value === 1) {
        return this.downloadResult(row, true)
      }
      return this.downloadResult(row, false)
    }
  }
}
</script>

<style lang="sass" scoped>
.status-point
  display: inline-block
  width: 5px
  height: 5px
  border-radius: 50%
  margin-right: 5px
</style>
