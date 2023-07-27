<template>
  <div>
    <div class="bg-mod-card p-4">
      <div class="l-row p-4 bg-white" style="min-height: 700px">
        <div
          class="l-col-4"
          style="
            border-right: 1px solid #f3f3f3;
            border-left: 1px solid #f3f3f3;
          ">
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

              <t-button shape="circle" variant="text" theme="primary">
                <OrderDescendingIcon slot="icon" v-show="showList" />
                <OrderAscendingIcon slot="icon" v-show="!showList" /> </t-button
              ></span>
          </div>
          <div v-show="showList">
            <div style="margin: -1px;">
              <t-form>
                <t-input v-model="tree.filterText" @change="onInput"></t-input>
              </t-form>
            </div>

            <div class="l-row" style="justify-content: flex-end">
              <t-tooltip class="placement bottom" content="添加">
                <t-button
                  shape="circle"
                  variant="text"
                  theme="primary"
                  @click="addEvent"
                >
                  <AddIcon slot="icon" />
                </t-button>
              </t-tooltip>
              <t-tooltip class="placement bottom" content="编辑">
                <t-button
                  shape="circle"
                  variant="text"
                  @click="editEvent"
                  theme="primary"
                >
                  <EditIcon slot="icon" />
                </t-button>
              </t-tooltip>
              <t-tooltip class="placement bottom" content="删除">
                <t-button
                  shape="circle"
                  variant="text"
                  @click="delEvent"
                  theme="primary"
                >
                  <DeleteIcon slot="icon" />
                </t-button>
              </t-tooltip>
            </div>

            <div>
              <t-tree
                ref="inspectTree"
                :keys="{ value: 'id' }"
                :allowFoldNodeOnFilter="false"
                expand-on-click-node
                :data="tree.infoData"
                checkable
                activable
                hover
                style="overflow: auto"
                :filter="tree.filters"
                :value.sync="tree.ticked"
                @change="tickedEvent"
                @click="treeClick"
              >
                <!-- expand-on-click-node -->
                <template #label="{ node }">
                  <svg-icon
                    class="mr-2"
                    v-if="node.getChildren()"
                    name="filder"
                    style="display: inline-block"
                  ></svg-icon>
                  <span>{{ node.label }}</span>
                </template>
              </t-tree>
            </div>
          </div>
        </div>
        <div class="l-col-8" style="margin-left: -1px">
          <div
            style="
              height: 50px;
              opacity: 1;
              line-height: 50px;
              padding-left: 17px;
              border: 1px solid rgba(231, 231, 231, 1);
            "
          >
            <span class="text-mod-primary">配置列表 ></span>
          </div>
          <div
            v-show="checkList.length === 0"
            class="p-4 bg-grey-2"
            style="border: 1px solid #eee"
          >
            <span class="text-grey">暂未选择配置项</span>
          </div>
          <!--  -->
          <div
            v-show="checkList.length !== 0"
            class="scroll bg-grey-2 pzx"
            style="max-height: 50vh; margin-bottom: -1px"
          >
            <t-card v-for="(item, index) in checkList" :key="index">
              <div class="l-row justify-between">
                <span class="text-black text-weight-bold">{{ item.name }}</span>

                <div>
                  <t-button
                    variant="text"
                    size="small"
                    theme="primary"
                    content="查看脚本详情"
                    @click="showJobInfo(item.id)"
                  />
                  <t-button
                    variant="text"
                    size="small"
                    theme="primary"
                    content="新增参数"
                    @click="insertEvent(index, -1)"
                  />
                  <t-button
                    variant="text"
                    size="small"
                    theme="primary"
                    content="移除参数"
                    @click="removeParam(index, item.script.id)"
                  />
                  <t-button
                    variant="text"
                    size="small"
                    theme="primary"
                    content="保存"
                    @click="saveParam(index, item.script.id)"
                  />
                </div>
              </div>

              <vxe-table
                class="text-black"
                auto-resize
                keep-source
                highlight-hover-row
                highlight-hover-column
                resizable
                show-overflow
                :ref="`table${index}`"
                :id="`table${index}`"
                max-height="300"
                empty-text="暂无参数信息！"
                size="mini"
                border="inner"
                align="left"
                :data="item.infoData"
                :edit-config="{
                  trigger: 'click',
                  mode: 'cell',
                  icon: 'vxe-icon-edit',
                  showStatus: true,
                }"
              >
                <vxe-column type="checkbox" width="60"></vxe-column>
                <vxe-column field="name" title="配置关键字" :edit-render="{}">
                  <template #edit="{ row }">
                    <vxe-input
                      v-model="row.name"
                      type="text"
                      placeholder="请输入配置关键字"
                    ></vxe-input>
                  </template>
                </vxe-column>
                <vxe-column field="val" title="配置参考值" :edit-render="{}">
                  <template #edit="{ row }">
                    <vxe-input
                      v-model="row.val"
                      type="text"
                      placeholder="请输入配置参考值"
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
            </t-card>
          </div>
          <!--  -->
          <div class="">
            <t-card style="border: 1px solid #eee">
              <span class="text-weight-bold my-4" style="display: block"
              >配置执行</span
              >
              <div class="l-row l-col-12 l-items-center mb-4">
                <span class="l-col-2">配置作业名称：</span>
                <t-input
                  v-model="scriptExecute.jobName"
                  class="l-col-8"
                  clearable
                />
              </div>

              <div class="l-row l-col-12 l-items-center mb-4">
                <span class="l-col-2">作业设备：</span>
                <t-badge :count="hostList.length" show-zero>
                  <t-button
                    ghost
                    @click="dialog.hostComp = !dialog.hostComp"
                    style="width: 80px; height: 30px"
                  >选择设备
                  </t-button>
                </t-badge>
              </div>
              <div
                class="l-row l-col-12 l-items-center mb-4 scriptedit_container"
              >
                <span class="l-col-2">执行方式：</span>
                <div>
                  <span
                    @click="handlerChange('assignUser')"
                    ref="assignUser"
                    :class="
                      scriptExecute.assignUser ? 'check_box' : 'un_check_box'
                    "
                    style="border-radius: 3px 0 0 3px"
                  >指定账号</span
                  >
                  <span
                    v-show="$route.name !== 'net'"
                    @click="handlerChange('become')"
                    ref="become"
                    :class="scriptExecute.become ? 'check_box' : 'un_check_box'"
                    style="margin: 0 -1px"
                  >Su</span
                  >
                  <span
                    v-show="$route.name !== 'net'"
                    @click="handlerChange('bmcExec')"
                    ref="bmcExec"
                    :class="
                      scriptExecute.bmcExec ? 'check_box' : 'un_check_box'
                    "
                    style="border-radius: 0 3px 3px 0"
                  >通过bmc IP执行</span
                  >
                </div>
              </div>
              <div class="l-row l-items-center mt-4">
                <span class="l-col-2">执行方式：</span>
                <div class="l-row l-col-4">
                  <div>
                    <span
                      @click="handlerChange('localExec1')"
                      ref="localExec1"
                      :class="
                        scriptExecute.localExec
                          ? 'un_check_box'
                          : 'check_box_single'
                      "
                      style="border-radius: 3px 0 0 3px"
                    >远端</span
                    >
                    <span
                      @click="handlerChange('localExec2')"
                      ref="localExec2"
                      :class="
                        scriptExecute.localExec
                          ? 'check_box_single'
                          : 'un_check_box'
                      "
                      style="border-radius: 0 3px 3px 0"
                    >节点</span
                    >
                  </div>
                  <t-tooltip
                    class="placement bottom right"
                    :content="renderContent"
                  >
                    <span
                      style="
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        border: 1px solid blue;
                        text-align: center;
                        line-height: 16px;
                        margin-top: 5px;
                        margin-left: 10px;
                      "
                    >i</span
                    >
                  </t-tooltip>
                </div>
              </div>
              <div
                class="mt-4 l-row l-col-12 l-items-center"
                v-if="scriptExecute.assignUser"
              >
                <span class="l-col-2">账号：</span>
                <t-input
                  v-model.trim="scriptExecute.user"
                  clearable
                  placeholder="请输入作业账号"
                  class="l-col-3"
                />
                <span class="l-col-2 pl-4">密码：</span>
                <t-input
                  v-model.trim="scriptExecute.pass"
                  type="password"
                  clearable
                  placeholder="请输入密码"
                  class="l-col-3"
                >
                </t-input>
              </div>
              <div
                class="mt-4 l- row l-items-center"
                v-if="scriptExecute.become"
              >
                <span class="l-col-2">账号：</span>
                <t-input
                  v-model.trim="scriptExecute.becomeUser"
                  placeholder="请输入作业账号"
                  class="l-col-3"
                />
                <span class="l-col-2 pl-4">密码：</span>
                <t-input
                  v-model.trim="scriptExecute.becomePass"
                  clearable
                  placeholder="请输入密码"
                  class="l-col-3"
                  type="password"
                >
                </t-input>
              </div>
              <div class="l-row mt-4 justify-end">
                <t-button content="执行" @click="executeScript" />
              </div>
            </t-card>
          </div>
        </div>
      </div>
      <!--  -->
    </div>
    <t-dialog
      :visible.sync="dialog.update"
      header="开局配置项"
      width="700px"
      preventScrollThrough
      confirmBtn="保存"
      @confirm="submitEvent"
    >
      <t-card :bordered="false">
        <t-form @submit="submitEvent()" >
          <div class="l-row l-col-12 items-center vertical-middle mb-8">
            <span class="l-col-2 l-col-md-2 fieldItem">类型</span>
            <t-radio-group v-model="formData.treeType">
              <t-radio-button value="0" :disable="formData.isEdit"
              >配置分类</t-radio-button
              >
              <t-radio-button value="1" :disable="formData.isEdit"
              >配置项</t-radio-button
              >
            </t-radio-group>
          </div>
          <div class="l-row l-col-12 items-center vertical-middle mb-8">
            <span class="l-col-2 l-col-md-2 fieldItem">父级目录</span>
            <t-input
              v-model="formData.parentName"
              clearable
              class="l-col-6 col-md-6"
              @click="showRootTree"
            />
          </div>
          <div class="l-row l-col-12 items-center vertical-middle mb-8">
            <span class="l-col-2 l-col-md-2 fieldItem">配置项名称</span>
            <t-input
              v-model="formData.name"
              clearable
              placeholder="请输入配置项/类型名称"
              class="l-col-6 l-col-md-6"
            />

          </div>
          <div class="l-row l-col-12 items-center vertical-middle mb-8">
            <span class="l-col-2 l-col-md-2 fieldItem">序号</span>
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
              <span class="l-col-2 l-col-md-2 fieldItem">执行方式：</span>
              <t-radio-group v-model="formData.delegateToLocal">
                <t-radio-button value="0" :disable="formData.isEdit"
                >远端执行</t-radio-button
                >
                <t-radio-button value="1" :disable="formData.isEdit"
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

        </t-form>
      </t-card>
    </t-dialog>
    <t-dialog
      :visible.sync="dialog.rootTree"
      header="配置项类型"
      width="500px"
      preventScrollThrough
      @confirm="rootTreeConfirm"
    >
      <t-card  :bordered="false">
        <t-input
          clearable
          v-model="rootTree.filterText"
          placeholder="请输入过滤字符"
          @change="onInput1"
        >
        </t-input>
        <t-tree
          class="pt-8"
          :keys="{ value: 'id' }"
          :allowFoldNodeOnFilter="false"
          :data="rootTree.infoData"
          node-key="id"
          :expand-level="1"
          hover
          activable
          :filter="rootTree.filter"
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
        <!-- <q-tree
          class="q-pt-lg"
          :nodes="rootTree.infoData"
          default-expand-all
          :selected.sync="formData.parentId"
          node-key="id"
          :filter="rootTree.filter"
        >
        </q-tree> -->

      </t-card>
    </t-dialog>
    <t-dialog
      :visible.sync="dialog.jobInfo"
      header="配置项类型"
      width="640px"
      placement="center"

      preventScrollThrough
      confirmBtn="保存"
      @confirm="saveJob"
    >
      <codemirror ref="CodeEdit" v-model="script.code" :options="cmOptions" />
    </t-dialog>
    <t-dialog
      header="设备选择"
      width="90%"
      preventScrollThrough
      :visible.sync="dialog.hostComp"
      :footer="false"
    >
      <Host :hostList.sync="hostList" @hostCheck="hostCompCtl"></Host>
    </t-dialog>
  </div>
