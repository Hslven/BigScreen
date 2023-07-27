<template>
  <div>
    <content-header></content-header>
    <div>
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
      <div class="w-full my-2 bg-mod-card">
        <t-row :gutter="16">
          <t-col :span="2">
            <div class="pl-4 pt-2 rounded-sm">
              <div style="font-size: 12px; letter-spacing: 2px;">OpenApi可用率</div>
              <div class="my-4">
                <div class="py-4 mod-flex-center">
                  <t-progress theme="circle" :strokeWidth="15" :percentage="allOpenApiData.open_api ? parseInt((allOpenApiData.open_api.avail_rate * 100).toFixed(2)) : 0"></t-progress>
                </div>
                <div class="pt-4">
                  <t-row>
                    <t-col :span="6" class="mod-flex-center">
                      <div>
                        <div style="font-size: 16px; font-weight: 600; text-align: center;">{{ allOpenApiData.open_api ? allOpenApiData.open_api.total : 0 }}</div>
                        <div style="font-size: 12px">OpenApi调用总数</div>
                      </div>
                    </t-col>
                    <t-col :span="6" class="mod-flex-center">
                      <div>
                        <div style="font-size: 16px; font-weight: 600; text-align: center;">{{ allOpenApiData.open_api ? allOpenApiData.open_api.fail : 0 }}</div>
                        <div style="font-size: 12px">OpenApi调用失败总数</div>
                      </div>
                    </t-col>
                  </t-row>
                </div>
              </div>
            </div>
          </t-col>
          <t-col :span="10">
            <div class="w-full px-4 py-2 rounded-sm">
              <div style="font-size: 12px; letter-spacing: 2px;" class="pb-4">OpenApi调用情况统计</div>
              <div id="openApiLine" class="w-full px-4 pb-4" style="height: 220px"></div>
            </div>
          </t-col>
        </t-row>
      </div>
      <t-row :gutter="12">
        <t-col :span="6">
          <div class="w-full bg-mod-card">
            <t-row>
              <t-col :span="3">
                <div class="px-4 pt-2 rounded-sm">
                  <div style="font-size: 12px; letter-spacing: 2px;">路径查询接口可用率</div>
                  <div class="my-4">
                    <div class="py-4 mod-flex-center">
                      <t-progress theme="circle" :strokeWidth="15" :percentage="allOpenApiData.path_api ? parseInt((allOpenApiData.path_api.avail_rate * 100).toFixed(2)) : 0"></t-progress>
                    </div>
                    <div>
                      <t-row>
                        <t-col :span="12">
                          <div class="bg-mod-bg rounded-md py-2 px-4 mb-2">
                            <div style="font-size: 14px; font-weight: 600;">{{ allOpenApiData.path_api ? allOpenApiData.path_api.total : 0 }}</div>
                            <div style="font-size: 12px">路径查询调用总数</div>
                          </div>
                        </t-col>
                        <t-col :span="12">
                          <div class="bg-mod-bg rounded-md py-2 px-4">
                            <div style="font-size: 14px; font-weight: 600;">{{ allOpenApiData.path_api ? allOpenApiData.path_api.fail : 0 }}</div>
                            <div style="font-size: 12px">路径查询调用失败总数</div>
                          </div>
                        </t-col>
                      </t-row>
                    </div>
                  </div>
                </div>
              </t-col>
              <t-col :span="9">
                <div class="w-full py-2 rounded-sm">
                  <div style="font-size: 12px; letter-spacing: 2px;" class="pb-4">路径查询调用情况统计</div>
                  <div id="pathApiLine" class="w-full px-4 pb-4" style="height: 280px"></div>
                </div>
              </t-col>
            </t-row>
          </div>
        </t-col>
        <t-col :span="6">
          <div class="w-full bg-mod-card">
            <t-row>
              <t-col :span="3">
                <div class="px-4 pt-2 rounded-sm">
                  <div style="font-size: 12px; letter-spacing: 2px;">单模型接口可用率</div>
                  <div class="my-4">
                    <div class="py-4 mod-flex-center">
                      <t-progress theme="circle" :strokeWidth="15" :percentage="allOpenApiData.model_api ? parseInt((allOpenApiData.model_api.avail_rate * 100).toFixed(2)) : 0"></t-progress>
                    </div>
                    <div>
                      <t-row>
                        <t-col :span="12">
                          <div class="bg-mod-bg rounded-md py-2 px-4 mb-2">
                            <div style="font-size: 14px; font-weight: 600;">{{ allOpenApiData.model_api ? allOpenApiData.model_api.total : 0 }}</div>
                            <div style="font-size: 12px">单模型调用总数</div>
                          </div>
                        </t-col>
                        <t-col :span="12">
                          <div class="bg-mod-bg rounded-md py-2 px-4">
                            <div style="font-size: 14px; font-weight: 600;">{{ allOpenApiData.model_api ? allOpenApiData.model_api.fail : 0 }}</div>
                            <div style="font-size: 12px">单模型调用失败总数</div>
                          </div>
                        </t-col>
                      </t-row>
                    </div>
                  </div>
                </div>
              </t-col>
              <t-col :span="9">
                <div class="w-full py-2 rounded-sm">
                  <div style="font-size: 12px; letter-spacing: 2px;" class="pb-4">单模型接口调用情况统计</div>
                  <div id="modelApiLine" class="w-full px-4 pb-4" style="height: 280px"></div>
                </div>
              </t-col>
            </t-row>
          </div>
        </t-col>
      </t-row>
      <div>
        <div class="w-full bg-mod-card p-4 mt-2">
          <div style="font-size: 12px; letter-spacing: 2px">用户OpenApi调用情况统计</div>
          <div id="openApiUserColumn" class="w-full px-4 pb-4" style="height: 320px"></div>
        </div>
      </div>
      <t-row :gutter="16" class="my-2">
        <t-col :span="6">
          <div class="bg-mod-card w-full px-4 py-2 rounded-sm">
            <t-row :gutter="16" class="mb-4">
              <t-col :span="9">
                <div style="font-size: 12px; letter-spacing: 2px;">用户路径查询接口调用情况</div>
              </t-col>
              <t-col :span="3">
                <t-select label="用户：" :borderless="true" v-model="pathUser" placeholder="请选择用户" @change="handlePathUserChange">
                  <t-option v-for="item in userOptions" :value="item" :label="userDictionary[item]" :key="item"></t-option>
                </t-select>
              </t-col>
            </t-row>
            <div id="userPathLine" class="w-full px-4 pb-4" style="height: 335px"></div>
          </div>
        </t-col>
        <t-col :span="6">
          <div class="bg-mod-card w-full px-4 py-2 rounded-sm">
            <t-row :gutter="16" class="mb-4">
              <t-col :span="9">
                <div style="font-size: 12px; letter-spacing: 2px;">用户单模型接口调用情况</div>
              </t-col>
              <t-col :span="3">
                <t-select label="用户：" :borderless="true" v-model="modelUser" placeholder="请选择用户" @change="handleModelUserChange">
                  <t-option v-for="item in userOptions" :value="item" :label="userDictionary[item]" :key="item"></t-option>
                </t-select>
              </t-col>
            </t-row>
            <div id="userModelLine" class="w-full px-4 pb-4" style="height: 335px"></div>
          </div>
        </t-col>
      </t-row>
      <t-row :gutter="12">
        <t-col :span="8">
          <div class="bg-mod-card w-full px-4 py-2 rounded-sm">
            <div style="font-size: 12px; letter-spacing: 2px;">用户模型查询情况统计</div>
            <div id="userTreeMap" class="w-full" style="height: 360px"></div>
          </div>
        </t-col>
        <t-col :span="4">
          <div class="bg-mod-card w-full px-4 py-2 rounded-sm">
            <div style="font-size: 12px; letter-spacing: 2px;">模型调用总量排行榜</div>
            <div style="overflow: auto; max-height: 350px">
              <div v-for="(item, index) in model_rank" :key="index" class="pt-4" style="display: grid;grid-template-columns: 0.5fr 4fr 0.5fr;width: 100%; height: 100%;">
                <div>
                  <t-tag size="small" v-if="index < 3" theme="primary">{{ index + 1 }}</t-tag>
                  <t-tag size="small" v-else>{{ index + 1 }}</t-tag>
                </div>
                <t-tooltip :content="item.model" placement="mouse">
                  <div class="font-bold truncate pr-2">{{ item.model }}</div>
                </t-tooltip>
                <div>{{ item.total }}</div>
              </div>
            </div>
          </div>
        </t-col>
      </t-row>
    </div>
  </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'
