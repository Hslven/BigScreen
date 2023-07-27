<template>
  <div>
    <div class="p-4">
      <div class="p-4 bg-white" style="font-size:12px">
        <t-form class="l-row" @submit="submitEvent" style="justify-content: flex-end;">
          <div class="l-row l-items-center  l-col-3">
            <span class="mr-2 l-col-3" style="text-align:right">根因事件：</span>
            <t-input
              v-model="condition.caseEvent"
              clearable
              class="l-col-8"></t-input>
          </div>
          <div class="l-row l-items-center  l-col-3">
            <span class="mr-2 l-col-3" style="text-align:right">所属资源池：</span>
            <t-select
              v-model="condition.resourcePool"
              clearable
              :options="resourceOptions"
              class="l-col-8"></t-select>
          </div>
          <div class="l-row l-items-center  l-col-3">
            <span class="mr-2 l-col-3" style="text-align:right">根因设备：</span>
            <t-input
              v-model="condition.caseHost"
              clearable
              class="l-col-8"></t-input>
          </div>
          <div class="l-row l-items-center  l-col-3">
            <span class="mr-2 l-col-3" style="text-align:right">根因时间：</span>
            <t-date-picker
              enable-time-picker
              clearable
              v-model="condition.caseTime"
              class="l-col-8"
              :presets="{ 现在: new Date() }"
            />
          </div>
          <div class="mt-4">
            <t-button type="submit" content="查询" class="mr-4"></t-button>
          </div>
        </t-form>
        <div class="mt-4">
          <vxe-table
            class="text-black"
            auto-resize
            keep-source
            highlight-hover-row
            highlight-hover-column
            ref="infoTable"
            id="infoTable"
            row-id='id'
            empty-text="暂无告警信息"
            border="inner"
            align="left"
            max-height="500"
            size="mini"
            :column-config="{resizable: true}"
            :tooltip-config="{showAll: true}"
            :loading="table.loading"
            :seq-config="{startIndex: (pages.current - 1) * pages.size }"
            :checkbox-config="{reserve: true}"
            :data="table.infoData"
          >
            <vxe-table-column
              v-for="(config, index) in table.column"
              :key="index" v-bind="config"
            >
              <template v-if="config.field === 'dcName'" v-slot="{ row }">
                <!-- <q-chip outline square color="blue" size="sm" :label="row.dcName"></q-chip> -->
                <t-tooltip :content="row.dcName">
                          <div class="px-2 text-mod-primary" style="max-width: 80px;border:1px solid rgb(94,114,228);border-radius: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    ">
                            {{ row.dcName }}
                          </div>
        </t-tooltip>
              </template>
              <template v-else-if="config.field === 'hostList'" v-slot="{ row }">
                <span class="text-weight-bold">{{ row.hostList.length }}</span>
              </template>
              <template v-else-if="config.field === 'alarmList'" v-slot="{ row }">
                <span class="text-mod-success cursor-pointer text-weight-bold" style="" @click="showInfo('alarm', row)">{{ row.alarmList.length }}</span>
              </template>
              <template v-else-if="config.field === 'riskList'" v-slot="{ row }">
                <span class="text-mod-warning cursor-pointer text-weight-bold" style="" @click="showInfo('p', row)">{{ row.riskList.length }}</span>
              </template>
              <template v-else-if="config.field === 'logList'" v-slot="{ row }">
                <span class="text-mod-primary cursor-pointer text-weight-bold" style="" @click="showInfo('log', row)">{{ row.logList.length }}</span>
              </template>
            </vxe-table-column>
            <vxe-table-column field="operation" title="操作" align="center" width="150px">
              <template v-slot="{ row }">
                <t-button v-show="bindingAlarmList.includes(row.rootCaseAlarm)"  theme="primary" variant="text" content="查看方案" @click="showCase(row)"></t-button>
                <t-button v-show="!bindingAlarmList.includes(row.rootCaseAlarm)" theme="primary" variant="text" content="AI智荐" @click="aiSuggesion(row.rootCaseAlarm)"></t-button>
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
            :page-count=5
            @page-change="pagesLimit">
          </vxe-pager>
        </div>
      </div>
    </div>
    <t-dialog
    v-if="dialog.alarm"
    :visible.sync="dialog.alarm"
          header="关联告警列表"
          placement="center"
          width="1200px"
          preventScrollThrough
          @cancel="dialog.alarm=false"
          @confirm="dialog.alarm=false"
    >
      <t-card style="border-radius: 0px; min-height: 620px" :bordered="false">
          <t-form class="l-row" @submit="alarmSubmit">
            <div class="l-row l-items-center mr-2 l-col-3">
              <span style="text-align:right" class="mr-2 l-col-3">关联设备</span>
              <t-input
                v-model="alarmCondition.hostName"
                outlined
                dense
                class="l-col-8"></t-input>
            </div>
            <div class="l-row l-items-center mr-2 l-col-3">
              <span style="text-align:right" class="l-col-3 mr-2">所属资源池</span>
              <t-select
                v-model="alarmCondition.resourcePool"
                class="l-col-8"
                :options="resourceOptions"
                ></t-select>
            </div>
            <div class="l-row l-items-center mr-2 l-col-3">
              <span style="text-align:right" class="mr-2 l-col-3">出现时间</span>
              <t-date-picker
              class="l-col-8"
              enable-time-picker
              clearable
              v-model="alarmCondition.date"
              :presets="{ 现在: new Date() }"
            />
            </div>
            <t-button class=" l-items-center " theme="primary" content="查询" type="submit" style="height: 32px"></t-button>
          </t-form>
          <div class="mt-4">
            <vxe-table
              class="text-black"
              auto-resize
              keep-source
              highlight-hover-row
              highlight-hover-column
              ref="alarmTable"
              id="alarmTable"
              row-id='id'
              empty-text="暂无关联告警信息"
              border="inner"
            align="left"

              max-height="500"
              size="mini"
              :column-config="{resizable: true}"
              :tooltip-config="{showAll: true}"
              :loading="alarmTable.loading"
              :seq-config="{startIndex: (alarmPages.current - 1) * alarmPages.size }"
              :checkbox-config="{reserve: true}"
              :data="alarmTable.infoData"
            >
              <vxe-table-column
                v-for="(config, index) in alarmTable.column"
                :key="index" v-bind="config"
              />
            </vxe-table>
            <vxe-pager
              class="mt-4 pt-12 pb-16"
              size="mini"
              :current-page="alarmPages.current"
              :page-size="alarmPages.size"
              :total="alarmPages.total"
              :page-sizes="alarmPages.pageSizeList"
              :page-count=5
              @page-change="alarmPagesLimit">
            </vxe-pager>
          </div>
      </t-card>
    </t-dialog>
    <t-dialog
       v-if="dialog.p"
       :visible.sync="dialog.p"
          header="关联告警列表"
          placement="center"
          width="1140px"
          preventScrollThrough
          @cancel="dialog.p=false"
          @confirm="dialog.p=false"
    >
      <t-card style="border-radius: 0px; min-height: 620px" :bordered="false">
          <t-form class="l-row" @submit="pSubmit" >
            <div class="l-row l-items-center mr-2 l-col-3">
              <span style="text-align:right" class="mr-2 l-col-4">关联设备</span>
              <t-input
                v-model="pCondition.hostName"
                outlined
                dense
                class="l-col-7"></t-input>
            </div>
            <div class="l-row l-items-center mr-2 l-col-3">
              <span style="text-align:right" class="l-col-4 mr-2">所属资源池</span>
              <t-select
                v-model="pCondition.resourcePool"
                class="l-col-7"
                :options="resourceOptions"
                ></t-select>
            </div>
            <div class="l-row l-items-center mr-2 l-col-3">
              <span style="text-align:right" class="mr-2 l-col-4">出现时间</span>
              <t-date-picker
              class="l-col-7"
              enable-time-picker
              clearable
              v-model="pCondition.date"
              :presets="{ 现在: new Date() }"
            />
            </div>
            <t-button class=" l-items-center " theme="primary" content="查询" type="submit" ></t-button>
          </t-form>
          <div class="mt-4 pt-12 pb-16">
            <vxe-table
              class="text-black"
              auto-resize
              keep-source
              highlight-hover-row
              highlight-hover-column
              ref="pTable"
              id="pTable"
              row-id='id'
              empty-text="暂无关联性能信息"
              border="inner"
            align="left"
              max-height="500"
              size="mini"
              :column-config="{resizable: true}"
              :tooltip-config="{showAll: true}"
              :loading="pTable.loading"
              :seq-config="{startIndex: (pPages.current - 1) * pPages.size }"
              :checkbox-config="{reserve: true}"
              :data="pTable.infoData"
            >
              <vxe-table-column
                v-for="(config, index) in pTable.column"
                :key="index" v-bind="config"
              />
            </vxe-table>
            <vxe-pager
              class="mt-4 pt-12 pb-16"
              background
              size="mini"
              :current-page="pPages.current"
              :page-size="pPages.size"
              :total="pPages.total"
              :page-sizes="pPages.pageSizeList"
              :page-count=5
              @page-change="pPagesLimit">
            </vxe-pager>
          </div>
      </t-card>
    </t-dialog>
    <t-dialog :visible.sync="dialog.log" v-if="dialog.log"
          header="关联告警列表"
          placement="center"
          width="1140px"
          preventScrollThrough
          @cancel="dialog.log=false"
          @confirm="dialog.log=false"
    >
      <t-card style="border-radius: 0px; min-height: 620px" :bordered="false">
        <t-form class="l-row" @submit="logSubmit" >
            <div class="l-row l-items-center mr-2 l-col-3">
              <span style="text-align:right" class="mr-2 l-col-4">关联设备</span>
              <t-input
                v-model="logCondition.hostName"
                outlined
                dense
                class="l-col-7"></t-input>
            </div>
            <div class="l-row l-items-center mr-2 l-col-3">
              <span style="text-align:right" class="l-col-4 mr-2">所属资源池</span>
              <t-select
                v-model="logCondition.resourcePool"
                class="l-col-7"
                :options="resourceOptions"
                ></t-select>
            </div>
            <div class="l-row l-items-center mr-2 l-col-3">
              <span style="text-align:right" class="mr-2 l-col-4">出现时间</span>
              <t-date-picker
              class="l-col-7"
              enable-time-picker
              clearable
              v-model="logCondition.date"
              :presets="{ 现在: new Date() }"
            />
            </div>
            <t-button class=" l-items-center " theme="primary" content="查询" type="submit" ></t-button>
          </t-form>
          <!-- <q-form class="row" @submit="logSubmit">
            <div class="row l-items-center  l-col-3">
              <span class="mr-4">关联设备</span>
              <q-input
                v-model="logCondition.hostName"
                outlined
                dense
                style="width: 70%"></q-input>
            </div>
            <div class="row l-items-center  l-col-3">
              <span class="mr-4">所属资源池</span>
              <q-select
                v-model="logCondition.resourcePool"
                outlined
                dense
                emit-value
                map-options
                :options="resourceOptions"
                style="width: 70%"></q-select>
            </div>
            <div class="row l-items-center  l-col-3">
              <span class="mr-4">出现时间</span>
              <q-input outlined v-model="logCondition.date" style="width: 70%;">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="logCondition.date" mask="YYYY-MM-DD HH:mm:ss">
                        <div class="row l-items-center justify-end">
                          <q-btn v-close-popup label="确认" color="blue" flat size="sm" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="logCondition.date" mask="YYYY-MM-DD HH:mm:ss" format24h with-seconds>
                        <div class="row l-items-center justify-end">
                          <q-btn v-close-popup label="确认" color="blue" flat size="sm" />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <q-btn class="l-items-center " unelevated color="blue" label="查询" type="submit" style="height: 32px"></q-btn>
          </q-form> -->
          <div class="mt-4">
            <vxe-table
              class="text-black"
              auto-resize
              keep-source
              highlight-hover-row
              highlight-hover-column
              ref="logTable"
              id="logTable"
              row-id='id'
              empty-text="暂无关联日志信息"
              border="inner"
              align="left"
              max-height="500"
              size="mini"
              :column-config="{resizable: true}"
              :tooltip-config="{showAll: true}"
              :loading="logTable.loading"
              :seq-config="{startIndex: (logPages.current - 1) * logPages.size }"
              :checkbox-config="{reserve: true}"
              :data="logTable.infoData"
            >
              <vxe-table-column
                v-for="(config, index) in logTable.column"
                :key="index" v-bind="config"
              />
            </vxe-table>
            <vxe-pager
              class="mt-4 pt-12 pb-16"
              background
              size="mini"
              :current-page="logPages.current"
              :page-size="logPages.size"
              :total="logPages.total"
              :page-sizes="logPages.pageSizeList"
              :page-count=5
              @page-change="logPagesLimit">
            </vxe-pager>
          </div>
      </t-card>
    </t-dialog>
    <t-dialog
    :visible.sync="dialog.info"
          header="故障处理方案"
          placement="center"
          width="560px"
          preventScrollThrough
          @cancel="dialog.info=false"
          @confirm="dialog.info=false"

    >
      <t-card class="p-4" style="border-radius: 6px;  height: 720px;" :bordered="false">
        <t-timeline mode="same">
          <div class="l-row l-items-center ">
              <InfoCircleFilledIcon size="30px" class="text-mod-success" style="margin-left: -10px"></InfoCircleFilledIcon>
              <div class="text-positive q-ml-xs" style="font-size: 20px; letter-spacing: 2px;padding-left: 5px">故障处理方案</div>
            </div>
      <t-timeline-item v-for="(item, index) in solutionList" dotColor="yellowgreen" class="mt-4" :key="index" :label="`${titleText}方案${index + 1}`">
                {{ item }}
      </t-timeline-item>
      <t-timeline-item label="" dotColor="yellowgreen" ></t-timeline-item>
     </t-timeline>
      <!--  <q-timeline color="blue">
            <div class="l-row l-items-center ">
              <InfoCircleFilledIcon size="30px" class="text-mod-success"></InfoCircleFilledIcon>
              <q-icon name="health_and_safety" size="30px" color="positive"></q-icon>
              <div class="text-positive q-ml-xs" style="font-size: 20px; letter-spacing: 2px;">故障处理方案</div>
            </div>
          <q-scroll-area class="q-pr-lg" :thumb-style="thumbStyle" style="height: 550px">
            <q-timeline-entry v-for="(item, index) in solutionList" :key="index" :subtitle="`${titleText}方案${index + 1}`" >
              <div style="line-height: 23px; letter-spacing: 2px; white-space: pre-wrap">
                {{ item }}
              </div>
            </q-timeline-entry>
          </q-scroll-area>
        </q-timeline> -->
        <!-- <q-card-section style="padding: 10px 5px 5px 0px">
          <div class="l-row justify-end">
            <q-btn v-close-popup class="q-mr-md" size="sm"  label="我知道了" color="blue"></q-btn>
          </div>
        </q-card-section> -->
      </t-card>
    </t-dialog>
  </div>
