<template>
  <div class="bg-mod-card" style="padding: 15px; border-radius: 5px;">
    <t-row align="center">
      <t-col :md="3" :sm="4" :xs="6">
        <t-space align="center">
          <span class="text_font_size">角色名称</span>
          <t-input v-model.trim="condition.roleName" style="width: 250px"></t-input>
        </t-space>
      </t-col>
      <t-col :md="3" :sm="4" :xs="6">
        <t-space align="center">
          <span class="text_font_size">角色类型</span>
          <t-select v-model="condition.roleType" :options="dict.roleType" filterable style="width: 250px"></t-select>
        </t-space>
      </t-col>
      <t-col :md="3" :sm="4" :xs="6">
        <t-space :gutter="15">
          <t-button @click="onSearch">查询</t-button>
          <t-button theme="default" @click="onReset">重置</t-button>
        </t-space>
      </t-col>
      <t-col :md="3" :sm="4" :xs="6" style="text-align: end">
        <t-button theme="primary" @click="dialog.role = true">新增角色</t-button>
      </t-col>
    </t-row>
    <t-table
      hover resizable
      row-key="id"
      size="small"
      table-layout="fixed"
      cell-empty-content="-"
      :max-height="table.height"
      :empty="table.empty"
      :data="table.data"
      :columns="table.column"
      :loading="table.loading"
      style="font-size: 12px; margin-top: 15px"
    >
      <template #slot-field="{ row, col }">
        {{ formatField(dict[col.colKey], 'label', row[col.colKey]) }}
      </template>
      <template #operator="{ row }">
        <t-space>
          <t-button theme="primary" size="small" variant="text" @click="onEdit(row)">编辑</t-button>
          <t-button theme="danger" size="small" variant="text" @click="onDelete(row.id)">删除</t-button>
          <t-dropdown
            trigger="click"
            :options="row.roleType === 'admin-role' ? [{ content: '分配用户', value: 'user' }] : [{ content: '分配用户', value: 'user' }, { content: roleMapper[row.roleType], value: row.roleType }]"
            @click="(data) => { onAuth(data, row, methodMapper[data.value]) }"
          >
            <t-button variant="text" theme="primary" size="small">
                  <span class="tdesign-demo-dropdown__text">
                    更多
                    <t-icon name="caret-down-small" />
                  </span>
            </t-button>
          </t-dropdown>
        </t-space>
      </template>
    </t-table>
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
    <t-dialog header="角色信息" placement="top" width="600px" preventScrollThrough destroyOnClose :visible.sync="dialog.role" @confirm="saveRole">
      <div slot="body">
        <t-row v-for="(item, index) in field" :key="index" align="center" style="margin-bottom: 15px">
          <t-col :span="2">
            <span>{{ item.name }}</span>
          </t-col>
          <t-col :span="10">
            <t-input v-if="item.type === 'input'" v-model.trim="roleInfo[item.value]" clearable style="width: 100%"></t-input>
            <t-select v-else-if="item.type === 'select'" v-model="roleInfo[item.value]" clearable filterable style="width: 100%">
              <t-option v-for="(item, index) in dict[item.value]" :key="index" :label="item.label" :value="item.value" />
            </t-select>
            <t-input-number v-else-if="item.type === 'number'" v-model="roleInfo[item.value]" min="0" :decimalPlaces=0 theme="column" style="width: 100%"></t-input-number>
            <t-textarea v-else-if="item.type === 'textarea'" v-model="roleInfo[item.value]" />
          </t-col>
        </t-row>
      </div>
    </t-dialog>
    <t-dialog v-if="dialog.user" preventScrollThrough destroyOnClose placement="center" width="950px" :header="title" :footer="false" :visible.sync="dialog.user">
      <user :userList.sync="user.list" :checkList="user.checkList" @save="saveUser"></user>
    </t-dialog>
    <t-dialog
      v-if="dialog.tree"
      preventScrollThrough destroyOnClose
      placement="center" width="50%"
      :header="title" :visible.sync="dialog.tree" @confirm="onTreeSave(roleType)">
      <t-input v-model="tree.filter" placeholder="请输入节点名称" @change="onFilter"></t-input>
      <t-tree
        v-model="tree.check"
        value-mode="all"
        hover
        expand-mutex
        active-multiple
        expand-on-click-node
        line
        checkable
        transition
        :check-strictly="false"
        :filter="tree.treeFilter"
        :data="tree.data"
        :lazy="false"
        :expand-level=1
        maxHeight="500"
        style="margin-top: 10px"
      >
      </t-tree>
    </t-dialog>
    <t-dialog
      v-if="dialog.common"
      preventScrollThrough destroyOnClose
      placement="center" width="80%"
      :header="title" :footer="false" :visible.sync="dialog.common"
    >
      <common
        :field="common.field"
        :value="common.value"
        :tableInfo.sync="common.table"
        :pagesInfo.sync="common.pages"
        :list.sync="common.checkList"
        @apply="onCommonApply" @confirm="onConfirm">
      </common>
    </t-dialog>
  </div>
