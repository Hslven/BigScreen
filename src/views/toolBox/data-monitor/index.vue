<template>
  <div>
    <content-header></content-header>
    <div class="bg-mod-card rounded-sm p-2">
      <t-button theme="primary" @click="isSelectedPool = true">
        选择资源池
      </t-button>
      <t-dialog :visible.sync="isSelectedPool" header="选择资源池" :cancelBtn="null" @confirm="changePools">
        <t-checkbox-group v-model="poolGroup" :options="poolList" />
      </t-dialog>
    </div>
    <div class="mt-2" style="display: grid;grid-template-columns: 1fr 1fr 1fr 1fr 1fr;width: 100%;column-gap: 15px; row-gap: 15px;">
      <div class="bg-mod-card overflow-hidden" v-for="(item, index) in model" :key="item.name" @click="toDetail(item)">
        <div class="card-body">
          <div style="font-weight: bold;letter-spacing: 1px" class="text-mod-title">
            {{item.name}}
          </div>
          <div :id="`container` + index" style="height: 60px;width: 100%; padding: 10px 0px"></div>
          <t-row :gutter="16" class="mt-4">
            <t-col :span="4">
              <div>
                <div style="font-weight: 600;font-size: 1rem;letter-spacing: 1px;text-align: center" class="text-mod-title">{{item.data.total}}</div>
                <div style="letter-spacing: 1px; text-align: center; font-size: 12px">数据量</div>
              </div>
            </t-col>
            <t-col :span="4">
              <div>
                <div style="font-weight: 600;font-size: 1.2rem;letter-spacing: 1px; text-align: center" class="text-mod-title">{{item.data.check_num}}</div>
                <div style="letter-spacing: 1px; text-align: center; font-size: 12px">检查项</div>
              </div>
            </t-col>
            <t-col :span="4">
              <div>
                <div style="font-weight: 600;font-size: 1rem;letter-spacing: 1px; text-align: center" class="text-mod-title">{{item.data.error_date}}</div>
                <div style="letter-spacing: 1px; text-align: center; font-size: 12px">违规时长(天)</div>
              </div>
            </t-col>
          </t-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'
import { TinyArea } from '@antv/g2plot'
import { cloneDeep } from 'lodash'
import { getCheckDataApi, getPoolInfosApi } from '@/api/cmdb/cmdb_data_check'
function parsePoolInfo (poolData) {
  const columnList = [
    { label: '全选', checkAll: true }
  ]
  poolData.forEach(item => {
    const columnDict = {}
    columnDict.label = item.name
    columnDict.value = item.label
    columnList.push(cloneDeep(columnDict))
  })
  return columnList
}
export default {
  name: 'index',
  components: {
    ContentHeader
  },
  data () {
    return {
      isSelectedPool: false,
      model: [],
      poolGroup: [],
      showing: false,
      poolList: [],
      tinyAreaObjList: []
    }
  },
  created () {
    this.getPoolsListData()
  },
  methods: {
    // 请求事件：获取硬件资源池列表数据
    getPoolsListData () {
      return new Promise((resolve, reject) => {
        getPoolInfosApi().then(response => {
          const { data } = response
          if (data.code === 0) {
            this.poolList = parsePoolInfo(cloneDeep(data.data))
            data.data.forEach((item) => {
              this.poolGroup.push(item.label)
            })
            this.getCheckData({ pools: this.poolGroup, model_name: '' })
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    // 获取CMDB指定资源池下各模型违规数据统计结果
    getCheckData (params) {
      getCheckDataApi(params).then(response => {
        const { data } = response
        if (data.code === 0) {
          data.data.forEach((item) => {
            const modelData = {
              name: item.model_name,
              data: {
                total: item.model_total && item.model_total.length ? item.model_total[item.model_total.length - 1] : 0,
                error_date: 0,
                check_num: item.check_data ? item.check_data.length : 0,
                date: item.dates,
                data: item.error_pure_rate ? item.error_pure_rate : []
              }
            }
            item.check_data && item.check_data.forEach((checkItem) => {
              if (checkItem.error_duration > modelData.data.error_date) {
                modelData.data.error_date = checkItem.error_duration
              }
            })
            this.model.push(cloneDeep(modelData))
          })
          // DOM树渲染完成后再指定下列函数
          this.$nextTick(() => {
            for (const item in this.model) {
              this.renderTinyArea(item)
            }
          })
          this.isSelectedPool = false
        } else {
          this.$message.error(data.message)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    renderTinyArea (index) {
      const idSign = 'container' + index
      const options = {
        height: 60,
        autoFit: false,
        data: this.model[index].data.data,
        smooth: true,
        tooltip: {
          customContent: (title, data) => {
            if (data.length) {
              const sign = (data[0].value * 100).toFixed(4)
              return `<div style="padding: 10px 5px">
                         <div style="padding-bottom: 5px">${this.model[index].data.date[title]}</div>
                         <div>
                            <div style="height: 8px; width: 8px;border-radius: 50px; background-color: #2B84E7; display: inline-block; margin-right: 4px"></div>
                            <div style="display: inline-block">违规率：${sign} %</div>
                         </div>
                     </div>`
            }
          }
        }
      }
      const tinyArea = new TinyArea(idSign, options)
      tinyArea.render()
    },
    changePools () {
      this.model = []
      this.getCheckData({ pools: this.poolGroup, model_name: '' })
    },
    toDetail (item) {
      window.sessionStorage.setItem('fromPath', this.$route.path)
      console.log('query', { modelName: item.name, pools: this.poolGroup })
      this.$router.push({
        path: '/business/dataGovernance/data_monitor_detail',
        query: { modelName: item.name, pools: this.poolGroup }
      })
    }
  }
}
</script>

<style scoped>
.overflow-hidden {
  overflow: hidden !important;
}
.overflow-hidden {
  overflow: hidden !important;
}
.card-body {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 1.4rem 1.5rem;
}
</style>
