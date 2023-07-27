<template>
  <base-content>
    <div class="p-4">
      <div
        class="p-6 pt-8 bg-white"
        style="border-radius: 5px; min-height: 600px"
      >
        <t-steps :current="current" :onChange="onCurChanged">
          <t-step-item
            :title="item"
            v-for="(item, index) in curTab"
            :key="index"
            :content="item"
          >
          </t-step-item>
        </t-steps>
        <span class="card-title ml-4">{{ curTab[current] }}</span>
        <t-card :bordered="false" class="p-0" v-show="current === 0">
          <div class="l-row l-col-12 l-items-center">
            <span class="l-col-1 pr-5">任务名称：</span>
            <t-input class="l-col-6" ref="form1" v-model="formData.jobName" />
          </div>
          <div class="l-row l-col-12 l-items-center my-6">
            <span class="l-col-1 pr-5">执行方式：</span>
            <span style="display: inline-block">自动执行</span>
          </div>
          <div class="l-row l-col-12 l-items-center my-6">
            <span class="l-col-1 pr-5">执行时间：</span>
            <t-date-picker
              class="l-col-2"
              enable-time-picker
              clearable
              v-model="config.date"
              :presets="{ 现在: new Date() }"
            />
          </div>
          <div class="l-row l-col-12 l-items-center my-6">
            <span class="l-col-1 pr-5">超时时间：</span>
            <!-- <t-input
            class="l-col-2"
               v-model="formData.jobTimeout"
               clearable
              type="number"
              placeholder="默认超时时间:120s"
            /> -->
            <t-input-number
              placeholder="默认超时时间:120s"
              class="l-col-2"
              v-model="formData.jobTimeout"
              theme="column"
            ></t-input-number>
          </div>
          <div class="ml-4">
            <t-button size="medium" variant="base" @click="nextStep('done1')"
              >下一步</t-button
            >
          </div>
        </t-card>
        <!--  -->
        <t-card :bordered="false" class="p-0" v-show="current === 1">
          <div class="l-row l-col-12 mt-4 ml-4">
            <t-button
              size="medium"
              class="mr-4"
              theme="primary"
              ghost
              content="选择验收项"
              @click="showAccept"
            />
            <t-button
              size="medium"
              class="mr-4"
              theme="warning"
              ghost
              content="移出选中"
              @click="removeAcceptionItem"
            />
          </div>
          <div class="mt-4">
            <vxe-grid
              ref="inspectTable"
              id="inspectTable"
              class="sortable-row-demo col-7 col-md-7"
              :scroll-y="{ enabled: false }"
              empty-text="暂无验收项信息！"
              border="inner"
              align="left"
              auto-resize
              keep-source
              resizable
              max-height="500"
              size="mini"
              :columns="itemTable.column"
              :loading="itemTable.loading"
              :checkbox-config="{ reserve: true }"
              :data="itemTable.infoDataPages"
              row-id="id"
              row-key
              :print-config="{}"
            >
            <template #default>
                <t-tooltip class="placement bottom" content="移动验收项">
                  <t-button variant="text" shape="circle"
                  class="drag-btn"
                  style="cursor: move"
                  name="api">
                  <BulletpointIcon></BulletpointIcon>
                </t-button>
              </t-tooltip>
              </template>
              <template #operator="{ row }">
                <t-tooltip class="placement bottom" content="查看对应脚本">
                  <t-button variant="text" shape="circle"
                  @click="showJobInfo(row.id)"
                  >
                  <BrowseIcon></BrowseIcon>
                </t-button>
              </t-tooltip>
              </template>
            </vxe-grid>
            <vxe-pager
              class="mt-4"
              size="mini"
              :current-page="itemPages.current"
              :page-size="itemPages.size"
              :total="itemPages.total"
              :page-sizes="itemPages.pageSizeList"
              :page-count="5"
              @page-change="pagesLimit"
            >
            </vxe-pager>
          </div>
          <div class="ml-4">
            <t-button
              class="mr-4"
              size="medium"
              theme="default"
              variant="base"
              @click.stop="backStep('done2')"
              >上一步</t-button
            >
            <t-button size="medium" variant="base" @click="nextStep('done2')"
              >下一步</t-button
            >
          </div>
        </t-card>
        <t-card :bordered="false" class="p-0" v-show="current === 2">
          <div class="ml-4">
            <t-form @submit="deviceSearch">
              <div class="l-row l-col-12">
                <div class="l-row l-col-3 l-items-center">
                  <span class="l-col-2 pr-1">设备名称：</span>
                  <t-input
                    v-model="deviceFilter.hostName"
                    clearable
                    style="width: 70%"
                  />
                </div>
                <div class="l-row l-col-3 l-items-center">
                  <span class="l-col-2">管理Ip：</span>
                  <t-input
                    v-model="deviceFilter.osIp"
                    clearable
                    style="width: 70%"
                  />
                </div>
                <div class="l-row l-col-3 l-items-center">
                  <span class="l-col-2">硬管Ip：</span>
                  <t-input
                    v-model="deviceFilter.bmcIp"
                    clearable
                    style="width: 70%"
                  />
                </div>
                <div class="l-row l-col-3">
                  <t-button
                    class="mr-4"
                    style="height: 32px"
                    theme="primary"
                    type="submit"
                    content="查询"
                  />
                  <t-button
                    size="medium"
                    ghost
                    style="height: 32px"
                    theme="primary"
                    content="选择设备"
                    @click="dialog.hostComp = true"
                  />
                </div>
              </div>
            </t-form>
          </div>
          <div class="mt-4">
            <vxe-table
              ref="infoTable"
              id="infoTable"
              :tooltip-config="{ showAll: true }"
              empty-text="暂无设备信息！"
              border="inner"
              auto-resize
              keep-source
              highlight-hover-row
              highlight-hover-column
              resizable
              max-height="500"
              size="mini"
              :loading="table.loading"
              :import-config="{}"
              :export-config="{}"
              :checkbox-config="{ reserve: true }"
              :data="table.infoDataPage"
              row-id="id"
            >
              <vxe-table-column
                v-for="(config, index) in table.column"
                :key="index"
                v-bind="config"
                :formatter="
                  config.formatList
                    ? ['formatField', dict[config.formatList]]
                    : ''
                "
              ></vxe-table-column>
            </vxe-table>
            <vxe-pager
              class="mt-4"
              size="small"
              :current-page="pages.currentPage"
              :page-size="pages.pageSize"
              :total="pages.totalResult"
              :page-sizes="pages.pageSizeList"
              @page-change="pagesLimit"
            >
            </vxe-pager>
          </div>
          <div class="ml-4">
            <t-button
              class="mr-4"
              size="medium"
              theme="default"
              variant="base"
              @click.stop="backStep('done3')"
              >上一步</t-button
            >
            <t-button
              class="mr-4"
              size="medium"
              style="padding: 0 10px"
              theme="primary"
              content="下一步"
              @click="nextStep('done3')"
            />
          </div>
        </t-card>
        <!--  -->
        <t-card :bordered="false" class="p-0" v-show="current === 3">
          <div class="ml-4">
            <div class="l-row l-col-12 l-items-center">
              <t-checkbox v-model="toggleStatus.isAssignUser"
                >指定执行账号</t-checkbox
              >
            </div>
            <div class="mt-6" v-show="toggleStatus.isAssignUser">
              <div class="l-row l-col-12 l-items-center">
                <span class="mr-4 text-weight-bold">用户名：</span>
                <t-input
                  v-model="formData.execUser"
                  clearable
                  style="width: 300px"
                />
                <span class="mx-4 text-weight-bold">密码：</span>
                <t-input
                  v-model="formData.execPass"
                  clearable
                  style="width: 300px"
                />
              </div>
            </div>
            <div class="mt-6">
              <t-checkbox v-model="toggleStatus.isBecome">提权</t-checkbox>
            </div>
            <div
              v-show="toggleStatus.isBecome"
              class="l-row mt-6 l-items-center"
            >
              <span class="text-weight-bold mr-4">提权方式：</span>
              <t-radio-group v-model="formData.becomeMethod">
                <t-radio-button size="medium" value="su">su</t-radio-button>
                <t-radio-button size="medium " value="sudo">sudo</t-radio-button>
              </t-radio-group>
            </div>
            <div class="mt-6" v-show="toggleStatus.isBecome">
              <div class="l-row l-col-12 l-items-center">
                <span class="mr-4 text-weight-bold">提权账号：</span>
                <t-input
                  v-model="formData.becomeUser"
                  clearable
                  placeholder="默认账号：root"
                  style="width: 300px"
                />
                <span class="q-mx-md text-weight-bold">提权密码：</span>
                <t-input
                  v-model="formData.becomePass"
                  clearable
                  placeholder="系统不保存密码，需要执行时输入"
                  style="width: 300px"
                />
              </div>
            </div>
            <div class="mt-6">
              <t-checkbox v-model="toggleStatus.isBmc"
                >通过BMC IP执行</t-checkbox
              >
            </div>
            <div class="mt-6">
              <t-checkbox v-model="toggleStatus.isIgnore"
                >忽略错误执行下一步骤</t-checkbox
              >
              <!-- <q-checkbox
                v-model="toggleStatus.isIgnore"
                dense
                keep-color
                label="忽略错误执行下一步骤"
                color="primary"
              /> -->
            </div>
            <div class="l-row mt-6">
              <span
                class="mr-4"
                :class="
                  !toggleStatus.isDelegateToLocal
                    ? 'text-primary'
                    : 'text-black'
                "
                :style="
                  !toggleStatus.isDelegateToLocal ? 'font-weight: bolder' : ''
                "
                >远端</span
              >
              <t-switch
                size="large"
                v-model="toggleStatus.isDelegateToLocal"
                class="mr-4"
              ></t-switch>
              <span
                class="mr-4"
                :class="
                  toggleStatus.isDelegateToLocal ? 'text-primary' : 'text-black'
                "
                :style="
                  toggleStatus.isDelegateToLocal ? 'font-weight: bolder' : ''
                "
                >节点</span
              >
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
                    margin-top: 2px;
                  "
                  >i</span
                >
              </t-tooltip>
            </div>
          </div>
          <div class="ml-4 mt-6">
            <t-button
              class="mr-4"
              size="medium"
              theme="default"
              variant="base"
              @click.stop="backStep('done4')"
              >上一步</t-button
            >
            <t-button
              class="mr-4"
              size="medium"
              style="padding: 0 10px"
              theme="primary"
              content="提交"
              @click="saveTask"
            />
          </div>
        </t-card>
        <t-dialog
          :visible.sync="dialog.checkTree"
          header="选择验收项"
          placement="center"
          width="680px"
          preventScrollThrough
          @cancel="dialog.checkTree=false"
          @confirm="acceptItemConfirm"
        >
          <t-card
            class="mr-4"
            style="height: 550px; border-radius: 0px"
            :bordered="false"
          >
            <div class="l-row l-items-center mb-4">
              <span class="l-col-1" style="text-align: left; padding: 0px 3px"
                >验收项</span
              >
              <t-input
                class="l-col-11"
                v-model="checkTree.filterText"
                style="padding-left: 20px"
                @change="onInput"
              ></t-input>

            </div>
            <div class="l-row">
              <span class="l-col-1" style="text-align: left; padding: 0px 3px"
                >&nbsp;
              </span>
              <div class="l-col-11" style="padding: 0; padding-left: 20px">
                <t-card class="p-2" style="min-height: 500px !important">
                  <t-tree
                    ref="inspectTree"
                    expand-on-click-node
                :expand-level="2"
                    :allowFoldNodeOnFilter="false"
                    :data="checkTree.infoData"
                    :value.sync="checkTree.checked"
                    :filter="checkTree.filter"
                    :keys="{ value: 'id' }"
                    checkable
                  >
                    <template #label="{ node }">
                      <div
                        v-if="aiList.includes(node.label)"
                        class="row items-center vertical-middle"
                      >
                      <!-- <Icon v-if="node.getChildren()" name="folder"></Icon> -->
                        <span class="mr-4">{{ node.label }}</span>
                        <span class="text-white bg-green-400 px-2">★AI</span>
                      </div>
                      <div v-else>
                        <!-- <Icon v-if="node.getChildren()" name="folder"></Icon> -->
                      <svg-icon class="mr-2" v-if="node.getChildren()" name="filder" style="display:inline-block;"></svg-icon>
                        <span>{{ node.label }}</span>
                      </div>
                    </template>
                  </t-tree>
                </t-card>
              </div>
            </div>
            <!-- <q-tree
                  ref="itemTree"
                  class="l-col-12"
                  :nodes="checkTree.infoData"
                  node-key="id"
                  tick-strategy="leaf"
                  :filter="checkTree.filter"
                  :ticked.sync="checkTree.checked"
                >
                  <template v-slot:default-header="prop">
                    <div
                      v-if="aiList.includes(prop.node.label)"
                      class="row items-center vertical-middle"
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
                </q-tree> -->
            <!-- <div class="l-row col-12 justify-end">
                <t-button
                  content="保存"
                  v-close-popup
                  @click="acceptItemConfirm"
                ></t-button>
              </div> -->
          </t-card>
        </t-dialog>
        <t-dialog
          header="设备选择"
          placement="center"
          width="90%"
          preventScrollThrough
          :visible.sync="dialog.hostComp"
          :footer="false"
        >
          <Host :hostList.sync="selectHost" @hostCheck="hostCompCtl"></Host>
        </t-dialog>
        <t-dialog
          placement="center"
          :visible.sync="dialog.jobInfo"
          header="脚本内容"
          width="1000px"
          :footer="false"
        >
          <t-card
            style="min-width: 640px; border-radius: 0px"
            :bordered="false"
          >
            <codemirror ref="CodeEdit" v-model="code" :options="cmOptions" />
          </t-card>
        </t-dialog>
      </div>
    </div>
  </base-content>
