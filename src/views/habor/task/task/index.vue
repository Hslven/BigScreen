<template>
  <div class="bg-mod-card" style="padding: 15px">
    <t-form :data="condition" ref="form" @submit="submitEvent" @reset="resetEvent">
      <t-row>
        <t-col :span="3">
          <t-form-item labelAlign="left" label="任务名称" name="jobName">
            <t-input v-model.trim="condition.jobName" clearable style="width: 200px"></t-input>
          </t-form-item>
        </t-col>
        <t-col :span="3">
          <t-form-item labelAlign="left" label="任务状态" name="state">
            <t-select v-model="condition.state" :options="dict.jobSheduleState" clearable filterable style="width: 200px"></t-select>
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
    <t-row style="margin-top: 15px;">
      <t-button theme="primary" @click="addOrEditEvent('')">
        <t-row align="center">
          <mod-icon name="add" style="color: #ffffff; margin-right: 2px"></mod-icon>
          <span style="color: #ffffff">新建任务</span>
        </t-row>
      </t-button>
    </t-row>
    <div style="margin-top: 15px">
      <t-table
        hover resizable selectOnRowClick multipleSort
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
        <template #state="{ row }">
          {{ formatField(dict.jobSheduleState, 'label', row.state) }}
        </template>
        <template #scheduleExpr="{ row }">
          {{ formatExpression(row.scheduleExpr) }}
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
          <t-button variant="text" theme="primary" v-show="row.state === 'normal' || row.state === 'error'" :disabled="!row.scheduleExpr" @click="pauseTask(row.id)">暂停</t-button>
          <t-button variant="text" theme="primary" v-show="row.state === 'paused'" :disabled="!row.scheduleExpr" @click="resumeTask(row.id)">开启</t-button>
          <t-button variant="text" theme="primary" @click="executeTask(row.id, row.jobName)">执行</t-button>
          <t-button variant="text" theme="primary" @click="addOrEditEvent(row.id)">编辑</t-button>
          <t-popconfirm theme="default" content="确认删除任务吗" @confirm="delTask(row.id)">
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
    <t-dialog header="角色授权" placement="center" width="800px" preventScrollThrough v-if="dialog.role" :visible.sync="dialog.role" @confirm="saveTaskAuthChange">
      <t-row>
        <t-col :span="2">授权范围</t-col>
        <t-col :span="10">
          <t-space size="15px">
            <t-radio-group name="scope" v-model="scope" :options="scopeOptions" @change="onChange()"></t-radio-group>
          </t-space>
        </t-col>
      </t-row>
      <div class="mt-5">
        <t-collapse expand-mutex :disabled="collapse.disable">
          <t-collapse-panel v-for="(item) in collapse.item" :key="item.id" :header="item.name">
            <template #headerRightContent>
              <t-space align="center">
                <input type="checkbox" v-model="collapse.share" :value="item.id" style="color: #165DFF">使用
              </t-space>
            </template>
            <t-row align="center" :gutter="[0, 15]">
              <t-col :span="4" v-for="(user, index) in item.user" :key="index">
                <t-row align="center">
                  <mod-icon class="mr-3" name="person_outline"></mod-icon>
                  <span>{{ user.userName }}</span>
                </t-row>
              </t-col>
            </t-row>
          </t-collapse-panel>
        </t-collapse>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import { formatField, formatExecuteType, formatIgnore, formatExpression } from '@/utils/inops/formatUtils'
