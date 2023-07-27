<template>
  <div class="bg-mod-card" style="padding: 15px; height: 100%">
    <log-info :type.sync="fileType" :tableData.sync="infoData" :pageInfo.sync="pages" @getData="getData"></log-info>
  </div>
</template>

<script>
import { pageList } from '@/utils/inops/u'
import logInfo from '@/components/ResultInfo/logInfo'
import { getInspectLogAPI } from '@/api/inops//job/jobStatus'
export default {
  name: 'index',
  components: { logInfo },
  data () {
    return {
      fileType: 'inspect', // 下载文件类型
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
  methods: {
    getData (value, obj) {
      const params = {
        pageNum: obj.current,
        pageSize: obj.size
      }
      getInspectLogAPI(params, value).then(res => {
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
/deep/ .q-field__control
  height: 28px !important
/deep/ .q-field__marginal
  height: 28px !important
/deep/ .q-field--auto-height.q-field--dense .q-field__control
  min-height: 28px !important
/deep/ .q-field--auto-height.q-field--dense .q-field__native
  min-height: 28px !important
/deep/ .q-field__native span
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
/deep/ .q-field__native, .q-field__prefix, .q-field__suffix, .q-field__input
  padding: 0px !important
</style>
