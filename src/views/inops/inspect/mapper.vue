<template>
  <div class="bg-mod-card" style="padding: 15px;" :style="{ height: `${height}px` }">
    <t-row>
      <t-col :span="5" style="padding: 15px">
        <t-input v-model="inspectTree.filter" placeholder="请输入节点名称" clearable @change="onFilter"></t-input>
        <t-tree
          class="scrollbar-style"
          hover activable expand-mutex line transition
          :filter="inspectTree.treeFilter"
          :data="inspectTree.data"
          :maxHeight="height * 0.8"
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
              <t-button class="mr-2" v-if="!node.data.isRoot" size="small" variant="text" theme="primary" @click="showJobInfo(node, node.value)">查看脚本</t-button>
              <t-popconfirm theme="default" content="确认删除巡检项吗" @confirm="onRemove(node.value)">
                <t-button size="small" variant="text" theme="danger">删除</t-button>
              </t-popconfirm>
            </t-row>
          </template>
        </t-tree>
      </t-col>
      <t-col :span="7" style="padding: 15px">
        <div style="width: 100%; background-color: #EDF2FE; height: 32px; padding: 3px 15px; border-radius: 5px;">
          <span class="align-middle" style="color: #165DFF">点击节点查看配置信息</span>
        </div>
        <div v-show="edit.isLeaf" style="margin-top: 10px">
          <t-form :data="edit" ref="editForm" @submit="onEditSave">
            <t-form-item labelAlign="left" label="节点类型" name="treeType">
              <t-tag :theme="edit.treeType === '0' ? 'primary' : 'success'" variant="light">{{ edit.treeType === '0' ? '目录' : '节点'}}</t-tag>
            </t-form-item>
            <t-form-item labelAlign="left" label="名称" name="name">
              <t-input v-model.trim="edit.name" clearable style="width: 500px;"></t-input>
            </t-form-item>
            <t-form-item labelAlign="left" label="序号" name="treeSort">
              <t-input-number v-model="edit.treeSort" min="0" :decimalPlaces=0 theme="column" style="width: 500px"></t-input-number>
            </t-form-item>
            <t-form-item v-show="edit.treeType === '1'" labelAlign="left" label="脚本" name="jobName">
              <t-row align="center">
                <span class="mr-5" style="color: #AAAEB7;">{{ edit.script.name ? edit.script.name : '暂未选择脚本' }}</span>
                <t-button theme="primary" variant="outline" @click="dialog.job = true">选择脚本</t-button>
              </t-row>
            </t-form-item>
            <t-form-item labelAlign="left" label="执行方式" name="name">
              <t-radio-group v-model="edit.delegateToLocal">
                <t-radio-button value="0">远端执行</t-radio-button>
                <t-radio-button value="1">节点执行</t-radio-button>
              </t-radio-group>
            </t-form-item>
            <t-form-item labelAlign="left" label="描述" name="detail">
              <t-input v-model.trim="edit.description" clearable style="width: 500px;"></t-input>
            </t-form-item>
            <t-form-item labelAlign="left">
              <t-button theme="primary" type="submit">保存</t-button>
            </t-form-item>
          </t-form>
        </div>
      </t-col>
    </t-row>
    <t-drawer
      v-if="dialog.code"
      class="scrollbar-style"
      :visible.sync="dialog.code"
      placement="right"
      size="850px"
      header="脚本内容"
      destroyOnClose
    >
      <div id="codeParent" style="height: 100%">
        <CodeInfo ref="codeInfo" :codeInfo.sync="codeInfo"></CodeInfo>
      </div>
      <template #footer>
        <t-row justify="end">
          <t-button variant="base" theme="default" @click="dialog.code = false">关闭</t-button>
        </t-row>
      </template>
    </t-drawer>
    <t-dialog header="巡检信息配置" placement="center" width="800px" preventScrollThrough v-if="dialog.tree" :visible.sync="dialog.tree" :footer="false">
      <t-form :data="add" ref="addForm" @submit="onAddSave" style="padding: 15px">
        <t-form-item labelAlign="left" label="节点类型" name="treeType">
          <t-radio-group v-model="add.treeType">
            <t-radio-button value="0">目录</t-radio-button>
            <t-radio-button value="1">节点</t-radio-button>
          </t-radio-group>
        </t-form-item>
        <t-form-item labelAlign="left" label="父节点" name="parentName">
          <t-tag theme="primary" variant="light">{{ add.parentName }}</t-tag>
        </t-form-item>
        <t-form-item labelAlign="left" label="名称" name="name">
          <t-input v-model.trim="add.name" clearable style="width: 500px;"></t-input>
        </t-form-item>
        <t-form-item labelAlign="left" label="序号" name="treeSort">
          <t-input-number v-model="add.treeSort" min="0" :decimalPlaces=0 theme="column" style="width: 500px"></t-input-number>
        </t-form-item>
        <t-form-item v-show="add.treeType === '1'" labelAlign="left" label="脚本" name="jobName">
          <t-row align="center">
            <span class="mr-5" style="color: #AAAEB7;">{{ add.script.name ? add.script.name : '暂未选择脚本' }}</span>
            <t-button theme="primary" variant="outline" @click="dialog.job = true">选择脚本</t-button>
          </t-row>
        </t-form-item>
        <t-form-item labelAlign="left" label="执行方式" name="name">
          <t-radio-group v-model="add.delegateToLocal">
            <t-radio-button value="0">远端执行</t-radio-button>
            <t-radio-button value="1">节点执行</t-radio-button>
          </t-radio-group>
        </t-form-item>
        <t-form-item labelAlign="left" label="描述" name="detail">
          <t-input v-model.trim="add.description" clearable style="width: 500px;"></t-input>
        </t-form-item>
        <t-form-item labelAlign="left">
          <t-button theme="primary" type="submit">保存</t-button>
        </t-form-item>
      </t-form>
    </t-dialog>
    <t-dialog header="选择脚本" placement="center" width="90%" preventScrollThrough v-if="dialog.job" :visible.sync="dialog.job" :footer="false">
      <job :jobList.sync="jobList" @jobCheck="jobCheck"></job>
    </t-dialog>
  </div>
