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
        <template #rolename-slot="{ row }">
          <div class="h6" style="line-height: 1.71;">
            <a @click="editRoleEvent(row)" class="table-main-font" style="cursor: pointer;text-decoration: none;">{{ row.roleName|| '-' }}</a>
            <p style="font-size: 12px;font-weight: 400;color: #79879c;margin: 0 0 0px !important;">{{ row.remark|| '-' }}</p>
          </div>
        </template>
        <template #status-slot="{ row }">
          <mod-status :status="statusFormatter(row.status)"></mod-status>
        </template>
        <template #auth="{ row }">
          <t-link class="mr-2" theme="primary" hover="color" @click="onRole(row), is_auth_user_select=true">
            用户
          </t-link>
          <t-link class="mr-2" theme="primary" hover="color" @click="onRole(row), is_auth_permission_select=true">
            权限
          </t-link>
          <t-link theme="primary" hover="color" @click="giveMenus(row)">
            菜单
          </t-link>
        </template>
        <template #operation="{ row }">
          <t-link theme="primary" hover="color" @click="deleteRole(row.roleId, row.roleName)">
            删除
          </t-link>
        </template>
      </t-table>
    </t-config-provider>
    <t-dialog :visible.sync="is_open" header="角色信息" :cancelBtn="null" :confirm-btn="getConfirmBtn">
      <t-form
        ref="formRef"
        :data="form"
        :rules="rules"
        @submit="onSubmit"
        class="p-4"
        labelAlign="top"
      >
        <t-form-item label="角色名" name="roleName">
          <t-input v-model="form.roleName" placeholder="请输入角色名"></t-input>
        </t-form-item>
        <t-form-item label="显示顺序" name="roleSort">
          <t-input v-model="form.roleSort" placeholder="请输入显示顺序：0-9999"></t-input>
        </t-form-item>
        <t-form-item label="备注" name="remark">
          <t-input v-model="form.remark" placeholder="请输入备注"></t-input>
        </t-form-item>
      </t-form>
    </t-dialog>
    <t-dialog :visible.sync="isGiveMenus" header="菜单授权" :cancelBtn="null" :confirm-btn="null">
      <give-menus-comp :role-info="roleInfo" :isGiveMenus.sync="isGiveMenus" />
    </t-dialog>
    <t-dialog
      :confirmBtn="auth_select_btn"
      :onClose="() => (this.auth_select_btn = {
        content: '确定',
        theme: 'primary',
        loading: false
      })"
      width="27%"
      :visible.sync="is_auth_user_select"
      header="用户分配"
      :onConfirm="updateUserToRoleEvent">
      <t-transfer
        :keys="{ label: 'userName', value: 'userId' }"
        theme="primary"
        :data="userList"
        v-model="userTargetValue"
        :checked-value="userCheckedValue"
        :search="true" />
    </t-dialog>
    <t-dialog
      :confirmBtn="auth_select_btn"
      :onClose="() => (this.auth_select_btn = {
        content: '确定',
        theme: 'primary',
        loading: false
      })"
      width="30%"
      :visible.sync="is_auth_permission_select"
      header="权限分配"
      :onConfirm="updatePermissionToRoleEvent">
      <t-transfer
        :keys="{ label: 'permissionName', value: 'permissionId' }"
        theme="primary"
        :data="permissionList"
        v-model="permissionTargetValue"
        :checked-value="permissionCheckedValue"
        :search="true" />
    </t-dialog>
  </div>
</template>

