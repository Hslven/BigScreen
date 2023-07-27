<template>
  <div class="bg-mod-card" style="padding: 15px; height: 100%">
    <t-layout class="bg-mod-card" style="padding: 15px; min-height: 100%">
      <t-content>
        <div style="padding: 15px">
          <t-steps v-model="steps.current" readonly :options="steps.options"></t-steps>
        </div>
        <inspect-item-select v-if="steps.current === 'item'" ref="item" :list.sync="item"></inspect-item-select>
        <host-selector v-if="steps.current === 'host'" ref="host" :list.sync="hostList"></host-selector>
      </t-content>
      <t-footer class="footer_css">
        <t-row justify="center" style="vertical-align: middle">
          <div v-if="steps.current === 'item'">
            <t-button theme="primary" variant="base" @click="itemToNext">下一步</t-button>
          </div>
          <div v-else-if="steps.current === 'host'">
            <t-button class="mr-5" variant="outline" theme="default" @click="backStep('item')">上一步</t-button>
            <t-button theme="primary" variant="base" @click="execute">执行</t-button>
          </div>
        </t-row>
      </t-footer>
    </t-layout>
  </div>
</template>

<script>
import HostSelector from '@/components/Config/HostSelector'
import InspectItemSelect from '@/components/Config/InspectItem'
import { manualExecuteAPI } from '@/api/inops/inspect/inspectTask'
export default {
  name: 'manual',
  components: { HostSelector, InspectItemSelect },
  data () {
    return {
      steps: {
        current: 'item', // 当前步骤
        options: [
          { title: '巡检项配置', value: 'item', content: '这里是提示文字' },
          { title: '设备配置', value: 'host', content: '这里是提示文字' }
        ] // 分步器选项
      },
      item: [],
      hostList: [],
      formData: {
        inspectTasks: [],
        inspectHosts: []
      }
    }
  },
  watch: {
    item: {
      handler (newVal) {
        console.log('manual', newVal)
      }
    }
  },
  methods: {
    /**
     * 上一步
     * @param stepName 上一步步骤名称
     */
    backStep (stepName) {
      this.steps.current = stepName
    },
    /**
     * 基础配置下一步 → 脚本配置
     * @returns {boolean}
     */
    itemToNext () {
      if (this.item.length === 0) {
        this.$message.error({ content: '巡检项不允许为空', placement: 'center' })
        return false
      }
      this.steps.current = 'host'
    },
    setItem () {
      this.formData.inspectTasks = []
      for (const item of this.item) {
        this.formData.inspectTasks.push({
          inspectItem: {
            id: item.id
          }
        })
      }
    },
    setHost () {
      this.formData.inspectHosts = []
      this.hostList.forEach(item => {
        this.formData.inspectHosts.push({
          id: item.id
        })
      })
    },
    async execute () {
      await this.setItem()
      await this.setHost()
      const data = {
        inspectTasks: this.formData.inspectTasks,
        inspectHosts: this.formData.inspectHosts,
        type: 'inspect'
      }
      manualExecuteAPI(data).then(response => {
        const { data } = response
        if (data.code === 200) {
          if (data.data.taskId) {
            const obj = {
              taskId: data.data.taskId,
              backUrl: '/inops/inspect/manual',
              name: '自动化巡检-手动执行',
              type: 'inspect',
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
</style>
