<template>
  <div>
    <content-header></content-header>
    <div class="bg-mod-card rounded-sm" style="margin-bottom: 12px;">
      <t-space class="pt-4 px-4 w-full">
        <div class="t-tdesign-demo__tag-input">
          <label>硬件资源池</label>
          <t-select v-model="itemLabel" :options="poolList" style="width: 50%" />
        </div>
        <div style="float: right; width: 30%">
          <t-button variant="outline" @click="exportHAData('all')" class="mr-2">
            <download-icon slot="icon" />
            HA资源数据
          </t-button>
          <t-button variant="outline" @click="genExcelEvent">
            <download-icon slot="icon" />
            省报表
          </t-button>
        </div>
      </t-space>
      <t-row>
        <t-col :span="4" v-for="(obj, index) in pieChartData" :key="index" class="mb-4">
          <t-row>
            <t-col :span="3">
              <div class="pt-6 pl-10">
                <t-space direction="vertical" align="center">
                  <t-progress theme="circle" :percentage="obj.percent" :label="false" :size="'small'"></t-progress>
                  <div style="font-size: 16px; font-weight: 900" class="text-center pt-2">
                      {{ obj.percent }}%
                    </div>
                    <div style="font-size: 14px" class="text-center">
                      {{ obj.name }}
                    </div>
                </t-space>
              </div>
            </t-col>
            <t-col :span="9">
              <div class="pt-4 pr-4">
                <t-space class="w-full source-main-row-style rounded-sm p-2" style="background: rgba(237, 242, 254, 1)">
                  <div class="source-main-row-font text-mod-title" style="font-size: 12px">已占用</div>
                  <div style="float: right">
                    <div class="text-mod-body">{{ obj.used }} {{ obj.sign }}</div>
                  </div>
                </t-space>
                <t-space class="w-full source-minor-row-style rounded-sm p-2" style="background: rgba(237, 242, 254, 1)">
                  <div class="source-minor-row-font" style="font-size: 12px">未使用</div>
                  <div style="float: right">
                    <div>{{ obj.surplus }} {{ obj.sign }}</div>
                  </div>
                </t-space>
                <div>
                  <t-space class="w-full source-minor-row-style rounded-sm p-2" style="background: rgba(237, 242, 254, 1)">
                  <div style="font-size: 12px">可分配总量</div>
                  <div style="float: right">
                    <div>{{ obj.total }} {{ obj.sign }}</div>
                  </div>
                  </t-space>
                </div>
              </div>
            </t-col>
          </t-row>
        </t-col>
      </t-row>
    </div>
    <t-row :gutter="16">
      <t-col :span="6">
        <div>
          <div class="bg-mod-card rounded-sm">
            <div>
              <t-space class="source-main-row-style bg-mod-primary bg-opacity-10 rounded-md m-4" style="width: 96%">
                <div class="source-main-row-font text-mod-title p-4" style="font-size: 12px">
                  <div class="text-mod-title">硬件服务器</div>
                  <div class="text-mod-body" style="font-size: 12px !important; font-weight: 500">可信资源池下的所有硬件服务器</div>
                </div>
                <div style="float: right" class="p-4">
                  <t-space>
                    <div v-for="(num, name) in poolServerNode" :key="name" class="pr-4">
                      <div class="text-weight-bold">
                        {{ num }}
                      </div>
                      <div class="text-mod-body">
                        {{ serverDict[name] }}
                      </div>
                    </div>
                  </t-space>
                </div>
              </t-space>
            </div>
            <div>
              <t-space class="source-main-row-style bg-mod-primary bg-opacity-10 rounded-md mx-4" style="width: 96%">
                <div class="source-main-row-font text-mod-title p-4" style="font-size: 12px">
                  <!-- <div class="text-mod-title" style="cursor: pointer" @click="dialogEvent(poolOverViewInfo.businessSystem.data)">业务系统</div> -->
                  <div class="text-mod-title">业务系统</div>
                  <div class="text-mod-body" style="font-size: 12px !important; font-weight: 500">资源池下所有业务系统,包括每个业务系统的网元和APP</div>
                </div>
                <div style="float: right" class="p-4">
                  <t-space>
                    <countTo :startVal='0' :endVal='poolOverViewInfo.businessSystem.sum || 0' :duration='2500'/>
                  </t-space>
                </div>
              </t-space>
            </div>
            <div>
              <t-space class="source-main-row-style bg-mod-primary bg-opacity-10 rounded-md mx-4" style="width: 96%">
                <div class="source-main-row-font text-mod-title p-4" style="font-size: 12px">
                  <!-- <div class="text-mod-title" style="cursor: pointer" @click="dialogMangeSystemSign = !dialogMangeSystemSign">管理系统</div> -->
                  <div class="text-mod-title" >管理系统</div>
                  <div class="text-mod-body" style="font-size: 12px !important; font-weight: 500">资源池下所有管理系统,包括每个管理系统的网元和APP</div>
                </div>
                <div style="float: right" class="p-4">
                  <t-space>
                    <countTo :startVal='0' :endVal='poolOverViewInfo.mangeSystem.sum || 0' :duration='2500'/>
                  </t-space>
                </div>
              </t-space>
            </div>
            <div>
              <t-space class="source-main-row-style bg-mod-primary bg-opacity-10 rounded-md mx-4" style="width: 96%">
                <div class="source-main-row-font text-mod-title p-4" style="font-size: 12px">
                  <div class="text-mod-title">网元</div>
                  <div class="text-mod-body" style="font-size: 12px !important; font-weight: 500">可信资源池下的网元总数</div>
                </div>
                <div style="float: right" class="p-4">
                  <t-space>
                    <countTo :startVal='0' :endVal='poolOverViewInfo.networkElemNum || 0' :duration='2500'/>
                  </t-space>
                </div>
              </t-space>
            </div>
          </div>
        </div>
      </t-col>
      <t-col :span="6">
        <div>
          <div class="bg-mod-card rounded-sm">
            <div
                class="p-4"
                id="HAChart"
                style="widht:100%; height: 360px"
            ></div>
          </div>
        </div>
      </t-col>
    </t-row>
    <div class="bg-mod-card rounded-sm mt-3">
      <t-tabs :value="tablePancel" @change="(newValue) => (tablePancel = newValue)" class="text-mod-title">
        <t-tab-panel value="ha">
          <template #label> HA详情 </template>
          <div class="flex flex-row-reverse mt-4">
            <t-button variant="outline" class="mr-2" @click="haColumnControllerVisible = true">
              <setting-icon slot="icon" />
              列配置
            </t-button>
          </div>
          <t-table
            rowKey="index"
            :columns="haColumns"
            :data.sync="haData"
            size="small"
            :columnControllerVisible.sync="haColumnControllerVisible"
            :displayColumns.sync="haVisibleColumns"
            :columnController="{
              dialogProps: { preventScrollThrough: true },
              hideTriggerButton: true
            }"
            :pagination="haPagination"
            style="font-size: 12px;"
            cellEmptyContent = "-"
            class="px-8"
          >
            <template #cpu_precent_project="{ row }">
              <span style="display: flex;line-height: 20px;">
                <i :class="[percentHaStyle(row.cpu_sign,row.cpu_precent_project).style]" class="Indicator-icon Status-indicator"></i>
                <span class="font-bold">{{ percentHaStyle(row.cpu_sign,row.cpu_precent_project).value }}</span>
              </span>
            </template>
            <template #cpu_precent="{ row }">
              <span style="display: flex;line-height: 20px;">
                <i :class="[percentHaStyle(row.cpu_sign,row.cpu_precent).style]" class="Indicator-icon Status-indicator"></i>
                <span class="font-bold">{{ percentHaStyle(row.cpu_sign,row.cpu_precent).value }}</span>
              </span>
            </template>
            <template #memory_precent_project="{ row }">
              <span style="display: flex;line-height: 20px;">
                <i :class="[percentHaStyle(row.memory_sign,row.memory_precent_project).style]" class="Indicator-icon Status-indicator"></i>
                <span class="font-bold">{{ percentHaStyle(row.memory_sign,row.memory_precent_project).value }}</span>
              </span>
            </template>
            <template #memory_precent="{ row }">
              <span style="display: flex;line-height: 20px;">
                <i :class="[percentHaStyle(row.memory_sign,row.memory_precent).style]" class="Indicator-icon Status-indicator"></i>
                <span class="font-bold">{{ percentHaStyle(row.memory_sign,row.memory_precent).value }}</span>
              </span>
            </template>
            <template #storage_precent_project="{ row }">
              <span style="display: flex;line-height: 20px;">
                <i :class="[percentHaStyle(row.storage_sign,row.storage_precent_project).style]" class="Indicator-icon Status-indicator"></i>
                <span class="font-bold">{{ percentHaStyle(row.memory_sign,row.storage_precent_project).value }}</span>
              </span>
            </template>
            <template #storage_precent="{ row }">
              <span style="display: flex;line-height: 20px;">
                <i :class="[percentHaStyle(row.storage_sign,row.storage_precent).style]" class="Indicator-icon Status-indicator"></i>
                <span class="font-bold">{{ percentHaStyle(row.memory_sign,row.storage_precent).value }}</span>
              </span>
            </template>
          </t-table>
        </t-tab-panel>
        <t-tab-panel value="network">
          <template #label> 网元详情 </template>
          <div>
            <div class="flex flex-row-reverse mt-4">
              <t-button variant="outline" class="mr-2" @click="networkElemtColumnControllerVisible = true">
                <setting-icon slot="icon" />
                列配置
              </t-button>
            </div>
            <t-table
              rowKey="index"
              :columns="networkColumns"
              :data.sync="networkData"
              size="small"
              :columnControllerVisible.sync="networkElemtColumnControllerVisible"
              :displayColumns.sync="networkElemtVisibleColumns"
              :columnController="{
                dialogProps: { preventScrollThrough: true },
                hideTriggerButton: true
              }"
              :pagination="networkElemtPagination"
              style="font-size: 12px;"
              cellEmptyContent = "-"
              class="px-8"
            >
              <template #storagePercent="{ row }">
                <t-space>
                  <!-- <i :class="[percentStatus(row.storagePercent)?'successStatus':'failStatus']" class="Indicator-icon Status-indicator"></i> -->
                  <div style="line-height: 1.71">
                    <a class="h6 text-mod-title" style="text-decoration: none;">{{ percentFormatter(row.storagePercent) }}</a>
                    <p style="font-size: 12px;margin: 0 0 0px !important;">{{ row.storageValue || 0}} / {{ row.storagePlan || 0}} (规划值)</p>
                  </div>
                </t-space>
              </template>
              <template #memoryPercent="{ row }">
                <t-space>
                  <!-- <i :class="[percentStatus(row.memoryPercent)?'successStatus':'failStatus']" class="Indicator-icon Status-indicator"></i> -->
                  <div style="line-height: 1.71">
                    <a class="h6 text-mod-title" style="text-decoration: none;">{{ percentFormatter(row.memoryPercent) }}</a>
                    <p style="font-size: 12px;margin: 0 0 0px !important;">{{ row.memoryValue || 0}} / {{ row.memoryPlan || 0}} (规划值)</p>
                  </div>
                </t-space>
              </template>
              <template #cpuPercent="{ row }">
                <t-space>
                  <!-- <div class="mod-flex-center">
                    <div>
                    <i :class="[percentStatus(row.cpuPercent)?'successStatus':'failStatus']" class="Indicator-icon Status-indicator"></i>
                  </div>
                  </div> -->
                  <div style="line-height: 1.71">
                    <a  class="h6 text-mod-title" style="text-decoration: none;">{{ percentFormatter(row.cpuPercent) }}</a>
                    <p style="font-size: 12px;margin: 0 0 0px !important;">{{ row.cpuValue || 0}} / {{ row.cpuPlan || 0}} (规划值)</p>
                  </div>
                </t-space>
              </template>
            </t-table>
          </div>
        </t-tab-panel>
      </t-tabs>
    </div>
    <!-- <q-dialog
      v-model="dialogSign"
  >
    <q-card flat style="width: 400px">
      <q-card-section>
        <div style="max-width: 450px">
          <q-list class="rounded-borders">
            <q-expansion-item
                v-for="(data, index) in dialogData"
                :key="index"
                expand-separator
                :label="data.name"
            >
              <q-card style="background-color: #EFF4F9">
                <q-card-section>
                  <q-list dense>
                    <q-item
                        v-for="(value, key) in data.networkElemList"
                        :key="key"
                    >
                      <q-item-section>
                        <div class="text-caption">{{value.name}}</div>
                      </q-item-section>
                      <q-item-section avatar>
                        <q-badge color="orange">
                          APP: {{value.appNum}}
                        </q-badge>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </q-card-section>
    </q-card>
    </q-dialog>
    <t-dialog width="30%" :visible.sync="dialogMangeSystemSign" header="详情" :cancelBtn="null" :confirm-btn="null">
      <t-list :split="true" size="small">
        <t-list-item v-for="(value, key) in poolOverViewInfo.mangeSystem.data" :key="key">
          <t-list-item-meta :description="value"></t-list-item-meta>
        </t-list-item>
      </t-list>
    </t-dialog> -->
  </div>
