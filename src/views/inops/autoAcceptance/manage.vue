<template>
  <div class="bg-mod-card p-4">
    <div class="p-4 shadow-1" style="border-radius: 5px">
      <t-row>
        <t-col :span="7">
          <div>
            <t-form
              :data="condition"
              layout="inline"
              ref="form"
              @submit="submit"
              scrollToFirstError="smooth"
            >
              <t-form-item label="验收任务名称：" name="jobName">
                <t-input v-model="condition.jobName" placeholder="请输入验收任务名称"></t-input>
              </t-form-item>
              <t-form-item label="执行方式：" name="runOnly">
                <t-select
                  v-model="condition.runOnly"
                  emit-value
                  map-options
                  :options="[
                    { label: '手动执行', value: '1' },
                    { label: '自动（周期）执行', value: '0' },
                  ]"
                />
              </t-form-item>
              <t-form-item>
                <t-button theme="primary" type="submit">查询</t-button>
              </t-form-item>
            </t-form>
          </div>
        </t-col>
        <t-col :span="5"  style="text-align: right;">
          <div>
            <t-dropdown
              hideAfterItemClick
              trigger="click"
              :options="[
                { content: '手动执行', value: 'manual' },
                { content: '自动执行', value: 'auto' },
              ]"
              minColumnWidth="130px"
              @click="add($event)"
            >
              <t-button ghost style="background-color: #165dff">
                <span class="tdesign-demo-dropdown__text text-white">
                  新增验收任务
                  <chevron-down-icon size="16" />
                </span>
              </t-button>
            </t-dropdown>
          </div>
        </t-col>
      </t-row>
      <div class="mt-4">
        <vxe-table
          class="text-black"
          auto-resize
          keep-source
          resizable
          highlight-hover-row
                highlight-hover-column
          ref="infoTable"
          id="infoTable"
          row-id="id"
          empty-text="暂无验收任务信息！"
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
            align="left"
            :formatter="
              config.formatType
                ? [
                    config.formatType,
                    config.formatList ? dict[config.formatList] : null,
                  ]
                : ''
            "
          >
            <template v-slot="{ row }" v-if="config.field === 'editable'">
              <span
                class="font-bold box_status"
                :class="
                  row.editable === '0'
                    ? 'text-mod-success'
                    : 'text-mod-primary box_unstatus'
                "
                >{{ statusFormat(row.editable) }}</span
              >
            </template>
          </vxe-table-column>
          <vxe-table-column
            field="operation"
            title=" 操作"
            align="left"
            width="250px"
          >
            <template v-slot="{ row }">
              <t-button
                class="mr-2 pl-0"
                :theme="row.editable === '0' ? 'default' : 'primary'"
                variant="text"
                size="small"
                :disabled="row.editable === '0'"
                @click="executeTask(row.id, row.jobName)"
                content="立即执行"
                style="margin-left: -8px"
              />
              <t-button
                class="mr-2"
                theme="primary"
                variant="text"
                size="small"
                @click="edit(row.id, row.runOnly === '0' ? 'auto' : 'manual')"
                :content="row.editable === '0' ? '复制' : '编辑'"
              />
              <t-button
                class="mr-2"
                theme="primary"
                variant="text"
                size="small"
                @click="removeTask(row.id)"
                v-show="row.editable !== '0'"
                content="删除"
              />
              <t-button
                class=""
                theme="primary"
                variant="text"
                size="small"
                v-show="row.editable === '0'"
                @click="exportEvent(row)"
                content="导出报告"
              />
            </template>
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          class="mt-4 pt-8 pb-16"
          size="mini"
          :current-page="pages.current"
          :page-size="pages.size"
          :total="pages.total"
          :page-sizes="pages.pageSizeList"
          :page-count="5"
          @page-change="pagesLimit"
        >
        </vxe-pager>
      </div>
    </div>
    <t-dialog
      header="验收记录导出"
      placement="center"
      width="1192px;"
      preventScrollThrough
      v-if="dialog.export"
      :visible.sync="dialog.export"
      :footer="false"
    >
      <t-card style="min-height: 634px" :bordered="false">
        <div class="row pl-2">
          <t-button
            class="mr-4"
            theme="primary"
            content="全量导出"
            @click="exportAll"
          />
          <t-button
            ghost
            theme="primary"
            content="导出选中"
            @click="exportSelected"
          />
        </div>
        <div class="mt-4">
          <vxe-table
            class="text-black"
            auto-resize
            keep-source
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
              align="left"
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
                  class="text-primary font-bold cursor-pointer"
                  @click="getTaskResult(row, '')"
                  style="text-decoration: underline"
                  >{{ row.hostCount }}</span
                >
                <span
                  v-if="config.field === 'okCount'"
                  class="text-positive font-bold cursor-pointer"
                  @click="getTaskResult(row, 'Ok')"
                  style="text-decoration: underline"
                  >{{ row.okCount }}</span
                >
                <span
                  v-if="config.field === 'failCount'"
                  class="text-negative font-bold cursor-pointer"
                  @click="getTaskResult(row, 'Fail')"
                  style="text-decoration: underline"
                  >{{ row.failCount }}</span
                >
                <span
                  v-if="config.field === 'unreachableCount'"
                  class="text-warning font-bold cursor-pointer"
                  @click="getTaskResult(row, 'Unreachable')"
                  style="text-decoration: underline"
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
import { getTaskAPI, executeOnce, delTaskAPI } from '@/api/inops/accept/accept'
import { formatDate } from '@/utils/inops/dateUtils'
import { batchDownload } from '@/utils/inops/file'
import { getUserListApi } from '@/api/system/user'
import { countOfTaskAPI } from '@/api/inops/job/jobStatus'
import { ChevronDownIcon } from 'tdesign-icons-vue'
export default {
  name: 'manage',
  components: { ChevronDownIcon },
  data () {
    return {
      dict: {
        user: []
      },
      url: '',
      date: '',
      condition: {
        jobName: '',
        runOnly: '',
        type: 'accept'
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
            title: '巡检任务名称',
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
            field: 'editable',
            title: '执行状态',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            width: '100',
            field: 'jobExpression',
            title: '执行周期',
            formatType: 'formatExpression',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            width: '150',
            field: 'ignoreErrors',
            title: '忽略错误执行下一步骤',
            formatType: 'formatterIgnore',
            align: 'center',
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
        export: false,
        executeResult: false
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
    await this.getUserDict()
    this.getTaskList()
  },
  watch: {
    'dialog.executeResult': {
      handler (newVal) {
        if (!newVal) {
          this.getTaskList()
        }
      }
    }
  },
  methods: {
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
    add ($event) {
      this.$router.push({
        path: `/inops/autoAcceptance/${$event.value}`
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
    edit (id, type) {
      this.$router.push({
        path:
          type === 'auto'
            ? '/inops/autoAcceptance/auto'
            : '/inops/autoAcceptance/manual',
        query: {
          id
        }
      })
    },
    executeTask (id, jobName) {
      executeOnce(id).then((response) => {
        const { data } = response
        if (data.code === 200) {
          const obj = {
            taskId: data.data.taskId,
            backUrl: '/inops/autoAcceptance/manage',
            name: jobName,
            type: 'schedule',
            isNew: true
          }
          this.$router.push({
            path: '/inops/util/execute',
            query: { obj }
          })
        } else {
          this.$message.error({ content: '执行失败', placement: 'center' })
        }
      })
    },
    statusFormat (value) {
      if (value === '0') {
        return '已执行'
      } else {
        return '未执行'
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
    downloadResult (row, type) {
      let params = {}
      if (type === 'All') {
        params = {
          jobId: this.itemTable.infoData[0].jobId,
          executeDate: row.executeDate
        }
      } else {
        params = {
          jobId: this.itemTable.infoData[0].jobId,
          executeDate: row.executeDate,
          taskNum: this.itemCheck.join(',')
        }
      }
      const exportUrl = `${this.url}/inops/accept/taskResult/excelDownload`
      const fileName = `${row.jobName}_${this.date}.xlsx`
      batchDownload(exportUrl, params, fileName)
    }
  }
}
</script>

<style lang="sass" scoped>

/deep/ table
  width: 100%;

.box_status
  display: block;
  width: 53px;
  height: 22px;
  text-align: center;
  opacity: 1;
  border-radius: 2px;
  background: rgba(246, 255, 237, 1);
  border: 1px solid rgba(183, 235, 143, 1);

.box_unstatus
  background: rgba(230, 247, 255, 1)!important;
  border: 1px solid rgba(145, 213, 255, 1)!important;
</style>
