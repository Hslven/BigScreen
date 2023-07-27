<template>
  <div>
    <content-header></content-header>
    <div class="bg-mod-card rounded-sm">
      <div style="display: grid;grid-template-columns: auto 300px 60px;column-gap: 16px" class="m-2">
        <div class="mt-6 ml-4">
          <t-input v-model="globalFilter" placeholder="全局搜索">
            <search-icon slot="prefix-icon"></search-icon>
          </t-input>
        </div>
        <div class="mt-6">
          <t-date-range-picker enable-time-picker allow-input clearable v-model="dateRange" />
        </div>
        <div class="mt-6">
          <t-button @click="searchEvent">
            查询
          </t-button>
        </div>
      </div>
      <t-table rowKey="index" :columns="columns" :data.sync="data" size="small" :pagination="pagination" @data-change="dataChange" style="font-size: 12px;" cellEmptyContent="-" class="px-8">
        <template #name="{ row }">
          <div>
            <a @click="modEvent(row)" class="table-main-font" style="font-weight: 600;cursor: pointer;text-decoration: none;">{{ row.name || '-' }}</a>
            <p class="text-mod-body" style="max-width: 1000px;overflow: hidden;text-overflow: ellipsis;font-size: 12px;font-weight: 400;margin: 0 0 0px !important;">{{ row.description|| '-' }}</p>
          </div>
        </template>
        <template #status="{ row }">
          <mod-status :status="row.status"></mod-status>
        </template>
        <template #executionTime="{ row }">
          {{ dateFormat(row.createdAt) }}
        </template>
        <template #timeConsuming="{ row }">
          {{ timeInterval(row.updatedAt, row.createdAt) }}
        </template>
      </t-table>
    </div>
  </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'
import { modLogTable } from '@/dict/columns'
import { getModLogListApi, deleteModLogAPI } from '@/api/modServer/mod'
import { formatterDate } from '@/utils/index'
import ModStatus from '@/components/modComp/modStatus'
import globalSearch from '@/mixins/globalSearch'
import { SearchIcon } from 'tdesign-icons-vue'
export default {
  name: 'index',
  mixins: [globalSearch],
  components: {
    ModStatus,
    SearchIcon,
    ContentHeader
  },
  data () {
    return {
      filter: '',
      startTime: '',
      endTime: '',
      loading: false,
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 12,
        total: 0,
        showJumper: true
      },
      data: [],
      backData: [],
      columns: modLogTable.columns,
      modInfo: null,
      dateRange: []
    }
  },
  mounted () {
    this.onRequest()
  },
  computed: {
    dateFormat () {
      // 格式化时间
      return function (date) {
        return formatterDate(date)
      }
    },
    timeInterval () {
      // 求时间间隔
      return function (endTime, startTime) {
        const endData = new Date(endTime)
        const startData = new Date(startTime)
        const date3 = endData.getTime() - startData.getTime()
        const leave1 = date3 % (24 * 3600 * 1000)
        const hours = Math.floor(leave1 / (3600 * 1000))
        const leave2 = leave1 % (3600 * 1000)
        const minutes = Math.floor(leave2 / (60 * 1000))
        const leave3 = leave2 % (60 * 1000)
        const seconds = Math.round(leave3 / 1000)
        return hours + ' 小时 ' + minutes + ' 分钟 ' + seconds + ' 秒 '
      }
    }
  },
  methods: {
    dataChange (data) {
      this.data = data
    },
    // 表格数据请求
    onRequest () {
      const postData = {
        userid: this.$store.getters.getInfo.userName,
        sort: '0createdAt'
      }
      this.getModLogList(postData)
    },
    // 模组执行记录详情页挑转
    modEvent (mod) {
      window.sessionStorage.setItem('fromPath', this.$route.path)
      this.$router.push({
        path: `/modops/modLog/${mod._id}`,
        query: { modId: mod.modId }
      })
    },
    // 请求模组执行记录接口
    getModLogList (data) {
      return new Promise((resolve, reject) => {
        getModLogListApi(data).then(response => {
          const { data } = response
          const modLogList = []
          if (data.status === 'success') {
            data.data.list.forEach((val, index) => {
              const instanceDict = {}
              instanceDict.modId = val.mod.id
              instanceDict._id = val._id
              instanceDict.name = val.mod.name
              instanceDict.description = val.mod.description
              instanceDict.user = val.userid
              instanceDict.status = val.status
              instanceDict.updatedAt = val.updatedAt
              instanceDict.createdAt = val.createdAt
              modLogList.push(instanceDict)
            })
            this.data = modLogList
            this.backData = JSON.parse(JSON.stringify(modLogList))
            this.getInitData(this.data)
            this.pagination.total = this.data.length
            // this.data.forEach((val, index) => {
            //   this.deleteModLog(val._id)
            // })
          } else {
            this.$message.error(data)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    deleteModLog (Id) {
      deleteModLogAPI(Id).then(response => {
        const { data } = response
        if (data.status === 'success') {
          this.$message.success('删除成功！')
        }
      }).catch(error => {
        this.$message.error(error.response.data.message)
      })
    },
    searchEvent () {
      const startDate = new Date(this.dateRange[0])
      const startTimestamp = startDate.getTime()
      const endDate = new Date(this.dateRange[1])
      const endTimestamp = endDate.getTime()
      if (!startTimestamp && !endTimestamp) {
        this.onRequest()
      } else {
        const modLogList = []
        this.backData.forEach((val, key) => {
          const modLogDate = new Date(val.createdAt)
          const modLogTimeStamp = modLogDate.getTime()
          if (!startTimestamp) {
            if (modLogTimeStamp <= endTimestamp) {
              modLogList.push(val)
            }
          } else if (!endTimestamp) {
            if (modLogTimeStamp >= startTimestamp) {
              modLogList.push(val)
            }
          } else if (modLogTimeStamp >= startTimestamp && modLogTimeStamp <= endTimestamp) {
            modLogList.push(val)
          }
        })
        this.data = modLogList
        this.getInitData(this.data)
        this.pagination.total = this.data.length
      }
    }
  }
}
</script>

<style scoped>
</style>