</template>

<script>
import { formatField } from '@/utils/inops/formatUtils'
import User from '@/components/Selector/User'
import Common from '@/components/Selector/Common'
import { data2Tree } from '@/utils/inops/data2Tree'
import { getDictList, pageList } from '@/utils/inops/u'
import { roleMapper, methodMapper, dialogMapper, titleMapper, fieldValueMapper, columnMapper } from '@/components/Selector/mapper'
import { fieldList, valueList } from '@/dict/inops/fieldAndValue'
import { getUserListApi } from '@/api/system/user'
import { updateUsersAPI } from '@/api/inops/auth/auth'
import { getJobListAPI } from '@/api/inops/job/job'
import { getScheduleJobAPI } from '@/api/inops/scheduleJob/scheduleJob'
import { getTaskAPI } from '@/api/inops/inspect/inspectTask'
import { getListAPI } from '@/api/inops/inspect/inspectItem'
import { getRoleAPI, saveRoleAPI, delRoleAPI, getRoleByIdAPI, getUserByRoleIdAPI } from '@/api/inops/auth/role/roles'
import { getHostGroupListAPI, saveGroupsByRoleIdAPI, getGroupListByRoleIdAPI } from '@/api/inops/auth/hostGroup'
import { updateScriptAPI, getScriptsOfRoleAPI } from '@/api/inops/auth/jobAuth'
import { updateJobsAPI, getJobsByRoleIdAPI } from '@/api/inops/auth/taskAuth'
import { getInspectByRoleIdAPI, updateInspectAPI } from '@/api/inops/auth/inspectAuth'
import { getItemByRoleIdAPI, updateInspectItemOfRoleAPI } from '@/api/inops/auth/inspectItemAuth'
import { getApproveUserOfRoleAPI, updatApproveUserOfRoleAPI } from '@/api/inops/auth/approveAuth'

