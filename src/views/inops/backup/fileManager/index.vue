<template>
  <div>
    <div class="bg-mod-card" style="padding: 15px">
      <t-row align="center" style="padding: 10px; background: rgba(237, 242, 254, 1);">
        <div class="align--center" style="width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 8px; background-color: rgba(194, 212, 255, 1)">
          <svg-icon color="#165DFF" name="backup_server"></svg-icon>
        </div>
        <div class="ml-5 mr-10">
          <div>备份主服务器</div>
          <div style="font-size: 14px; font-weight: bold; color: #165DFF">{{ space.used }}(G) / {{ space.total }}(G)</div>
        </div>
        <t-col :md="9" :sm="6" :xs="6">
          <t-progress theme="plump" :status="'success'" :percentage="progressLabel" :style="{ backgroundColor: progress.color }" style="border-radius: 0px;" />
        </t-col>
      </t-row>
      <t-row class="mt-5" align="center">
        <span class="mr-5" style="font-size: 12px">备份类型</span>
        <t-select class="mr-10" v-model="condition.backupType" :options="dict.backupType" clearable filterable :minCollapsedNum="1" style="width: 200px"></t-select>
        <span class="mr-5" style="font-size: 12px">设备类型</span>
        <t-cascader :show-all-levels="false" v-model="value.deiceeResult" :options="options" multiple clearable style="width:150px" :minCollapsedNum="1" />
          <span class="mr-5" style="margin-left: 20px;font-size: 12px">日期</span>
          <t-date-range-picker class="mr-10" v-model="condition.range" allow-input clearable style="width: 250px" />
        <t-button theme="primary" @click="taskInfoApply">查询</t-button>
      </t-row>
      <div class="mt-5" id="taskInfo" style="height: 250px; width: 100%"></div>
    </div>
    <div class="bg-mod-card" style="padding: 15px">
      <div class="mt-4">
        <t-form label-align="left" :data="value" ref="form" @submit="onApply" @reset="onReset">
          <t-row>
            <t-col class="mb-5" :span="3" v-for="(item, index) in fieldList" :key="index">
              <t-form-item :label="item.name" :name="item.value" style="width: 80%">
                <t-input v-if="item.type === 'input'" v-model.trim="value[item.value]" clearable style="width: 100%"></t-input>
                <t-select v-else-if="item.type === 'select'" v-model="value[item.value]" :options="dict[item.value]" :multiple="item.isMultiple" :autoWidth="true" :minCollapsedNum="1" clearable filterable style="width: 100%"></t-select>
                <t-cascader :span="4" v-else-if="item.type === 'cascader'" :show-all-levels="false" v-model="value[item.value]" :options="options" multiple clearable style="width:180px" :minCollapsedNum="1" />
                <t-date-picker v-else-if="item.type === 'date'" v-model="value[item.value]" allow-input clearable style="width: 100%" />
              </t-form-item>
            </t-col>
            <t-col class="mb-5" :span="3">
              <t-row class="justify-end" style="width: 80%">
                <t-button class="mr-5" theme="primary" type="submit">提交</t-button>
                <t-button theme="default" variant="base" type="reset">重置</t-button>
              </t-row>
            </t-col>
          </t-row>
        </t-form>
      </div>
      <t-divider></t-divider>
      <t-row align="center">
        <div v-show="diffFileList.length === 0" style="color: #AAAEB7">暂未选择文件对比</div>
        <t-tag
          class="mr-5"
          closable
          v-for="(tag, index) in diffFileList"
          :key="index"
          variant="outline" theme="default"
          maxWidth="100"
          @close="removeDiff(tag.id)"
        >
          {{ tag.fileName }}
        </t-tag>
        <t-col flex="auto">
          <t-row justify="end">
            <t-button class="mr-3" :theme="diffFileList.length !== 2 ? 'default' : 'primary'" :disable="diffFileList.length !== 2" @click="showDiff">
              <t-row align="center">
                <mod-icon class="mr-2" name="compare" style="color: #ffffff"></mod-icon>
                <span style="color: #ffffff">差异对比</span>
              </t-row>
            </t-button>
            <t-button variant="outline" theme="default" @click="download('batch')">
              <t-row align="center">
                <mod-icon name="download"></mod-icon>
                <span>打包下载</span>
              </t-row>
            </t-button>
          </t-row>
        </t-col>
      </t-row>
      <div style="margin-top: 15px">
        <t-table
          hover resizable multipleSort
          row-key="id"
          size="small"
          table-layout="fixed"
          cell-empty-content="-"
          max-height="600"
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
          <template #resourcePool="{ row }">
            {{ formatField(dict.resourcePool, 'label', row.resourcePool) }}
          </template>
          <template #backupState="{ row }">
            {{ formatField(dict.backupState, 'label', row.backupState) }}
          </template>
          <template #fileSize="{ row }">
            <span>{{ row.fileSize | unitFilter }}</span>
          </template>
          <template #cleanFlag="{ row }">
            <span>{{ row.cleanFlag === '0' ? '未归档' : '已归档'}}</span>
          </template>
          <template #slot-user="{ row, col }">
            {{ formatField(dict.user, 'name', row[col.colKey]) }}
          </template>
          <template #operator="{ row }">
            <t-row>
              <t-button
                class="mr-2"
                size="small"
                variant="text"
                :theme="row.cleanFlag === '0' && (['ok', 'unqualified'].includes(row.backupState)) ? 'primary' : 'default'"
                :disabled="row.cleanFlag === '1' || !(['ok', 'unqualified'].includes(row.backupState))"
                @click="showContent(row)">查看文件内容</t-button>
              <t-button
                class="mr-2"
                size="small"
                variant="text"
                :theme="row.cleanFlag === '0' && (['ok', 'unqualified'].includes(row.backupState)) ? 'primary' : 'default'"
                :disabled="row.cleanFlag === '1' || !(['ok', 'unqualified'].includes(row.backupState))"
                @click="addDiff(row)">添加对比</t-button>
              <t-button
                class="mr-2"
                size="small"
                variant="text"
                :theme="row.cleanFlag && (['ok', 'unqualified'].includes(value.backupState)) ? 'primary' : 'default'"
                :disabled="row.cleanFlag === '1' || !(['ok', 'unqualified'].includes(row.backupState))"
                @click="download('single', row.id)">下载</t-button>
            </t-row>
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
    <t-dialog header="备份文件对比" placement="center" width="90%" preventScrollThrough v-if="dialog.diff" :visible.sync="dialog.diff" :footer="false">
      <t-row align="center">
        <t-col :span="6">
          <t-row justify="start">备份文件：<span style="color: #AAAEB7">{{ content.oldFileName }}</span></t-row>
        </t-col>
        <t-col :span="6">
          <t-row justify="end">备份文件：<span style="color: #AAAEB7">{{ content.newFileName }}</span></t-row>
        </t-col>
      </t-row>
      <t-row class="mt-5" align="center">
        <t-col :span="6">
          <t-row justify="start">备份时间：<span style="color: #AAAEB7">{{ content.oldBackupDate }}</span></t-row>
        </t-col>
        <t-col :span="6">
          <t-row justify="end">备份时间：<span style="color: #AAAEB7">{{ content.newBackupDate }}</span></t-row>
        </t-col>
      </t-row>
      <diff :newValue = content.new :oldValue = content.old :lang = content.lang ></diff>
    </t-dialog>
    <t-dialog header="查看文件" placement="center" width="720px" preventScrollThrough v-if="dialog.content" :visible.sync="dialog.content" :footer="false">
      <div>
        <t-table
          hover resizable selectOnRowClick multipleSort
          row-key="id"
          size="small"
          table-layout="fixed"
          cell-empty-content="-"
          max-height="300"
          :empty="infoTable.empty"
          :data="infoTable.data"
          :columns="infoTable.column"
          :loading="infoTable.loading"
          style="font-size: 12px"
        >
          <template #hostMfgr="{ row }">
            {{ formatField(dict.hostMfgr, 'label', row.hostMfgr) }}
          </template>
        </t-table>
      </div>
      <t-row class="mt-5" align="center">
        <span class="mr-5">关键词</span>
        <t-input v-model.trim="searchContext.keyWords" clearable style="width: 200px"></t-input>
        <t-button class="mr-3" theme="primary" @click="searchLast">上一个</t-button>
        <t-button theme="primary" @click="searchNext">下一个</t-button>
        <t-col flex="auto">
          <t-row justify="end">
            <div style="color: #AAAEB7">{{ searchContext.indexNum }} / {{ searchContext.total }}</div>
          </t-row>
        </t-col>
      </t-row>
      <div class="scrollbar-style" style="overflow-y: scroll; padding: 15px; height: 540px">
        <search-high-light
          class="p-4"
          ref="search"
          :content="searchContext.content"
          :keyword="searchContext.keyWords"
          style="white-space: pre-wrap"
          @current-change="currentChange"
          @match-count-change="matchCountChange"></search-high-light>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import { formatField } from '@/utils/inops/formatUtils'
