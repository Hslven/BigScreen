<template>
  <div>
    <div class="bg-mod-card" style="padding: 15px">
      <span class="mr-3">日期</span>
      <t-date-range-picker class="mr-3" v-model="condition.range" allow-input clearable style="width: 250px" />
      <t-button theme="primary" @click="getData">查询</t-button>
    </div>
    <div class="mt-5">
      <t-row>
        <t-col :span="3" style="padding-right: 8px">
          <div class="bg-mod-card" style="padding: 10px">
            <t-row style="height: 32px">总文件备份数</t-row>
            <div id="taskCount" style="height: 200px"></div>
          </div>
        </t-col>
        <t-col :span="9" style="padding-left: 8px">
          <div class="bg-mod-card" style="padding: 10px">
            <t-row style="height: 32px" align="center">
              <span class="mr-3">任务名称</span>
              <t-select v-model="taskName" :options="taskListOption" clearable filterable :minCollapsedNum="1" style="width: 300px" @input="changeTaskName"></t-select>
            </t-row>
            <div id="taskInfo" style="height: 200px"></div>
          </div>
        </t-col>
      </t-row>
    </div>
    <div class="mt-5 bg-mod-card" style="padding: 15px;">
      <t-form :data="condition" label-align="left" ref="form" @submit="onApply" @reset="onReset">
        <t-row>
          <t-col class="mb-5" :span="3" v-for="(item, index) in fieldList" :key="index">
            <t-form-item :label="item.name" :name="item.value" style="width: 80%">
              <t-input v-if="item.type === 'input'" v-model.trim="condition[item.value]" clearable style="width: 100%"></t-input>
              <t-select v-else-if="item.type === 'select'" v-model="condition[item.value]" :options="dict[item.options]" clearable filterable style="width: 100%"></t-select>
            </t-form-item>
          </t-col>
          <t-col class="mb-5" :span="3">
            <t-row style="width: 80%">
              <t-button class="mr-5" theme="primary" type="submit">提交</t-button>
              <t-button theme="default" variant="base" type="reset">重置</t-button>
            </t-row>
          </t-col>
        </t-row>
      </t-form>
      <t-divider></t-divider>
      <t-row justify="end">
        <t-button variant="outline" @click="download('batch')">批量导出</t-button>
      </t-row>
      <div style="margin-top: 15px">
        <t-table
          hover resizable multipleSort
          row-key="id"
          size="small"
          table-layout="fixed"
          cell-empty-content="-"
          max-height="`450"
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
          <template #slot-count="{ row, col }">
          <span
            style="cursor: pointer"
            @click="goToFileRecords(row.id, columnMapper[col.colKey].text)"
          >{{ row[col.colKey] }}</span>
          </template>
          <template #slot-user="{ row, col }">
            {{ formatField(dict.userDict, 'name', row[col.colKey]) }}
          </template>
          <template #slot-status="{ row, col }">
            <t-tag style="background-color: rgba(246, 255, 237, 1); color: rgba(82, 196, 26, 1); border-color: rgba(183, 235, 143, 1)" variant="light-outline">{{ formatField(dict.jobStatus, 'label', row[col.colKey]) }}</t-tag>
          </template>
          <template #duration="{ row }">
            <span v-show="row.duration">{{ row.duration | durationFilter }}</span>
            <span v-show="!row.duration">-</span>
          </template>
          <template #operator="{ row }">
            <t-button class="mr-3" size="small" variant="text" theme="primary" @click="download('single', row)" >导出结果</t-button>
            <t-button size="small" theme="primary" variant="text" @click="onToFile(row)">备份文件</t-button>
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
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { formatField } from '@/utils/inops/formatUtils'
import { getDictList, pageList } from '@/utils/inops/u'
import { getBackupLogAPI } from '@/api/inops/job/jobStatus'
import { formatDate } from '@/utils/inops/dateUtils'
import { getUserListApi } from '@/api/system/user'
import { onBackupDownload } from '@/utils/inops/file'
import { listAllAPI } from '@/api/inops/netBackup/backupTask'
import { countFileAPI, countFileByTemplatedIdAPI } from '@/api/inops/netBackup/backupFile'
import { getCreateByListAPI } from '@/api/inops/netBackup/backupJobStatus'