</template>

<script>
import { cosListPageAPI } from '@/api/inops/fault/cos'
import { formatDate } from '@/utils/inops/dateUtils'
import { bindingListAPI, getBindCaseAPI } from '@/api/inops/fault/fault'
import { predictSuggestionAPI } from '@/api/inops/AI/AI'
import { InfoCircleFilledIcon } from 'tdesign-icons-vue'

export default {
  name: 'alarmList',
  components: { InfoCircleFilledIcon },
  data () {
    return {
      date: '',
      bindingAlarmList: [],
      solutionList: [],
      condition: {
        caseEvent: '',
        resourcePool: '',
        caseHost: '',
        caseTime: '2022-11-16'
      },
      resourceOptions: [],
      alarmCondition: {
        hostName: '',
        resourcePool: '',
        date: ''
      },
      pCondition: {
        hostName: '',
        resourcePool: '',
        date: ''
      },
      logCondition: {
        hostName: '',
        resourcePool: '',
        date: ''
      },
      table: {
        loading: false,
        data: [],
        infoData: [],
        column: [
          { type: 'checkbox', align: 'center', width: '40' },
          { type: 'seq', title: '序号', align: 'center', width: '50' },
          { field: 'faultScenario', title: '根因事件', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', width: '25%' },
          { field: 'rootCaseAlarm', title: '根因告警', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'dcName', title: '所属资源池', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'rootCaseDevice', title: '根因设备', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', width: '15%' },
          { field: 'hostList', title: '关联设备', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'alarmList', title: '关联告警', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'riskList', title: '关联性能', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'logList', title: '关联日志', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'analyzeTime', title: '根因分析时间', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' }
        ]
      },
      pages: {
        pageSizeList: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      alarmTable: {
        loading: false,
        data: [],
        infoData: [],
        column: [
          { type: 'seq', title: '序号', align: 'center', width: '50' },
          { field: 'vmName', title: '关联设备', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'dcName', title: '所属资源池', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'alarmName', title: '关联告警', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'hitTime', title: '出现时间', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' }
        ]
      },
      alarmPages: {
        pageSizeList: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      pTable: {
        loading: false,
        infoData: [],
        column: [
          { type: 'seq', title: '序号', align: 'center', width: '50' },
          { field: 'objectName', title: '关联设备', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'dcName', title: '所属资源池', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'faultdesczh', title: '关联性能', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', width: '45%' },
          { field: 'occurrencetime', title: '出现时间', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' }
        ]
      },
      pPages: {
        pageSizeList: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      logTable: {
        loading: false,
        infoData: [],
        column: [
          { type: 'seq', title: '序号', align: 'center', width: '50' },
          { field: 'vmName', title: '关联设备', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'dcName', title: '所属资源池', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'para', title: '关联日志', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'hitTime', title: '出现时间', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' }
        ]
      },
      logPages: {
        pageSizeList: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },
      dialog: {
        alarm: false,
        p: false,
        log: false,
        info: false
      }
    }
  },
  async mounted () {
    this.date = formatDate(new Date())
    await this.getBindingAlarm()
    this.getCosListPage()
  },
  methods: {
    async getBindingAlarm () {
      await bindingListAPI().then(async res => {
        const { data } = res
        if (data.code === 200) {
          await data.data.forEach(item => {
            this.bindingAlarmList.push(item.alarmName)
          })
        }
      })
    },
    getCosListPage () {
      this.table.loading = true
      const params = {
        pageNum: this.pages.current,
        pageSize: this.pages.size
      }
      const data = {}
      cosListPageAPI(params, data).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.table.data = data.data.records
          this.table.infoData = data.data.records
          this.pages.total = data.data.total
          const index = this.pages.pageSizeList.findIndex(v => v.label === '全部')
          this.pages.pageSizeList[index].value = Math.floor(this.pages.total)
          this.pages.size = data.data.size
          this.pages.current = data.data.current
          this.table.loading = false
        }
      })
    },
    getAISuggesion (data) {
      predictSuggestionAPI(data).then(async res => {
        const { data } = res
        if (data.code === 200) {
          this.solutionList = []
          await data.data.forEach(item => {
            this.solutionList.push(item.solution)
          })
        }
      })
    },
    submitEvent () {
      if (this.condition.caseEvent.indexOf('计算') > -1) {
        this.table.infoData = this.table.data.filter(item => {
          return item.rootCaseDevice.indexOf('SRV') > -1
        })
      } else if (this.condition.caseEvent.indexOf('存储') > -1) {
        this.table.infoData = this.table.data.filter(item => {
          return item.rootCaseDevice.indexOf('DBS') > -1
        })
      } else if (this.condition.caseEvent.indexOf('网络') > -1) {
        this.table.infoData = this.table.data.filter(item => {
          return item.rootCaseDevice.indexOf('TOR') > -1
        })
      } else {
        this.table.infoData = this.table.data
      }
    },
    alarmSubmit () {
      console.log('查询')
    },
    pSubmit () {
      console.log('查询')
    },
    logSubmit () {
      console.log('查询')
    },
    setPages (type) {
      this[`${type}Pages`].total = this[`${type}Table`].data.length
      this[`${type}Table`].infoData = this[`${type}Table`].data.slice((this[`${type}Pages`].current - 1) * this[`${type}Pages`].size, this[`${type}Pages`].current * this[`${type}Pages`].size)
      const index = this[`${type}Pages`].pageSizeList.findIndex(v => v.label === '全部')
      this[`${type}Pages`].pageSizeList[index].value = this[`${type}Pages`].total
    },
    pagesLimit ({ currentPage, pageSize }) {
      this.pages.current = currentPage
      this.pages.size = pageSize
      this.getCosListPage()
    },
    showInfo (type, row) {
      this[`${type}Pages`].current = 1
      this[`${type}Pages`].size = 10
      this[`${type}Table`].data = type === 'alarm' ? row.alarmList : (type === 'p' ? row.riskList : row.logList)
      this.setPages(type)
      this.dialog[type] = true
    },
    alarmPagesLimit ({ currentPage, pageSize }) {
      this.alarmPages.current = currentPage
      this.alarmPages.size = pageSize
      this.setPages('alarm')
    },
    pPagesLimit ({ currentPage, pageSize }) {
      this.pPages.current = currentPage
      this.pPages.size = pageSize
    },
    logPagesLimit ({ currentPage, pageSize }) {
      this.logPages.current = currentPage
      this.logPages.size = pageSize
    },
    showCase (row) {
      this.titleText = ''
      getBindCaseAPI(row.rootCaseAlarm).then(async res => {
        const { data } = res
        if (data.code === 200) {
          this.solutionList = []
          await data.data.forEach(item => {
            this.solutionList.push(item.summary)
          })
          this.dialog.info = true
        }
      })
    },
    async aiSuggesion (alarmName) {
      this.titleText = 'AI方案智荐-'
      const data = {
        alarmDeviceType: '',
        alarmDeviceVender: '',
        company: '',
        major: '',
        caseType: '',
        category: '故障',
        question: alarmName,
        top_k: '3'
      }
      await this.getAISuggesion(data)
      this.dialog.info = true
    }
  }
}
</script>
