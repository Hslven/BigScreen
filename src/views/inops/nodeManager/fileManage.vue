<template>
  <div class="bg-mod-card" style="padding: 15px;">
    <t-row>
      <t-col :md="3" :sm="4" :xs="6" v-for="(item, index) in field" :key="index">
        <t-row align="center" class="pb-4">
          <t-col :span="4"><span style="font-size: 12px">{{ item.name }}</span></t-col>
          <t-col :span="8">
             <t-input v-if="item.type === 'input'"  style="width: 80%" v-model="condition[item.value]"></t-input>
            <t-select v-if="item.type === 'select'"  style="width: 80%" v-model="condition[item.value]" :options="dict[item.options]"></t-select>
            <t-date-picker v-else-if="item.type === 'date'" enable-time-picker allow-input style="width: 80%" clearable v-model="condition[item.value]" />
          </t-col>
        </t-row>
      </t-col>
      <t-col :md="3" :sm="4" :xs="6">
        <t-row>
          <t-button class="mr-5" theme="primary" @click="onSubmit">查询</t-button>
          <t-button theme="default" @click="onReset">重置</t-button>
        </t-row>
      </t-col>
    </t-row>
    <t-divider style="margin-top: 30px"></t-divider>
    <div style="margin-top: 10px">
    <t-row class="mt-5">
      <t-button theme="primary" @click="uploadFile">
        <t-row align="center">
        <mod-icon name="add" style="color: #ffffff"></mod-icon>
        <span style="color:#fff">上传文件</span>
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
        <template #slot-user="{ row }">
          {{ formatField(dict.user, 'label', row.createBy) ? formatField(dict.user, 'label', row.createBy) : 'admin' }}
        </template>
        <template #fileSize="{ row }">
          {{ row.fileSize + 'kb'}}
        </template>
        <template #operator="{ row }">
          <t-popconfirm theme="default" content="确认删除任务吗" @confirm="onDel(row.id)">
            <t-button variant="text" theme="primary"><span style="font-size: 14px">删除</span></t-button>
          </t-popconfirm>
           <t-button variant="text" @click="downloadResult(row)" class="text-mod-primary px-1"><span style="font-size: 14px">下载</span></t-button>
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
    <t-dialog header="文件上传" :visible.sync="dialog.uploadFile" @confirm="confirmNode" @close="close" width="40%">
        <t-form
        ref="formRef"
        :data="formList"
        :rules="rules" style="width: 80%">
         <t-form-item label="文件名：" name="name">
            <t-input v-model="formList.fileName"></t-input>
        </t-form-item>
        <t-form-item label="文件路径：" name="name">
          <t-input v-model="formList.filePath" @keyup.native="checkInput"></t-input>
        </t-form-item>
                <t-form-item label="文件描述：">
          <t-input v-model="formList.fileDetail"></t-input>
        </t-form-item>
          <t-form-item label="文件编码：">
          <t-input v-model="formList.encoding"></t-input>
        </t-form-item>
        </t-form>
      <t-row align="center" style="margin-top: 20px;margin-left: 10px">
        <t-upload
          ref="uploadRef1"
          :requestMethod="httpRequest"
          :tips="tips"
          :multiple="multiple"
          :upload-all-files-in-one-request="uploadInOneRequest"
          :is-batch-upload="isBatchUpload"
          :trigger-button-props="{ theme: 'primary', variant: 'base' }"
          :allow-upload-duplicate-file="true"
          :beforeUpload="beforeUpload"
          @fail="handleFail" />
      <div v-if="fileList && code" class="list-custom">
        <t-row>
        <ul>
        <li>{{ fileList }} <mod-icon name="check_circle" style="color: #43CF7C"></mod-icon></li>
        </ul>
        </t-row>
    </div>
      </t-row>
    </t-dialog>
  </div>
</template>