import { getOpenApi, getOpenApiUserApi, getUserPathApi, getUserModelApi, getUserModelDetailApi, getModelRankApi, getDictionary } from '@/api/cmdb/cmdb_api_analy'
import { Line, Column, Treemap } from '@antv/g2plot'
import { each, groupBy } from '@antv/util'
import { getBeforeDate } from '@/utils'
import { cloneDeep } from 'lodash'

const statusDict = {
  total: '总调用次数',
  success: '调用成功次数',
  fail: '调用失败次数'
}

const apiDict = {
  model: '单模型查询调用总量',
  path: '路径查询调用总量',
  total: 'OpenApi调用总量'
}

export default {
  name: 'openApi',
  components: {
    ContentHeader
  },
  data () {
    return {
      dimension: 'day',
      dateRange: [getBeforeDate(1), getBeforeDate(0)],
      allOpenApiData: {},
      userOptions: [],
      pathUser: '',
      modelUser: '',
      model_rank: [],
      openApiLine: null,
      pathApiLine: null,
      modelApiLine: null,
      userPathLine: null,
      userModelLine: null,
      openApiUserColumn: null,
      userTreeMap: null,
      userDictionary: { Rmc: '资源中心', 'navi-framework': '主动运维', rizhietone: '宜通日志', WatchingGo: '监控机器人', OMAPP: 'chatops', nfvi_kpi_configurable: '性能门户', network_butler: '网络配置', business_butler: '业务管家', Modops: '凌云模组', easyops: '网络云CMDB', inops: '自动化运维', lixuanda: 'lixuanda', can: 'can', yjcsszdh_wl: 'yjcsszdh_wl' },
      modelDictionary: { HARDWARE: '硬件设备', AREA: '网络云大区', RESOURE_POOL_NODE: '资源池节点', HARDWARE_PARTITION: '硬件分区', VIRTUAL_RESOURCE_POOL: '虚拟资源池', REGION: 'REGION域', AZ: 'AZ可用区', HA: 'HA主机组', PEOPLE: '人员', ORGANIZATION: '组织', PROJECT_CMDB: '工程', BOARD_CARD: '板卡', HOST_BUS_ADAPTER_CARD: 'HBA卡', DISK_ARRAY_CONTROLLER: '磁阵控制器', DISK_ARRAY: '磁盘阵列', SECURITY: '保障', PORT: '物理端口', NETWORK_INTERFACE_CARD: '网卡', DISTRIBUTED_STORAGE_CLUSTER: '分布式存储集群', DISTRIBUTED_STORAGE_POOL: '分布式存储池', VOLUME: '卷', INTERFACE: '逻辑端口', BACKEND_STORAGE: '后端存储', NETWORK_EQUIPMENT: '网络设备', SWITCH: '交换机设备', ROUTER: '路由器设备', LB: '负载均衡器', VNF: 'VNF', VIM_TENANTS: 'VIM租户', NETWORK_ELEMENT: '网元', CENTRALIZED_STORAGE_POOL: '集中式存储池', DISK_ZONE: '硬盘域', MODOULE: '网络云模块', PLAN_MGM_SYSTEM: '规划-管理系统', PLAN_HA: '规划-HA主机组', PLAN_STORAGE_POOL: '规划-存储池', HIGHLY_AVAILABLE_NETWORK: '网元组', WAF: 'WAF', IS: 'IS', DDOS: 'DDOS', DISK: '硬盘', VRITUAL_MACHINE: '虚拟机', MANAGEMENT_SYSTEM: '管理系统', CUTOVER: '割接', PLAN_VNF: '规划-网元', SERVER: '服务器', OTHER_SERVER: '其他服务器', COMPUTER_SERVER: '计算服务器', STORAGE_SERVER: '存储服务器', FIREWALL_INFO: '防火墙设备', BEAM_SPLITTER: '分光器', SPLITTER_MODULE: '分光器模块', DUMB_DEVICE_PORT: '哑设备端口', STATIC_LINK: '静态链路', OPTICAL_AMPLIFIRE: '光放大器', SHUNT: '分流器', LOGINCAL_LINK: '逻辑链路', COLLECTOR_METRIC_SET: '指标集', STACKED_DEVICE: '堆叠设备', STACKED_SWITCH: '堆叠交换机', LAB: '机房（网络云）', RACK: '机架（网络云）', COLLECTION: '采集情况', APM_QUERY_VIEW: 'apm链路追踪查询视图', CUSTOM_JOB_PARAMS_CONFIG: '自定义资源任务采集参数配置', STORYBOARD_FUNCTION: 'Storyboard Function', PUBLIC_IP: '公网IP', PUBLIC_CMNET_IP: '公网CMNET_IP', OUTSIDE_FW_NAT: '外层防火墙NAT表', PUBLIC_F5_IP: '公网F5IP', F5_VS: 'F5VS映射表', STORYBOARD_THEME_PAGE: '微应用主题页面模板', MACHINE_ROOM: '机房（空间）', FRAME: '机架（空间）', DISTRICT: '区域（空间）', BUILDING: '楼宇（空间）', DATA_CENTER: '数据中心', LOCATION_POINT: '位置点', SITE: '站点', HARDWARE_RESOURCE_POOL: '硬件资源池', IPS: 'IP地址', PRIVATE_VNIC_IP_T: '虚拟网卡IP', VLAN_T: 'VLAN', SUBNET_T: '子网', VRF_T: 'VRF', PRIVATE_GW_IP_T: '网关IP', PRIVATE_VNFBUSINESS_IP_T: '网元业务IP', NEXTHOP_IP_T: '下一跳', LOOPBACK_IP_T: '网元loopback地址', VTEP_IP_T: 'VTEP_IP', LINK_PORT_IP: '接口IP', OUTSIDE_VRF: 'VPN关联表', BUSINESS_NAME: '业务系统（一朵云）', SDN: 'SDN', DEVICE_POWER: '设备供电电源模块', CLICKHOUSE_SERVICE_NODE: 'ClickHouse实例', USER_TEST: '用户权限测试模型', APP_INSTANCE: '应用实例', DEPLOY_DASHBOARD: '应用发布统计', KUBERNETES_HELM_RELEASE: 'Kubernetes应用', KUBERNETES_POD: 'K8S 容器组', ALERT_CONDITION_STRATEGY: '告警条件策略', ALERT_GROUP_STRATEGY: '告警分组策略', ALERT_METRIC_FILL_STRATEGY: '告警丰富策略', ALERT_NOTIFY_BLOCK_STRATEGY: '通知屏蔽策略', ALERT_NOTIFY_INHIBIT_STRATEGY: '通知抑制策略', ALERT_NOTIFY_STRATEGY: '告警通知策略', ALERT_RULE: '告警规则', CMDB_INSTANCES_STRATEGY: '监控目标策略', DOMAIN_VIEW: '领域视图', NAMESPACE: '命名空间', RELATION_ATTRIBUTE: '关系属性', RELATION_INDEX: '关系属性索引', ALERT_NOTIFY_BLOCK_RULE: '通知屏蔽规则', ALERT_GROUP_RULE: '告警分组规则', ALERT_GROUP_RULE_GROUP_STRATEGY: '告警分组规则分组策略' }
    }
  },
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
      // 请求字典
      // this.getDictionaryData('model_chname_dict')
      // this.getDictionaryData('user_chname_dict')

      this.getCMDBOpenApiData(paramForm)
      this.getCMDBOpenApiUserData(paramForm)
      this.getCMDBUserPathApiData(paramForm)
      this.getUserModelDetailData(paramForm)
      this.getModelRankData(paramForm)
    },
    handlePathUserChange (value, context) {
      const paramForm = {
        dimension: this.dimension,
        begin_time: this.dateRange[0],
        end_time: this.dateRange[1]
      }
      this.getCMDBUserPathApiData(paramForm)
    },
    handleModelUserChange (value, context) {
      const paramForm = {
        dimension: this.dimension,
        begin_time: this.dateRange[0],
        end_time: this.dateRange[1]
      }
      this.getCMDBUserModelApiData(paramForm)
    },
    // 获取翻译字典
    getDictionaryData (params) {
      return new Promise((resolve, reject) => {
        getDictionary(params).then(response => {
          const { data } = response
          if (data.code === 0) {
            if (params === 'model_chname_dict') {
              this.modelDictionary = data.data.model_chname_dict
              // console.log(' this.modelDictionary', this.modelDictionary)
            }
            if (params === 'user_chname_dict') {
              this.userDictionary = data.data.user_chname_dict
              // console.log(' this.user_chname_dict', this.userDictionary)
            }
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    getCMDBOpenApiData (params) {
      return new Promise((resolve, reject) => {
        getOpenApi(params).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.allOpenApiData = data.data
            const legend = {
              position: 'top-right',
              itemName: false,
              itemValue: {
                formatter: (text) => {
                  return apiDict[text]
                },
                style: {
                  opacity: 0.65
                }
              }
            }
            if (this.openApiLine) {
              this.openApiLine.changeData(this.processRenderData(this.allOpenApiData.open_api.detail, 'time'))
            } else {
              const tooltipData = {
                formatter: (datum) => {
                  return { name: apiDict[datum.category], value: datum.value }
                }
              }
              this.openApiLine = this.renderLine(this.processRenderData(this.allOpenApiData.open_api.detail, 'time'), 'openApiLine', legend, tooltipData)
              this.openApiLine.render()
            }
            if (this.pathApiLine) {
              this.pathApiLine.changeData(this.processRenderData(this.allOpenApiData.path_api.detail, 'time'))
            } else {
              const tooltipData = {
                formatter: (datum) => {
                  return { name: statusDict[datum.category], value: datum.value }
                }
              }
              this.pathApiLine = this.renderLine(this.processRenderData(this.allOpenApiData.path_api.detail, 'time'), 'pathApiLine', false, tooltipData)
              this.pathApiLine.render()
            }
            if (this.modelApiLine) {
              this.modelApiLine.changeData(this.processRenderData(this.allOpenApiData.model_api.detail, 'time'))
            } else {
              const tooltipData = {
                formatter: (datum) => {
                  return { name: statusDict[datum.category], value: datum.value }
                }
              }
              this.modelApiLine = this.renderLine(this.processRenderData(this.allOpenApiData.model_api.detail, 'time'), 'modelApiLine', false, tooltipData)
              this.modelApiLine.render()
            }
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    getCMDBOpenApiUserData (params) {
      return new Promise((resolve, reject) => {
        getOpenApiUserApi(params).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.userOptions = Array.from(new Set(data.data.map((item) => {
              return item.user
            })))
            this.pathUser = this.pathUser ? this.pathUser : this.userOptions[0]
            this.modelUser = this.modelUser ? this.modelUser : this.userOptions[0]
            const legend = {
              position: 'top-right',
              itemName: false,
              itemValue: {
                formatter: (text) => {
                  const apiDict = {
                    model_api: '单模型查询总数',
                    path_api: '路径查询总数'
                  }
                  return apiDict[text]
                },
                style: {
                  opacity: 0.65
                }
              }
            }
            console.log('openApiUserColumn', data.data)
            // 查找对应字典
            data.data = data.data.map(item => {
              item.user = this.userDictionary[item.user]
              // console.log(1111, this.userDictionary[item.user])
              return item
            })
            if (this.openApiUserColumn) {
              this.openApiUserColumn.changeData(this.processRenderData(data.data, 'user'))
            } else {
              this.openApiUserColumn = this.renderColumn(this.processRenderData(data.data, 'user'), 'openApiUserColumn', legend)
              this.openApiUserColumn.render()
            }
            this.getCMDBUserPathApiData(params)
            this.getCMDBUserModelApiData(params)
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    getCMDBUserPathApiData (params) {
      const formData = {
        ...params,
        user: this.pathUser
      }
      if (!this.pathUser) {
        return null
      }
      return new Promise((resolve, reject) => {
        getUserPathApi(formData).then(response => {
          const { data } = response
          if (data.code === 0) {
            if (this.userPathLine) {
              this.userPathLine.changeData(this.processRenderData(data.data, 'time'))
            } else {
              const tooltipData = {
                formatter: (datum) => {
                  return { name: statusDict[datum.category], value: datum.value }
                }
              }
              this.userPathLine = this.renderLine(this.processRenderData(data.data, 'time'), 'userPathLine', false, tooltipData)
              this.userPathLine.render()
            }
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    getCMDBUserModelApiData (params) {
      const formData = {
        ...params,
        user: this.modelUser
      }
      return new Promise((resolve, reject) => {
        getUserModelApi(formData).then(response => {
          const { data } = response
          if (data.code === 0) {
            if (this.userModelLine) {
              this.userModelLine.changeData(this.processRenderData(data.data, 'time'))
            } else {
              const tooltipData = {
                formatter: (datum) => {
                  return { name: statusDict[datum.category], value: datum.value }
                }
              }
              this.userModelLine = this.renderLine(this.processRenderData(data.data, 'time'), 'userModelLine', false, tooltipData)
              this.userModelLine.render()
            }
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    getUserModelDetailData (params) {
      return new Promise((resolve, reject) => {
        getUserModelDetailApi(params).then(response => {
          const { data } = response
          if (data.code === 0) {
            data.data = data.data.map(item => {
              item.name = this.userDictionary[item.name]
              item.children = item.children.map(it => {
                // console.log(1, it.name)
                it.name = this.modelDictionary[it.name]
                // console.log(2, it.name)
                return it
              })
              return item
            })
            if (this.userTreeMap) {
              this.userTreeMap.changeData({
                name: 'root',
                children: data.data
              })
            } else {
              this.userTreeMap = this.renderTreeMap(data.data)
              this.userTreeMap.render()
            }
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    getModelRankData (params) {
      return new Promise((resolve, reject) => {
        getModelRankApi(params).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.model_rank = data.data.map(item => {
              if (this.modelDictionary[item.model]) {
                item.model = this.modelDictionary[item.model]
              }
              return item
            })
            console.log('model_rank', this.model_rank)
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    processRenderData (data, id) {
      const renderData = []
      data.forEach(element => {
        for (const key in element) {
          if (['time', 'user'].includes(key)) {
            continue
          }
          const lineData = {
            [id]: element[id],
            value: element[key],
            category: key
          }
          renderData.push(cloneDeep(lineData))
        }
      })
      return renderData
    },
    //         数据源 容器id 图例          悬浮提示
    renderLine (data, id, legend = false, tooltip = {}) {
      const line = new Line(id, {
        data,
        xField: 'time',
        yField: 'value',
        legend,
        seriesField: 'category',
        tooltip,
        // yAxis: {
        //   grid: { line: { style: { lineDash: [4, 2], stroke: '#ddd' } } }
        // },
        // xAxis: {
        //   type: 'time'
        // },
        point: {
          size: 3,
          shape: 'circle',
          style: {
            fill: 'white',
            stroke: '#5B8FF9',
            lineWidth: 2
          }
        },
        smooth: true
      })
      return line
    },
    renderColumn (data, id, legend = false) {
      const annotations = []
      each(groupBy(data, 'user'), (values, k) => {
        const value = values.reduce((a, b) => a + b.value, 0)
        annotations.push({
          type: 'text',
          position: [k, value],
          content: `${value}`,
          style: { textAlign: 'center', fontSize: 14, fill: 'rgba(0,0,0,0.85)' },
          offsetY: -10
        })
      })
      const plot = new Column(id, {
        data,
        isStack: true,
        xField: 'user',
        yField: 'value',
        seriesField: 'category',
        label: {
          position: 'middle',
          layout: [
            { type: 'interval-adjust-position' },
            { type: 'interval-hide-overlap' },
            { type: 'adjust-color' }
          ]
        },
        annotations,
        legend,
        minColumnWidth: 20,
        maxColumnWidth: 30
      })
      return plot
    },
    renderTreeMap (data) {
      const rootData = {
        name: 'root',
        children: data
      }
      const treeMapPlot = new Treemap('userTreeMap', {
        data: rootData,
        colorField: 'name',
        legend: {
          position: 'top-right'
        },
        interactions: [{ type: 'treemap-drill-down' }],
        animation: {}
      })
      return treeMapPlot
    }
    // checkModelDictionarymodel (model) {
    //   return this.modelDictionary[model] ? this.modelDictionary[model] : model
    // }
  }
}
</script>

  <style scoped>
</style>
