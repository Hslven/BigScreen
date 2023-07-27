<template>
  <div style="height: 100%">
    <t-form label-align="left">
      <t-row :gutter="[16, 16]">
        <t-col :span="4" v-for="(item, index) in field" :key="index">
          <t-form-item :label="item.name" :name="item.value" style="width: 80%">
            <t-input v-if="item.type === 'input'"  style="width: 100%"></t-input>
            <t-date-range-picker v-else-if="item.type === 'date'" allow-input clearable style="width: 100%" />
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
    <t-row class="mt-5">
      <t-upload
      action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
      v-model="files"
      theme="custom"
      multiple
      @fail="handleFail"
      @success="tips = ''">
      <t-button theme="primary">
        <t-row align="center">
        <mod-icon name="add" style="color: #ffffff"></mod-icon>
        <span style="color:#fff">上传文件</span>
        </t-row>
      </t-button>
    </t-upload>
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
      </t-table>
    </div>
  </div>
</template>

<script>
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
        { name: '文件名称', value: 'jobName', type: 'input', input: 'text' },
        { name: '上传作者', value: 'status', type: 'input', input: 'text' },
        { name: '创建时间', value: 'range', type: 'date', input: 'text' },
        { name: '更新时间', value: 'range', type: 'date', input: 'text' }
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
          { colKey: 'fileName', title: '文件名称', align: 'left', ellipsis: true, ellipsisTitle: true },
          { colKey: 'fileSize', title: '文件大小', align: 'center', ellipsis: true, ellipsisTitle: true, cell: 'slot-count' },
          { colKey: 'uploadAuto', title: '上传作者', align: 'center', ellipsis: true, ellipsisTitle: true, cell: 'slot-count' },
          { colKey: 'createDate', title: '创建时间', align: 'center', ellipsis: true, ellipsisTitle: true, cell: 'slot-count' },
          { colKey: 'updateDate', title: '更新时间', align: 'center', ellipsis: true, ellipsisTitle: true, cell: 'slot-count' },
          { colKey: 'operator', title: '操作', align: 'left', ellipsis: true, ellipsisTitle: true, cell: 'slot-count' }
        ]
      }, // 表格
      pages: {
        list: 0,
        total: 0,
        current: 1,
        size: 30,
        align: 'right'
      }, // 分页
      dialog: {
        code: false, // codemirror 代码
        visible: false,
        info: false // 执行详情
      }, // 弹窗
      codeInfo: { // 脚本信息
        code: '', // 代码
        lang: '' // 语言
      },
      files: [],
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
  async mounted () {
  },
  watch: {
  },
  methods: {
    uploadFile () {
      this.dialog.visible = true
    },
    handleFail ({ file }) {
      this.$message.error(`文件 ${file.name} 上传失败`)
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-button__text
  font-size: 16px
</style>