<script>
import { getFilelist, delFileApi, uploadFileApi, getFiledownloadAPI } from '@/api/inops/jobNode/fileManage'
import { getUserListApi } from '@/api/system/user'
import { formatField } from '@/utils/inops/formatUtils'
export default {
  name: 'test',
  data () {
    return {
      fileType: 'schedule', // 下载文件类型
      dict: {
        list: ['jobStatus', 'taskStatus'],
        jobStatus: [],
        taskStatus: [],
        user: [],
        userList: []
      }, // 字典
      field: [
        { name: '文件名称', value: 'fileName', type: 'input', input: 'text' },
        { name: '上传作者', value: 'createBy', type: 'select', options: 'user' },
        { name: '创建时间', value: 'createDate', type: 'date', input: 'text' },
        { name: '更新时间', value: 'endDate', type: 'date', input: 'text' }
      ], // 查询字段
      condition: {
        fileName: '',
        endDate: '',
        type: '',
        createDate: '',
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
          { colKey: 'createBy', title: '上传作者', align: 'center', ellipsis: true, ellipsisTitle: true, cell: 'slot-user' },
          { colKey: 'createDate', title: '创建时间', align: 'center', ellipsis: true, ellipsisTitle: true, cell: 'slot-count' },
          { colKey: 'updateDate', title: '更新时间', align: 'center', ellipsis: true, ellipsisTitle: true, cell: 'slot-count' },
          { colKey: 'operator', title: '操作', align: 'center', ellipsis: true, ellipsisTitle: true, cell: 'slot-count' }
        ]
      }, // 表格
      rules: {
        name: [
          { required: true }
        ]
      },
      pages: {
        list: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      fileList: '',
      files: [],
      code: false,
      multiple: false,
      uploadInOneRequest: false,
      isBatchUpload: false,
      dialog: {
        uploadFile: false
      },
      formList: {
        fileName: '',
        filePath: 'inops/',
        fileDetail: '',
        encoding: ''
      },
      tips: '上传文件大小在 5M 以内,支持上传excel,txt文件',
      url: '',
      visible: false,
      visible2: false,
      uploadFileList: [] // 已上传的文件列表
    }
  },
  async mounted () {
    this.url = process.env.VUE_APP_BASE_URL
    await this.getData()
    await this.getUserDict()
  },
  watch: {
    files: {
      handler (newVal) {
        console.log('files1', newVal)
      },
      deep: true
    }
  },
  methods: {
    /**
     * 格式化
    */
    formatField,
    /**
     * 文件上传弹窗
    */
    uploadFile () {
      this.dialog.uploadFile = true
    },
    handleClick () {
      this.visible = true
    },
    handleClick2 () {
      this.visible2 = true
    },
    handleFail ({ file }) {
      this.$message.error(`文件 ${file.name} 上传失败`)
    },
    /**
     * 上传文件校验
    */
    checkInput () {
      const nameReg = /^\//g
      this.formList.filePath = this.formList.filePath.replace(nameReg, '')
    },
    beforeUpload () {
      if (this.formList.fileName !== '' && this.formList.filePath !== '') {
        return true
      } else {
        this.$message.error({ content: '文件名，路径不能为空', placement: 'center' })
        return false
      }
    },
    /**
     * 下载文件
    */
    async downloadResult (row) {
      const params = {
        id: row.id
      }
      await getFiledownloadAPI(params).then(res => {
        const href = URL.createObjectURL(res.data)
        const a = document.createElement('a')
        const fileName = `${row.fileName}.docx`
        a.setAttribute('href', href)
        a.setAttribute('download', fileName)
        a.click()
        URL.revokeObjectURL(href)
      })
    },
    /**
     * 查询
    */
    onSubmit () {
      this.pages.current = 1
      this.getData()
    },
    /**
     * 查询重置
     */
    onReset () {
      this.condition = {
        fileName: '',
        endDate: '',
        createDate: '',
        createBy: ''
      }
      this.pages.current = 1
    },
    async httpRequest (op) {
      this.files.push(op.name)
      this.fileList = this.files.join('------')
      const formData = new FormData()
      formData.append('file', op.raw)
      formData.append('filePath', this.formList.filePath)
      formData.append('fileName', this.formList.fileName)
      formData.append('fileDetail', this.formList.fileDetail)
      formData.append('encoding', this.formList.encoding)
      await uploadFileApi(formData).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '文件上传成功', placement: 'center' })
          this.code = true
          this.tips = ''
          // this.dialog.uploadFile = false
          // this.getData()
        } else if (data.code !== 200) {
          this.$message.error({ content: '文件上传失败，请联系管理员', placement: 'center' })
          // this.dialog.uploadFile = false
        }
      })
    },
    /**
     * 分页
     * @param current 当前页
     * @param pageSize 页码大小
     */
    onPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.getData()
    },
    async confirmNode () {
      this.dialog.uploadFile = false
      this.formList.encoding = ''
      this.formList.fileDetail = ''
      this.formList.fileName = ''
      this.files = []
      this.getData()
    },
    close () {
      this.formList.encoding = ''
      this.formList.fileDetail = ''
      this.formList.fileName = ''
      this.files = []
      this.fileList = ''
      this.code = false
    },
    async getData () {
      this.table.loading = true
      const params = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      await getFilelist(params, this.condition).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.table.data = data.data.records
          const { total, size, current } = data.data
          this.pages = Object.assign(this.pages, { total, size, current })
          this.pages.list[this.pages.list.length - 1].valueOf = total
          this.table.loading = false
        } else {
          this.$message.error({ content: '获取备份任务列表失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 删除任务
     * @param id 任务id
    */
    onDel (id) {
      // const params = {
      //   ids: id
      // }
      delFileApi(id).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '任务删除成功', placement: 'center' })
          this.getData()
        } else {
          this.$message.error({ content: '任务删除失败，请联系管理员', placement: 'center' })
        }
      })
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
              this.dict.user.push({ label: item.nickName, value: item.userId.toString() })
              this.dict.userList.push(item)
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-button__text
  font-size: 16px
.tdesign-demo-upload.list-custom
  font-size: 13px
.tdesign-demo-upload li
  margin: 16px 0
</style>
