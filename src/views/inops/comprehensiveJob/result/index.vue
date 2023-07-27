<template>
  <div class="bg-mod-card" style="padding: 15px; height: 100%">
    <log-info :type.sync="fileType" :tableData.sync="infoData" :pageInfo.sync="pages" @getData="getData"></log-info>
  </div>
</template>

<script>
import { pageList } from '@/utils/inops/u'
import logInfo from '@/components/ResultInfo/logInfo'
import { getTaskJobAPI } from '@/api/inops/job/jobStatus'
export default {
  name: 'index',
  data () {
    return {
      fileType: 'schedule', // 下载文件类型
      infoData: [],
      pages: {
        list: pageList,
        total: 0,
        current: 1,
        size: 30,
        align: 'right'
      }
    }
  },
  components: { logInfo },
  methods: {
    /**
     * 获取任务执行记录
     */
    getData (value, obj) {
      const params = {
        pageNum: obj.current,
        pageSize: obj.size
      }
      getTaskJobAPI(params, value).then(res => {
        const { data } = res
        if (data.code === 200) {
          data.data.records.forEach(value => {
            const msg = value.newestTaskNum === null || value.newestTaskName === null ? '' : value.newestTaskNum + '.  ' + value.newestTaskName
            this.$set(value, 'newestTask', msg)
          })
          this.infoData = data.data.records
          const { total, size, current } = data.data
          this.pages = Object.assign(this.pages, { total, size, current })
          this.pages.list[this.pages.list.length - 1].value = total
          this.table.loading = false
        } else {
          this.$message.error({ content: '获取数据失败，请联系管理员', placement: 'center' })
          this.table.loading = false
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-drawer__body
  padding: 0px
/deep/ .t-divider--horizontal
  margin: 0px
</style>
