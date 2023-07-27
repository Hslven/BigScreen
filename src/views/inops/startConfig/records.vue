<template>
  <div>
  <div>
      <div class="bg-white shadow-1">
        <div style="padding: 0 10px">
          <t-form class="l-row">
            <div class="l-row l-col-12 l-col-md-12 pl-7 pt-6 justify-between">
              <div class="l-row l-col-3 mb-4 l-col-sm-4 l-items-center vertical-middle">
                <span>作业名称：</span>
                <t-input
                  v-model="searchCondition.jobName"
                  clearable
                  class="pr-4 l-col-8 l-"
                />
              </div>
              <div class="l-row l-col-3 mb-4 l-col-sm-4 l-items-center vertical-middle">
                <span>操作用户：</span>
                <t-select
                  v-model="searchCreateBy"
                  clearable
                  emit-value
                  map-options
                  :options="dict.userOptions"
                  class="pr-4 l-col-8 l-"/>
              </div>
              <div class="l-row l-col-3 mb-4 l-col-sm-4 l-items-center vertical-middle">
                <span>作业状态：</span>
                <t-select
                  v-model="searchStatus"
                  clearable
                  emit-value
                  map-options
                  :options="dict.jobStatus"
                  class="pr-4 l-col-8 l-"/>
              </div>
              <div class="l-row l-col-3 mb-4 l-col-sm-4 l-items-center vertical-middle">
                <span>创建时间：</span>
              <t-date-range-picker allow-input clearable @change="onChange" v-model="searchCondition.rangeTime" style="width:70%"/>
              </div>
              <div class="l-row l-col-4 l-col-sm-4 mr-16 " style="padding-right: 20px;">
                <t-button
                  class="column l-items-center vertical-middle mr-4"
                  theme="primary"
                  style="height: 32px"
                  @click="searchEvent()"
                  >查询</t-button
                >
                <t-button
                  class="column l-items-center vertical-middle"
                  theme="default"
                  style="height: 32px"
                  @click="resetEvent()"
                  >重置</t-button
                >
              </div>
              <!-- <div class="l-row l-col-md-4 l-l-col-sm-4">
                <q-btn color="primary" label="查询" class="q-mr-md" size="sm" @click="searchEvent()"/>
                <q-btn label="重置" size="sm" @click="resetEvent()"/>
              </div> -->
            </div>
          </t-form>
        </div>
            <div class="mt-4 px-7">
              <vxe-table
                ref="jobStatusTable"
                id="jobStatusTable"
                empty-text="暂无任务执行记录！"
                border="inner"
                algn="left"
                auto-resize
                keep-source
                highlight-hover-row
                highlight-hover-column
                resizable
                max-height="550"
                size="mini"
                :data="infoData"
                :import-config="{}"
                :export-config="{}"
                :seq-config="{startIndex: (tablePage.currentPage - 1) * tablePage.pageSize}"
                :checkbox-config="{reserve: true}"
                :loading="tableLoading"
                row-id='id'
              >
                <vxe-table-column
                  v-for="(config, index) in tableColumn"
                  :key="index"
                  v-bind="config"
                  :formatter="config.formatType ? [config.formatType, config.formatList ? dict[config.formatList] : null] : ''"
                >
                  <template v-if="config.field === 'hostCount' || config.field === 'okCount' || config.field === 'failCount' || config.field === 'unreachableCount'" v-slot="{ row }">
                    <span v-if="config.field === 'hostCount'" class="tableText text-mod-primary" @click="getTaskResultListPage(row.id, 'All')">{{ row.hostCount }}</span>
                    <span v-if="config.field === 'okCount'" class="tableText text-mod-success" @click="getTaskResultListPage(row.id, 'Ok')">{{ row.okCount }}</span>
                    <span v-if="config.field === 'failCount'" class="tableText text-mod-warning" @click="getTaskResultListPage(row.id, 'Fail')">{{ row.failCount }}</span>
                    <span v-if="config.field === 'unreachableCount'" class="tableText text-mod-danger" @click="getTaskResultListPage(row.id, 'Unreachable')">{{ row.unreachableCount }}</span>
                  </template>
                  <template v-else-if="config.field === 'duration'" v-slot="{ row }">
                    <span v-show="row.duration">{{ row.duration | durationFilter }}</span>
                    <span v-show="!row.duration">-</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="operation" title="操作" align="left" width="150px">
                  <template v-slot="{ row }">
                    <t-dropdown
              class="mr-5"
              trigger="click"
              :options="[{ content: 'Excel格式', value: 'excel' }, { content: 'TXT格式', value: 'txt' }]"
              @click="clickHandler(row, $event)"
            >
            <t-button
                  class="mr-4 "
                  theme="primary"
                  variant="text"
                  size="small"
                  style="margin-left: -8px"
                  >导出结果 <ChevronDownIcon></ChevronDownIcon></t-button
                >

            </t-dropdown>
                    <!-- <q-btn-dropdown flat color="primary" label="导出结果" size="sm" style="float: right">
                      <q-list>
                        <q-item clickable v-close-popup @click="exportByExcel(row.id, row.jobName)">
                          <q-item-section>
                            <q-item-label>Excel格式</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="exportByTXT(row.id, row.jobName)">
                          <q-item-section>
                            <q-item-label>txt格式</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-btn-dropdown> -->
                  </template>
                </vxe-table-column>
              </vxe-table>
              <vxe-pager
                class="pt-12 pb-16"
                size="small"
                :current-page="tablePage.currentPage"
                :page-size="tablePage.pageSize"
                :total="tablePage.totalResult"
                :page-sizes="pageSizeList"
                @page-change="handlePageChange">
              </vxe-pager>
            </div>
    </div>
    </div>
    <t-dialog v-if="dialog.show"
    :visible.sync="dialog.show"
      header="任务执行详情"
      width="81vw"
      placement="center"
      preventScrollThrough
      @confirm="rootTreeConfirm"
    >
      <t-card style=" height: 65vh; border-radius: 0px" :bordered="false">
          <t-form class="l-row">
            <div class="l-row l-col-12 p-2 pt-4 form-font-style justify-between">
              <div class="l-row l-col-3 l-items-center ">
                <span>主机名称：</span>
                <t-input
                v-model="dialog.searchCondition.hostName"
                  clearable
                  placeholder="请输入主机名称"
                  class="pr-2 l-col-8 "
                />
              </div>
              <div class="l-row l-col-3 l-items-center ">
                <span>主机IP：</span>
                <t-input
                v-model="dialog.searchCondition.hostIp"
                  clearable
                  placeholder="请输入主机IP"
                  class="pr-2 l-col-8 "
                />
              </div>
              <div class="l-row l-col-3 l-items-center ">
                <span>设备类型：</span>
                <t-select
                v-model="dialog.searchCondition.hostType"
                  clearable
                  emit-value
                  map-options
                  :options="[{label:'计算服务器',value:'计算服务器'},{ label:'存储服务器',value:'存储服务器'}, {label:'网络设备',value:'存储服务器'}]"
                  placeholder="请输入设备类型"
                  class="pr-2 l-col-8 "
                />
              </div>
              <div class="l-row l-col-3 l-items-center ">
                <span>设备类型：</span>
                <t-select
                v-model="dialog.searchCondition.hostType"
                  clearable
                  emit-value
                  map-options
                  :options="[{label:'计算服务器',value:'计算服务器'},{ label:'存储服务器',value:'存储服务器'}, {label:'网络设备',value:'存储服务器'}]"
                  placeholder="请输入设备类型"
                  class="pr-2 l-col-8 "
                />
              </div>
              <div class="l-row l-col-3 my-4">
                <span class="pt-2 fieldItem">执行步骤：</span>
                <t-input
                v-model.number="dialog.searchCondition.taskNum"
                  type="number"
                  placeholder="请输入执行步骤"
                  class="pr-2 l-col-8 "
                />
              </div>
              <div
                class="l-row l-col-3 l-items-center my-4 justify-center"
                style="padding-right:0!important;padding-left: 7.5%;"
              >
                <t-button
                  class="column l-items-center  mr-4"
                  theme="primary"
                  style="height: 32px; border: none"
                  @click="dialogSearchEvent()"
                  >查询</t-button
                >
                <t-button
                  class="column l-items-center "
                  ghost
                  style="
                    height: 32px;
                    color: rgba(0, 0, 0, 0.65);
                    border: 1px solid rgba(0, 0, 0, 0.15);
                  "
                  @click="dialogResetEvent()"
                  >重置</t-button
                >
              </div>
            </div>
          </t-form>
          <vxe-table
            ref="taskResultInfoTable"
            id="taskResultInfoTable"
            empty-text="暂无设备信息！"
            border="inner"
            align="left"
            auto-resize
            keep-source
            highlight-hover-row
            highlight-hover-column
            resizable
            max-height="650"
            size="mini"
            :data="dialog.infoData"
            :import-config="{}"
            :export-config="{}"
            :seq-config="{startIndex: (dialog.tablePage.currentPage - 1) * dialog.tablePage.pageSize}"
            :checkbox-config="{reserve: true}"
            :loading="dialog.tableLoading"
            row-id='id'
          >
            <vxe-table-column
              v-for="(config, index) in dialog.tableColumn"
              :key="index"
              v-bind="config"
              :formatter="config.formatType ? [config.formatType, config.formatList ? dict[config.formatList] : null] : ''"
            >
              <template v-if="config.field === 'detailMsg' || config.field === 'orgMsg'" v-slot="{ row }">
                <span v-if="config.field === 'detailMsg'" style="cursor:pointer; text-decoration: underline" class="text-primary" @click="infoDialogEvent('执行详情', row.detailMsg)">{{ row.detailMsg }}</span>
                <span v-else-if="config.field === 'orgMsg'" style="cursor:pointer; text-decoration: underline" class="text-primary" @click="infoDialogEvent('执行日志', row.orgMsg)">{{ row.orgMsg }}</span>
              </template>
              <template v-else-if="config.field === 'hostType'" v-slot="{ row }">
                <span>{{ row.hostName.indexOf('SRV') > -1 ? '计算服务器' : (row.hostName.indexOf('DBS') > -1 ? '存储服务器' : '网络设备') }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="operation" title="操作" align="center" width="50px">
              <template v-slot="{ row }">
                <t-button variant="text" size="small" @click="downloadResult(row.id, row.taskName)" theme="primary"></t-button>
                <!-- <q-icon name="download" size="xs" style="cursor:pointer;" color="primary" @click="downloadResult(row.id, row.taskName)"/> -->
              </template>
            </vxe-table-column>
          </vxe-table>
          <vxe-pager
            class="pt-12 pb-16"
            size="small"
            :current-page="dialog.tablePage.currentPage"
            :page-size="dialog.tablePage.pageSize"
            :total="dialog.tablePage.totalResult"
            :page-sizes="dialog.pageSizeList"
            @page-change="dialogHandlePageChange">
          </vxe-pager>
      </t-card>
    </t-dialog>
    <t-dialog
      v-if="infoDialog.show"
    :visible.sync="infoDialog.show"
      :header="infoDialog.infoType"
      width="40vw"
      placement="center"
      @confirm="infoDialog.show = false"
      preventScrollThrough
    >
      <t-card flat class="bg-black text-white" :bordered="false">
          <div style="height: 40vh; overflow: auto">
            <pre>{{ infoDialog.infoMsg }}</pre>
          </div>
      </t-card>
    </t-dialog>
  </div>
</template>

<script>
import { getConfigLogAPI } from '@/api/inops/job/jobStatus'
import { getHostListAPI } from '@/api/inops/task/taskResult'
import { formatDate } from '@/utils/inops/dateUtils'
import { getDictList } from '@/utils/inops/u'
import { getUserListApi } from '@/api/system/user'
import { ChevronDownIcon } from 'tdesign-icons-vue'
export default {
  name: 'index',
  components: { ChevronDownIcon },
  data () {
    return {
      dict: {
        obj: ['jobStatus', 'taskStatus'],
        jobStatus: [],
        taskStatus: [],
        userDict: [],
        userOptions: []
      },
      searchCondition: {
        parentId: 0,
        jobName: '',
        beginDate: '',
        endDate: '',
        createBy: '',
        status: '',
        type: 'config',
        rangeTime: []
      },
      searchStatus: '',
      searchCreateBy: '',
      denseOpts: false,
      infoData: [],
      tableLoading: false,
      tableColumn: [
        { type: 'checkbox', align: 'center', width: '30' },
        { type: 'seq', title: '序号', align: 'center', width: '45' },
        { field: 'jobName', title: '作业名称', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, minWidth: 70 },
        { field: 'hostCount', title: '总设备数', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: 70 },
        { field: 'okCount', title: '成功', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: 50 },
        { field: 'failCount', title: '失败', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: 50 },
        { field: 'unreachableCount', title: '无法连接', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: 70 },
        { field: 'newestTask', title: '最新执行步骤', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, minWidth: 120 },
        { field: 'status', title: '作业状态', formatType: 'formatField', formatList: 'jobStatus', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: 100 },
        { field: 'createBy', title: '创建人', formatType: 'formatUser', formatList: 'userDict', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
        { field: 'duration', title: '执行时长', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
        { field: 'createDate', title: '创建时间', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, minWidth: '50px' },
        { field: 'updateDate', title: '更新时间', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, minWidth: '50px' }
      ],
      pageSizeList: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
      tablePage: {
        totalResult: 0,
        currentPage: 1,
        pageSize: 10,
        align: 'right'
      },
      dialog: {
        jobId: '',
        taskResultType: '',
        searchCondition: {
          hostName: '',
          hostIp: '',
          taskNum: '',
          hostType: ''
        },
        show: false,
        infoData: [],
        tableLoading: false,
        tableColumn: [
          { type: 'seq', title: '序号', align: 'center', width: '60' },
          { field: 'hostName', title: '主机名称', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          { field: 'hostIp', title: '主机Ip', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: '200' },
          { field: 'hostType', title: '设备类型', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: '200' },
          { field: 'taskInfo', title: '执行步骤', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: '120' },
          { field: 'status', title: '执行状态', type: 'html', formatType: 'formatTaskStatus', formatList: 'taskStatus', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: '80' },
          { field: 'detailMsg', title: '执行详情', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
          { field: 'orgMsg', title: '执行日志', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true }
        ],
        pageSizeList: [30, 100, 500, 1000, 2000, { label: '全部', value: '' }],
        tablePage: {
          totalResult: 0,
          currentPage: 1,
          pageSize: 30,
          align: 'right'
        }
      },
      infoDialog: {
        show: false,
        infoType: '',
        infoMsg: ''
      },
      url: '',
      date: ''
    }
  },
  filters: {
    durationFilter (value) {
      if (value < 60) {
        return `${value}s`
      } else if (value >= 60 && value < 3600) {
        const min = parseInt(value / 60)
        const seconds = value - (min * 60)
        return `${min}m${seconds}s`
      } else if (value >= 3600) {
        const hour = parseInt(value / 3600)
        const min = parseInt((value - (hour * 3600)) / 60)
        const seconds = value - (hour * 3600) - (min * 60)
        return `${hour}h${min}m${seconds}s`
      }
    }
  },
  watch: {
    searchStatus: {
      handler (newVal) {
        this.searchCondition.status = newVal ? newVal.value : ''
      }
    },
    searchCreateBy: {
      handler (newVal) {
        this.searchCondition.createBy = newVal ? newVal.value : ''
      }
    },
    'dialog.searchCondition.taskNum': {
      handler (newVal) {
        if (typeof newVal === 'number') {
          if (newVal < 1) {
            this.$message.warning({ content: '步骤数不能小于1', placement: 'center' })
            this.dialog.searchCondition.taskNum = ''
          }
        }
      },
      deep: true
    }
  },
  async mounted () {
    this.url = process.env.VUE_APP_BASE_URL
    const date = new Date()
    this.date = formatDate(date)
    // this.searchCondition.beginDate = formatDate(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 6))
    // this.searchCondition.endDate = formatDate(new Date())
    this.searchCondition.beginDate = formatDate(
      new Date().setFullYear(new Date().getFullYear() - 1)
    )
    this.searchCondition.endDate = formatDate(new Date())
    this.searchCondition.rangeTime = [this.searchCondition.beginDate, this.searchCondition.endDate]
    await this.getDict()
    await this.getUserDict()
    this.getJobStatusListPage()
  },
  methods: {
    async getDict () {
      if (!this.dict.list) return
      for (const item of this.dict.list) {
        this.dict[item] = await getDictList(item)
      }
    },
    async getUserDict () {
      await getUserListApi().then(response => {
        const { data } = response
        if (data.code === 0) {
          for (const item of data.data) {
            const params = {
              label: item.userName,
              value: item.userId
            }
            this.dict.userDict.push(item)
            this.dict.userOptions.push(params)
          }
        }
      })
    },
    // 获取作业日志结果
    getJobStatusListPage () {
      const params = {
        pageSize: this.tablePage.pageSize,
        pageNum: this.tablePage.currentPage
      }
      this.infoData = []
      this.tableLoading = true
      getConfigLogAPI(params, this.searchCondition).then(response => {
        const { data } = response
        if (data.code === 200) {
          const { records } = data.data
          records.forEach(value => {
            this.$set(value, 'newestTask', value.newestTaskNum + '.  ' + value.newestTaskName)
          })
          this.infoData = records
          this.tablePage.totalResult = data.data.total
          const index = this.pageSizeList.findIndex(v => v.label === '全部')
          this.pageSizeList[index].value = Math.floor(this.tablePage.totalResult)
          this.tablePage.pageSize = data.data.size
          this.tablePage.currentPage = data.data.current
          this.tableLoading = false
        }
      })
    },
    // 获取任务结果（设备）
    getTaskResultListPage (jobId, taskResultType) {
      if (!this.dialog.show) {
        this.dialog.tablePage.pageSize = 10
        this.dialog.tablePage.currentPage = 1
      }
      this.dialog.jobId = jobId
      this.dialog.taskResultType = taskResultType
      const params = {
        pageSize: this.dialog.tablePage.pageSize,
        pageNum: this.dialog.tablePage.currentPage
      }
      const data = {
        jobId
      }
      Object.assign(data, this.dialog.searchCondition)
      this.dialog.show = true
      this.dialog.tableLoading = true
      getHostListAPI(params, data, taskResultType).then(response => {
        const { data } = response
        if (response.status === 200) {
          const { records } = data
          records.forEach(value => {
            this.$set(value, 'taskInfo', value.taskNum + '.  ' + value.taskName)
          })
          this.dialog.infoData = records
          this.dialog.tablePage.totalResult = data.total
          const index = this.dialog.pageSizeList.findIndex(v => v.label === '全部')
          this.dialog.pageSizeList[index].value = Math.floor(this.dialog.tablePage.totalResult)
          this.dialog.tablePage.pageSize = data.size
          this.dialog.tablePage.currentPage = data.current
          this.dialog.tableLoading = false
        }
      })
    },
    // 查询
    searchEvent () {
      this.getJobStatusListPage()
    },
    // 重置
    resetEvent () {
      this.searchCondition.jobName = ''
      this.searchStatus = ''
      this.searchCreateBy = ''
      // this.searchCondition.beginDate = formatDate(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 6))
      // this.searchCondition.endDate = formatDate(new Date())
      this.searchCondition.beginDate = formatDate(
        new Date().setFullYear(new Date().getFullYear() - 1)
      )
      this.searchCondition.endDate = formatDate(new Date())
      this.searchCondition.rangeTime = [this.searchCondition.beginDate, this.searchCondition.endDate]
    },
    // 弹窗查询
    dialogSearchEvent () {
      this.tablePage.currentPage = 1
      this.tablePage.pageSize = 30
      this.getTaskResultListPage(this.dialog.jobId, this.dialog.taskResultType)
    },
    // 弹窗重置
    dialogResetEvent () {
      this.dialog.searchCondition.hostName = ''
      this.dialog.searchCondition.hostIp = ''
      this.dialog.searchCondition.taskNum = ''
    },
    // 日志弹窗
    infoDialogEvent (infoType, infoMsg) {
      this.infoDialog.show = true
      this.infoDialog.infoType = infoType
      this.infoDialog.infoMsg = infoMsg
    },
    // 分页
    handlePageChange ({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.getJobStatusListPage()
    },
    // 弹窗分页
    dialogHandlePageChange ({ currentPage, pageSize }) {
      this.dialog.tablePage.currentPage = currentPage
      this.dialog.tablePage.pageSize = pageSize
      this.getTaskResultListPage(this.dialog.jobId, this.dialog.taskResultType)
    },
    // 单条结果下载
    downloadResult (id, name) {
      this.$message.error({ content: '下载失败，请联系管理员', placement: 'center' })
      // const params = {
      //   id: id,
      //   type: 'config'
      // }
      // const exportUrl = `${this.url}/inops/taskResult/orgMsgDownload`
      // const fileName = `${name}_${this.date}.txt`
      // generateFile(exportUrl, params, fileName)
    },
    exportByTXT (id, name) {
      this.$message.error({ content: '下载失败，请联系管理员', placement: 'center' })
      // const params = {
      //   jobId: id,
      //   type: 'config'
      // }
      // const exportUrl = `${this.url}/inops/taskResult/batchOrgMsgDownload`
      // const fileName = `${name}_${this.date}.zip`
      // generateFile(exportUrl, params, fileName)
    },
    exportByExcel (id, name) {
      this.$message.error({ content: '下载失败，请联系管理员', placement: 'center' })
      // const exportUrl = `${this.url}/inops/taskResult/excelDownload/${id}`
      // const fileName = `${name}_${this.date}.xlsx`
      // exportExcel(exportUrl, fileName)
    },
    clickHandler (row, data) {
      console.log(row.id, data)
      if (data.value === 'excel') {
        return this.exportByExcel(row.id, true)
      }
      return this.exportByTXT(row.id, false)
    },
    onChange (value, _context) {
      this.searchCondition.beginDate = value[0]
      this.searchCondition.endDate = value[1]
    }
  }
}
</script>

<style lang="sass" scoped>
.tableText
  cursor: pointer
  font-weight: bold
/deep/ .form-select-style .q-field--outlined .q-field__control
  border-radius: 5px 0px 0px 5px
/deep/ .form-input-style .q-field--outlined .q-field__control
  border-radius: 0px 5px 5px 0px
/deep/ .global-form-style .q-field--outlined .q-field__control
  border-radius: 5px 0px 0px 5px
/deep/ .global-form-style  .q-btn--rectangle
  border-radius: 0px 5px 5px 0px

/deep/ .t-button__text
  align-items: center
</style>
