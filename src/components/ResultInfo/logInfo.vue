<template>
  <div class="bg-mod-card" style="padding: 15px;">
    <t-row>
      <t-col :md="3" :sm="4" :xs="6" v-for="(item, index) in field" :key="index">
        <t-row align="center" class="pb-4">
          <t-col :span="4"><span style="font-size: 12px">{{ item.name }}</span></t-col>
          <t-col :span="8">
            <t-input v-if="item.type === 'input'" v-model.trim="value[item.value]" clearable style="width: 80%"></t-input>
            <t-select v-else-if="item.type === 'select'" v-model="value[item.value]" :options="dict[item.options]" clearable filterable style="width: 80%"></t-select>
            <t-date-range-picker v-else-if="item.type === 'date'" v-model="value[item.value]" allow-input clearable style="width: 110%" />
          </t-col>
        </t-row>
      </t-col>
      <t-col :md="3" :sm="4" :xs="6">
        <t-row>
          <t-button class="mr-5" theme="primary" @click="onApply">查询</t-button>
          <t-button theme="default" @click="onReset">重置</t-button>
        </t-row>
      </t-col>
    </t-row>
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
        max-height="550"
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
        <template #duration="{ row }">
          <span>{{ formatDuration(row.duration) }}</span>
        </template>
        <template #operator="{ row }">
          <t-dropdown
            class="mr-5"
            trigger="click"
            :options="[{ content: 'Excel格式', value: 'excel' }, { content: 'TXT格式', value: 'txt' }]"
            @click="(data) => { downloadFile(data, row.id) }"
          >
            <t-button variant="text" theme="primary" size="small">
              <span class="tdesign-demo-dropdown__text" style="font-size: 14px">
                导出结果
                <t-icon name="caret-down-small"/>
              </span>
            </t-button>
          </t-dropdown>
          <t-button variant="text" theme="primary" @click="onJobInfo(row)" ><span style="font-size: 14px">查看脚本</span></t-button>
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
        <CodeInfo ref="codeInfo" :codeInfo.sync="codeInfo"></CodeInfo>
      </div>
    </t-drawer>
    <t-dialog v-if="dialog.info" preventScrollThrough destroyOnClose placement="top" width="80%" header="执行详情" :footer="false" :visible.sync="dialog.info">
      <result-info ref="resultInfo" :fileType="fileType" :value.sync="info.condition" :infoData.sync="info.data" :pageInfo.sync="info.pages" @onApply="onInfoApply" @onPages="onInfoPages"></result-info>
    </t-dialog>
  </div>
</template>

<script>
import { pageList, getDictList } from '@/utils/inops/u'
import { formatField, formatDuration } from '@/utils/inops/formatUtils'
import { getUserListApi } from '@/api/system/user'
import { formatDate } from '@/utils/inops/dateUtils'
import { onDownTResult } from '@/utils/inops/file'
import CodeInfo from '@/components/Code/CodeInfo'
import ResultInfo from '@/components/ResultInfo/ResultInfo'
import { getHostListAPI } from '@/api/inops/task/taskResult'
export default {
  name: 'logInfo',
  // 父组件传参   type：文件类型
  props: {
    type: {
      type: String
    },
    tableData: {
      type: Array
    },
    pageInfo: {
      type: Object
    }
  },
  data () {
    return {
      fileType: 'schedule', // 下载文件类型
      columnMapper: {
        hostCount: { color: '#165DFF', text: 'All' },
        okCount: { color: '#2BA471', text: 'Ok' },
        failCount: { color: '#d54941', text: 'Fail' },
        unreachableCount: { color: '#FEA826', text: 'Unreachable' }
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
  components: { CodeInfo, ResultInfo },
  async mounted () {
    this.table.loading = true
    this.fileType = this.type
    this.initDate()
    await this.getDict()
    await this.getUserDict()
    this.getData()
    this.setData()
  },
  watch: {
    tableData: {
      handler (newVal) {
        this.setData()
      }
    }
  },
  methods: {
    formatField,
    formatDuration,
    setData () {
      this.table.data = this.tableData
      this.pages = Object.assign(this.pages, this.pageInfo)
      this.table.loading = false
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
      this.value.beginDate = this.value.range[0]
      this.value.endDate = this.value.range[1]
      this.$emit('getData', this.value, this.pages)
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
    downloadFile (data, id) {
      onDownTResult(data.value, this.fileType, id)
    },
    onJobInfo (row) {
      this.codeInfo.code = row.scriptCode
      this.codeInfo.lang = this.langMapper[row.scriptType]
      this.dialog.code = true
    },
    /**
     * 展示detailMsg
     * @param id 记录id
     * @param type 类型（detailMsg / orgMsg）
     * @returns {Promise<void>}
     */
    async onDetailInfo (id, type) {
      this.info.condition.jobId = id
      this.info.type = type
      const params = {
        pageSize: this.info.pages.size,
        pageNum: this.info.pages.current
      }
      await getHostListAPI(params, this.info.condition, type).then(response => {
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
/deep/ .t-button__text
  font-size: 16px
</style>
