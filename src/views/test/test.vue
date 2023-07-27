<template>
  <div>
    <div style="background-color:  rgba(242, 243, 245, 1)">
      <t-row>
        <t-col :span="4">
          <t-button variant="text">
            <t-row align="center">
              <mod-icon class="mr-1" name="arrow_back_ios" style="color: rgba(38, 110, 255, 1)"></mod-icon>
              <span style="color:rgba(38, 110, 255, 1);" @click="back">返回</span>
            </t-row>
          </t-button>
        </t-col>
        <t-col :span="8">
          <t-row justify="end">
            <t-button class="mr-5" theme="default" @click="saveScript">保存</t-button>
            <t-button class="mr-5" theme="primary" @click="largeScript" v-show="!(job.assignUser || job.become) || job.isExpend">执行脚本</t-button>
            <t-button class="mr-5" theme="primary" @click="approveScrippt" v-show="(job.assignUser || job.become) && !job.isExpend">执行脚本</t-button>
            <t-button v-show="showResult" theme="primary" @click="toResult">查看结果</t-button>
          </t-row>
        </t-col>
      </t-row>
    </div>
    <t-row class="bg-mod-card" style="padding: 10px 10px 30px 10px;margin-top:10px" >
      <t-col :span="7"  :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
        <t-row style="margin-top: 10px">
          <t-col :xs="4" :sm="4" :md="4" :lg="2" :xl="2"><span style="position: relative;top: 5px;">脚本名称</span></t-col>
          <t-col :xs="4" :sm="4" :md="6" :lg="8" :xl="8">
            <t-input v-model.trim="script.name" clearable style="margin-left: -40px;"></t-input>
          </t-col>
        </t-row>
        <t-row style="margin-top: 30px">
          <t-col :xs="4" :sm="4" :md="4" :lg="2" :xl="2"><span style="position: relative;top: 5px;">脚本类型</span></t-col>
          <t-col :xs="4" :sm="4" :md="6" :lg="8" :xl="8" style="margin-left: -40px;">
            <span>{{ typeList[script.type] }}</span>
          </t-col>
        </t-row>
        <t-row align="center" style="margin-top: 30px">
          <t-col :xs="4" :sm="4" :md="4" :lg="2" :xl="2"><span style="position: relative;top: 3px;">脚本描述</span></t-col>
          <t-col :xs="4" :sm="4" :md="6" :lg="8" :xl="8">
            <t-input v-model.trim="script.description" clearable style="margin-left: -40px;"></t-input>
          </t-col>
        </t-row>
        <t-row align="top" style="margin-top: 30px">
          <t-col :xs="4" :sm="4" :md="4" :lg="2" :xl="2"><span style="position: relative;top: 5px;">脚本内容</span></t-col>
          <t-col :xs="6" :sm="6" :md="7" :lg="9" :xl="9">
            <div style="background-color: #2b2b2b;">
          <codemirror
            ref="code"
            v-model="script.code"
            :options="codeConfig"
            class="codemirror"
            style="margin-left: -40px;"
          >
          </codemirror>
        </div>
          </t-col>
        </t-row>
    </t-col>
    <t-col :span="4" class="right_item" ref="right">
          <t-row>
            <t-col><span style="margin-top: 45px; margin-left: 16px; font-size: 16px; font-weight: 400">脚本调试</span></t-col>
          </t-row>
          <div style="margin-left: 20px">
            <t-row style="margin-top: 26px" align="center">
              <t-col :xs="4" :sm="4" :md="4" :lg="2" :xl="2" style="margin-right: 20px">选择设备</t-col>
              <t-col :xs="4" :sm="4" :md="4" :lg="8" :xl="8">
                <t-badge :count="hosts.length" :maxCount="999" show-zero>
                <t-button theme="default" variant="outline" @click="dialog.host = true">选择设备</t-button>
              </t-badge>
              </t-col>
            </t-row>
            <t-row style="margin-top: 20px" align="center">
              <t-col :xs="4" :sm="2" :md="4" :lg="2" :xl="2" style="margin-right: 20px">执行方式</t-col>
              <t-col :xs="4" :sm="2" :md="4" :lg="9" :xl="9" style="text-overflow: ellipsis;"><check-selector v-model="execute" style="text-overflow: ellipsis;" :options="[{ label: '指定账号', value: 'assignUser' }, { label: 'su', value: 'become' }, { label: '通过bmc IP执行', value: 'bmcExec' }]"></check-selector></t-col>
            </t-row>
            <t-row style="margin-top: 20px" align="center">
              <t-col :xs="4" :sm="4" :md="4" :lg="2" :xl="2" style="margin-right: 20px">执行方式</t-col>
              <t-col :xs="4" :sm="4" :md="4" :lg="8" :xl="8"> <t-radio-group v-model="job.localExec">
                <t-radio-button value='false'>远端</t-radio-button>
                <t-radio-button value='true'>节点</t-radio-button>
              </t-radio-group></t-col>
            </t-row>
            <t-row style="margin-top: 20px; color: rgba(153, 153, 153, 1); font-size: 14px">注：默认使用平台管理的账号作业</t-row>
            <t-row justify="end" style="margin-top: 10px">
              <t-button theme="primary" @click="largeScript" v-if="!(job.assignUser || job.become) || job.isExpend" :loading="false">立即执行</t-button>
              <t-button theme="primary" @click="approveScrippt" v-else-if="(job.assignUser || job.become) && !job.isExpend">立即执行</t-button>
            </t-row>
            <div v-show="job.assignUser" style="margin-top: 20px; z-index: 1">
              <t-row align="center">
                <span class="mr-5" >账号</span>
                <t-input v-model.trim="job.user" clearable style="width: 80%"></t-input>
              </t-row>
              <t-row class="mt-5" align="center">
                <span class="mr-5" >密码</span>
                <t-input v-model.trim="job.pass" clearable style="width: 80%"></t-input>
              </t-row>
            </div>
            <div v-if="job.become" style="margin-top: 20px; z-index: 1">
              <t-row align="center">
                <span class="mr-5" >账号</span>
                <t-input v-model.trim="job.becomeUser" clearable style="width: 80%"></t-input>
              </t-row>
              <t-row class="mt-5" align="center">
                <span class="mr-5" >密码</span>
                <t-input v-model.trim="job.becomePass" clearable style="width: 80%"></t-input>
              </t-row>
            </div>
          </div>
      </t-col>
  </t-row>
    <t-dialog v-if="dialog.host" header="设备选择"  placement="center" width="80%" style="position: fixed;top:0px" preventScrollThrough  :visible.sync="dialog.host" :footer="false">
      <Host :hostList.sync="hosts" @hostCheck="hostCompCtl" ></Host>
    </t-dialog>
    <t-dialog v-if="dialog.AssUser" header="审批申请" :close-on-click-modal="false" placement="center" width="40%"  preventScrollThrough  :visible.sync="dialog.AssUser" :footer="false">
      <AssignUser :script="script" :hostsum="hosts.length" :user="job.user" :becomeUser="job.becomeUser" :approveType="execute" @getChange="itemVisible" @executeScript="executeScript"></AssignUser>
    </t-dialog>
    <t-dialog header="提示" :close-on-click-modal="false" placement="center" width="40%"  preventScrollThrough  :visible.sync="dialog.promat" @confirm="comfirmPromat">
      <div>
        <t-row style="margin-top: 20px;margin-left: 20px;font-weight: 400;font-size: 14px"><span>网络变更"十有"守则</span></t-row>
        <div style="
