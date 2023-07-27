<template>
  <div class="bg-mod-card" style="padding: 15px;">
    <t-row>
      <t-col :md="3" :sm="4" :xs="6" v-for="(item, index) in field" :key="index">
        <t-row align="center" class="pb-4">
          <t-col :span="4"><span style="font-size: 12px">{{ item.name }}</span></t-col>
          <t-col :span="8">
            <t-select v-if="item.type === 'select'" :options="dict[item.options]" v-model="condition[item.value]" clearable filterable style="width: 80%"></t-select>
             <t-input  v-if="item.type === 'input'" v-model="condition[item.value]" clearable filterable style="width: 80%"></t-input>
          </t-col>
        </t-row>
      </t-col>
      <t-col :md="3" :sm="4" :xs="6">
        <t-row>
          <t-button class="mr-5" theme="primary" @click="onApply">查询</t-button>
          <t-button theme="default" @click="onReset">重置</t-button>
        </t-row>
      </t-col>
    </t-row>
    <t-divider style="margin-top: 30px"></t-divider>
    <div style="margin-top: 10px">
   <t-row class="mt-5">
     <t-button theme="primary"  @click="onEdit('')">
          <t-row align="center">
            <mod-icon name="add" style="color: #ffffff"></mod-icon>
            <span style="color: #ffffff;font-size: 12px">新增节点</span>
          </t-row>
        </t-button>
        <t-button theme="default" variant="outline" style="opacity: 1;border-radius: 3px;background: #FFFFFF;border: 1px solid #165DFF;margin-left: 20px" @click="uploadFile">
          <t-row align="center">
            <mod-icon name="publish" style="color: #165DFF" />
            <span style="color: #165DFF;opacity: 1;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 22px;color: rgba(22, 93, 255, 1);text-align: center;vertical-align: top;">上传文件</span>
          </t-row>
        </t-button>
        <t-button theme="default" variant="outline" style="margin-left: 20px;opacity: 1;border-radius: 3px;background: #FFFFFF;border: 1px solid #165DFF;" @click="anagFile">
          <t-row align="center">
            <mod-icon name="cloud_download" style="color: #165DFF" />
            <span style="color: #165DFF;opacity: 1;font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 22px;color: rgba(22, 93, 255, 1);margin-left: 5px;text-align: center;vertical-align: top;">部署文件</span>
          </t-row>
        </t-button>
      </t-row>
    </div>
    <div style="margin-top: 15px">
       <t-table
        hover resizable multipleSort
        row-key="id"
        size="small"
        table-layout="fixed"
        :selectOnRowClick="false"
        cell-empty-content="-"
        max-height="600"
        :empty="table.empty"
        @select-change="onRowClick"
        :data="table.data"
        :columns="table.column"
        :loading="table.loading"
        :sort="table.sort"
        style="font-size: 12px"
      >
       <template #enable="{ row }">
          <t-row align="center">
            <t-col :span="2">
              <span v-if="row.enable === '1'"><svg t="1687165067860" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2409" data-spm-anchor-id="a313x.7781069.0.i1" width="15" height="15"><path d="M510.5 104.8c55.1 0 108.5 10.8 158.7 32 48.6 20.5 92.2 50 129.6 87.4 37.5 37.5 66.9 81.1 87.4 129.6 21.3 50.3 32 103.7 32 158.7s-10.8 108.5-32 158.7c-20.5 48.6-50 92.2-87.4 129.6-37.5 37.5-81.1 66.9-129.6 87.4-50.3 21.3-103.7 32-158.7 32-55.1 0-108.5-10.8-158.7-32-48.6-20.5-92.2-50-129.6-87.4-37.5-37.5-66.9-81.1-87.4-129.6-21.3-50.3-32-103.7-32-158.7s10.8-108.5 32-158.7c20.5-48.6 50-92.2 87.4-129.6 37.5-37.5 81.1-66.9 129.6-87.4 50.2-21.2 103.6-32 158.7-32m0-40c-247.3 0-447.8 200.5-447.8 447.8s200.5 447.8 447.8 447.8S958.3 760 958.3 512.6 757.8 64.8 510.5 64.8z" fill="#43CF7C" p-id="2410"></path><path d="M513.2 513.7m-322.8 0a322.8 322.8 0 1 0 645.6 0 322.8 322.8 0 1 0-645.6 0Z" fill="#43CF7C" p-id="2411" data-spm-anchor-id="a313x.7781069.0.i0" class=""></path></svg></span>
              <span v-else><svg t="1687165067860" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2409" data-spm-anchor-id="a313x.7781069.0.i1" width="15" height="15"><path d="M510.5 104.8c55.1 0 108.5 10.8 158.7 32 48.6 20.5 92.2 50 129.6 87.4 37.5 37.5 66.9 81.1 87.4 129.6 21.3 50.3 32 103.7 32 158.7s-10.8 108.5-32 158.7c-20.5 48.6-50 92.2-87.4 129.6-37.5 37.5-81.1 66.9-129.6 87.4-50.3 21.3-103.7 32-158.7 32-55.1 0-108.5-10.8-158.7-32-48.6-20.5-92.2-50-129.6-87.4-37.5-37.5-66.9-81.1-87.4-129.6-21.3-50.3-32-103.7-32-158.7s10.8-108.5 32-158.7c20.5-48.6 50-92.2 87.4-129.6 37.5-37.5 81.1-66.9 129.6-87.4 50.2-21.2 103.6-32 158.7-32m0-40c-247.3 0-447.8 200.5-447.8 447.8s200.5 447.8 447.8 447.8S958.3 760 958.3 512.6 757.8 64.8 510.5 64.8z" fill="#C9C9C9" p-id="2410"></path><path d="M513.2 513.7m-322.8 0a322.8 322.8 0 1 0 645.6 0 322.8 322.8 0 1 0-645.6 0Z" fill="#C9C9C9" p-id="2411" data-spm-anchor-id="a313x.7781069.0.i0" class=""></path></svg></span>
            </t-col>
            <t-col :span="10" style="font-size: 12px">{{ formatField(dict.enable, 'label', row.enable) ? formatField(dict.enable, 'label', row.enable) : '-' }}</t-col>
          </t-row>
        </template>
        <template #started="{ row }">
          {{ formatField(dict.started, 'label', row.started) ? formatField(dict.started, 'label', row.started) : '-' }}
        </template>
        <template #active="{ row }">
          {{ formatIgnore(row.active) }}
        </template>
        <template #Agent="{ row }">
          {{ row.Agent ? row.Agent : '1.0'}}
        </template>
        <template #replyTime="{ row }">
          {{ timestampToTime(row.replyTime) }}
        </template>
        <template #operator="{ row }">
          <t-popconfirm theme="default" content="确认开启吗" @confirm="onStart(row.id)">
            <t-button variant="text" theme="primary"  :disabled="row.enable === '1'"><span style="font-size: 14px">启用</span></t-button>
          </t-popconfirm>
          <t-popconfirm theme="default" content="确认关闭吗" @confirm="onPause(row.id)">
            <t-button variant="text" theme="primary"  :disabled="row.enable === '0'" style="font-size: 14px"><span style="font-size: 14px">停用</span></t-button>
          </t-popconfirm>
          <t-button variant="text" theme="primary" @click="onEdit(row.id)" style="font-size: 14px"><span style="font-size: 14px">编辑</span></t-button>
          <t-popconfirm theme="default" content="确认删除任务吗" @confirm="onDel(row.id)">
            <t-button variant="text" theme="primary" style="font-size: 14px">删除</t-button>
          </t-popconfirm>
