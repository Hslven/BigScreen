<template>
  <div>
    <content-header></content-header>
    <div>
      <!-- 时间 -->
      <div class="bg-mod-card w-full px-4 py-2 rounded-sm">
        <t-space>
          <t-space>
            <t-radio-group v-model="dimension" variant="default-filled">
              <t-radio-button value="day">按天</t-radio-button>
              <t-radio-button value="hour">按小时</t-radio-button>
            </t-radio-group>
          </t-space>
          <t-date-range-picker allow-input clearable v-model="dateRange" />
          <t-button @click="onSubmit">确认</t-button>
        </t-space>
      </div>
      <!-- 概览 -->
      <div class="w-full py-2 bg-mod-card my-2 rounded-sm">
        <t-row :gutter="16">
          <!-- 环形图 -->
          <t-col :span="2">
            <div class="pl-4 py-2">
              <div style="font-size: 12px; letter-spacing: 2px">
                单模型接口可用率
              </div>
              <div class="my-4">
                <div class="py-4 mod-flex-center">
                  <t-progress theme="circle" :strokeWidth="15" :percentage="
                      parseInt((modelVisitData.avail_rate * 100).toFixed(2))
                    "></t-progress>
                </div>
                <div class="pt-4">
                  <t-row>
                    <t-col :span="6" class="mod-flex-center">
                      <div>
                        <div v-show="modelVisitData.total === ''" style="
                            font-size: 16px;
                            font-weight: 600;
                            text-align: center;
                          ">
                          暂无数据
                        </div>
                        <div v-show="modelVisitData.total !== ''" style="
                            font-size: 16px;
                            font-weight: 600;
                            text-align: center;
                          ">
                          {{ modelVisitData.total }}
                        </div>
                        <div style="font-size: 12px">模型访问总数</div>
                      </div>
                    </t-col>
                    <t-col :span="6" class="mod-flex-center">
                      <div>
                        <div v-show="modelVisitData.fail === ''" style="
                            font-size: 16px;
                            font-weight: 600;
                            text-align: center;
                          ">
                          暂无数据
                        </div>
                        <div v-show="modelVisitData.fail !== ''" style="
                            font-size: 16px;
                            font-weight: 600;
                            text-align: center;
                          ">
                          {{ modelVisitData.fail }}
                        </div>
                        <div style="font-size: 12px">模型访问失败总数</div>
                      </div>
                    </t-col>
                  </t-row>
                </div>
              </div>
            </div>
          </t-col>
          <!-- 饼图 一级聚类统计-->
          <t-col :span="2">
            <div class="w-full py-2">
              <div style="font-size: 12px; letter-spacing: 2px" class="pb-4">
                系统模型访问情况统计
              </div>
              <div v-show="modelsData.detail.length !== 0" id="sysModel" class="w-full px-4 pb-4" style="height: 220px"></div>
              <div v-show="modelsData.detail.length === 0" class="w-full px-4 pb-4 flex items-center justify-center" style="height: 220px;">暂无数据</div>
            </div>
          </t-col>
          <!-- 折线图 一级聚类统计-->
          <t-col :span="8">
            <div class="bg-mod-card w-full px-4 py-2 rounded-sm">
              <div>
                <div style="font-size: 12px; letter-spacing: 2px" class="pb-4">
                  各模型访问统计
                </div>
                <div v-show="modelsData.detail.length !== 0" id="one" class="w-full px-4 pb-4" style="height: 200px"></div>
                <div v-show="modelsData.detail.length === 0" class="w-full px-4 pb-4 flex items-center justify-center" style="height: 300px;">暂无数据</div>
              </div>
            </div>
          </t-col>
        </t-row>
      </div>
      <div class="bg-mod-card w-full px-4 py-2 rounded-sm">
        <t-row>
          <!-- 折线图 -->
          <t-col :span="6">
            <div>
              <div style="font-size: 12px; letter-spacing: 2px" class="pb-4">
                各模型访问统计
              </div>
              <div v-show="modelsData.detail.length !== 0" id="models" class="w-full px-4 pb-4" style="height: 300px"></div>
              <div v-show="modelsData.detail.length === 0" class="w-full px-4 pb-4 flex items-center justify-center" style="height: 300px;">暂无数据</div>
            </div>
          </t-col>
          <!-- 柱状图 -->
          <t-col :span="6">
            <div>
              <div style="font-size: 12px; letter-spacing: 2px" class="pb-4">
                各模型访问统计
              </div>
              <div v-show="modelsData.detail.length !== 0" id="modelsColumn" class="w-full px-4 pb-4" style="height: 300px"></div>
              <div v-show="modelsData.detail.length === 0" class="w-full px-4 pb-4 flex items-center justify-center" style="height: 300px;">暂无数据</div>
            </div>
          </t-col>
        </t-row>
      </div>
      <!-- 排行榜 -->
      <t-row :gutter="16" class="pt-2">
        <t-col :span="6">
          <div class="bg-mod-card w-full px-4 py-2 rounded-sm">
            <t-row :gutter="16" class="mb-4">
              <t-col :span="7">
                <div style="font-size: 12px; letter-spacing: 2px">
                  单模型访问情况统计
                </div>
              </t-col>
              <t-col :span="5">
                <t-select label="模型：" :borderless="true" v-model="model" placeholder="请选择模型" @change="handleChange">
                  <t-option v-for="item in modelOptions" :value="item" :label="modelDictionary[item]" :key="item"></t-option>
                </t-select>
              </t-col>
            </t-row>
            <div v-show=" model  !== ''" id="singleModel" class="w-full px-4 pb-4" style="height: 335px"></div>
            <div v-show=" model  === ''" class="w-full px-4 pb-4 flex items-center justify-center" style="height: 335px;">暂无数据</div>
          </div>
        </t-col>
        <t-col :span="2">
          <div class="bg-mod-card w-full px-4 py-2 rounded-sm">
            <div style="font-size: 12px; letter-spacing: 2px">
              模型访问总量排行榜
            </div>
            <div style="overflow: auto; min-height: 360px;max-height: 360px;">
              <div v-show="modelsData.mv_rank.length !== 0" v-for="(item, index) in modelsData.mv_rank" :key="index" class="pt-4" style="
                  display: grid;
                  grid-template-columns: 0.5fr 3fr 0.5fr;
                  width: 100%;
                  height: 100%;
                ">
                <div>
                  <t-tag size="small" v-if="index < 4" theme="primary">{{
                    index + 1
                  }}</t-tag>
                  <t-tag size="small" v-else>{{ index + 1 }}</t-tag>
                </div>
                <t-tooltip :content="item.model" placement="mouse">
                  <div class="font-bold truncate pr-2">{{ checkModelDictionarymodel(item.model) }}</div>
                </t-tooltip>
                <div>{{ item.total }}</div>
              </div>
              <div v-show="modelsData.mv_rank.length === 0" class="w-full px-4 pb-4 flex items-center justify-center" style="height: 360px;">暂无数据</div>
            </div>
          </div>
        </t-col>
        <t-col :span="2">
          <div class="bg-mod-card w-full px-4 py-2 rounded-sm">
            <div style="font-size: 12px; letter-spacing: 2px">
              模型访问异常排行榜
            </div>
            <div style="overflow: auto; min-height: 360px;max-height: 360px;">
              <div v-show="modelsData.fail_mv_rank.length !== 0" v-for="(item, index) in modelsData.fail_mv_rank" :key="index" class="pt-4" style="
                  display: grid;
                  grid-template-columns: 0.5fr 3fr 0.5fr;
                  width: 100%;
                  height: 100%;
                ">
                <div>
                  <t-tag size="small" v-if="index < 4" theme="danger">{{
                    index + 1
                  }}</t-tag>
                  <t-tag size="small" v-else>{{ index + 1 }}</t-tag>
                </div>
                <t-tooltip :content="item.model" placement="mouse">
                  <div class="font-bold truncate pr-2">{{ checkModelDictionarymodel(item.model) }}</div>
                </t-tooltip>
                <div>{{ item.total }}</div>
              </div>
              <div v-show="modelsData.fail_mv_rank.length === 0" class="w-full px-4 pb-4 flex items-center justify-center" style="height: 360px;">暂无数据</div>
            </div>
          </div>
        </t-col>
        <t-col :span="2">
          <div class="bg-mod-card w-full px-4 py-2 rounded-sm">
            <div style="font-size: 12px; letter-spacing: 2px">
              模型访问成功率排行榜
            </div>
            <div style="overflow: auto; min-height: 360px;max-height: 360px;">
              <div v-show="modelsData.fail_mv_rank.length !== 0" v-for="(item, index) in modelsData.fail_mv_rank" :key="index" class="pt-4" style="
                  display: grid;
                  grid-template-columns: 0.5fr 3fr 0.5fr;
                  width: 100%;
                  height: 100%;
                ">
                <div>
                  <t-tag size="small" v-if="index < 4" theme="danger">{{
                    index + 1
                  }}</t-tag>
                  <t-tag size="small" v-else>{{ index + 1 }}</t-tag>
                </div>
                <t-tooltip :content="item.model" placement="mouse">
                  <div class="font-bold truncate pr-2">{{ checkModelDictionarymodel(item.model) }}</div>
                </t-tooltip>
                <div>{{ item.total }}</div>
              </div>
              <div v-show="modelsData.fail_mv_rank.length === 0" class="w-full px-4 pb-4 flex items-center justify-center" style="height: 360px;">暂无数据</div>
            </div>
          </div>
        </t-col>
      </t-row>
    </div>
  </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'
