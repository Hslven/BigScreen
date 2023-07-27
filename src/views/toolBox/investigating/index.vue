<template>
  <div>
    <div>
      <content-header></content-header>
      <div class="bg-mod-card rounded-sm">
        <div class="t-tdesign-demo__tag-input pt-4 px-4">
          <label>硬件资源池</label>
          <t-select v-model="itemLabel" :options="poolList" style="width: 30%" />
        </div>
        <t-row>
          <t-col :span="3" v-for="(obj, index) in pieChartData" :key="index" class="mb-4">
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
                <div class="pt-4 pr-4 pl-8">
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
      <t-row :gutter="16" class="my-3">
        <t-col :span="4">
          <div style="border-radius: 2px;" class="bg-img">
            <t-row>
              <t-col :span="4">
                <t-image
                  :src="haResourceImage"
                  fit="contain"
                  style="bottom: 46px; height: 160px; width: 100%; margin-left: 30px"
                />
              </t-col>
              <t-col :span="4">
                <div style="height: 90px; font-size: 20px; font-weight: bold; letter-spacing: 2px" class="mod-flex-center">
                  HA资源评估
                </div>
              </t-col>
              <t-col :span="4">
                <div style="height: 90px;" class="mod-flex-center">
                  <div class="text-mod-primary mod-flex-center" style="padding: 4px 16px; cursor: pointer; border-radius: 215px; border: 1px solid rgba(33, 100, 255, 1); font-size: 12px" @click="gotoHa">
                    去评估
                    <chevron-right-icon style="margin-left: 6px" size="14px" />
                  </div>
                </div>
              </t-col>
            </t-row>
          </div>
        </t-col>
        <t-col :span="4">
          <div style="border-radius: 2px;" class="bg-img">
            <t-row>
              <t-col :span="4">
                <t-image
                  :src="storageResourceImage"
                  fit="contain"
                  style="bottom: 40px; margin-left: 30px;; height: 160px; width: 100%"
                />
              </t-col>
              <t-col :span="4">
                <div style="height: 90px; font-size: 20px; font-weight: bold; letter-spacing: 2px" class="mod-flex-center">
                  存储资源评估
                </div>
              </t-col>
              <t-col :span="4">
                <div style="height: 90px;" class="mod-flex-center">
                  <div class="text-mod-primary mod-flex-center" style="padding: 4px 16px; cursor: pointer; border-radius: 215px; border: 1px solid rgba(33, 100, 255, 1); font-size: 12px" @click="gotoStorage">
                    去评估
                    <chevron-right-icon style="margin-left: 6px" size="14px" />
                  </div>
                </div>
              </t-col>
            </t-row>
          </div>
        </t-col>
        <t-col :span="4">
          <div style="border-radius: 2px;" class="bg-img">
            <t-row>
              <t-col :span="4">
                <t-image
                  :src="portResourceImage"
                  fit="contain"
                  style="margin-left: 30px; height: 140px; width: 100%"
                />
              </t-col>
              <t-col :span="4">
                <div style="height: 90px; font-size: 20px; font-weight: bold; letter-spacing: 2px" class="mod-flex-center">
                  端口流量预测
                </div>
              </t-col>
              <t-col :span="4">
                <div style="height: 90px;" class="mod-flex-center">
                  <div class="text-mod-primary mod-flex-center" style="padding: 4px 16px; cursor: pointer; border-radius: 215px; border: 1px solid rgba(33, 100, 255, 1); font-size: 12px" @click="gotoRouterPortNetwork">
                    去评估
                    <chevron-right-icon style="margin-left: 6px" size="14px" />
                  </div>
                </div>
              </t-col>
            </t-row>
          </div>
        </t-col>
      </t-row>
      <div>
        <div class="bg-mod-card rounded-sm p-4 mb-4">
          <div style="font-size: 12px; font-weight: bold">网元扩容预审</div>
          <t-form
            layout="inline"
            :data="reportFormData"
            ref="form"
            @submit="reportEvent"
            class="p-4"
            scrollToFirstError="smooth"
          >
            <t-form-item style="width: 30%" label="网元名称" name="network_element" class="pb-3">
              <t-select :scroll="{ type: 'virtual' }" filterable v-model="reportFormData.network_element" @change="SelectVnfName">
                <t-option v-for="(item) in network_element_list" :key="item" :label="item" :value="item" />
              </t-select>
            </t-form-item>
            <t-form-item style="width: 30%" label="硬件资源池位置" name="hardware_resource_pool">
              <t-input-group separate>
                <t-input v-model="reportFormData.area" />
                <span :style="{ lineHeight: '32px' }">&nbsp;-&nbsp;</span>
                <t-input v-model="reportFormData.hardware_resource_pool" />
              </t-input-group>
            </t-form-item>
            <t-form-item style="width: 33%" label="虚拟资源池名称" name="virtual_resource_pool">
              <t-input v-model="reportFormData.virtual_resource_pool" placeholder="请输入虚拟资源池名称"></t-input>
            </t-form-item>
            <t-form-item style="width: 30%" label="申请时间描述" name="application_descr" class="pb-3">
              <t-input v-model="reportFormData.application_descr" placeholder="默认：预定三个月内"></t-input>
            </t-form-item>
            <t-form-item style="width: 30%" label="内存(MB)" name="memory">
              <t-input-number v-model="reportFormData.memory" theme="column" placeholder="请输入内存(MB)"></t-input-number>
            </t-form-item>
            <t-form-item style="width: 30%" label="硬盘(GB)" name="hard_disk">
              <t-input-number v-model="reportFormData.hard_disk" theme="column" placeholder="请输入硬盘(GB)"></t-input-number>
            </t-form-item>
            <t-form-item style="width: 30%" label="CPU物理核(个数)" name="cpu">
              <t-input-number v-model="reportFormData.cpu" theme="column" placeholder="请输入CPU物理核(个数)"></t-input-number>
            </t-form-item>
            <t-form-item style="width: 30%" label="网络带宽(mbps)" name="network">
              <t-input-number v-model="reportFormData.network" theme="column" placeholder="请输入网络带宽(mbps)"></t-input-number>
            </t-form-item>
            <t-form-item style="width: 100%; float: right;"  class="pt-3">
              <t-space size="10px">
                <t-button theme="primary" type="submit" class="mr-3">开始评估</t-button>
                <t-button theme="default" @click="reportHistory = true">评估记录表</t-button>
              </t-space>
            </t-form-item>
          </t-form>
          <t-dialog width="60%" :visible.sync="reportHistory" header="评估记录表" :cancelBtn="null" :confirm-btn="null">
            <div class="bg-mod-card rounded-sm p-4 mb-4">
              <t-row>
                <t-col :span="11">
                  <div class="ml-4">
                    <t-input v-model="globalFilter" placeholder="全局搜索">
                    </t-input>
                  </div>
                </t-col>
                <t-col :span="1">
                  <div style="float: right">
                    <t-button variant="outline" class="mr-2" @click="columnControllerVisible = true">
                      列配置
                    </t-button>
                  </div>
                </t-col>
              </t-row>
              <t-table
                rowKey="index"
                :columns="columns"
                :data.sync="data"
                size="small"
                maxHeight='368'
                :columnControllerVisible.sync="columnControllerVisible"
                :displayColumns.sync="visibleColumns"
                :columnController="{
                  dialogProps: { preventScrollThrough: true },
                  hideTriggerButton: true
                }"
                :pagination="pagination"
                @data-change="dataChange"
                style="font-size: 12px;"
                cellEmptyContent = "-"
                class="p-3"
                @page-change="onPageChange"
              >
              <template #operation="{ row }">
                <t-link class="pr-2" theme="primary" hover="color" @click="clickEvent(row)">
                  报告
                </t-link>
              </template>
              </t-table>
            </div>
          </t-dialog >
        </div>
      </div>
      <div>
        <div class="w-full bg-mod-card rounded-sm" style="margin-bottom: 12px;">
          <t-row>
            <t-col :span="6">
              <div style="font-size: 12px; font-weight: bold" class="m-3">扩容模拟</div>
              <t-form
                :data="capatity_network_elet_info"
                @submit="AddCapatityEvent"
                class="py-2 px-4"
              >
                <t-form-item label="网元名称" name="network_element">
                  <t-select :scroll="{ type: 'virtual' }" filterable v-model="capatity_network_elet_info.network_element" @change="SelectVnfNameTwo">
                    <t-option v-for="(item) in network_element_list" :key="item" :label="item" :value="item" />
                  </t-select>
                </t-form-item>
                <t-form-item label="预扩HA" name="capatity_ha">
                  <t-select filterable v-model="capatity_network_elet_info.capatity_ha">
                    <t-option v-for="(item) in network_element_info.ha_info" :key="item" :label="item" :value="item" />
                  </t-select>
                </t-form-item>
                <t-form-item label="预扩CPU(个)" name="capatity_cpu">
                  <t-input-number v-model="capatity_network_elet_info.capatity_cpu" theme="column" placeholder="请输入预扩CPU(个)"></t-input-number>
                </t-form-item>
                <t-form-item label="预扩内存(GB)" name="capatity_memory">
                  <t-input-number v-model="capatity_network_elet_info.capatity_memory" theme="column" placeholder="请输入预扩内存(GB)"></t-input-number>
                </t-form-item>
                <t-form-item label="预扩存储(TB)" name="capatity_storage">
                  <t-input-number v-model="capatity_network_elet_info.capatity_storage" theme="column" placeholder="请输入预扩存储(TB)"></t-input-number>
                </t-form-item>
                <t-form-item>
                  <t-space size="10px">
                    <t-button theme="primary" type="submit" class="mr-3">扩容模拟</t-button>
                    <t-button theme="default" @click="capatityHistory = true">扩容记录</t-button>
                  </t-space>
                </t-form-item>
              </t-form>
            </t-col>
            <t-col :span="6">
              <div>
                <div style="font-size: 12px; font-weight: bold" class="m-3">扩容网元HA资源占比</div>
                <div id="container"></div>
              </div>
            </t-col>
          </t-row>
        </div>
      </div>
    </div>
    <t-dialog width="40%" :visible.sync="productReport" header="资源评估报告" :cancelBtn="null" :confirm-btn="null">
      <div class="text-mod-title">
        <p class="font-bold" align="center">基础信息</p>
          <table border="1" style="border-collapse: collapse; width: 100%" class="">
            <tr>
              <td>业务名称</td>
              <td>{{reportResultData.aduitReportData.base_info.business_name}}</td>
            </tr>
            <tr>
              <td>网元名称</td>
              <td>{{reportResultData.aduitReportData.base_info.vnf_name}}</td>
            </tr>
            <tr>
              <td>所属硬件资源池</td>
              <td>{{reportResultData.aduitReportData.base_info.pool}}</td>
            </tr>
            <tr>
              <td>厂家</td>
              <td class="text-caption">{{reportResultData.aduitReportData.base_info.manufactor}}</td>
            </tr>
          </table>
          <p class="font-bold" align="center">规划态 | 现网态 | 扩容需求</p>
          <table border="1" style="border-collapse: collapse; width: 100%" class="">
            <tr>
              <td></td>
              <td>规划态</td>
              <td>现网态</td>
              <td>扩容需求</td>
            </tr>
            <tr>
              <td>网元名称</td>
              <td>{{reportResultData.aduitReportData.contrast_data.plan.vnf_name}}</td>
              <td>{{reportResultData.aduitReportData.contrast_data.current.vnf_name}}</td>
              <td>{{reportResultData.aduitReportData.contrast_data.demand.vnf_name}}</td>
            </tr>
            <tr>
              <td>厂家</td>
              <td>{{reportResultData.aduitReportData.contrast_data.plan.manufactor}}</td>
              <td>{{reportResultData.aduitReportData.contrast_data.current.manufactor}}</td>
              <td>{{reportResultData.aduitReportData.contrast_data.demand.manufactor}}</td>
            </tr>
            <tr>
              <td>CPU（物理核）</td>
              <td>{{reportResultData.aduitReportData.contrast_data.plan.cpu}}</td>
              <td>{{reportResultData.aduitReportData.contrast_data.current.cpu / 2}}</td>
              <td>{{reportResultData.aduitReportData.contrast_data.demand.cpu}}</td>
            </tr>
            <tr>
              <td>分布式存储（GB）</td>
              <td>{{reportResultData.aduitReportData.contrast_data.plan.storage}}</td>
              <td>{{reportResultData.aduitReportData.contrast_data.current.storage}}</td>
              <td>{{reportResultData.aduitReportData.contrast_data.demand.storage}}</td>
            </tr>
            <tr>
              <td>内存（GB）</td>
              <td>{{reportResultData.aduitReportData.contrast_data.plan.memory}}</td>
              <td>{{reportResultData.aduitReportData.contrast_data.current.memory}}</td>
              <td>{{reportResultData.aduitReportData.contrast_data.demand.memory}}</td>
            </tr>
            <tr>
              <td>网络带宽（mbps）</td>
              <td>{{reportResultData.aduitReportData.contrast_data.plan.network}}</td>
              <td>{{reportResultData.aduitReportData.contrast_data.current.network}}</td>
              <td>{{reportResultData.aduitReportData.contrast_data.demand.network}}</td>
            </tr>
          </table>
          <p class="font-bold" align="center">现网态</p>
          <table border="1" style="border-collapse: collapse; width: 100%">
            <tr>
              <td :rowspan="aduitReportFormat(reportResultData.aduitReportData.currnet_network.app)">包含APP</td>
            </tr>
            <tr v-for="(value, key) in reportResultData.aduitReportData.currnet_network.app" :key="key">
              <td>{{ value }}</td>
            </tr>
            <tr>
              <td :rowspan="aduitReportFormat(reportResultData.aduitReportData.currnet_network.ha)">使用HA</td>
            </tr>
            <tr v-for="(val, index) in reportResultData.aduitReportData.currnet_network.ha" :key="index + '1'">
              <td>{{ val }}</td>
            </tr>
            <tr>
              <td>本网元规划存储</td>
              <td>{{reportResultData.aduitReportData.currnet_network.plan_vnf_storage}}</td>
            </tr>
            <tr>
              <td>是否使用共享存储</td>
              <td>{{reportResultData.aduitReportData.currnet_network.is_share_storage}}</td>
            </tr>
            <tr>
              <td>存储使用是否超规划</td>
              <td>{{reportResultData.aduitReportData.currnet_network.is_beyond_plan_storage}}</td>
            </tr>
          </table>
          <p class="font-bold" align="center">现网HA资源占用情况</p>
          <table border="1" style="border-collapse: collapse; width: 100%">
            <tr>
              <td></td><td>HA名称</td><td>可用值</td><td>已用值</td><td>已用占比</td><td>本网元占用</td>
            </tr>
            <tr><td :rowspan="aduitReportFormat(reportResultData.aduitReportData.plan_ha_occupy.vcpu)">可用/已用vcpu(虚拟核数量)</td></tr>
            <tr v-for="(value, key) in reportResultData.aduitReportData.plan_ha_occupy.vcpu" :key="key + '1'">
              <td>{{value.ha_name}}</td>
              <td>{{value.usable_cpu}}</td>
              <td>{{value.used_cpu}}</td>
              <td>{{value.cpu_used_rate}}</td>
              <td>{{value.nfv_used}}</td>
            </tr>
            <tr><td :rowspan="aduitReportFormat(reportResultData.aduitReportData.plan_ha_occupy.vmem)">可用/已用vmem(GB)</td></tr>
            <tr v-for="(value, key) in reportResultData.aduitReportData.plan_ha_occupy.vmem" :key="key + '2'">
              <td>{{value.ha_name}}</td>
              <td>{{value.usable_memory}}</td>
              <td>{{value.used_memory}}</td>
              <td>{{value.memory_used_rate}}</td>
              <td>{{value.nfv_used}}</td>
            </tr>
            <tr><td :rowspan="aduitReportFormat(reportResultData.aduitReportData.plan_ha_occupy.storage)">可用/已用有效存储(TB)</td></tr>
            <tr v-for="(value, key) in reportResultData.aduitReportData.plan_ha_occupy.storage" :key="key + '3'">
              <td>{{value.ha_name}}</td>
              <td>{{value.usable_storage}}</td>
              <td>{{value.used_storage}}</td>
              <td>{{value.storage_used_rate}}</td>
              <td>{{value.nfv_used}}</td>
            </tr>
          </table>
      </div>
      <div>评估结论</div>
      <div>
        <t-alert :theme="isSatisfy(reportResultData.aduitReportResult) ? 'success' : 'error'" :message="reportResultData.aduitReportResult" />
      </div>
    </t-dialog>
    <t-dialog width="60%" :visible.sync="capatityHistory" header="扩容记录" :cancelBtn="null" :confirm-btn="null">
      <div>
        <t-row style="font-size: 12px; font-weight: bold">
          <t-col :flex="1">预扩CPU</t-col>
          <t-col :flex="1">预扩内存</t-col>
          <t-col :flex="1">预扩存储</t-col>
          <t-col :flex="1">预扩HA</t-col>
          <t-col :flex="1">操作</t-col>
        </t-row>
        <t-row v-for="(value, index) in capatity_network_elet_history_list" :key="index"  style="font-size: 12px">
          <t-col :flex="1">{{value.capatity_cpu}}</t-col>
          <t-col :flex="1">{{value.capatity_memory}}</t-col>
          <t-col :flex="1">{{value.capatity_storage}}</t-col>
          <t-col :flex="1">{{value.capatity_ha}}</t-col>
          <t-col :flex="1">
            <t-button @click="DeleteCapatityEvent(index)">
              删除
            </t-button>
          </t-col>
        </t-row>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import globalSearch from '@/mixins/globalSearch'
