<template>
  <div>
    <div class="bg-mod-card rounded-sm p-4">
      <t-form
        :data="condition"
        labelWidth="calc(2em + 50px)"
        layout="inline"
        ref="form"
        @submit="onSubmit"
        scrollToFirstError="smooth"
      >
        <t-form-item label="排名类型:" name="forecastType">
          <t-select v-model="condition.forecastType" clearable filterable :options="[
                { label: '10GE', value: '10GE' },
                { label: '25GE', value: '25GE' },
                { label: '40GE', value: '40GE' },
                { label: '100GE', value: '100GE' },
              ]">
          </t-select>
        </t-form-item>
        <t-form-item label="资源池名称:" name="resourcePool">
          <t-select v-model="condition.resourcePool" clearable filterable :options="resourcePoolOptions" @change="handlerResourcePoolChange">
          </t-select>
        </t-form-item>
        <t-form-item label="设备名:" name="hostName">
          <t-select v-model="condition.hostName" clearable filterable  @change="handlerHostNameChange">
            <t-option v-for="(item, index) in hostListOptions" :value="item" :label="item" :key="index">
              {{ item }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="端口名:" name="portName">
          <t-select v-model="condition.portName" clearable filterable>
            <t-option v-for="(item, index) in portNameOptions" :value="item" :label="item" :key="index">
              {{ item }}
            </t-option>
          </t-select>
        </t-form-item>
        <t-form-item
          label="选择日期:"
          name="date"
        >
          <t-date-picker v-model="condition.date"></t-date-picker>
        </t-form-item>
        <t-form-item>
          <t-button theme="primary" type="submit">查询</t-button>
        </t-form-item>
      </t-form>
    </div>
    <div class="bg-mod-card rounded-sm p-4 my-2">
      <div style="letter-spacing: 2px; font-weight: bold">算法排名预测</div>
      <div class="pt-2">
        <vxe-table
          resizable
          highlight-hover-row
          highlight-hover-column
          auto-resize
          ref="sortTable"
          id="sortTable"
          row-id="id"
          empty-text="暂无排名信息！"
          border="inner"
          max-height="300"
          size="mini"
          :sort-config="{ sortRemote: true }"
          :tooltip-config="{ showAll: true }"
          :loading="sortTable.loading"
          :seq-config="{ startIndex: (sortPages.current - 1) * sortPages.size }"
          :row-config="{ isHover: true }"
          :data="sortTable.infoData"
          @sort-change="infoDataSort"
        >
          <vxe-table-column
            v-for="(config, index) in sortTable.column"
            :key="index"
            v-bind="config"
          >
            <template v-if="config.field === 'portName'" v-slot="{ row }">
              <span
                class="text-mod-primary font-bold"
                style="text-decoration: underline; cursor: pointer"
                @click="showInfo(row.id)"
                >{{ row.portName }}</span
              >
            </template>
            <template v-else-if="config.field === 'isPredict'" v-slot="{ row }">
              <span>{{ row | predict }}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column
            title="操作"
            align="center"
            fixed="right"
            width="100"
          >
            <template v-slot="{ row }">
              <t-button theme="primary" size="small" variant="text" @click="faultSign(row)">故障标记</t-button>
            </template>
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          class="mt-2 pt-8 pb-12"
          size="mini"
          :current-page="sortPages.current"
          :page-size="sortPages.size"
          :total="sortPages.total"
          :page-sizes="sortPages.pageSizeList"
          :page-count="5"
          @page-change="pagesLimit"
        >
        </vxe-pager>
      </div>
    </div>
    <t-dialog placement="center" :visible.sync="alert" header="新增故障记录" :cancel-btn="null" :confirm-btn="getConfirmBtn">
      <t-form
        ref="formRef"
        :data="addForm"
        :rules="rules"
        label-align="top"
        class="p-4"
        @submit="onFormSubmit">
          <t-form-item label="链路类型:" name="type">
            <t-input readonly v-model="addForm.type"/>
          </t-form-item>
          <t-form-item label="资源池:" name="resourcePool">
            <t-input readonly v-model="addForm.resourcePool"/>
          </t-form-item>
          <t-form-item label="设备名称:" name="hostName">
            <t-input readonly v-model="addForm.hostName"/>
          </t-form-item>
          <t-form-item label="端口名称:" name="portName">
            <t-input readonly v-model="addForm.portName"/>
          </t-form-item>
          <t-form-item label="对端设备名称:" name="toHostName">
            <t-input readonly v-model="addForm.toHostName"/>
          </t-form-item>
          <t-form-item label="对端端口名称:" name="toPortName">
            <t-input readonly v-model="addForm.toPortName"/>
          </t-form-item>
          <t-form-item label="故障发生时间:" name="occurrenceTime">
            <t-input readonly v-model="addForm.occurrenceTime"/>
          </t-form-item>
          <t-form-item label="发生途径:" name="discoveryPath">
            <t-textarea v-model="addForm.discoveryPath"></t-textarea>
          </t-form-item>
          <t-form-item label="告警描述:" name="alarmDescription">
            <t-textarea v-model="addForm.alarmDescription"></t-textarea>
          </t-form-item>
          <t-form-item label="直接原因:" name="immediateCause">
            <t-textarea v-model="addForm.immediateCause"></t-textarea>
          </t-form-item>
          <t-form-item label="备件更换信息:" name="partsReplacement">
            <t-textarea v-model="addForm.partsReplacement"></t-textarea>
          </t-form-item>
        </t-form>
    </t-dialog>

    <div class="p-4 my-2 bg-mod-card rounded-sm">
      <div style="letter-spacing: 2px; font-weight: bold">排名突增Top10</div>
      <div class="mt-2" style="height: 338px">
        <div style="height: 338px">
          <iframe
            :src="iframe.url"
            style="height: 100%; width: 100%; border: 0px"
          />
        </div>
      </div>
    </div>
    <t-dialog placement="center" :visible.sync="dialog" header="端口详情" :cancel-btn="null" :confirm-btn="null" width="1220px">
      <div style="border-radius: 0px; min-width: 1180px; min-height: 900px">
        <div class="p-4">
          <table
            cellpadding="0"
            cellspacing="0"
            style="border: 2px solid #90caf9"
          >
            <tr style="text-align: center">
              <td class="font-bold" colspan="4">A端</td>
              <td class="font-bold" colspan="4">Z端</td>
            </tr>
            <tr>
              <td class="font-bold">设备名</td>
              <td colspan="3">{{ detailInfo.hostName }}</td>
              <td class="font-bold">设备名</td>
              <td colspan="3">{{ detailInfo.toHostName }}</td>
            </tr>
            <tr>
              <td class="font-bold td1_field">端口名</td>
              <td class="td1_value" colspan="3">{{ detailInfo.portName }}</td>
              <td class="font-bold td1_field">接口名</td>
              <td class="td1_value" colspan="3">{{ detailInfo.toPortName }}</td>
            </tr>
            <tr>
              <td class="font-bold td1_field">收发器类型</td>
              <td>{{ detailInfo.transceiverType }}</td>
              <td class="font-bold td1_field">序列号</td>
              <td>{{ detailInfo.serialNumber }}</td>
              <td class="font-bold td1_field">收发器类型</td>
              <td>{{ detailInfo.toTransceiverType }}</td>
              <td class="font-bold td1_field">序列号</td>
              <td>{{ detailInfo.toSerialNumber }}</td>
            </tr>
            <tr>
              <td class="font-bold">供应商名称</td>
              <td>{{ detailInfo.vendorName }}</td>
              <td class="font-bold">供应商零件号</td>
              <td>{{ detailInfo.vendorPartNumber }}</td>
              <td class="font-bold">供应商名称</td>
              <td>{{ detailInfo.toVendorName }}</td>
              <td class="font-bold">供应商零件号</td>
              <td>{{ detailInfo.toVendorPartNumber }}</td>
            </tr>
            <tr>
              <td class="font-bold">CRC增量</td>
              <td>{{ detailInfo.crcIncremental }}</td>
              <td class="font-bold">告警数</td>
              <td>{{ detailInfo.alarmNum }}</td>
              <td class="font-bold">CRC增量</td>
              <td>{{ detailInfo.toCrcIncremental }}</td>
              <td class="font-bold">告警数</td>
              <td>{{ detailInfo.toAlarmNum }}</td>
            </tr>
            <tr>
              <td class="font-bold">接收功率当前值（dbm）</td>
              <td>{{ detailInfo.receivedPower | valueToFix }}</td>
              <td class="font-bold">发送功率当前值（dbm）</td>
              <td>{{ detailInfo.transmitPower | valueToFix }}</td>
              <td class="font-bold">接收功率当前值（dbm）</td>
              <td>{{ detailInfo.toReceivedPower | valueToFix }}</td>
              <td class="font-bold">发送功率当前值（dbm）</td>
              <td>{{ detailInfo.toTransmitPower | valueToFix }}</td>
            </tr>
            <tr>
              <td class="font-bold">接收功率预测值（dbm）</td>
              <td>{{ detailInfo.receivedPowerForecast | valueToFix }}</td>
              <td class="font-bold">发送功率预测值（dbm）</td>
              <td>{{ detailInfo.transmitPowerForecast | valueToFix }}</td>
              <td class="font-bold">接收功率预测值（dbm）</td>
              <td>{{ detailInfo.toReceivedPowerForecast | valueToFix }}</td>
              <td class="font-bold">发送功率预测值（dbm）</td>
              <td>{{ detailInfo.toTransmitPowerForecast | valueToFix }}</td>
            </tr>
            <tr>
              <td class="font-bold">接收功率劣化度</td>
              <td>{{ detailInfo.receivedPowerScore | valueToFix }}</td>
              <td class="font-bold">发送功率劣化度</td>
              <td>{{ detailInfo.transmitPowerScore | valueToFix }}</td>
              <td class="font-bold">接收功率劣化度</td>
              <td>{{ detailInfo.toReceivedPowerScore | valueToFix }}</td>
              <td class="font-bold">发送功率劣化度</td>
              <td>{{ detailInfo.toTransmitPowerScore | valueToFix }}</td>
            </tr>
            <tr>
              <td class="font-bold">接收功率通道编号</td>
              <td>{{ detailInfo.receivedPowerChannelNum }}</td>
              <td class="font-bold">发送功率通道编号</td>
              <td>{{ detailInfo.transmitPowerChannelNum }}</td>
              <td class="font-bold">接收功率通道编号</td>
              <td>{{ detailInfo.toReceivedPowerChannelNum }}</td>
              <td class="font-bold">发送功率通道编号</td>
              <td>{{ detailInfo.toTransmitPowerChannelNum }}</td>
            </tr>
            <tr>
              <td class="font-bold">偏置电流偏离度</td>
              <td>{{ detailInfo.biasCurrentDeviation | valueToFix }}</td>
              <td class="font-bold">发送功率偏离度</td>
              <td>{{ detailInfo.transmitPowerDeviation | valueToFix }}</td>
              <td class="font-bold">偏置电流偏离度</td>
              <td>{{ detailInfo.toBiasCurrentDeviation | valueToFix }}</td>
              <td class="font-bold">发送功率偏离度</td>
              <td>{{ detailInfo.toTransmitPowerDeviation | valueToFix }}</td>
            </tr>
            <tr>
              <td class="font-bold">偏离度劣化度</td>
              <td>{{ detailInfo.deviationScore | valueToFix }}</td>
              <td class="font-bold">偏离度通道编号</td>
              <td>{{ detailInfo.deviationChannelNum }}</td>
              <td class="font-bold">偏离度劣化度</td>
              <td>{{ detailInfo.toDeviationScore | valueToFix }}</td>
              <td class="font-bold">偏离度通道编号</td>
              <td>{{ detailInfo.toDeviationChannelNum }}</td>
            </tr>
          </table>
          <table
            class="mt-2"
            cellspacing="0"
            cellpadding="0"
            style="border: 2px solid #90caf9"
          >
            <tr>
              <td class="td2_header font-bold">告警数总和</td>
              <td class="td2_field">{{ detailInfo.alarmNumSum }}</td>
              <td class="td2_header font-bold">告警劣化度</td>
              <td class="td2_field">{{ detailInfo.alarmNumScore }}</td>
              <td class="td2_header font-bold">CRC增量总和</td>
              <td class="td2_field">{{ detailInfo.crcIncrementalSum }}</td>
              <td class="td2_header font-bold">CRC增量劣化度</td>
              <td class="td2_field">
                {{ detailInfo.crcIncrementalScore | valueToFix }}
              </td>
              <td class="td2_header font-bold">总劣化度</td>
              <td class="td2_field">{{ detailInfo.score | valueToFix }}</td>
              <td class="td2_header font-bold">排名</td>
              <td class="td2_field">{{ detailInfo.ranking }}</td>
            </tr>
          </table>
        </div>
        <div class="pb-2" style="height: 340px">
          <div>
            <iframe
              :src="iframe.detailUrl"
              style="height: 100%; width: 100%; border: 0px"
            />
          </div>
        </div>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import {
  getPageForecastAPI,
  getRankingChangeTopAPI,
  getPortAPI
} from '@/api/monitor/opticalLink'
import { saveSignAPI } from '@/api/monitor/sign'
import {
  getResourcePoolAPI,
  getHostListAPI,
  getPortsByHostNameAPI
} from '@/api/monitor/opticalModule'
import { formatDate } from '@/utils/inops/dateUtils'
import dialogSubmit from '@/mixins/dialogSubmit'
import { cloneDeep } from 'lodash'
export default {
  name: 'index',
  mixins: [dialogSubmit],
  filters: {
    valueToFix (value) {
      return value ? value.toFixed(4) : value
    },
    predict (value) {
      const received =
        value.receivedPowerForecast !== null &&
        value.receivedPower !== value.receivedPowerForecast
      const transmit =
        value.transmitPowerForecast !== null &&
        value.transmitPower !== value.transmitPowerForecast
      const toReceived =
        value.toReceivedPowerForecast !== null &&
        value.toRecelvedPower !== value.toReceivedPowerForecast
      const toTransmit =
        value.toTransmitPowerForecast !== null &&
        value.toTransmitPower !== value.toTransmitPowerForecast
      if (received || transmit || toReceived || toTransmit) {
        return '是'
      } else {
        return '否'
      }
    }
  },
  data () {
    return {
      fieldMapper: {
        score: 'score',
        ranking: 'ranking',
        receivedPowerScore: 'received_power_score',
        transmitPowerScore: 'transmit_power_score',
        toReceivedPowerScore: 'to_received_power_score',
        toTransmitPowerScore: 'to_transmit_power_score',
        deviationScore: 'deviation_score',
        toDeviationScore: 'to_deviation_score',
        scores: 'scores',
        crcIncrementalScore: 'crc_incremental_score',
        alarmNumScore: 'alarm_num_score',
        linkIsComplete: 'link_is_complete',
        dataIsComplete: 'data_is_complete',
        receivedPowerForecast: 'received_power_forecast',
        transmitPowerForecast: 'transmit_power_forecast',
        toReceivedPowerForecast: 'to_received_power_forecast',
        toTransmitPowerForecast: 'to_transmit_power_forecast'
      },
      condition: {
        forecastType: '40GE',
        resourcePool: '',
        hostName: '',
        portName: '',
        date: '',
        orderAsc: '',
        orderDesc: ''
      },
      detailInfo: {
        resourcePool: '',
        hostName: '',
        toHostName: '',
        portName: '',
        channelNum: '',
        toPortName: '',
        crcIncremental: '',
        alarmNum: '',
        toCrcIncremental: '',
        toAlarmNum: '',
        receivedPowerForecast: '',
        receivedPower: '',
        receivedPowerScore: '',
        toReceivedPowerForecast: '',
        toReceivedPower: '',
        toReceivedPowerScore: '',
        transmitPowerForecast: '',
        transmitPower: '',
        transmitPowerScore: '',
        toTransmitPowerForecast: '',
        toTransmitPower: '',
        toTransmitPowerScore: '',
        biasCurrentDeviation: '',
        transmitPowerDeviation: '',
        toBiasCurrentDeviation: '',
        toTransmitPowerDeviation: '',
        deviationScore: '',
        toDeviationScore: '',
        alarmNumSum: '',
        alarmNumScore: '',
        crcIncrementalSum: '',
        crcIncrementalScore: '',
        score: '',
        ranking: '',
        transceiverType: '',
        toTransceiverType: '',
        serialNumber: '',
        toSerialNumber: '',
        vendorName: '',
        toVendorName: '',
        vendorPartNumber: '',
        toVendorPartNumber: '',
        deviationChannelNum: '',
        toDeviationChannelNum: '',
        receivedPowerChannelNum: '',
        toReceivedPowerChannelNum: '',
        transmitPowerChannelNum: '',
        toTransmitPowerChannelNum: ''
      },
      resourcePoolOptions: [],
      hostListOptions: [],
      filterHostList: [],
      portNameOptions: [],
      sortTable: {
        loading: false,
        // #region 新增
        infoData: [
          {
            id: 2,
            type: '10GE',
            resourcePool: 'NFV-RP-HNGZ-08A',
            hostName: 'NFV-D-HNGZ-08A-3502-AC09-M-TOR-02',
            portName: '10GE1/0/17',
            toHostName: 'NFV-D-HNGZ-08A-3502-AC09-S-SRV-05',
            toPortName: 'ens2f1',
            occurrenceTime: '2023-02-21 16:00:00',
            discoveryPath: '发现途径1',
            alarmDescription: '告警描述,更新',
            immediateCause: '直接原因1',
            partsReplacement: null,
            del: 0,
            createTime: '2023-02-21 17:34:20',
            updateTime: '2023-02-21 17:41:16'
          }
        ],
        // #endregion
        column: [
          { type: 'seq', title: '序号', align: 'center', width: '60' },
          {
            field: 'hostName',
            title: '设备名',
            formatType: '',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '250'
          },
          {
            field: 'portName',
            title: '端口名',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '120'
          },
          {
            field: 'toHostName',
            title: '对端设备名',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '250'
          },
          {
            field: 'toPortName',
            title: '对端端口名',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '120'
          },
          {
            field: 'score',
            title: '总劣化度',
            sortable: true,
            formatter: this.formatDecimal,
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '100'
          },
          {
            field: 'ranking',
            title: '排名',
            sortable: true,
            align: 'center',
            width: '80'
          },
          {
            field: 'linkIsComplete',
            title: '对端信息是否完整',
            sortable: true,
            formatter: this.formatComplete,
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '130'
          },
          {
            field: 'dataIsComplete',
            title: '光链路信息是否完整',
            sortable: true,
            formatter: this.formatComplete,
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '130'
          },
          {
            field: 'isPredict',
            title: '是否预测',
            formatter: this.formatComplete,
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '130'
          },
          {
            field: 'receivedPowerScore',
            title: '接收功率劣化度',
            sortable: true,
            formatter: this.formatDecimal,
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '135'
          },
          {
            field: 'transmitPowerScore',
            title: '发送功率劣化度',
            sortable: true,
            formatter: this.formatDecimal,
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '135'
          },
          {
            field: 'toReceivedPowerScore',
            title: '对端接收功率劣化度',
            sortable: true,
            formatter: this.formatDecimal,
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '155'
          },
          {
            field: 'toTransmitPowerScore',
            title: '对端发送功率劣化度',
            sortable: true,
            formatter: this.formatDecimal,
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '155'
          },
          {
            field: 'deviationScore',
            title: '偏离度劣化度',
            sortable: true,
            formatter: this.formatDecimal,
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '135'
          },
          {
            field: 'toDeviationScore',
            title: '对端偏离度劣化度',
            sortable: true,
            formatter: this.formatDecimal,
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '155'
          },
          {
            field: 'crcIncrementalScore',
            title: 'CRC增量劣化度',
            sortable: true,
            formatter: this.formatDecimal,
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '135'
          },
          {
            field: 'alarmNumScore',
            title: '告警数劣化度',
            sortable: true,
            formatter: this.formatDecimal,
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '135'
          },
          {
            field: 'receivedPowerForecast',
            title: '接收功率预测值',
            sortable: true,
            formatter: this.formatDecimal,
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '135'
          },
          {
            field: 'transmitPowerForecast',
            title: '发送功率预测值',
            sortable: true,
            formatter: this.formatDecimal,
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '135'
          },
          {
            field: 'toReceivedPowerForecast',
            title: '对端接收功率预测值',
            sortable: true,
            formatter: this.formatDecimal,
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '135'
          },
          {
            field: 'toTransmitPowerForecast',
            title: '对端发送功率预测值',
            sortable: true,
            formatter: this.formatDecimal,
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip',
            showFooterOverflow: true,
            width: '135'
          }
        ]
      },
      sortPages: {
        pageSizeList: [
          10,
          50,
          100,
          500,
          1000,
          2000,
          { label: '全部', value: '' }
        ],
        total: 0,
        current: 1,
        size: 5,
        align: 'right'
      },
      dialog: false,
      prefixUrl: 'http://188.0.58.40:8084/',
      topUrl:
        'd/monitor_optical_forecas_ranking/monitor_optical_forecas_ranking?orgId=1',
      detailUrl: 'd/monitor-optical-forecas/monitor-optical-forecas?orgId=1&',
      iframe: {
        url: '',
        detailUrl: ''
      },
      alert: false,
      // 故障记录表单的数据
      addForm: {
        id: '',
        type: '',
        resourcePool: '',
        hostName: '',
        portName: '',
        toHostName: '',
        toPortName: '',
        occurrenceTime: '',
        discoveryPath: '',
        alarmDescription: '',
        immediateCause: '',
        partsReplacement: ''
      },
      rules: {
        discoveryPath: [
          { required: true, message: '发生途径必填', type: 'error' }
        ],
        alarmDescription: [
          { required: true, message: '告警描述必填', type: 'error' }
        ]
      }
    }
  },
  async mounted () {
    this.initDate()
    await this.getResourcePool()
    await this.getHostList()
    this.getPageForecast()
    this.getRankingChangeTop()
  },
  methods: {
    handlerResourcePoolChange (value, context) {
      if (value) {
        this.condition.hostName = ''
        this.condition.portName = ''
        this.getHostList()
      }
    },
    handlerHostNameChange (value, context) {
      if (value) {
        this.condition.portName = ''
        this.getPortsByHostName()
      }
    },
    onSubmit ({ validateResult, firstError }) {
      if (validateResult === true) {
        this.sortPages.current = 1
        this.sortPages.size = 5
        this.getPageForecast()
        this.getRankingChangeTop()
      } else {
        this.$message.warning(firstError)
      }
    },
    onFormSubmit ({ validateResult, firstError }) {
      if (validateResult === true) {
        saveSignAPI(this.addForm).then((res) => {
          const { data } = res
          if (data.code === 0) {
            this.$message.success(data.msg)
            this.alert = false
          } else {
            this.$message.error(data.msg)
          }
        }).catch(reason => this.$message.error(reason.data.msg))
      } else {
        this.$message.warning(firstError)
      }
    },
    initDate () {
      const yesterDay = new Date().setTime(
        new Date().getTime() - 3600 * 1000 * 24
      )
      this.condition.date = formatDate(yesterDay)
    },
    async getResourcePool () {
      await getResourcePoolAPI().then((res) => {
        const { data } = res
        if (data.code === 0) {
          data.data.forEach((item) => {
            const param = {
              label: item.alias,
              value: item.name
            }
            this.resourcePoolOptions.push(param)
          })
        }
      })
    },
    async getRankingChangeTop () {
      const params = {
        forecastType: this.condition.forecastType,
        top: 10,
        date: this.condition.date
      }
      getRankingChangeTopAPI(params).then((res) => {
        const { data } = res
        if (data.code === 0) {
          let num = 1
          let str = ''
          data.data.forEach((item) => {
            const portName = item[`port_name${num}`]
            const hostName = item[`host_name${num}`]
            str += `&var-host_name${num}=${hostName}&var-port_name${num}=${portName}`
            num++
          })
          this.iframe.url = `${this.prefixUrl}${this.topUrl}${str}&var-type=${this.condition.forecastType}&var-top=10&theme=light&kiosk`
        }
      })
    },
    async getHostList () {
      const params = {
        type: this.condition.forecastType,
        resourcePool: this.condition.resourcePool
          ? this.condition.resourcePool
          : this.resourcePoolOptions[0].value
      }
      await getHostListAPI(params).then((res) => {
        const { data } = res
        if (data.code === 0) {
          this.hostListOptions = []
          this.filterHostList = []
          data.data.forEach((item) => {
            this.hostListOptions.push(item.hostName)
            this.filterHostList.push(item.hostName)
          })
        }
      })
    },
    async getPortsByHostName () {
      await getPortsByHostNameAPI(this.condition.hostName).then((res) => {
        const { data } = res
        if (data.code === 0) {
          this.portNameOptions = data.data
        }
      })
    },
    async getPort (type) {
      let params = {}
      if (type === 'local') {
        params = {
          hostName: this.detailInfo.hostName,
          portName: this.detailInfo.portName
        }
      } else {
        params = {
          hostName: this.detailInfo.toHostName,
          portName: this.detailInfo.toPortName
        }
      }
      await getPortAPI(params).then((res) => {
        const { data } = res
        if (data.code === 0) {
          if (type === 'local') {
            if (data.data) {
              this.detailInfo.transceiverType = data.data.transceiverType
              this.detailInfo.serialNumber = data.data.serialNumber
              this.detailInfo.vendorName = data.data.vendorName
              this.detailInfo.vendorPartNumber = data.data.vendorPartNumber
            }
          } else {
            if (data.data) {
              this.detailInfo.toTransceiverType = data.data.transceiverType
              this.detailInfo.toSerialNumber = data.data.serialNumber
              this.detailInfo.toVendorName = data.data.vendorName
              this.detailInfo.toVendorPartNumber = data.data.vendorPartNumber
            }
          }
        }
      })
    },
    getPageForecast () {
      this.sortTable.loading = true
      const pages = {
        page: this.sortPages.current,
        pageSize: this.sortPages.size
      }
      const data = Object.assign(this.condition, pages)
      getPageForecastAPI(data).then((res) => {
        const { data } = res
        if (data.code === 0) {
          this.sortTable.infoData = []
          this.sortTable.infoData = data.data.records
          this.sortPages.size = data.data.size
          this.sortPages.current = data.data.current
          this.sortPages.total = data.data.total
          this.sortTable.loading = false
        } else {
          this.$message.error('查询失败，请重试')
        }
      })
    },
    async showInfo (id) {
      const index = this.sortTable.infoData.findIndex((item) => item.id === id)
      this.detailInfo = this.sortTable.infoData[index]
      await this.getPort('local')
      await this.getPort('to')
      const { resourcePool, hostName, portName, toHostName, toPortName } =
        this.detailInfo
      this.iframe.detailUrl = `${this.prefixUrl}${this.detailUrl}var-resource_pool=${resourcePool}&var-type=${this.condition.forecastType}&var-host_name=${hostName}&var-port_name=${portName}&var-to_host_name=${toHostName}&var-to_port_name=${toPortName}&theme=light&kiosk`
      this.dialog = true
    },
    pagesLimit ({ currentPage, pageSize }) {
      this.sortPages.current = currentPage
      this.sortPages.size = pageSize
      this.getPageForecast()
    },
    infoDataSort ({ sortList }) {
      const field = sortList[0].property
      this.condition.orderAsc = ''
      this.condition.orderDesc = ''
      sortList[0].order === 'asc'
        ? (this.condition.orderAsc = this.fieldMapper[field])
        : (this.condition.orderDesc = this.fieldMapper[field])
      this.getPageForecast()
    },
    faultSign (row) {
      this.alert = true
      const { createTime, hostName, portName, toHostName, toPortName, resourcePool, forecastType } = row
      const param = {
        type: forecastType,
        resourcePool,
        hostName,
        portName,
        toHostName,
        toPortName,
        occurrenceTime: createTime,
        discoveryPath: '',
        alarmDescription: '',
        immediateCause: '',
        partsReplacement: ''
      }
      this.addForm = cloneDeep(param)
    },
    formatDecimal ({ cellValue }) {
      return cellValue ? cellValue.toFixed(4) : cellValue
    },
    formatComplete ({ cellValue }) {
      return cellValue === 'true' ? '是' : '否'
    }
  }
}
</script>

<style lang="sass" scoped>
table
  background-color: #e3f2fd
td
  border: 1px solid #ffffff
  padding: 4px 8px
.td1_field
  width: 180px
.td1_value
  width: 110px
.td2_header
  width: 120px
.td2_field
  width: 70px
  text-align: center

  .textarea_box
  padding: 5px 12px
  border: 1px solid #bdbdbd
  border-radius: 3px
  transition: all .2s
  outline: none
.textarea_box:hover
  border: 1px solid #000000
.textarea_box:focus
  box-shadow: 0 0 0 0px #fff, 0 0 0 1px #1976d2 inset
  border-color: #1976d2
</style>
