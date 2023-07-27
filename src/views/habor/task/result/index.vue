<template>
  <div class="bg-mod-card" style="padding: 15px">
    <t-form label-align="left" :data="value" ref="form" @submit="onApply" @reset="onReset">
      <t-row :gutter="[16, 16]">
        <t-col :span="4" v-for="(item, index) in field" :key="index">
          <t-form-item :label="item.name" :name="item.value" style="width: 80%">
            <t-input v-if="item.type === 'input'" v-model.trim="value[item.value]" clearable style="width: 100%"></t-input>
            <t-select v-else-if="item.type === 'select'" v-model="value[item.value]" :options="dict[item.options]" clearable filterable style="width: 100%"></t-select>
            <t-date-range-picker v-else-if="item.type === 'date'" v-model="value[item.value]" allow-input clearable style="width: 100%" />
          </t-form-item>
        </t-col>
        <t-col :offset="4" :span="4">
          <t-row class="justify-end" style="width: 80%">
            <t-button class="mr-5" theme="primary" type="submit">提交</t-button>
            <t-button theme="default" variant="base" type="reset">重置</t-button>
          </t-row>
        </t-col>
      </t-row>
    </t-form>
    <t-divider style="margin-top: 30px"></t-divider>
    <div style="margin-top: 10px">
      <t-row justify="end">
        <t-button variant="outline" theme="default">
          <t-row align="center">
            <svg-icon class="mr-2" color="rgba((80, 89, 104, 1)" name="export"></svg-icon>
            <span style="color: rgba(80, 89, 104, 1)">导出数据</span>
          </t-row>
        </t-button>
      </t-row>
    </div>
    <div style="margin-top: 15px">
      <t-table
        hover showHeader resizable
        rowKey="id"
        size="small"
        table-layout="fixed"
        cellEmptyContent="-"
        :max-height="`${height * 0.55}`"
        :empty="table.empty"
        :data="table.data"
        :columns="table.column"
        :loading="table.loading"
        :selected-row-keys="table.select"
        style="font-size: 12px"
      >
        <template #slot-user="{ row, col }">
          {{ formatField(dict.user, 'name', row[col.colKey]) }}
        </template>
        <template #slot-status="{ row, col }">
          <t-tag style="background-color: rgba(246, 255, 237, 1); color: rgba(82, 196, 26, 1); border-color: rgba(183, 235, 143, 1)" variant="light-outline">{{ formatField(dict.jobStatus, 'label', row[col.colKey]) }}</t-tag>
        </template>
        <template #slot-count="{ row, col }">
          <span
            style="cursor: pointer"
            @click="onDetailInfo(row.id, columnMapper[col.colKey].text)"
          >{{ row[col.colKey] }}</span>
        </template>
        <template #duration="{ row, col }">
          <span>{{ row[col.colKey] | durationFilter }}</span>
        </template>
        <template #operator="{ row }">
          <t-dropdown
            class="mr-5"
            trigger="click"
            :options="[{ content: 'Excel格式', value: 'excel' }, { content: 'TXT格式', value: 'txt' }]"
            @click="(data) => { downloadFile(data, row.id) }"
          >
            <t-button variant="text" theme="primary" size="small">
              <span class="tdesign-demo-dropdown__text">
                导出结果
                <t-icon name="caret-down-small"/>
              </span>
            </t-button>
          </t-dropdown>
          <!--          <t-button variant="text" theme="primary" @click="onJobInfo(row)">查看脚本</t-button>-->
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
    <t-drawer
      v-if="dialog.code"
      :visible.sync="dialog.code"
      placement="right"
      size="800px"
      header="脚本内容"
      :footer="false"
    >
      <div id="codeParent" style="height: 100%">
        <CodeInfo ref="codeInfo" :height.sync="codeHeight" :codeInfo.sync="codeInfo"></CodeInfo>
      </div>
    </t-drawer>
    <t-dialog v-if="dialog.info" preventScrollThrough destroyOnClose placement="top" width="80%" header="执行详情" :footer="false" :visible.sync="dialog.info">
      <result-info ref="resultInfo" :fileType="fileType" :value.sync="info.condition" :infoData.sync="info.data" :pageInfo.sync="info.pages" @onApply="onInfoApply" @onPages="onInfoPages"></result-info>
    </t-dialog>
  </div>
