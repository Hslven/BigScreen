<template>
  <div class="p-4">
    <div class="l-row p-4 bg-white">
      <div
        class="l-col-3"
        style="
          border-right: 1px solid #f3f3f3;
          border-left: 1px solid #f3f3f3;
        "
      >
        <div
          class="l-row"
          style="
            justify-content: space-between;
            height: 50px;
            opacity: 1;
            padding: 0 8px;
            line-height: 50px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(231, 231, 231, 1);
            margin: 0 -1px;
          "
        >
          <span>配置模板</span>
          <span
            @click="showList = !showList"
            style="
              color: rgba(0, 98, 255, 1);
              cursor: pointer;
              user-select: none;
            "
            >收起

            <t-button shape="circle" variant="text" theme="primary"
              ><OrderDescendingIcon slot="icon" v-show="showList" />
              <OrderAscendingIcon slot="icon" v-show="!showList" /> </t-button
          ></span>
        </div>
        <div v-show="showList">
          <div style="margin: -1px; border-radius: none">
            <t-form>
              <!-- <t-input
                style="width: 100%"
                placeholder="验收项名称"
                v-model="inspectTree.name"
              /> -->
              <t-input
                v-model="inspectTree.filterText"
                placeholder="验收项名称"
                @change="onInput"
              ></t-input>
            </t-form>
          </div>
          <div class="l-row mt-4 mr-4" style="justify-content: flex-end">
            <t-tooltip class="placement bottom" content="添加">
              <t-button
                shape="circle"
                variant="text"
                theme="primary"
                @click="addEvent"
                ><AddIcon slot="icon"
              /></t-button>
            </t-tooltip>
            <t-tooltip class="placement bottom" content="编辑">
              <t-button
                shape="circle"
                variant="text"
                @click="editEvent"
                theme="primary"
                ><EditIcon slot="icon"
              /></t-button>
            </t-tooltip>
            <t-tooltip class="placement bottom" content="删除">
              <t-button
                shape="circle"
                variant="text"
                @click="()=>{if (inspectTree.selected)dialog.delPopup.show = true}"
                theme="primary"
                ><DeleteIcon slot="icon"
              /></t-button>
            </t-tooltip>
            <t-tooltip class="placement bottom" content="刷新">
              <t-button
                shape="circle"
                variant="text"
                theme="primary"
                @click="refreshEvent"
                ><refresh-icon slot="icon"
              /></t-button>
            </t-tooltip>
          </div>

          <div>
            <t-tree
              ref="inspectTree"
              :keys="{ value: 'id' }"
              :allowFoldNodeOnFilter="false"
              :data="treeData"
              :expand-level="2"
              :filter="inspectTree.filter"
              hover
              activable
              @click="treeClick"
              style="overflow: auto"
            >
              <!-- @click="updateSelected" -->
              <template #label="{ node }">
                <div
                  v-if="aiList.includes(node.label)"
                  class="row l-items-center vertical-middle"
                  style="flex-wrap: wrap"
                >
                  <span class="mr-4">{{ node.label }}</span>
                  <span class="text-white bg-green-400 px-2">★AI</span>
                </div>
                <div v-else>
                  <svg-icon
                    class="mr-2"
                    v-if="node.getChildren()"
                    name="filder"
                    style="display: inline-block"
                  ></svg-icon>
                  <span>{{ node.label }}</span>
                </div>
              </template>
            </t-tree>

            <!--        <q-scroll-area
              class="px-2"
              :style="`height: ${screenHeight + 100}px`"
            >
              <q-tree
                ref="inspectTree"
                node-key="id"
                selected-color="primary"
                default-expand-all
                :nodes="treeData"
                :filter="inspectTree.name"
                :selected.sync="inspectTree.selected"
                @update:selected="updateSelected"
                >
                <template v-slot:default-header="prop">
                  <div
                    v-if="aiList.includes(prop.node.label)"
                    class="row l-items-center vertical-middle"
                  >
                    <span class="q-mr-sm">{{ prop.node.label }}</span>
                    <q-chip
                      square
                      color="positive"
                      text-color="white"
                      icon="star"
                      size="10px"
                      >AI</q-chip
                    >
                  </div>
                  <div v-else>
                    <span>{{ prop.node.label }}</span>
                  </div>
                </template>
              </q-tree>
            </q-scroll-area> -->
          </div>
        </div>
      </div>
      <div class="l-col-8" style="margin-left: -1px">
        <div
          @click="noShowCodeMirror = !noShowCodeMirror"
          style="
            height: 50px;
            opacity: 1;
            background: rgba(235, 241, 255, 1);
            line-height: 50px;
            padding-left: 17px;
            border: 1px solid rgba(231, 231, 231, 1);
          "
        >
          <span
            style="
              color: rgba(0, 98, 255, 1);
              cursor: pointer;
              user-select: none;
            "
            >展开查看脚本详情
            <t-tooltip
              class="placement bottom"
              :content="noShowCodeMirror ? '展开脚本内容' : '收起脚本内容'"
            >
              <t-button shape="circle" variant="text" theme="primary"
                ><ChevronDownIcon slot="icon" v-show="noShowCodeMirror" />
                <ChevronUpIcon slot="icon" v-show="!noShowCodeMirror" />
              </t-button> </t-tooltip
          ></span>
        </div>
        <div v-show="!noShowCodeMirror" :style="`height: ${screenHeight}px`">
          <codemirror
            ref="CodeEdit"
            v-model="code"
            v-show="!noShowCodeMirror"
            :options="cmOptions"
          >
          </codemirror>
        </div>
        <div
          class="l-row"
          style="
            justify-content: space-between;
            height: 50px;
            opacity: 1;
            padding: 0 17px;
            line-height: 50px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(231, 231, 231, 1);
            margin-top: -1px;
          "
        >
          <span>验收参数配置</span>
          <span>
            <t-button
              class="mr-4"
              variant="base"
              content="新增参数"
              @click="insertEvent(-1)"
            />
            <t-button
              class="mr-4"
              variant="base"
              ghost
              content="保存"
              @click="saveParam"
            />
            <t-button
              variant="outline"
              theme="default"
              content="删除"
              @click="removeParam()"
            />
          </span>
        </div>
        <div
          class=""
          style="
            border: 1px solid rgba(231, 231, 231, 1);
            margin-top: -1px;
            margin-right: 1px;
            border-bottom: none;
            border-right: none;
          "
          :style="noShowCodeMirror ? 'height: 610px' : ''"
        >
          <div class="" style="margin: -1px -1px 0">
            <vxe-table
              class="text-black"
              auto-resize
              keep-source
              resizable
              show-overflow
              ref="paramTb"
              id="paramTb"
              max-height="600"
              empty-text="暂无参数信息！"
              size="mini"
              border="full"
              :data="tableData"
              :edit-config="{
                trigger: 'click',
                mode: 'cell',
                icon: 'vxe-icon-edit',
                showStatus: true,
              }"
            >
              <vxe-column type="checkbox" width="60"></vxe-column>
              <vxe-column field="name" title="验收关键字" :edit-render="{}">
                <template #edit="{ row }">
                  <vxe-select
                    v-model="row.name"
                    placeholder="请输入验收关键字"
                    transfer
                  >
                    <vxe-option
                      v-for="item in keyList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    ></vxe-option>
                  </vxe-select>
                </template>
              </vxe-column>
              <vxe-column field="mode" title="判断类型" :edit-render="{}">
                <template #default="{ row }">
                  <span>{{ operatorFormat(row.mode) }}</span>
                </template>
                <template #edit="{ row }">
                  <vxe-select
                    v-model="row.mode"
                    placeholder="请输入判断类型"
                    transfer
                  >
                    <vxe-option
                      v-for="item in typeList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    ></vxe-option>
                  </vxe-select>
                </template>
              </vxe-column>
              <vxe-column field="val" title="验收参考值" :edit-render="{}">
                <template #edit="{ row }">
                  <vxe-input
                    v-model="row.val"
                    type="text"
                    placeholder="请输入验收参考值"
                  ></vxe-input>
                </template>
              </vxe-column>
              <vxe-column
                field="description"
                title="描述"
                :edit-render="{}"
                placeholder="请输入参数描述"
              >
                <template #edit="{ row }">
                  <vxe-input
                    v-model="row.description"
                    type="text"
                  ></vxe-input>
                </template>
              </vxe-column>
            </vxe-table>
          </div>
        </div>
      </div>
    </div>

    <t-dialog
      :visible.sync="dialog.event.show"
      :header="dialog.event.type + '验收项'"
      width="700px"
      @confirm="submitEvent()"
      confirmBtn="保存"
    >
      <t-card
        style="max-width: 80vw; border-radius: 0px"
        :bordered="false"
      >
        <div class="l-row l-col-12 l-items-center vertical-middle mb-8">
          <span class="l-col-2 l-col-md-2 fieldItem">类型</span>
          <t-radio-group v-model="formData.treeType">
            <t-radio-button value="0" :disabled="!formData.isEdit"
              >验收分类</t-radio-button
            >
            <t-radio-button value="1" :disabled="!formData.isEdit"
              >验收项</t-radio-button
            >
          </t-radio-group>

        </div>
        <div class="l-row l-col-12 l-items-center vertical-middle mb-8">
          <span class="l-col-2 l-col-md-2 fieldItem">父级目录</span>
          <t-input
            v-model="formData.parentName"
            clearable
            class="l-col-6 col-md-6"
            @click="showInspectTree"
          />
        </div>
        <div class="l-row l-col-12 l-items-center vertical-middle mb-8">
          <span class="l-col-2 l-col-md-2 fieldItem">验收项名称</span>
          <t-input
            v-model="formData.name"
            clearable
            placeholder="请输入验收项/类型名称"
            class="l-col-6 l-col-md-6"
          />
        </div>
        <div class="l-row l-col-12 l-items-center vertical-middle mb-8">
          <span class="l-col-2 l-col-md-2 fieldItem">序号</span>
          <!-- <t-input
                v-model.number="formData.treeSort"
                type="number"
                ref="treeSort"
                class="l-col-6 col-md-6"
              /> -->
          <t-input-number
            class="l-col-6 col-md-6"
            v-model="formData.treeSort"
            ref="treeSort"
            theme="column"
          ></t-input-number>
        </div>
        <div
          class="l-row l-col-12 col-md-12"
          v-show="formData.treeType === '1'"
        >
          <div class="l-row l-col-12 l-items-center vertical-middle mb-8">
            <span class="l-col-2 l-col-md-2 fieldItem">对应脚本</span>
            <div class="l-col-6 col-md-6">
              <t-badge :count="selectJob.length" show-zero>
                <t-button ghost @click="dialog.jobComp.show = true"
                  >脚本选择
                  <!-- <q-badge color="red" floating>{{
                    selectJob.length
                  }}</q-badge> -->
                </t-button>
              </t-badge>
            </div>
          </div>

          <div class="l-row l-col-12 l-items-center vertical-middle mb-8">
            <span class="l-col-2 l-col-md-2 fieldItem">执行方式：</span>
            <t-radio-group v-model="formData.delegateToLocal">
              <t-radio-button value="0" :disabled="formData.isEdit"
                >远端执行</t-radio-button
              >
              <t-radio-button value="1" :disabled="formData.isEdit"
                >节点执行</t-radio-button
              >
            </t-radio-group>
          </div>
          <div class="l-row l-col-12 l-items-center vertical-middle">
            <span class="l-col-2 l-col-md-2 fieldItem">描述</span>
            <t-input
              v-model="formData.description"
              clearable
              placeholder="请输入验收项描述"
              class="l-col-6 col-md-6"
            />
          </div>
        </div>
      </t-card>
    </t-dialog>

    <t-dialog
      :visible.sync="dialog.inspectTree.show"
      header="验收项类型"
      @confirm="parentDirConfirm"
      @onCancel="dialog.inspectTree.show = false"
      width="520px"
      :closeOnOverlayClick="false"
    >
      <t-card style="border-radius: 0px" :bordered="false">
        <t-input
          clearable
          v-model="inspectTreeSelect.filterText"
          placeholder="请输入过滤字符"
          @change="onInput1"
        >
        </t-input>
        <t-tree
          class="pt-8"
          :keys="{ value: 'id' }"
          :allowFoldNodeOnFilter="false"
          :data="dialog.inspectTree.treeData"
          node-key="id"
          hover
          activable
          :filter="inspectTreeSelect.filter"
          @click="treeClick2"
        >
          <template #label="{ node }">
            <div>
              <svg-icon
                class="mr-2"
                v-if="node.getChildren()"
                name="filder"
                style="display: inline-block"
              ></svg-icon>
              <span>{{ node.label }}</span>
            </div>
          </template>
        </t-tree>
        <!-- :selected.sync="formData.parentId" -->
        <!-- <q-tree
            class="q-pt-lg"
            :nodes="dialog.inspectTree.treeData"
            default-expand-all
            :selected.sync="formData.parentId"
            node-key="id"
            :filter="inspectTreeSelect.name"
          >
          </q-tree> -->
        <!-- <t-row>
    <t-col :span="2" :offset="10">
      <t-button  content="确定" @click="parentDirConfirm"  />
    </t-col>
  </t-row> -->
      </t-card>
    </t-dialog>
    <t-dialog
      :visible.sync="dialog.jobComp.show"
      :header="false"
      :footer="false"
      width="1400px"
      placement="center"
    >
      <job :jobList.sync="selectJob" @jobCheck="jobCompCtl"></job>
    </t-dialog>
    <t-dialog
      :visible.sync="dialog.delPopup.show"
      header="消息提示"
      width="700px"
      @confirm="delEvent()"
      confirmBtn="确定"
    >您确定要删除选中的数据吗？</t-dialog>
  </div>
