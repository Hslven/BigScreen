<template>
  <div class="bg-mod-card" style="padding: 15px">
    <t-form :data="condition" ref="form" @submit="onSubmit" @reset="onReset">
      <t-row>
        <t-col :span="3">
          <t-form-item labelAlign="left" label="巡检任务名称" name="jobName">
            <t-input v-model.trim="condition.jobName" clearable style="width: 200px"></t-input>
          </t-form-item>
        </t-col>
        <t-col :span="3">
          <t-form-item labelAlign="left" label="巡检类型" name="state">
            <t-select v-model="condition.runOnly" :options="[{ label: '手动执行', value: '1' }, { label: '自动（周期）执行', value: '0' }]" clearable filterable style="width: 200px"></t-select>
          </t-form-item>
        </t-col>
        <t-col :span="3">
          <t-space size="10px">
            <t-button theme="primary" type="submit">提交</t-button>
            <t-button theme="default" variant="base" type="reset">重置</t-button>
          </t-space>
        </t-col>
      </t-row>
    </t-form>
    <t-row style="margin-top: 15px;width: 90px;">
      <t-dropdown
        trigger="click"
        :options="[{ content: '手动执行', value: 'manual'}, { content: '巡检任务', value: 'auto' }]"
        minColumnWidth="78px"
        @click="(data) => { addOrEditEvent(data, '') }"
      >
        <t-button theme="primary">
              <span class="tdesign-demo-dropdown__text">
                <mod-icon name="add"></mod-icon>
                新建任务
              </span>
        </t-button>
      </t-dropdown>
    </t-row>
    <div style="margin-top: 15px">
      <t-table
        hover  selectOnRowClick multipleSort
        row-key="id"
        size="small"
        table-layout="fixed"
        cell-empty-content="-"
        max-height="600"
        :empty="table.empty"
        :data="table.infoData"
        :columns="table.column"
        :loading="table.loading"
        :selected-row-keys="table.select"
        :sort="table.sort"
        style="font-size: 12px"
        @sort-change="onSort"
      >
        <template #runOnly="{ row }">
          {{ formatExecuteType(row.runOnly) }}
        </template>
        <template #jobState="{ row }">
          {{ formatField(dict.jobSheduleState, 'label', row.jobState) }}
        </template>
        <template #jobExpression="{ row }">
          {{ formatExpression(row.jobExpression) }}
        </template>
        <template #ignoreErrors="{ row }">
          {{ formatIgnore(row.ignoreErrors) }}
        </template>
        <template #slot-user="{ row }">
          {{ formatField(dict.user, 'label', row.createBy) ? formatField(dict.user, 'label', row.createBy) : 'admin' }}
        </template>
        <template #authScope="{ row }">
          <span>{{ dict.roleList[row.authScope]? dict.roleList[row.authScope].text : '私有脚本' }}</span>
        </template>
        <template #operator="{ row }">
          <t-button variant="text" theme="primary" v-show="row.state === 'normal' || row.state === 'error'" :disabled="!row.jobExpression" @click="pauseTask(row.id)">暂停</t-button>
          <t-button variant="text" theme="primary" v-show="row.state === 'paused'" :disabled="!row.jobExpression" @click="resumeTask(row.id)">开启</t-button>
          <t-button variant="text" theme="primary" @click="executeTask(row.id, row.jobName)">执行</t-button>
          <t-button variant="text" theme="primary" @click="addOrEditEvent('auto', row.id)">编辑</t-button>
          <t-popconfirm theme="default" content="确认删除任务吗" @confirm="removeTask(row.id)">
            <t-button variant="text" theme="primary">删除</t-button>
          </t-popconfirm>
          <t-button variant="text" theme="primary" @click="showRole(row)">共享</t-button>
        </template>
      </t-table>
    </div>
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
  </div>
</template>