import { getBeforeDate, parseTime } from '@/utils'
import {
  getVisitAnalyseApi,
  getModelsApi,
  getSingleModelApi
} from '@/api/cmdb/cmdb_api_analy'
import { Line, Pie, Column } from '@antv/g2plot'
import { cloneDeep } from 'lodash'

const statusDict = {
  total: '总调用次数',
  success: '调用成功次数',
  fail: '调用失败次数'
}

export default {
  name: 'webApi',
  components: {
    ContentHeader
  },
  data () {
    return {
      modelVisitData: { total: '', fail: '', avail_rate: '' },
      dimension: 'day',
      dateRange: [getBeforeDate(1), getBeforeDate(0)],
      model: '',
      modelOptions: [],
      webVisitChart: null,
      webModelsVisitChart: null,
      webModelsVisitChartColumn: null,
      modelVisitChart: null,
      modelsData: {
        mv_rank: [],
        fail_mv_rank: [],
        detail: []
      },
      // 字典
      userDictionary: { Rmc: '资源中心', 'navi-framework': '主动运维', rizhietone: '宜通日志', WatchingGo: '监控机器人', OMAPP: 'chatops', nfvi_kpi_configurable: '性能门户', network_butler: '网络配置', business_butler: '业务管家', Modops: '凌云模组', easyops: '网络云CMDB', inops: '自动化运维', lixuanda: 'lixuanda', can: 'can', yjcsszdh_wl: 'yjcsszdh_wl' },
      modelDictionary: { HARDWARE: '硬件设备', AREA: '网络云大区', RESOURE_POOL_NODE: '资源池节点', HARDWARE_PARTITION: '硬件分区', VIRTUAL_RESOURCE_POOL: '虚拟资源池', REGION: 'REGION域', AZ: 'AZ可用区', HA: 'HA主机组', PEOPLE: '人员', ORGANIZATION: '组织', PROJECT_CMDB: '工程', BOARD_CARD: '板卡', HOST_BUS_ADAPTER_CARD: 'HBA卡', DISK_ARRAY_CONTROLLER: '磁阵控制器', DISK_ARRAY: '磁盘阵列', SECURITY: '保障', PORT: '物理端口', NETWORK_INTERFACE_CARD: '网卡', DISTRIBUTED_STORAGE_CLUSTER: '分布式存储集群', DISTRIBUTED_STORAGE_POOL: '分布式存储池', VOLUME: '卷', INTERFACE: '逻辑端口', BACKEND_STORAGE: '后端存储', NETWORK_EQUIPMENT: '网络设备', SWITCH: '交换机设备', ROUTER: '路由器设备', LB: '负载均衡器', VNF: 'VNF', VIM_TENANTS: 'VIM租户', NETWORK_ELEMENT: '网元', CENTRALIZED_STORAGE_POOL: '集中式存储池', DISK_ZONE: '硬盘域', MODOULE: '网络云模块', PLAN_MGM_SYSTEM: '规划-管理系统', PLAN_HA: '规划-HA主机组', PLAN_STORAGE_POOL: '规划-存储池', HIGHLY_AVAILABLE_NETWORK: '网元组', WAF: 'WAF', IS: 'IS', DDOS: 'DDOS', DISK: '硬盘', VRITUAL_MACHINE: '虚拟机', MANAGEMENT_SYSTEM: '管理系统', CUTOVER: '割接', PLAN_VNF: '规划-网元', SERVER: '服务器', OTHER_SERVER: '其他服务器', COMPUTER_SERVER: '计算服务器', STORAGE_SERVER: '存储服务器', FIREWALL_INFO: '防火墙设备', BEAM_SPLITTER: '分光器', SPLITTER_MODULE: '分光器模块', DUMB_DEVICE_PORT: '哑设备端口', STATIC_LINK: '静态链路', OPTICAL_AMPLIFIRE: '光放大器', SHUNT: '分流器', LOGINCAL_LINK: '逻辑链路', COLLECTOR_METRIC_SET: '指标集', STACKED_DEVICE: '堆叠设备', STACKED_SWITCH: '堆叠交换机', LAB: '机房（网络云）', RACK: '机架（网络云）', COLLECTION: '采集情况', APM_QUERY_VIEW: 'apm链路追踪查询视图', CUSTOM_JOB_PARAMS_CONFIG: '自定义资源任务采集参数配置', STORYBOARD_FUNCTION: 'Storyboard Function', PUBLIC_IP: '公网IP', PUBLIC_CMNET_IP: '公网CMNET_IP', OUTSIDE_FW_NAT: '外层防火墙NAT表', PUBLIC_F5_IP: '公网F5IP', F5_VS: 'F5VS映射表', STORYBOARD_THEME_PAGE: '微应用主题页面模板', MACHINE_ROOM: '机房（空间）', FRAME: '机架（空间）', DISTRICT: '区域（空间）', BUILDING: '楼宇（空间）', DATA_CENTER: '数据中心', LOCATION_POINT: '位置点', SITE: '站点', HARDWARE_RESOURCE_POOL: '硬件资源池', IPS: 'IP地址', PRIVATE_VNIC_IP_T: '虚拟网卡IP', VLAN_T: 'VLAN', SUBNET_T: '子网', VRF_T: 'VRF', PRIVATE_GW_IP_T: '网关IP', PRIVATE_VNFBUSINESS_IP_T: '网元业务IP', NEXTHOP_IP_T: '下一跳', LOOPBACK_IP_T: '网元loopback地址', VTEP_IP_T: 'VTEP_IP', LINK_PORT_IP: '接口IP', OUTSIDE_VRF: 'VPN关联表', BUSINESS_NAME: '业务系统（一朵云）', SDN: 'SDN', DEVICE_POWER: '设备供电电源模块', CLICKHOUSE_SERVICE_NODE: 'ClickHouse实例', USER_TEST: '用户权限测试模型', APP_INSTANCE: '应用实例', DEPLOY_DASHBOARD: '应用发布统计', KUBERNETES_HELM_RELEASE: 'Kubernetes应用', KUBERNETES_POD: 'K8S 容器组', ALERT_CONDITION_STRATEGY: '告警条件策略', ALERT_GROUP_STRATEGY: '告警分组策略', ALERT_METRIC_FILL_STRATEGY: '告警丰富策略', ALERT_NOTIFY_BLOCK_STRATEGY: '通知屏蔽策略', ALERT_NOTIFY_INHIBIT_STRATEGY: '通知抑制策略', ALERT_NOTIFY_STRATEGY: '告警通知策略', ALERT_RULE: '告警规则', CMDB_INSTANCES_STRATEGY: '监控目标策略', DOMAIN_VIEW: '领域视图', NAMESPACE: '命名空间', RELATION_ATTRIBUTE: '关系属性', RELATION_INDEX: '关系属性索引', ALERT_NOTIFY_BLOCK_RULE: '通知屏蔽规则', ALERT_GROUP_RULE: '告警分组规则', ALERT_GROUP_RULE_GROUP_STRATEGY: '告警分组规则分组策略' }
    }
  },
  created () { },
  mounted () {
    this.onSubmit()
  },
  methods: {
    onSubmit () {
      const paramForm = {
        dimension: this.dimension,
        begin_time: this.dateRange[0],
        end_time: this.dateRange[1]
      }

      this.getCMDBVisitAnalysisData(paramForm)
      this.getCMDBModelsData(paramForm)
    },
    handleChange (value, context) {
      const paramForm = {
        dimension: this.dimension,
        begin_time: this.dateRange[0],
        end_time: this.dateRange[1]
      }
      this.getCMDBSingleModelData(paramForm)
    },
    getCMDBVisitAnalysisData (params) {
      return new Promise((resolve, reject) => {
        getVisitAnalyseApi(params)
          .then((response) => {
            const { data } = response
            if (data.code === 0) {
              if (JSON.stringify(data.data) !== '[]') {
                this.modelVisitData = data.data.collect
                if (this.webVisitChart) {
                  this.webVisitChart.changeData(
                    this.dataSum(this.processRenderData(data.data.detail))
                  )
                } else {
                  // const tooltipData = {
                  //   formatter: (datum) => {
                  //     return {
                  //       name: statusDict[datum.category],
                  //       value: datum.value
                  //     }
                  //   }
                  // }
                  this.webVisitChart = this.renderPie(
                    'sysModel',
                    this.dataSum(this.processRenderData(data.data.detail))
                  )
                  this.webVisitChart.render()
                }
              } else {
                this.$message.error('暂无数据')
                this.modelVisitData = { total: '', fail: '', avail_rate: '' }
              }
            } else {
              this.$message.error(data.message)
            }
          })
          .catch((error) => {
            console.log(error)
            this.$message.error(error.status + '')
          })
      })
    },
    getCMDBModelsData (params) {
      return new Promise((resolve, reject) => {
        getModelsApi(params)
          .then((response) => {
            const { data } = response
            if (data.code === 0) {
              if (JSON.stringify(data.data) !== '[]') {
                this.modelsData = data.data
                const modelSet = new Set()
                data.data.detail.forEach((item) => {
                  modelSet.add(item.model)
                })
                this.modelOptions = Array.from(modelSet)
                this.model = this.model ? this.model : this.modelOptions[0]
                // 查询字典
                this.modelsData.detail = this.modelsData.detail.map(item => {
                  if (this.modelDictionary[item.model]) {
                    item.model = this.modelDictionary[item.model]
                  }
                  return item
                })

                if (this.webModelsVisitChart) {
                  this.webModelsVisitChart.changeData(this.modelsData.detail)
                  this.webModelsVisitChartColumn.changeData(this.modelsData.detail)
                } else {
                  // 折线图
                  this.webModelsVisitChart = this.renderLine(
                    'models',
                    { xField: 'time', yField: 'total', seriesField: 'model' },
                    this.modelsData.detail
                  )
                  this.webModelsVisitChart.render()
                  // 柱状图
                  this.webModelsVisitChartColumn = this.renderColumn('modelsColumn', this.modelsData.detail)
                  console.log('this.filterData(this.modelsData.detail)', this.filterData(this.modelsData.detail))
                  this.webModelsVisitChartColumn.render()
                }
                this.getCMDBSingleModelData(params)
                console.log('this.modelsData', this.modelsData)
              } else {
                this.$message.error('暂无数据')
                this.modelsData = {
                  mv_rank: [],
                  fail_mv_rank: [],
                  detail: []
                }
                this.model = ''
              }
            } else {
              this.$message.error(data.message)
            }
          })
          .catch((error) => {
            this.$message.error(error.status + '')
          })
      })
    },
    getCMDBSingleModelData (params) {
      const formData = {
        ...params,
        model: this.model
      }
      return new Promise((resolve, reject) => {
        getSingleModelApi(formData)
          .then((response) => {
            const { data } = response
            if (data.code === 0) {
              if (this.modelVisitChart) {
                this.modelVisitChart.changeData(
                  this.processRenderData(data.data)
                )
              } else {
                const tooltipData = {
                  formatter: (datum) => {
                    return {
                      name: statusDict[datum.category],
                      value: datum.value
                    }
                  }
                }
                this.modelVisitChart = this.renderLine(
                  'singleModel',
                  { xField: 'time', yField: 'value', seriesField: 'category' },
                  this.processRenderData(data.data),
                  tooltipData
                )
                this.modelVisitChart.render()
              }
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch((error) => {
            this.$message.error(error.status + '')
          })
      })
    },
    processRenderData (data) {
      const renderData = []
      data.forEach((element) => {
        for (const key in element) {
          const lineData = {
            time: parseTime(new Date(element.time), '{y}-{m}-{d} {h}:{i}')
          }
          if (key === 'time') {
            continue
          } else {
            lineData.value = element[key]
            lineData.category = key
          }
          renderData.push(cloneDeep(lineData))
        }
      })
      return renderData
    },
    // 折线图
    renderLine (id, field, data, tooltip = {}) {
      console.log('Line', data)
      const line = new Line(id, {
        data,
        ...field,
        tooltip,
        point: {
          size: 3,
          shape: 'circle',
          style: {
            fill: 'white',
            stroke: '#5B8FF9',
            lineWidth: 2
          }
        },
        smooth: true,
        legend: false
      })
      return line
    },
    // 饼图
    renderPie (id, data) {
      console.log('Pie', data)
      const piePlot = new Pie(id, {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'name',
        radius: 0.75,
        label: {
          type: 'spider',
          labelHeight: 28,
          content: '{name}'
        },
        legend: { position: 'bottom' },
        color: ({ name }) => {
          if (name === '失败') {
            return 'red'
          }
        }
      })
      return piePlot
    },
    // 柱状图
    renderColumn (id, data) {
      console.log('Column', data)
      const stackedColumnPlot = new Column(id, {
        data,
        isStack: true,
        xField: 'model',
        yField: 'total',
        seriesField: 'time',
        label: {
          // 可手动配置 label 数据标签位置
          position: 'top', // 'top', 'bottom', 'middle'
          // 可配置附加的布局方法
          layout: [
            // 柱形图数据标签位置自动调整
            { type: 'interval-adjust-position' },
            // 数据标签防遮挡
            { type: 'interval-hide-overlap' },
            // 数据标签文颜色自动调整
            { type: 'adjust-color' }
          ]
        },
        legend: { position: 'top' },
        // 缩略轴，适用于面积图，折线图，双轴图
        slider: this.setSlider()

      })
      return stackedColumnPlot
    },
    // 筛选相同的model
    filterData (arr) {
      const result = arr.reduce((acc, cur) => {
        const model = cur.model
        if (!acc[model]) {
          acc[model] = cur
        } else if (cur.time > acc[model].time) {
          cur.total = parseInt(cur.total) + parseInt(acc[model].total)
          acc[model] = cur
        }
        return acc
      }, {})
      return Object.values(result)
    },
    // 统计数据
    dataSum (data) {
      const result = {}
      const arrResult = []
      for (const item of data) {
        const category = item.category
        if (!result[category]) {
          result[category] = []
        }
        result[category].push(item.value)
      }

      for (const key in result) {
        const arr = result[key]

        let sum = 0

        for (let i = 0; i < arr.length; i++) {
          sum += arr[i]
        }
        result[key] = sum
        if (key !== 'total') {
          if (key === 'fail') {
            arrResult.push({ name: '失败', value: result[key] })
          } else {
            arrResult.push({ name: '成功', value: result[key] })
          }
        }
      }
      return arrResult
    },
    checkModelDictionarymodel (model) {
      return this.modelDictionary[model] ? this.modelDictionary[model] : model
    },
    // 判断是否需要柱状图滚动条data
    setSlider (data) {
      const length = data?.length
      const sliderStyle = {
        height: 5,
        handlerStyle: {
          height: 7
        },
        trendCfg: {
          lineStyle: null
        },
        textStyle: {
          fontSize: 0
        },
        start: 0,
        end: 5 / length // 滚动条结束的位置（根据实际业务调整）
      }
      return length > 5 ? sliderStyle : null // 判断多少数据添加滚动条（根据实际业务）
    }
  }
}
</script>

<style scoped></style>