</template>

<script>
import {
  getListAPI,
  saveItemAPI,
  removeItemAPI,
  getListByIdAPI,
  getInspectSciptAPI
} from '@/api/inops/inspect/inspectItem'
import { updateParamAPI } from '@/api/inops/job/job'
import { loopGroup, findParentId } from '@/utils/inops/groupTree'
import Job from '@/components/Selector/Job'
import { codemirror } from 'vue-codemirror' // 引入组件
import { codeConfig } from '@/utils/inops/codeConfig'
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  RefreshIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  OrderAscendingIcon,
  OrderDescendingIcon
} from 'tdesign-icons-vue'
export default {
  name: 'relationConfig',
  components: {
    Job,
    codemirror,
    AddIcon,
    EditIcon,
    DeleteIcon,
    RefreshIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    OrderAscendingIcon,
    OrderDescendingIcon
  },
  data () {
    return {
      screenHeight: 0,
      condition: {
        name: ''
      },
      selectJob: [],
      treeData: [],
      treeList: '',
      aiList: [
        '计算服务器光模块验收',
        '计算服务器物理端口可靠性验收',
        '计算服务器计算性能状态验收',
        '存储服务器光模块验收',
        '存储服务器物理端口可靠性验收',
        '存储服务器存储性能状态验收',
        '网络设备物理端口可靠性验收',
        '网络设备光模块验收',
        '虚层关键组件可靠性验收'
      ],
      inspectTree: {
        name: '',
        filter: null,
        filterText: '',
        selected: ''
      },
      dialog: {
        event: {
          show: false,
          type: '新增'
        },
        inspectTree: {
          show: false,
          treeData: []
        },
        jobComp: {
          show: false
        },
        delPopup: {
          show: false
        }
      },
      formData: {
        treeType: '0',
        type: 'accept',
        isEdit: false,
        parentId: '',
        parentName: null,
        name: '',
        treeSort: '10',
        delegateToLocal: '0',
        // bmcExecute: true,
        description: '',
        script: {
          id: null
        }
      },
      inspectTreeSelect: {
        name: '',
        filter: null,
        filterText: ''
      },
      scriptId: '',
      code: '',
      cmOptions: codeConfig('', ''),
      title: '请选择验收项查看脚本内容',
      noShowCodeMirror: true,
      showList: true,
      tableData: [],
      typeList: [
        { label: '大于', value: 'gt' },
        { label: '小于', value: 'lt' },
        { label: '等于', value: 'eq' },
        { label: '包含', value: 'in' }
      ],
      keyList: [
        { label: '利用率', value: 'usage' },
        { label: '状态', value: 'status' },
        { label: '磁盘大小', value: 'disk' },
        { label: '型号', value: 'modelName' },
        { label: '内存占用率', value: 'memory' }
      ]
    }
  },
  watch: {
    'dialog.event.type': {
      handler (newVal) {
        if (newVal === '新增') {
          this.formData.isEdit = false
        } else {
          this.formData.isEdit = true
        }
      },
      deep: true
    },
    noShowCodeMirror: {
      handler (newVal) {
        if (!newVal) {
        }
        this.$nextTick(() => {
          this.$refs.CodeEdit.codemirror.setSize('auto', this.screenHeight)
        })
      }
    }
  },
  async mounted () {
    this.screenHeight = window.screen.height * 0.45
    await this.getInspectItem()
  },
  methods: {
    async getInspectItem () {
      const data = {
        type: 'accept'
      }
      await getListAPI(data).then((response) => {
        const { data } = response
        if (data.code === 200) {
          this.treeData = loopGroup(data.data, 'name', 'treeType')
          this.treeList = JSON.parse(JSON.stringify(data.data))
        }
      })
    },
    getJobById (id) {
      getInspectSciptAPI(id).then((response) => {
        const { data } = response
        if (data.code === 200) {
          if (data.data) {
            this.selectJob = []
            this.selectJob.push(data.data)
            this.scriptId = data.data.id
            this.tableData = data.data.params
            this.code = data.data.code
            this.cmOptions = codeConfig(data.data.lang, '')
          } else {
            this.code = ''
            this.title = '该验收项暂未配置脚本'
          }
        }
      })
    },
    updateParam (data) {
      updateParamAPI(data).then((res) => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '验收项参数保存成功', placement: 'center' })
          this.updateSelected()
        }
      })
    },
    addEvent () {
      this.dialog.event.type = '新增'
      this.selectJob = []
      this.formData.script.id = ''
      this.formData = {
        treeType: '1',
        type: 'accept',
        isEdit: false,
        parentId: '',
        parentName: null,
        name: '',
        treeSort: '10',
        delegateToLocal: '0',
        description: '',
        script: {
          id: null
        }
      }
      if (this.inspectTree.selected) {
        const group = findParentId(this.inspectTree.selected, this.treeList)
        if (group.treeType === '0') {
          this.formData.parentId = group.id
          this.formData.parentName = group.name
        } else if (group.treeType === '1') {
          const parentGroup = findParentId(group.parentId, this.treeList)
          this.formData.parentId = parentGroup.id
          this.formData.parentName = parentGroup.name
        }
      }
      this.dialog.event.show = true
    },
    editEvent () {
      this.dialog.event.type = '编辑'
      if (this.inspectTree.selected) {
        this.formData = {
          treeType: '0',
          type: 'accept',
          isEdit: true,
          parentId: '',
          parentName: null,
          name: '',
          treeSort: '10',
          delegateToLocal: '0',
          description: '',
          script: {
            id: null
          }
        }
        getListByIdAPI(this.inspectTree.selected).then((response) => {
          const { data } = response
          if (data.code === 200) {
            Object.assign(this.formData, data.data)
            if (data.data.script === null) {
              this.formData.script = { id: '' }
            }
            const parentGroup = findParentId(data.data.parentId, this.treeList)
            this.formData.parentName = parentGroup.name
            this.dialog.event.show = true
          }
        })
      } else {
        this.$XModal.message({
          message: '请至少选择一条数据',
          status: 'error'
        })
      }
    },
    delEvent () {
      if (this.inspectTree.selected) {
        // this.$XModal.confirm('您确定要删除选中的数据吗?').then((type) => {
        //   if (type === 'confirm') {
        removeItemAPI(this.inspectTree.selected).then((response) => {
          const { data } = response
          if (data.code === 200) {
            this.$message.success({ content: '删除成功', placement: 'center' })
            this.inspectTree.selected = ''
            this.getInspectItem()
          } else {
            this.$message.error({ content: '删除失败，请联系管理员处理', placement: 'center' })
          }
        })
        this.dialog.delPopup.show = false
        //   }
        // })
      }
    },
    refreshEvent () {
      this.getInspectItem()
    },
    updateSelected () {
      if (this.inspectTree.selected) {
        getListByIdAPI(this.inspectTree.selected).then((response) => {
          const { data } = response
          if (data.code === 200) {
            if (data.data.treeType === '1') {
              this.getJobById(this.inspectTree.selected)
            } else {
              this.code = ''
              this.title = '请选择验收项'
            }
          }
        })
      }
    },
    submitEvent () {
      if (this.formData.parentId === '' || this.formData.parentId === null) {
        this.$message.warning({ content: '验收类型不能为空', placement: 'center' })
        return false
      }
      saveItemAPI(this.formData).then((response) => {
        const { data } = response
        if (data.code === 200) {
          this.$message.success({ content: '操作成功', placement: 'center' })
          this.getInspectItem()
          this.dialog.event.show = false
          this.getJobById(this.inspectTree.selected)
        } else {
          this.$message.error({ content: '操作失败，请联系管理员', placement: 'center' })
        }
      })
    },
    showInspectTree () {
      const inspectTree = []
      this.treeList.forEach((item) => {
        if (item.treeType === '0') {
          inspectTree.push(item)
        }
      })
      this.dialog.inspectTree.treeData = loopGroup(
        inspectTree,
        'name',
        'treeType'
      )
      this.dialog.inspectTree.show = true
    },
    parentDirConfirm () {
      if (this.formData.parentId) {
        const parentGroup = findParentId(this.formData.parentId, this.treeList)
        this.formData.parentName = parentGroup.name
      } else {
        this.$message.warning({ content: '未选择验收类型', placement: 'center' })
      }
      this.dialog.inspectTree.show = false
    },
    jobCompCtl (data) {
      if (data.length === 0) {
        this.$message.warning({ content: '暂未选择脚本', placement: 'center' })
        this.dialog.jobComp.show = true
      } else if (data.length > 1) {
        this.$message.warning({ content: '抱歉！只能选择一个脚本进行关联', placement: 'center' })
        this.dialog.jobComp.show = true
      } else {
        this.formData.script.id = data[0].id
        this.selectJob = data
        this.dialog.jobComp.show = false
      }
    },
    operatorFormat (value) {
      if (value) {
        const index = this.typeList.findIndex((item) => item.value === value)
        return this.typeList[index].label
      }
    },
    async insertEvent (row) {
      const $table = this.$refs.paramTb
      const record = {
        name: '',
        mode: '',
        val: '',
        description: ''
      }
      const { row: newRow } = await $table.insertAt(record, row)
      await $table.setActiveCell(newRow, 'name')
    },
    saveParam () {
      let list = []
      this.tableData.forEach((item) => {
        const obj = {
          name: item.name,
          val: item.val,
          mode: item.mode,
          description: item.description
        }
        list.push(obj)
      })
      const $table = this.$refs.paramTb
      const insertRecords = $table.getInsertRecords()
      list = list.concat(insertRecords)
      const data = {
        id: this.scriptId,
        params: list
      }
      this.updateParam(data)
    },
    removeParam () {
      // const rows = this.$refs.paramTb.getCheckboxRecords()
      const $table = this.$refs.paramTb
      if ($table) {
        $table.removeCheckboxRow()
      }
      // rows.forEach((row) => {
      //   const index = this.tableData.findIndex((value) => value.id === row.id)
      //   this.tableData.splice(index, 1)
      // })
      const data = {
        id: this.scriptId,
        params: this.tableData
      }
      // console.log(data);
      this.updateParam(data)
    },
    onInput (state) {
      if (this.inspectTree.filterText) {
        // 存在过滤文案，才启用过滤
        this.inspectTree.filter = (node) => {
          const rs = node.data.label.indexOf(this.inspectTree.filterText) >= 0
          // 命中的节点会强制展示
          // 命中节点的路径节点会锁定展示
          // 未命中的节点会隐藏
          return rs
        }
      } else {
        // 过滤文案为空，则还原 tree 为无过滤状态
        this.inspectTree.filter = null
      }
    },
    onInput1 (state) {
      if (this.inspectTreeSelect.filterText) {
        // 存在过滤文案，才启用过滤
        this.inspectTreeSelect.filter = (node) => {
          const rs =
            node.data.label.indexOf(this.inspectTreeSelect.filterText) >= 0
          // 命中的节点会强制展示
          // 命中节点的路径节点会锁定展示
          // 未命中的节点会隐藏
          return rs
        }
      } else {
        // 过滤文案为空，则还原 tree 为无过滤状态
        this.inspectTreeSelect.filter = null
      }
    },
    treeClick ({ node }) {
      this.inspectTree.selected = node.value
      this.updateSelected()
    },
    treeClick2 ({ node }) {
      this.formData.parentId = node.value
    }
  }
}
</script>

<style lang="sass" scoped>
.dialogContainer
  width: 1280px
  max-width: 80vw
  min-height: 72vh
  max-height: 85vh

/deep/ .vxe-table--header-wrapper
    margin-right: 3px;
/deep/ .vxe-table--header,/deep/ .vxe-table--body
  width: 944px!important;

/deep/ span
  white-space: normal;
</style>
