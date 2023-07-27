<template>
    <div>
      <content-header></content-header>
      <div class="bg-mod-card rounded-sm">
        <t-row :gutter="16">
          <t-col :flex="14">
            <div class="my-6 ml-4">
              <t-input v-model="globalFilter" placeholder="全局搜索">
                <search-icon slot="prefix-icon"></search-icon>
              </t-input>
            </div>
          </t-col>
          <t-col :flex="1">
            <div class="my-6 mr-4" style="float: right">
              <t-button @click="isAddRecord = !isAddRecord">
                <add-icon slot="icon" />
                新建
              </t-button>
            </div>
          </t-col>
        </t-row>
        <t-table
          rowKey="record_id"
          :columns="columns"
          :data.sync="data"
          size="small"
          :pagination="pagination"
          @data-change="dataChange"
          style="font-size: 12px;"
          class="px-8"
        >
          <template #createTime-slot="{ row }">
            {{ dateFormat(row.createTime) }}
          </template>
          <template #operation="{ row }">
            <t-link class="pr-2" theme="primary" hover="color" @click="deleteRecord(row.record_id, row.type, row.name)">
              删除
            </t-link>
          </template>
        </t-table>
      </div>
      <t-dialog :visible.sync="isAddRecord" header="档案信息" :cancelBtn="null" :confirm-btn="getConfirmBtn">
        <t-form
            ref="formRef"
            :data="recordForm"
            :rules="rules"
            @submit="onSubmit"
            class="p-4"
            labelAlign="top"
        >
          <t-form-item label="档案名称" name="name">
            <t-input v-model="recordForm.name" placeholder="请输入档案名称"></t-input>
          </t-form-item>
          <t-form-item label="档案类型" name="type">
            <t-select v-model="recordForm.type" clearable filterable placeholder="请选择档案类型">
              <t-option v-for="(item, index) in recordCategory" :value="item.value" :label="item.label" :key="index">
                {{ item.label }}
              </t-option>
            </t-select>
          </t-form-item>
          <t-form-item label="创建人" name="author">
            <t-input :disabled="true" v-model="recordForm.author" placeholder="请输入创建人"></t-input>
          </t-form-item>
        </t-form>
      </t-dialog>
    </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'
import { formatterDate } from '@/utils/index'
import { addRecordsApi, getRecordsApi, deleteRecordAPI } from '@/api/cmdb/cmdb_record_restore'
import { SearchIcon, AddIcon } from 'tdesign-icons-vue'
import globalSearch from '@/mixins/globalSearch'
import dialogSubmit from '@/mixins/dialogSubmit'
export default {
  name: 'dataRecords',
  mixins: [globalSearch, dialogSubmit],
  components: {
    ContentHeader,
    SearchIcon,
    AddIcon
  },
  data () {
    return {
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 12,
        total: 0,
        showJumper: true
      },
      recordCategory: [
        {
          label: 'vm',
          value: 'vm'
        },
        {
          label: 'vnf',
          value: 'vnf'
        }
      ],
      recordForm: {
        name: '',
        type: '',
        author: this.$store.getters.getInfo.userName
      },
      rules: {
        name: [{ required: true, message: '档案名必填', type: 'error' }],
        type: [{ required: true, message: '档案类型必选', type: 'error' }]
      },
      // 弹窗标识
      isAddRecord: false,
      // 头部组件数据
      data: [],
      columns: [
        {
          colKey: 'record_id',
          title: '档案ID',
          align: 'left',
          className: () => 'table-font-main'
        },
        { colKey: 'name', title: '档案名称', align: 'left' },
        { colKey: 'type', title: '档案类型', align: 'left' },
        { colKey: 'createTime', title: '创建时间', align: 'left', cell: 'createTime-slot' },
        { colKey: 'author', title: '创建人', align: 'left' },
        { colKey: 'operation', align: 'center', title: '操作' }
      ]
    }
  },
  mounted () {
    this.getRecordList()
  },
  computed: {
    dateFormat () {
      // 格式化时间
      return function (date) {
        return formatterDate(date)
      }
    }
  },
  methods: {
    dataChange (data) {
      this.data = data
    },
    getRecordList () {
      return new Promise((resolve, reject) => {
        getRecordsApi().then(response => {
          const { data } = response
          if (data.code === 0) {
            this.data = data.data
            this.getInitData(this.data)
            this.pagination.total = this.data.length
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    // 删除构件事件
    deleteRecord (id, type, name) {
      const confirmDia = this.$dialog.confirm({
        header: '删除档案',
        theme: 'warning',
        body: `是否确定删除该档案: ${name}`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        onConfirm: ({ e }) => {
          return new Promise((resolve, reject) => {
            deleteRecordAPI({ record_id: id, type: type }).then(response => {
              const { data } = response
              if (data.code === 0) {
                this.$message.success('删除档案')
                this.getRecordList()
                confirmDia.destroy()
              } else {
                this.$message.error(data.message)
              }
            }).catch(error => {
              this.$message.error(error.data.message)
            })
          })
        },
        onClose: ({ e, trigger }) => {
          confirmDia.hide()
        }
      })
    },
    onSubmit ({ validateResult, firstError }) {
      if (validateResult === true) {
        return new Promise((resolve, reject) => {
          addRecordsApi(this.recordForm).then(response => {
            const { data } = response
            if (data.code === 0) {
              this.$message.success(`成功创建档案: ${this.recordForm.name}!`)
              this.getRecordList()
              this.isAddRecord = false
            } else {
              this.$message.error(data.message)
            }
          }).catch(error => {
            this.$message.error(error.data.message)
          })
        })
      } else {
        this.$message.warning(`错误：${firstError}`)
      }
    }
  }
}
</script>

<style scoped>
</style>