<t-dropdown>
      <t-button variant="text">
        <span style="color:#0052D9">
          更多
          <mod-icon name="expand_more" style="color: #165DFF" />
        </span>
      </t-button>
      <t-dropdown-menu>
        <t-dropdown-item :value="11"><t-button variant="text" theme="primary" @click="onAuthority(row)" ><span style="font-size: 14px">远程</span></t-button></t-dropdown-item>
        <t-dropdown-item :value="11"><t-button variant="text" theme="primary" @click="onstartupNode(row)" ><span style="font-size: 14px">启动</span></t-button></t-dropdown-item>
        <t-dropdown-item :value="11"><t-button variant="text" theme="primary" @click="onshutdownNode(row)" ><span style="font-size: 14px">关闭</span></t-button></t-dropdown-item>
        <t-dropdown-item :value="11"><t-button variant="text" theme="primary" @click="onAssociation(row)" ><span style="font-size: 14px">关联关系</span></t-button></t-dropdown-item>
        <t-dropdown-item :value="11"><t-button variant="text" theme="primary" @click="onChangeRecoder(row)" ><span style="font-size: 14px">变更记录</span></t-button></t-dropdown-item>
      </t-dropdown-menu>
    </t-dropdown>
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
     <t-dialog header="上传文件" body="对话框内容" :visible.sync="dialog.uploadFile" width="50%" @confirm="uploadConfirm">
       <uploadFile ref="uploadRequest" :uploadId='uploadId' @uploadFather="uploadFather" />
     </t-dialog>
    <t-dialog header="上传文件" body="对话框内容" :visible.sync="dialog.Timeline" width="50%" @confirm="ProgressConfirm">
       <t-space direction="vertical">
        <t-timeline mode="same">
        <t-timeline-item label="正在上传中" dotColor="primary"><span>节点IP:{{Iplist}}</span></t-timeline-item>
        <t-loading text="上传中..." size="small" :loading="loading"></t-loading>
        <t-timeline-item label="上传失败" dotColor="error" v-show="isIp === 0"> <span>节点IP:{{Iplist}}</span> </t-timeline-item>
        <t-timeline-item label="上传成功" dotColor="yellowgreen" v-show="isIp === 1"> <span>节点IP:{{Iplist}}</span> </t-timeline-item>
      </t-timeline>
      </t-space>
     </t-dialog>
     <t-dialog :header="addId.id ? '编辑节点' : '新增节点'" body="对话框内容" :visible.sync="dialog.addNode" width="50%" @confirm="confirmNode">
      <addNode :addId="addId ? addId : '' " ref="addNodeRequest" @nodeEdit="nodeEdit" />
     </t-dialog>
     <t-dialog header="部署文件" body="对话框内容" :visible.sync="dialog.anagFile" @confirm="arrangeConfirm" width="40%">
      <anagFile ref="arrangeRequest" :uploadId='uploadId' @arrangeFather="arrangeFather" />
     </t-dialog>
        <t-dialog header="部署文件" body="对话框内容" :visible.sync="dialog.arrange" width="50%" @confirm="ProgressConfirm">
       <t-space direction="vertical">
        <t-timeline mode="same">
        <t-timeline-item label="正在部署中" dotColor="primary"><span>节点IP:{{internalIp}}</span></t-timeline-item>
        <t-loading text="部署中..." size="small" :loading="loading"></t-loading>
        <t-timeline-item label="部署失败" dotColor="error" v-show="isIp === 0"> <span>节点IP:{{internalIp}}</span> </t-timeline-item>
        <t-timeline-item label="部署成功" dotColor="yellowgreen" v-show="isIp === 1"> <span>节点IP:{{internalIp}}</span></t-timeline-item>
      </t-timeline>
      </t-space>
     </t-dialog>
     <t-dialog header="远程控制" body="对话框内容" class="xterm" :visible.sync="dialog.xterm" width="80%" :closeOnOverlayClick="false" @close="onCancelXterm" @confirm="comfirmXterm">
      <xterm :sshId="sshId" ref="xtermFather" />
     </t-dialog>
     <t-drawer :visible.sync="dialog.association" header="关联关系" :footer="false" size="40%">
      <t-row>节点名称:{{nodeName}}</t-row>
      <t-row style="border: 1px solid rgba(231, 231, 231, 1);height: 90%;opacity: 1;margin-top: 10px">
      <div style="margin-top: 15px">
      <t-table
        hover resizable multipleSort
        rowKey="id"
        size="small"
        table-layout="fixed"
        cellEmptyContent="-"
        max-height="550"
        :showHeader="true"
        :empty="association.empty"
        :data="association.data"
        :columns="association.column"
        :loading="association.loading"
        :selected-row-keys="association.select"
        style="font-size: 12px"
      >
      </t-table>
    </div>
            </t-row>
      </t-drawer>
       <t-drawer :visible.sync="dialog.changeRecoder" header="变更记录" :footer="false" size="40%" :onClose="onRecoderClose">
            <t-row>节点名称:{{nodeName}}</t-row>
                <div style="border: 1px solid rgba(231, 231, 231, 1);height: 90%;opacity: 1;margin-top: 10px" >
                  <t-row style="margin-top: 20px;margin-left: 40px" v-show="july.length !== 0">
                    <span style="font-size: 14px;font-weight: 400;letter-spacing: 0px;line-height: 20.27px;color: rgba(0, 0, 0, 1);text-align: left;vertical-align: top;">2023年7月</span>
                  </t-row>
                  <t-row v-for="(item, index) in july" :key="index" style="margin-top: 20px">
                    <t-col :span="2" >
                      <div :class="recoderActive === index ? 'first' : 'firsttwo'"></div>
                    </t-col>
                    <t-col :span="10" style="margin-left: -30px">
                      <t-row><span style="font-size: 14px;font-weight: 400;letter-spacing: 0px;line-height: 24px;color: rgba(0, 0, 0, 0.9);text-align: left;vertical-align: top;">{{item.type}}</span></t-row>
                      <t-row>
                        <span style="font-size: 12px;font-weight: 400;letter-spacing: 0px;line-height: 22px;color: rgba(0, 0, 0, 0.6);text-align: left;vertical-align: top;">{{getNextDateTwo(item.createDate)}} | 创建人：{{item.updateBy}}</span>
                      </t-row>
                    </t-col>
                  </t-row>
                </div>
          </t-drawer>
  </div>
