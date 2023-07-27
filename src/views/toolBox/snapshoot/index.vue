<template>
  <div>
    <content-header></content-header>
    <div class="bg-mod-card rounded-sm my-2">
      <div>
          <t-space class="p-2 w-full">
            <t-select label="硬件资源池：" v-model="pool_name" :options="pool_list" style="width: 20%" @change="changePool">
            </t-select>
          </t-space>
      </div>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1.5fr; column-gap: 10px">
      <div>
        <div class="bg-mod-card rounded-sm text-mod-body" style="margin-right: 10px; display: flex; flex-direction: column; height: 100%">
          <div style="font-weight: bold; letter-spacing: 1px" class="text-mod-title p-3">资源池下各分布式存储池节点数变化情况</div>
          <div class="container-style" style="flex: 3 0 40%">
            <div id="storage_pool_chart" style="height: 300px; padding: 22px 0 10px 0; border-bottom: 1px solid rgba(121,135,156,0.1);"></div>
          </div>
          <div style="font-weight: bold; letter-spacing: 1px;" class="text-mod-title p-3">资源池下各HA主机组vCPU变化情况</div>
          <div class="container-style" style="flex: 3 0 40%">
            <div id="ha_chart" style="height: 300px; padding: 22px 0 10px 0; border-bottom: 1px solid rgba(121,135,156,0.1);"></div>
          </div>
        </div>
      </div>
      <div>
        <div class="bg-mod-card rounded-sm w-full text-mod-body"  style="display: flex;flex-direction: column;flex-wrap: nowrap;margin-right: 10px; height: 100%">
          <div style="flex: 1 1 10%;font-weight: bold; letter-spacing: 1px; padding: 20px 0 10px 20px; border-bottom: 1px solid rgba(121,135,156,0.1);">历史数据对比</div>
          <div style="flex: 1 1 30%;padding: 15px 20px 15px 20px">
            <div>
              <div>资源类型: </div>
              <t-radio-group v-model="compare_form.sign">
                <t-radio value="storage">分布式存储池存储服务器节点对比</t-radio>
                <t-radio value="ha">HA主机组计算服务器vcpu对比</t-radio>
              </t-radio-group>
            </div>
            <div style="margin: 10px 0">{{ compare_form.sign === 'storage' ? '分布式存储池' : 'HA主机组' }}:</div>
            <t-select filterable v-model="compare_form.name">
              <t-option v-for="(item) in compare_form.sign === 'storage' ? options.storage : options.ha" :key="item" :label="item" :value="item" />
            </t-select>
            <div style="display: grid; grid-template-columns: 4fr 1fr 4fr;row-gap: 20px;" class="py-3">
              <t-date-picker v-model="compare_form.before" />
              <div style="display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 14px; letter-spacing: 1px">VS</div>
              <t-date-picker v-model="compare_form.after" />
            </div>
            <t-button theme="primary" @click="compareEvent" class="mr-3" block>开始对比</t-button>
          </div>
          <div v-if="!is_compare" style="flex: 1 1 60%; border-top: 1px solid rgba(121,135,156,0.1); display: flex; justify-content: center; align-items: center">
            <img src="../../../assets/images/compare.svg" style="width: 50%; height: 50%">
          </div>
          <div v-if="is_compare" class="text-mod-body" style="flex: 1 1 60%; border-top: 1px solid rgba(121,135,156,0.1); display: grid; grid-template-columns: 4fr 1fr 4fr;row-gap: 20px">
            <div style="border: 1px solid rgba(121,135,156,0.2); margin: 20px 0 20px 20px; border-radius: 5px; overflow: hidden">
              <div style="padding: 16px; border-bottom: 1px solid rgba(121,135,156,0.1)">
                <div style="display: inline-block; letter-spacing: 1px">日期: {{ compare_res.before.date }}</div>
                <div style="display: inline-block; float: right">
                  <span>节点数</span>
                  <span style="padding-left: 10px; font-size: 14px; font-weight: bold;">{{ compare_res.before.total }}</span>
                </div>
              </div>
              <div style="overflow: auto; height: 260px; font-size: 12px" class="scrollbar-style">
                <template v-if="compare_res.before.compare.length !== 0">
                  <div v-for="(item, index) in compare_res.before.compare" :key="index">
                    <div style="padding: 16px 12px 0 16px;display: flex;">
                      <div style="display: inline-block; letter-spacing: 1px;">{{ item.name }}</div>
                    </div>
                    <div style="padding: 12px 12px 0 40px;" v-if="Object.keys(item.extra).length !== 0">
                      <div class="bg-mod-primary" style="display: inline-block; height: 8px; width: 8px; border-radius: 50px; margin-right: 8px"></div>
                      <div style="display: inline-block; letter-spacing: 1px">虚拟机：{{ item.extra.total }}台</div>
                      <div style="letter-spacing: 1px; padding: 10px 10px 0 16px" v-for="(vm, key) in item.extra.vm" :key="key">
                        <t-row style="font-size: 12px">
                          <t-col :span="9">{{ vm.name }}</t-col>
                          <t-col :span="3" style="float: right">vcpu: <span style="font-weight: bold">{{ vm.vcpu }}</span></t-col>
                        </t-row>
                      </div>
                    </div>
                    <div style="border-bottom: 1px solid rgba(121,135,156,0.2); margin: 12px 20px 0 20px"></div>
                  </div>
                </template>
              </div>
            </div>
            <div style="display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 14px; letter-spacing: 1px">VS</div>
            <div style="border: 1px solid rgba(121,135,156,0.2); margin: 20px 20px 20px 0; border-radius: 5px">
                <div style="padding: 16px; border-bottom: 1px solid rgba(121,135,156,0.1)">
                  <div style="display: inline-block; letter-spacing: 1px">日期: {{ compare_res.after.date }}</div>
                  <div style="display: inline-block; float: right">
                    <span>节点数</span>
                    <span style="padding-left: 10px; font-size: 14px; font-weight: bold;">{{ compare_res.after.total }}</span>
                  </div>
                </div>
                <div style="overflow: auto; height: 260px; font-size: 12px" class="scrollbar-style">
                  <template v-if="compare_res.after.compare.length !== 0">
                    <div v-for="(item, index) in compare_res.after.compare" :key="index">
                      <div style="padding: 16px 12px 0 16px;display: flex;">
                        <i class="iconfont icon-pulse text-red q-pr-sm"></i>
                        <div style="display: inline-block; letter-spacing: 1px">{{ item.name }}</div>
                      </div>
                      <div style="padding: 12px 12px 0 40px;" v-if="compare_form.sign !== 'storage' && item.extra">
                        <div class="bg-mod-primary" style="display: inline-block; height: 8px; width: 8px; border-radius: 50px; margin-right: 8px"></div>
                        <div style="display: inline-block; letter-spacing: 1px;">虚拟机：{{ item.extra.total }}台</div>
                        <div style="letter-spacing: 1px; padding: 10px 10px 0 16px" v-for="(vm, key) in item.extra.vm" :key="key">
                          <t-row style="font-size: 12px">
                            <t-col :span="9">{{ vm.name }}</t-col>
                            <t-col :span="3" style="float: right">vcpu: <span style="font-weight: bold">{{ vm.vcpu }}</span></t-col>
                          </t-row>
                        </div>
                      </div>
                      <div style="border-bottom: 1px solid rgba(121,135,156,0.2); margin: 12px 20px 0 20px"></div>
                    </div>
                  </template>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'
