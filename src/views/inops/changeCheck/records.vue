<template>
  <div class="p-4">
    <div class="p-4 bg-white shadow-1">
      <div>
        <t-form class="l-row">
          <div class="l-row l-col-12 l-col-md-12 px-4 pt-4">
            <div class="l-row l-col-md-4 l-items-center l-vertical-middle">
              <span>作业名称：</span>
              <t-input
                v-model="condition.jobName"
                clearable
                style="width: 60%"
              />
            </div>
            <div class="l-row l-col-md-4 l-items-center l-vertical-middle">
              <span>操作用户：</span>
              <t-select
                v-model="condition.createBy"
                clearable
                :options="dict.userOptions"
                style="width: 60%"
              />
            </div>
            <div class="l-row l-col-md-4 l-items-center l-vertical-middle">
              <span>作业状态：</span>
              <t-select
                v-model="condition.status"
                clearable
                :options="dict.jobStatus"
                style="width: 60%"
              />
            </div>
            <div class="l-row l-col-md-6 l-items-center l-vertical-middle">

              <span>操作时间：</span>
              <t-date-picker style="width: 35%" mode="month" v-model="condition.beginDate" clearable allow-input />
              <span class="l-col-1 l-col-md-1 text-center">至</span>
              <t-date-picker style="width: 35%" mode="month" v-model="condition.endDate" clearable allow-input />
            </div>
            <div class="l-row l-col-md-4">
              <t-button
                class="l-items-center l-vertical-middle mr-4"
                content="查询"
                style="height: 32px"
                @click="searchEvent()"
              />
              <t-button
                class="l-items-center l-vertical-middle"
                content="重置"
                ghost
                style="height: 32px"
                @click="resetEvent()"
              />
            </div>
          </div>
        </t-form>
      </div>
      <div class="mt-4">
        <vxe-table
          class="text-black"

          auto-resize
          keep-source
          highlight-hover-row

          highlight-hover-column
          align="left"
          resizable
          ref="infoTable"
          id="infoTable"
          row-id="id"
          empty-text="暂无验收记录！"
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
          <vxe-table-column
            field="operation"
            title="操作"
            align="left"
            width="180px"
          >
            <template v-slot="{ row }">
              <t-button
                class="mr-4"
                variant="text"
                theme="primary"
                size="small"
                content="导出结果"
                color="blue"
                @click="exportEvent(row)"
              ></t-button>
              <t-button
                v-if="aiList.includes(row.taskName)"
                variant="text"
                theme="primary"
                size="small"
                content="AI验收分析"
                color="blue"
                @click="AIAccept(row)"
              ></t-button>
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
          @page-change="pagesLimit"
        >
        </vxe-pager>
      </div>
    </div>
    <t-dialog
    :visible.sync="dialog.export"
    v-if="dialog.export"
        header="验收记录导出"
        width="1280px"
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

              auto-resize
              keep-source
              highlight-hover-row

              highlight-hover-column
              align="left"
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

    <t-dialog v-if="dialog.execute"
    :visible.sync="dialog.execute"
        header="任务执行详情"
        width="1280px"
        preventScrollThrough
        @confirm="dialog.execute=false"
    >
      <t-card
        style="min-height: 720px;  border-radius: 0px"
        :bordered="false"
      >
          <t-form class="l-row px-4">
            <div class="l-row l-col-12">
              <div class="l-row l-col-md-3 l-items-center l-vertical-middle">
                <span>主机名称：</span>
                <t-input
                  v-model="infoCondition.hostName"
                  clearable
                  placeholder="请输入主机名称"
                  class="pr-4 l-col-8 l-col-md-8"
                />
              </div>
              <div class="l-row l-col-md-3 l-items-center l-vertical-middle">
                <span>主机IP：</span>
                <t-input
                  v-model="infoCondition.hostIp"
                  clearable
                  placeholder="请输入主机IP"
                  class="pr-4 l-col-8 l-col-md-8"
                />
              </div>
              <div class="l-row l-col-md-3">
                <span class="pt-2 fieldItem">设备类型：</span>
                <t-select
                  v-model="infoCondition.hostType"
                  clearable
                  :options="['计算服务器', '存储服务器', '网络设备']"
                  placeholder="请输入设备类型"
                  class="pr-4 l-col-8 l-col-md-8"
                />
              </div>
              <div class="l-row l-col-md-3 l-items-center l-vertical-middle">
                <span>执行步骤：</span>
                <t-input
                  v-model.number="infoCondition.taskNum"
                  type="number"
                  placeholder="请输入执行步骤"
                  class="pr-4 l-col-8 l-col-md-8"
                />
              </div>
              <div class="l-row l-col-md-3 l-items-center l-vertical-middle">
                <t-button
                  class="l-items-center l-vertical-middle mr-4"
                  content="查询"
                  style="height: 32px"
                  @click="dialogSearchEvent()"
                />
                <t-button
                  class="l-items-center l-vertical-middle"
                  content="重置"
                  ghost
                  style="height: 32px"
                  @click="dialogResetEvent()"
                />
              </div>
            </div>
          </t-form>
          <vxe-table
            ref="executeTable"
            id="executeTable"
            empty-text="暂无执行信息！"
            border="inner"
            class="pt-4"
            auto-resize
            keep-source
            highlight-hover-row

            highlight-hover-column
            align="left"
            resizable
            max-height="400"
            size="mini"
            :data="executeTable.infoData"
            :import-config="{}"
            :export-config="{}"
            :seq-config="{
              startIndex: (executePages.current - 1) * executePages.size,
            }"
            :checkbox-config="{ reserve: true }"
            :loading="executeTable.loading"
            row-id="id"
          >
            <vxe-table-column
              v-for="(config, index) in executeTable.column"
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
              <template
                v-if="
                  config.field === 'detailMsg' || config.field === 'orgMsg'
                "
                v-slot="{ row }"
              >
                <span
                  v-if="config.field === 'detailMsg'"
                  style="cursor: pointer; text-decoration: underline"
                  class="text-primary"
                  @click="infoDialogEvent('执行详情', row.detailMsg)"
                  >{{ row.detailMsg }}</span
                >
                <span
                  v-else-if="config.field === 'orgMsg'"
                  style="cursor: pointer; text-decoration: underline"
                  class="text-primary"
                  @click="infoDialogEvent('执行日志', row.orgMsg)"
                  >{{ row.orgMsg }}</span
                >
              </template>
              <template
                v-else-if="config.field === 'hostType'"
                v-slot="{ row }"
              >
                <span>{{
                  row.hostName.indexOf("SRV") > -1
                    ? "计算服务器"
                    : row.hostName.indexOf("DBS") > -1
                    ? "存储服务器"
                    : "网络设备"
                }}</span>
              </template>
              <template
                v-else-if="config.field === 'resourcePool'"
                v-slot="{ row }"
              >
                <!-- <q-chip outline square color="blue" size="sm">{{
                  row.resourcePool ? row.resourcePool : "NFV-RP-HNGZ-05A"
                }}</q-chip> -->
                <span class="text-mod-primary px-4" style="border:1px solid rgb(94,114,228);border-radius:5px">{{
                  row.resourcePool ? row.resourcePool : "NFV-RP-HNGZ-05A"
                }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="operation"
              title="操作"
              align="center"
              width="50px"
            >
              <template v-slot="{ row }">
                <DownloadIcon style="cursor: pointer"  @click="downloadResult(row.id, row.taskName)" class="text-mod-primary"></DownloadIcon>
                <!-- <q-icon
                  name="download"
                  size="xs"
                  style="cursor: pointer"
                  color="primary"
                  @click="downloadResult(row.id, row.taskName)"
                /> -->
              </template>
            </vxe-table-column>
          </vxe-table>
          <vxe-pager
            class="pt-12 pb-16"
            size="small"
            :current-page="executePages.current"
            :page-size="executePages.size"
            :total="executePages.total"
            :page-sizes="executePages.pageSizeList"
            @page-change="executePagesLimit"
          >
          </vxe-pager>
      </t-card>
    </t-dialog>
    <t-dialog v-if="dialog.detail"
    :visible.sync="dialog.detail"
        :header="detailInfo.infoType"
        width="40vw"
        preventScrollThrough
        @confirm="dialog.detail=false"
    >
      <t-card
      :bordered="false"
        class="bg-black text-white"
        style="border-radius: 0px"
      >
          <div  style="height: 40vh">
            <pre>{{ detailInfo.infoMsg }}</pre>
          </div>
      </t-card>
    </t-dialog>

    <t-dialog
    v-if="dialog.warning"
    :visible.sync="dialog.warning"
        header="提示"
        width="320px"
        preventScrollThrough
        @confirm="dialog.warning=false"
    >
      <t-card :bordered="false">
          抱歉，该功能正在开发中

      </t-card>
    </t-dialog>
  </div>
</template>

<script>
import { formatDate } from '@/utils/inops/dateUtils'
import { getDictList } from '@/utils/inops/u'
import { getUserListApi } from '@/api/system/user'
import { countOfTaskAPI } from '@/api/inops/job/jobStatus'
import { taskResultAPI, getJobHostsAPI } from '@/api/inops/accept/accept'
import { DownloadIcon } from 'tdesign-icons-vue'
import axios from 'axios'

export default {
  name: 'records',
  components: { DownloadIcon },
  data () {
    return {
      test: 'test',
      dict: {
        list: ['jobStatus', 'taskStatus'],
        jobStatus: [],
        taskStatus: [],
        userDict: [],
        userOptions: []
      },
      condition: {
        parentId: 0,
        jobName: '',
        beginDate: '',
        endDate: '',
        createBy: '',
        status: ''
      },
      url: '',
      date: '',
      table: {
        loading: false,
        infoData: [],
        column: [
          { type: 'seq', title: '序号', align: 'center', width: '45' },
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
            field: 'hostCount',
            title: '总设备数',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'okCount',
            title: '成功',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'failCount',
            title: '失败',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'unreachableCount',
            title: '无法连接',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'createBy',
            title: '创建人',
            formatType: 'formatUser',
            formatList: 'userDict',
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
      taskHost: [],
      dialog: {
        export: false,
        execute: false,
        detail: false,
        warning: false
      },
      executeTable: {
        loading: false,
        infoData: [],
        column: [
          { type: 'seq', title: '序号', align: 'center', width: '60' },
          {
            field: 'hostName',
            title: '主机名称',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'hostIp',
            title: '主机Ip',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '200'
          },
          {
            field: 'resourcePool',
            title: '所属资源池',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '200'
          },
          {
            field: 'hostType',
            title: '设备类型',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '200'
          },
          {
            field: 'taskName',
            title: '变更项名称',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '120'
          },
          {
            field: 'status',
            title: '执行状态',
            type: 'html',
            formatType: 'formatTaskStatus',
            formatList: 'taskStatus',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '80'
          },
          {
            field: 'detailMsg',
            title: '执行详情',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'orgMsg',
            title: '执行日志',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          }
        ]
      },
      executePages: {
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
      rowData: null,
      hostType: '',
      infoCondition: {
        jobId: '',
        hostName: '',
        hostIp: '',
        taskNum: '',
        status: '',
        executeDate: '',
        hostType: ''
      },
      detailInfo: {
        infoType: '',
        infoMsg: ''
      },
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
            formatList: 'userDict',
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
      itemCheck: [],
      aiList: [
        '计算服务器光模块验收',
        '计算服务器物理端口可靠性验收',
        '计算服务器计算性能状态验收',
        '存储服务器光模块验收',
        '存储服务器物理端口可靠性验收',
        '存储服务器存储性能状态验收',
        '网络设备物理端口可靠性验收',
        '网络设备光模块验收',
        '光模块验收',
        '虚层关键组件可靠性验收'
      ]
    }
  },
  async mounted () {
    this.url = process.env.VUE_APP_BASE_URL
    const date = new Date()
    this.date = formatDate(date)
    this.condition.beginDate = formatDate(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 6))
    this.condition.endDate = formatDate(new Date())
    await this.getDict()
    await this.getUserDict()
    this.getAcceptLog()
  },
  filters: {
    durationFilter (value) {
      if (value < 60) {
        return `${value}s`
      } else if (value >= 60 && value < 3600) {
        const min = parseInt(value / 60)
        const seconds = value - min * 60
        return `${min}m${seconds}s`
      } else if (value >= 3600) {
        const hour = parseInt(value / 3600)
        const min = parseInt((value - hour * 3600) / 60)
        const seconds = value - hour * 3600 - min * 60
        return `${hour}h${min}m${seconds}s`
      }
    }
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
    getAcceptLog () {
      this.table.loading = true
      const params = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      countOfTaskAPI(params, this.condition).then((res) => {
        const { data } = res
        if (data.code === 200) {
          const { records } = data.data
          this.table.infoData = records
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
    getTaskResult (row, type) {
      if (!this.dialog.execute) {
        this.executePages.size = 10
        this.executePages.current = 1
      }
      this.rowData = row
      this.infoCondition.jobId = row.jobId
      this.infoCondition.taskNum = row.taskNum
      this.infoCondition.executeDate = row.executeDate
      this.infoCondition.status = type
      const params = {
        pageSize: this.executePages.size,
        pageNum: this.executePages.current
      }
      this.dialog.execute = true
      this.executeTable.loading = true
      taskResultAPI(params, this.infoCondition).then((res) => {
        const { data } = res
        if (data.code === 200) {
          this.executeTable.infoData = data.data.records
          this.executePages.total = data.data.total
          const index = this.executePages.pageSizeList.findIndex(
            (v) => v.label === '全部'
          )
          this.executePages.pageSizeList[index].value = Math.floor(
            this.executePages.total
          )
          this.executePages.size = data.data.size
          this.executePages.current = data.data.current
          this.executeTable.loading = false
        }
      })
    },
    async getJobHosts (id) {
      await getJobHostsAPI(id).then((res) => {
        const { data } = res
        if (data.code === 200) {
          this.taskHost = data.data
        }
      })
    },
    async AIAccept (row) {
      if (row.taskName.indexOf('光模块') > -1) {
        await this.getJobHosts(row.jobId)
        this.$router.push({
          path: '/inops/autoAcceptance/optical',
          query: {
            hosts: this.taskHost,
            major: row.taskName.slice(0, 2)
          }
        })
      } else if (row.taskName.indexOf('性能状态验收') > -1) {
        let type = ''
        if (row.taskName.indexOf('计算') > -1) {
          type = 'srv'
        } else if (row.taskName.indexOf('存储') > -1) {
          type = 'dbs'
        }
        await this.getJobHosts(row.jobId)
        this.$router.push({
          path: '/inops/autoAcceptance/pState',
          query: {
            hosts: this.taskHost,
            type
          }
        })
      } else if (row.taskName.indexOf('虚拟层日志') > -1) {
        await this.getJobHosts(row.jobId)
        this.$router.push({
          path: '/inops/autoAcceptance/logAI',
          query: {
            hosts: this.taskHost
          }
        })
      } else if (row.taskName.indexOf('物理端口可靠性验收') > -1) {
        let type = ''
        if (row.taskName.indexOf('计算') > -1) {
          type = 'srv'
        } else if (row.taskName.indexOf('存储') > -1) {
          type = 'dbs'
        } else if (row.taskName.indexOf('网络') > -1) {
          type = 'net'
        }
        await this.getJobHosts(row.jobId)
        this.$router.push({
          path: '/inops/autoAcceptance/portR',
          query: {
            hosts: this.taskHost,
            type
          }
        })
      } else {
        this.dialog.warning = true
      }
    },
    pagesLimit ({ currentPage, pageSize }) {
      this.pages.current = currentPage
      this.pages.size = pageSize
      this.getAcceptLog()
    },
    executePagesLimit ({ currentPage, pageSize }) {
      this.executePages.current = currentPage
      this.executePages.size = pageSize
      this.getTaskResult(this.rowData, this.infoCondition.status)
    },
    // 查询
    searchEvent () {
      this.getAcceptLog()
    },
    // 重置
    resetEvent () {
      this.condition.jobName = ''
      this.condition.createBy = ''
      this.condition.status = ''
      this.searchCondition.beginDate = formatDate(
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 6)
      )
      this.searchCondition.endDate = formatDate(new Date())
    },
    dialogSearchEvent () {
      this.executePages.current = 1
      this.executePages.size = 10
      this.getTaskResult(this.rowData, this.infoCondition.status)
    },
    dialogResetEvent () {
      this.infoCondition.hostName = ''
      this.infoCondition.hostIp = ''
      this.infoCondition.taskNum = ''
    },
    infoDialogEvent (infoType, infoMsg) {
      this.dialog.detail = true
      this.detailInfo.infoType = infoType
      this.detailInfo.infoMsg = infoMsg
    },
    exportEvent (row) {
      this.rowData = row
      const params = {
        pageSize: this.itemPages.size,
        pageNum: this.itemPages.current
      }
      const data = {
        jobId: row.jobId
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
      console.log(records, 1)
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
    renderContent () {
      return (
        <p style="font-size:12px;padding:2px!important">
          ‘远端’执行（默认）：执行指令时会登录设备，返回目标设备上的指令执行结果
        <br />
          ‘节点’执行：执行指令时不登录设备，返回本系统前置节点机上的指令执行结果
        </p>
      )
    },
    // 单条结果下载
    downloadResult (row, type) {
      // this.$message.error({
      //   content: '下载失败，请联系管理员',
      //   placement: 'center'
      // })

      // console.log(row)
      const params = {
        jobId: row.jobId,
        executeDate: row.executeDate,
        taskNum: this.itemCheck.join(',')
      }
      // console.log(row.jobId)
      // console.log(this.itemCheck)
      // if (type === 'All') {
      //   params = {
      //     jobId: row.jobId,
      //     executeDate: row.executeDate
      //   }
      // } else {
      // let taskNumStr = ''
      // this.itemCheck.forEach(item => {
      //   taskNumStr += item + ','
      // })
      // params = {
      //   jobId: row.jobId,
      //   executeDate: row.executeDate,
      //   taskNum: this.itemCheck.join(',')
      // }
      // }
      const exportUrl = `${this.url}/inops/accept/taskResult/excelDownload`
      const fileName = `${row.jobName}_${this.date}.xlsx`
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
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
