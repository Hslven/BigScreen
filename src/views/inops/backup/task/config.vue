<template>
  <div style="height: calc(100% - 47px)">
    <task-steper ref="taskStep" :backUrl="url" :type="type" :obj.sync="formData" :expression.sync="scheduleExpr" :hosts.sync="hosts" :tasks.sync="tasks" @save="save"></task-steper>
  </div>
</template>

<script>
import TaskSteper from '@/components/Config/TaskSteper'
import { getOfIdAPI, getHostsOfIdAPI, getTasksOfIdAPI, saveAPI } from '@/api/inops/netBackup/backupTask'
export default {
  name: 'index',
  components: { TaskSteper },
  data () {
    return {
      type: 'backup',
      url: '/inops/backup/task',
      formData: {
        id: '',
        jobName: '',
        backupType: 'net_configuration',
        retentionTime: 7,
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
    saveBackupTask () {
      saveAPI(this.formData).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '已更新备份任务', placement: 'center' })
          this.$router.push({ path: '/inops/backup/task' })
        } else {
          this.$message.error({ content: `${data.message},请检查任务配置时间`, placement: 'center' })
        }
      })
    },
    async save (basicInfo, expression, task, host, params) {
      if (basicInfo.jobName === '') {
        this.$message.success({ content: '未配置任务基本信息', placement: 'center' })
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
      await this.saveBackupTask()
    },
    setTaskItem (data) {
      let sort = 1
      const taskList = []
      data.forEach(item => {
        taskList.push({
          scriptId: item.id,
          scriptName: item.name,
          scriptVersion: item.version,
          scriptType: item.type,
          scriptLang: item.lang,
          scriptBase64Code: item.base64Code,
          scriptCode: item.code,
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
    },
    async getTaskById () {
      await getOfIdAPI(this.formData.id).then(res => {
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
      await getHostsOfIdAPI(this.formData.id).then(async res => {
        const { data } = res
        if (data.code === 200) {
          this.hosts = data.data
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
      await getTasksOfIdAPI(this.formData.id).then(async res => {
        const { data } = res
        if (data.code === 200) {
          data.data.forEach(item => {
            const obj = {
              id: item.scriptId,
              name: item.scriptName,
              version: item.scriptVersion,
              type: item.scriptType,
              lang: item.scriptLang,
              base64Code: item.scriptBase64Code,
              code: item.scriptCode,
              createDate: item.createDate
            }
            this.tasks.push(obj)
          })
        } else {
          this.$message.error({ content: '数据获取失败，请联系管理员', placement: 'center' })
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
