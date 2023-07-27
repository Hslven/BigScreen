<template>
  <div>
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
          <t-button @click="addPermission">
            <add-icon slot="icon" />
            新建
          </t-button>
        </div>
      </t-col>
    </t-row>
    <t-table
      rowKey="index"
      :columns="columns"
      :data.sync="data"
      size="small"
      :pagination="pagination"
      style="font-size: 12px;"
      class="px-8"
    >
      <template #permission-name-slot="{ row }">
        <div class="h6" style="line-height: 1.71;">
          <a class="table-main-font" style="cursor: pointer;text-decoration: none;">{{ row.permission_name|| '-' }}</a>
          <p style="font-size: 12px;font-weight: 400;color: #79879c;margin: 0 0 0px !important;">{{ row.remark|| '-' }}</p>
        </div>
      </template>
      <template #operation-slot="{ row }">
        {{ operateComputed(row.operation_type) || '-' }}
      </template>
      <template #category-slot="{ row }">
        <p style="font-size: 12px;font-weight: 400;margin: 0 0 0px !important;">{{ categoryComputed(row.category) || '-' }}</p>
      </template>
      <template #status-slot="{ row }">
        <mod-status :status="statusFormatter(row.status)"></mod-status>
      </template>
      <template #roles-slot="{ row }">
        <t-space v-for="(role, index) in row.roles" v-bind:key="index">
          <t-tag theme="primary" class="mr-2 mb-2" variant="light">{{ role }}</t-tag>
        </t-space>
      </template>
      <template #operation="{ row }">
      <t-link class="pr-2" theme="primary" hover="color" @click="deletePermission(row)">
        删除
      </t-link>
    </template>
    </t-table>
    <t-dialog :visible.sync="is_open" header="权限信息" :cancelBtn="null" :confirm-btn="getConfirmBtn">
      <t-form
          ref="formRef"
          :data="form"
          :rules="rules"
          @submit="onSubmit"
          class="p-4"
          labelAlign="top"
      >
        <t-form-item label="权限名" name="permission_name">
          <t-input v-model="form.permission_name" placeholder="请输入权限名"></t-input>
        </t-form-item>
        <t-form-item label="唯一标识" name="element_id">
          <t-input v-model="form.element_id" placeholder="请输入唯一标识"></t-input>
        </t-form-item>
        <t-form-item label="操作类型" name="operation_type">
          <t-select v-model="form.operation_type" clearable filterable placeholder="请选择操作类型">
            <t-option v-for="(item, index) in operateOptions" :value="item.value" :label="item.label" :key="index">
              {{ item.label }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="分类" name="category">
          <t-select v-model="form.category" clearable filterable placeholder="请选择分类">
            <t-option v-for="(item, index) in categoryOptions" :value="item.value" :label="item.label" :key="index">
              {{ item.label }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="备注" name="remark">
          <t-input v-model="form.remark" placeholder="请输入备注"></t-input>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script>
import { getModBasePermissionListApi, deleteModPermissionApi, addModPermissionApi } from '@/api/modServer/modAuth'
import { modPermissionTable } from '@/dict/columns'
import { SearchIcon, AddIcon } from 'tdesign-icons-vue'
import ModStatus from '@/components/modComp/modStatus'
import globalSearch from '@/mixins/globalSearch'
import dialogSubmit from '@/mixins/dialogSubmit'
export default {
  name: 'permissionTab',
  components: { ModStatus, SearchIcon, AddIcon },
  mixins: [globalSearch, dialogSubmit],
  data () {
    return {
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 12,
        total: 0,
        showJumper: true
      },
      is_open: false,
      data: [],
      form: {},
      rules: {
        permission_name: [{ required: true, message: '权限名必填', type: 'error' }],
        element_id: [{ required: true, message: '唯一标识必填', type: 'error' }],
        operation_type: [{ required: true, message: '权限操作类型必填', type: 'error' }],
        category: [{ required: true, message: '权限分类必填', type: 'error' }],
        remark: [{ required: true, message: '备注必填', type: 'error' }]
      },
      operateOptions: [
        {
          label: '使用',
          value: 'use'
        },
        {
          label: '查看',
          value: 'look'
        },
        {
          label: '删除',
          value: 'delete'
        },
        {
          label: '新增',
          value: 'add'
        },
        {
          label: '更新',
          value: 'update'
        },
        {
          label: '导出',
          value: 'download'
        },
        {
          label: '执行',
          value: 'execute'
        },
        {
          label: '计划',
          value: 'schedule'
        },
        {
          label: '授权',
          value: 'auth'
        },
        {
          label: '发布',
          value: 'publish'
        }],
      categoryOptions: [
        {
          label: '构件',
          value: 'service'
        },
        {
          label: '模组',
          value: 'mod'
        },
        {
          label: '页面全局操作元素',
          value: 'element'
        }],
      columns: modPermissionTable.columns
    }
  },
  mounted () {
    this.getPermissionList()
  },
  computed: {
    categoryComputed () {
      return function (category) {
        const categoryDict = {
          service: '构件',
          mod: '模组',
          element: '页面全局操作元素'
        }
        return categoryDict[category]
      }
    },
    operateComputed () {
      return function (category) {
        const operateDict = {
          look: '查看',
          add: '新增',
          delete: '删除',
          update: '更新',
          execute: '执行',
          download: '下载',
          schedule: '计划',
          publish: '发布',
          auth: '授权',
          use: '使用'
        }
        return operateDict[category]
      }
    },
    statusFormatter () {
      return function (status) {
        const statusDict = {
          0: '正常',
          1: '异常'
        }
        return statusDict[status]
      }
    }
  },
  methods: {
    addPermission () {
      this.is_open = true
    },
    getPermissionList () {
      return new Promise((resolve, reject) => {
        getModBasePermissionListApi().then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.data = data.data
            this.getInitData(this.data)
            this.pagination.total = this.data.length
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },
    onSubmit () {
      this.form.status = 0
      this.form.createBy = this.$store.getters.getInfo.userName
      this.form.updateBy = this.$store.getters.getInfo.userName
      console.log('this.form: ', this.form)
      return new Promise((resolve, reject) => {
        addModPermissionApi(this.form).then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.$message.success(data.message)
            this.is_open = false
            this.getPermissionList()
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },
    deletePermission (row) {
      const confirmDia = this.$dialog.confirm({
        header: '删除权限',
        theme: 'warning',
        body: `是否确定删除该权限: ${row.permission_name}`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        onConfirm: ({ e }) => {
          return new Promise((resolve, reject) => {
            deleteModPermissionApi(row.element_id).then(response => {
              const { data } = response
              if (data.status === 'success') {
                this.$message.success(data.message)
                this.getPermissionList()
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
    }
  }
}
</script>

<style scoped>
</style>