opacity: 1;
font-size: 12px;
font-weight: 400;
letter-spacing: 0px;
line-height: 22px;
color: rgba(0, 0, 0, 1);
text-align: left;
vertical-align: top;
margin-top: 20px;
margin-left: 20px;
">
         操作有心：网络变更一人操作，一人核查。<br>
         计划有序：早作计划，按轻重缓急，有序协同。<br>
         变更有章：变更方案具体可行，变更负责人审核把关。<br>
         规则有界：原则上单次不能对双节点进行重要局数据调整。<br>
         沟通有效：与干系人良好沟通，事前商量，事中协作，事后反馈。<br>
         授权有度：对合作单位权限一次一授，仅限工程范围权限，回收及时。<br>
         执行有据：操作人须通过网络变更认证，任何操作需征得变更负责人同意，严格按照流程实施，按方案操作。<br>
         应急有备：有完备的回退方案和故障应急处理方案。<br>
         验证有道：系统拨测和人工拨测有效结合，跨专业/部门协同验证。<br>
         值守有责：重要变更值守人员及时关注网元性能指标变化，快速响应。
        </div>
      </div>
    </t-dialog>
    <t-dialog header="提示" :close-on-click-modal="false" placement="center" width="40%"  preventScrollThrough  :visible.sync="dialog.promattwo" @confirm="comfirmPromattwo">
     <div>
        <t-row style="margin-top: 20px;margin-left: 20px;font-weight: 400;font-size: 14px"><span>网络变更"十有"守则</span></t-row>
        <div style="