import { Line } from '@antv/g2plot'
import {
  getHistoryHaAPI,
  compareHistoryDataApi,
  getHistoryStoragePoolAPI
} from '@/api/cmdb/HardwareResourcePool'
import {
  getPoolInfosApi
} from '@/api/cmdb/cmdb_data_check'
import { cloneDeep } from 'lodash'
function parsePoolInfo (poolData) {
  const columnList = []
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
      compare_form: {
        sign: 'storage',
        name: '',
        before: '',
        after: ''
      },
      compare_res: null,
      options: {
        storage: [],
        ha: []
      },
      pool_name: '',
      pool_list: [],
      is_compare: false,
      history_storage_pools: [],
      history_has: [],
      storage_pool_line: null,
      ha_line: null
    }
  },
  mounted () {
    this.getPoolsListData()
  },
  watch: {
    'compare_form.sign': {
      handler (newval, oldvalue) {
        this.compare_form.name = ''
      },
      deep: true
    }
  },
  methods: {
    getPoolsListData () {
      getPoolInfosApi().then(response => {
        const { data } = response
        if (data.code === 0) {
          this.pool_list = parsePoolInfo(data.data)
          this.pool_name = data.data[0].label
          this.getStoragePoolList(this.pool_name, 'init')
          this.getHaList(this.pool_name, 'init')
        } else {
          this.$message.error(data.message)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    getStoragePoolList (pool, status) {
      getHistoryStoragePoolAPI(pool).then(response => {
        const { data } = response
        if (data.code === 0) {
          this.history_storage_pools = data.data
          this.options.storage = Array.from(new Set(this.history_storage_pools.map(item => item.name)))
          if (status === 'init') {
            this.renderLineChart(this.history_storage_pools, 'storage_pool_chart')
          } else {
            this.storage_pool_line.changeData(this.history_storage_pools)
          }
        } else {
          this.$message.error(data.message)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    getHaList (pool, status) {
      getHistoryHaAPI(pool).then(response => {
        const { data } = response
        if (data.code === 0) {
          this.history_has = data.data
          this.options.ha = Array.from(new Set(this.history_has.map(item => item.name)))
          if (status === 'init') {
            this.renderLineChart(this.history_has, 'ha_chart')
          } else {
            this.ha_line.changeData(this.history_has)
          }
        } else {
          this.$message.error(data.message)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    renderLineChart (data, id) {
      const linePlot = new Line(id, {
        data,
        xField: 'date',
        yField: 'total',
        seriesField: 'name',
        // yAxis: {
        //   label: {
        //     formatter: (v) => `${(v / 10e8).toFixed(1)} B`
        //   }
        // },
        padding: [12, 24, 70, 130],
        legend: {
          position: 'bottom'
        },
        smooth: true,
        // 配置折线趋势填充
        // area: {
        //   style: {
        //     fillOpacity: 0.15
        //   }
        // },
        // @TODO 后续会换一种动画方式
        animation: {
          appear: {
            animation: 'path-in',
            duration: 5000
          }
        }
      })
      linePlot.render()
      if (id === 'ha_chart') {
        this.ha_line = linePlot
      } else {
        this.storage_pool_line = linePlot
      }
    },
    changePool (name) {
      this.pool_name = name
      this.compare_form = {
        sign: 'storage',
        name: '',
        before: '',
        after: ''
      }
      this.is_compare = false
      this.getStoragePoolList(name, 'update')
      this.getHaList(name, 'update')
    },
    compareEvent () {
      const params = {
        pool: this.pool_name,
        ...this.compare_form
      }
      return new Promise((resolve, reject) => {
        compareHistoryDataApi(params).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.compare_res = data.data.data
            this.is_compare = true
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    }
  }
}
</script>

<style scoped>
@media (min-width: 0){
  .container-style {
    height: auto;
    width: 99%;
  }
}
.scrollbar-style::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 2px; /*高宽分别对应横竖滚动条的尺寸*/
}

.scrollbar-style::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  /*box-shadow   : inset 0 0 5px rgba(236, 229, 229, 0.16);*/
  background: rgba(83, 83, 83, 0.4);
}

.scrollbar-style::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  /*box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);*/
  border-radius: 50px;
  background: #ededed;
}
</style>
