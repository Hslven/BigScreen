<template>
  <div style="height: 100%">
    <div style="background-color:  rgba(242, 243, 245, 1)">
      <t-row align="center">
        <t-button variant="text" style="margin-right: 10px" @click="back">
          <t-row align="center">
            <mod-icon class="mr-1" name="arrow_back_ios" style="color: rgba(38, 110, 255, 1)"></mod-icon>
            <span style="color:rgba(38, 110, 255, 1);">返回</span>
          </t-row>
        </t-button>
        <span style="font-size: 14px; font-weight: 400; color: rgba(177, 177, 177, 1)">{{ title }}</span>
      </t-row>
    </div>
    <div class="bg-mod-card" style="margin-top: 15px; height: 97%">
      <div class="mt-5" style="height: 100%">
        <t-layout class="bg-mod-card" style="padding: 15px; min-height: 100%">
          <t-content>
            <div style="padding: 15px">
              <t-steps v-model="steps.current" readonly :options="steps.options"></t-steps>
            </div>
            <Basic v-if="steps.current === 'basic'" ref="basicInfo" :basic.sync="basic" :expression.sync="taskExpression" :type.sync="configType" :taskType.sync="taskType"></Basic>
            <job-selector v-if="steps.current === 'job' && configType !== 'inspect'" ref="job" :list.sync="taskList"></job-selector>
            <inspect-item-selector v-if="steps.current === 'job' && configType === 'inspect'" ref="job" :list.sync="item"></inspect-item-selector>
            <host-selector v-if="steps.current === 'host'" ref="host" :list.sync="hostList"></host-selector>
            <params v-if="steps.current === 'param'" ref="param" :obj.sync="params"></params>
          </t-content>
          <t-footer class="footer_css">
            <t-row justify="center" style="vertical-align: middle">
              <div v-if="steps.current === 'basic'">
                <t-button theme="primary" variant="base" @click="basicToNext">下一步</t-button>
              </div>
              <div v-else-if="steps.current === 'job'">
                <t-button class="mr-5" variant="outline" theme="default" @click="backStep('basic')">上一步</t-button>
                <t-button theme="primary" variant="base" @click="jobToNext">下一步</t-button>
              </div>
              <div v-else-if="steps.current === 'host'">
                <t-button class="mr-5" variant="outline" theme="default" @click="backStep('job')">上一步</t-button>
                <t-button theme="primary" variant="base" @click="hostToNext">下一步</t-button>
              </div>
              <div v-else-if="steps.current === 'param'" class="footer_param">
                <t-button class="mr-5" variant="outline" theme="default" @click="backStep('host')">上一步</t-button>
                <t-button theme="primary" variant="base" @click="save" style="width: 74px;">保存</t-button>
              </div>
            </t-row>
          </t-footer>
        </t-layout>
      </div>
    </div>
  </div>
</template>

