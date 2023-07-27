<template>
  <div>
    <ContentHeader />
    <div class="bg-mod-card rounded-sm pb-4">
      <!-- 每期机房存储资源总数 -->
      <t-row class="py-4 px-4">
        <t-col :span="2">
          <t-select label="工程期数：" :borderless="true" v-model="currentProject" placeholder="请选择用户" @change="handlePhasesChange(currentProject)">
            <t-option v-for="item in phases" :value="item" :label="item" :key="item"></t-option>
          </t-select>
        </t-col>
        <t-space class="pt-4 px-4 w-full">
          <t-col :span="11" v-for="val,key,index in projectData" :key="index" class="px-4 py-4 text-center rounded-2xl" style="background: rgba(237, 242, 254, 1)">
            <!-- 总数 -->
            <div class="font-bold">{{val.num}}</div>
            <div> <span v-show="index === 0">{{currentProject}}</span> {{val.desc}}</div>
          </t-col>
        </t-space>
      </t-row>
      <!-- 全局搜索和更多筛选 -->
      <t-row>
        <t-col flex="auto" class="mt-6 ml-4 mr-2">
          <div>
            <t-input v-model="globalFilter" placeholder="全局搜索">
              <search-icon slot="prefix-icon"></search-icon>
            </t-input>
          </div>
        </t-col>
        <t-col flex="111px" class="mr-2">
          <div class="mt-6">
            <t-button variant="outline" @click="expanded = !expanded">
              <filter-icon slot="icon" />
              更多筛选
            </t-button>
          </div>
        </t-col>
      </t-row>
      <!-- 列配置 导出数据 -->
      <t-row>
        <t-col :span="12">
          <div style="float:right" class="py-4 pl-4">
            <t-button variant="outline" class="mr-2" @click="columnControllerVisible = true">
              <setting-icon slot="icon" />
              列配置
            </t-button>
            <t-button variant="outline" class="mr-2" @click="exportEvent">
              <download-icon slot="icon" />
              导出数据
            </t-button>
          </div>
        </t-col>
      </t-row>
      <!-- 更多筛选 -->
      <!-- <div> -->
      <t-card class="mx-4 my-4" v-show="expanded">
        <t-row>
          <t-col :span="2" v-for="(formItem) in visibleColumns" :key="formItem" class="m-4">
            <t-input-adornment :prepend="columnsDict[formItem]">
              <t-input placeholder="请输入内容" v-model="visibleForm[formItem]" />
            </t-input-adornment>
          </t-col>
          <!-- 查询重置 -->
          <t-col :span="2" class="m-4">
            <t-button theme="primary" @click="filterEvent" class="mr-4">查询</t-button>
            <t-button variant="outline" @click="resertEvent">重置</t-button>
          </t-col>
        </t-row>
      </t-card>
      <!-- </div> -->
    </div>
    <!-- 表格 resizable列表宽度可自定义拖动 -->
    <div class="t-demo__style">
      <t-table rowKey="index"
       :loading="tableLoading"
       :columns="columns"
       :data="data" size="small"
       :pagination="pagination"
       :columnControllerVisible.sync="columnControllerVisible"
        style="font-size: 12px;"
        :displayColumns.sync="visibleColumns"
        :columnController="{
            dialogProps: { preventScrollThrough: true },
            hideTriggerButton: true
          }"
        cellEmptyContent="-"
        table-layout="fixed"
        class="px-8"
        :ellipsisTitle="false"
        resizable
        bordered="true">
        <template #module="{ row }">
          <t-link style="font-size: 12px;" @click="computedModule(item)" v-for="(item,index) in row.modules" :key="index" class="pr-2" theme="primary" hover="color">
            <span v-if="index%2 !== 0">、</span>{{ item.name }}
          </t-link>
        </template>
      </t-table>
    </div>
    <!-- 计算模块弹窗 -->
    <t-dialog width="70%" :visible="showModule" :close-btn="true" :confirm-btn="null" :cancel-btn="null" :on-close="showModuleDialog" :footer="false" :placement="'center'">
      <template #header>
        <h2>{{ dialogHeader }}</h2>
      </template>
      <template #body>
        <t-tabs :default-value="1">
          <t-tab-panel :value="1" label="机柜">
            <t-row v-show="moduleData.equipment_cabinets.length !== 0" id="alice" class="py-3" style="min-height: 400px">
              <t-loading attach="#alice" size="medium" :loading="loading"></t-loading>
              <t-space v-for="item,index in moduleData.equipment_cabinets" :key="index" class="py-4 px-4 w-full" style="background-color: rgba(242, 243, 245,1);">
                <t-col class=" py-2 text-center" style="height: 100%;display: flex;flex-direction: column;justify-content: center;align-items: center;">
                  <div class="font-semibold">{{ item.name }}</div>
                  <div>{{ item.hardware_partition }}</div>
                </t-col>
                <t-col class="px-2 py-2 rounded" style="height: 100%;background: rgba(219, 227, 246, 1)">
                  <div class="mx-4 flex items-center justify-items-center font-semibold">
                    <svg-icon name="circle" size="16" color="#165dff"></svg-icon>
                    <div>
                      网络设备
                    </div>
                  </div>
                  <div class="mx-4 px-4 py-2">
                    <span v-show="item.network_devices.length !== 0" class="text-xs" v-for="info,index in item.network_devices" :key="index">
                      <span v-show="index != 0">、</span><span>{{ info }}</span>
                    </span>
                    <span v-show="item.network_devices.length === 0">暂无数据</span>
                  </div>
                </t-col>
                <t-col class="px-4 py-2 flex-clo rounded " style="height: 100%;background: rgba(219, 227, 246, 1)">
                  <div class="mx-4 flex items-center justify-items-center font-semibold">
                    <svg-icon name="circle" size="16" color="#165dff"></svg-icon>
                    <div>
                      计算设备
                    </div>
                  </div>
                  <div class="mx-4 text-xs px-4 py-2">
                    <p v-for="device in  item.computer_devices" :key="device">{{ device }}</p>
                    <p v-show="item.computer_devices.length === 0">暂无数据</p>
                  </div>
                </t-col>
                <t-col class="px-4 py-2 flex-clo rounded" style="height: 100%;background: rgba(219, 227, 246, 1)">
                  <div class="mx-4 flex items-center justify-items-center font-semibold">
                    <svg-icon name="circle" size="16" color="#165dff"></svg-icon>
                    <div>
                      存储设备
                    </div>
                  </div>
                  <div class="mx-4 text-xs px-4 py-2">
                    <p v-for="device in  item.storage_devices" :key="device">{{ device }}</p>
                    <p v-show="item.storage_devices.length === 0">暂无数据</p>
                  </div>
                </t-col>
              </t-space>
            </t-row>
            <t-row v-show="moduleData.equipment_cabinets.length == 0" class="py-3 flex items-center justify-items-center" style="min-height: 400px">
              <div class="w-full text-center">暂无数据</div>
            </t-row>
          </t-tab-panel>
          <t-tab-panel :value="2" label="主机组">
            <t-row v-show="moduleData.has.length !== 0" class="py-3" style="min-height: 400px">
              <t-space class="py-4 px-4 w-full" v-for="item in moduleData.has" :key="item.name" style="background-color: rgba(242, 243, 245,1);">
                <t-col class="px-4 py-2 text-center" style="height: 100%;display: flex;flex-direction: column;justify-content: center;align-items: center;">
                  <div class="font-semibold">{{ item.name }}</div>
                  <div>{{ item.hardware_partition }}</div>
                </t-col>
                <t-col class="px-4 py-2 flex-clo rounded " style="height: 100%;background: rgba(219, 227, 246, 1)">
                  <div class="mx-4 flex items-center justify-items-center font-semibold">
                    <svg-icon name="circle" size="16" color="#165dff"></svg-icon>
                    <div>
                      计算设备
                    </div>
                  </div>
                  <div class="mx-4 text-xs px-4 py-2">
                    <p v-for="device in  item.computer_devices" :key="device">{{ device }}</p>
                    <p v-show="item.computer_devices.length === 0">暂无数据</p>
                  </div>
                </t-col>
                <t-col class="px-4 py-2 flex-clo rounded" style="height: 100%;background: rgba(219, 227, 246, 1)">
                  <div class="mx-4 flex items-center justify-items-center font-semibold">
                    <svg-icon name="circle" size="16" color="#165dff"></svg-icon>
                    <div>
                      存储信息
                    </div>
                  </div>
                  <div class="mx-4 text-xs px-4 py-2">
                    <div>存储集群：<span v-show="item.storage_cluster">{{ item.storage_cluster }} </span> <span v-show="!item.storage_cluster">暂无数据</span></div>
                    <div>存储池：<span>{{item.storage_pools}}</span></div>
                    <div>存储服务器：<span>{{item.storage_servers}}</span></div>
                  </div>
                </t-col>
              </t-space>
            </t-row>
            <t-row v-show="moduleData.has == 0" class="py-3 flex items-center justify-items-center text-center" style="min-height: 400px">
              <div class="w-full text-center">暂无数据</div>
            </t-row>
          </t-tab-panel>
        </t-tabs>
      </template>

    </t-dialog>

  </div>
