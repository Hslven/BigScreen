<template>
  <div>旧故障方案</div>
  <!-- <div class="q-pa-md">
    <div class="bg-white q-pa-md" style="border-radius: 6px;">
      <q-form @submit="submit">
        <div class="row col-12">
          <div class="row col-4 items-center vertical-middle">
            <span>告警标题：</span>
            <q-input
              v-model="condition.alarmName"
              dense
              outlined
              style="width: 70%"></q-input>
          </div>
          <div class="row col-4 items-center vertical-middle">
            <span>告警设备：</span>
            <q-input
              v-model="condition.name"
              dense
              outlined
              style="width: 70%"></q-input>
          </div>
          <div class="row col-4 items-center vertical-middle">
            <span>告警状态：</span>
            <q-select
              v-model="condition.clearedState"
              dense
              outlined
              :options="['已清除', '未清除']"
              style="width: 70%">
            </q-select>
          </div>
        </div>
        <div class="row col-12 q-mt-md">
          <div class="row col-4 items-center vertical-middle">
            <span>开始时间：</span>
            <q-input dense outlined v-model="condition.startDate" style="width: 70%">
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer" size="sm">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="condition.startDate" minimal mask="YYYY-MM-DD">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="row col-4 items-center vertical-middle">
            <span>时间片段：</span>
            <q-input outlined v-model="condition.startTime" mask="time" style="width: 30%">
              <template v-slot:prepend>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="condition.startTime">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确认" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <span class="q-mx-md">~</span>
            <q-input outlined v-model="condition.endTime" mask="time" style="width: 30%">
              <template v-slot:prepend>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time
                      v-model="condition.endTime"
                      with-seconds
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确认" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <q-btn class="column items-center vertical-middle" unelevated label="查询" color="blue" style="height: 32px"></q-btn>
        </div>
      </q-form>
    </div>
    <div class="bg-white q-mt-md q-pa-md" style="border-radius: 6px">
      <div class="row justify-end">
        <q-btn unelevated label="根因分析" color="blue" size="sm" @click="causeAnalysis"></q-btn>
      </div>
      <div class="q-mt-sm">
        <vxe-table
          stripe
          auto-resize
          keep-source
          highlight-hover-row
          highlight-current-row
          highlight-hover-column
          highlight-current-column
          resizable
          ref="infoTable"
          id="infoTable"
          row-id='id'
          empty-text="暂无告警信息！"
          border="default"
          max-height="450"
          size="mini"
          :loading="table.loading"
          :seq-config="{startIndex: (pages.current - 1) * pages.size }"
          :checkbox-config="{reserve: true}"
          :data="table.infoData"
        >
          <vxe-table-column
            v-for="(config, index) in table.column"
            :key="index" v-bind="config"
          >
            <template v-if="config.field === 'clearedState'" v-slot="{ row }">
              <div v-if="row.clearedState !== '已清除'" class="status-point bg-red"></div>
              <div v-else-if="row.clearedState === '已清除'" class="status-point bg-positive"></div>
              <span class="q-ml-xs">{{ row.clearedState === '已清除' ? '已清除' : '未清除' }}</span>
            </template>
            <template v-else-if="config.field === 'resourcePoolName'" v-slot="{ row }">
              <q-chip class="ellipsis" outline square size="sm" color="teal" :label="row.resourcePoolName"></q-chip>
            </template>
            <template v-else-if="config.field === 'alarmTime'" v-slot="{ row }">
              {{ row.alarmTime ? row.alarmTime : '0秒' }}
            </template>
            <template v-else-if="config.field === 'additionalInformation'" v-slot="{ row }">
              <span class="text-blue cursor-pointer" style="text-decoration: underline; letter-spacing: 1px">{{ row.additionalInformation }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column field="operation" title="操作" align="center" width="150px">
            <template v-slot="{ row }">
              <q-btn  class="q-mr-sm" dense flat size="sm"
                      :color="bindingAlarmList.includes(row.alarmName) ? 'positive' : 'grey'" label="查看方案"
                      :disable="!bindingAlarmList.includes(row.alarmName)"
                      @click="showCase(row)"></q-btn>
            </template>
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          class="q-mt-sm"
          background
          size="mini"
          :current-page="pages.current"
          :page-size="pages.size"
          :total="pages.total"
          :page-sizes="pages.pageSizeList"
          :page-count=5
          :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"
          @page-change="pagesLimit">
        </vxe-pager>
      </div>
    </div>
    <q-dialog v-model="dialog.info" persistent transition-show="scale" transition-hide="scale">
      <q-card class="q-pa-md" style="border-radius: 6px; min-width: 540px; height: 720px;">
        <q-timeline color="blue">
          <q-timeline-entry heading>
            <div class="row items-center vertical-middle">
              <q-icon name="health_and_safety" size="30px" color="positive"></q-icon>
              <div class="text-positive q-ml-xs" style="font-size: 20px; letter-spacing: 2px;">故障处理方案</div>
            </div>
          </q-timeline-entry>
          <q-scroll-area class="q-pr-lg" :thumb-style="thumbStyle" style="height: 570px">
            <q-timeline-entry v-for="(item, index) in solutionList" :key="index" :subtitle="`${titleText}方案${index + 1}`" >
              <div style="line-height: 23px; letter-spacing: 2px; white-space: pre-wrap">
                {{ item }}
              </div>
            </q-timeline-entry>
          </q-scroll-area>
        </q-timeline>
        <q-card-section style="padding: 10px 5px 5px 0px">
          <div class="row justify-end">
            <q-btn v-close-popup class="q-mr-md" size="sm"  label="我知道了" color="blue"></q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog full-height v-model="dialog.analysis" position="right">
      <q-card style="min-width: 480px">
        <q-card-section class="row items-center q-pb-none bg-blue-13" style="padding: 5px 15px">
          <div class="text-h6 text-white" style="letter-spacing: 2px">告警根因分析</div>
          <q-space/>
          <q-btn flat round dense v-close-popup icon="close" color="white"/>
        </q-card-section>
        <q-card-section style="padding: 5px 5px 0px 15px">
          <q-scroll-area :thumb-style="thumbStyle" style="height: 85vh">
            <div class="q-pr-md q-mb-xl" v-for="(item, index) in alarmName" :key="index">
              <div class="row items-center vertical-middle">
                <span class="text-weight-bold" style="font-size: 14px">根因分析</span>
                <span class="q-ml-md text-positive text-weight-bold">{{ 97 - 5 * index}}</span>
                <q-space></q-space>
                <q-btn unelevated label="AI方案推荐" color="blue" size="sm" @click="aiSuggesion(item)"></q-btn>
              </div>
              <div class="q-mt-md">
                <div class="text-grey">根因告警</div>
                <div class="q-mt-sm q-pa-sm" style="border-bottom: 1px solid #eeeeee">{{ item }}</div>
              </div>
              <div class="q-mt-md">
                <div class="text-grey">关联告警</div>
                <div class="q-mt-sm q-pa-sm" style="border-bottom: 1px solid #eeeeee">{{ item }}</div>
              </div>
            </div>
          </q-scroll-area>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div> -->
</template>

<script>
// import { formatTime } from '@/utils/inops/dateUtils'
// import { getAlarmListAPI } from '@/api/monitor/alarm'
// import { bindingListAPI, getBindCaseAPI } from '@/api/inops/fault/fault'
// import { predictSuggestionAPI } from '@/api/inops/AI/AI'

// export default {
//   name: 'faultForm',
//   data () {
//     return {
//       bindingAlarmList: [],
//       condition: {
//         name: '',
//         alarmName: '',
//         clearedState: '',
//         startDate: '',
//         startTime: '',
//         endTime: ''
//       },
//       table: {
//         loading: false,
//         infoData: [],
//         column: [
//           { type: 'checkbox', align: 'center', width: '40' },
//           { type: 'seq', title: '序号', align: 'center', width: '50' },
//           { field: 'name', title: '告警设备', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: '15%' },
//           { field: 'resourcePoolName', title: '所属资源池', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: '10%' },
//           { field: 'alarmName', title: '告警名称', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true, width: '10%' },
//           { field: 'alarmTime', title: '告警时间', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
//           { field: 'clearedState', title: '清除状态', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
//           { field: 'neName', title: '网元名称', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
//           { field: 'neType', title: '网元类型', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
//           { field: 'neVersion', title: '网元型号', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true }
//         ]
//       },
//       pages: {
//         pageSizeList: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
//         total: 0,
//         current: 1,
//         size: 10,
//         align: 'right'
//       },
//       dialog: {
//         info: false,
//         bind: false,
//         analysis: false,
//         detail: false
//       },
//       titleText: '',
//       solutionList: [],
//       alarmName: [],
//       thumbStyle: {
//         right: '2px',
//         borderRadius: '5px',
//         backgroundColor: '#027be3',
//         width: '5px',
//         opacity: 0.75
//       }
//     }
//   },
//   async mounted () {
//     this.initDate()
//     await this.getBindingAlarm()
//     this.getAlarmList()
//   },
//   methods: {
//     initDate () {
//       const startDate = new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7)
//       const endDate = new Date().setTime(new Date().getTime())
//       this.condition.startDate = formatTime(startDate)
//       this.condition.endDate = formatTime(endDate)
//     },
//     async getAlarmList () {
//       this.table.loading = true
//       const params = {
//         page: this.pages.current,
//         pageSize: this.pages.size
//       }
//       const data = Object.assign({}, params, this.condition)
//       await getAlarmListAPI(data).then(res => {
//         const { data } = res
//         if (data.code === 0) {
//           this.table.infoData = data.data.records
//           this.pages.total = data.data.total
//           const index = this.pages.pageSizeList.findIndex(v => v.label === '全部')
//           this.pages.pageSizeList[index].value = Math.floor(this.pages.total)
//           this.pages.size = data.data.size
//           this.pages.current = data.data.current
//         }
//       })
//       this.table.loading = false
//     },
//     async getBindingAlarm () {
//       await bindingListAPI().then(async res => {
//         const { data } = res
//         if (data.code === 200) {
//           await data.data.forEach(item => {
//             this.bindingAlarmList.push(item.alarmName)
//           })
//         }
//       })
//     },
//     getAISuggesion (data) {
//       predictSuggestionAPI(data).then(async res => {
//         const { data } = res
//         if (data.code === 200) {
//           this.solutionList = []
//           await data.data.forEach(item => {
//             this.solutionList.push(item.solution)
//           })
//         }
//       })
//     },
//     submit () {
//       console.log('查询')
//     },
//     pagesLimit ({ currentPage, pageSize }) {
//       this.pages.current = currentPage
//       this.pages.size = pageSize
//       this.getAlarmList()
//     },
//     showCase (row) {
//       this.titleText = ''
//       getBindCaseAPI(row.alarmName).then(async res => {
//         const { data } = res
//         if (data.code === 200) {
//           this.solutionList = []
//           await data.data.forEach(item => {
//             this.solutionList.push(item.summary)
//           })
//           this.dialog.info = true
//         }
//       })
//     },
//     async aiSuggesion (alarmName) {
//       this.titleText = 'AI方案智荐-'
//       const data = {
//         alarmDeviceType: '',
//         alarmDeviceVender: '',
//         company: '',
//         major: '',
//         caseType: '',
//         category: '故障',
//         question: alarmName,
//         top_k: '3'
//       }
//       await this.getAISuggesion(data)
//       this.dialog.info = true
//     },
//     causeAnalysis () {
//       const records = this.$refs.infoTable.getCheckboxRecords()
//       if (records.length === 0) {
//         this.$message.warning('请选择一条告警')
//       } else {
//         records.forEach(item => {
//           this.alarmName.push(item.alarmName)
//         })
//         this.dialog.analysis = true
//       }
//     }
//   }
// }
</script>

<style scoped>
.status-point {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-right: 5px;
}
</style>