export default {
  name: 'index',
  data () {
    return {
      columnMapper: {
        hostCount: { color: '#165DFF', text: 'All' },
        okCount: { color: '#2BA471', text: 'Ok' },
        failCount: { color: '#d54941', text: 'Fail' },
        unreachableCount: { color: '#FEA826', text: 'Unreachable' }
      }, // 列映射
      url: '',
      height: '',
      dict: {
        list: ['resourcePool', 'jobStatus', 'taskStatus', 'backupType'],
        resourcePool: [],
        jobStatus: [],
        taskStatus: [],
        user: [],
        userDict: [],
        backupType: []
      },
      fieldList: [
        {
          name: '作业名称',
          value: 'jobName',
          type: 'input'
        },
        {
          name: '执行状态',
          value: 'status',
          type: 'select',
          options: 'jobStatus'
        },
        {
          name: '创建人',
          value: 'createBy',
          type: 'select',
          options: 'user'
        },
        {
          name: '备份类型',
          value: 'backupType',
          type: 'select',
          options: 'backupType'
        }
      ],
      taskListOption: [],
      condition: {
        parentId: '0',
        templateId: '',
        beginDate: '',
        endDate: '',
        jobName: '',
        status: '',
        createBy: '',
        type: 'backup',
        backupType: '',
        range: [],
        orders: []
      },
      taskName: '',
      table: {
        ref: 'tb_task',
        empty: '暂未创建备份任务',
        loading: false,
        data: [],
        sort: [],
        select: [],
        column: [
          { colKey: 'row-select', title: '选择', type: 'multiple', width: 50 },
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'jobName', title: '作业名称', align: 'left', ellipsis: true, ellipsisTitle: true },
          { colKey: 'hostCount', title: '总设备数', align: 'center', ellipsis: true, ellipsisTitle: true, cell: 'slot-count' },
          { colKey: 'okCount', title: '成功', align: 'center', ellipsis: true, ellipsisTitle: true, cell: 'slot-count' },
          { colKey: 'failCount', title: '失败', align: 'center', ellipsis: true, ellipsisTitle: true, cell: 'slot-count' },
          { colKey: 'unreachableCount', title: '无法连接', align: 'center', ellipsis: true, ellipsisTitle: true, cell: 'slot-count' },
          { colKey: 'newestTask', title: '最新执行步骤', align: 'left', ellipsis: true, ellipsisTitle: true, cell: 'slot-count' },
          { colKey: 'status', title: '作业状态', align: 'center', ellipsis: true, ellipsisTitle: true, cell: 'slot-status' },
          { colKey: 'createBy', title: '创建人', align: 'center', ellipsis: true, ellipsisTitle: true, cell: 'slot-user' },
          { colKey: 'duration', title: '执行时长', align: 'center', ellipsis: true, ellipsisTitle: true },
          { colKey: 'createDate', title: '创建时间', align: 'center', ellipsis: true, ellipsisTitle: true },
          { colKey: 'updateDate', title: '更新时间', align: 'center', ellipsis: true, ellipsisTitle: true },
          { colKey: 'operator', title: '操作', width: '250', align: 'center' }
        ]
      },
      pages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      visible: {
        taskCount: true,
        taskInfo: true
      },
      taskCountChart: {
        dom: null,
        options: null,
        data: [],
        count: 0
      },
      taskInfoChart: {
        dom: null,
        options: null,
        dateList: [],
        success: [],
        fail: [],
        size: []
      }
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
  async mounted () {
    this.table.loading = true
    const { id } = this.$route.query
    this.condition.templateId = id
    await this.initData()
    await this.getDict()
    await this.getUserDict()
    await this.getCreatUser()
    this.getData()
    await this.getAllTask()
    this.getTaskCount()
    this.getTaskInfo({
      beginDate: this.condition.beginDate,
      endDate: this.condition.endDate,
      templateId: this.taskName
    })
    window.onresize = () => {
      const taskInfoChart = echarts.init(document.getElementById('taskInfo'))
      taskInfoChart.resize()
    }
  },
  methods: {
    formatField,
    async getDict () {
      for (const item of this.dict.list) {
        this.dict[item] = await getDictList(item)
      }
    },
    initData () {
      this.date = formatDate(new Date())
      this.condition.beginDate = formatDate(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 6))
      this.condition.endDate = formatDate(new Date())
      this.condition.range = [this.condition.beginDate, this.condition.endDate]
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
              this.dict.userDict.push(params)
            }
          }
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
    },
    getCreatUser () {
      getCreateByListAPI().then(res => {
        const { data } = res
        if (data.code === 200) {
          data.data.forEach(item => {
            const index = this.dict.userDict.findIndex(v => v.userId === Number(item))
            if (index > -1) {
              const obj = {
                label: this.dict.userDict[index].nickName,
                value: this.dict.userDict[index].userId
              }
              this.dict.user.push(obj)
            }
          })
        }
      })
    },
    getData () {
      const params = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      this.table.loading = true
      getBackupLogAPI(params, this.condition).then(response => {
        const { data } = response
        if (data.code === 200) {
          const { records } = data.data
          this.table.data = records
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
    async getAllTask () {
      await listAllAPI().then(async res => {
        this.taskListOption = []
        const { data } = res
        if (data.code === 200) {
          await data.data.forEach(item => {
            const obj = {
              label: item.jobName,
              value: item.id
            }
            this.taskListOption.push(obj)
          })
          this.taskName = this.taskListOption[0].value
        }
      })
    },
    getTaskCount () {
      const data = {
        beginDate: this.condition.range[0],
        endDate: this.condition.range[1]
      }
      countFileAPI(data).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.taskCountChart.count = data.data.success + data.data.fail
          this.taskCountChart.data.push({ value: data.data.success, name: '成功' })
          this.taskCountChart.data.push({ value: data.data.fail, name: '失败' })
          this.visible.taskCount = false
          this.initTaskCount()
        }
      })
    },
    async getTaskInfo (data) {
      await countFileByTemplatedIdAPI(data).then(async res => {
        const { data } = res
        if (data.code === 200) {
          this.taskInfoChart.success = []
          this.taskInfoChart.fail = []
          this.taskInfoChart.size = []
          const result = data.data
          const keys = Object.keys(result).sort()
          this.taskInfoChart.dateList = keys
          await keys.forEach(item => {
            this.taskInfoChart.success.push(data.data[item].success)
            this.taskInfoChart.fail.push(data.data[item].fail)
            this.taskInfoChart.size.push((data.data[item].size / 1024).toFixed(2))
          })
          this.visible.taskInfo = false
          this.initTaskInfo()
        }
      })
    },
    initTaskCount () {
      const chartDom = document.getElementById('taskCount')
      this.taskCountChart.dom = echarts.init(chartDom)
      this.taskCountChart.options = {
        color: ['#165dff', '#ffa627'],
        title: {
          text: '总文件备份数' + '\n\n' + this.taskCountChart.count,
          left: 'center',
          top: '38%',
          textStyle: {
            fontSize: 14,
            color: '#616161',
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          left: 'left'
        },
        series: [
          {
            type: 'pie',
            radius: ['55%', '75%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.taskCountChart.data
          }
        ]
      }
      this.taskCountChart.options && this.taskCountChart.dom.setOption(this.taskCountChart.options)
      this.taskCountChart.dom.on('click', (params) => {
        const { name } = params.data
        this.$router.push({
          path: '/inops/backup/file',
          query: {
            backupResult: name === '成功' ? 'ok' : 'failed'
          }
        })
      })
    },
    initTaskInfo () {
      const chartDom = document.getElementById('taskInfo')
      this.taskInfoChart.dom = echarts.init(chartDom)
      this.taskInfoChart.options = null
      this.taskInfoChart.options = {
        grid: {
          top: '20%',
          left: '5%',
          right: '13%',
          bottom: '15%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
          formatter: function (params) {
            var result = ''
            var okDot = '<span style="display:inline-block;margin-right:10px;border-radius:50%;width:10px;height:10px;background-color:#165dff"></span>'
            var failDot = '<span style="display:inline-block;margin-right:10px;border-radius:50%;width:10px;height:10px;background-color:#ffa627"></span>'
            var sizeDot = '<span style="display:inline-block;margin-right:10px;border-radius:50%;width:10px;height:10px;background-color:#14c9c9"></span>'
            result += params[0].axisValue + '</br>' +
              `${okDot}<span class="mr-4">${params[0].seriesName}</span>${params[0].data}</br>` +
              `${failDot}<span class="mr-4">${params[1].seriesName}</span>${params[1].data}</br>` +
              `${sizeDot}<span class="mr-4">${params[2].seriesName}</span>${params[2].data}K`
            return result
          }
        },
        legend: {
          orient: 'vertical',
          right: '1%',
          top: '30%',
          data: ['成功', '失败', '文件大小']
        },
        xAxis: [
          {
            type: 'category',
            data: this.taskInfoChart.dateList,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '备份情况（/台）'
          },
          {
            type: 'value',
            name: '文件大小（/K）',
            axisLine: {
              show: true
            },
            axisTick: {
              show: true
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '成功',
            type: 'bar',
            data: this.taskInfoChart.success,
            barWidth: 25,
            itemStyle: {
              color: '#165dff'
            },
            label: {
              show: true,
              color: '#00c853',
              fontWeight: 'bold',
              position: 'top'
            }
          },
          {
            name: '失败',
            type: 'bar',
            data: this.taskInfoChart.fail,
            barWidth: 25,
            itemStyle: {
              color: '#ffa627'
            },
            label: {
              show: true,
              color: '#d50000',
              fontWeight: 'bold',
              position: 'top'
            }
          },
          {
            name: '文件大小',
            type: 'line',
            yAxisIndex: 1,
            data: this.taskInfoChart.size,
            itemStyle: {
              color: '#14c9c9'
            }
          }
        ]
      }
      this.taskInfoChart.options && this.taskInfoChart.dom.setOption(this.taskInfoChart.options)
    },
    onApply () {
      this.condition.templateId = ''
      this.getData()
    },
    onReset () {
      this.condition = {
        parentId: '0',
        templateId: '',
        beginDate: '',
        endDate: '',
        jobName: '',
        status: '',
        createBy: '',
        type: 'backup',
        backupType: '',
        range: [],
        orders: []
      }
      this.initData()
    },
    onPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.getData()
    },
    onToFile (row) {
      this.$router.push({
        path: '/inops/backup/file',
        query: {
          id: row.id
        }
      })
    },
    async download (type, row) {
      const jobIds = []
      if (type === 'single') {
        jobIds.push(row.id)
      } else if (type === 'batch') {
        if (this.table.select.length > 0) {
          await this.table.select.forEach(item => {
            jobIds.push(item.id)
          })
        } else {
          this.$message.error({ content: '请至少选择一条数据', placement: 'center' })
        }
      }
      const data = {
        jobIds
      }
      onBackupDownload('batch', '', data)
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
    changeTaskName () {
      const data = {
        beginDate: this.condition.range[0],
        endDate: this.condition.range[1],
        templateId: this.taskName
      }
      this.getTaskInfo(data)
    },
    goToFileRecords (id, type) {
      this.$router.push({
        path: '/inops/backup/file',
        query: {
          jobId: id,
          recordType: type
        }
      })
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
</style>
