<template>
  <div style="height: calc(100% - 47px)">
    <task-steper ref="taskStep" :backUrl="url" :type="type" :obj.sync="formData" :expression.sync="scheduleExpr" :hosts.sync="hosts" :tasks.sync="tasks" @save="save"></task-steper>
  </div>
</template>

<script>
import TaskSteper from '@/components/Config/TaskSteper'
import { saveTaskAPI, getTaskByIdAPI, getHostByTaskIdAPI, getInspectItemByTaskIdAPI } from '@/api/inops/inspect/inspectTask'
export default {
  name: 'config',
  components: { TaskSteper },
  data () {
    return {
      type: 'inspect',
      url: '/inops/inspect/list',
      formData: {
        type: 'inspect',
        id: '',
        jobName: '',
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
    saveScheduleJob () {
      saveTaskAPI(this.formData).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '更新配置成功', placement: 'center' })
          this.$router.push({ path: '/inops/inspect/list' })
        } else {
          this.$message.error({ content: '请检查任务配置时间', placement: 'center' })
        }
      })
    },
    async save (basicInfo, expression, task, host, params) {
      if (this.type === 'inspect') {
        if (basicInfo.jobName === '') {
          this.$message.error({ content: '未配置任务基本信息', placement: 'center' })
          return false
        }
      } else {
        if (basicInfo.jobName === '' || basicInfo.jobLabel === '') {
          this.$message.error({ content: '未配置任务基本信息', placement: 'center' })
          return false
        }
      }
      if (task.length === 0) {
        this.$message.error({ content: '未配置巡检项', placement: 'center' })
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
      this.$set(this.formData, 'jobExpression', expression)
      await this.setHostItem(host)
      await this.setTaskItem(task)
      await this.saveScheduleJob()
    },
    setTaskItem (data) {
      let sort = 1
      const taskList = []
      data.forEach(item => {
        taskList.push({
          inspectItem: {
            id: item.id
          },
          sort
        })
        sort++
      })
      this.$set(this.formData, 'inspectTasks', taskList)
    },
    setHostItem (data) {
      const hostList = []
      data.forEach(item => {
        hostList.push({
          id: item.id
        })
      })
      this.$set(this.formData, 'inspectHosts', hostList)
    },
    async getTaskById () {
      await getTaskByIdAPI(this.formData.id).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.formData = Object.assign(this.formData, data.data)
          this.formData.plainExecPass = this.formData.execUser ? '******' : ''
          this.formData.plainBecomePass = this.formData.becomeUser ? '******' : ''
          this.scheduleExpr = data.data.jobExpression
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
      await getHostByTaskIdAPI(this.formData.id).then(async res => {
        const { data } = res
        if (data.code === 200) {
          this.hosts = data.data
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
      await getInspectItemByTaskIdAPI(this.formData.id).then(async res => {
        const { data } = res
        if (data.code === 200) {
          data.data.forEach(item => {
            this.tasks.push(item.inspectItem)
          })
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