<script>
import Basic from '@/components/Config/Basic'
import JobSelector from '@/components/Config/JobSelector'
import HostSelector from '@/components/Config/HostSelector'
import InspectItemSelector from '@/components/Config/InspectItem'
import Params from '@/components/Config/Params'
import { getDecryptPswAPI } from '@/api/inops/CMDB/cmdbDevice'
export default {
  name: 'TaskSteper',
  props: {
    backUrl: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    obj: {
      type: Object,
      default () {
        return {}
      }
    },
    expression: {
      type: String,
      default: ''
    },
    hosts: {
      type: Array,
      default () {
        return []
      }
    },
    tasks: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      title: '', // 标题：新增 / 编辑任务
      // 步骤条
      steps: {
        current: 'basic', // 当前步骤
        options: [
          { title: '基础配置', value: 'basic', content: '这里是提示文字' },
          { title: '脚本配置', value: 'job', content: '这里是提示文字' },
          { title: '设备配置', value: 'host', content: '这里是提示文字' },
          { title: '参数配置', value: 'param', content: '这里是提示文字' }
        ] // 分步器选项
      },
      // 配置任务类型  task  定时任务   backup  备份任务  monitor 监控任务  inspect  巡检任务
      configType: '',
      // 任务执行方式（手动/自动）
      taskType: 'manual',
      // 基础配置对象
      basic: {
        jobName: '', // 任务名称
        jobLabel: '', // 任务类型
        backupType: '', // 备份类型
        jobTimeout: '', // 超时时间
        retentionTime: 7 // 备份文件时长
      },
      // 任务 quartz表达式
      taskExpression: '',
      // 任务项
      taskList: [],
      // 巡检项
      item: [],
      // 设备列表
      hostList: [],
      // 参数配置对象
      params: {
        assignUser: '0', // 是否当前用户
        execUser: '',
        execPass: '',
        plainExecPass: '',
        become: '0',
        becomeMethod: '',
        becomeUser: '',
        becomePass: '',
        plainBecomePass: '',
        bmcExec: '0',
        ignoreErrors: '1',
        delegateToLocal: '0'
      }
    }
  },
  components: { Basic, JobSelector, HostSelector, Params, InspectItemSelector },
  created () {
    this.initData()
  },
  watch: {
    basic: {
      handler (newVal) {
        this.basic = Object.assign(this.basic, newVal)
      },
      deep: true
    }
    // 'step.current': {
    //   handler (newVal) {
    //     if (newVal === 'param') {
    //       this.$nextTick(() => {
    //         this.elBinding()
    //       })
    //     }
    //   }
    // }
  },
  methods: {
    /**
     * 返回
     */
    back () {
      this.$router.push({ path: this.backUrl })
    },
    /**
     * 初始化数据
     */
    initData () {
      this.title = '编辑任务'
      if (this.obj.id) {
        this.title = '新增任务'
      }
      this.configType = this.type
      const { jobName, jobLabel, jobTimeout, backupType, retentionTime, assignUser, execUser, execPass, plainExecPass, become, becomeMethod, becomeUser, becomePass, plainBecomePass, bmcExec, ignoreErrors, delegateToLocal } = this.obj
      this.basic = Object.assign(this.basic, { jobName, jobLabel, jobTimeout, backupType, retentionTime })
      this.params = Object.assign(this.params, { assignUser, execUser, execPass, plainExecPass, become, becomeMethod, becomeUser, becomePass, plainBecomePass, bmcExec, ignoreErrors, delegateToLocal })
      if (this.configType === 'inspect') {
        this.item = this.tasks
      } else {
        this.taskList = this.tasks
      }
      this.hostList = this.hosts
      this.taskExpression = this.expression
    },
    /**
     * 子组件初始化
     * @returns {Promise<void>}
     */
    async childInitData () {
      await this.initData()
      this.$refs.basicInfo.initData()
      this.$refs.basicInfo.childInitData()
    },
    /**
     * 上一步
     * @param doneName 上一步名称
     * @param stepName 下一步名称
     */
    backStep (stepName) {
      this.steps.current = stepName
    },
    /**
     * 解密密文密码
     * @param type 密码类型
     * @param password 密文
     * @returns {Promise<void>}
     */
    async getDecryptPass (type, password) {
      await getDecryptPswAPI(password).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.params[type] = data.message
        }
      })
    },
    /**
     * 获取密码
     * @param plainType 明文类型
     * @param psw 密文密码
     * @returns {Promise<void>}
     */
    async getPass (plainType, psw) {
      console.log(plainType)
      console.log(psw)
      if (this.params[plainType] === '' || this.params[plainType] === '******') {
        if (psw !== '') {
          console.log('密文解码')
          await this.getDecryptPass(plainType, psw)
        } else {
          this.params[plainType] = ''
        }
      }
    },
    /**
     * 基础配置下一步 → 脚本配置
     * @returns {boolean}
     */
    basicToNext () {
      if (!this.basic.jobName) {
        this.$message.warning({ content: '暂未输入任务名称', placement: 'center' })
        return false
      }
      if ((this.configType === 'task' && this.taskValidate() === 'fail') || (this.configType === 'backup' && this.backupValidate() === 'fail')) {
        return false
      }
      if (this.basic.jobTimeout !== '' && !Number.isInteger(Number(this.basic.jobTimeout)) && !Number(this.basic.jobTimeout) > 0) {
        this.$message.warning({ content: '超时时间必须为正整数', placement: 'center' })
        return false
      }
      if (this.taskType === 'auto' && this.taskExpression === '') {
        this.$message.warning({ content: '未配置任务周期执行时间', placement: 'center' })
        return false
      }
      if (this.taskExpression.indexOf('undefined') > -1) {
        this.$message.warning({ content: '请配置任务周期执行时间', placement: 'center' })
        return false
      }
      this.steps.current = 'job'
    },
    /**
     * 脚本配置下一步 → 设备配置
     * @returns {boolean}
     */
    jobToNext () {
      if (this.configType === 'inspect') {
        if (this.item.length === 0) {
          this.$message.warning({ content: '未选择巡检项', placement: 'center' })
          return false
        }
      } else {
        if (this.taskList.length === 0) {
          this.$message.warning({ content: '未选择任务脚本', placement: 'center' })
          return false
        }
      }
      this.steps.current = 'host'
    },
    /**
     * 设备配置 → 参数配置
     * @returns {boolean}
     */
    hostToNext () {
      if (this.hostList.length === 0) {
        this.$message.warning({ content: '未选择任务设备', placement: 'center' })
        return false
      }
      this.steps.current = 'param'
    },
    /**
     * 任务参数对象校验
     * @returns {string}
     */
    taskValidate () {
      if (this.basic.jobLabel.length === 0) {
        this.$message.warning({ content: '未选择任务类型', placement: 'center' })
        return 'fail'
      }
    },
    /**
     * 备份任务校验
     * @returns {string|boolean}
     */
    backupValidate () {
      if (!(Number.isInteger(Number(this.basic.retentionTime)) && Number(this.basic.retentionTime) > 0)) {
        this.$message.warning({ content: '备份时长必须为正整数', placement: 'center' })
        return 'fail'
      }
      return true
    },
    /**
     * 密码校验
     */
    passwordValidate () {
      this.getPass('plainExecPass', this.params.execPass)
      this.getPass('plainBecomePass', this.params.becomePass)
      this.$delete(this.params, 'execPass')
      this.$delete(this.params, 'becomePass')
    },
    /**
     * 保存
     */
    save () {
      const list = this.type === 'inspect' ? this.item : this.taskList
      this.passwordValidate()
      this.$emit('save', this.basic, this.taskExpression, list, this.hostList, this.params)
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-dialog__body
  max-height: 850px !important
/deep/ .t-layout__footer
  padding: 18px
.footer_css
  margin-top: 30px
  height: 64px
  box-shadow: 0px -2px 10px 0px rgba(0, 0, 0, 0.06)
.footer_param
  box-shadow: 0
  position: relative
  left: -530px
</style>