</template>

<script>
import {
  getListAPI,
  saveItemAPI,
  getListByIdAPI,
  getInspectSciptAPI,
  removeItemAPI
} from '@/api/inops/inspect/inspectItem'
import { updateParamAPI, saveScriptAPI } from '@/api/inops/job/job'
import { executeConfigJob } from '@/api/inops/configJob/configJob'
import { loopGroup, findParentId } from '@/utils/inops/groupTree'
import { codemirror } from 'vue-codemirror' // 引入组件
import Host from '@/components/Selector/Host'
import { codeConfig } from '@/utils/inops/codeConfig'
import codeMode from './codeModel'
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  OrderAscendingIcon,
  OrderDescendingIcon
} from 'tdesign-icons-vue'
export default {
  name: 'module',
  components: {
    codemirror,
    Host,
    AddIcon,
    EditIcon,
    DeleteIcon,
    OrderAscendingIcon,
    OrderDescendingIcon
  },
  data () {
    return {
      screenHeight: 0,
      showList: true,
      tree: {
        filter: '',
        filterText: '',
        filters: null,
        selected: '',
        infoData: [],
        list: [],
        ticked: []
      },
      rootTree: {
        infoData: [],
        filter: null,
        filterText: '',
        selected: ''
      },
      configType: '',
      script: {
        id: '',
        name: '',
        type: '',
        code: '',
        lang: '',
        params: []
      },
      formData: {
        treeType: '0',
        type: '',
        isEdit: false,
        parentId: '',
        parentName: null,
        name: '',
        treeSort: '10',
        delegateToLocal: '0',
        description: '',
        script: {
          id: '',
          code: '',
          type: '',
          lang: 'python'
        }
      },
      checkList: [],
      scriptExecute: {
        jobName: '', // 执行作业名称
        taskIds: '',
        type: '',
        deviceIds: [],
        user: '', // 执行用户
        pass: '', // 执行密码
        become: false, // 是否提权
        becomeUser: 'root', // 提权用户
        becomePass: '', // 提权密码
        becomeMethod: '', // 提权方式
        assignUser: false, // 是否指定执行用户
        bmcExec: false, // 是否通过BMC IP执行
        localExec: false // 是否远端执行
      },
      isShowPsw: {
        become: false,
        assignUser: false
      },
      hostList: [],
      jobId: '',
      dialog: {
        update: false,
        rootTree: false,
        jobInfo: false,
        hostComp: false,
        execute: false
      },
      cmOptions: codeConfig('', true)
    }
  },
  watch: {
    'dialog.jobInfo': {
      handler (newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.$refs.CodeEdit.codemirror.setSize(
              'auto',
              window.screen.height * 0.7
            )
          })
        }
      },
      immediate: true
    }
  },
  async mounted () {
    this.configType = this.$route.name + 'cfg'
    this.screenHeight = window.screen.height * 0.45
    await this.getItem()
    if (this.$route.name === 'srv') {
      this.$refs.tree.setExpanded('702a5f21cc554bb09de266428f84ee52', true)
      this.$refs.tree.setExpanded('ff3018ac085a4a6db1b80b80d1ca3ce3', true)
      this.script.code = codeMode.action_script
    } else if (this.$route.name === 'dbs') {
      this.$refs.tree.setExpanded('51ca1fb0-4ed3-11ed-bd06-005056ad5140', true)
      this.$refs.tree.setExpanded('92a3cd46-4f51-11ed-bd06-005056ad5140', true)
      this.script.code = codeMode.action_script
    } else if (this.$route.name === 'net') {
      this.$refs.tree.setExpanded('d50a6f6f86c54ef98c17e1c9f8e3e337', true)
      this.$refs.tree.setExpanded('1075617e72234c9cb23a1e1ddc615779', true)
      this.script.code = codeMode.forward_online_script
    }
  },
  methods: {
    async getItem () {
      const data = {
        type: this.configType
      }
      await getListAPI(data).then((response) => {
        const { data } = response
        if (data.code === 200) {
          this.tree.infoData = loopGroup(data.data, 'name', 'treeType')
          this.tree.list = JSON.parse(JSON.stringify(data.data))
        }
      })
    },
    getJobById (id) {
      getInspectSciptAPI(id).then((response) => {
        const { data } = response
        if (data.code === 200) {
          if (data.data) {
            const index = this.checkList.findIndex((v) => v.id === id)
            this.checkList[index].infoData = data.data.params
            this.script.code = data.data.code
            this.script.name = data.data.name
            this.script.type = data.data.type
            this.script.lang = data.data.lang
            this.script.id = data.data.id
            this.script.params = data.data.params
            this.cmOptions = codeConfig(data.data.lang, true)
          } else {
            this.script.code = ''
          }
        }
      })
    },
    updateParam (data) {
      updateParamAPI(data).then((res) => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '配置项参数保存成功', placement: 'center' })
        }
      })
    },
    addEvent () {
      this.formData = {
        treeType: '0',
        type: this.configType,
        isEdit: false,
        parentId: '0',
        parentName: null,
        name: '',
        treeSort: '10',
        delegateToLocal: '0',
        description: '',
        script: {
          id: '',
          name: '',
          code: '',
          type:
            this.$route.name === 'srv' || this.$route.name === 'dbs'
              ? 'action_script'
              : 'forward_online_script',
          lang: 'python'
        }
      }
      if (this.tree.selected) {
        const group = findParentId(this.tree.selected, this.tree.list)
        if (group.treeType === '0') {
          this.formData.parentId = group.id
          this.formData.parentName = group.name
        } else if (group.treeType === '1') {
          const parentGroup = findParentId(group.parentId, this.tree.list)
          this.formData.parentId = parentGroup.id
          this.formData.parentName = parentGroup.name
        }
      }
      this.dialog.update = true
    },
    editEvent () {
      if (this.tree.selected) {
        this.formData = {
          treeType: '0',
          type: this.configType,
          isEdit: false,
          parentId: '',
          parentName: null,
          name: '',
          treeSort: '10',
          delegateToLocal: '0',
          description: '',
          script: {
            code: this.script.code
          }
        }
        getListByIdAPI(this.tree.selected).then((response) => {
          const { data } = response
          if (data.code === 200) {
            Object.assign(this.formData, data.data)
            if (data.data.script === null) {
              this.formData.script = {
                id: data.data.id,
                name: data.data.name,
                code: data.data.code,
                type: data.data.type,
                lang: data.data.lang
              }
            }
            if (data.data.parentId !== '0') {
              const parentGroup = findParentId(
                data.data.parentId,
                this.tree.list
              )
              this.formData.parentName = parentGroup.name
            }
            this.dialog.update = true
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
      if (this.tree.ticked) {
        this.$XModal.confirm('您确定要删除选中的数据吗?').then((type) => {
          if (type === 'confirm') {
            const ids = this.tree.ticked.join(',')
            removeItemAPI(ids).then((response) => {
              const { data } = response
              if (data.code === 200) {
                this.$message.success({ content: '删除成功', placement: 'center' })
                this.tree.ticked = []
                this.getItem()
              } else {
                this.$message.error({ content: '删除失败，请联系管理员处理', placement: 'center' })
              }
            })
          }
        })
      }
      this.tree.selected = ''
    },
    showRootTree () {
      const tree = []
      this.tree.list.forEach((item) => {
        if (item.treeType === '0') {
          tree.push(item)
        }
      })
      this.rootTree.infoData = loopGroup(tree, 'name', 'treeType')
      this.dialog.rootTree = true
    },
    rootTreeConfirm () {
      if (this.formData.parentId) {
        const parentGroup = findParentId(
          this.formData.parentId,
          this.tree.list
        )
        this.formData.parentName = parentGroup.name
        this.dialog.rootTree = false
      } else {
        this.$message.error({ content: '未选择配置类型', placement: 'center' })
      }
    },
    submitEvent () {
      if (this.formData.parentId === '' || this.formData.parentId === null) {
        this.$message.error({ content: '配置类型不能为空', placement: 'center' })
        return false
      }
      this.formData.script.name = this.formData.name
      this.formData.script.code = this.script.code
      saveItemAPI(this.formData).then((response) => {
        const { data } = response
        if (data.code === 200) {
          this.$message.success({ content: '操作成功', placement: 'center' })
          this.getItem()
          this.dialog.update = false
        } else {
          this.$message.error({ content: '操作失败，请联系管理员', placement: 'center' })
        }
      })
    },
    tickedEvent () {
      this.checkList = []
      setTimeout(() => {
        this.tree.ticked.forEach(async (item) => {
          await getListByIdAPI(item).then((res) => {
            const { data } = res
            if (data.code === 200) {
              if (data.data.treeType !== '0') {
                const obj = {
                  id: data.data.id,
                  name: data.data.name,
                  script: data.data.script,
                  infoData: data.data.script.params
                }
                this.checkList.push(obj)
                this.getJobById(item)
              }
            }
          })
        })
      }, 100)
    },
    selectEvent () {
      console.log(this.tree.selected)
    },
    async hostCompCtl (data) {
      this.hostList = data
      this.scriptExecute.deviceIds = []
      await data.forEach((item) => {
        this.scriptExecute.deviceIds.push(item.id)
      })
      this.dialog.hostComp = false
    },
    executeScript () {
      this.scriptExecute.taskIds = this.tree.ticked
      this.scriptExecute.type =
        this.$route.name === 'srv' || this.$route.name === 'dbs'
          ? 'action_script'
          : 'forward_online_script'
      executeConfigJob(this.scriptExecute).then((res) => {
        const { data } = res
        if (data.code === 200) {
          if (data.data.taskId) {
            const obj = {
              taskId: data.data.taskId,
              backUrl: `/inops/config/${this.$route.name}`,
              name: '开局配置',
              type: 'schedule',
              isNew: true
            }
            this.$router.push({
              path: '/inops/util/execute',
              query: { obj }
            })
          } else {
            this.$message.error({ content: data.data.msg, placement: 'center' })
          }
        }
      })
    },
    async showJobInfo (id) {
      await this.getJobById(id)
      this.dialog.jobInfo = true
    },
    saveJob () {
      saveScriptAPI(this.script).then((response) => {
        const { data } = response
        if (data.code === 200) {
          this.$message.success({ content: '保存配置脚本成功', placement: 'center' })
        } else {
          this.$message.error({ content: '保存配置脚本失败', placement: 'center' })
        }
      })
    },
    operatorFormat (value) {
      if (value) {
        const index = this.typeList.findIndex((item) => item.value === value)
        return this.typeList[index].label
      }
    },
    async insertEvent (index, row) {
      const $table = this.$refs[`table${index}`][0]
      const record = {
        name: '',
        val: '',
        description: ''
      }
      const { row: newRow } = await $table.insertAt(record, row)
      await $table.setActiveCell(newRow, 'name')
    },
    saveParam (index, scriptId) {
      let list = []
      this.checkList[index].infoData.forEach((item) => {
        const obj = {
          name: item.name,
          val: item.val,
          description: item.description
        }
        list.push(obj)
      })
      const $table = this.$refs[`table${index}`][0]
      const insertRecords = $table.getInsertRecords()
      list = list.concat(insertRecords)
      const data = {
        id: scriptId,
        params: list
      }
      this.updateParam(data)
    },
    removeParam (index, scriptId) {
      const $table = this.$refs[`table${index}`][0]
      const rows = $table.getCheckboxRecords()
      rows.forEach((row) => {
        const id = this.checkList[index].infoData.findIndex(
          (value) => value.id === row.id
        )
        this.checkList[index].infoData.splice(id, 1)
      })
      const data = {
        id: scriptId,
        params: this.checkList[index].infoData
      }
      this.updateParam(data)
    },
    onInput (state) {
      if (this.tree.filterText) {
        // 存在过滤文案，才启用过滤
        this.tree.filters = (node) => {
          const rs = node.data.label.indexOf(this.tree.filterText) >= 0
          // 命中的节点会强制展示
          // 命中节点的路径节点会锁定展示
          // 未命中的节点会隐藏
          return rs
        }
      } else {
        // 过滤文案为空，则还原 tree 为无过滤状态
        this.tree.filters = null
      }
    },
    treeClick ({ node }) {
      this.tree.selected = node.value
    },
    renderContent () {
      return (
        <p style="font-size:12px;padding:2px!important">
          ‘远端’执行（默认）：执行指令时会登录设备，返回目标设备上的指令执行结果<br/>
          ‘节点’执行：执行指令时不登录设备，返回本系统前置节点机上的指令执行结果
        </p>
      )
    },
    handlerChange (Dom) {
      switch (Dom) {
        case 'assignUser':
          this.scriptExecute.assignUser = !this.scriptExecute.assignUser
          break
        case 'become':
          if (this.scriptExecute.bmcExec) {
            break
          }
          this.$refs.bmcExec.style.cursor = 'default'
          this.scriptExecute.become = !this.scriptExecute.become
          if (this.scriptExecute.become) {
            this.$refs.bmcExec.style.cursor = 'not-allowed'
          }
          break
        case 'bmcExec':
          if (this.scriptExecute.become) {
            break
          }
          this.$refs.become.style.cursor = 'default'
          this.scriptExecute.bmcExec = !this.scriptExecute.bmcExec
          if (this.scriptExecute.bmcExec) {
            this.$refs.become.style.cursor = 'not-allowed'
          }
          break
        case 'localExec1':
          this.scriptExecute.localExec = false
          break
        case 'localExec2':
          this.scriptExecute.localExec = true
          break
      }
    },
    onInput1 (state) {
      if (this.rootTree.filterText) {
        // 存在过滤文案，才启用过滤
        this.rootTree.filter = (node) => {
          const rs =
            node.data.label.indexOf(this.rootTree.filterText) >= 0
          // 命中的节点会强制展示
          // 命中节点的路径节点会锁定展示
          // 未命中的节点会隐藏
          return rs
        }
      } else {
        // 过滤文案为空，则还原 tree 为无过滤状态
        this.rootTree.filter = null
      }
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

/deep/ .pzx .t-card__body
  padding: 0!important
  margin: -1px 0

/deep/ .t-card--bordered
  border-radius: 0!important

.check_box
  position: relative
  min-width: 80px
  padding: 0 15px
  text-align: center
  font-size: 12px
  height: 30px
  border: 1px solid #266eff
  transition: all .5s
  display: inline-block
  line-height: 30px
  color: rgba(38, 110, 255, 1)
  user-select: none

.check_box_single
  position: relative
  min-width: 80px
  padding: 0 15px
  text-align: center
  font-size: 12px
  height: 30px
  border: 1px solid #266eff
  transition: all .5s
  display: inline-block
  line-height: 30px
  color: rgba(38, 110, 255, 1)
  user-select: none

.check_box::before
  content: ''!important
  position: absolute!important
  width: 0!important
  height: 0!important
  right: -2px!important
  top: -2px!important
  border-top: 5px solid transparent!important
  border-left: 5px solid transparent!important
  border-right: 5px solid transparent!important
  border-bottom: 5px solid #b3ccff!important
  transform: rotate(45deg)!important

.un_check_box
  min-width: 80px
  padding: 0 15px
  text-align: center
  height: 30px
  font-size: 12px
  border: 1px solid #e7e7e7
  color: rgba(177, 177, 177, 1)
  transition: all .5s
  display: inline-block
  line-height: 30px
  user-select: none

.drawer_active
  position: absolute
  top: 50%
  right: 34%
  width: 50px
  padding: 15px 14px 15px 7px
  padding-top: -2px
  height: 56px
  border-radius: 50%
  z-index: 99
  cursor: pointer
  transition: all .4s
</style>
