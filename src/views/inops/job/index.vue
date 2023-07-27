<template>
  <div style="position: relative">
    <keep-alive>
      <online ref="online" v-if="tab === 'online'" :obj.sync="obj" @changeObj="changeObj"></online>
      <execute v-else-if="tab === 'execute'" :tab.sync="tab" :obj.sync="obj"></execute>
    </keep-alive>
  </div>
</template>

<script>
import online from '@/views/inops/job/online'
import execute from '@/views/inops/job/execute'
export default {
  name: 'jobSelector',
  components: { online, execute },
  data () {
    return {
      tab: 'online',
      obj: {
        id: '',
        taskId: '',
        isNew: '',
        type: '',
        name: ''
      }
    }
  },

  mounted () {
    const { id, isNew, type, name } = this.$route.query
    this.obj = Object.assign(this.obj, { id, isNew, type, name })
    this.$refs.online.initData()
  },
  methods: {
    changeObj (tab, obj) {
      this.tab = tab
      this.obj = obj
    }
  }
}
</script>

<style scoped>
</style>
