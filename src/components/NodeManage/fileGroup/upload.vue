<template>
  <div>
    <t-row align="center">
      <t-col :span="2" align="center">
        <span>节点</span>
      </t-col>
      <t-col :span="10">
        <t-input clearable filterable disabled style="width: 95%" v-model="formList" placeholder="暂无节点">
        </t-input>
      </t-col>
    </t-row>
    <t-row class="mt-4">
      <t-col :span="2" align="center" style="padding-top:26px">选择</t-col>
      <t-col :span="10">
        <div style="margin-top: 15px">
       <t-table
        hover resizable selectOnRowClick multipleSort
        row-key="id"
        size="small"
        table-layout="fixed"
        @select-change="onRowClick"
        cell-empty-content="-"
        max-height="350"
        :empty="table.empty"
        :data="table.data"
        :columns="table.column"
        :loading="table.loading"
        :sort="table.sort"
        style="font-size: 12px"
      >
      </t-table>
      </div>
      </t-col>
    </t-row>
  </div>
</template>

<script>
import { pageList } from '@/utils/inops/u'
import { getFilelist } from '@/api/inops/jobNode/fileManage'
import { getIdNodeAPI } from '@/api/inops/jobNode/jobNode'
export default {
  name: 'upload',
  props: {
    uploadId: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      dict: {
        name: [],
        nodeName: []
      },
      form: [],
      formList: '',
      fileId: '',
      hosts: [],
      internalIp: [],
      // 表格
      table: {
        ref: 'backupInfo',
        empty: '暂无备份任务数据',
        loading: false,
        sort: [],
        data: [],
        table: {
          ref: 'backupInfo',
          empty: '暂无备份任务数据',
          loading: false,
          sort: []
        },
        column: [
          { colKey: 'row-select', title: '选择', type: 'single', width: 50 },
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'fileName', title: '文件名', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true }
        ]
      },
      condition: {
        fileDetail: '',
        beginDate: '',
        endDate: '',
        createBy: ''
      },
      // 分页
      pages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 100,
        align: 'right'
      }
    }
  },
  watch: {
    uploadId: {
      handler (newVal) {
        if (newVal !== '') {
          this.getUploadNode()
        }
      },
      deep: true
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$on('sign', () => {
        this.getData()
      })
    })
  },
  methods: {
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
          this.table.loading = false
        } else {
          this.$message.error({ content: '获取备份任务列表失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 接收上传节点
     *
    */
    getUploadNode () {
      this.form = []
      this.internalIp = []
      this.formList = ''
      this.uploadId.forEach(async (item) => {
        await getIdNodeAPI(item).then(res => {
          const { data } = res
          if (data.code === 200) {
            this.form.push(data.data.name)
            this.internalIp.push(data.data.internalIp)
          }
        })
        this.form = Array.from(new Set(this.form))
        this.internalIp = Array.from(new Set(this.internalIp))
        this.formList = this.form.join(',')
      })
    },
    /**
     * 选中的文件ID
     * @param id
    */
    onRowClick (row) {
      this.fileId = row
    },
    /**
     * 提交数据给父组件
     *
    */
    fatherUpload () {
      const data = {
        id: this.fileId[0],
        hosts: this.uploadId
      }
      this.$emit('uploadFather', data, this.internalIp)
    }
  }
}
</script>

<style>

</style>