export default {
  name: 'role',
  data () {
    return {
      roleMapper,
      methodMapper,
      title: '', // 弹窗标题
      methodName: '', // 存储方法名
      roleType: '', // 权限类型
      height: 0, // screen height
      width: 0, // screen width
      dict: {
        roleType: []
      }, // 字典
      field: [
        { name: '角色名称', value: 'roleName', type: 'input' },
        { name: '角色类型', value: 'roleType', type: 'select' },
        { name: '角色编码', value: 'roleCode', type: 'input' },
        { name: '角色序号', value: 'sort', type: 'number' },
        { name: '角色描述', value: 'remarks', type: 'textarea' }
      ], // 角色信息字段
      condition: {
        roleName: '',
        roleType: ''
      }, // 查询条件
      roleInfo: {
        roleName: '',
        roleType: '',
        roleCode: '',
        sort: 10,
        remarks: ''
      }, // 角色信息
      table: {
        ref: 'tb_task',
        empty: '暂无数据',
        loading: false,
        height: '600',
        data: [],
        column: [
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'roleName', title: '角色名称', align: 'left', ellipsis: true, ellipsisTitle: true },
          { colKey: 'roleType', title: '角色类型', align: 'center', ellipsis: true, ellipsisTitle: true, cell: 'slot-field' },
          { colKey: 'roleCode', title: '角色编码', align: 'center', ellipsis: true, ellipsisTitle: true },
          { colKey: 'sort', title: '角色序号', align: 'center', ellipsis: true, ellipsisTitle: true },
          { colKey: 'remarks', title: '描述', align: 'center', ellipsis: true, ellipsisTitle: true },
          { colKey: 'operator', title: '操作', align: 'center', ellipsis: true, ellipsisTitle: true }
        ]
      }, // 角色表
      pages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 30,
        align: 'right'
      }, // 分页
      dialog: {
        role: false,
        user: false,
        tree: false,
        common: false
      }, // 弹窗
      user: {
        // 所有用户列表
        list: [],
        // 已授权用户列表
        checkList: []
      },
      roleId: '', // 角色ID
      tree: {
        data: [],
        check: [],
        filter: '', // 过滤
        treeFilter: null
      },
      inspectList: [],
      common: {
        table: {
          data: [],
          column: []
        },
        pages: {
          list: [30, 60, 90, 180, 300, 500, { label: '全部', value: '' }],
          total: 0,
          current: 1,
          size: 30
        },
        field: null,
        value: null,
        checkList: []
      }
    }
  },
  components: { User, Common },
  watch: {
    'dialog.role': {
      handler (newVal) {
        if (!newVal) {
          this.roleInfo = {
            roleName: '',
            roleType: '',
            roleCode: '',
            sort: 10,
            remarks: ''
          }
        }
      }
    },
    'dialog.user': {
      handler (newVal) {
        if (!newVal) {
          this.user.checkList = []
        }
      }
    },
    'dialog.common': {
      handler (newVal) {
        if (!newVal) {
          this.common.pages.current = 1
          this.common.pages.size = 30
        }
      }
    }
  },
  async mounted () {
    window.addEventListener('resize', () => {
      this.calsize()
    })
    this.table.loading = true
    this.calsize()
    await this.getDict()
    await this.getUserList()
    this.getRoleData()
  },
  methods: {
    formatField,
    /**
     * 获取屏幕大小
     */
    calsize () {
      this.height = window.screen.height
      this.width = window.screen.width
    },
    /**
     * 获取字典
     * @returns {Promise<void>}
     */
    async getDict () {
      const keys = Object.keys(this.dict)
      for (const item of keys) {
        this.dict[item] = await getDictList(item)
      }
    },
    /**
     * 获取所有角色信息
     */
    async getRoleData () {
      this.table.loading = true
      const params = {
        pageNum: this.pages.current,
        pageSize: this.pages.size
      }
      await getRoleAPI(params, this.condition).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.table.data = data.data.records
          this.pages.size = data.data.size
          this.pages.current = data.data.current
          this.pages.total = data.data.total
          const index = this.pages.list.findIndex(item => item.label === '全部')
          this.pages.list[index].value = data.data.total
          this.table.loading = false
        } else {
          this.$message.error({ content: '查询数据失败，请联系管理员', placement: 'center' })
          this.table.loading = false
        }
      })
    },
    /**
     * 根据角色ID获取角色信息
     * @param id 角色ID
     * @returns {Promise<void>}
     */
    async getRoleOfId (id) {
      await getRoleByIdAPI(id).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.roleInfo = data.data
        } else {
          this.$message.error({ content: '获取角色信息失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 更新角色
     */
    saveRole () {
      saveRoleAPI(this.roleInfo).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '更新成功', placement: 'center' })
          this.dialog.role = false
          this.table.loading = true
          this.getRoleData()
        } else {
          this.$message.error({ content: '更新失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 删除角色
     * @param id 角色ID
     */
    delRoleOfId (id) {
      delRoleAPI(id).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '删除角色成功', placement: 'center' })
          this.table.loading = true
          this.getRoleData()
        } else {
          this.$message.error({ content: '删除角色失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 角色查询
     */
    onSearch () {
      this.pages.current = 1
      this.getRoleData()
    },
    /**
     * 查询条件重置
     */
    onReset () {
      this.condition = {
        roleName: '',
        roleType: ''
      }
    },
    /**
     * 分页
     * @param currentPage 当前页
     * @param pageSize 当页页数大小
     */
    onPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.getRoleData()
    },
    /**
     * 编辑角色
     * @param row 当前行信息
     */
    onEdit (row) {
      this.getRoleOfId(row.id)
      this.dialog.role = true
    },
    /**
     * 删除角色
     * @param id 角色ID
     */
    onDelete (id) {
      this.$XModal.confirm('确定删除该数据吗？').then(type => {
        if (type === 'confirm') {
          this.delRoleOfId(id)
        }
      })
    },
    /**
     * 树保存
     */
    onTreeSave (type) {
      if (type === 'host-role') {
        this.saveHostGroupOfRole()
      } else if (type === 'inspect-item-role') {
        this.saveInspectItemOfRole()
      }
    },
    /**
     * 获取用户列表
     */
    getUserList () {
      getUserListApi().then(res => {
        const { data } = res
        if (data.code === 0) {
          this.user.list = []
          data.data.forEach(item => {
            if (item.delFlag === '0') {
              const obj = {
                label: item.userName,
                value: item.userId.toString()
              }
              this.user.list.push(obj)
            }
          })
        }
      })
    },
    /**
     * 根据角色获取用户
     * @returns {Promise<void>}
     */
    async getUserOfRole () {
      await getUserByRoleIdAPI(this.roleId).then(async res => {
        const { data } = res
        if (data.code === 200) {
          this.user.checkList = []
          await data.data.forEach(item => {
            this.user.checkList.push(item)
          })
        }
      })
    },
    /**
     * 角色授权用户
     */
    saveUser (value) {
      const data = {
        roleId: this.roleId,
        userIds: value
      }
      this[this.methodName.saveRole](data)
    },
    saveUserOfRole (data) {
      updateUsersAPI(data).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '保存成功', placement: 'center' })
          this.dialog.user = false
        } else {
          this.$message.error({ content: '保存失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 获取设备组
     */
    async getHostGroup () {
      await getHostGroupListAPI().then(res => {
        const { data } = res
        if (data.code === 200) {
          this.tree.data = data2Tree(data.data, 'groupName', 'treeType')
        }
      })
    },
    /**
     * 根据角色ID获取已授权设备组
     */
    async getHostGroupOfRole () {
      await getGroupListByRoleIdAPI(this.roleId).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.tree.check = []
          this.tree.check = data.data
        }
      })
    },
    saveHostGroupOfRole () {
      const data = {
        roleId: this.roleId,
        groupIds: this.tree.check
      }
      saveGroupsByRoleIdAPI(data).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '保存成功', placement: 'center' })
          this.dialog.tree = false
        } else {
          this.$message.error({ content: '保存失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 设备组过滤
     */
    onFilter () {
      if (this.tree.filter) {
        this.tree.treeFilter = (node) => {
          const rs = node.data.label.indexOf(this.tree.filter) >= 0
          return rs
        }
      } else {
        this.tree.treeFilter = null
      }
    },
    /**
     * 获取脚本
     */
    async getJob () {
      const params = { pageSize: this.common.pages.size, pageNum: this.common.pages.current }
      await getJobListAPI(params, this.common.value).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.common.table.data = data.data.records
          const { total, size, current } = data.data
          this.common.pages = Object.assign(this.common.pages, { total, size, current })
          this.common.pages.list[this.pages.list.length - 1].value = total
          this.common.table.loading = false
        }
      })
    },
    /**
     * 根据角色ID获取已授权脚本
     * @returns {Promise<void>}
     */
    async getJobOfRole () {
      await getScriptsOfRoleAPI(this.roleId).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.common.checkList = data.data
        }
      })
    },
    saveJobOfRole (value) {
      const scriptIds = []
      value.forEach(item => {
        scriptIds.push(item.id)
      })
      const data = {
        roleId: this.roleId,
        scriptIds
      }
      updateScriptAPI(data).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '保存成功', placement: 'center' })
          this.dialog.common = false
        } else {
          this.$message.error({ content: '保存失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 获取任务列表
     */
    async getTask () {
      const params = { pageSize: this.common.pages.size, pageNum: this.common.pages.current }
      getScheduleJobAPI(params, this.common.value).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.common.table.data = data.data.records
          const { total, size, current } = data.data
          this.common.pages = Object.assign(this.common.pages, { total, size, current })
          this.common.pages.list[this.pages.list.length - 1].value = total
          this.common.table.loading = false
        }
      })
    },
    /**
     * 根据角色ID获取已授权任务
     */
    async getTaskOfRole () {
      await getJobsByRoleIdAPI(this.roleId).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.common.checkList = data.data
        }
      })
    },
    saveTaskOfRole (value) {
      const jobIds = []
      value.forEach(item => {
        jobIds.push(item.id)
      })
      const data = {
        roleId: this.roleId,
        jobIds
      }
      updateJobsAPI(data).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '保存成功', placement: 'center' })
          this.dialog.common = false
        } else {
          this.$message.error({ content: '保存失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 获取巡检任务列表
     */
    async getInspect () {
      const params = { pageSize: this.common.pages.size, pageNum: this.common.pages.current }
      getTaskAPI(params, this.common.value).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.common.table.data = data.data.records
          const { total, size, current } = data.data
          this.common.pages = Object.assign(this.common.pages, { total, size, current })
          this.common.pages.list[this.pages.list.length - 1].value = total
          this.common.table.loading = false
        }
      })
    },
    /**
     * 根据角色ID获取已授权巡检任务
     */
    async getInspectOfRole () {
      await getInspectByRoleIdAPI(this.roleId).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.common.checkList = data.data
        }
      })
    },
    saveInspectOfRole (value) {
      const jobIds = []
      value.forEach(item => {
        jobIds.push(item.id)
      })
      const data = {
        roleId: this.roleId,
        jobIds
      }
      updateInspectAPI(data).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '保存成功', placement: 'center' })
          this.dialog.common = false
        } else {
          this.$message.error({ content: '保存失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 获取巡检项列表
     */
    async getInspectItem () {
      const data = {
        type: 'inspect'
      }
      await getListAPI(data).then(response => {
        const { data } = response
        if (data.code === 200) {
          this.inspectList = data.data
          this.tree.data = data2Tree(data.data, 'name', 'treeType')
        }
      })
    },
    /**
     * 根据角色ID获取已授权巡检项
     */
    async getInspectItemOfRole () {
      await getItemByRoleIdAPI(this.roleId).then(res => {
        const { data } = res
        if (data.code === 200) {
          data.data.forEach(item => {
            this.tree.check.push(item.id)
          })
        }
      })
    },
    saveInspectItemOfRole () {
      const parendsList = []
      this.tree.check.forEach(id => {
        const index = this.inspectList.findIndex(item => item.id === id)
        const list = this.inspectList[index].parentIds.split(',')
        list.forEach(v => {
          if (v !== '0') {
            parendsList.push(v)
          }
        })
      })
      const data = {
        roleId: this.roleId,
        itemIds: this.tree.check
      }
      updateInspectItemOfRoleAPI(data).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '保存成功', placement: 'center' })
          this.dialog.tree = false
        } else {
          this.$message.error({ content: '保存失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 根据角色ID获取审批用户
     * @returns {Promise<void>}
     */
    async getUserOfApprove () {
      await getApproveUserOfRoleAPI(this.roleId).then(async res => {
        const { data } = res
        if (data.code === 200) {
          this.user.checkList = []
          await data.data.forEach(item => {
            this.user.checkList.push(item)
          })
        }
      })
    },
    saveApproveUserOfRole (data) {
      updatApproveUserOfRoleAPI(data).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '保存成功', placement: 'center' })
          this.dialog.user = false
        } else {
          this.$message.error({ content: '保存失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 分配权限
     * @param data 权限映射（label：权限名称, value: 权限类型）
     * @param row 当前行信息
     * @param methodName 调用方法名称（动态调用）
     * @returns {Promise<void>}
     */
    async onAuth (data, row, methodName) {
      this.roleId = row.id
      const { value } = data
      this.roleType = value
      this.title = titleMapper[value]
      this.methodName = methodName
      if (dialogMapper[value] !== 'user') {
        if (dialogMapper[value] === 'common') {
          this.common.field = fieldList[fieldValueMapper[value]]
          this.common.value = valueList[fieldValueMapper[value]]
          this.common.table.column = columnMapper[value]
        }
        await this[methodName.getData]()
      }
      await this[methodName.getRole]()
      this.dialog[dialogMapper[value]] = true
    },
    /**
     * 组件查询、分页事件
     */
    onCommonApply (condition, current, size) {
      this.common.pages.current = current
      this.common.pages.size = size
      this.common.value = Object.assign(this.common.value, condition)
      this[this.methodName.getData]()
    },
    onConfirm (data) {
      this[this.methodName.saveRole](data)
    }
  }
}
</script>

<style lang="sass" scoped>
.text_font_size
  font-size: 12px
  color: #505968
/deep/ .t-textarea__inner
  resize: none
/deep/ .scrollbar-style::-webkit-scrollbar
  /*滚动条整体样式*/
  width : 6px !important /*高宽分别对应横竖滚动条的尺寸*/
/deep/ .scrollbar-style::-webkit-scrollbar-thumb
  /*滚动条里面小方块*/
  border-radius: 5px !important
  background: #027be3 !important
/deep/ .scrollbar-style::-webkit-scrollbar-track
  /*滚动条里面轨道*/
  border-radius: 50px !important
  background   : #ededed !important
</style>