opacity: 1;
font-size: 12px;
font-weight: 400;
letter-spacing: 0px;
line-height: 22px;
color: rgba(0, 0, 0, 1);
text-align: left;
vertical-align: top;
margin-top: 20px;
margin-left: 20px;
">
         操作有心：网络变更一人操作，一人核查。<br>
         计划有序：早作计划，按轻重缓急，有序协同。<br>
         变更有章：变更方案具体可行，变更负责人审核把关。<br>
         规则有界：原则上单次不能对双节点进行重要局数据调整。<br>
         沟通有效：与干系人良好沟通，事前商量，事中协作，事后反馈。<br>
         授权有度：对合作单位权限一次一授，仅限工程范围权限，回收及时。<br>
         执行有据：操作人须通过网络变更认证，任何操作需征得变更负责人同意，严格按照流程实施，按方案操作。<br>
         应急有备：有完备的回退方案和故障应急处理方案。<br>
         验证有道：系统拨测和人工拨测有效结合，跨专业/部门协同验证。<br>
         值守有责：重要变更值守人员及时关注网元性能指标变化，快速响应。
        </div>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import Host from '@/components/Selector/Host'
import AssignUser from '@/components/Selector/AssignUser'
import CheckSelector from '@/components/Selector/CheckBoxSelector'
import { codeConfig } from '@/utils/inops/codeConfig'
import { codemirror } from 'vue-codemirror'
import codeExample from '@/utils/inops/codeMode'
import { saveScriptAPI, getJobByIdAPI, scriptCodeDebugAPI } from '@/api/inops/job/job'
import { accessListAPI } from '@/api/inops/approve/approve'
import ModIcon from '@/ui/ModIcon/ModIcon'
export default {
  name: 'online',
  components: { ModIcon, codemirror, Host, CheckSelector, AssignUser },
  props: {
    tab: {
      type: String,
      default: ''
    },
    obj: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      height: 0,
      splitter: 75,
      loading: false,
      typeList: {
        action_script: '服务器Python脚本',
        forward_online_script: '数通Python脚本',
        playbook: 'Ansible脚本',
        shell_script: 'Shell脚本'
      },
      approveUser: {
        userId: ''
      },
      script: {
        id: '',
        name: '',
        type: '',
        version: '1.0.0',
        description: '',
        lang: 'python',
        code: '',
        editable: '1'
      },
      job: {
        jobName: '',
        isExpend: false,
        isbecome: false,
        assignUser: false,
        user: '',
        pass: '',
        become: false,
        becomeUser: 'root',
        becomePass: '',
        becomeMethod: '',
        bmcExec: false,
        code: '',
        type: '',
        localExec: 'false', // true：节点执行   false：远端执行
        deviceIds: []
      },
      showPass: {
        become: false,
        assignUser: false
      },
      btnGroup: [
        { label: 'python', value: 'python' },
        { label: 'yaml', value: 'yaml' },
        { label: 'Shell', value: 'shell' }
      ],
      codeConfig: codeConfig('python', false),
      execute: [], // 执行方式 assignUser：指定账号  become：提权（su） bmcExec：通过bmc ip执行
      userApprove: [], // 权限 assignUser：指定账号  become：提权（su） assignUser,become
      hosts: [],
      dialog: {
        host: false,
        AssUser: false,
        promat: false,
        promattwo: false
      },
      showResult: false,
      taskId: '',
      jobType: '1',
      executeWait: false
    }
  },
  watch: {
    'script.lang': {
      handler (newVal) {
        this.codeConfig = codeConfig(newVal, false)
      },
      deep: true,
      immediate: true
    },
    execute: {
      handler () {
        this.job.assignUser = this.execute.includes('assignUser')
        this.job.become = this.execute.includes('become')
        this.job.bmcExec = this.execute.includes('bmcExec')
        if (this.execute.includes('assignUser')) {
          if (this.userApprove.includes('assignUser') && !this.job.become) {
            this.job.isExpend = true
          } else {
            this.job.isExpend = false
          }
        }
        if (this.execute.includes('become')) {
          if (this.userApprove.includes('become') && !this.job.assignUser) {
            this.job.isExpend = true
          } else {
            this.job.isExpend = false
          }
        }
        if (!this.userApprove.includes('assignUser') && !this.userApprove.includes('become')) {
          this.job.isExpend = false
        } else if (this.userApprove.includes('assignUser') === this.userApprove.includes('become')) {
          this.job.isExpend = true
        }
      },
      deep: true
    },
    hosts: {
      handler () {
        if (this.hosts.length > 100) {
          this.execute.push('large')
        }
      },
      deep: true
    }
  },
  async mounted () {
    window.addEventListener('resize', this.setHeight)
    this.setHeight()
    await this.initData()
    this.approveUser.userId = this.$store.getters.getInfo.userId
    // await this.approvejudge()
  },
  destroyed () {
    window.removeEventListener('resize', this.setHeight)
  },
  async activated () {
    this.setHeight()
  },
  methods: {
    initData () {
      const { id, type } = this.obj
      if (id) {
        this.getJobById(id)
      } else {
        this.script.code = codeExample[type]
        this.script.type = type
      }
      this.jobType = type === 'forward_online_script' ? '2' : type === 'action_script' ? '1' : ''
      if (type === 'action_script' || type === 'forward_online_script') {
        this.script.lang = 'python'
      } else if (type === 'shell_script') {
        this.script.lang = 'shell'
      } else if (type === 'playbook') {
        this.script.lang = 'yaml'
      }
    },
    async approvejudge () {
      await accessListAPI(this.approveUser).then(res => {
        const { data } = res
        // console.log('admin权限', data)
        if (data.code === 200) {
          this.loading = true
          this.userApprove = data.data
          this.loading = false
        }
      })
    },
    async comfirmPromat () {
      this.dialog.promat = false
      await this.approvejudge()
      if (this.hosts.length > 100 && this.userApprove.includes('large') || this.userApprove.includes('admin')) {
        this.executeScript()
      } else if (this.hosts.length < 100) {
        this.executeScript()
      } else {
        this.dialog.AssUser = true
      }
    },
    async comfirmPromattwo () {
      this.dialog.promattwo = false
      await this.approvejudge()
      if (!this.execute.includes('become')) {
        this.job.becomeUser = ''
      } else {
        this.job.becomeUser = 'root'
      }
      if (this.execute.includes('assignUser') && this.job.user === '') {
        this.$message.warning({ content: '指定账号不能为空', placement: 'center' })
        return
      }
      if (this.hosts.length > 100 && !this.execute.includes('large')) {
        this.execute.push('large')
      }
      if (this.job.assignUser && !this.job.become) {
        if (this.userApprove.includes('assignUser') || this.userApprove.includes('admin')) {
          this.executeScript()
        } else {
          this.dialog.AssUser = true
        }
      }
      if (this.job.become && !this.job.assignUser) {
        if (this.userApprove.includes('become') || this.userApprove.includes('admin')) {
          this.executeScript()
        } else {
          this.dialog.AssUser = true
        }
      }
      if (this.job.assignUser && this.job.become) {
        if (this.userApprove.includes('assignUser') && this.userApprove.includes('become') || this.userApprove.includes('admin')) {
          this.executeScript()
        } else {
          this.dialog.AssUser = true
        }
      }
    },
    async getJobById (id) {
      await getJobByIdAPI(id).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.script = data.data
          this.job.jobName = `${data.data.name}-脚本执行`
          this.codeConfig = codeConfig(this.script.lang, false)
        } else {
          this.$message.error({ content: '获取脚本信息失败，请联系管理员！', placement: 'center' })
        }
      })
    },
    back () {
      this.$router.push({ path: '/inops/script/list' })
      // this.$router.push({ path: '/inops-test/job/list' })
    },
    setHeight () {
      const screenHeight = window.innerHeight
      this.height = screenHeight * 0.78
      this.$refs.code.codemirror.setSize('auto', window.innerHeight * 0.6)
    },
    btnGroupBind (selected) {
      this.codeConfig = codeConfig(selected, false)
      this.script.lang = selected
    },
    saveScript () {
      if (this.script.name === '') {
        this.$message.warning({ content: '脚本名称不能为空', placement: 'center' })
      } else {
        saveScriptAPI(this.script).then(res => {
          const { data } = res
          if (data.code === 200) {
            this.$message.success({ content: '保存脚本成功', placement: 'center' })
            this.getJobById(data.data)
          } else {
            this.$message.error({ content: '保存脚本失败', placement: 'center' })
          }
        })
      }
    },
    hostCompCtl (data) {
      this.hosts = data
      const hostIds = []
      data.forEach(d => {
        hostIds.push(d.id)
      })
      this.job.deviceIds = hostIds.join(',')
      this.dialog.host = false
    },
    async largeScript () {
      this.dialog.promat = true
    },
    executeScript () {
      this.job.code = this.script.code
      this.job.type = this.script.type
      this.job.jobName = this.job.jobName ? this.job.jobName : this.script.name ? `${this.script.name} - 脚本调试` : '脚本调试'
      if (this.job.deviceIds.length === 0) {
        this.$message.warning({ content: '请至少选择一台设备', placement: 'center' })
        return false
      }
      if (this.isAccount() === 'fail') {
        return false
      }
      this.executeWait = true
      scriptCodeDebugAPI(this.job).then(res => {
        const { data } = res
        if (data.code === 200) {
          if (data.data.taskId) {
            this.taskId = data.data.taskId
            const obj = {
              taskId: this.taskId,
              isNew: true,
              name: this.job.jobName,
              type: this.typeList[this.script.type]
            }
            this.$emit('changeObj', 'execute', obj)
            this.executeWait = false
            this.showResult = true
          } else {
            this.$message.warning({ content: data.data.msg, placement: 'center' })
            this.executeWait = false
          }
        } else {
          this.$message.error({ content: '脚本执行失败', placement: 'center' })
        }
      })
    },
    async approveScrippt () {
      this.dialog.promattwo = true
    },
    isAccount () {
      if (this.job.become) {
        if (this.job.becomeUser === '' || this.job.becomePass === '') {
          this.$message.error({ content: '提权账号密码不能空', placement: 'center' })
          this.job.becomeMethod = ''
          return 'fail'
        } else {
          this.job.becomeMethod = 'su'
          return 'success'
        }
      }
      if (this.job.assignUser) {
        if (this.job.user === '' || this.job.pass === '') {
          this.$message.error({ content: '指定账号密码不能为空', placement: 'center' })
          return 'fail'
        }
      }
    },
    executeResult () {
      const obj = {
        taskId: this.taskId,
        isNew: false,
        name: this.job.jobName,
        type: this.typeList[this.script.type]
      }
      this.$emit('changeObj', 'execute', obj)
      // this.$router.push({
      //   path: '/inops-test/job/execute',
      //   query: obj
      // })
    },
    itemVisible (visible) {
      this.dialog.AssUser = visible
    },
    toResult () {
      const obj = {
        id: this.taskId,
        isNew: false,
        name: this.job.jobName,
        type: this.typeList[this.script.type]
      }
      this.$emit('changeObj', 'execute', obj)
    },
    onChange (e) {
      console.log(e)
    }
  },
  computed: {
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-dialog__body
  max-height: 850px !important
.right_item
 height: 620px
 box-sizing: border-box
 border-left: 1px solid  rgba(230, 230, 230, 1)
 border-bottom: 1px solid  rgba(230, 230, 230, 1)
.sign
  position: relative
  top: 424px
  right: 35px
  width: 57px
  height: 57px
  border-radius: 50%
  box-sizing: border-box
  border-left: 1px solid rgba(230, 230, 230, 1)
.codemirror
  border: 1px solid #eee
  height: auto !important
@media screen and (min-width: 1600px) and (max-width: 3000px)
  .right_item
    height: 720px
    box-sizing: border-box
    border-left: 1px solid  rgba(230, 230, 230, 1)
    border-bottom: 1px solid  rgba(230, 230, 230, 1)
</style>