</template>

<script>
import { pageList, getDictList } from '@/utils/inops/u'
import { formatField } from '@/utils/inops/formatUtils'
import { getUserListApi } from '@/api/system/user'
import { formatDate } from '@/utils/inops/dateUtils'
import { onMonitorDTResult } from '@/utils/inops/file'
import CodeInfo from '@/components/Code/CodeInfo'
import ResultInfo from '@/components/ResultInfo/ResultInfo'
import { getTaskJobAPI, getHostListAPI } from '@/api/monitor/monitorTaskResult'
export default {
  name: 'index',
  components: { ResultInfo, CodeInfo },
  data () {
    return {
      height: 0, // 屏幕高度
      codeHeight: 0, // codemirror高度
      fileType: 'monitor', // 下载文件类型
      columnMapper: {
        hostCount: { color: 'blue', text: 'All' },
        okCount: { color: 'green', text: 'Ok' },
        failCount: { color: 'red', text: 'Fail' },
        unreachableCount: { color: 'amber', text: 'Unreachable' }
      }, // 列映射
      jobStatusMapper: {
        complete: {
          bg: 'rgba(246, 255, 237, 1)',
          border: 'rgba(183, 235, 143, 1)',
          text: 'rgba(82, 196, 26, 1)'
        },
        handing: {
          bg: 'rgba(230, 247, 255, 1)',
          border: 'rgba(145, 213, 255, 1)',
          text: 'rgba(24, 144, 255, 1)'
        }
      }, // 执行状态样式映射
      langMapper: {
        action_script: 'python',
        forward_online_script: 'python',
        playbook: 'yaml',
        shell_script: 'shell'
      }, // 脚本语言映射
      dict: {
        list: ['jobStatus', 'taskStatus'],
        jobStatus: [],
        taskStatus: [],
        user: []
      }, // 字典
      field: [
        { name: '作业名称', value: 'jobName', type: 'input', input: 'text' },
        { name: '作业状态', value: 'status', type: 'select', input: 'text', options: 'jobStatus' },
        { name: '操作人', value: 'createBy', type: 'select', input: 'text', options: 'user' },
        { name: '作业时间', value: 'range', type: 'date', input: 'text' }
      ], // 查询字段
      value: {
        parentId: 0,
        jobName: '',
        status: '',
        beginDate: '',
        range: [],
        endDate: '',
        createBy: ''
      }, // 字段对象
      table: {
        ref: 'tbRecords',
        empty: '暂无数据',
        loading: false,
        sort: [],
        data: [],
        column: [
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
      }, // 表格
      pages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 30,
        align: 'right'
      }, // 分页
      dialog: {
        code: false, // codemirror 代码
        info: false // 执行详情
      }, // 弹窗
      codeInfo: { // 脚本信息
        code: '', // 代码
        lang: '' // 语言
      },
      info: { // 日志详情
        type: '', // 类型（orgMsg、detailMsg)
        condition: {
          jobId: '', // id
          hostName: '', // 主机名
          hostType: '', // 主机类型
          taskNum: '' // 步骤
        }, // 查询条件
        data: [], // 数据
        pages: {
          total: 0,
          current: 1,
          size: 30
        } // 分页
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
  watch: {
    'dialog.info': {
      handler (newVal) {
        if (!newVal) {
          this.info.pages.current = 1
          this.info.pages.size = 10
          this.info.condition = {
            jobId: '',
            hostName: '',
            hostType: '',
            taskNum: ''
          }
        }
      }
    }
  },
  async mounted () {
    window.addEventListener('resize', () => {
      this.calsize()
    })
    this.calsize()
    this.initDate()
    await this.getDict()
    await this.getUserDict()
    this.getData()
  },
  methods: {
    /**
     * 字段格式化
     */
    formatField,
    /**
     * 屏幕高度获取
     */
    calsize () {
      this.height = window.screen.height
    },
    /**
     * 初始化日期
     */
    initDate () {
      this.value.beginDate = formatDate(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7))
      this.value.endDate = formatDate(new Date())
      this.value.range = [this.value.beginDate, this.value.endDate]
    },
    /**
     * 获取字典
     * @returns {Promise<void>}
     */
    async getDict () {
      for (const item of this.dict.list) {
        this.dict[item] = await getDictList(item)
      }
    },
    /**
     * 获取用户列表
     * @returns {Promise<void>}
     */
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
    /**
     * 获取任务执行记录
     */
    getData () {
      this.table.loading = true
      const params = {
        pageNum: this.pages.current,
        pageSize: this.pages.size
      }
      this.value.beginDate = this.value.range[0]
      this.value.endDate = this.value.range[1]
      getTaskJobAPI(params, this.value).then(res => {
        const { data } = res
        if (data.code === 200) {
          data.data.records.forEach(value => {
            const msg = value.newestTaskNum === null || value.newestTaskName === null ? '' : value.newestTaskNum + '.  ' + value.newestTaskName
            this.$set(value, 'newestTask', msg)
          })
          this.table.data = data.data.records
          const { total, size, current } = data.data
          this.pages = Object.assign(this.pages, { total, size, current })
          this.pages.list[this.pages.list.length - 1].value = total
          this.table.loading = false
        } else {
          this.$message.error({ content: '获取数据失败，请联系管理员', placement: 'center' })
          this.table.loading = false
        }
      })
    },
    /**
     * 查询
     */
    onApply () {
      this.getData()
    },
    /**
     * 重置
     */
    onReset () {
      this.value = {
        parentId: 0,
        jobName: '',
        status: '',
        beginDate: '',
        endDate: '',
        createBy: ''
      }
      this.initDate()
    },
    /**
     * 分页
     * @param current 当前页
     * @param pageSize 页大小
     */
    onPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.getData()
    },
    /**
     * 下载文件
     * @param data 参数 - 文件类型
     * @param id 文件id
     */
    downloadFile (type, id) {
      onMonitorDTResult(type, id)
    },
    /**
     * 展示detailMsg
     * @param id 记录id
     * @param type 类型（detailMsg / orgMsg）
     * @returns {Promise<void>}
     */
    async onDetailInfo (row, type) {
      this.info.condition.jobId = row.id
      this.info.type = type
      const params = {
        pageSize: this.info.pages.size,
        pageNum: this.info.pages.current
      }
      const data = Object.assign({}, this.info.condition, { executeDate: row.executeDate })
      await getHostListAPI(params, data, type).then(response => {
        const { data } = response
        if (response.status === 200) {
          const { records } = data
          records.forEach(value => {
            this.$set(value, 'taskInfo', value.taskNum + '.  ' + value.taskName)
          })
          this.info.data = records
          const { total, size, current } = data
          this.info.pages = Object.assign(this.info.pages, { total, size, current })
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
      if (!this.dialog.info) {
        this.dialog.info = true
      }
    },
    /**
     * 执行详情查询
     * @param condition 查询条件
     * @returns {Promise<void>}
     */
    async onInfoApply (condition) {
      Object.assign(this.info.condition, condition)
      await this.onDetailInfo(this.info.condition.jobId, this.info.type)
      this.$refs.resultInfo.initData()
    },
    /**
     * 执行详情分页
     * @param pageInfo 分页信息
     * @returns {Promise<void>}
     */
    async onInfoPages (pageInfo) {
      Object.assign(this.info.pages, pageInfo)
      await this.onDetailInfo(this.info.condition.jobId, this.info.type)
      this.$refs.resultInfo.initData()
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .q-field__control
  height: 28px !important
/deep/ .q-field__marginal
  height: 28px !important
/deep/ .q-field--auto-height.q-field--dense .q-field__control
  min-height: 28px !important
/deep/ .q-field--auto-height.q-field--dense .q-field__native
  min-height: 28px !important
/deep/ .q-field__native span
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
/deep/ .q-field__native, .q-field__prefix, .q-field__suffix, .q-field__input
  padding: 0px !important
</style>
