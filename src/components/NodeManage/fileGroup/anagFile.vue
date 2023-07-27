<template>
  <div>
    <t-row align="center">
      <t-col :span="2" style="margin-left:20px">节点</t-col>
      <t-col :span="8">
        <t-input clearable filterable disabled style="width: 95%" v-model="formList" placeholder="暂无节点"></t-input>
      </t-col>
     </t-row>
      <t-row align="center" style="margin-top: 20px">
      <t-col :span="2" style="margin-left:20px">选择文件</t-col>
      <t-col :span="8">
        <t-select clearable filterable style="width: 95%" ref="selectProvince" :options="option" v-model="fileId">
        </t-select>
      </t-col>
    </t-row>
  </div>
</template>

<script>
import { getFilelist } from '@/api/inops/jobNode/fileManage'
import { getIdNodeAPI } from '@/api/inops/jobNode/jobNode'
export default {
  name: 'anagFile',
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
      option: [],
      condition: {
        fileDetail: '',
        beginDate: '',
        endDate: '',
        createBy: ''
      },
      fileId: '',
      internalIp: [],
      // 分页
      pages: {
        total: 0,
        current: 1,
        size: 100,
        align: 'right'
      },
      form: [],
      formList: '',
      // 表格
      table: {
        ref: 'backupInfo',
        empty: '暂无备份任务数据',
        loading: false,
        sort: [],
        data: [],
        column: [
          { colKey: 'row-select', title: '选择', type: 'multiple', width: 50 },
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'NodeName', title: '文件名', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true }
        ]
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$on('sign', () => {
        this.getData()
      })
    })
  },
  watch: {
    uploadId: {
      handler (newVal) {
        this.uploadId = newVal
        if (this.uploadId.lenght !== 0) {
          this.getUploadNode()
        } else {
          this.formList = ''
        }
      },
      deep: true,
      immediate: false
    },
    fileId: {
      handler (newVal) {
        console.log('fileId变化', newVal)
      },
      deep: true
    }
  },
  methods: {
    async getData () {
      const params = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      await getFilelist(params, this.condition).then(res => {
        const { data } = res
        if (data.code === 200) {
          for (const item of data.data.records) {
            this.option.push({ value: item.id, label: item.fileName })
          }
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
     * 提交数据给父组件
     *
    */
    arrangeConfirm () {
      const data = {
        id: this.fileId,
        hosts: this.uploadId
      }
      this.$emit('arrangeFather', data, this.internalIp)
    }
  }
}
</script>

<style>

</style>