<script>
import { formatField, formatExecuteType, formatIgnore, formatExpression } from '@/utils/inops/formatUtils'
import { getDictList, pageList } from '@/utils/inops/u'
import { getTaskAPI, executeOnce, delTaskAPI, pauseTaskAPI, resumeTaskAPI } from '@/api/inops/inspect/inspectTask'
import { getUserListApi } from '@/api/system/user'
import { ownedRolesAPI, getRoleByInspectIdAPI, changeAuthScopeAPI } from '@/api/inops/auth/inspectAuth'
export default {
  name: 'list',
  data () {
    return {
      dict: {
        list: ['jobSheduleState'],
        user: [],
        userList: [],
        jobSheduleState: [],
        roleList: {
          role: {
            text: '角色共享'
          },
          public: {
            text: '公开脚本'
          }
        }
      },
      condition: {
        jobName: '',
        runOnly: '',
        type: 'inspect',
        orders: []
      },
      table: {
        ref: 'tbHost',
        empty: '',
        loading: false,
        sort: [],
        infoData: [],
        column: [
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'jobName', title: '巡检任务名称', align: 'left', width: '15%', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'runOnly', title: '执行方式', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'jobState', title: '执行状态', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'jobExpression', title: '执行周期', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'ignoreErrors', title: '忽略错误执行下一步骤', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'authScope', title: '脚本来源', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'createBy', title: '创建人', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true, cell: 'slot-user' },
          { colKey: 'createDate', title: '创建时间', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'operator', title: '操作', align: 'center', width: '280', fixed: 'right' }
        ]
      },
      pages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 30,
        align: 'right'
      },
      dialog: {
        role: false
      },
      inspectId: '',
      scopeOptions: [{ label: '私有', value: 'private' }, { label: '角色共享', value: 'role' }, { label: '公开', value: 'public' }], // 权限选项
      scope: '', // 权限范围
      // 所拥有角色展开面
      // 角色授权折叠面板
      collapse: {
        // 是否禁用（当权限范围为私有时禁用
        disable: false,
        item: [], // 角色项
        share: [], // 已配置角色项
        edit: [] // 已配置编辑项
      }
    }
  },
  async mounted () {
    this.table.loading = true
    await this.getDict()
    await this.getUserDict()
    await this.getOwnedRoles()
    this.getData()
  },
  methods: {
    /**
     * 格式化
     */
    formatField,
    /**
     * 执行状态字段格式化
     */
    formatExecuteType,
    /**
     * 是否忽略下一步字段格式化
     */
    formatIgnore,
    /**
     * 执行周期字段格式化
     */
    formatExpression,
    /**
     * 获取字典
     * @returns {Promise<void>}
     */
    async getDict () {
      for (const item of this.dict.list) {
        this.dict[item] = await getDictList(item)
      }
    },
    /**
     * 获取用户信息
     * @returns {Promise<void>}
     */
    async getUserDict () {
      await getUserListApi().then(response => {
        const { data } = response
        if (data.code === 0) {
          for (const item of data.data) {
            if (item.delFlag === '0') {
              this.dict.user.push({ label: item.nickName, value: item.userId.toString() })
              this.dict.userList.push(item)
            }
          }
        }
      })
    },
    /**
     * 获取巡检任务列表
     */
    getData () {
      this.table.loading = true
      const params = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      getTaskAPI(params, this.condition).then(response => {
        const { data } = response
        if (data.code === 200) {
          this.table.infoData = data.data.records
          const { total, size, current } = data.data
          this.pages = Object.assign(this.pages, { total, size, current })
          this.pages.list[this.pages.list.length - 1].value = total
          this.table.loading = false
        } else {
          this.$message.error({ content: '获取数据失败，请联系管理员', placement: 'center' })
          this.table.loading = false
        }
      })
    },
    /**
     * 获取当前用户所拥有角色
     * @returns {Promise<void>}
     */
    async getOwnedRoles () {
      await ownedRolesAPI().then(async res => {
        const { data } = res
        if (data.code === 200) {
          for (const item of data.data) {
            const userList = []
            await item.users.forEach(userId => {
              const index = this.dict.userList.findIndex(user => user.userId === Number(userId))
              if (index > -1) userList.push({ userName: this.dict.userList[index].userName })
            })
            this.collapse.item.push({
              id: item.id,
              name: item.roleName,
              user: userList
            })
          }
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 获取指定任务已分配角色
     * @param id 任务id
     * @returns {Promise<void>}
     */
    async getRolesByInspectId (id) {
      await getRoleByInspectIdAPI(id).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.collapse.share = []
          data.data.forEach(item => {
            this.collapse.share.push(item.id)
          })
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 修改任务角色
     */
    changeAuthScope () {
      const data = {
        id: this.inspectId,
        authScope: this.scope,
        roleIds: this.collapse.share
      }
      changeAuthScopeAPI(data).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '保存成功', placement: 'center' })
          this.getData()
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 查询
     */
    onSubmit () {
      this.pages.current = 1
      this.getData()
    },
    /**
     * 查询条件重置
     */
    onReset () {
      this.condition = {
        jobName: '',
        runOnly: ''
      }
    },
    onPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.getData()
    },
    /**
     * 新增 / 编辑任务
     * @param id
     */
    addOrEditEvent (data, id) {
      const { value } = data
      const url = value === 'manual' ? '/inops/inspect/manual' : '/inops/inspect/config'
      const params = {
        id: id || undefined
      }
      this.$router.push({
        path: url,
        query: id ? params : undefined
      })
    },
    /**
     * 执行任务
     * @param id 任务id
     * @param jobName 任务名称
     */
    executeTask (id, jobName) {
      executeOnce(id).then(response => {
        const { data } = response
        if (data.code === 200) {
          const obj = {
            taskId: data.data.taskId,
            backUrl: '/inops/inspect/list',
            name: jobName,
            type: 'inspect',
            isNew: true
          }
          this.$router.push({
            path: '/inops/util/execute',
            query: { obj }
          })
        } else {
          this.$message.error({ content: data.error, placement: 'center' })
        }
      })
    },
    /**
     * 删除任务
     * @param id 任务id
     */
    removeTask (id) {
      delTaskAPI(id).then(response => {
        const { data } = response
        if (data.code === 200) {
          this.$message.success({ content: '删除成功', placement: 'center' })
          this.getData()
        } else {
          this.$message.error({ content: '删除失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 暂停任务
     * @param id 任务id
     */
    pauseTask (id) {
      pauseTaskAPI(id).then(response => {
        const { data } = response
        if (data.code === 200) {
          this.$message.success({ content: '已暂停定时任务', placement: 'center' })
          this.getData()
        } else {
          this.$message.error({ content: '暂停任务失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 启动任务
     * @param id 任务id
     */
    resumeTask (id) {
      resumeTaskAPI(id).then(response => {
        const { data } = response
        if (data.code === 200) {
          this.$message.success({ content: '已开启定时任务', placement: 'center' })
          this.getData()
        } else {
          this.$message.error({ content: '启动任务失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 修改权限范围
     */
    onChange () {
      this.collapse.disable = this.scope !== 'role'
    },
    /**
     * 展示角色
     * @param row 当前行信息
     * @returns {Promise<void>}
     */
    async showRole (row) {
      this.inspectId = row.id
      this.scope = row.authScope === null ? 'role' : row.authScope
      this.collapse.share = []
      await this.getRolesByInspectId(row.id)
      this.dialog.role = true
    },
    /**
     * 触发保存角色
     */
    saveTaskAuthChange () {
      this.changeAuthScope()
      this.dialog.role = false
    },
    /**
     * 排序
     * @param val
     */
    onSort (val) {
      this.condition.orders = []
      this.table.sort = val
      val.forEach(item => {
        this.condition.orders.push({
          column: `a.${item.sortBy.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase()}`,
          asc: !item.descending
        })
      })
      this.getScheduleJob()
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-popup.t-popup__content.t-dropdown.t-dropdown__menu.t-dropdown__menu--right
  width: 110px
/deep/ .t-popup
  width: 110px
/deep/ .t-dropdown__item.t-dropdown__item--theme-default.t-dropdown__item
  width: 110px
</style>
