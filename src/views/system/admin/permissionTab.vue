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
          <t-button @click="addEvent">
            <add-icon slot="icon" />
            新建
          </t-button>
        </div>
      </t-col>
    </t-row>
    <t-config-provider :globalConfig="globalLocale">
      <t-table
        rowKey="index"
        :columns="columns"
        :data.sync="data"
        size="small"
        :sort.sync="sort"
        :pagination="pagination"
        @sort-change="sortChange"
        @data-change="dataChange"
        style="font-size: 12px;"
        class="px-8"
      >
        <template #permission-name-slot="{ row }">
          <div class="h6" style="line-height: 1.71;">
            <a @click="editPermissionEvent(row)" class="table-main-font" style="cursor: pointer;text-decoration: none;">{{ row.permissionName || '-' }}</a>
            <p style="font-size: 12px;font-weight: 400;color: #79879c;margin: 0 0 0px !important;">{{ row.permissionType || '-' }}</p>
          </div>
        </template>
        <template #status-slot="{ row }">
          <mod-status :status="statusFormatter(row.status)"></mod-status>
        </template>
        <template #operation="{ row }">
          <t-link theme="primary" hover="color" @click="deletePermission(row.permissionId, row.permissionName)">
            删除
          </t-link>
        </template>
      </t-table>
    </t-config-provider>
    <t-dialog :visible.sync="is_open" header="权限信息" :cancelBtn="null" :confirm-btn="getConfirmBtn">
      <t-form
        ref="formRef"
        :data="form"
        :rules="rules"
        @submit="onSubmit"
        class="p-4"
        labelAlign="top"
      >
        <t-form-item label="权限名" name="permissionName">
          <t-input v-model="form.permissionName" placeholder="请输入权限名"></t-input>
        </t-form-item>
        <t-form-item label="服务名" name="serverName">
          <t-input v-model="form.serverName" placeholder="请输入服务名"></t-input>
        </t-form-item>
        <t-form-item label="请求路径" name="path">
          <t-input v-model="form.path" placeholder="请输入请求路径"></t-input>
        </t-form-item>
        <t-form-item label="请求方式" name="method">
          <t-select v-model="form.method" class="demo-select-base" clearable filterable placeholder="请选择请求方式">
            <t-option v-for="(item, index) in method_options" :value="item" :label="item" :key="index">
              {{ item }}
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
import { getPermissionListApi, addPermissionAPI, updatePermissionInfoApi, deletePermissionAPI } from '@/api/system/permission'
import { permissionTable } from '@/dict/columns'
import { requestOptions } from '@/dict/options'
import ModStatus from '@/components/modComp/modStatus'
import globalSearch from '@/mixins/globalSearch'
import dialogSubmit from '@/mixins/dialogSubmit'
import { SearchIcon, AddIcon } from 'tdesign-icons-vue'
export default {
  name: 'permissionTab',
  mixins: [globalSearch, dialogSubmit],
  components: { SearchIcon, AddIcon, ModStatus },
  data () {
    return {
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 12,
        total: 0,
        showJumper: true
      },
      method_options: requestOptions,
      is_open: false,
      is_edit: false,
      sort: {},
      data: [],
      form: {
        permissionType: '接口'
      },
      rules: {
        permissionName: [
          { required: true, message: '权限名必填', type: 'error' }
        ],
        serverName: [
          { required: true, message: '服务名必填', type: 'error' }
        ],
        path: [
          { required: true, message: '请求路径必填', type: 'error' }
        ],
        method: [
          { required: true, message: '请求方式必填', type: 'error' }
        ]
      },
      columns: permissionTable.columns,
      globalLocale: {
        table: {
          sortIcon: (h) => h && <mod-icon name="arrow_drop_down" size="22px" style="color: #cccccc !important" />
        }
      }
    }
  },
  created () {},
  mounted () {
    this.getPermissionList()
  },
  computed: {
    statusFormatter () {
      return function (status) {
        if (status === '0') {
          return '正常'
        } else {
          return '异常'
        }
      }
    }
  },
  methods: {
    async addEvent () {
      this.is_open = true
      this.is_edit = false
      this.form = {
        permissionType: '接口'
      }
    },
    sortChange (sort) {
      this.sort = sort
    },
    dataChange (data) {
      this.data = data
    },
    getPermissionList () {
      // 请求用户列表接口
      return new Promise((resolve, reject) => {
        getPermissionListApi({}).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.data = this.filterData(data.data)
            this.getInitData(this.data)
            this.pagination.total = this.data.length
          } else {
            this.$message.error(data.msg)
          }
        }).catch(error => {
          this.$message.error(error.response.data.msg)
        })
      })
    },
    editPermissionEvent (row) {
      this.is_open = true
      this.is_edit = true
      this.form = row
    },
    deletePermission (permissionId, permissionName) {
      const confirmDia = this.$dialog.confirm({
        header: '删除权限',
        theme: 'warning',
        body: `是否确定删除该权限: ${permissionName}`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        onConfirm: ({ e }) => {
          return new Promise((resolve, reject) => {
            deletePermissionAPI(permissionId).then(response => {
              const { data } = response
              if (data.code === 0) {
                this.$message.success('删除成功')
                this.getPermissionList()
                confirmDia.destroy()
              } else {
                this.$message.error(data.msg)
              }
            }).catch(error => {
              this.$message.error(error.response.data.msg)
            })
          })
        },
        onClose: ({ e, trigger }) => {
          confirmDia.hide()
        }
      })
    },
    filterData (data) {
      // 过滤从接口获取的数据
      const permissionList = []
      data.forEach(function (element, index) {
        if (element.delFlag !== '2') {
          permissionList.push(element)
        }
      })
      return permissionList
    },
    onSubmit ({ validateResult, firstError }) {
      if (validateResult === true) {
        if (this.is_edit) {
          const { permissionName, method, remark, serverName, path, permissionType, permissionId } = this.form
          const params = { permissionName, method, remark, serverName, path, permissionType, permissionId }
          return new Promise((resolve, reject) => {
            updatePermissionInfoApi(params).then(response => {
              const { data } = response
              if (data.code === 0) {
                this.$message.success('更新成功')
                this.is_open = false
                this.getPermissionList()
              } else {
                this.$message.error(data.msg)
              }
            }).catch(error => {
              this.$message.error(error.response.data.msg)
            })
          })
        } else {
          return new Promise((resolve, reject) => {
            addPermissionAPI(this.form).then(response => {
              const { data } = response
              if (data.code === 0) {
                this.$message.success('成功添加新权限')
                this.getPermissionList()
                this.is_open = false
              } else {
                this.$message.error(data.msg)
              }
            }).catch(error => {
              this.$message.error(error.response.data.msg)
            })
          })
        }
      } else {
        this.$message.warning(`错误：${firstError}`)
      }
    }
  }
}
</script>

<style scoped>
</style>