<script>
import { getUserListApi } from '@/api/system/user'
import { getPermissionListApi } from '@/api/system/permission'
import { updateUsersAPI, updatePermissionsAPI } from '@/api/system/auth'
import { getRoleListApi, deleteRoleAPI, getRoleInfoApi, addRoleApi, updateRoleInfoApi } from '@/api/system/role'
import { SearchIcon, AddIcon } from 'tdesign-icons-vue'
import { roleTable } from '@/dict/columns'
import ModStatus from '@/components/modComp/modStatus'
import giveMenusComp from './giveMenusComp'
import globalSearch from '@/mixins/globalSearch'
import dialogSubmit from '@/mixins/dialogSubmit'
export default {
  name: 'roleTab',
  mixins: [globalSearch, dialogSubmit],
  components: {
    ModStatus,
    giveMenusComp,
    SearchIcon,
    AddIcon
  },
  data () {
    return {
      is_auth_user_select: false,
      is_auth_permission_select: false,
      auth_select_btn: {
        content: '确定',
        theme: 'primary',
        loading: false
      },
      isGiveMenus: false,
      is_open: false,
      is_edit: false,
      sort: {},
      data: [],
      form: {
        permissionType: '接口'
      },
      rules: {
        roleName: [{ required: true, message: '角色名必填', type: 'error' }],
        roleSort: [{ required: true, message: '显示顺序必填', type: 'error' }]
      },
      columns: roleTable.columns,
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
      // 穿梭框所需数据
      userTargetValue: [],
      userCheckedValue: [],
      userList: [],
      permissionTargetValue: [],
      permissionCheckedValue: [],
      permissionList: [],
      majorId: '',
      roleInfo: {}
    }
  },
  created () {},
  mounted () {
    this.getRoleList()
    this.getUserList()
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
    sortChange (sort) {
      this.sort = sort
    },
    dataChange (data) {
      this.data = data
    },
    addEvent () {
      this.is_open = true
      this.is_edit = false
      this.form = {
        permissionType: '接口'
      }
    },
    getRoleList () {
      // 请求角色列表接口
      return new Promise((resolve, reject) => {
        getRoleListApi({}).then(response => {
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
        this.form.status = '0'
        if (this.is_edit) {
          const { roleName, roleSort, remark, roleId } = this.form
          const params = { roleName, roleSort, remark, roleId }
          params.createBy = this.$store.getters.getInfo.userName
          return new Promise((resolve, reject) => {
            updateRoleInfoApi(params).then(response => {
              const { data } = response
              if (data.code === 0) {
                this.$message.success('更新成功')
                this.is_open = false
                this.getRoleList()
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
            addRoleApi(this.form).then(response => {
              const { data } = response
              if (data.code === 0) {
                this.$message.success('成功添加新角色')
                this.getRoleList()
                this.is_open = false
              } else {
                this.$message.error(data.msg)
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
    editRoleEvent (row) {
      this.is_open = true
      this.is_edit = true
      this.form = row
    },
    deleteRole (roleId, roleName) {
      const confirmDia = this.$dialog.confirm({
        header: '删除角色',
        theme: 'warning',
        body: `是否确定删除该角色: ${roleName}`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        onConfirm: ({ e }) => {
          return new Promise((resolve, reject) => {
            deleteRoleAPI(roleId).then(response => {
              const { data } = response
              if (data.code === 0) {
                this.$message.success('删除成功')
                this.getRoleList()
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
      const roleList = []
      data.forEach(function (element, index) {
        if (element.delFlag !== '2') {
          roleList.push(element)
        }
      })
      return roleList
    },
    onRole (selectRow) {
      this.majorId = selectRow.roleId
      return new Promise((resolve, reject) => {
        getRoleInfoApi(selectRow.roleId).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.userTargetValue = data.data.users.filter((e) => { return e.userName !== null }).map(e => e.userId)
            this.permissionTargetValue = data.data.permissions.map(e => e.permissionId)
          } else {
            this.$message.error('获取角色详情失败！')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    giveMenus (data) {
      this.isGiveMenus = true
      this.roleInfo = data
    },
    getUserList () {
      return new Promise((resolve, reject) => {
        getUserListApi({}).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.userList = data.data.filter((e) => { return e.userName !== null })
          } else {
            this.$message.error('获取用户列表失败')
          }
        }).catch(error => {
          this.$message.error('获取用户列表操作失败！')
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
            this.$message.error('获取权限列表失败')
          }
        }).catch(error => {
          this.$message.error('获取权限列表操作失败')
          reject(error)
        })
      })
    },
    updateUserToRoleEvent () {
      this.auth_select_btn.content = '正在分配...'
      this.auth_select_btn.loading = true
      return new Promise((resolve, reject) => {
        updateUsersAPI({ roleId: this.majorId, userIds: this.userTargetValue }).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.$message.success('分配成功')
            this.is_auth_user_select = false
          } else {
            this.$message.error(data.msg)
          }
          this.auth_select_btn.content = '确定'
          this.auth_select_btn.loading = false
        }).catch(error => {
          this.$message.error(error.response.data.msg)
          this.auth_select_btn.content = '确定'
          this.auth_select_btn.loading = false
        })
      })
    },
    updatePermissionToRoleEvent () {
      this.auth_select_btn.content = '正在分配...'
      this.auth_select_btn.loading = true
      return new Promise((resolve, reject) => {
        updatePermissionsAPI({ roleId: this.majorId, permissionIds: this.permissionTargetValue }).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.$message.success('分配成功')
            this.is_auth_permission_select = false
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
