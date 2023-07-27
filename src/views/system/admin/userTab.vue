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
        cellEmptyContent = "-"
        class="px-8"
      >
        <template #username-slot="{ row }">
          <div class="h6" style="line-height: 1.71;">
            <a @click="editUserEvent(row)" class="table-main-font" style="cursor: pointer;text-decoration: none;">{{ row.userName|| '-' }}</a>
            <p style="font-size: 12px;font-weight: 400;color: #79879c;margin: 0 0 0px !important;">{{ row.remark|| '-' }}</p>
          </div>
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
          <t-link class="pr-2" v-if="isadmin(row.userName)" theme="primary" hover="color" @click="resetPassword(row.userId)">
            密码重置
          </t-link>
          <t-link class="pr-2" v-if="isadmin(row.userName)" theme="primary" hover="color" @click="deleteUser(row.userId, row.userName)">
            删除
          </t-link>
          <span
            class="text-grey"
            v-if="!isadmin(row.userName)"
          > 默认管理员</span>
        </template>
      </t-table>
    </t-config-provider>
    <t-dialog width="30%" :visible.sync="is_open" header="用户信息" :cancelBtn="null" :confirm-btn="getConfirmBtn">
      <t-form
          ref="formRef"
          :data="form"
          :rules="rules"
          labelAlign="top"
          class="p-4"
          @submit="onSubmit"
      >
        <t-form-item label="用户名" name="userName">
          <t-input v-model="form.userName" placeholder="请输入用户名"></t-input>
        </t-form-item>
        <t-form-item label="用户昵称" name="nickName">
          <t-input v-model="form.nickName" placeholder="请输入用户昵称"></t-input>
        </t-form-item>
        <t-form-item label="手机号" name="phonenumber">
          <t-input v-model="form.phonenumber" placeholder="请输入手机号"></t-input>
        </t-form-item>
        <t-form-item label="SSO账号" name="ssoName">
          <t-input v-model="form.ssoName" placeholder="请输入SSO账号"></t-input>
        </t-form-item>
        <t-form-item label="邮箱" name="email">
          <t-input v-model="form.email" placeholder="请输入邮箱"></t-input>
        </t-form-item>
        <t-form-item v-if="!is_edit" label="登录密码" name="password">
          <t-input type="password" v-model="form.password" placeholder="请输入登录密码"></t-input>
        </t-form-item>
        <t-form-item v-if="!is_edit" label="确认密码" name="cpassword">
          <t-input type="password" v-model="form.cpassword" placeholder="请再次输入密码"></t-input>
        </t-form-item>
        <t-form-item v-if="!is_edit" label="备注" name="remark">
          <t-input v-model="form.remark" placeholder="请输入备注"></t-input>
        </t-form-item>
        <t-form-item label="性别" name="sex">
          <t-radio-group v-model="form.sex">
            <t-radio value="0">男</t-radio>
            <t-radio value="1">女</t-radio>
          </t-radio-group>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script>
import { getUserListApi, deleteUserAPI, addUserAPI, updateUserInfoApi, resetPasswordApi } from '@/api/system/user'
import { SearchIcon, AddIcon } from 'tdesign-icons-vue'
import { userTable } from '@/dict/columns'
import ModStatus from '@/components/modComp/modStatus'
import globalSearch from '@/mixins/globalSearch'
import dialogSubmit from '@/mixins/dialogSubmit'
export default {
  name: 'userTab',
  mixins: [globalSearch, dialogSubmit],
  components: { SearchIcon, AddIcon, ModStatus },
  data () {
    return {
      is_open: false,
      is_edit: false,
      isPwd: true,
      sort: {},
      data: [],
      form: {},
      rules: {
        userName: [{ required: true, message: '姓名必填', type: 'error' }],
        nickName: [{ required: true, message: '用户昵称必填', type: 'error' }],
        phonenumber: [{ required: true, message: '手机号必填', type: 'error' }],
        email: [{ required: true, message: '邮箱必填' },
          { email: { ignore_max_length: true }, message: '请输入正确的邮箱地址' }],
        password: [{ required: true, message: '密码必填', type: 'error' }],
        cpassword: [{ validator: this.valPassword, message: '两次密码不一致' }],
        sex: [{ required: true, message: '性别必填' }]
      },
      columns: userTable.columns,
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
      }
    }
  },
  mounted () {
    this.getUserList()
  },
  computed: {
    isadmin () {
      // 默认管理员不显示编辑和删除栏
      return function (username) {
        if (username === 'admin') {
          return false
        } else {
          return true
        }
      }
    },
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
    valPassword (val) {
      return new Promise((resolve) => {
        const timer = setTimeout(() => {
          resolve(this.form.password === val)
          clearTimeout(timer)
        })
      })
    },
    addEvent () {
      this.is_open = true
      this.is_edit = false
      this.form = {}
    },
    sortChange (sort) {
      this.sort = sort
    },
    dataChange (data) {
      this.data = data
    },
    getUserList () {
      // 请求用户列表接口
      return new Promise((resolve, reject) => {
        getUserListApi({}).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.data = this.filterData(data.data)
            this.getInitData(this.data)
            this.pagination.total = this.data.length
          } else {
            this.$message.error('获取用户列表失败！')
          }
        }).catch(error => {
          this.$message.error(error.response.message)
        })
      })
    },
    editUserEvent (row) {
      this.is_open = true
      this.is_edit = true
      this.form = row
    },
    deleteUser (userId, userName) {
      const confirmDia = this.$dialog.confirm({
        header: '删除用户',
        theme: 'warning',
        body: `确定删除用户: ${userName}`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        onConfirm: ({ e }) => {
          return new Promise((resolve, reject) => {
            deleteUserAPI(userId).then(response => {
              const { data } = response
              if (data.code === 0) {
                this.$message.success('删除成功')
                this.getUserList()
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
      const userList = []
      data.forEach(function (element, index) {
        element.roles = element.roles.map(function (x) {
          return x.roleName
        })
        if (element.delFlag !== '2') {
          userList.push(element)
        }
      })
      return userList
    },
    onSubmit ({ validateResult, firstError }) {
      if (validateResult === true) {
        if (this.is_edit) {
          const { userName, remark, phonenumber, ssoName, email, userId, nickName, sex } = this.form
          const params = { userName, remark, phonenumber, ssoName, email, userId, nickName, sex }
          return new Promise((resolve, reject) => {
            updateUserInfoApi(params).then(response => {
              const { data } = response
              if (data.code === 0) {
                this.$message.success('更新成功')
                this.is_open = false
                this.getUserList()
              } else {
                this.$message.error(data.msg)
              }
            }).catch(error => {
              this.$message.error(error.response.data.msg)
            })
          })
        } else {
          return new Promise((resolve, reject) => {
            addUserAPI(this.form).then(response => {
              const { data } = response
              if (data.code === 0) {
                this.$message.success('成功添加新用户')
                this.getUserList()
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
    resetPassword (userId) {
      return new Promise((resolve, reject) => {
        resetPasswordApi(userId).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.$message.success('成功重置密码')
          } else {
            this.$message.error(data)
          }
        }).catch(error => {
          this.$message.error(error.response.data)
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