import haResourceImage from '@/assets/images/resource/haResourcex2.png'
import portResourceImage from '@/assets/images/resource/portResource.png'
import storageResourceImage from '@/assets/images/resource/storageResource.png'
import resourceBgImage from '@/assets/images/resource/resourceBg.png'
import ContentHeader from '@/components/contentHeader/header'
import { Chart } from '@antv/g2'
import { ChevronRightIcon } from 'tdesign-icons-vue'
import { getPoolsListAPI, getPoolNetworkAPI } from '@/api/cmdb/HardwareResourcePool'
import { getAllVnfNameAPI, getVnfResourceAPI, getVnfHaResourceAPI, SubmitAuditFormAPI, UpdateAuditResultAPI, getAuditHistoryDataAPI, deleteAuditHistoryDataAPI } from '@/api/cmdb/VnfAudit'
import { formatterDate } from '@/utils/index'
import { networkHistoryReportForm, networkReportForm } from '@/dict/form'
import { reportResultOptions } from '@/dict/options'
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
  name: 'Investigating',
  components: {
    ContentHeader,
    ChevronRightIcon
  },
  props: {},
  mixins: [globalSearch],
  data () {
    return {
      columnControllerVisible: false,
      pagination: {
        current: 1,
        pageSize: 50,
        total: 0,
        showJumper: true
      },
      visibleColumns: ['operation', 'network_element', 'assessment_result', 'cpu', 'memory', 'hard_disk', 'network', 'create_date'],
      columns: [
        {
          colKey: 'network_element',
          title: '网元',
          align: 'left'
        },
        {
          colKey: 'assessment_result',
          title: '预审结果',
          align: 'left',
          ellipsisTitle: true
        },
        {
          colKey: 'hardware_resource_pool',
          title: '硬件资源池名称',
          align: 'left',
          ellipsisTitle: true
        },
        {
          colKey: 'cpu',
          title: '申请资源-CPU',
          align: 'left',
          ellipsisTitle: true
        },
        {
          colKey: 'memory',
          title: '申请资源-内存',
          align: 'left',
          ellipsisTitle: true
        },
        {
          colKey: 'hard_disk',
          title: '申请资源-硬盘',
          align: 'left',
          ellipsisTitle: true
        },
        {
          colKey: 'network',
          title: '申请资源-带宽',
          align: 'left',
          ellipsisTitle: true
        },
        {
          colKey: 'create_date',
          title: '创建时间',
          align: 'left',
          ellipsis: {
            theme: 'light',
            placement: 'bottom'
          },
          width: '50'
        },
        {
          colKey: 'appraisal_report',
          title: '预审报告',
          align: 'left',
          ellipsis: {
            theme: 'light',
            placement: 'bottom'
          },
          width: '120'
        },
        {
          colKey: 'appraisal_conclusion',
          title: '预审结论',
          align: 'left',
          ellipsis: {
            theme: 'light',
            placement: 'bottom'
          },
          width: '120'
        },
        {
          colKey: 'operation_user',
          title: '操作用户',
          align: 'left'
        },
        {
          colKey: 'operation',
          title: '操作',
          align: 'left'
        }
      ],
      haResourceImage,
      portResourceImage,
      storageResourceImage,
      resourceBgImage,
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
        },
        network: {
          name: '网络',
          total: 0,
          used: 0,
          surplus: 0,
          percent: 0,
          sign: 'mbps'
        }
      },
      itemLabel: 'NFV-RP-HNGZ-03A',
      poolList: null,
      capatityHistory: false,
      reportHistory: false,
      network_element_list: [],
      // 网元信息
      network_element_info: {
        network_element: '',
        virtual_resource_pool: '',
        hardware_resource_pool: '',
        used_cpu: '',
        used_memory: '',
        used_hard_disk: '',
        ha_info: []
      },
      // 扩容小助手--->预扩容数据
      capatity_network_elet_info: {
        network_element: '',
        capatity_cpu: 0,
        capatity_memory: 0,
        capatity_storage: 0,
        capatity_ha: ''
      },
      // 扩容小助手--->历史预扩容数据
      capatity_network_elet_history_list: [],
      // 扩容小助手--->图表对象、图表数据
      capacityChart: null,
      capacityChartData: [],
      // 预审结果数据
      reportResultData: {
        reportId: '',
        report_result_state: 0,
        report_result_options: reportResultOptions,
        aduitReportData: {
          base_info: {
            business_name: '',
            vnf_name: '',
            pool: '',
            manufactor: ''
          },
          plan_ha_occupy: {
            vcpu: [],
            vmem: [],
            storage: []
          },
          currnet_network: {
            app: [],
            ha: [],
            plan_vnf_storage: '',
            is_share_storage: '',
            is_beyond_plan_storage: ''
          },
          contrast_data: {
            plan: {
              vnf_name: '',
              manufactor: '',
              cpu: '',
              storage: '',
              memory: ''
            },
            current: {
              vnf_name: '',
              manufactor: '',
              cpu: '',
              storage: '',
              memory: ''
            },
            demand: {
              vnf_name: '',
              manufactor: '',
              cpu: '',
              storage: '',
              memory: ''
            }
          }
        },
        aduitReportResult: ''
      },
      appraisal_conclusion: '',
      // 历史预审记录表单
      formData: JSON.parse(JSON.stringify(networkHistoryReportForm.fields)),
      productReport: false,
      // 预审表单
      reportFormData: JSON.parse(JSON.stringify(networkReportForm.fields)),
      ResVnfNamesData: null, // 用于匹配网元下的大区/资源池

      data: []
    }
  },
  created () {
    this.findList()
  },
  mounted () {
    this.GetPoolDataApi()
    this.GetAllVnfNameData()
    this.capacityChartEvent()
  },
  computed: {
    calculationAccount () {
      return function (molecular, denominator) {
        if (!denominator) {
          return 'None'
        }
        const result = (molecular / denominator * 100).toFixed(2)
        if (result === 'Infinity') {
          return 'None'
        }
        return (molecular / denominator * 100).toFixed(2) + '%'
      }
    },
    FormatHaName () {
      return function (value) {
        const names = value.split('|')
        if (names.length > 1) {
          return names[1]
        } else {
          return names[0]
        }
      }
    },
    isSatisfy () {
      return function (value) {
        if (value.indexOf('不能满足') !== -1) {
          return false
        } else {
          return true
        }
      }
    },
    aduitReportFormat () {
      return function (value) {
        if (value.length === 0) {
          return value.length + 2
        } else {
          return value.length + 1
        }
      }
    }
  },
  watch: {
    capacityChartData: {
      handler (newval, oldvalue) {
        this.capacityChart.changeData(newval)
        this.capacityChart.render()
      },
      deep: true
    },
    itemLabel: {
      handler (newval, oldvalue) {
        // 发起cmdb接口请求
        this.GetPoolDataApi()
      },
      deep: true
    }
  },
  methods: {
    dataChange (data) {
      this.data = data
    },
    gotoHa () {
      window.sessionStorage.setItem('fromPath', this.$route.path)
      this.$router.push({
        path: '/modops/modShop/6344e73a20fd12004ff6fc7a'
      })
    },
    gotoRouterPortNetwork () {
      window.sessionStorage.setItem('fromPath', this.$route.path)
      this.$router.push({
        path: '/modops/modShop/632ac03824fdfe003b40aeac'
      })
    },
    gotoStorage () {
      window.sessionStorage.setItem('fromPath', this.$route.path)
      this.$router.push({
        path: '/modops/modShop/6344e8641adee1003b8e953a'
      })
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
    // 操作事件：页面渲染时请求该页面的接口
    GetPoolDataApi () {
      this.GetPoolsListData()
      this.GetPoolNetworkData()
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
            this.pieChartData.network.total = data.data.networkSum
            this.pieChartData.network.surplus = data.data.networkSurplus
            this.pieChartData.network.used = this.pieChartData.network.total - this.pieChartData.network.surplus
            this.pieChartData.network.percent = Math.round(this.pieChartData.network.used / this.pieChartData.network.total * 100)
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },
    // 操作事件：格式化资源预审表格内的日期字段
    formatterData ({ cellValue }) {
      const dateFinal = formatterDate(cellValue)
      return dateFinal
    },

    // 操作事件：重置资源预审表格数据
    resetTableEvent () {
      this.formData.network_elet_name = ''
      this.formData.beigin_date = ''
      this.formData.end_date = ''
      const formParams = {
        page: 1,
        page_size: 20,
        network_elet_name: this.formData.network_elet_name,
        beigin_date: this.formData.beigin_date,
        end_date: this.formData.end_date
      }
      const sign = 'data'
      this.GetVnfAuditHistoryData(formParams, sign)
    },

    clickEvent (row) {
      this.appraisal_conclusion = row.appraisal_conclusion
      this.reportResultData.reportId = row.id
      this.reportResultData.report_result_state = row.assessment_result
      this.reportResultData.aduitReportData = JSON.parse(row.appraisal_report)
      this.reportResultData.aduitReportResult = row.appraisal_conclusion
      this.productReport = true
    },
    // 操作事件：输入或选择资源预审网元
    SelectVnfName (value) {
      // 操作流程：如果输入的网元名称存在网元名称列表中，则找出网元对应的大区、硬件资源池、虚拟资源池
      if (this.network_element_list.indexOf(value) > -1) {
        this.ResVnfNamesData.forEach((val, key) => {
          if (val.network_element === value) {
            this.reportFormData.network_element = val.network_element
            this.reportFormData.area = val.area
            this.reportFormData.hardware_resource_pool = val.hardware_resource_pool
            this.reportFormData.virtual_resource_pool = val.virtual_resource_pool
          }
        })
      }
    },
    SelectVnfNameTwo (value) {
      this.GetVnfResourceData(value)
      this.GetVnfHaResourceData(value)
      this.capatity_network_elet_info.capatity_memory = 0
      this.capatity_network_elet_info.capatity_storage = 0
      this.capatity_network_elet_info.capatity_cpu = 0
      this.capatity_network_elet_info.capatity_netowrk = 0
      this.capatity_network_elet_info.capatity_ha = ''
      this.capatity_network_elet_history_list = []
    },

    // 操作事件：添加预扩容数据
    AddCapatityEvent () {
      if (this.capatity_network_elet_info.capatity_ha) {
        const freeData = {}
        // 获取cpu、内存、存储空闲的数值
        this.capacityChartData.forEach((value, index) => {
          if (value.type === this.capatity_network_elet_info.capatity_ha) {
            if (value.name === 'free') {
              if (value.category === 'CPU') {
                freeData.cpu = value.value
              } else if (value.category === 'mem') {
                freeData.men = value.value
              } else if (value.category === 'storage') {
                freeData.storage = value.value
              }
            }
          }
        })
        if (this.capatity_network_elet_info.capatity_cpu > freeData.cpu) {
          this.$message.warning(`预扩容CPU超出空闲值！剩余空闲：${freeData.cpu}`)
        } else if (this.capatity_network_elet_info.capatity_memory > freeData.men) {
          this.$message.warning(`预扩容内存超出空闲值！剩余空闲：${freeData.men}`)
        } else if (this.capatity_network_elet_info.capatity_storage > freeData.storage) {
          this.$message.warning(`预扩容存储超出空闲值！剩余空闲：${freeData.storage}`)
        } else {
          this.capacityChartData.map((value, index) => {
            if (value.type === this.capatity_network_elet_info.capatity_ha && value.name === 'local') {
              if (value.category === 'CPU') {
                value.value = value.value + this.capatity_network_elet_info.capatity_cpu
                value.percent = parseFloat((value.value / value.total * 100).toFixed(2))
              } else if (value.category === 'mem') {
                value.value = value.value + this.capatity_network_elet_info.capatity_memory
                value.percent = parseFloat((value.value / value.total * 100).toFixed(2))
              } else if (value.category === 'storage') {
                value.value = value.value + this.capatity_network_elet_info.capatity_storage
                value.percent = parseFloat((value.value / value.total * 100).toFixed(2))
              }
            } else if (value.type === this.capatity_network_elet_info.capatity_ha && value.name === 'free') {
              if (value.category === 'CPU') {
                value.value = value.value - this.capatity_network_elet_info.capatity_cpu
                value.percent = parseFloat((value.value / value.total * 100).toFixed(2))
              } else if (value.category === 'mem') {
                value.value = value.value - this.capatity_network_elet_info.capatity_memory
                value.percent = parseFloat((value.value / value.total * 100).toFixed(2))
              } else if (value.category === 'storage') {
                value.value = value.value - this.capatity_network_elet_info.capatity_storage
                value.percent = parseFloat((value.value / value.total * 100).toFixed(2))
              }
            }
            return value
          })
          const capatityFormData = JSON.parse(JSON.stringify(this.capatity_network_elet_info))
          this.capatity_network_elet_history_list.push(capatityFormData)
        }
      } else {
        this.$message.warning('请指定HA进行扩容模拟！')
      }
    },

    // 操作事件：删除历史预扩容记录
    DeleteCapatityEvent (index) {
      const deleteCapatityData = this.capatity_network_elet_history_list[index]
      this.capacityChartData.map((value, index) => {
        if (value.type === deleteCapatityData.capatity_ha && value.name === 'local') {
          if (value.category === 'CPU') {
            value.value = value.value - deleteCapatityData.capatity_cpu
            value.percent = parseFloat((value.value / value.total * 100).toFixed(2))
          } else if (value.category === 'mem') {
            value.value = value.value - deleteCapatityData.capatity_memory
            value.percent = parseFloat((value.value / value.total * 100).toFixed(2))
          } else if (value.category === 'storage') {
            value.value = value.value - deleteCapatityData.capatity_storage
            value.percent = parseFloat((value.value / value.total * 100).toFixed(2))
          }
        } else if (value.type === deleteCapatityData.capatity_ha && value.name === 'free') {
          if (value.category === 'CPU') {
            value.value = value.value + deleteCapatityData.capatity_cpu
            value.percent = parseFloat((value.value / value.total * 100).toFixed(2))
          } else if (value.category === 'mem') {
            value.value = value.value + deleteCapatityData.capatity_memory
            value.percent = parseFloat((value.value / value.total * 100).toFixed(2))
          } else if (value.category === 'storage') {
            value.value = value.value + deleteCapatityData.capatity_storage
            value.percent = parseFloat((value.value / value.total * 100).toFixed(2))
          }
        }
        return value
      })
      this.capatity_network_elet_history_list.splice(index, 1)
    },

    // 操作事件：提交预审报告表单
    reportEvent () {
      const sum = this.reportFormData.cpu + this.reportFormData.memory + this.reportFormData.hard_disk + this.reportFormData.network
      if (this.reportFormData.network_element && sum !== 0) {
        this.reportFormData.operation_user = this.$store.getters.getInfo.userName
        this.SubmitAuditFormEvent(this.reportFormData)
      } else if (sum === 0) {
        this.$message.warning('至少填写一项预审资源（CPU、内存、带宽或存储）！')
      } else {
        this.$message.warning('请输入预审的网元名称！')
      }
    },

    // 操作事件：刷新资源预审记录表格数据
    findList () {
      const formParams = {
        page: this.pagination.current,
        page_size: this.pagination.pageSize,
        network_element: this.formData.network_elet_name,
        begin_date: this.formData.beigin_date,
        end_date: this.formData.end_date
      }
      const sign = 'data'
      this.GetVnfAuditHistoryData(formParams, sign)
    },

    async onPageChange (pageInfo) {
      this.pagination.current = pageInfo.current
      this.pagination.pageSize = pageInfo.pageSize
      await this.findList()
    },

    // 操作事件：资源预审记录条件查询
    searchEvent () {
      if (this.formData.beigin_date) {
        this.formData.beigin_date = this.formData.beigin_date + 'T00:00:00'
      }
      if (this.formData.end_date) {
        this.formData.end_date = this.formData.end_date + 'T23:59:59'
      }
      const formParams = {
        page: 1,
        page_size: 20,
        network_element: this.formData.network_elet_name,
        begin_date: this.formData.beigin_date,
        end_date: this.formData.end_date
      }
      const sign = 'data'
      this.GetVnfAuditHistoryData(formParams, sign)
    },

    // 操作事件：删除资源预审记录数据
    removeEvent () {
      const selectRecords = this.$refs.xTable.getCheckboxRecords()
      if (selectRecords.length) {
        this.$XModal.confirm('您确定要删除选中的数据吗?').then(type => {
          if (type === 'confirm') {
            this.deleteAuditHistoryData(selectRecords)
          }
        })
      } else {
        this.$message.error('请至少选择一条需要删除的数据')
      }
    },

    // 操作事件：格式化预审结果状态
    formatterHostStatus ({ cellValue }) {
      let item = ''
      if (cellValue === 1) {
        item = '<span class="q-badge bg-green" style="background-color: #55BC8A; color: #ffffff">通过</span>'
      } else if (cellValue === 2) {
        item = '<span class="q-badge bg-red">不通过</span>'
      } else {
        item = '<span class="q-badge" style="background-color: #242e42; color: #ffffff">待定</span>'
      }
      return item
    },

    // 操作事件：生成指定网元的HA资源分布情况图
    capacityChartEvent () {
      const data = this.capacityChartData
      this.capacityChart = new Chart({
        container: 'container',
        autoFit: true,
        height: 340
      })
      this.capacityChart.data(data)
      this.capacityChart.axis('percent', false)
      this.capacityChart.axis('category', {
        label: {
          formatter (text) {
            if (text === 'mem') {
              return '内存'
            } else if (text === 'storage') {
              return '存储'
            } else {
              return text
            }
          }
        }
      })
      this.capacityChart.legend({
        position: 'bottom',
        itemName: {
          formatter (text) {
            if (text === 'free') {
              return '空闲'
            } else if (text === 'local') {
              return '本网元'
            } else {
              return '其他'
            }
          }
        }
      })
      this.capacityChart.tooltip({
        showMarkers: false
      })
      this.capacityChart.interaction('element-active')
      this.capacityChart.annotation().line({
        start: ['min', 95],
        end: ['max', 95],
        style: {
          stroke: '#242E42',
          lineWidth: 1,
          lineDash: [7, 2]
        },
        text: {
          position: 'start',
          style: {
            fontSize: 10,
            fontWeight: 'bold'
          },
          content: '存储预警线 95%',
          offsetY: -5
        }
      })
      this.capacityChart.annotation().line({
        start: ['min', 85],
        end: ['max', 85],
        style: {
          stroke: '#242E42',
          lineWidth: 1,
          lineDash: [7, 2]
        },
        text: {
          position: 'start',
          style: {
            fontSize: 10,
            fontWeight: 'bold'
          },
          content: 'CPU、内存预警线 85%',
          offsetY: -5
        }
      })
      this.capacityChart.tooltip({
        customContent: (name, items) => {
          const container = document.createElement('div')
          container.className = 'g2-tooltip'
          const title = `<div class="g2-tooltip-title" style="margin-top: 12px;margin-bottom: 12px;">${name}</div>`
          let listItem = ''
          items.forEach((item) => {
            let type = ''
            if (item.data.name === 'free') {
              type = '空闲'
            } else if (item.data.name === 'local') {
              type = '本网元'
            } else {
              type = '其他'
            }
            let value = ''
            if (item.data.category === 'CPU') {
              value = item.data.value + 'vcpu'
            } else {
              value = item.data.value + 'GB'
            }
            listItem += `<li class="g2-tooltip-list-item" data-index={index} style="margin-bottom:4px;display:flex;align-items: center;">
    <span style="background-color:${item.mappingData.color || item.color};" class="g2-tooltip-marker"></span>
    <span style="display:inline-flex;flex:1;justify-content:space-between">
    <span style="margin-right: 16px;">${item.data.type}-${type}:</span><span>${value}<br>${item.data.percent}%</span>
    </span>
</li>`
          })
          container.innerHTML = title + listItem
          return container
        }
      })
      this.capacityChart
        .interval()
        .position('category*percent')
        .color('name', ['#EFF4F9', '#566f7b', '#242E42'])
        .size(50)
        .adjust([
          {
            type: 'dodge',
            dodgeBy: 'type', // 按照 type 字段进行分组
            marginRatio: 0 // 分组中各个柱子之间不留空隙
          },
          {
            type: 'stack'
          }
        ])
      this.capacityChart.interaction('active-region')
      this.capacityChart.render()
    },

    // 请求事件：获取所有网元名称
    GetAllVnfNameData () {
      return new Promise((resolve, reject) => {
        getAllVnfNameAPI().then(response => {
          const { data } = response
          if (data.code === 0) {
            this.ResVnfNamesData = data.data
            const vnfNames = data.data.map((value, index) => {
              return value.network_element
            })
            this.network_element_list = vnfNames
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },

    // 请求事件：获取指定网元占用资源概述数据
    GetVnfResourceData (vnfName) {
      return new Promise((resolve, reject) => {
        getVnfResourceAPI(vnfName).then(response => {
          const { data } = response
          if (data.code === 0) {
            if (JSON.stringify(data.data.network_element_info) === '{}') {
            } else {
              this.network_element_info = data.data.network_element_info
              this.capatity_network_elet_info.capatity_ha = data.data.network_element_info.ha_info[0]
            }
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },

    // 请求事件：获取网元资源HA分布数据
    GetVnfHaResourceData (vnfName) {
      return new Promise((resolve, reject) => {
        getVnfHaResourceAPI(vnfName).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.capacityChartData = data.data.map((value, key) => {
              value.percent = parseFloat((value.value / value.total * 100).toFixed(2))
              return value
            })
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },

    // 请求事件：获取资源预审记录数据
    GetVnfAuditHistoryData (data, sign) {
      return new Promise((resolve, reject) => {
        getAuditHistoryDataAPI(data).then(response => {
          const { data } = response
          if (data.code === 0) {
            if (sign === 'export') {
              this.$refs.xTable.exportData({
                filename: '资源预审记录全量数据',
                type: 'csv',
                isHeader: true,
                isFooter: true,
                data: data.data.list
              })
            } else {
              this.pagination.total = data.data.total
              this.pagination.current = data.data.page
              this.pagination.pageSize = data.data.page_size
              this.data = data.data.list
              this.getInitData(this.data)
              this.pagination.total = this.data.length
            }
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },

    // 请求事件：资源预审信息提交
    SubmitAuditFormEvent (FormData) {
      return new Promise((resolve, reject) => {
        SubmitAuditFormAPI(FormData).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.appraisal_conclusion = data.data.appraisal_conclusion
            this.reportResultData.reportId = data.data.id
            this.reportResultData.report_result_state = data.data.assessment_result
            this.reportResultData.aduitReportData = data.data.appraisal_report_data
            this.reportResultData.aduitReportResult = data.data.appraisal_conclusion
            this.productReport = true
            this.findList()
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },

    // 请求事件：删除资源预审记录数据
    deleteAuditHistoryData (params) {
      const idList = params.map((value, index) => {
        return value.id
      })
      return new Promise((resolve, reject) => {
        deleteAuditHistoryDataAPI({ id_list: idList }).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.$message.success('删除数据成功！')
            this.findList()
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },

    // 请求事件：更新资源预审评估结论
    updateAuditResultEvent (data) {
      return new Promise((resolve, reject) => {
        UpdateAuditResultAPI(data).then(response => {
          const { data } = response
          this.loading = false
          if (data.code === 0) {
            this.$message.success('更新成功！')
            this.findList()
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
td {
  border: 1px solid grey;
  padding: 0 0 0 6px;
}
.bg-img {
  height: 90px;
  background-image: url("~@/assets/images/resource/resourceBg.png");
  overflow: hidden;
}
.bg-img:before{
  background-image: url("~@/assets/images/resource/haResource.png")
}
.source-main-row-style{
  border-radius: 4px;
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
</style>
