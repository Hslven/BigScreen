<template>
  <div class="bg-mod-card" style="padding: 15px;" :style="{ height: `${height}px` }">
    <t-row>
      <t-col :span="5" style="padding: 15px">
        <t-input v-model="tree.filter" placeholder="请输入节点名称" clearable @change="onFilter"></t-input>
        <t-tree
          class="scrollbar-style"
          hover activable expand-mutex line transition
          :filter="tree.treeFilter"
          :data="tree.data"
          :maxHeight="height * 0.8"
          :expand-level="2"
          style="margin-top: 10px; overflow-y: scroll; padding-right: 15px"
          @click="onSelect"
        >
          <template #label="{ node }">
            <t-row>
              <mod-icon v-if="node.data.isRoot" size="xs" name="o_folder"></mod-icon>
              <div class="ml-2">{{ node.label }}</div>
            </t-row>
          </template>
          <template #operations="{ node }">
            <t-row align="center">
              <t-button class="mr-2" v-if="node.data.isRoot" size="small" variant="text" theme="primary" @click="onAdd(node)">添加子节点</t-button>
              <t-button class="mr-2" size="small" variant="text" theme="primary" @click="onEdit(node)">编辑节点</t-button>
              <t-popconfirm theme="default" content="确认删除该设备组吗" @confirm="onRemove(node.value)">
                <t-button size="small" variant="text" theme="danger">删除</t-button>
              </t-popconfirm>
            </t-row>
          </template>
        </t-tree>
      </t-col>
      <t-col :span="7" style="padding: 15px">
        <div style="width: 100%; background-color: #EDF2FE; height: 32px; padding: 3px 15px; border-radius: 5px;">
          <span class="align-middle" style="color: #165DFF">点击子节点查看配置设备信息</span>
        </div>
        <t-row class="mt-5">
          <t-form label-align="left" :data="condition" ref="form" @submit="onApply">
            <t-row>
              <t-col class="mb-3" :span="6">
                <t-form-item label="设备名称" name="hostName" style="width: 80%">
                  <t-input v-model.trim="condition.hostName" clearable style="width: 100%"></t-input>
                </t-form-item>
              </t-col>
              <t-col class="mb-3" :span="6">
                <t-form-item label="管理IP" name="osIp" style="width: 80%">
                  <t-input v-model.trim="condition.osIp" clearable style="width: 100%"></t-input>
                </t-form-item>
              </t-col>
              <t-col class="mb-3" :span="6">
                <t-form-item label="硬管IP" name="bmcIp" style="width: 80%">
                  <t-input v-model.trim="condition.bmcIp" clearable style="width: 100%"></t-input>
                </t-form-item>
              </t-col>
              <t-col class="mb-3" :span="6">
                <t-row style="width: 80%">
                  <t-button class="mr-5" theme="primary" type="submit">提交</t-button>
                </t-row>
              </t-col>
            </t-row>
          </t-form>
        </t-row>
        <t-row align="center">
          <t-button class="mr-3" theme="primary" @click="onShowHost">新增设备</t-button>
          <t-popconfirm theme="default" content="确认移除选择设备吗" @confirm="removeHostEvent()">
            <t-button theme="danger">移除设备</t-button>
          </t-popconfirm>
        </t-row>
        <div style="margin-top: 15px">
          <t-table
            hover resizable selectOnRowClick multipleSort
            row-key="id"
            size="small"
            table-layout="fixed"
            cell-empty-content="-"
            :max-height="`${height * 0.6}`"
            :empty="table.empty"
            :data="table.data"
            :columns="table.column"
            :loading="table.loading"
            :selected-row-keys="table.select"
            :sort="table.sort"
            @sort-change="onSort"
            @select-change="onSelectChange"
          >
            <template #slot-field="{ row, col }">
              {{ formatField(dict[col.colKey], 'label', row[col.colKey]) }}
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
      </t-col>
    </t-row>
    <t-dialog header="设备组配置" placement="center" width="800px" preventScrollThrough v-if="dialog.tree" :visible.sync="dialog.tree" :footer="false">
      <t-form :data="info" ref="addForm" @submit="onSave" style="padding: 15px">
        <t-form-item labelAlign="left" label="节点类型" name="treeType">
          <t-radio-group v-model="info.treeType" :disabled="info.isEdit">
            <t-radio-button value="0">目录</t-radio-button>
            <t-radio-button value="1">节点</t-radio-button>
          </t-radio-group>
        </t-form-item>
        <t-form-item labelAlign="left" label="父节点" name="parentName">
          <t-tag theme="primary" variant="light" @click="changeParent" style="cursor: pointer">{{ info.parentName }}</t-tag>
        </t-form-item>
        <t-form-item labelAlign="left" label="名称" name="name">
          <t-input v-model.trim="info.groupName" clearable style="width: 500px;"></t-input>
        </t-form-item>
        <t-form-item labelAlign="left" label="序号" name="treeSort">
          <t-input-number v-model="info.treeSort" min="0" :decimalPlaces=0 theme="column" style="width: 500px"></t-input-number>
        </t-form-item>
        <t-form-item labelAlign="left" label="描述" name="detail">
          <t-input v-model.trim="info.description" clearable style="width: 500px;"></t-input>
        </t-form-item>
        <t-form-item labelAlign="left">
          <t-button theme="primary" type="submit">保存</t-button>
        </t-form-item>
      </t-form>
    </t-dialog>
    <t-dialog header="父节点选择" placement="center" width="500px" preventScrollThrough v-if="dialog.parentTree" :visible.sync="dialog.parentTree" @confirm="onTreeSave()">
      <t-input v-model="parentTree.filter" placeholder="请输入节点名称" @change="onParentFilter"></t-input>
      <t-tree
        class="scrollbar-style"
        hover activable expand-mutex line transition
        :filter="parentTree.treeFilter"
        :data="parentTree.data"
        :maxHeight="height * 0.8"
        :expand-level="2"
        style="margin-top: 10px; overflow-y: scroll; padding-right: 15px"
        @click="onParentSelect"
      >
        <template #label="{ node }">
          <t-row>
            <mod-icon v-if="node.data.isRoot" size="xs" name="o_folder"></mod-icon>
            <div class="ml-2">{{ node.label }}</div>
          </t-row>
        </template>
      </t-tree>
    </t-dialog>
    <t-dialog t-if="dialog.host" header="设备选择" placement="center" width="90%" preventScrollThrough  :visible.sync="dialog.host" :footer="false">
      <Host :hostList.sync="hosts" @hostCheck="hostCompCtl"></Host>
    </t-dialog>
  </div>