</template>

<script>
import uploadFile from '@/components/NodeManage/fileGroup/upload'
import addNode from '@/components/NodeManage/fileGroup/addNode'
import anagFile from '@/components/NodeManage/fileGroup/anagFile'
import xterm from '@/components/NodeManage/fileGroup/xterm'
import { formatField, formatIgnore, formatExpression, timestampToTime, getNextDateTwo } from '@/utils/inops/formatUtils'
import { getDictList } from '@/utils/inops/u'
import { getJobNodelist, activeAPI, pauseAPI, delNodeApi, saveAPI, getAssociateApi, shutdownNodeAPI, startupNodeAPI } from '@/api/inops/jobNode/jobNode'
import { getupload2TerminalApi, getdeploy2NodeApi } from '@/api/inops/jobNode/fileManage'
import { nodeHandleApi } from '@/api/inops/jobNode/nodehandle'
import { getUserListApi } from '@/api/system/user'
export default {
  name: 'list',
  components: { uploadFile, addNode, anagFile, xterm },
  data () {
    return {
      // 字典
      dict: {
        list: ['nodeHandleType', 'resourcePool', 'networkArea'],
        user: [],
        nodeHandleType: [],
        name: [],
        active: [{ label: '可用', value: '1' }, { label: '不可用', value: '0' }],
        enable: [{ label: '已启用', value: '1' }, { label: '停用中', value: '0' }],
        started: [{ label: '启动', value: '1' }, { label: '关闭', value: '0' }],
        networkArea: [],
        resourcePool: []
      },
      recoderActive: 0,
      // 查询字段
      field: [
        {
          name: '节点名称',
          value: 'name',
          type: 'input',
          options: 'name'
        },
        {
          name: '启用状态',
          value: 'enable',
          type: 'select',
          options: 'enable'
        },
        {
          name: '启动状态',
          value: 'started',
          type: 'select',
          options: 'started'
        },
        {
          name: '状态',
          value: 'active',
          type: 'select',
          options: 'active'
        },
        {
          name: '网络区域',
          value: 'networkArea',
          type: 'select',
          options: 'networkArea'
        },
        {
          name: '资源池',
          value: 'resourcePool',
          type: 'select',
          options: 'resourcePool'
        }
      ],
      // 查询字段对象
      condition: {
        name: '',
        active: '',
        enable: '',
        started: '',
        resourcePool: '',
        networkArea: '',
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
          { colKey: 'row-select', title: '选择', type: 'multiple', width: 50 },
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'name', title: '节点名称', align: 'left', width: 100, resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'Agent', title: 'Agent版本', align: 'center', width: 80, resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'enable', title: '启用状态', align: 'center', width: 100, resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'jobQueue', title: '作业列队', align: 'center', width: 100, resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'terminalQueue', title: '终端队列', align: 'center', width: 100, resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'externalIp', title: '池外IP', align: 'center', width: 100, resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'internalIp', title: '池内IP', align: 'center', width: 100, resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'networkArea', title: '网络区域', align: 'center', width: 100, resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'resourcePool', title: '资源池', align: 'center', width: 100, resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'started', title: '启动状态', align: 'center', width: 100, resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'active', title: '是否可用', align: 'center', width: 100, resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'replyTime', title: '最后应答时间', align: 'center', width: 100, resizable: true, ellipsis: true, ellipsisTitle: true },
          { colKey: 'remarks', title: '备注信息', align: 'center', width: 100, resizable: true, ellipsis: true, ellipsisTitle: true },
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
      addId: {},
      uploadId: [],
      nodeList: {},
      internalIp: '',
      Iplist: '',
      isIp: 3,
      july: [],
      sshId: '',
      loading: true,
      association: {
        ref: 'backupInfo',
        empty: '暂无备份任务数据',
        loading: false,
        sort: [],
        data: [],
        column: [
          { colKey: 'serial-number', title: '序号', width: 80, align: 'center' },
          { colKey: 'hostName', title: '设备名', align: 'left', resizable: true, ellipsis: true, ellipsisTitle: true }
        ]
      },
      // 弹窗
      dialog: {
        Timeline: false,
        arrange: false,
        uploadFile: false,
        association: false,
        changeRecoder: false,
        addNode: false,
        anagFile: false,
        xterm: false,
        list: false
      },
      changeRecoder: [],
      nodeName: ''
    }
  },
  async mounted () {
    await this.getDict()
    await this.getUserDict()
    this.getData()
  },
  computed: {
  },
  watch: {
  },
  methods: {
    /**
     * 格式化
     */
    formatField,
    /**
     * 是否忽略下一步字段格式化
     */
    formatIgnore,
    /**
     * 执行周期字段格式化
     */
    formatExpression,
    /**
    * 时间字段格式化
    */
    timestampToTime,
    getNextDateTwo,
    /**
     * 文件上传
     */
    uploadFile () {
      if (this.uploadId.length !== 0) {
        this.dialog.uploadFile = true
        this.$refs.uploadRequest.$emit('sign')
      } else {
        this.$message.error({ content: '请选择节点', placement: 'center' })
      }
      // if (this.uploadId.length !== 0) {
      //   console.log('选中的节点是否可用', this.selected)
      //   if (this.selected.includes('0')) {
      //     this.$message.error({ content: '节点不可用，请重新选择节点', placement: 'center' })
      //   } else {
      //     this.dialog.uploadFile = true
      //     this.$refs.uploadRequest.$emit('sign')
      //   }
      // } else {
      //   this.$message.error({ content: '请选择节点', placement: 'center' })
      // }
    },
    addNode () {
      this.dialog.addNode = true
    },
    anagFile () {
      if (this.uploadId.length !== 0) {
        this.dialog.anagFile = true
        this.$refs.arrangeRequest.$emit('sign')
      } else {
        this.$message.error({ content: '请选择节点', placement: 'center' })
      }
    },
    /**
     * 封装数组对象排序方法
    */
    compare (prop) {
      return function (a, b) {
        // return b[prop] - a[prop]
        return a[prop] - b[prop]
      }
    },
    /**
     * 文件上传确认操作
    */
    uploadConfirm () {
      this.dialog.uploadFile = false
      this.dialog.Timeline = true
      console.log('上传文件关闭弹窗事件')
      this.$refs.uploadRequest.fatherUpload()
    },
    /**
     * 部署文件确认操作
    */
    arrangeConfirm () {
      this.dialog.anagFile = false
      this.dialog.arrange = true
      this.$refs.arrangeRequest.arrangeConfirm()
    },
    // getActiveQuery () {
    //   this.uploadId.forEach(async (item) => {
    //     await getIdNodeAPI(item).then(res => {
    //       const { data } = res
    //       if (data.code === 200) {
    //         this.selected.push(data.data.active)
    //       }
    //     })
    //   })
    // },
    /**
     * 接收文件上传的数据
    */
    async uploadFather (data, ip) {
      // console.log('接收来自子组件upload的数据', data)
      this.Iplist = ip.join(',')
      await getupload2TerminalApi(data).then(res => {
        const { data } = res
        // console.log('文件上传接口联调', data)
        if (data.code === 200) {
          this.loading = false
          if (data.data.length === 0) {
            this.isIp = 1
            this.$message.success({ content: '文件上传成功', placement: 'center' })
          } else {
            this.isIp = 0
            for (const item of data.data) {
              const hostList = []
              hostList.push(item.host)
            }
            this.$message.error({ content: '文件上传失败', placement: 'center' })
          }
        } else if (data.code !== 200) {
          this.isIp = 0
          this.$message.error({ content: '文件上传失败', placement: 'center' })
        }
      })
    },
    /**
     * 接收部署文件的数据
    */
    async arrangeFather (data, ip) {
      this.internalIp = ip.join(',')
      await getdeploy2NodeApi(data).then(res => {
        const { data } = res
        // console.log('部署文件的数据接口联调', data)
        if (data.code === 200) {
          this.loading = false
          if (data.data.length === 0) {
            this.isIp = 1
            this.$message.success({ content: '文件部署成功', placement: 'center' })
          } else {
            for (const item of data.data) {
              this.isIp = 0
              const hostList = []
              hostList.push(item.host)
            }
            this.$message.error({ content: '文件部署失败', placement: 'center' })
          }
        }
      })
    },
    ProgressConfirm () {
      this.dialog.Timeline = false
      this.dialog.arrange = false
      this.isIp = 3
      this.getData()
    },
    async onAssociation (row) {
      this.nodeName = row.name
      this.dialog.association = true
      this.association.loading = true
      const params = {
        pageNum: 100,
        pageSize: 100
      }
      const jsonObject = {
        networkArea: row.networkArea
      }
      await getAssociateApi(params, jsonObject).then(res => {
        const { data } = res
        console.log('关联数据', data)
        if (data.code === 200) {
          this.association.data = data.data.records
          this.association.loading = false
        } else {
          this.$message.error({ content: '获取备份任务列表失败，请联系管理员', placement: 'center' })
        }
      })
    },
    async onChangeRecoder (row) {
      this.nodeName = row.name
      this.dialog.changeRecoder = true
      const params = {
        id: row.id
      }
      await nodeHandleApi(params).then(res => {
        const { data } = res
        console.log('变更记录', data)
        if (data.code === 200) {
          // this.changeRecoder = data.data
          for (const item of data.data) {
            for (const index of this.dict.user) {
              for (const items of this.dict.nodeHandleType) {
                if (item.updateBy === index.value && item.type === items.value) {
                  this.changeRecoder.push({ updateBy: index.label, createDate: item.createDate, type: items.label })
                  this.changeRecoder.sort((a, b) => b.createDate.localeCompare(a.createDate) || b.createDate.localeCompare(a.createDate))
                }
              }
            }
          }
        }
        console.log('变更记录排序后', this.changeRecoder)
        for (const item2 of this.changeRecoder) {
          if (item2.createDate.includes('2023-07')) {
            this.july.push({ updateBy: item2.updateBy, createDate: item2.createDate, type: item2.type })
          }
        }
      })
    },
    onRecoderClose () {
      this.changeRecoder = []
      this.july = []
    },
    handleFail ({ file }) {
      this.$message.error(`文件 ${file.name} 上传失败`)
    },
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
            }
          }
        }
      })
    },
    /**
     * 获取节点数据列表
     *
     */
    async getData () {
      this.table.loading = true
      const params = {
        pageSize: this.pages.size,
        pageNum: this.pages.current
      }
      await getJobNodelist(params, this.condition).then(response => {
        const { data } = response
        // console.log('获取节点数据', data)
        if (data.code === 200) {
          this.table.data = data.data.records
          this.table.loading = false
          for (const item of data.data.records) {
            this.dict.name.push({ label: item.name, value: item.name })
          }
          const { total, size, current } = data.data
          this.pages = Object.assign(this.pages, { total, size, current })
          this.pages.list[this.pages.list.length - 1].valueOf = total
        }
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
        name: '',
        active: '',
        started: '',
        enable: '',
        networkArea: '',
        resourcePool: ''
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
     * 暂停任务
     * @param id 任务id
     */
    onPause (id) {
      pauseAPI(id).then(response => {
        const { data } = response
        if (data.code === 200) {
          this.$message.success({ content: '任务已暂停', placement: 'center' })
          this.getData()
        } else if (data.code !== 200) {
          this.$message.error({ content: '任务暂停失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 开启任务
     * @param id 任务id
     */
    onStart (id) {
      activeAPI(id).then(response => {
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
     * 开启节点
     *
    */
    async onstartupNode (row) {
      this.hostIdList = row.id
      const params = {
        ids: this.hostIdList
      }
      await startupNodeAPI(params).then(res => {
        const { data } = res
        // console.log('节点启动成功', data)
        if (data.code !== 200) {
          this.$message.error({ content: '节点启动失败', placement: 'center' })
        } else if (data.data.okCount !== 0) {
          this.$message.success({ content: '节点启动成功', placement: 'center' })
          this.getData()
        } else if (data.data.failCount !== 0) {
          this.$message.error({ content: '节点启动失败', placement: 'center' })
        }
      })
    },
    /**
     * 关闭节点
     *
    */
    async onshutdownNode (row) {
      this.hostIdList = row.id
      const params = {
        ids: this.hostIdList
      }
      await shutdownNodeAPI(params).then(res => {
        const { data } = res
        console.log('关闭节点成功', data)
        if (data.code === 200) {
          this.$message.success({ content: '节点关闭成功', placement: 'center' })
          this.getData()
        } else {
          this.$message.error({ content: '节点关闭成功', placement: 'center' })
        }
      })
    },
    /**
     * 编辑任务
     * @param id 任务id
     */
    onEdit (id) {
      const param = { id }
      this.addId = param
      this.dialog.addNode = true
      console.log('addId', this.addId)
    },
    /**
     * 删除任务
     * @param id 任务id
     */
    onDel (id) {
      const params = {
        ids: id
      }
      delNodeApi(params).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '任务删除成功', placement: 'center' })
          this.getData()
        } else {
          this.$message.error({ content: '任务删除失败，请联系管理员', placement: 'center' })
        }
      })
    },
    async confirmNode () {
      this.$refs.addNodeRequest.$emit('editNode')
      if (this.nodeList.externalIp !== '' && this.nodeList.name !== '' && this.nodeList.networkArea !== '' && this.nodeList.resourcePool !== '' && this.nodeList.terminalQueue !== '' && this.nodeList.jobQueue !== '') {
        await saveAPI(this.nodeList).then(res => {
          const { data } = res
          if (data.code === 200) {
            console.log('data', data)
            if (this.nodeList.id !== '') {
              this.$message.success({ content: '节点修改成功', placement: 'center' })
            } else {
              this.$message.success({ content: '节点添加成功', placement: 'center' })
            }
            this.dialog.addNode = false
            this.getData()
          } else if (data.code !== 200 && this.nodeList.id !== '') {
            this.$message.error({ content: '节点修改失败，请联系管理员', placement: 'center' })
            this.dialog.addNode = false
          } else if (data.code !== 200 && this.nodeList.id === '') {
            this.$message.error({ content: '节点添加失败，请联系管理员', placement: 'center' })
            this.dialog.addNode = false
          }
        })
      } else {
        this.$message.error({ content: '添加节点失败', placement: 'center' })
        this.$refs.addNodeRequest.validate()
      }
    },
    nodeEdit (data) {
      this.nodeList = data
    },
    /**
     * 远程控制
     * @param row 当前行信息
     * @returns {Promise<void>}
     */
    async onAuthority (row) {
      this.sshId = row.id
      this.dialog.xterm = true
      // const obj = {
      //   row: this.sshId
      // }
      // this.$router.push({
      //   path: '/inops/node/xterm',
      //   query: {
      //     obj
      //   }
      // })
    },
    /**
     * 下发关闭Xterm事件
    */
    onCancelXterm () {
      this.$nextTick(() => {
        this.$refs.xtermFather.closeSsh()
      })
      this.sshId = ''
    },
    comfirmXterm () {
      this.dialog.xterm = false
      this.$nextTick(() => {
        this.$refs.xtermFather.closeSsh()
      })
      this.sshId = ''
    },
    /**
     * 选中行
     * @param id
    */
    onRowClick (row) {
      this.uploadId = row
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
/deep/ .t-button__text
  font-size: 16px
// /deep/ .t-table__header.t-table__header--fixed
//   border: none
.first
  width: 2px;
  height: 48px;
  opacity: 1;
  background: rgba(0, 82, 217, 1);
  margin-left: 40px
.firsttwo
  width: 2px;
  height: 48px;
  opacity: 1;
  background: rgba(204, 204, 204, 1);
  margin-left: 40px
.xterm
  position: fixed
  top: 40px
</style>