import { getDictList, pageList } from '@/utils/inops/u'
import { getScheduleJobAPI, delTaskAPI, pauseTaskAPI, resumeTaskAPI, executeOnceAPI } from '@/api/monitor/monitorJob'
import { getUserListApi } from '@/api/system/user'
import { getRolesByJobIdAPI, ownedRolesAPI, changeAuthScopeAPI } from '@/api/inops/auth/taskAuth'
export default {
  name: 'index',
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
      }, // 字典
      // 查询条件
      condition: {
        jobName: '', // 任务名称
        state: '', // 任务状态
        orders: [] // 表格排序
      },
      // 表格
      table: {
        ref: 'tbHost',
        empty: '',
        loading: false,
        sort: [],
        infoData: [],
        column: [
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'jobName', title: '任务名称', align: 'left', width: '15%', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'runOnly', title: '执行方式', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'state', title: '执行状态', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'scheduleExpr', title: '执行周期', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'ignoreErrors', title: '忽略错误执行下一步骤', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'authScope', title: '脚本来源', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'createBy', title: '创建人', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true, cell: 'slot-user' },
          { colKey: 'createDate', title: '创建时间', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'operator', title: '操作', align: 'center', width: '400', fixed: 'right' }
        ]
      },
      // 分页
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
      taskId: '', // 任务id
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
    await this.getDict()
    await this.getUserDict()
    await this.getOwnedRoles()
    await this.getScheduleJob()
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
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 获取综合任务列表
     */
    getScheduleJob () {
      this.table.loading = true
      const params = {
        pageNum: this.pages.current,
        pageSize: this.pages.size
      }
      getScheduleJobAPI(params, this.condition).then(res => {
        const { data } = res
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
        }
      })
    },
    /**
     * 获取指定任务已分配角色
     * @param taskId 任务id
     * @returns {Promise<void>}
     */
    async getRolesByJobId (taskId) {
      await getRolesByJobIdAPI(taskId).then(res => {
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
        id: this.taskId,
        authScope: this.scope,
        roleIds: this.collapse.share
      }
      changeAuthScopeAPI(data).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '保存成功', placement: 'center' })
          this.getScheduleJob()
        } else {
          this.$message.error({ content: '保存数据失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 查询
     */
    submitEvent () {
      this.getScheduleJob()
    },
    /**
     * 查询条件重置
     */
    resetEvent () {
      this.condition.jobName = ''
      this.condition.state = ''
    },
    /**
     * 分页
     * @param current 当前页
     * @param pageSize 页大小
     */
    onPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.getScheduleJob()
    },
    /**
     * 新增 / 编辑任务
     * @param id
     */
    addOrEditEvent (id) {
      const params = {
        id: id || undefined
      }
      this.$router.push({
        path: '/monitor/monitorTask/taskConfig',
        query: id ? params : undefined
      })
    },
    /**
     * 删除任务
     * @param id 任务id
     */
    delTask (id) {
      delTaskAPI(id).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '删除成功', placement: 'center' })
          this.getScheduleJob()
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
          this.getScheduleJob()
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
          this.getScheduleJob()
        } else {
          this.$message.error({ content: '启动任务失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 执行任务
     * @param id 任务id
     * @param jobName 任务名称
     */
    executeTask (id, jobName) {
      executeOnceAPI(id).then(res => {
        const { data } = res
        if (data.code === 200) {
          const obj = {
            taskId: data.data.taskId,
            backUrl: '/monitor/monitorTask/taskView',
            name: jobName,
            type: 'schedule',
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
      this.taskId = row.id
      this.scope = row.authScope === null ? 'role' : row.authScope
      this.collapse.share = []
      await this.getRolesByJobId(row.id)
      this.dialog.role = true
    },
    /**
     * 触发保存角色
     */
    saveTaskAuthChange () {
      this.changeAuthScope()
      this.roleDialog = false
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
/deep/ .q-field__control
  height: 32px !important
/deep/ .q-field__marginal
  height: 32px !important
/deep/ .q-field--auto-height.q-field--dense .q-field__control
  min-height: 32px !important
/deep/ .q-field--auto-height.q-field--dense .q-field__native
  min-height: 32px !important
.execute_result
  width: 1440px
  max-width: 80vw
  min-height: 72vh
  max-height: 85vh
/deep/ .q-card__section--vert
  padding: 5px
.status_point_normal
  display: inline-block
  width: 8px
  height: 8px
  border-radius: 50%
  margin-right: 10px
  background-color: #66bb6a
  box-shadow: 0px 0px 6px 1.5px #66bb6a
.status_point_error
  display: inline-block
  width: 8px
  height: 8px
  border-radius: 50%
  margin-right: 10px
  background-color: #ef5350
  box-shadow: 0px 0px 6px 1.5px #ef5350
.status_point_complete
  display: inline-block
  width: 8px
  height: 8px
  border-radius: 50%
  margin-right: 10px
  background-color: #1976D2
  box-shadow: 0px 0px 6px 1.5px #1976D2
.status_point_pause
  display: inline-block
  width: 8px
  height: 8px
  border-radius: 50%
  margin-right: 10px
  background-color: #757575
  box-shadow: 0px 0px 6px 1.5px #757575
</style>