</template>

<script>
import { data2Tree } from '@/utils/inops/data2Tree'
import { getListAPI, saveItemAPI, removeItemAPI, getListByIdAPI, getInspectSciptAPI } from '@/api/inops/inspect/inspectItem'
import Job from '@/components/Selector/Job'
import CodeInfo from '@/components/Code/CodeInfo'

export default {
  name: 'mapper',
  components: { Job, CodeInfo },
  data () {
    return {
      height: 0,
      // 巡检项树
      inspectTree: {
        check: '', // 树节点id
        data: [], // 树数据
        filter: '', // 过滤
        treeFilter: null // 过滤后数据
      },
      jobList: [], // 已选脚本列表
      edit: {
        isLeaf: false, // 是否叶子节点  是  展示编辑界面  否  不展示
        treeType: '', // 节点类型
        type: 'inspect', // 树类型  inspect 巡检
        parentId: '', // 父节点ID
        name: '', // 节点名称
        treeSort: '', // 树排序
        delegateToLocal: '0', // 巡检项执行方式  0远端   1节点
        // bmcExecute: true,
        description: '', // 节点描述
        // 节点对应脚本
        script: {
          id: '', // 脚本id
          name: '' // 脚本名称
        }
      },
      add: {
        treeType: '0', // 节点类型  0表示目录  1表示节点
        type: 'inspect', // 树类型  inspect巡检
        parentId: '', // 父节点ID
        parentName: '', // 父节点名称
        name: '', // 节点名称
        treeSort: '10', // 树排序
        delegateToLocal: '0', // 巡检项执行方式  0远端   1节点
        // bmcExecute: true,
        description: '', // 节点描述
        // 节点对应脚本
        script: {
          id: null, // 脚本id
          name: '' // 脚本名称
        }
      },
      dialog: {
        tree: false,
        code: false,
        job: false
      },
      codeInfo: { // 脚本信息
        name: '', // 脚本名称
        code: '', // 代码
        lang: '' // 语言
      }
    }
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.height = window.screen.height * 0.75
    })
    this.height = window.screen.height * 0.75
    this.getItem()
  },
  methods: {
    getItem () {
      const data = {
        type: 'inspect'
      }
      getListAPI(data).then(response => {
        const { data } = response
        if (data.code === 200) {
          this.inspectTree.data = data2Tree(data.data, 'name', 'treeType')
        } else {
          this.$message.error({ content: '获取数据失败，请联系管理员 ', placement: 'center' })
        }
      })
    },
    /**
     * 获取脚本
     * @param id 脚本id
     */
    getJobById (id) {
      getInspectSciptAPI(id).then(response => {
        const { data } = response
        if (data.code === 200) {
          if (data.data) {
            const { name, code, lang } = data.data
            this.codeInfo = Object.assign(this.codeInfo, { name, code, lang })
            this.dialog.code = true
          }
        } else {
          this.$message.error({ content: '获取数据失败，请联系管理员', placement: 'center' })
        }
      })
    },
    getItemInfo () {
      getListByIdAPI(this.inspectTree.check).then(response => {
        const { data } = response
        if (data.code === 200) {
          Object.assign(this.edit, data.data)
          if (data.data.script === null) this.edit.script = { id: '', name: '' }
        }
      })
    },
    saveItem (type, data) {
      saveItemAPI(data).then(response => {
        const { data } = response
        if (data.code === 200) {
          this.$message.success({ content: '保存成功', placement: 'center' })
          this.getItem()
          if (type === 'edit') this.getJobById(this.inspectTree.check)
          this.edit.script.name = this.codeInfo.name
          this.dialog.tree = false
        } else {
          this.$message.error({ content: '保存失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 巡检项过滤
     */
    onFilter () {
      if (this.inspectTree.filter) {
        this.inspectTree.treeFilter = (node) => {
          const rs = node.data.label.indexOf(this.inspectTree.filter) >= 0
          return rs
        }
      } else {
        this.inspectTree.treeFilter = null
      }
    },
    onSelect ({ node }) {
      this.edit.isLeaf = true
      this.inspectTree.check = node.value
      this.getItemInfo()
    },
    onAdd (node) {
      this.add.parentId = node.value
      this.add.parentName = node.data.label
      this.dialog.tree = true
    },
    onAddSave () {
      this.saveItem('add', this.add)
    },
    onEditSave () {
      this.saveItem('edit', this.edit)
    },
    /**
     * 删除巡检项
     * @param id 巡检项id
     */
    onRemove (id) {
      removeItemAPI(id).then(response => {
        const { data } = response
        if (data.code === 200) {
          this.$message.success({ content: '删除成功', placement: 'center' })
          this.inspectTree.selected = ''
          this.getItem()
        } else {
          this.$message.error({ content: '删除失败，请联系管理员处理', placement: 'center' })
        }
      })
    },
    showJobInfo (node, id) {
      this.getJobById(id)
    },
    jobCheck (data) {
      if (data.length === 0) {
        this.$message.error({ content: '暂未选择脚本', placement: 'center' })
        this.dialog.job = true
      } else if (data.length > 1) {
        this.$message.error({ content: '抱歉！只能选择一个脚本进行关联', placement: 'center' })
        this.dialog.job = true
      } else {
        this.add.script.id = data[0].id
        console.log(data[0].name)
        this.add.script.name = data[0].name
        console.log(this.add.name)
        this.dialog.job = false
      }
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-drawer__body
  padding: 0px
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