</template>

<script>
import Sortable from 'sortablejs'
import Host from '@/components/Selector/Host'
import {
  getListAPI,
  getListByIdAPI,
  getInspectSciptAPI
} from '@/api/inops/inspect/inspectItem'
import { loopGroup } from '@/utils/inops/groupTree'
import { expreOfOnly } from '@/utils/inops/toExpression'
import { transToQuarts } from '@/utils/inops/transExpression'
import { getDictList } from '@/utils/inops/u'
import {
  getHostByTaskIdAPI,
  getInspectItemByTaskIdAPI
} from '@/api/inops/inspect/inspectTask'
import { saveTaskAPI, getTaskByIdAPI } from '@/api/inops/accept/accept'
import { codemirror } from 'vue-codemirror' // 引入组件
import { codeConfig } from '@/utils/inops/codeConfig'
import BaseContent from '@/Layout/components/BaseContent/BaseContent'
import { BrowseIcon, BulletpointIcon } from 'tdesign-icons-vue'

export default {
  name: 'auto',
  components: { BaseContent, codemirror, Host, BrowseIcon, BulletpointIcon },
  data () {
    return {
      dict: {
        resourcePool: [],
        hostRoom: [],
        hostType: []
      },
      current: 0,
      curTab: ['基础配置', '验收项选择', '设备配置', '参数配置'],
      stepper: {
        step: 1,
        done1: false,
        done2: false,
        done3: false,
        done4: false
      },
      formData: {
        jobName: '',
        items: [],
        inspectHosts: [],
        runOnly: '0',
        jobExpression: '',
        jobTimeout: '',
        assignUser: '0',
        execUser: '',
        execPass: '',
        bmcExecute: '0',
        ignoreErrors: '1',
        delegateToLocal: '0',
        type: 'accept'
      },
      config: {
        type: '0',
        timeWithSeconds: '',
        quart: 'onDay',
        isInterVal: false,
        interVal: {
          start: '',
          end: '',
          duration: ''
        },
        week: {
          label: '星期一',
          value: '2'
        },
        month: {
          label: '1',
          value: '1'
        },
        date: ''
      },
      toggleStatus: {
        isAssignUser: false,
        isBecome: false,
        isBmc: false,
        isIgnore: true,
        isDelegateToLocal: false
      },
      aiList: [
        '计算服务器光模块验收',
        '计算服务器物理端口可靠性验收',
        '计算服务器计算性能状态验收',
        '存储服务器光模块验收',
        '存储服务器存储性能状态验收',
        '网络设备物理端口可靠性验收',
        '网络设备光模块验收',
        '虚层关键组件可靠性验收'
      ],
      table: {
        loading: false,
        infoData: [],
        infoDataPage: [],
        column: [
          { type: 'checkbox', align: 'center', width: '40' },
          { type: 'seq', title: '序号', align: 'center', width: '60' },
          {
            field: 'hostName',
            title: '设备名称',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'osIp',
            title: '管理IP',
            align: 'left',
            type: 'html',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'bmcIp',
            title: '硬管IP',
            align: 'left',
            type: 'html',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'hostRoom',
            title: '所属机房',
            formatList: 'hostRoom',
            align: 'center',
            type: 'html',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'resourcePool',
            title: '资源池',
            formatList: 'resourcePool',
            align: 'center',
            type: 'html',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'hostType',
            title: '设备类型',
            formatList: 'hostType',
            align: 'center',
            type: 'html',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          }
        ]
      },
      pages: {
        pageSizeList: [
          10,
          50,
          100,
          500,
          1000,
          2000,
          { label: '全部', value: '' }
        ],
        totalResult: 0,
        currentPage: 1,
        pageSize: 10,
        align: 'right'
      },
      itemTable: {
        loading: false,
        infoData: [],
        infoDataPages: [],
        column: [
          { type: 'checkbox', align: 'center', width: '40' },
          { slots: { default: 'default' }, width: 60, align: 'center' },
          { type: 'seq', title: '序号', align: 'center', width: '60' },
          {
            field: 'name',
            title: '验收项名称',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            field: 'description',
            title: '验收项描述',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true
          },
          {
            title: '操作',
            slots: { default: 'operator' },
            align: 'center',
            width: '150'
          }
        ]
      },
      itemPages: {
        pageSizeList: [
          10,
          50,
          100,
          500,
          1000,
          2000,
          { label: '全部', value: '' }
        ],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      dialog: {
        itemTree: false,
        hostComp: false,
        jobInfo: false,
        script: false,
        host: false,
        checkTree: false
      },
      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },
      checkTree: {
        filter: null,
        filterText: '',
        infoData: [],
        checked: []
      },
      checkFilter: '',
      selectHost: [],
      code: '',
      cmOptions: codeConfig('', true),
      deviceFilter: {
        hostName: '',
        osIp: '',
        bmcIp: ''
      }
    }
  },
  watch: {
    'stepper.step': {
      handler (newVal) {
        if (newVal === 2) {
          this.rowDrop()
        }
      },
      deep: true
    },
    'dialog.jobInfo': {
      handler (newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.$refs.CodeEdit.codemirror.setSize(
              'auto',
              window.screen.height * 0.8
            )
          })
        }
      }
    }
  },
  async mounted () {
    if (this.$route.query.id) {
      this.getTaskById(this.$route.query.id)
    }
    await this.getDict()
  },
  methods: {
    async getDict () {
      const keys = Object.keys(this.dict)
      for (const item of keys) {
        this.dict[item] = await getDictList(item)
      }
    },
    rowDrop () {
      this.$nextTick(() => {
        const xTable = this.$refs.inspectTable
        this.sortable1 = Sortable.create(
          xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'),
          {
            handle: '.drag-btn',
            onEnd: ({ newIndex, oldIndex }) => {
              const currRow = this.itemTable.infoData.splice(oldIndex, 1)[0]
              this.itemTable.infoData.splice(newIndex, 0, currRow)
              const currRow1 = this.itemTable.InfoDataPage.splice(
                oldIndex,
                1
              )[0]
              this.itemTable.InfoDataPage.splice(newIndex, 0, currRow1)
            }
          }
        )
      })
    },
    async getAcceptionItem () {
      const data = {
        type: 'accept'
      }
      await getListAPI(data).then((response) => {
        const { data } = response
        if (data.code === 200) {
          this.checkTree.infoData = loopGroup(data.data, 'name', 'treeType')
        }
      })
    },
    getAcceptionItemById (id) {
      return new Promise((resolve) => {
        getListByIdAPI(id).then((response) => {
          const { data } = response
          if (data.code === 200) {
            resolve(data.data)
          }
        })
      }).then((value) => {
        return value
      })
    },
    getTaskById (id) {
      getTaskByIdAPI(id).then((response) => {
        const d = response.data
        if (d.code === 200) {
          const { data } = d
          this.formData = data
          this.toggleStatus.isAssignUser = data.assignUser === '1'
          this.toggleStatus.isBmc = data.bmcExecute === '1'
          this.toggleStatus.isIgnore = data.ignoreErrors === '1'
          this.toggleStatus.isDelegateToLocal = data.delegateToLocal === '1'
          if (data.jobExpression !== '') {
            this.config = transToQuarts(data.jobExpression)
          }
        }
      })
      getHostByTaskIdAPI(id).then((response) => {
        const { data } = response
        if (data.code === 200) {
          this.formData.inspectHosts = []
          this.table.infoData = []
          data.data.forEach((item) => {
            this.formData.inspectHosts.push({
              id: item.id
            })
          })
          this.table.infoData = data.data
          this.selectHost = data.data
          this.setHostItem()
        }
      })
      getInspectItemByTaskIdAPI(id).then(async (response) => {
        const { data } = response
        if (data.code === 200) {
          this.itemTable.infoData = []
          this.itemTable.InfoDataPage = []
          this.formData.items = []
          this.checkTree.checked = []
          await data.data.forEach((item) => {
            this.formData.items.push({
              inspectItem: {
                id: item.inspectItem.id
              }
            })
            this.checkTree.checked.push(item.inspectItem.id)
            this.itemTable.infoData.push(item.inspectItem)
          })
          this.setAcceptionItem()
        }
      })
    },
    getJobById (id) {
      getInspectSciptAPI(id).then((response) => {
        const { data } = response
        if (data.code === 200) {
          if (data.data) {
            this.code = data.data.code
            this.cmOptions = codeConfig(data.data.lang, true)
          } else {
            this.code = ''
          }
        }
      })
    },
    backStep (done) {
      this.stepper[done] = false
      // this.stepper.step = step
      this.current--
    },
    nextStep (done, cur) {
      if (done === 'done1') {
        if (!this.formData.jobName) {
          this.$message.warning({ content: '验收任务名称不能为空', placement: 'center' })
          return false
        } else if (!this.config.date) {
          this.$message.warning({ content: '请选择任务执行时间', placement: 'center' })
          return false
        }
      } else if (done === 'done2') {
        if (this.itemTable.infoData.length === 0) {
          this.$message.warning({ content: '验收项不能为空', placement: 'center' })
          return false
        } else {
          this.formData.inspectTasks = []
          for (const item of this.itemTable.infoData) {
            this.formData.inspectTasks.push({
              inspectItem: {
                id: item.id
              }
            })
          }
        }
      } else if (done === 'done3') {
        if (this.formData.inspectHosts.length === 0) {
          this.$message.warning({ content: '验收设备不能为空', placement: 'center' })
          return false
        }
      }
      this.stepper[done] = true
      // this.stepper.step = step
      if (cur >= 0) {
        this.current = cur
      } else {
        this.current++
      }
    },
    setAcceptionItem () {
      this.itemPages.total = this.itemTable.infoData.length
      this.itemTable.infoDataPages = this.itemTable.infoData.slice(
        (this.itemPages.current - 1) * this.itemPages.size,
        this.itemPages.current * this.itemPages.size
      )
      const index = this.itemPages.pageSizeList.findIndex(
        (item) => item.label === '全部'
      )
      this.itemPages.pageSizeList[index].value = this.itemPages.total
    },
    setHostItem () {
      this.pages.totalResult = this.table.infoData.length
      this.table.infoDataPage = this.table.infoData.slice(
        (this.pages.currentPage - 1) * this.pages.pageSize,
        this.pages.currentPage * this.pages.pageSize
      )
      const index = this.pages.pageSizeList.findIndex(
        (item) => item.label === '全部'
      )
      this.pages.pageSizeList[index].value = this.pages.totalResult
    },
    transQuartzExpression () {
      this.formData.jobExpression = expreOfOnly(this.config.date)
    },
    removeAcceptionItem () {
      const selectRecords = this.$refs.inspectTable.getCheckboxRecords()
      if (selectRecords.length) {
        this.$XModal.confirm('您确定要删除选中的数据吗?').then((type) => {
          if (type === 'confirm') {
            selectRecords.forEach((v) => {
              const index = this.itemTable.infoData.findIndex(
                (item) => item.id === v.id
              )
              this.itemTable.infoData.splice(index, 1)
              const index2 = this.checkTree.checked.findIndex(
                (t) => t === v.id
              )
              this.checkTree.checked.splice(index2, 1)
            })
            this.setAcceptionItem()
          }
        })
      } else {
        this.$XModal.message({
          message: '请至少选择一条数据',
          status: 'error'
        })
      }
    },
    showJobInfo (id) {
      this.getJobById(id)
      this.dialog.jobInfo = true
    },
    async saveTask () {
      this.stepper.done4 = true
      await this.transQuartzExpression()
      saveTaskAPI(this.formData).then((response) => {
        const { data } = response
        if (data.code === 200) {
          this.$message.success({ content: '保存成功', placement: 'center' })
          this.$router.push({
            path: '/inops/autoAcceptance/manage'
          })
        } else {
          this.$message.error({ content: data.message, placement: 'center' })
        }
      })
    },
    itemPagesLimit ({ currentPage, pageSize }) {
      this.pages.current = currentPage
      this.pages.size = pageSize
      this.setAcceptionItem()
    },
    pagesLimit ({ currentPage, pageSize }) {
      this.pages.current = currentPage
      this.pages.size = pageSize
      this.setHostItem()
    },
    async showAccept () {
      await this.getAcceptionItem()
      this.dialog.checkTree = true
      // this.$nextTick(() => {
      //   this.$refs.inspectTree.setExpanded(
      //     '5194d081fc3b49c18a5be99f0fe79d81',
      //     true
      //   )
      //   this.$refs.inspectTree.setExpanded(
      //     'fe65133efb01411c9a5990d5d92c9e1b',
      //     true
      //   )
      // })
    },
    async acceptItemConfirm () {
      this.itemTable.loading = true
      for (const item of this.checkTree.checked) {
        await this.getAcceptionItemById(item).then((response) => {
          if (response.treeType === '1') {
            const index = this.itemTable.infoData.findIndex(
              (item) => item.id === response.id
            )
            if (index === -1) {
              this.itemTable.infoData.push(response)
            }
          }
        })
      }
      this.setAcceptionItem()
      this.itemTable.loading = false
      this.dialog.checkTree = false
    },
    hostCompCtl (data) {
      this.table.infoData = data
      this.formData.inspectHosts = []
      data.forEach((item) => {
        this.formData.inspectHosts.push({
          id: item.id
        })
      })
      this.setHostItem()
      this.dialog.hostComp = false
    },
    deviceSearch () {
      this.table.loading = true
      this.table.infoDataPage = []
      let hostNameList = []
      let osIpList = []
      let bmcIpList = []
      hostNameList = this.table.infoData.filter((item) => {
        return item.hostName.indexOf(this.deviceFilter.hostName) > -1
      })
      if (this.deviceFilter.osIp) {
        osIpList = this.hostTable.infoData.filter((item) => {
          if (item.osIp) {
            return item.osIp.indexOf(this.deviceFilter.osIp) > -1
          }
        })
      }
      if (this.deviceFilter.bmcIp) {
        bmcIpList = this.hostTable.infoData.filter((item) => {
          if (item.bmcIp) {
            return item.bmcIp.indexOf(this.deviceFilter.bmcIp) > -1
          }
        })
      }
      this.table.infoDataPage = [...hostNameList, ...osIpList, ...bmcIpList]
      this.pages.totalResult = this.table.infoDataPage.length
      const index = this.pages.pageSizeList.findIndex(
        (item) => item.label === '全部'
      )
      this.pages.pageSizeList[index].value = this.pages.totalResult
      this.table.loading = false
    },
    onCurChanged (cur, pre) {
      this.nextStep(`done${cur}`, cur)
      // this.current = cur
      // console.log('TDesign Steps:', `current: ${cur}, previous: ${pre}`)
    },
    renderContent () {
      return (
        <p style="font-size:12px;padding:2px!important">
          ‘远端’执行（默认）：执行指令时会登录设备，返回目标设备上的指令执行结果
        <br />
          ‘节点’执行：执行指令时不登录设备，返回本系统前置节点机上的指令执行结果
        </p>
      )
    },
    onInput (state) {
      console.info('onInput:', state)
      if (this.checkTree.filterText) {
        // 存在过滤文案，才启用过滤
        this.checkTree.filter = (node) => {
          const rs = node.data.label.indexOf(this.checkTree.filterText) >= 0
          // 命中的节点会强制展示
          // 命中节点的路径节点会锁定展示
          // 未命中的节点会隐藏
          return rs
        }
      } else {
        // 过滤文案为空，则还原 tree 为无过滤状态
        this.checkTree.filter = null
      }
    },
    icon (createElement, node) {
      let name = 'file'
      if (node.getChildren()) {
        if (node.expanded) {
          name = 'folder-open'
          if (node.loading) {
            name = 'loading'
          }
        } else {
          name = 'folder'
        }
      }
      return <Icon name={name} />
    }
  }
}
</script>

<style lang="sass" scoped>

.card-title
  display: block
  width: 100%
  height: 21px
  font-size: 14px
  font-weight: 800
  font-family: "思源黑体"
  letter-spacing: 0px
  padding-left: 14px
  color: rgba(0, 0, 0, 1)
  margin: 41px 0 22px 0px
  border-left: 2px solid  rgba(22, 93, 255, 1)

/deep/ .p-0 .t-card__body
  padding: 0
/deep/ .t-card  span
  font-size: 12px
  font-weight: 400
  text-align: right
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap

.t-radio-group.t-radio-group__outline .t-radio-button
  width: 88px

.t-radio-group.t-radio-group__outline .t-radio-button .t-radio-button__label
  margin: 0 atuo

/deep/ .t-card__body
  padding: 0!important
</style>
