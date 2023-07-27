<template>
  <div class="bg-mod-card" style="padding: 15px">
    <div class="container">
      <div class="panel" v-for="(item, index) in panelInfo" :key="index" :style="{ 'border-top-color': item.color }" style="padding: 10px">
        <div style="padding: 5px; margin-right: 5px">
          <div style="width: 34px; height: 34px; border-radius: 50%; padding: 8px;" :style="{ 'background-color': item.bgIcon }">
            <svg-icon :color="item.color" :name="item.icon"></svg-icon>
          </div>
        </div>
        <div class="truncate">
          <div style="color: rgba(128, 128, 128, 1); font-size: 12px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">{{ item.name }}</div>
          <div style="font-size: 20px; color: rgba(0, 0, 0, 1)">{{ item.count }}</div>
        </div>
      </div>
    </div>
    <div style="margin-top: 26px">
      <t-row align="center">
        <span class="mr-5">脚本类型</span>
        <t-radio-group v-model="condition.type" default-value="" @change="typeChange">
          <t-radio-button v-for="(item, index) in dict.typeList" :key="index" :value="item.value">{{ item.label }}</t-radio-button>
        </t-radio-group>
      </t-row>
      <t-row style="margin-top: 26px">
        <t-col class="mb-5" :md="3" :sm="4" :xs="6" v-for="(item, index) in field" :key="index">
          <t-row align="center">
            <span class="mr-5">{{ item.name }}</span>
            <t-input v-if="item.type === 'input'" v-model.trim="condition[item.value]" clearable style="width: 70%"></t-input>
            <t-select v-else-if="item.type === 'select'" v-model="condition[item.value]" :options="dict[item.value]" clearable filterable style="width: 70%"></t-select>
          </t-row>
        </t-col>
      </t-row>
      <t-row justify="end" style="margin-top: 10px;">
        <t-button class="mr-5" theme="primary" @click="onApply">查询</t-button>
        <t-button theme="default" @click="onReset">重置</t-button>
      </t-row>
      <t-row style="margin-top: 10px">
        <t-dropdown
          trigger="click"
          maxColumnWidth="200"
          :options="[{ content: '服务器Python脚本', value: 'action_script' },
          { content: '数通Python脚本', value: 'forward_online_script' },
          { content: 'Playbook脚本', value: 'playbook' },
          { content: 'Shell脚本', value: 'shell_script' }]"
          @click="add"
        >
          <t-button theme="primary">
            <span class="tdesign-demo-dropdown__text">
              新增脚本<mod-icon name="expand_more"></mod-icon>
            </span>
          </t-button>
        </t-dropdown>
      </t-row>
    </div>
    <div style="margin-top: 15px">
      <t-table
        hover resizable multipleSort
        row-key="id"
        size="small"
        table-layout="fixed"
        cell-empty-content="-"
        :max-height="`${height * 0.4}`"
        :empty="table.empty"
        :data="table.data"
        :columns="table.column"
        :loading="table.loading"
        :sort="table.sort"
        style="font-size: 12px"
        @sort-change="onSort"
      >
        <template #slot-field="{ row, col }">
          {{ formatField(dict.scriptType, 'label', row[col.colKey]) ? formatField(dict.scriptType, 'label', row[col.colKey]) : 'admin' }}
        </template>
        <template #slot-user="{ row, col }">
          {{ formatField(dict.user, 'label', row[col.colKey]) }}
        </template>
        <template #authScope="{ row }">
          <span>{{ dict.roleList[row.authScope]? dict.roleList[row.authScope].text : '私有脚本' }}</span>
        </template>
        <template #operator="{ row }">
          <t-space>
            <t-button variant="text" theme="primary" @click="edit(row)">编辑</t-button>
            <t-button variant="text" theme="primary" @click="showRole(row)">共享</t-button>
            <t-button variant="text" theme="primary" @click="del(row)">删除</t-button>
          </t-space>
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
        @change="handPages"
      />
    </div>
    <t-dialog header="角色授权" placement="center" width="800px" preventScrollThrough v-if="roleDialog" :visible.sync="roleDialog" @confirm="saveScriptAuthChange">
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
                <input type="checkbox" v-model="collapse.edit" :value="item.id" style="color: #165DFF">编辑
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
import { formatField } from '@/utils/inops/formatUtils'
import { pageList } from '@/utils/inops/u'
import { getDictAPI } from '@/api/inops/dict'
import { getUserListApi } from '@/api/system/user'
import { getCountOfJobAPI, getJobListAPI, delJobAPI } from '@/api/inops/job/job'
import { ownedRolesAPI, getRolesOfJobAPI, changeAuthScopeAPI } from '@/api/inops/auth/jobAuth'
import ModIcon from '@/ui/ModIcon/ModIcon'
export default {
  name: 'test',
  components: { ModIcon },
  data () {
    return {
      height: 0, // 获取屏幕高度
      panelInfo: [
        {
          id: 'all',
          name: '总脚本数',
          icon: 'code',
          bgIcon: 'rgba(178, 207, 255, 0.19)',
          color: 'rgba(22, 93, 255, 1)',
          count: 0
        },
        {
          id: 'action_script',
          name: '服务器python脚本',
          icon: 'python',
          bgIcon: 'rgba(255, 240, 217, 1)',
          color: 'rgba(254, 168, 38, 1)',
          count: 0
        },
        {
          id: 'forward_online_script',
          name: '数通python脚本',
          icon: 'python',
          bgIcon: 'rgba(245, 239, 255, 1)',
          color: 'rgba(132, 84, 199, 1)',
          count: 0
        },
        {
          id: 'playbook',
          name: 'Ansible脚本',
          icon: 'ansible',
          bgIcon: 'rgba(240, 119, 161, 0.2)',
          color: 'rgba(245, 49, 157, 1)',
          count: 0
        },
        {
          id: 'shell_script',
          name: 'Shell脚本',
          icon: 'shell',
          bgIcon: 'rgba(223, 255, 246, 1)',
          color: 'rgba(43, 164, 113, 1)',
          count: 0
        }
      ], // 脚本面板
      dict: {
        typeList: [{ label: '所有脚本', value: '' },
          { label: '服务器Python脚本', value: 'action_script' },
          { label: '数通Python脚本', value: 'forward_online_script' },
          { label: 'Playbook脚本', value: 'playbook' },
          { label: 'Shell脚本', value: 'shell_script' }],
        lang: [{ label: 'yaml', value: 'yaml' }, { label: 'shell', value: 'shell' }, { label: 'python', value: 'python' }],
        scriptType: [],
        user: [],
        userList: [],
        roleList: {
          role: {
            text: '角色共享'
          },
          public: {
            text: '公开脚本'
          }
        }
      }, // 字典
      field: [
        { name: '脚本名称', type: 'input', value: 'name' },
        { name: '脚本语言', type: 'select', value: 'lang' },
        { name: '脚本语言', type: 'select', value: 'lang' },
        { name: '脚本语言', type: 'select', value: 'lang' }
      ], // 查询字段
      condition: {
        type: '',
        name: '',
        lang: '',
        createBy: '',
        orders: []
      }, // 查询条件对象
      table: {
        ref: 'scriptInfo',
        empty: '暂无脚本数据',
        loading: false,
        sort: [],
        data: [],
        column: [
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'name', title: '脚本名称', align: 'left', ellipsis: true, ellipsisTitle: true },
          { colKey: 'type', title: '脚本类型', align: 'left', ellipsis: true, ellipsisTitle: true, cell: 'slot-field' },
          { colKey: 'lang', title: '脚本语言', align: 'center', ellipsis: true, ellipsisTitle: true },
          { colKey: 'version', title: '版本', align: 'center', ellipsis: true, ellipsisTitle: true },
          { colKey: 'description', title: '脚本描述', align: 'left', ellipsis: true, ellipsisTitle: true },
          { colKey: 'authScope', title: '脚本来源', align: 'center', ellipsis: true, ellipsisTitle: true },
          { colKey: 'createBy', title: '创建人', align: 'left', ellipsis: true, ellipsisTitle: true, cell: 'slot-user' },
          { colKey: 'createDate', title: '创建时间', align: 'center', ellipsis: true, ellipsisTitle: true },
          { colKey: 'updateDate', title: '更新时间', align: 'center', ellipsis: true, ellipsisTitle: true },
          { colKey: 'operator', title: '操作', width: 180, align: 'center', fixed: 'right' }
        ]
      }, // 表格
      pages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 30,
        align: 'right'
      }, // 分页
      scopeOptions: [{ label: '私有', value: 'private' }, { label: '角色共享', value: 'role' }, { label: '公开', value: 'public' }], // 权限选项
      scope: '', // 权限范围
      // 所拥有角色展开面板
      collapse: {
        // 是否禁用（当权限范围为私有时禁用
        disable: false,
        item: [], // 角色项
        share: [], // 已配置角色项
        edit: [] // 已配置编辑项
      },
      roleDialog: false, // 角色弹窗
      scriptId: '' // 脚本id
    }
  },
  async mounted () {
    window.addEventListener('resize', () => {
      this.calsize()
    })
    this.table.loading = true
    this.calsize()
    await this.getDict()
    await this.getUserDict()
    await this.getOwnedRoles()
    this.getCountOfJob()
    this.getJobList()
  },
  methods: {
    /**
     * 表格字段格式化
     */
    formatField,
    /**
     * 屏幕高度获取
     */
    calsize () {
      this.height = window.screen.height
    },
    /**
     * 获取字典
     * @returns {Promise<void>}
     */
    async getDict () {
      await getDictAPI('script_type').then(response => {
        const { data } = response
        if (data.code === 200) {
          for (const value of data.data) {
            this.dict.scriptType.push(value)
          }
        }
      })
    },
    /**
     * 获取用户字典
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
     * 获取脚本数量
     */
    getCountOfJob () {
      getCountOfJobAPI().then(response => {
        const { data } = response
        if (data.code === 200) {
          let count = 0
          data.data.forEach(item => {
            const index = this.panelInfo.findIndex(v => v.id === item.type)
            if (index !== -1) {
              this.panelInfo[index].count = item.count
              count += item.count
            }
          })
          this.panelInfo[0].count = count
        }
      })
    },
    /**
     * 获取脚本列表
     */
    getJobList () {
      this.table.loading = true
      const param = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      getJobListAPI(param, this.condition).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.table.data = data.data.records
          const { total, size, current } = data.data
          this.pages = Object.assign(this.pages, { total, size, current })
          this.pages.list[this.pages.list.length - 1].value = this.pages.total
          this.table.loading = false
        } else {
          this.$message.error({ content: '数据获取失败', placement: 'center' })
          this.table.loading = false
        }
      })
    },
    /**
     * 获取用户所拥有角色
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
     * 获取脚本所配置角色
     * @param scriptId
     * @returns {Promise<void>}
     */
    async getRolesOfJob (scriptId) {
      await getRolesOfJobAPI(scriptId).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.collapse.share = []
          data.data.forEach(item => {
            this.collapse.share.push(item.id)
          })
        }
      })
    },
    /**
     * 修改脚本权限
     */
    changeAuthScope () {
      const data = {
        id: this.scriptId,
        authScope: this.scope,
        roleIds: this.collapse.share,
        editableRoleIds: this.collapse.edit
      }
      changeAuthScopeAPI(data).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '保存成功', placement: 'center' })
          this.getJobList()
        }
      })
    },
    /**
     * 切换脚本类型触发
     */
    typeChange () {
      this.getJobList()
    },
    /**
     * 查询
     */
    onApply () {
      this.pages.current = 1
      this.getJobList()
    },
    /**
     * 重置
     */
    onReset () {
      const { name, lang, createBy } = ''
      this.condition = Object.assign(this.condition, { name, lang, createBy })
    },
    /**
     * 分页
     * @param current
     * @param pageSize
     */
    handPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.getJobList()
    },
    /**
     * 新增脚本
     * @param data 脚本类型对象
     */
    add (data) {
      const { value } = data
      this.$router.push({
        // path: '/inops/script/jobIndex',
        path: '/inops-test/job/jobIndex',
        query: {
          type: value
        }
      })
    },
    /**
     * 编辑脚本
     * @param row 当前行信息
     */
    edit (row) {
      const obj = {
        id: row.id,
        isNew: true,
        type: row.type
      }
      this.$router.push({
        // path: '/inops/script/jobIndex',
        path: '/inops-test/job/jobIndex',
        query: obj
      })
    },
    /**
     * 删除脚本
     * @param row 当前行信息
     */
    del (row) {
      this.$XModal.confirm('您确定要删除选中的数据吗?').then(type => {
        if (type === 'confirm') {
          delJobAPI(row.id).then(response => {
            const { data } = response
            if (data.code === 200) {
              this.$message.success({ content: '删除脚本成功', placement: 'center' })
              this.getScriptList()
            } else {
              this.$message.success({ content: '删除脚本失败，请联系系统管理员', placement: 'center' })
            }
          })
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
     * 展示脚本角色
     * @param row
     * @returns {Promise<void>}
     */
    async showRole (row) {
      this.scriptId = row.id
      this.scope = row.authScope === null ? 'role' : row.authScope
      this.collapse.share = []
      await this.getRolesOfJob(row.id)
      this.roleDialog = true
    },
    /**
     * 角色保存事件
     */
    saveScriptAuthChange () {
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
      this.getJobList()
    }
  }
}
</script>

<style lang="sass" scoped>
.container
  width: 100%
  max-width: 1620px
  display: flex
  flex-wrap: wrap
.panel
  height: 87px
  border: 1px solid #eeeeee
  border-top: 6px solid
  box-sizing: border-box
  border-radius: 5px
  display: flex
  margin-right: 20px
  //flex: 0 0 calc((100% - 80px) / 5)
  width: calc((100% - 80px) / 5)
.panel:nth-child(5n)
  margin-right: 0px
/deep/ .t-divider
  margin: 8px 0px 0px 0px
</style>
