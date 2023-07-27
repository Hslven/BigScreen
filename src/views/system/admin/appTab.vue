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
        <template #app-name-slot="{ col, row }">
          <div class="h6" style="line-height: 1.71;">
            <a @click="editAppEvent(row)" class="table-main-font" style="cursor: pointer;text-decoration: none;">{{ row.appName || '-' }}</a>
          </div>
        </template>
        <template #operation="{ row }">
          <t-link theme="primary" hover="color" @click="onApp(row)">
            权限
          </t-link>
          <t-link class="mr-2" theme="primary" hover="color" @click="deleteApp(row.appId, row.appName)">
            删除
          </t-link>
        </template>
      </t-table>
    </t-config-provider>
    <t-dialog :visible.sync="is_open" header="应用信息" :cancelBtn="null" :confirm-btn="getConfirmBtn">
      <t-form
        ref="formRef"
        :data="form"
        :rules="rules"
        @submit="onSubmit"
        class="p-4"
        labelAlign="top"
      >
        <t-form-item label="应用名" name="appName">
          <t-input v-model="form.appName" placeholder="请输入应用名"></t-input>
        </t-form-item>
      </t-form>
    </t-dialog>
    <t-dialog
      :confirmBtn="auth_select_btn"
      :onClose="() => (this.auth_select_btn = {
        content: '确定',
        theme: 'primary',
        loading: false
      })"
      width="33%"
      :visible.sync="is_auth_select"
      header="权限分配"
      :onConfirm="updateAppPermissionEvent">
      <t-transfer :keys="{ label: 'permissionName', value: 'permissionId' }" theme="primary" :data="permissionList" v-model="targetValue" :checked-value="checkedValue" :search="true" />
    </t-dialog>
  </div>
</template>

<script>
import { getPermissionListApi } from '@/api/system/permission'
import { updateAppPermissionsAPI } from '@/api/system/auth'
import { getAppListApi, deleteAppAPI, getAppInfoApi, addAppAPI, updateAppInfoApi } from '@/api/system/app'
import { appTable } from '@/dict/columns'
import globalSearch from '@/mixins/globalSearch'
import dialogSubmit from '@/mixins/dialogSubmit'
import { SearchIcon, AddIcon } from 'tdesign-icons-vue'
export default {
  name: 'appTab',
  mixins: [globalSearch, dialogSubmit],
  components: {
    SearchIcon, AddIcon
  },
  data () {
    return {
      is_open: false,
      is_edit: false,
      is_auth_select: false,
      auth_select_btn: {
        content: '确定',
        theme: 'primary',
        loading: false
      },
      data: [],
      sort: {},
      form: {
        appName: ''
      },
      rules: {
        appName: [
          { required: true, message: '应用名必填', type: 'error' }
        ]
      },
      columns: appTable.columns,
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 12,
        total: 0,
        showJumper: true
      },
      globalLocale: {
        table: {
          sortIcon: (h) => h && <mod-icon name="arrow_drop_down" size="22px" style="color: #cccccc !important" />
        }
      },
      targetValue: [],
      checkedValue: [],
      permissionList: [],
      majorId: ''
    }
  },
  mounted () {
    this.getAppList()
    this.getPermissionList()
  },
  methods: {
    addEvent () {
      this.is_open = true
      this.is_edit = false
    },
    sortChange (sort) {
      this.sort = sort
    },
    dataChange (data) {
      this.data = data
    },
    getAppList () {
      // 请求应用列表接口
      return new Promise((resolve, reject) => {
        getAppListApi({}).then(response => {
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
    onSubmit ({ validateResult, firstError }) {
      if (validateResult === true) {
        if (this.is_edit) {
          const { appName, appId } = this.form
          const params = { appName, appId }
          params.createBy = this.$store.getters.getInfo.userName
          return new Promise((resolve, reject) => {
            updateAppInfoApi(params).then(response => {
              const { data } = response
              if (data.code === 0) {
                this.$message.success('更新成功')
                this.is_open = false
                this.getAppList()
              } else {
                this.$message.error(data.msg)
              }
            }).catch(error => {
              this.$message.error(error.response.data.msg)
            })
          })
        } else {
          this.form.createBy = this.$store.getters.getInfo.userName
          return new Promise((resolve, reject) => {
            addAppAPI(this.form).then(response => {
              const { data } = response
              if (data.code === 0) {
                this.$message.success('成功添加新应用')
                this.getAppList()
                this.is_open = false
              } else {
                this.$message.error(data.message)
              }
            }).catch(error => {
              this.$message.error(error.response.data.message)
            })
          })
        }
      } else {
        this.$message.warning(`错误：${firstError}`)
      }
    },
    editAppEvent (row) {
      this.is_open = true
      this.is_edit = true
      this.form = row
    },
    deleteApp (appId, appName) {
      const confirmDia = this.$dialog.confirm({
        header: '删除应用',
        theme: 'warning',
        body: `是否确定删除该应用: ${appName}`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        onConfirm: ({ e }) => {
          return new Promise((resolve, reject) => {
            deleteAppAPI(appId).then(response => {
              const { data } = response
              if (data.code === 0) {
                this.$message.success('删除应用成功')
                this.getAppList()
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
      const appList = []
      data.forEach(function (element, index) {
        if (element.delFlag !== '2') {
          appList.push(element)
        }
      })
      return appList
    },
    onApp (selectRow) {
      return new Promise((resolve, reject) => {
        getAppInfoApi(selectRow.appId).then(response => {
          this.majorId = selectRow.appId
          const { data } = response
          if (data.code === 0) {
            this.is_auth_select = true
            this.targetValue = data.data.permissions.map(e => e.permissionId)
          } else {
            this.$message.error('获取应用详情失败！')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    getPermissionList () {
      return new Promise((resolve, reject) => {
        getPermissionListApi({}).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.permissionList = data.data
          } else {
            this.$message.error('获取权限列表失败！')
          }
        }).catch(error => {
          this.$message.error('获取权限列表操作失败！')
          reject(error)
        })
      })
    },
    updateAppPermissionEvent () {
      this.auth_select_btn.content = '正在分配...'
      this.auth_select_btn.loading = true
      return new Promise((resolve, reject) => {
        updateAppPermissionsAPI({ appId: this.majorId, permissionIds: this.targetValue }).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.$message.success('更新权限成功')
            this.is_auth_select = false
          } else {
            this.$message.error(data.msg)
            this.auth_select_btn.content = '确定'
            this.auth_select_btn.loading = false
          }
        }).catch(error => {
          this.$message.error(error.response.data.msg)
          this.auth_select_btn.content = '确定'
          this.auth_select_btn.loading = false
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
