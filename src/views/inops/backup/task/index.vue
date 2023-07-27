<template>
  <div class="bg-mod-card" style="padding: 15px">
    <div>
      <t-form :data="condition" ref="form" @submit="onApply" @reset="onReset">
        <t-row>
          <t-col :span="3" v-for="(item, index) in field" :key="index">
            <t-form-item labelAlign="left" :label="item.name" :name="item.value">
              <t-input v-if="item.type === 'input'" v-model.trim="condition[item.value]" clearable style="width: 200px"></t-input>
              <t-select v-else-if="item.type === 'select'" v-model="condition[item.value]" :options="dict[item.options]" clearable filterable style="width: 200px"></t-select>
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
      <t-divider style="margin-top: 15px"></t-divider>
      <t-row class="mt-5">
        <t-button theme="primary" @click="onEdit('')">
          <t-row align="center">
            <mod-icon name="add" style="color: #ffffff"></mod-icon>
            <span style="color: #ffffff">新增设备</span>
          </t-row>
        </t-button>
      </t-row>
    </div>
    <div style="margin-top: 15px">
      <t-table
        hover resizable selectOnRowClick multipleSort
        row-key="id"
        size="small"
        table-layout="fixed"
        cell-empty-content="-"
        max-height="600"
        :empty="table.empty"
        :data="table.data"
        :columns="table.column"
        :loading="table.loading"
        :sort="table.sort"
        style="font-size: 12px"
        @sort-change="onSort"
      >
        <template #backupType="{ row }">
          {{ formatField(dict.backupType, 'label', row.backupType) }}
        </template>
        <template #runOnly="{ row }">
          {{ formatExecuteType(row.runOnly) }}
        </template>
        <template #state="{ row }">
          {{ formatField(dict.jobSheduleState, 'label', row.state) ? formatField(dict.jobSheduleState, 'label', row.state) : '-' }}
        </template>
        <template #scheduleExpr="{ row }">
          {{ formatExpression(row.scheduleExpr) }}
        </template>
        <template #slot-user="{ row }">
          {{ formatField(dict.user, 'label', row.createBy) ? formatField(dict.user, 'label', row.createBy) : 'admin' }}
        </template>
        <template #isNewRecord="{ row }">
          <t-row justify="center">
            <span class="mr-2" :style="{ color: `${row.isNewRecord ? '#F5319D' : '#2BA471'}`}">{{ row.isNewRecord ? '否' : '是' }}</span>
            <span v-show="row.isNewRecord" style="text-decoration: underline; cursor: pointer; color: #165DFF" @click="onToUpdate(row.id)">去更新<mod-icon class="primary" name="chevron_right"/></span>
          </t-row>
        </template>
        <template #retentionTime="{ row }">
          <span>{{ row.retentionTime }}天</span>
        </template>
        <template #nextTime="{ row }">
          <span>{{ row.scheduleExpr | cronFilter }}</span>
        </template>
        <template #operator="{ row }">
          <t-button variant="text" theme="primary" v-show="row.state === 'normal' || row.state === 'error'" :disabled="!row.scheduleExpr" @click="onPause(row.id)">暂停</t-button>
          <t-button variant="text" theme="primary" v-show="row.state === 'paused'" :disabled="!row.scheduleExpr" @click="onStart(row.id)">开启</t-button>
          <t-button variant="text" theme="primary" @click="onExecute(row.id, row.jobName)">执行</t-button>
          <t-button variant="text" theme="primary" @click="onEdit(row.id)">编辑</t-button>
          <t-popconfirm theme="default" content="确认删除任务吗" @confirm="onDel(row.id)">
            <t-button variant="text" theme="primary">删除</t-button>
          </t-popconfirm>
          <t-button variant="text" theme="primary" @click="onAuthority(row)">共享</t-button>
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
    <t-dialog header="脚本更新" placement="center" width="90%" preventScrollThrough v-if="dialog.diff" :visible.sync="dialog.diff" confirmBtn="更新" @confirm="updateTask(diffJob.id)">
      <t-row>脚本名称：{{ diffJob.name }}</t-row>
      <t-row align="center">
        <t-col :span="6">
          <t-row justify="start">脚本版本(<i>version</i> {{ diffJob.version }})</t-row>
        </t-col>
        <t-col :span="6">
          <t-row justify="end">脚本版本(<i>version</i> {{ diffJob.newVersion }})</t-row>
        </t-col>
      </t-row>
      <diff :newValue = content.new :oldValue = content.old :lang = content.lang></diff>
    </t-dialog>
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
import diff from '@/components/ContentDiff/diff'
import { getDictList } from '@/utils/inops/u'
import { formatTime } from '@/utils/inops/dateUtils'
import { listPageAPI, delJobAPI, pauseAPI, resumeAPI, executeOnceAPI, getUpdateableJobAPI, getTasksOfIdAPI, updateTaskScriptAPI } from '@/api/inops/netBackup/backupTask'
import { getUserListApi } from '@/api/system/user'
import { getRolesOfTaskAPI, ownedRolesAPI, changeAuthScopeAPI } from '@/api/inops/auth/backupAuth'
import { getJobByIdAPI } from '@/api/inops/job/job'
import { transToQuarts } from '@/utils/inops/transExpression'

