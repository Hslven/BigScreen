<template>
  <div style="height: calc(100% - 47px)">
    <task-steper ref="taskStep" :backUrl="url" :type="type" :obj.sync="formData" :expression.sync="scheduleExpr" :hosts.sync="hosts" :tasks.sync="tasks" @save="save"></task-steper>
  </div>
</template>

<script>
import TaskSteper from '@/components/Config/TaskSteper'
import { saveScheduleJobAPI, getTaskByIdAPI, getHostsByIdAPI, getTasksByIdAPI } from '@/api/monitor/monitorJob'
export default {
  name: 'index',
  components: { TaskSteper },
  data () {
    return {
      type: 'task',
      url: '/monitor/monitorTask/taskView',
      formData: {
        id: '',
        jobName: '',
        jobLabel: '',
        jobTimeout: '',
        assignUser: '0',
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
      },
      scheduleExpr: '',
      tasks: [],
      hosts: []
    }
  },
  async mounted () {
    if (this.$route.query.id) {
      this.formData.id = this.$route.query.id
      await this.getTaskById()
      this.$refs.taskStep.childInitData()
    }
  },
  methods: {
    async getTaskById () {
      await getTaskByIdAPI(this.formData.id).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.formData = Object.assign(this.formData, data.data)
          this.formData.plainExecPass = this.formData.execUser ? '******' : ''
          this.formData.plainBecomePass = this.formData.becomeUser ? '******' : ''
          this.scheduleExpr = data.data.scheduleExpr
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
      await getHostsByIdAPI(this.formData.id).then(async res => {
        const { data } = res
        if (data.code === 200) {
          this.hosts = data.data
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
      await getTasksByIdAPI(this.formData.id).then(async res => {
        const { data } = res
        if (data.code === 200) {
          data.data.forEach(item => {
            this.tasks.push(item.script)
          })
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
    },
    saveScheduleJob () {
      saveScheduleJobAPI(this.formData).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '更新配置成功', placement: 'center' })
          this.$router.push({ path: '/monitor/monitorTask/taskView' })
        } else {
          this.$message.error({ content: '请检查任务配置时间', placement: 'center' })
        }
      })
    },
    async save (basicInfo, expression, task, host, params) {
      if (basicInfo.jobName === '' || basicInfo.jobLabel === '') {
        this.$message.error({ content: '未配置任务基本信息', placement: 'center' })
        return false
      }
      if (task.length === 0) {
        this.$message.error({ content: '未配置任务脚本', placement: 'center' })
        return false
      }
      if (host.length === 0) {
        this.$message.error({ content: '未配置任务设备', placement: 'center' })
        return false
      }
      if (params.assignUser === '1') {
        if (!params.execUser || !params.plainExecPass) {
          this.$message.error({ content: '指定用户账号密码不能为空', placement: 'center' })
          return false
        }
      }
      if (params.become === '1') {
        if (!params.becomeUser || !params.plainBecomePass) {
          this.$message.error({ content: '提权用户账号密码不能为空', placement: 'center' })
          return false
        }
      }
      this.formData = Object.assign(this.formData, basicInfo, params)
      this.scheduleExpr = expression
      this.$set(this.formData, 'scheduleExpr', expression)
      await this.setHostItem(host)
      await this.setTaskItem(task)
      await this.saveScheduleJob()
    },
    setTaskItem (data) {
      let sort = 1
      const taskList = []
      data.forEach(item => {
        taskList.push({
          script: {
            id: item.id
          },
          taskName: item.name,
          sort
        })
        sort++
      })
      this.$set(this.formData, 'tasks', taskList)
    },
    setHostItem (data) {
      const hostList = []
      data.forEach(item => {
        hostList.push({
          id: item.id
        })
      })
      this.$set(this.formData, 'hosts', hostList)
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .q-field--dense .q-field__control, .q-field--dense .q-field__marginal
  height: 32px
.dialogContainer
  width: 1280px
  max-width: 80vw
  min-height: 72vh
  max-height: 85vh
.item
  padding: 5px 15px 5px 15px
  background-color: #0277bd
  border: solid 1px #bdbdbd
  margin-bottom: 10px
.item:hover
  background-color: #01579b
.chosen
  border: solid 2px #3089dc !important
/deep/ .CodeMirror
  height: 400px
.canMover
  cursor: move
.canMover:hover
  cursor: move
</style>
