<template>
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
        <div class="l-row l-col-12 l-l-items-center">
          <span class="l-col-1 pr-5">任务名称：</span>
          <t-input class="l-col-6" ref="form1" v-model="formData.jobName" />
        </div>
        <div class="l-row l-col-12 l-l-items-center my-6">
          <span class="l-col-1 pr-5">执行方式：</span>
          <t-radio-group v-model="executeParams.type">
            <t-radio-button value="manual">手动执行</t-radio-button>
            <t-radio-button value="auto">自动执行</t-radio-button>
          </t-radio-group>
        </div>
        <div
          class="l-row l-col-12 l-l-items-center my-6"
          v-if="executeParams.type !== 'manual'"
        >
          <span class="l-col-1 pr-5">执行时间：</span>
          <t-date-picker
            class="l-col-2"
            enable-time-picker
            clearable
            v-model="config.date"
            :presets="{ 现在: new Date() }"
          />
        </div>
        <div
          class="l-row l-col-12 l-l-items-center my-6"
          v-if="executeParams.type !== 'manual'"
        >
          <span class="l-col-1 pr-5">超时时间：</span>
          <t-input-number
            placeholder="默认超时时间:120s"
            class="l-col-2"
            v-model="formData.jobTimeout"
            theme="column"
          ></t-input-number>
        </div>
        <div class="ml-4 mt-4">
          <t-button size="medium" variant="base" @click="nextStep('2')"
            >下一步</t-button
          >
        </div>
      </t-card>
      <!--  -->
      <t-card :bordered="false" class="p-0" v-show="current === 1">
        <div class="l-row l-col-12 ml-4">
          <span class="mr-2" style="display: inherit">变更场景：</span>
          <t-select
            class="mr-4"
            v-model="scene.major"
            clearable
            :options="[
              { label: '计算专业', value: '计算专业' },
              { label: '存储专业', value: '存储专业' },
              { label: '网络专业', value: '网络专业' },
            ]"
            style="width: 200px"
          ></t-select>
          <t-select
            class="mr-4"
            v-model="scene.type"
            clearable
            :options="[
              { label: '硬件变更', value: '硬件变更' },
              { label: '软件变更', value: '软件变更' },
            ]"
            style="width: 200px"
          ></t-select>
          <t-button
            unelevated
            class="l-items-center l-vertical-middle"
            content="查询"
            theme="primary"
            style="height: 32px"
            @click="changeItemSearch"
          ></t-button>
        </div>
        <div class="mt-4">
          <vxe-table
            class="text-black"
            auto-resize
            keep-source
            highlight-hover-row
            highlight-hover-column
            ref="itemTable"
            id="itemTable"
            row-id="id"
            empty-text="暂无变更项信息！"
            border="inner"
            align="left"
            max-height="350"
            size="mini"
            :column-config="{ resizable: true }"
            :tooltip-config="{ showAll: true }"
            :loading="table.loading"
            :checkbox-config="{ reserve: true }"
            :data="table.infoData"
          >
            <vxe-table-column
              v-for="(config, index) in table.column"
              :key="index"
              v-bind="config"
            />
            <vxe-table-column field="operation" title="操作" align="center">
              <template v-slot="{ row }">
                <t-button
                  content="查看编辑脚本"
                  ghost
                  @click="showJobInfo(row.id)"
                />
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
        <div class="ml-4 mt-4">
          <t-button size="medium" variant="base" @click="current = 2"
            >下一步</t-button
          >
        </div>
      </t-card>
      <!--  -->
      <t-card :bordered="false" class="p-0" v-show="current === 2">
        <div class="l-row l-items-center l-vertical-middle">
          <span class="l-col-1"
            ><span class="text-red">*</span> 选择资源池：</span
          >
          <t-select
            v-model="resourcePool"
            :options="resourcePoolOptions"
            @input="resourceCheck"
            style="width: 540px"
          ></t-select>
          <t-button
            class="ml-2 l-row l-items-center l-vertical-middle"
            :disable="!resourcePool"
            ghost
            content="变更前资源池整体健康度评估"
            style="height: 32px"
            @click="rpAccess"
          ></t-button>
        </div>
        <div class="l-row mt-4" v-show="formData.changeBeforeScore">
          <span class="l-col-1"></span>
          <div
            class="p-2 bg-blue-1 l-row l-items-center l-vertical-middle"
            style="border: 1px solid #2196f3"
          >
            <!-- <q-icon name="info" color="blue" size="14px"></q-icon> -->
            <div class="ml-2" style="letter-spacing: 2px">
              <span class="text-grey"
                >该资源池健康度得分<span
                  class="text-weight-bold"
                  :class="
                    formData.changeBeforeScore >= 80
                      ? 'text-positive'
                      : 'text-red-7'
                  "
                  style="font-size: 16px"
                  >{{ formData.changeBeforeScore }}</span
                >， 建议<span
                  class="text-weight-bold"
                  :class="
                    formData.changeBeforeScore >= 80
                      ? 'text-blue'
                      : 'text-red-7'
                  "
                  style="font-size: 14px"
                  >{{
                    formData.changeBeforeScore >= 80 ? "可以" : "不可以"
                  }}</span
                >
                进行变更检查动作</span
              >
            </div>
          </div>
        </div>
        <div class="l-row l-items-center l-vertical-middle mt-4">
          <span class="l-col-1"
            ><span class="text-red">*</span> 选择变更设备：</span
          >
          <t-select
            v-model="hostList"
            multiple
            :scroll="{ type: 'virtual' }"
            :options="hostListOptions"
            :disabled="resourcePool === ''"
            style="width: 540px"
            :minCollapsedNum="1"
            @popup-visible-change="onPopupVisibleChange"
          ></t-select>
          <span class="text-grey ml-2">已选 {{ hostList.length }} 台设备</span>
        </div>
        <template v-if="isAI">
          <div class="l-row l-col-12 mt-4">
            <span class="l-col-1"
              ><span class="text-red">*</span> 检查范围AI预测：</span
            >
            <div class="l-row l-col-6" style="border: 1px solid #e0e0e0">
              <div class="l-col-6 pr-6" style="border-right: 1px solid #e0e0e0">
                <div class="p-2 l-row l-items-center l-vertical-middle">
                  <!-- <q-icon name="info" color="orange" size="14px"></q-icon> -->
                  <span class="ml-2">预计影响设备</span>
                </div>
                <div
                  class="mt-6 ml-4 text-grey"
                  v-show="aiHostList.length === 0"
                >
                  暂无AI预测设备
                </div>
                <div
                  style="height: 230px; overflow: auto"
                  class="p-2"
                  v-show="aiHostList.length !== 0"
                >
                  <t-checkbox-group
                    v-model="aiHost"
                    :options="aiHostList"
                  ></t-checkbox-group>
                </div>
                <!-- <q-scroll-area
                  class="mt-6"
                  :thumb-style="thumbStyle"
                  v-show="aiHostList.length !== 0"
                  style="height: 200px"
                >
                  <div v-for="(item, index) in aiHostList" :key="index">
                    <q-checkbox
                      v-model="aiHost"
                      size="xs"
                      :label="item.hostName"
                      :val="item.id"
                    ></q-checkbox>
                  </div>
                </q-scroll-area> -->
                <div class="p-2 l-row l-items-center l-vertical-middle">
                  <t-button
                    @click="artificialAdd"
                    theme="primary"
                    class="my-4 ml-4"
                    >人工添加</t-button
                  >
                  <!-- <q-btn
                    class="my-4 ml-4"
                    unelevated
                    size="sm"
                    label="人工添加"
                    icon="add"
                    color="blue"
                    @click="artificialAdd"
                  ></q-btn> -->
                  <span class="ml-4 text-grey"
                    >已选{{ associateHost.length }}台设备</span
                  >
                </div>
              </div>
              <div class="l-col-6 pr-2">
                <div class="p-2 l-row l-items-center l-vertical-middle">
                  <span class="ml-2">预计引发告警</span>
                </div>
                <div
                  class="mt-6 ml-4 text-grey"
                  v-show="alarmList.length === 0"
                >
                  暂无AI预测引发告警
                </div>
                <div
                  style="height: 230px; overflow: auto"
                  class="px-4"
                  v-show="alarmList.length !== 0"
                >
                  <div v-for="(item, index) in alarmList" :key="index">
                    <span style="line-height: 28px; letter-spacing: 2px">{{
                      item
                    }}</span>
                  </div>
                </div>
                <!-- <q-scroll-area
                  v-show="alarmList.length !== 0"
                  class="mt-6 q-pl-md"
                  :thumb-style="thumbStyle"
                  style="height: 200px"
                >
                  <div v-for="(item, index) in alarmList" :key="index">
                    <span style="line-height: 28px; letter-spacing: 2px">{{
                      item
                    }}</span>
                  </div>
                </q-scroll-area> -->
              </div>
            </div>
          </div>
        </template>
        <div class="ml-4 mt-4">
          <t-button size="medium" variant="base" @click="nextStep('4')"
            >下一步</t-button
          >
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
          <div v-show="toggleStatus.isBecome" class="l-row mt-6 l-items-center">
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
              <span class="mx-2 text-weight-bold">提权密码：</span>
              <t-input
                v-model="formData.becomePass"
                clearable
                placeholder="系统不保存密码，需要执行时输入"
                style="width: 300px"
              />
            </div>
          </div>
          <div class="mt-6">
            <t-checkbox v-model="toggleStatus.isBmc">通过BMC IP执行</t-checkbox>
          </div>
          <div class="mt-6">
            <t-checkbox v-model="toggleStatus.isIgnore"
              >忽略错误执行下一步骤</t-checkbox
            >
          </div>
          <div class="l-row mt-6">
            <span
              class="mr-4"
              :class="
                !toggleStatus.isDelegateToLocal ? 'text-primary' : 'text-black'
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
            <t-tooltip class="placement bottom right" :content="renderContent">
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
            style="padding: 0 10px"
            theme="primary"
            :content="status !== '4' ? '保存配置' : '执行任务'"
            @click="executeBtn"
          />
        </div>
      </t-card>
    </div>
    <t-drawer
      :visible.sync="dialog.jobInfo"
      size="large"
      :onConfirm="() => (visible = false)"
      header="脚本内容"
    >
      <codemirror ref="CodeEdit" v-model="code" :options="cmOptions" />
    </t-drawer>
    <t-dialog
      placement="center"
      header="人工选择"
      :visible.sync="dialog.hostList"
      :onConfirm="null"
      :confirm-btn="null"
      :cancel-btn="null"
      :footer="false"
    >
      <div>
        <div>
          <div class="mb-2">
            <span><span class="text-red pb-2">*</span>选择关联类型</span>
            <div>
              <t-radio-group
                v-model="associateType"
                :options="[
                  { label: '可用区', value: 'AZ' },
                  { label: '主机组', value: 'HA' },
                  { label: '存储池', value: 'SP' },
                ]"
                allowUncheck
                @change="associateTypeChange"
              ></t-radio-group>
            </div>
          </div>
          <div>
            <span><span class="text-red pb-2">*</span>选择关联设备</span>
            <div
              v-show="associateHostList.length === 0"
              class="bg-grey-2 row l-items-center l-vertical-middle justify-center col-9"
              style="height: 450px; border: 1px solid #e0e0e0"
            >
              <span class="text-grey" style="letter-spacing: 3px"
                >暂无数据</span
              >
            </div>
            <div
              v-show="associateHostList.length !== 0"
              class="p-4 w-full"
              style="height: 450px; border: 1px solid #e0e0e0; overflow: auto"
            >
              <t-checkbox-group
                v-model="associateHost"
                :options="associateHostList"
              ></t-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import {
  getListAPI,
  getInspectSciptAPI,
} from "@/api/inops/inspect/inspectItem"
import { listPageAPI } from "@/api/inops/CMDB/cmdbDevice"
import { expreOfOnly } from "@/utils/inops/toExpression"
import { transToQuarts } from "@/utils/inops/transExpression"
import { getDictAPI } from "@/api/inops/dict"
import { getInspectItemByTaskIdAPI } from "@/api/inops/inspect/inspectTask"
import {
  saveTaskAPI,
  getTaskByIdAPI,
  getRelatedDevicesAPI,
  executeOnce,
  updateChangeStatusAPI,
} from "@/api/inops/change/change"
import { codemirror } from "vue-codemirror" // 引入组件
import { codeConfig } from "@/utils/inops/codeConfig"
import { rpHealthInspectAPI, changeForecastAPI } from "@/api/inops/AI/AI"
import { cloneDeep } from "lodash"

