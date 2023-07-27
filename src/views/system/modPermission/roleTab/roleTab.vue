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
    <t-table
        rowKey="index"
        :columns="columns"
        :data.sync="data"
        size="small"
        :pagination="pagination"
        style="font-size: 12px;"
        class="px-8"
      >
        <template #role-name-slot="{ row }">
          <div class="h6" style="line-height: 1.71;">
            <a @click="editRole(row)" class="table-main-font" style="cursor: pointer;text-decoration: none;">{{ row.role_name|| '-' }}</a>
            <p style="font-size: 12px;font-weight: 400;color: #79879c;margin: 0 0 0px !important;">{{ row.remark|| '-' }}</p>
          </div>
        </template>
        <template #status-slot="{ row }">
          <mod-status :status="statusFormatter(row.status)"></mod-status>
        </template>
        <template #operation="{ row }">
          <t-link class="pr-2" theme="primary" hover="color" @click="deleteRole(row)">
            删除
          </t-link>
          <t-link class="pr-2" theme="primary" hover="color" @click="getRoleInfo(row, 'user')">
            用户
          </t-link>
          <t-link class="pr-2" theme="primary" hover="color" @click="getRoleInfo(row, 'permission')">
            权限
          </t-link>
        </template>
      </t-table>
    <t-dialog :visible.sync="is_open" header="角色" :cancelBtn="null" :confirm-btn="getConfirmBtn">
      <t-form
          ref="formRef"
          :data="form"
          :rules="rules"
          @submit="onUserSubmit"
          class="p-4"
          labelAlign="top"
      >
        <t-form-item label="角色名" name="role_name">
          <t-input v-model="form.role_name" placeholder="请输入角色名"></t-input>
        </t-form-item>
        <t-form-item label="分类" name="category">
          <t-select v-model="form.category" clearable filterable placeholder="请选择分类">
            <t-option v-for="(item, index) in options" :value="item.value" :label="item.label" :key="index">
              {{ item.label }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="备注" name="remark">
          <t-input v-model="form.remark" placeholder="请输入备注"></t-input>
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
      width="28%"
      :visible.sync="is_auth_user_select"
      header="用户分配"
      :onConfirm="updateUserToRoleEvent">
      <t-transfer
        :keys="{ label: 'userName', value: 'userId' }"
        theme="primary"
        :data="userList"
        v-model="userTargetValue"
        :checked-value="userCheckedValue"
        :transfer-item="transferItem"
        :search="true" />
    </t-dialog>
    <t-dialog :visible.sync="isAuthPermission" header="绑定权限" :cancelBtn="null" @confirm="onPermissionSubmit">
      <t-tree
        :data="permissionMenus"
        v-model="activedMenus"
        :keys="{ value: 'permission_id', label: 'permission_name', children: 'children' }"
        :checkable="true"
      />
    </t-dialog>
  </div>
</template>

<script>
import { addPermissionToRoleApi, deletePermissionToRoleApi, getModPermissionListApi, getModRoleListApi, deleteModRoleApi, addModRoleApi, updateModRoleApi, addUserToRoleApi, deleteUserToRoleApi, getModRoleInfoApi } from '@/api/modServer/modAuth'
import { getUserListApi } from '@/api/system/user'
import { SearchIcon, AddIcon } from 'tdesign-icons-vue'
import ModStatus from '@/components/modComp/modStatus'
import { modRoleTable } from '@/dict/columns'
import globalSearch from '@/mixins/globalSearch'
import dialogSubmit from '@/mixins/dialogSubmit'
export default {
  name: 'roleTab',
  mixins: [globalSearch, dialogSubmit],
  components: {
    ModStatus,
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
      is_auth_user_select: false,
      auth_select_btn: {
        content: '确定',
        theme: 'primary',
        loading: false
      },
      is_open: false,
      is_edit: false,
      isAuthUser: false,
      isAuthPermission: false,
      data: [],
      form: {},
      options: [
        {
          label: '默认',
          value: 'default'
        }],
      rules: {
        role_name: [{ required: true, message: '角色名必填', type: 'error' }],
        category: [{ required: true, message: '分类必填', type: 'error' }],
        remark: [{ required: true, message: '备注必填', type: 'error' }]
      },
      columns: modRoleTable.columns,
      roleRow: null,
      // 穿梭框所需数据
      userTargetValue: [],
      userTargetValueBack: [],
      userCheckedValue: [],
      userList: [],
      roleId: '',
      // 权限菜单所需数据
      permissionMenus: [],
      activedMenus: [],
      activedMenusBack: []
    }
  },
  mounted () {
    this.getPermissionList()
    this.getUserList()
    this.getRoleList()
  },
  computed: {
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
    getPermissionList () {
      // 请求用户列表接口
      return new Promise((resolve, reject) => {
        getModPermissionListApi().then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.permissionMenus = [
              {
                permission_id: '权限菜单',
                permission_name: '权限菜单',
                children: this.filterPermissionData(data.data)
              }
            ]
          } else {
            this.$message.error(data)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    filterPermissionData (data) {
      const categoryDict = {
        service: '构件',
        mod: '模组',
        element: '页面全局操作元素'
      }
      const groupData = this.groupByAttr(data, 'category')
      Object.keys(groupData).forEach((item) => {
        if (groupData[item].permission_name !== 'element') {
          groupData[item].children = this.groupByAttr(groupData[item].children, 'data_name')
        }
      })
      groupData.forEach((item) => {
        item.permission_name = categoryDict[item.permission_name]
      })
      return groupData
    },
    groupByAttr (data, attr) {
      const map = []
      const res = []
      data.forEach(item => {
        if (map.indexOf(item[attr]) < 0) {
          res.push({
            permission_id: item[attr],
            permission_name: item[attr],
            children: [item]
          })
          map.push(item[attr])
        } else {
          res.forEach(obj => {
            if (obj.permission_name === item[attr]) {
              obj.children.push(item)
            }
          })
        }
      })
      return res
    },
    transferItem (h, { data }) {
      const sourceLabel = 
        <div class="m-2">
          <div class="text-mod-title" style="font-size: 12px">
            {data.userName}
          </div>
          <div class="text-mod-body" style="font-size: 10px">
            昵称: {data.nickName}
          </div>
        </div>
      
      return sourceLabel
    },
    getUserList () {
      // 请求用户列表接口
      return new Promise((resolve, reject) => {
        getUserListApi().then(response => {
          const { data } = response
          if (data.code === 0) {
            data.data.forEach((item) => {
              if (item.delFlag === '0') {
                this.userList = data.data.filter((e) => { return e.userName !== null })
              }
            })
          } else {
            this.$message.error(data)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    getRoleInfo (row, sign) {
      this.roleId = row.role_id
      return new Promise((resolve, reject) => {
        getModRoleInfoApi(this.roleId).then(response => {
          const { data } = response
          if (data.status === 'success') {
            if (sign === 'user') {
              this.userTargetValue = data.data.users.filter((e) => { return e.user_name !== null }).map(e => e.user_id)
              this.userTargetValueBack = data.data.users.filter((e) => { return e.user_name !== null }).map(e => e.user_id)
              this.is_auth_user_select = true
            } else {
              this.activedMenus = data.data.permissions.map(e => e.permission_id)
              this.activedMenusBack = data.data.permissions.map(e => e.permission_id)
              this.isAuthPermission = true
            }
          } else {
            this.$message.error(data)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    getRoleList () {
      // 请求角色列表接口
      return new Promise((resolve, reject) => {
        getModRoleListApi().then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.data = data.data
            this.getInitData(this.data)
            this.pagination.total = this.data.length
          } else {
            this.$message.error(data)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    addEvent () {
      this.form = {}
      this.is_open = true
      this.is_edit = false
    },
    editRole (row) {
      this.is_open = true
      this.is_edit = true
      this.form = row
    },
    authPermission (row) {
      this.isAuthPermission = !this.isAuthPermission
      this.roleRow = row
    },
    deleteRole (row) {
      const confirmDia = this.$dialog.confirm({
        header: '删除角色',
        theme: 'warning',
        body: `是否确定删除该角色: ${row.role_name}`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        onConfirm: ({ e }) => {
          return new Promise((resolve, reject) => {
            deleteModRoleApi(row.role_id).then(response => {
              const { data } = response
              if (data.status === 'success') {
                this.$message.success('删除成功')
                this.getRoleList()
                confirmDia.destroy()
              } else {
                this.$message.error(data.message)
              }
            }).catch(error => {
              this.$message.error(error.response.data.message)
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
    onUserSubmit ({ validateResult, firstError }) {
      if (validateResult === true) {
        if (this.is_edit) {
          this.form.status = 0
          delete this.form.id
          this.form.createBy = this.$store.getters.getInfo.userName
          this.form.updateBy = this.$store.getters.getInfo.userName
          return new Promise((resolve, reject) => {
            updateModRoleApi(this.form).then(response => {
              const { data } = response
              if (data.status === 'success') {
                this.$message.success(data.message)
                this.is_open = false
                this.getRoleList()
              } else {
                this.$message.error(data.message)
              }
            }).catch(error => {
              this.$message.error(error.response.data.message)
            })
          })
        } else {
          this.form.status = 0
          this.form.createBy = this.$store.getters.getInfo.userName
          this.form.updateBy = this.$store.getters.getInfo.userName
          return new Promise((resolve, reject) => {
            addModRoleApi(this.form).then(response => {
              const { data } = response
              if (data.status === 'success') {
                this.$message.success(data.message)
                this.getRoleList()
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
    async updateUserToRoleEvent () {
      this.auth_select_btn.content = '正在分配...'
      this.auth_select_btn.loading = true
      const diffList = this.userTargetValue.concat(this.userTargetValueBack).filter(v => !this.userTargetValue.includes(v) || !this.userTargetValueBack.includes(v))
      const addList = []
      const deleteList = []
      diffList.forEach((item) => {
        if (this.userTargetValue.includes(item)) {
          addList.push(item)
        } else {
          deleteList.push(item)
        }
      })
      if (addList.length !== 0) {
        await this.addUserToRole(addList)
      }
      if (deleteList.length !== 0) {
        await this.deleteUserToRole(deleteList)
      }
    },
    addUserToRole (addList) {
      const dataForm = {
        user_ids: addList,
        role_id: this.roleId
      }
      return new Promise((resolve, reject) => {
        addUserToRoleApi(dataForm).then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.$message.success('分配用户成功')
            this.is_auth_user_select = false
          } else {
            this.$message.error(data.message)
          }
          this.auth_select_btn.content = '确定'
          this.auth_select_btn.loading = false
        }).catch(error => {
          this.$message.error(error.response.data.message)
          this.auth_select_btn.content = '确定'
          this.auth_select_btn.loading = false
        })
      })
    },
    deleteUserToRole (deleteList) {
      const dataForm = {
        user_ids: deleteList,
        role_id: this.roleId
      }
      return new Promise((resolve, reject) => {
        deleteUserToRoleApi(dataForm).then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.$message.success('用户移除成功')
            this.is_auth_user_select = false
          } else {
            this.$message.error(data.message)
          }
          this.auth_select_btn.content = '确定'
          this.auth_select_btn.loading = false
        }).catch(error => {
          this.$message.error(error.response.data.message)
          this.auth_select_btn.content = '确定'
          this.auth_select_btn.loading = false
        })
      })
    },
    async onPermissionSubmit (context) {
      const diffList = this.activedMenus.concat(this.activedMenusBack).filter(v => !this.activedMenus.includes(v) || !this.activedMenusBack.includes(v))
      const addList = []
      const deleteList = []
      diffList.forEach((item) => {
        if (this.activedMenus.includes(item)) {
          addList.push(item)
        } else {
          deleteList.push(item)
        }
      })
      if (addList.length !== 0) {
        await this.addPermissionToRole(addList)
      }
      if (deleteList.length !== 0) {
        await this.deletePermissionToRole(deleteList)
      }
    },
    addPermissionToRole (addList) {
      const dataForm = {
        permission_ids: addList,
        role_id: this.roleId
      }
      return new Promise((resolve, reject) => {
        addPermissionToRoleApi(dataForm).then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.$message.success('权限分配成功')
            this.isAuthPermission = false
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },
    deletePermissionToRole (deleteList) {
      const dataForm = {
        permission_ids: deleteList,
        role_id: this.roleId
      }
      return new Promise((resolve, reject) => {
        deletePermissionToRoleApi(dataForm).then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.$message.success('权限移除成功')
            this.isAuthPermission = false
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
