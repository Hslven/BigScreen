<template>
  <div style="padding: 15px">
    <t-row align="center">
      <div style="border: 1px solid #165DFF; height: 14px;"></div>
      <span style="margin-left: 10px">巡检项配置</span>
    </t-row>
    <t-button  style="margin-top: 25px;" @click="dialog.item = true">
      <t-row align="center">
        <mod-icon class="mr-2" name="add" style="color: #fff;"></mod-icon>
        <span style="color: #fff;">新增巡检项</span>
      </t-row>
    </t-button>
    <div style="margin-top: 15px">
      <t-table
        hover resizable selectOnRowClick bordered
        row-key="id"
        size="small"
        table-layout="fixed"
        cell-empty-content="-"
        max-height="600"
        :empty="table.empty"
        :data="table.data"
        :columns="table.column"
        :loading="table.loading"
        dragSort="row-handler"
        @drag-sort="onDragSort"
      >
        <template #operator="{ row }">
          <t-button class="mr-5" variant="text" theme="primary" @click="onShowJob(row.id)">查看脚本</t-button>
          <t-popconfirm theme="default" content="确认移除该巡检项吗吗" @confirm="remove(row)">
            <t-button variant="text" theme="danger">删除</t-button>
          </t-popconfirm>
        </template>
      </t-table>
    </div>
    <t-dialog
      v-if="dialog.item"
      preventScrollThrough destroyOnClose
      placement="center" width="50%"
      header="巡检项选择" :visible.sync="dialog.item" @confirm="onTreeSave()">
      <t-input v-model="tree.filter" placeholder="请输入节点名称" @change="onFilter"></t-input>
      <t-tree
        v-model="tree.check"
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
        maxHeight="450"
        style="margin-top: 10px"
      >
      </t-tree>
    </t-dialog>
    <t-drawer
      :visible.sync="dialog.code"
      placement="right"
      size="800px"
      header="脚本内容"
      :footer="false"
    >
      <div id="codeParent" style="height: 100%">
        <CodeInfo v-if="dialog.code" ref="codeInfo" :codeInfo.sync="codeInfo"></CodeInfo>
      </div>
    </t-drawer>
  </div>
</template>

<script>
import { data2Tree } from '@/utils/inops/data2Tree'
import { getListAPI, getListByIdAPI, getInspectSciptAPI } from '@/api/inops/inspect/inspectItem'
import CodeInfo from '@/components/Code/CodeInfo'
export default {
  name: 'InspectItem',
  components: { CodeInfo },
  props: {
    list: {
      type: Array,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      dialog: {
        item: false,
        code: false
      },
      table: {
        ref: 'itemInfo',
        empty: '无巡检项数据',
        loading: false,
        data: [],
        column: [
          { colKey: 'drag', title: '排序', cell: (h) => (<span><mod-icon name="adjust"></mod-icon></span>), width: 46 },
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'name', title: '巡检项名称', align: 'left', ellipsis: true, ellipsisTitle: true, sortType: 'all', width: 80 },
          { colKey: 'description', title: '巡检项描述', align: 'left', ellipsis: true, ellipsisTitle: true, sortType: 'all', width: 80 },
          { colKey: 'operator', title: '操作', width: '80', align: 'center', fixed: 'right' }
        ]
      }, // 表格
      tree: {
        data: [],
        check: [],
        filter: '', // 过滤
        treeFilter: null
      }, // 巡检项树
      codeInfo: {
        code: '',
        lang: ''
      }
    }
  },
  mounted () {
    this.initData()
    this.getInspectItem()
  },
  watch: {
    'table.data': {
      handler (newVal) {
        this.$emit('update:list', newVal)
      },
      deep: true
    }
  },
  methods: {
    async initData () {
      this.tree.check = []
      this.list.forEach(item => {
        this.tree.check.push(item.id)
      })
      await this.setItem()
    },
    /**
     * 巡检项过滤
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
    getInspectItem () {
      const data = {
        type: 'inspect'
      }
      getListAPI(data).then(response => {
        const { data } = response
        if (data.code === 200) {
          this.tree.data = data2Tree(data.data, 'name', 'treeType')
        }
      })
    },
    async setItem () {
      this.table.loading = true
      const list = []
      for (const item of this.tree.check) {
        await getListByIdAPI(item).then(response => {
          const { data } = response
          if (data.code === 200) {
            if (data.data.treeType === '1') {
              list.push(data.data)
            }
          }
        })
      }
      this.table.data = list
      this.table.loading = false
    },
    async getJobById (id) {
      await getInspectSciptAPI(id).then(response => {
        const { data } = response
        if (data.code === 200) {
          this.codeInfo.code = data.data.code
          this.codeInfo.lang = data.data.lang
        }
      })
    },
    /**
     * 巡检项确认选择
     * @returns {Promise<void>}
     */
    async onTreeSave () {
      this.dialog.item = false
      await this.setItem()
    },
    onDragSort (params) {
      this.table.data = params.newData
    },
    onSelectChange (value) {
      this.table.select = value
    },
    async onShowJob (id) {
      await this.getJobById(id)
      this.dialog.code = true
    },
    remove (row) {
      const index = this.table.data.findIndex(item => item.id === row.id)
      this.table.data.splice(index, 1)
      const index2 = this.tree.check.findIndex(item => item === row.id)
      this.jobList.splice(index2, 1)
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-drawer__body
  padding: 0px
</style>