export default {
  name: "task",
  components: { codemirror },
  data() {
    return {
      status: 0,
      current: 0,
      curTab: ["基本配置", "变更项选择", "变更设备选择", "参数配置"],
      step: {
        step1: true,
        step2: false,
        step3: false,
        step4: false,
      },
      majorList: [
        { label: "计算专业", value: "srv" },
        { label: "存储专业", value: "dbs" },
        { label: "网络专业", value: "net" },
      ],
      formData: {
        jobName: "",
        inspectTasks: [],
        inspectHosts: [],
        aiHosts: "",
        customHosts: "",
        runOnly: "1",
        jobExpression: "",
        jobTimeout: "",
        assignUser: "0",
        execUser: "",
        execPass: "",
        bmcExecute: "0",
        ignoreErrors: "1",
        delegateToLocal: "0",
        type: "change",
        resourcePool: "",
        changeHosts: "",
        changeType: "",
        changeStatus: 1,
        changeMajor: "",
        changeBeforeScore: null,
      },
      executeParams: {
        type: "manual",
        options: [
          { label: "手动执行", value: "manual" },
          { label: "自动执行", value: "auto" },
        ],
      },
      config: {
        type: "0",
        date: "",
      },
      hostIds: "",
      changeItem: [],
      selectItem: [],
      scene: {
        major: "",
        majorOptions: ["计算专业", "存储专业", "网络专业"],
        type: "",
        typeOptions: ["硬件变更", "软件变更"],
      },
      resourcePool: "",
      spinner: false,
      resourcePoolOptions: [],
      hostList: [],
      hostListOptions: [],
      isAI: false,
      associateType: "",
      checkAll: false,
      aiCheckAll: false,
      thumbStyle: {
        right: "2px",
        borderRadius: "5px",
        backgroundColor: "#027be3",
        width: "5px",
        opacity: 0.75,
      },
      selectAssociate: [],
      associateHostList: [],
      associateHost: [],
      selectAIHost: [],
      aiHostList: [],
      alarmList: [],
      aiHost: [],
      table: {
        loading: false,
        infoData: [],
        column: [
          { type: "checkbox", align: "center", width: "40" },
          {
            field: "name",
            title: "变更项名称",
            formatType: "",
            formatList: "jobStatus",
            align: "left",
            showHeaderOverflow: true,
            showOverflow: "tooltip",
          },
          {
            field: "description",
            title: "变更项描述",
            align: "left",
            showHeaderOverflow: true,
            showOverflow: "tooltip",
          },
        ],
      },
      toggleStatus: {
        isAssignUser: false,
        isBecome: false,
        isBmc: false,
        isIgnore: true,
        isDelegateToLocal: false,
      },
      code: "",
      cmOptions: codeConfig("", true),
      dialog: {
        jobInfo: false,
        hostList: false,
      },
      jobId: "",
    }
  },
  async mounted() {
    await this.getChangeItem()
    await this.getDict()
    if (this.$route.query.jobId) {
      this.jobId = this.$route.query.jobId
      this.status = this.$route.query.changeStatus
      await this.getTaskById(this.$route.query.jobId)
    }
  },
  watch: {
    "dialog.jobInfo": {
      handler(newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.$refs.CodeEdit.codemirror.setSize(
              "auto",
              window.screen.height * 0.8
            )
          })
        }
      },
    },
    "executeParams.type": {
      handler(newVal) {
        if (newVal === "auto") {
          this.formData.runOnly = "0"
        } else {
          this.formData.runOnly = "1"
        }
      },
    },
  },
  methods: {
    onPopupVisibleChange(value) {
      if (!value) {
        this.hostCheck()
      }
    },
    async getDict() {
      await getDictAPI("resource_pool").then((response) => {
        const { data } = response
        if (data.code === 200) {
          for (const value of data.data) {
            this.resourcePoolOptions.push(value)
          }
        }
      })
    },
    async getDeviceListOfPage(data) {
      this.hostListOptions = []
      const params = {
        pageSize: 100000,
        pageNum: 1,
      }
      await listPageAPI(params, data).then(async (res) => {
        const { data } = res
        if (data.code === 200) {
          await data.data.records.forEach((item) => {
            const obj = {
              label: item.hostName,
              value: item.id,
            }
            this.hostListOptions.push(cloneDeep(obj))
          })
        }
      })
    },
    async getChangeItem() {
      const data = {
        type: "Change",
      }
      await getListAPI(data).then((response) => {
        const { data } = response
        if (data.code === 200) {
          this.changeItem = data.data
          data.data.forEach((item) => {
            if (item.treeType === "1") {
              this.table.infoData.push(item)
            }
          })
        }
      })
    },
    async getRelatedDevices(data) {
      await getRelatedDevicesAPI(data).then(async (res) => {
        const { data } = res
        if (data.code === 200) {
          this.associateHostList = []
          await data.data.forEach((item) => {
            const data = {
              label: item.hostName,
              value: item.id,
            }
            this.associateHostList.push(data)
          })
        } else {
        }
      })
    },
    async getTaskById(id) {
      getTaskByIdAPI(id).then(async (response) => {
        const d = response.data
        if (d.code === 200) {
          const { data } = d
          this.formData = data
          this.scene.major = data.changeMajor
          this.resourcePool = data.resourcePool
          this.associateType = data.changeType
          this.hostIds = data.changeHosts
          this.selectAIHost = this.formData.aiHosts.split(",")
          this.selectAssociate = this.formData.customHosts.split(",")
          this.executeParams.type =
            this.formData.runOnly === "1" ? "manual" : "auto"
          this.toggleStatus.isAssignUser = data.assignUser === "1"
          this.toggleStatus.isBmc = data.bmcExecute === "1"
          this.toggleStatus.isIgnore = data.ignoreErrors === "1"
          this.toggleStatus.isDelegateToLocal = data.delegateToLocal === "1"
          if (data.jobExpression) {
            this.config = transToQuarts(data.jobExpression)
          }
        }
      })
      // getHostByTaskIdAPI(id).then(response => {
      //   const { data } = response
      //   if (data.code === 200) {
      //     data.data.forEach(item => {
      //       this.selectAssociate.push(item.id)
      //     })
      //   }
      // })
      getInspectItemByTaskIdAPI(id).then(async (response) => {
        this.selectItem = []
        const { data } = response
        if (data.code === 200) {
          await data.data.forEach((item) => {
            this.selectItem.push(item.inspectItem)
          })
        }
      })
    },
    getJobById(id) {
      getInspectSciptAPI(id).then((response) => {
        const { data } = response
        if (data.code === 200) {
          if (data.data) {
            this.code = data.data.code
            this.cmOptions = codeConfig(data.data.lang, true)
          } else {
            this.code = ""
          }
        }
      })
    },
    async selectChangItem() {
      const list = []
      await this.selectItem.forEach((item) => {
        this.table.infoData.forEach((v) => {
          if (v.id === item.id) {
            list.push(v)
          }
        })
      })
      this.$refs.itemTable.setCheckboxRow(list, true)
      const major =
        this.majorList[
          this.majorList.findIndex(
            (item) => item.label === this.formData.changeMajor
          )
        ].value
      const condition = {
        condition: {
          resourcePool: "like",
          major: "eq",
        },
        resourcePool: this.resourcePool,
        major,
      }
      await this.getDeviceListOfPage(condition)
      this.hostList = this.hostIds.split(",")
      const data = {
        names: this.hostList,
        type: this.associateType,
      }
      await this.getRelatedDevices(data)
      await this.hostCheck()
      this.aiHost = this.selectAIHost
      this.associateHost = this.selectAssociate
    },
    nextStep(step) {
      if (step === "2") {
        if (this.$route.query.jobId) {
          this.selectChangItem()
        }
        this.step.step1 = false
        this.step.step2 = true
        this.step.step3 = true
        this.step.step4 = false
        this.current = 1
      } else if (step === "4") {
        // console.log(this.$refs.itemTable.getCheckboxRecords(true))
        this.formData.aiHosts = ""
        this.formData.customHosts = ""
        this.formData.inspectHosts = []
        this.formData.inspectTasks = []
        this.formData.aiHosts = this.aiHost.join(",")
        this.formData.customHosts = this.associateHost.join(",")
        let hostIdList = this.aiHost.concat(this.associateHost)
        hostIdList = [...new Set(hostIdList)]
        const checkItems = this.$refs.itemTable.getCheckboxRecords(true)
        // console.log(checkItems, this.associateHost)

        if (checkItems.length === 0) {
          this.$message.warning({
            content: "请选择变更项",
            placement: "center",
          })
          return false
        }
        if (this.associateHost.length === 0 && this.aiHost.length === 0) {
          console.log(this.associateHost, this.aiHost)
          this.$message.warning({
            content: "请选择预计影响设备或人工添加设备",
            placement: "center",
          })
          // this.$message.warning({ content: '请在人工添加选择设备', placement: 'center' })
          return false
        }
        checkItems.forEach((item) => {
          this.formData.inspectTasks.push({
            inspectItem: {
              id: item.id,
            },
          })
        })
        hostIdList.forEach((item) => {
          this.formData.inspectHosts.push({
            id: item,
          })
        })
        // this.step.step1 = false
        // this.step.step2 = false
        // this.step.step3 = false
        // this.step.step4 = true
        this.current = 3
      }
    },
    rpAccess() {
      this.spinner = true
      const data = {
        resourcePool: this.resourcePool,
        specializedSubject: this.scene.major.slice(0, 2),
        dataEndtime: "2022/7/19 23:45:00",
        dimension: "",
      }
      rpHealthInspectAPI(data).then((res) => {
        const { data } = res
        if (data.code === 200) {
          this.formData.changeBeforeScore = data.data
          this.spinner = false
        }
      })
    },
    artificialAdd() {
      if (this.hostList.length === 0) {
        this.$message.warning({
          content: "请选择变更设备2",
          placement: "center",
        })
      } else {
        this.dialog.hostList = true
      }
    },
    changeStatus(id, status) {
      const data = {
        jobId: id,
        status,
      }
      updateChangeStatusAPI(data).then((res) => {
        const { data } = res
        if (data.code !== 200) {
          this.$message.error({ content: "修改状态失败", placement: "center" })
        }
      })
    },
    async saveTask() {
      await this.transQuartzExpression()
      this.formData.resourcePool = this.resourcePool
      this.formData.changeHosts = this.hostList.join(",")
      this.formData.changeType = this.associateType
      this.formData.changeMajor = this.scene.major
      await saveTaskAPI(this.formData).then((response) => {
        const { data } = response
        if (data.code === 200) {
          if (this.status !== "4") {
            this.$router.push({
              path: "/inops/changeCheck/taskList",
            })
          }
          this.$message.success({ content: "更新成功", placement: "center" })
        } else {
          this.$message.error({ content: data.message, placement: "center" })
        }
      })
    },
    async executeBtn() {
      if (this.status !== "4") {
        this.saveTask()
      } else {
        this.executeParams.type = "manual"
        await this.saveTask()
        await executeOnce(this.$route.query.jobId).then((response) => {
          const { data } = response
          if (data.code === 200) {
            const query = {
              id: data.data.taskId,
              taskName: this.$route.query.taskName,
              taskType: "change",
              changeStatus: this.$route.query.changeStatus,
              jobId: this.$route.query.jobId,
            }
            this.$router.push({
              path: "/inops/changeCheck/execute",
              query,
            })
          }
        })
        this.changeStatus(this.$route.query.jobId, this.status)
      }
    },
    changeItemSearch() {
      this.table.loading = true
      if (this.scene.major === null || this.scene.type === null) {
        this.changeItem.forEach((item) => {
          if (item.treeType === "1") {
            this.table.infoData.push(item)
          }
        })
      } else {
        this.table.infoData = []
        const name = this.scene.major + this.scene.type
        console.log("name", name)
        console.log(this.changeItem)
        const id =
          this.changeItem[
            this.changeItem.findIndex((item) => item.name === name)
          ].id
        this.changeItem.forEach((item) => {
          if (item.parentId === id) {
            this.table.infoData.push(item)
          }
        })
      }
      this.table.loading = false
    },
    resourceCheck() {
      if (this.scene.major === "") {
        this.$message.warning({
          content: "请选择变更场景",
          placement: "center",
        })
        this.resourcePool = ""
        return false
      }
      const major =
        this.majorList[
          this.majorList.findIndex((item) => item.label === this.scene.major)
        ].value
      const condition = {
        condition: {
          hostName: "like",
          resourcePool: "like",
          hostType: major === "net" ? "in" : "like",
        },
        hostName: major === "net" ? "" : major,
        resourcePool: this.resourcePool,
        hostType: major === "net" ? "router,switch,firewall" : "",
      }
      this.getDeviceListOfPage(condition)
    },
    async hostCheck() {
      // if (!this.$route.query.jobId) {
      //   this.$q.loading.show({ message: 'AI预测中...请稍后' })
      // }
      const data = {
        resourcePool: this.resourcePool,
        changeType: `${this.scene.major.slice(0, 2)}变更`,
        groupType: "网络云专业",
        workScence:
          this.scene.major.slice(0, 2) === "存储" ? "日常优化" : "故障处理",
        deviceType:
          this.scene.major.slice(0, 2) === "网络"
            ? "Switch"
            : this.scene.major.slice(0, 2) === "存储"
              ? "Server"
              : "Host",
        isLocal: "true",
      }
      await changeForecastAPI(data).then((res) => {
        const { data } = res
        if (data.code === 200) {
          this.aiHostList = data.data.hostList.map((item) => {
            return {
              label: item.hostName,
              value: item.id,
            }
          })
          console.log("this.aiHostList: ", this.aiHostList)
          this.alarmList = data.data.alarmList
          this.isAI = true
        }
      })
    },
    async associateTypeChange() {
      const data = {
        names: this.hostList,
        type: this.associateType,
      }
      await this.getRelatedDevices(data)
    },
    transQuartzExpression() {
      if (this.executeParams.type !== "manual") {
        this.formData.jobExpression = expreOfOnly(this.config.date)
      } else {
        this.formData.jobExpression = null
      }
    },
    showJobInfo(id) {
      this.getJobById(id)
      this.dialog.jobInfo = true
    },
    pagesLimit({ currentPage, pageSize }) {
      this.pages.current = currentPage
      this.pages.size = pageSize
      this.setHostItem()
    },
    onCurChanged(cur, pre) {
      // this.nextStep(`done${cur}`, cur)
      this.current = cur
    },
    renderContent() {
      return (
        <p style="font-size:12px;padding:2px!important">
          ‘远端’执行（默认）：执行指令时会登录设备，返回目标设备上的指令执行结果
          <br />
          ‘节点’执行：执行指令时不登录设备，返回本系统前置节点机上的指令执行结果
        </p>
      )
    },
  },
}
</script>

<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3

.card-title
  display: block;
  width: 100%;
  height: 21px;
  font-size: 14px;
  font-weight: 800;
  font-family: "思源黑体";
  letter-spacing: 0px;
  padding-left: 14px;
  color: rgba(0, 0, 0, 1);
  margin: 41px 0 22px 0px;
  border-left: 2px solid  rgba(22, 93, 255, 1);

/deep/ .p-0 .t-card__body
  padding: 0;

/deep/ .t-card  span
  font-size: 12px;
  font-weight: 400;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

.t-radio-group.t-radio-group__outline .t-radio-button
  width: 88px;

.t-radio-group.t-radio-group__outline .t-radio-button .t-radio-button__label
  margin: 0 atuo;

/deep/ .t-card__body
  padding: 0!important;
</style>