import * as echarts from 'echarts'
import { getDictList } from '@/utils/inops/u'
import diff from '@/components/ContentDiff/diff'
import searchHighLight from 'vue-search-highlight'
import { getUserListApi } from '@/api/system/user'
import { listPageAPI, getBackupSpaceAPI, getFileOfIdAPI, countFileByRpAPI } from '@/api/inops/netBackup/backupFile'
import { unitTrans } from '@/utils/inops/UnitTrans'
import { onBackupDownload } from '@/utils/inops/file'
import { formatDate } from '@/utils/inops/dateUtils'
import { recordsListPageAPI } from '@/api/inops/netBackup/backupRecords'
export default {
  name: 'index',
  components: { diff, searchHighLight },
  data () {
    return {
      date: '',
      url: '',
      loading: {
        file: true,
        content: true,
        diff: true
      },
      options: [
        {
          label: '交换机',
          value: 'switch',
          children: [
            {
              label: 'TOR',
              value: 'tor',
              children: [
                {
                  label: 'S-TOR',
                  value: 's-tor'
                },
                {
                  label: 'ST-TOR',
                  value: 'st-tor'
                },
                {
                  label: 'M-TOR',
                  value: 'm-tor'
                },
                {
                  label: 'DM-TOR',
                  value: 'dm-tor'
                }
              ]
            },
            {
              label: 'EOR',
              value: 'eor',
              children: [
                {
                  label: 'M-EOR',
                  value: 'm-eor'
                },
                {
                  label: 'S-EOR',
                  value: 's-eor'
                },
                {
                  label: 'ST-EOR',
                  value: 'st-eor'
                }
              ]
            }
          ]
        },
        {
          label: '路由器',
          value: 'router',
          children: [
            {
              label: 'E-RT',
              value: 'e-rt'
            },
            {
              label: 'S-RT',
              value: 's-rt'
            },
            {
              label: 'CE',
              value: 'ce'
            },
            {
              label: 'CMNET',
              value: 'cmnet'
            }
          ]
        },
        {
          label: '防火墙',
          value: 'firewall',
          children: [
            {
              label: 'M-FW',
              value: 'm-fw'
            },
            {
              label: 'S-FW',
              value: 's-fw'
            }
          ]
        },
        {
          label: '负载均衡',
          value: 'lb'
        }
      ],
      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },
      space: {
        total: '',
        used: ''
      },
      dict: {
        list: ['resourcePool', 'hostMfgr', 'hostModel', 'backupType', 'backupState', 'backupResult', 'hostPurposeLabel', 'Pool'],
        user: [],
        cleanFlag: [{ label: '已归档', value: '1' }, { label: '未归档', value: '0' }],
        resourcePool: [],
        Pool: [],
        hostMfgr: [],
        hostModel: [],
        backupType: [],
        backupState: [],
        backupResult: []
      },
      recordCondition: {
        jobId: '',
        backupResult: '',
        backupState: ''
      },
      condition: {
        backupType: 'net_configuration',
        beginDate: '',
        endDate: '',
        range: []
      },
      content: {
        newFileName: '',
        oldFileName: '',
        newBackupDate: '',
        oldBackupDate: '',
        new: '',
        old: ''
      },
      searchContext: {
        keyWords: '',
        content: '',
        indexNum: 0,
        total: 0
      },
      diffFileList: [],
      diffFile: {},
      isExpand: false,
      progress: {
        value: 0,
        color: ''
      },
      value: {
        fileName: '',
        backupDate: '',
        jobId: '',
        backupResult: '',
        cleanFlag: '',
        hostName: '',
        cleanDate: '',
        resourcePool: '',
        backupType: '',
        label: [],
        deiceeResult: [],
        Pool: [],
        hostPurposeLabel: [],
        orders: []
      },
      fieldList: [
        { name: '设备名', value: 'fileName', type: 'input' },
        { name: '资源池', value: 'Pool', type: 'select', isMultiple: true },
        { name: '设备类型', value: 'label', type: 'cascader' },
        { name: '备份类型', value: 'backupType', type: 'select' },
        { name: '备份结果', value: 'backupResult', type: 'select' },
        { name: '备份日期', value: 'backupDate', type: 'date' },
        { name: '归档时间', value: 'cleanDate', type: 'date' },
        { name: '归档状态', value: 'cleanFlag', type: 'select' }
      ],
      table: {
        ref: 'backuoFileInfo',
        empty: '暂无备份文件记录',
        loading: false,
        sort: [],
        select: [],
        data: [],
        column: [
          { colKey: 'row-select', title: '选择', type: 'multiple', width: 50 },
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'hostName', title: '设备名称', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'resourcePool', title: '所属资源池', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'fileSize', title: '文件大小', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'updateDate', title: '备份时间', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'backupState', title: '备份结果', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'cleanDate', title: '归档时间', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'cleanFlag', title: '归档状态', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'createBy', title: '创建人', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true, cell: 'slot-user' },
          { colKey: 'operator', title: '操作', align: 'center', width: '250', fixed: 'right' }
        ]
      },
      pages: {
        list: [10, 50, 100, 200, 500, 1000, { label: '全部', value: '' }],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      infoTable: {
        ref: 'tb_info',
        empty: '暂未创建备份文件信息',
        loading: false,
        data: [],
        column: [
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'fileName', title: '备份文件名', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true, cell: 'slot-user' },
          { colKey: 'filePath', title: '文件路径', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'hostMfgr', title: '所属厂家', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'hostModel', title: '设备型号', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true }
        ]
      },
      taskInfoChart: {
        dom: null,
        options: null,
        resourcePool: [],
        success: [],
        fail: []
      },
      dialog: {
        diff: false,
        content: false
      }
    }
  },
  async mounted () {
    this.table.loading = true
    this.initData()
    await this.getDict()
    await this.getUserDict()
    this.initDate()
    if (this.recordCondition.jobId) {
      this.getRecordsResult()
    } else {
      this.getInfoData()
    }
    this.getBackupSpace()
    this.getCountFileByRp({
      backupType: this.condition.backupType,
      beginDate: this.condition.beginDate,
      endDate: this.condition.endDate
    })
  },
  watch: {
    'dialog.content': {
      handler (newVal) {
        if (!newVal) {
          this.loading.content = true
        }
      }
    },
    'dialog.diff': {
      handler (newVal) {
        if (!newVal) {
          this.loading.diff = true
        }
      }
    }
  },
  computed: {
    progressLabel () {
      return parseFloat((this.progress.value * 100).toFixed(2))
    }
  },
  filters: {
    unitFilter (value) {
      return value ? unitTrans(value) : ''
    },
    colorFilter (value) {
      return value.cleanFlag && (['ok', 'unqualified'].includes(value.backupState)) ? 'blue' : 'grey'
    },
    disableFilter (value) {
      return value.cleanFlag === '1' || !(['ok', 'unqualified'].includes(value.backupState))
    }
  },
  methods: {
    formatField,
    async getDict () {
      for (const item of this.dict.list) {
        this.dict[item] = await getDictList(item)
        this.dict.Pool = this.dict.resourcePool
      }
    },
    initData () {
      const { id, jobId, recordType, backupResult } = this.$route.query
      this.value.backupResult = backupResult
      this.value.jobId = id
      this.recordCondition.jobId = jobId
      if (['jobfail', 'unreachable'].includes(recordType)) {
        this.recordCondition.backupState = recordType
      } else {
        this.recordCondition.backupResult = recordType
      }
    },
    initDate () {
      this.date = formatDate(new Date())
      this.condition.beginDate = formatDate(new Date())
      this.condition.endDate = formatDate(new Date())
      this.condition.range = [this.condition.beginDate, this.condition.endDate]
      this.value.backupDate = formatDate(new Date())
    },
    async getUserDict () {
      await getUserListApi().then(response => {
        const { data } = response
        if (data.code === 0) {
          for (const item of data.data) {
            if (item.delFlag === '0') {
              const params = {
                label: item.userName,
                name: item.nickName,
                value: item.userId.toString()
              }
              this.dict.user.push(params)
            }
          }
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
    },
    getBackupSpace () {
      getBackupSpaceAPI().then(res => {
        const { data } = res
        if (data.code === 200) {
          const { total, used } = data.data
          this.space.used = (used / 1024 / 1024 / 1024).toFixed(2)
          this.space.total = (total / 1024 / 1024 / 1024).toFixed(2)
          this.progress.value = Number((this.space.used / this.space.total).toFixed(2))
          if (this.progress.value <= 0.8) {
            this.progress.color = 'green-16'
          } else {
            if (this.progress.value > 0.8 && this.progress.value <= 0.9) {
              this.progress.color = 'deep-orange'
            } else {
              this.progress.color = 'red-14'
            }
          }
        }
      })
    },
    async getCountFileByRp (data) {
      await countFileByRpAPI(data).then(async res => {
        const { data } = res
        if (data.code === 200) {
          this.taskInfoChart.resourcePool = []
          this.taskInfoChart.success = []
          this.taskInfoChart.fail = []
          const result = data.data
          const keys = Object.keys(result).sort()
          this.taskInfoChart.resourcePool = keys
          await keys.forEach(item => {
            this.taskInfoChart.success.push(result[item].success)
            this.taskInfoChart.fail.push(result[item].fail)
          })
          this.loading.file = false
          this.initTaskInfo()
        }
      })
    },
    initTaskInfo () {
      const chartDom = document.getElementById('taskInfo')
      this.taskInfoChart.dom = echarts.init(chartDom)
      this.taskInfoChart.options = {
        grid: {
          top: '15%',
          left: '3%',
          right: '5%',
          bottom: '10%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        color: ['#165dff', '#ffa627'],
        legend: {
          orient: 'vertical',
          right: 'right',
          top: 'center',
          data: ['成功', '失败']
        },
        dataZoom: {
          type: 'inside'
        },
        xAxis: [
          {
            type: 'category',
            data: this.taskInfoChart.resourcePool,
            axisPointer: {
              type: 'shadow'
            },
            axisLabel: {
              overflow: 'break',
              formatter: function (value) {
                const length = value.split('-').length
                return `${value.split('-')[length - 2] === 'HNGZ' ? '广州' : '湛江'}${value.split('-')[length - 1]}`
              }
            }
          }
        ],
        yAxis: {
          type: 'value',
          name: '备份文件数'
        },
        series: [
          {
            name: '成功',
            type: 'bar',
            stack: 'total',
            data: this.taskInfoChart.success.map(item => {
              return {
                value: item,
                label: {
                  show: true,
                  fontWeight: 'bold',
                  color: item > 0 ? '#ffffff' : '#00c853',
                  position: item > 0 ? 'inside' : 'bottom'
                },
                itemStyle: {
                  color: '#165dff'
                }
              }
            }),
            barWidth: 30,
            label: {
              show: true,
              position: 'inside',
              fontWeight: 'bold',
              color: '#00c853'
            }
          },
          {
            name: '失败',
            type: 'bar',
            stack: 'total',
            barWidth: 30,
            data: this.taskInfoChart.fail.map(item => {
              return {
                value: item,
                label: {
                  show: true,
                  fontWeight: 'bold',
                  color: '#ef5350',
                  position: 'top'
                },
                itemStyle: {
                  color: '#ffa627'
                }
              }
            })
            // itemStyle: {
            //   color: '#ffa627'
            // },
            // label: {
            //   show: true,
            //   fontWeight: 'bold',
            //   color: '#ef5350',
            //   position: 'inside'
            // }
          }
        ]
      }
      this.taskInfoChart.options && this.taskInfoChart.dom.setOption(this.taskInfoChart.options)
    },
    getInfoData () {
      const params = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      this.value.hostPurposeLabel = this.value.label.join(',')
      this.value.resourcePool = this.value.Pool.join(',')
      listPageAPI(params, this.value).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.table.data = data.data.records
          const { total, size, current } = data.data
          this.pages = Object.assign(this.pages, { total, size, current })
          this.pages.list[this.pages.list.length - 1].value = total
          this.table.loading = false
        } else {
          this.$message.error({ content: '数据获取失败', placement: 'center' })
          this.table.loading = false
        }
        console.log('device', this.value.hostPurposeLabel)
      })
    },
    getRecordsResult () {
      const params = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      this.table.loading = true
      recordsListPageAPI(params, this.value).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.table.data = data.data.records
          const { total, size, current } = data.data
          this.pages = Object.assign(this.pages, { total, size, current })
          this.pages.list[this.pages.list.length - 1].value = total
          this.table.loading = false
        } else {
          this.$message.error({ content: '数据获取失败', placement: 'center' })
          this.table.loading = false
        }
      })
    },
    taskInfoApply () {
      const data = {
        backupType: this.condition.backupType,
        hostPurposeLabel: this.value.deiceeResult.join(','),
        beginDate: this.condition.range[0],
        endDate: this.condition.range[1]
      }
      this.getCountFileByRp(data)
    },
    getFileOfId (id) {
      return new Promise(resolve => {
        getFileOfIdAPI(id).then(res => {
          const { data } = res
          if (data.code === 200) {
            resolve(data.data)
          }
        })
      })
    },
    onApply () {
      this.getInfoData()
    },
    onReset () {
      this.value = {
        fileName: '',
        backupDate: '',
        jobId: '',
        backupResult: '',
        cleanFlag: '',
        hostName: '',
        cleanDate: '',
        resourcePool: [],
        orders: []
      }
      this.value.backupDate = formatDate(new Date())
    },
    onPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      if (this.recordCondition.jobId) {
        this.getRecordsResult()
      } else {
        this.getInfoData()
      }
    },
    async addDiff (row) {
      if (this.diffFileList.length >= 2) {
        this.$message.warning({ content: '最多只能选择对比两个文件', placement: 'center' })
      } else {
        const index = this.diffFileList.findIndex(item => item.id === row.id)
        if (index === -1) {
          this.diffFileList.push(row)
          await this.$set(this.diffFile, row.id, true)
        } else {
          this.$message.warning({ content: '该数据已被选择', placement: 'center' })
        }
      }
    },
    removeDiff (id) {
      const index = this.diffFileList.findIndex(item => item.id === id)
      this.diffFileList.splice(index, 1)
      this.$delete(this.diffFile, id)
    },
    async showDiff () {
      this.dialog.diff = true
      this.content.oldFileName = this.diffFileList[0].fileName
      this.content.oldBackupDate = this.diffFileList[0].updateDate
      this.content.newFileName = this.diffFileList[1].fileName
      this.content.newBackupDate = this.diffFileList[1].updateDate
      this.content.new = ''
      this.content.old = ''
      await this.getFileOfId(this.diffFileList[0].id).then(data => {
        this.content.old = data
      })
      await this.getFileOfId(this.diffFileList[1].id).then(data => {
        this.content.new = data
      })
      this.loading.diff = false
    },
    async showContent (row) {
      this.dialog.content = true
      this.infoTable.data = []
      const { fileName, filePath, hostMfgr, hostModel } = row
      const obj = { fileName, filePath, hostMfgr, hostModel }
      this.infoTable.data.push(obj)
      this.searchContext.content = ''
      this.searchContext.keyWords = ''
      await this.getFileOfId(row.id).then(data => {
        console.log(data)
        this.searchContext.content = `${data.replaceAll('<', '&lt')}`
      })
      this.loading.content = false
    },
    matchCountChange (count) {
      this.searchContext.total = count
    },
    currentChange (idx) {
      this.searchContext.indexNum = idx
    },
    searchNext () {
      this.$refs.search.searchNext()
    },
    searchLast () {
      this.$refs.search.searchLast()
    },
    async download (type, id) {
      if (type === 'single') {
        onBackupDownload('single', id, null)
      } else if (type === 'batch') {
        if (this.table.select.length > 0) {
          const data = {
            ids: this.table.select
          }
          onBackupDownload('batch', '', data)
        } else {
          this.$message.warning({ content: '请至少选择一条数据', placement: 'center' })
        }
      }
    },
    /**
     * 表格排序
     * @param sortList
     */
    onSort (val) {
      this.value.orders = []
      this.table.sort = val
      val.forEach(item => {
        this.value.orders.push({
          column: `a.${item.sortBy.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase()}`,
          asc: !item.descending
        })
      })
      this.getInfoData()
    },
    /**
     * 表格选择
     * @param value 选择项
     * @param selectedRowData 选择行数据
     * @param type 选择类型 check uncheck check_all_box
     * @param currentRowKey 当前行id
     */
    onSelectChange (value) {
      this.table.select = value
    }
  }
}
</script>

<style lang="sass" scoped>
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
/deep/ .t-input.t-is-readonly.t-input--focused.t-input--prefix.t-input--suffix
  width: 180px
/deep/ .t-input__wrap.t-input--auto-width
  min-width: 100% !important
</style>