</template>

<script>
import { getPoolNetworkAPI, getPoolsListAPI, getPoolsHaAPI, getPoolsOverviewAPI, getHADataAPI, groupExcelGenAPI } from '@/api/cmdb/HardwareResourcePool'
import { DownloadIcon, SettingIcon } from 'tdesign-icons-vue'
import countTo from 'vue-count-to'
import { Column } from '@antv/g2plot'
import ContentHeader from '@/components/contentHeader/header'
import { haTable, networkTable } from '@/dict/columns'
import { serverDict } from '@/dict/dict'
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
  name: 'Capacity',
  components: {
    ContentHeader,
    countTo,
    SettingIcon,
    DownloadIcon
  },
  props: {},
  data () {
    return {
      dialogMangeSystemSign: false,
      serverDict: serverDict,
      tablePancel: 'network',
      loading: false,
      haColumnControllerVisible: false,
      haVisibleColumns: haTable.visibleColumns,
      haPagination: {
        defaultCurrent: 1,
        defaultPageSize: 12,
        total: 0,
        showJumper: true
      },
      haColumns: haTable.columns,
      networkElemtColumnControllerVisible: false,
      networkColumns: networkTable.columns,
      networkElemtVisibleColumns: networkTable.visibleColumns,
      networkElemtPagination: {
        defaultCurrent: 1,
        defaultPageSize: 12,
        total: 0,
        showJumper: true
      },
      dialogSign: false,
      itemLabel: 'NFV-RP-HNGZ-03A',
      poolList: null,
      poolOverViewInfo: {
        physical: {
          sum: null
        },
        businessSystem: {
          sum: null,
          data: null
        },
        mangeSystem: {
          sum: null,
          data: null
        }
      },
      poolServerNode: {
        computer: null,
        mange: null,
        storage: null
      },
      networkData: [],
      haData: [],
      networkChartData: [], // 网元占比图表数据
      haChartData: [], // HA占比图表数据
      dialogData: [],
      pieChartData: {
        cpu: {
          name: 'CPU',
          total: 0,
          used: 0,
          surplus: 0,
          percent: 0,
          sign: '个'
        },
        storage: {
          name: '存储',
          total: 0,
          used: 0,
          surplus: 0,
          percent: 0,
          sign: 'TB'
        },
        memory: {
          name: '内存',
          total: 0,
          used: 0,
          surplus: 0,
          percent: 0,
          sign: 'GB'
        }
      },
      haChart: null
    }
  },
  mounted () {
    this.GetPoolDataApi()
    this.HAChart()
    this.antvChartWidthAdaption()
  },
  computed: {
    percentStatus () {
      return function (percent) {
        if (parseInt(percent) >= 100) {
          return false
        } else {
          return true
        }
      }
    },
    percentFormatter () {
      return function (percent) {
        if (percent) {
          return percent + '%'
        } else {
          return percent + '0'
        }
      }
    },
    percentHaStyle () {
      return function (sign, value) {
        if (sign === 'cpu' || sign === 'memory') {
          if (value >= 85) {
            return { style: 'failStatus', value: value + '%' }
          } else if (value === 0) {
            return { style: 'failStatus', value: '空' }
          } else {
            return { style: 'successStatus', value: value + '%' }
          }
        } else {
          if (value >= 95) {
            return { style: 'failStatus', value: value + '%' }
          } else if (value === 0) {
            return { style: 'failStatus', value: '空' }
          } else {
            return { style: 'successStatus', value: value + '%' }
          }
        }
      }
    }
  },
  watch: {
    networkChartData: {
      handler (newval, oldvalue) {
        this.ParseNetworkChartData(newval)
      },
      deep: true
    },
    haChartData: {
      handler (newval, oldvalue) {
        this.haChart.changeData(newval)
        this.haChart.render()
      },
      deep: true
    },
    itemLabel: {
      handler (newval, oldvalue) {
        // 发起cmdb接口请求
        this.GetPoolsListData()
        this.GetPoolsHaData()
        this.GetPoolsOverviewData()
        this.GetPoolNetworkData()
        this.getHAData(newval)
      },
      deep: true
    }
  },
  methods: {
    genExcelEvent () {
      return new Promise((resolve, reject) => {
        groupExcelGenAPI({ filename: '省报表--业务资源占用详单.xlsx' }).then(response => {
          const blob = new Blob([response.data], {
            type: 'application/vnd.ms-excel'
          })
          const fileNameEncode = response.headers['content-disposition'].split('filename=')[1]
          const fileName = decodeURIComponent(fileNameEncode)
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName)
          } else {
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob)
            link.download = fileName
            link.click()
            window.URL.revokeObjectURL(link.href)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    // 请求ha资源数据
    getHAData (poolName) {
      return new Promise((resolve, reject) => {
        getHADataAPI({ pool: poolName }).then(response => {
          const { data } = response
          if (data.code === 0) {
            if (poolName === 'all') {
              data.data.forEach((elemt, index) => {
                elemt.detail = JSON.stringify(elemt.detail)
              })
              this.exportExcel(data.data)
            } else {
              data.data.forEach((elemt, index) => {
                elemt.cpu_sign = 'cpu'
                elemt.memory_sign = 'memory'
                elemt.storage_sign = 'storage'
                if (elemt.cpu_sum === 0) {
                  elemt.cpu_precent_project = 0
                  elemt.cpu_precent = 0
                } else {
                  elemt.cpu_precent_project = Math.round(elemt.cpu_project / elemt.cpu_sum * 100)
                  elemt.cpu_precent = Math.round(elemt.cpu_used / elemt.cpu_sum * 100)
                }
                if (elemt.memory_sum === 0) {
                  elemt.memory_precent_project = 0
                  elemt.memory_precent = 0
                } else {
                  elemt.memory_precent_project = Math.round(elemt.memory_project / elemt.memory_sum * 100)
                  elemt.memory_precent = Math.round(elemt.memory_used / elemt.memory_sum * 100)
                }
                if (elemt.storage_sum === 0) {
                  elemt.storage_precent_project = 0
                  elemt.storage_precent = 0
                } else {
                  elemt.storage_precent_project = Math.round(elemt.storage_project / elemt.storage_sum * 100)
                  elemt.storage_precent = Math.round(elemt.storage_used / elemt.storage_sum * 100)
                }
              })
              this.haData = data.data
              this.haPagination.total = data.data.length
            }
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },
    // Ha资源数据导出
    exportHAData (sign) {
      this.getHAData(sign)
    },
    exportExcel (data) {
      require.ensure([], () => {
        const { exportJsonToExcel } = require('../../../utils/excel/Export2Excel')
        const tHeader = ['HA名称', '现网已用CPU', '规划CPU', '现网可用CPU', '规划可用CPU', 'CPU总和', '现网已用内存', '规划内存', '现网可用内存', '规划可用内存', '内存总和', '现网已用存储', '规划存储', '现网可用存储', '规划可用存储', '存储总和', '规划网元详情']
        const filterVal = ['name', 'cpu_used', 'cpu_project', 'cpu_usable', 'cpu_usable_project', 'cpu_sum', 'memory_used', 'memory_project', 'memory_usable', 'memory_usable_project', 'memory_sum', 'storage_used', 'storage_project', 'storage_usable', 'storage_usable_project', 'storage_sum', 'detail']
        const tabledata = this.formatJson(filterVal, data)
        exportJsonToExcel(tHeader, tabledata, '所有资源池的HA资源数据')
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },

    dialogEvent (data) {
      this.dialogSign = true
      this.dialogData = data
    },

    // 操作事件：解析数据用于表格展示
    ParseNetworkChartData (data1) {
      // 找出name值相同的对象数据，存放在同一个列表中
      const s = new Set()
      data1.forEach(item => s.add(item.name))
      const newData = Array.from({ length: s.size }, () => [])
      data1.forEach(item => {
        const index = [...s].indexOf(item.name)
        newData[index].push(item)
      })

      // 获取相同name的CPU、存储、内存数据
      const result = []
      newData.forEach(value => {
        const content = {
          name: '',
          storageValue: '',
          storagePercent: '',
          storagePlan: '',
          memoryValue: '',
          memoryPercent: '',
          memoryPlan: '',
          cpuValue: '',
          cpuPercent: '',
          cpuPlan: ''
        }
        for (let i = 0; i < value.length; i++) {
          content.name = value[i].name
          if (value[i].type === 'cpu') {
            content.cpuValue = value[i].value
            content.cpuPlan = value[i].plan_value
            if (value[i].plan_value === 0) {
              content.cpuPercent = '0'
            } else {
              content.cpuPercent = Math.round(value[i].value / value[i].plan_value * 100)
            }
          } else if (value[i].type === 'storage') {
            content.storageValue = value[i].value
            content.storagePlan = value[i].plan_value
            if (value[i].plan_value === 0) {
              content.storagePercent = '0'
            } else {
              content.storagePercent = Math.round(value[i].value / value[i].plan_value * 100)
            }
          } else if (value[i].type === 'memory') {
            content.memoryValue = value[i].value
            content.memoryPlan = value[i].plan_value
            if (value[i].plan_value === 0) {
              content.memoryPercent = '0'
            } else {
              content.memoryPercent = Math.round(value[i].value / value[i].plan_value * 100)
            }
          }
        }
        result.push(content)
      })
      this.networkData = result
      this.networkElemtPagination.total = result.length
    },

    // 操作事件：展示HA占比图例
    HAChart () {
      const data = this.haChartData
      this.haChart = new Column('HAChart', {
        data,
        xField: 'name',
        yField: 'percent',
        isGroup: true,
        yAxis: false,
        xAxis: false,
        legend: {
          position: 'bottom'
        },
        isStack: true,
        seriesField: 'type',
        groupField: 'category',
        color: ['#EFF4F9', '#566f7b', '#EFF4F9', '#242E42'],
        annotations: [
          {
            type: 'line',
            autoAdjust: true,
            start: ['min', 85],
            end: ['max', 85],
            text: {
              content: '预警线 85%',
              offsetX: -23,
              offsetY: -2,
              style: {
                textAlign: 'left',
                fontSize: 10,
                fill: '#033C51',
                textBaseline: 'bottom'
              }
            },
            style: {
              stroke: '#033C51'
            }
          }
        ],
        tooltip: {
          shared: true,
          customContent: (name, items) => {
            const container = document.createElement('div')
            container.className = 'g2-tooltip'
            const title = `<div class="g2-tooltip-title" style="margin-top: 12px;margin-bottom: 12px;">${name}</div>`
            let listItem = ''
            items.forEach((item) => {
              let sign = ''
              let value = ''
              if (item.data.category === 'CPU') {
                sign = '(vcpu)'
                value = item.data.value
              } else {
                sign = 'GB'
                value = Math.round(item.data.value)
              }
              listItem += `<li class="g2-tooltip-list-item" data-index={index} style="margin-bottom:4px;display:flex;align-items: center;">
      <span style="background-color:${item.mappingData.color || item.color};" class="g2-tooltip-marker"></span>
      <span style="display:inline-flex;flex:1;justify-content:space-between">
      <span style="margin-right: 16px;">${item.data.type}:</span><span>${value}${sign} - ${item.data.percent}%</span>
      </span>
  </li>`
            })
            container.innerHTML = title + listItem
            return container
          }
        }
      })
      this.haChart.render()
    },

    // 操作事件：页面渲染时请求该页面的接口
    GetPoolDataApi () {
      this.GetPoolsListData()
      this.GetPoolsHaData()
      this.GetPoolsOverviewData()
      this.GetPoolNetworkData()
      this.getHAData(this.itemLabel)
    },

    // 请求事件：获取硬件资源池列表数据
    GetPoolsListData () {
      return new Promise((resolve, reject) => {
        getPoolsListAPI({}).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.poolList = parsePoolInfo(data.data)
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },

    // 请求事件：获取单个硬件资源池下HA资源占比数据
    GetPoolsHaData () {
      return new Promise((resolve, reject) => {
        getPoolsHaAPI(this.itemLabel).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.haChartData = data.data
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },

    // 请求事件：获取单个硬件资源池总览数据
    GetPoolsOverviewData () {
      return new Promise((resolve, reject) => {
        getPoolsOverviewAPI(this.itemLabel).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.poolOverViewInfo = data.data
            this.poolServerNode = data.data.physical.node
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },

    // 请求事件：获取单个硬件资源池下网元占比数据
    GetPoolNetworkData () {
      return new Promise((resolve, reject) => {
        getPoolNetworkAPI(this.itemLabel).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.pieChartData.cpu.total = data.data.cpuSum
            this.pieChartData.cpu.surplus = data.data.cpuSurplus
            this.pieChartData.cpu.used = this.pieChartData.cpu.total - this.pieChartData.cpu.surplus
            this.pieChartData.cpu.percent = Math.round(this.pieChartData.cpu.used / this.pieChartData.cpu.total * 100)
            this.pieChartData.storage.total = Math.round(data.data.storageSum / 1024)
            this.pieChartData.storage.surplus = Math.round(data.data.storageSurplus / 1024)
            this.pieChartData.storage.used = this.pieChartData.storage.total - this.pieChartData.storage.surplus
            this.pieChartData.storage.percent = Math.round(this.pieChartData.storage.used / this.pieChartData.storage.total * 100)
            this.pieChartData.memory.total = Math.round(data.data.memorySum)
            this.pieChartData.memory.surplus = Math.round(data.data.memorySurplus)
            this.pieChartData.memory.used = this.pieChartData.memory.total - this.pieChartData.memory.surplus
            this.pieChartData.memory.percent = Math.round(this.pieChartData.memory.used / this.pieChartData.memory.total * 100)
            this.networkChartData = data.data.data
            const freeData = [
              {
                type: 'CPU',
                name: '剩余',
                percent: parseFloat((this.pieChartData.cpu.surplus / this.pieChartData.cpu.total * 100).toFixed(2)),
                value: this.pieChartData.cpu.surplus
              },
              {
                type: '内存',
                name: '剩余',
                percent: parseFloat((this.pieChartData.memory.surplus / this.pieChartData.memory.total * 100).toFixed(2)),
                value: this.pieChartData.memory.surplus
              },
              {
                type: '存储',
                name: '剩余',
                percent: parseFloat((this.pieChartData.storage.surplus / this.pieChartData.storage.total * 100).toFixed(2)),
                value: this.pieChartData.storage.surplus
              }
            ]
            this.networkChartData.push(...freeData)
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    }
  }
}
</script>

<style scoped>
  .t-tdesign-demo__tag-input {
    display: flex;
    align-items: baseline;
  }
  .t-tdesign-demo__tag-input label {
    width: 100px;
  }
  .pool-main-content{
    display: flex;
    flex-direction: column;
    justify-content: center
  }
  .pool-main-content-style{
    margin: 10px 0px 10px 16px;
    border-radius: 10px;
    padding: 24px;
  }
  .source-main-row-style{
    min-height: 34px !important;
    margin-bottom: 10px
  }
 .source-main-row-font{
   font-weight: 600;
   font-size: 12px;
   letter-spacing: 1px
 }
  .source-minor-row-style{
    border-radius: 4px;
    min-height: 34px !important;
    margin-bottom: 10px
  }
  .source-minor-row-font{
    font-size: 12px;
    letter-spacing: 1px
  }
  /deep/ .q-table th, .q-table td {
    padding: 10px 16px !important;
  }
  /deep/ .q-field--outlined.q-field--rounded .q-field__control {
    background: #eff4f9;
  }
  /deep/ .q-field--outlined .q-field__control:before {
    border: 0px solid rgba(0,0,0,0.24) !important;
  }
  /deep/ #input-style .q-field--dense .q-field__control, .q-field--dense .q-field__marginal {
    background: #eff4f9
  }
  /deep/ .q-radio__inner--truthy {
    color: #55BC8A;
  }
  .select-pool {
    cursor:pointer;
    background-color: #eff4f9
  }
  .select-pool:hover {
    color: #fff !important;
    background-color: #242e42 !important;
  }
  .select-pool:hover > div{
    color: #fff !important;
  }
  .q-item {
    min-height: 12px !important;
  }
  /deep/ .q-checkbox__bg {
    color: #55bc8a;
  }
  /deep/ .input-style .q-field .q-field__control {
    background: #eff4f9 !important;
  }
</style>