</template>

<script>
// 导入头部通用组件
import ContentHeader from '@/components/contentHeader/header'
// 导入全局搜索组件
import globalSearch from '@/mixins/globalSearch'
// 导入字体图标组件
import { SearchIcon, FilterIcon, SettingIcon, DownloadIcon } from 'tdesign-icons-vue'
// 导入svg字体图标
import SvgIcon from '@/components/SvgIcon/SvgIcon'
// 导入表格 表头数据  计算模块数据
import { machineTapble } from '@/dict/columns.js'
// 转换数格式工具函数
import { parseColumnToDict, parseColumnToForm } from '@/utils/index'
// 获取数据的接口
import { getMachineRooms, getModuleData } from '@/api/cmdb/machine_room'
// 导入简化函数
import { simplifyName } from './simplify'
// 深拷贝
import { cloneDeep } from 'lodash'
export default {
  name: 'index',
  mixins: [globalSearch],
  components: {
    ContentHeader, // 导入头部通用组件
    SearchIcon,
    FilterIcon,
    SettingIcon,
    DownloadIcon,
    SvgIcon
  },
  data () {
    return {
      // 表格data
      data: [],
      // 计算模块data
      moduleData: { equipment_cabinets: [], has: [] },
      // 计算模态框标题
      dialogHeader: null,
      // 表格加载动画
      tableLoading: true,
      // 模态框loading加载动画
      loading: false,
      // 选项卡参数
      // tabValue: true,
      // 延迟显示加载效果的时间，用于防止请求速度过快引起的加载闪烁，单位：毫秒
      delay: 100,
      // 筛选后的数据
      backupData: [],
      // 工程期数
      phases: [],
      // 当前工程期数
      currentProject: '全部',
      // 当前工程期数对应数据
      projectData: {
        sum: {
          desc: '设备总数',
          num: 0
        },
        host_server_num: {
          desc: '计算设备数量',
          num: 0
        },
        storage_server_num: {
          desc: '存储设备数量',
          num: 0
        },
        router_num: {
          desc: '路由机设备数量',
          num: 0
        },
        switch_num: {
          desc: '交换机设备数量',
          num: 0
        },
        firewall_num: {
          desc: '防火墙设备数量',
          num: 0
        }
      },
      // 更多筛选的显示隐藏
      expanded: false,
      // 计算模块的显示隐藏
      showModule: false,
      // 列配置
      columnControllerVisible: false,
      // 表头
      columns: machineTapble.columns,
      // 表头字段
      visibleColumns: machineTapble.visibleColumns,
      // form表单需要提价的字段
      visibleForm: parseColumnToForm(machineTapble.columns),
      // 描述字段
      columnsDict: parseColumnToDict(machineTapble.columns),
      // 表格对应参数
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 10,
        total: 0
      }
    }
  },
  computed: {
  },
  mounted () {
    // console.log(this.columns)
    this.getData()
  },
  methods: {
    // 显示隐藏模态框
    showModuleDialog () {
      this.showModule = !this.showModule
      // 打开默认选项卡第一个
      this.tabValue = !this.tabValue
      // 清空上一次的数据
      this.moduleData = { equipment_cabinets: [], has: [] }
    },
    computedModule (item) {
      this.dialogHeader = item.name
      this.showModuleDialog()
      // 通过id去拿对应的模块数据
      this.getModule(item.id)
    },
    // 计算模块数据
    getModule (id) {
      return new Promise((resolve, reject) => {
        // 显示加载动画
        this.loading = true
        getModuleData(id).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.moduleData = data.data
            // 机柜
            this.moduleData.equipment_cabinets = this.moduleData.equipment_cabinets.map(item => {
              if (item.computer_devices.length !== 0) {
                item.computer_devices = simplifyName(item.computer_devices, 'shorthand')
              }
              if (item.storage_devices.length !== 0) {
                item.storage_devices = simplifyName(item.storage_devices, 'shorthand')
              }
              return item
            })
            // 主机组
            this.moduleData.has = this.moduleData.has.map(item => {
              if (item.computer_devices.length !== 0) {
                item.computer_devices = simplifyName(item.computer_devices, 'shorthand')
              }
              if (item.storage_pools.length !== 0) {
                item.storage_pools = simplifyName(item.storage_pools).join('，')
              } else {
                item.storage_pools = '暂无数据'
              }
              if (item.storage_servers.length !== 0) {
                item.storage_servers = simplifyName(item.storage_servers, 'shorthand').join('，')
              } else {
                item.storage_servers = '暂无数据'
              }
              return item
            })
            this.loading = false
          } else {
            this.$message.error(data.message)
            this.loading = false
          }
        }).catch(err => {
          this.loading = false
          this.$message.error(err.status + '')
          this.showModuleDialog()
          reject(err)
        })
      })
    },
    // 请求接口获取数据 表格详细数据
    getData () {
      return new Promise((resolve, reject) => {
        getMachineRooms().then(response => {
          const { data } = response
          if (data.code === 0) {
            this.data = data.data.map(item => {
              item.business = [...item.business].join('、')
              return item
            })
            // console.log('this.data', this.data)
            console.log('data.business', this.data)
            // 筛选工程期数
            this.screen(this.data)
            // 统计对应数据
            this.statistics()
            this.getInitData(this.data)
            // console.log('getInitData', this.getInitData(this.data))
            this.pagination.total = this.data.length
            this.backupsData = cloneDeep(this.data)
          } else {
            this.$message.error(data.message)
          }
          this.tableLoading = false
        }).catch(error => {
          this.$message.error(error.status + '')
          this.tableLoading = false
          reject(error)
        })
      })
    },
    // 查询
    filterEvent () {
      this.data = this.backupsData.filter((item) => {
        let result = true
        for (const key in this.visibleForm) {
          if (result && this.visibleForm[key]) {
            if (!item[key]) {
              result = false
            } else {
              result = item[key].toString().includes(this.visibleForm[key])
            }
          }
        }

        return result
      })
      this.pagination.total = this.data.length
    },
    // 重置
    resertEvent () {
      this.getData()
      this.visibleForm = parseColumnToForm(machineTapble.columns)
    },
    // 导出数据
    exportEvent () {
      const header = []
      // this.visibleColumns.forEach((val, index) => {
      //   // 表格不导出模块
      //   if (this.columnsDict[val] !== '模块') {
      //     header.push(this.columnsDict[val])
      //   }
      // })
      require.ensure([], () => {
        const { exportJsonToExcel } = require('@/utils/excel/Export2Excel')
        const tabledata = this.formatJson(this.visibleColumns, this.data.map(item => {
          delete item.module
          return item
        }))
        // console.log('tabledata', this.data.map(item => {
        //   delete item.module
        //   return item
        // }))

        exportJsonToExcel(header, tabledata, '机房概览图表')
      })
    },
    // 格式化表格数据
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 监听下拉框改变 统计数据
    handlePhasesChange () {
      if (this.currentProject !== '全部') {
        // this.globalFilter = this.currentProject
        this.visibleForm.project_period = this.currentProject
      } else {
        // this.globalFilter = ''
        this.visibleForm.project_period = ''
      }
      this.filterEvent()
      this.statistics()
    },
    // 统计工程对应数据
    statistics () {
      this.projectData = {
        sum: {
          desc: '设备总数',
          num: 0
        },
        host_server_num: {
          desc: '计算设备数量',
          num: 0
        },
        storage_server_num: {
          desc: '存储设备数量',
          num: 0
        },
        router_num: {
          desc: '路由机设备数量',
          num: 0
        },
        switch_num: {
          desc: '交换机设备数量',
          num: 0
        },
        firewall_num: {
          desc: '防火墙设备数量',
          num: 0
        }
      }
      if (this.currentProject === '全部') {
        this.data.map(item => {
          this.projectData.host_server_num.num += item.host_server_num
          this.projectData.storage_server_num.num += item.storage_server_num
          this.projectData.router_num.num += item.router_num
          this.projectData.switch_num.num +=
            this.projectData.firewall_num.num += item.firewall_num
          this.projectData.sum.num = this.projectData.sum.num + item.host_server_num + item.storage_server_num + item.router_num + item.switch_num + item.firewall_num
          // console.log(this.projectData.host_server_num.num)
        })
      } else {
        this.data.map(item => {
          if (item.project_period === this.currentProject) {
            this.projectData.host_server_num.num += item.host_server_num
            this.projectData.storage_server_num.num += item.storage_server_num
            this.projectData.router_num.num += item.router_num
            this.projectData.switch_num.num += item.switch_num
            this.projectData.firewall_num.num += item.firewall_num
            this.projectData.sum.num = this.projectData.sum.num + item.host_server_num + item.storage_server_num + item.router_num + item.switch_num + item.firewall_num
          }
        })
      }
    },
    // 筛选工程期数数据和对应设备数据
    screen (data) {
      const set = new Set(data.map(item => {
        return item.project_period
      }).sort())
      console.log('set', set)
      this.phases = ['全部', ...set]
    }
  }
}
</script>

  <style lang="scss" scoped>
</style>