export default {
  name: 'index',
  components: { diff },
  data () {
    return {
      // 字典
      dict: {
        list: ['backupType'],
        user: [],
        userList: [],
        roleList: {
          role: {
            text: '角色共享'
          },
          public: {
            text: '公开脚本'
          }
        },
        jobSheduleState: [{ label: '正常', value: 'normal' }, { label: '停止', value: 'paused' }],
        backupType: []
      },
      // 查询字段
      field: [
        {
          name: '任务名称',
          value: 'jobName',
          type: 'input'
        },
        {
          name: '任务状态',
          value: 'state',
          type: 'select',
          options: 'jobSheduleState'
        },
        {
          name: '备份类型',
          value: 'backupType',
          type: 'select',
          options: 'backupType'
        }
      ],
      // 查询字段对象
      condition: {
        jobName: '', // 任务名称
        status: '', // 任务状态
        backupType: '', // 备份类型
        orders: [] // 排序
      },
      // 表格
      table: {
        ref: 'backupInfo',
        empty: '暂无备份任务数据',
        loading: false,
        sort: [],
        data: [],
        column: [
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'jobName', title: '任务名称', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'runOnly', title: '执行方式', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'backupType', title: '备份类型', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'state', title: '任务状态', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'scheduleExpr', title: '执行周期', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'nextTime', title: '下一次执行时间', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'isNewRecord', title: '脚本是否最新', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'retentionTime', title: '文件保留时长', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'createDate', title: '创建时间', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'updateDate', title: '修改时间', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'createBy', title: '创建人', align: 'center', resizable: true, ellipsis: true, ellipsisTitle: true, cell: 'slot-user' },
          { colKey: 'operator', title: '操作', align: 'center', width: '350', fixed: 'right' }
        ]
      },
      // 分页
      pages: {
        list: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      // 对比内容
      content: {
        new: '', // 新内容
        old: '', // 就内容
        lang: '' // 脚本语言
      },
      // 弹窗
      dialog: {
        list: false,
        diff: false, // 对比内容
        role: false // 权限
      },
      taskId: '', // 任务ID
      jobInfo: null, // 脚本信息
      diffJob: {
        id: '',
        name: '',
        version: '',
        newVersion: ''
      },
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
  filters: {
    cronFilter (value) {
      if (value.split(' ').length === 7) {
        const valueList = value.split(' ')
        const datetime = Date.parse(new Date())
        const timeStamp = Date.parse(`${valueList[6]}-${valueList[4]}-${valueList[3]} ${valueList[2]}:${valueList[1]}:${valueList[0]}`)
        if (datetime > timeStamp) {
          return '当前时间已超过配置时间'
        } else {
          return transToQuarts(value).date
        }
      } else {
        const parse = require('cron-parser')
        const dateTime = parse.parseExpression(value).next()._date.ts
        return formatTime(dateTime)
      }
    }
  },
  async mounted () {
    this.table.loading = true
    await this.getDict()
    await this.getUserDict()
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
     * 字典查询
     * @returns {Promise<void>}
     */
    async getDict () {
      for (const item of this.dict.list) {
        this.dict[item] = await getDictList(item)
      }
    },
    /**
     * 获取用户列表
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
     * @param taskId 任务id
     * @returns {Promise<void>}
     */
    async getRolesByJobId (taskId) {
      await getRolesOfTaskAPI(taskId).then(res => {
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
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 根绝任务id获取任务脚本数据
     * @param id 任务id
     * @returns {Promise<void>}
     */
    async getJobOfId (id) {
      await getTasksOfIdAPI(id).then(async res => {
        const { data } = res
        if (data.code === 200) {
          this.jobInfo = {}
          await data.data.forEach(item => {
            const obj = {
              id: item.id,
              name: item.scriptName,
              version: item.scriptVersion,
              type: item.scriptType,
              lang: item.scriptLang,
              base64Code: item.scriptBase64Code,
              code: item.scriptCode,
              createDate: item.createDate
            }
            this.getNewJobOfId(item.scriptId).then(data => {
              this.$set(obj, 'newVersion', data.version)
              this.$set(obj, 'newCode', data.code)
            })
            this.jobInfo = Object.assign({}, obj)
          })
          this.showDiff(this.jobInfo)
        } else {
          this.$message.error({ content: '脚本信息获取失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 根据脚本id获取当前脚本
     * @param id 脚本id
     * @returns {Promise<T>}
     */
    async getNewJobOfId (id) {
      return new Promise(resolve => {
        getJobByIdAPI(id).then(res => {
          const { data } = res
          if (data.code === 200) {
            const obj = {
              code: data.data.code,
              version: data.data.version
            }
            resolve(obj)
          }
        })
      }).then(data => {
        return data
      })
    },
    /**
     * 更新任务脚本
     * @param id id
     */
    updateTask (id) {
      const data = {
        taskId: id
      }
      updateTaskScriptAPI(data).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '脚本更新成功', placement: 'center' })
          this.dialog.diff = false
          this.dialog.list = false
          this.getData()
          this.getJobOfId(this.taskId)
        } else {
          this.$message.error({ content: '更新失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 获取备份任务数据列表
     * @returns {Promise<void>}
     */
    async getData () {
      this.table.loading = true
      const params = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      await listPageAPI(params, this.condition).then(async res => {
        const { data } = res
        if (data.code === 200) {
          const ids = []
          let diffids = []
          await data.data.records.forEach(item => {
            ids.push(item.id)
          })
          await this.getIsNew(ids).then(data => {
            diffids = data
          })
          await data.data.records.forEach(item => {
            if (diffids.includes(item.id)) {
              this.$set(item, 'isNewRecord', true)
            } else {
              this.$set(item, 'isNewRecord', false)
            }
          })
          this.table.data = data.data.records
          const { total, size, current } = data.data
          this.pages = Object.assign(this.pages, { total, size, current })
          this.pages.list[this.pages.list.length - 1].value = total
          this.table.loading = false
        } else {
          this.$message.error({ content: '获取备份任务列表失败，请联系管理员', placement: 'center' })
          this.table.loading = false
        }
      })
    },
    /**
     * 判断当前任务脚本是否为最新
     * @param data
     * @returns {Promise<T>}
     */
    getIsNew (data) {
      return new Promise((resolve) => {
        getUpdateableJobAPI(data).then(res => {
          const { data } = res
          if (data.code === 200) {
            resolve(data.data)
          } else {
            this.$message.error({ content: '获取数据失败，请联系管理员', placement: 'center' })
          }
        })
      }).then(data => {
        return data
      })
    },
    /**
     * 提交查询
     */
    onApply () {
      this.pages.current = 1
      this.getData()
    },
    /**
     * 查询重置
     */
    onReset () {
      this.condition = {
        jobName: '',
        status: '',
        backupType: ''
      }
      this.pages.current = 1
    },
    /**
     * 分页
     * @param current 当前页
     * @param pageSize 页码大小
     */
    onPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.getData()
    },
    /**
     * 执行
     * @param id 任务id
     * @param jobName 作业名称
     */
    onExecute (id, jobName) {
      executeOnceAPI(id).then(res => {
        const { data } = res
        if (data.code === 200) {
          const obj = {
            taskId: data.data.taskId,
            backUrl: '/inops/backup/task',
            name: jobName,
            type: 'backup',
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
     * 暂停任务
     * @param id 任务id
     */
    onPause (id) {
      pauseAPI(id).then(response => {
        const { data } = response
        if (data.code === 200) {
          this.$message.success({ content: '任务已暂停', placement: 'center' })
          this.getData()
        } else {
          this.$message.error({ content: '任务暂停失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 开启任务
     * @param id 任务id
     */
    onStart (id) {
      resumeAPI(id).then(response => {
        const { data } = response
        if (data.code === 200) {
          this.$message.success({ content: '任务已开启', placement: 'center' })
          this.getData()
        } else {
          this.$message.error({ content: '任务开启失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 编辑任务
     * @param id 任务id
     */
    onEdit (id) {
      const param = { id }
      this.$router.push({
        path: '/inops/backup/config',
        query: id ? param : undefined
      })
    },
    /**
     * 删除任务
     * @param id 任务id
     */
    onDel (id) {
      delJobAPI(id).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '任务删除成功', placement: 'center' })
          this.getData()
        } else {
          this.$message.error({ content: '任务删除失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 展示角色
     * @param row 当前行信息
     * @returns {Promise<void>}
     */
    async onAuthority (row) {
      this.taskId = row.id
      this.scope = row.authScope === null ? 'role' : row.authScope
      this.collapse.share = []
      await this.getRolesByJobId(row.id)
      this.dialog.role = true
    },
    /**
     * 当前任务执行记录
     * @param row 当前行
     */
    onRecords (row) {
      this.$router.push({
        path: '/inops/backup/list',
        query: {
          id: row.id
        }
      })
    },
    /**
     * 更新脚本事件
     * @param id
     */
    onToUpdate (id) {
      this.taskId = id
      this.getJobOfId(id)
    },
    /**
     * 展示不通脚本数据
     * @param data
     */
    showDiff (data) {
      this.diffJob = data
      this.content.new = data.newCode
      this.content.old = data.code
      this.content.lang = data.lang
      this.dialog.diff = true
    },
    /**
     * 修改权限范围
     */
    onChange () {
      this.collapse.disable = this.scope !== 'role'
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
      this.getData()
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-divider
  margin: 8px 0px 0px 0px
</style>