</template>

<script>
import { formatField } from '@/utils/inops/formatUtils'
import { data2Tree } from '@/utils/inops/data2Tree'
import { getHostGroupListAPI, saveHostGroupAPI, delHostGroupAPI, getHostGroupByIDAPI, getHostListPageAPI, addHostsToHostGroupAPI, removeHostsToHostGroupAPI } from '@/api/inops/auth/hostGroup'
import { pageList, getDictList } from '@/utils/inops/u'
import Host from '@/components/Selector/Host'
export default {
  name: 'host',
  data () {
    return {
      dict: {
        resourcePool: [],
        hostRoom: [],
        hostType: [],
        hostMfgr: [],
        hostSource: [],
        sysArea: [],
        major: []
      }, // 字典
      // dataFile: null, // 文件
      // fileData: new FormData(),
      // fileData: [], // 文件
      // fileLoading: false,
      height: 0,
      hostGroup: [], // 设备组原数据
      // 树
      tree: {
        check: '', // 树节点id
        data: [], // 树数据
        filter: '', // 过滤
        treeFilter: null // 过滤后数据
      },
      // 父节点组
      parentTree: {
        check: '', // 树节点id
        data: [], // 树数据
        filter: '', // 过滤
        treeFilter: null // 过滤后数据
      },
      info: {
        isEdit: false,
        id: '',
        treeType: '0',
        parentId: '',
        parentIds: '',
        parentName: '',
        groupName: '',
        treeSort: 10,
        description: ''
      },
      dialog: {
        tree: false,
        parentTree: false,
        host: false
      },
      hosts: [],
      condition: {
        hostName: '',
        bmcIp: '',
        osIp: '',
        orders: [],
        condition: {
          hostName: 'like',
          bmcIp: 'like',
          osIp: 'like'
        }
      },
      table: {
        ref: 'tbHost',
        empty: '无设备数据',
        loading: false,
        sort: [],
        select: [],
        data: [],
        column: [
          { colKey: 'row-select', title: '选择', type: 'multiple', width: 50 },
          { colKey: 'serial-number', title: '序号', width: 60, align: 'center' },
          { colKey: 'hostName', title: '设备名称', align: 'left', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', width: 80 },
          { colKey: 'osIp', title: '管理IP', align: 'left', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', width: 80 },
          { colKey: 'bmcIp', title: '硬管IP', align: 'left', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', width: 80 },
          { colKey: 'projectPeriod', title: '工程期数', align: 'center', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', width: 80 },
          { colKey: 'resourcePool', title: '资源池', align: 'left', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', cell: 'slot-field', width: 80 },
          { colKey: 'hostRoom', title: '所属机房', align: 'left', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', cell: 'slot-field', width: 80 },
          { colKey: 'sysArea', title: '归属', align: 'left', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', cell: 'slot-field', width: 80 },
          { colKey: 'hostMfgr', title: '所属厂家', align: 'center', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', cell: 'slot-field', width: 80 },
          { colKey: 'hostType', title: '设备类型', align: 'center', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', cell: 'slot-field', width: 80 },
          { colKey: 'hostModel', title: '设备型号', align: 'center', ellipsis: true, ellipsisTitle: true, sorter: true, sortType: 'all', width: 80 }
        ]
      }, // 表格
      pages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 30,
        align: 'right'
      } // 分页
    }
  },
  components: { Host },
  mounted () {
    window.addEventListener('resize', () => {
      this.height = window.screen.height * 0.75
    })
    this.height = window.screen.height * 0.75
    this.getDict()
    this.getHostGroup()
  },
  methods: {
    formatField,
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
    onParentFilter () {
      if (this.parentTree.filter) {
        this.parentTree.treeFilter = (node) => {
          const rs = node.data.label.indexOf(this.parentTree.filter) >= 0
          return rs
        }
      } else {
        this.parentTree.treeFilter = null
      }
    },
    onSelect ({ node }) {
      this.tree.check = ''
      this.pages = {
        list: pageList,
        total: 0,
        current: 1,
        size: 30
      }
      this.table.data = []
      if (!node.data.isRoot) {
        this.tree.check = node.value
        this.getHostByGroup()
      }
    },
    /**
     * 父节点选择事件
     * @param node 树节点
     */
    onParentSelect ({ node }) {
      this.info.parentId = node.value
    },
    getHostGroup () {
      getHostGroupListAPI().then(res => {
        const { data } = res
        if (data.code === 200) {
          this.hostGroup = data.data
          this.tree.data = data2Tree(data.data, 'groupName', 'treeType')
          this.parentTree.data = data2Tree(data.data, 'groupName', 'treeType', true)
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
    },
    getHostByGroup () {
      if (this.tree.check) {
        const data = {
          groupId: this.tree.check,
          pageNum: this.pages.current,
          pageSize: this.pages.size,
          ...this.condition
        }
        this.table.loading = true
        getHostListPageAPI(data).then(res => {
          const { data } = res
          if (data.code === 200) {
            this.table.data = data.data.records
            this.pages.current = data.data.current
            this.pages.size = data.data.size
            this.pages.total = data.data.total
            this.pages.list[this.pages.list.length - 1].value = Math.floor(this.pages.total)
            this.table.loading = false
          } else {
            this.$message.error({ content: '获取设备数据失败，请联系管理员', placement: 'center' })
            this.table.loading = false
          }
        })
      }
    },
    onApply () {
      this.getHostByGroup()
    },
    /**
     * 新增树节点
     * @param node 节点
     */
    onAdd (node) {
      this.info = {
        isEdit: false,
        id: '',
        treeType: '0',
        parentId: '',
        parentIds: '',
        parentName: '',
        groupName: '',
        treeSort: 10,
        description: ''
      }
      this.info.parentId = node.value
      this.info.parentName = node.data.label
      this.dialog.tree = true
    },
    /**
     * 编辑树节点
     * @param node 树节点
     */
    onEdit (node) {
      getHostGroupByIDAPI(node.value).then(res => {
        const { data } = res
        if (data.code === 200) {
          const { id, treeType, parentId, parentIds, groupName, treeSort, description } = data.data
          this.info = Object.assign(this.info, { id, treeType, parentId, parentIds, groupName, treeSort, description })
          const index = this.hostGroup.findIndex(item => item.id === id)
          this.info.parentName = this.hostGroup[index].groupName
          this.info.isEdit = true
          this.dialog.tree = true
        } else {
          this.$message.error({ content: '获取节点数据失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 删除设备组
     * @param id 设备组id
     */
    onRemove (id) {
      delHostGroupAPI(id).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '删除成功', placement: 'center' })
          this.tree.selected = ''
          this.getHostGroup()
        } else {
          this.$message.error({ content: '删除失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 设备组新增、编辑保存
     */
    onSave () {
      saveHostGroupAPI(this.info).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '保存成功', placement: 'center' })
          this.getHostGroup()
          this.dialog.tree = false
        } else {
          this.$message.error({ content: '保存失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 更改父节点
     */
    onTreeSave () {
      if (this.info.parentId) {
        const index = this.hostGroup.findIndex(item => item.id === this.info.parentId)
        this.info.parentName = this.hostGroup[index].groupName
        this.dialog.parentTree = false
      } else {
        this.$message.error({ content: '未选择父级节点', placement: 'center' })
      }
    },
    /**
     * 打开父节点弹窗
     */
    changeParent () {
      this.dialog.parentTree = true
    },
    /**
     * 表格排序
     * @param sortList
     */
    onSort (val) {
      this.table.sort = val
      val.forEach(item => {
        this.condition.orders.push({
          column: `a.${item.sortBy.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toLowerCase()}`,
          asc: !item.descending
        })
      })
      this.getListPage()
    },
    onSelectChange (value) {
      this.table.select = value
    },
    /**
     * 分页
     * @param current  当前页
     * @param pageSize 页码大小
     */
    handPages ({ current, pageSize }) {
      this.pages.current = current
      this.pages.size = pageSize
      this.getHostByGroup()
    },
    onShowHost () {
      this.hosts = []
      this.dialog.host = true
    },
    hostCompCtl (data) {
      if (data.length === 0) {
        this.$message.warning({ content: '暂未选择设备', placement: 'center' })
        this.dialog.host = false
      } else {
        const addHostList = []
        data.forEach(d => {
          addHostList.push(d.id)
        })
        const addHostData = {
          groupId: this.tree.check,
          hostIds: addHostList
        }
        addHostsToHostGroupAPI(addHostData).then(response => {
          const { data } = response
          if (data.code === 200) {
            this.$message.success({ content: '添加设备成功', placement: 'center' })
            this.getHostByGroup()
          } else {
            this.$message.error({ content: '添加设备失败，请联系管理员', placement: 'center' })
          }
          this.dialog.host = false
        })
      }
    },
    removeHostEvent () {
      if (this.table.select.length) {
        const data = {
          groupId: this.tree.check,
          hostIds: this.table.select
        }
        removeHostsToHostGroupAPI(data).then(response => {
          const resData = response.data
          if (resData.code === 200) {
            this.$message.success({ content: '移除设备成功', placement: 'center' })
            this.getHostByGroup()
          } else {
            this.$message.error({ content: '移除设备失败，请联系管理员', placement: 'center' })
          }
        })
      } else {
        this.$message.warning({ content: '请至少选择一条数据', placement: 'center' })
      }
    }
  }
}
</script>

<style lang="sass" scoped>
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
/deep/ .t-dialog__body
  max-height: 850px !important
</style>
