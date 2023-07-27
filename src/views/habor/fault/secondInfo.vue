<template>
  <t-row :gutter="12">
    <t-col :span="4">
      <div class="w-full">
        <div>
          <div>
            <div style="font-size: 12px" class="pb-2 font-bold">日志<span v-show="obj['label']">({{ obj['label'] }})</span></div>
            <div class="pb-2">
              <t-radio-group variant="primary-filled" default-value="sys">
                <t-radio-button value="sys">系统日志</t-radio-button>
                <t-radio-button value="bmc">BMC日志</t-radio-button>
              </t-radio-group>
            </div>
            <div class="p-4 bg-black text-white rounded-sm" style="height: 350px; overflow: auto">
              <t-space>
                <t-input size="small" v-model="logInfo.filter" placeholder="过滤日志内容" />
                <t-select size="small" v-model="logInfo.highLightInfo" :options="[{label: 'Error', value: 'Error'}, {label: 'Warn', value: 'Warn'}]" placeholder="高亮内容" />
                <t-select size="small" v-if="logInfo.rowShow" v-model="logInfo.row" placeholder="查询最新">
                  <t-option v-for="item in [50, 100, 200, 500]" :value="item" :label="item" :key="item"></t-option>
                </t-select>
              </t-space>
              <div>
                <samp>
                  <pre v-html="logInfo.data" style="white-space: pre-wrap; word-wrap: break-word;" />
                </samp>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style="font-size: 12px" class="py-2 font-bold">设备告警信息<span v-show="obj['label']">({{ obj['label'] }})</span></div>
          <div>
            <vxe-table
              ref="alarmInfo"
              id="alarmInfo"
              empty-text="暂无告警信息！"
              border="default"
              stripe
              auto-resize
              keep-source
              highlight-hover-row
              highlight-current-row
              highlight-hover-column
              highlight-current-column
              resizable
              height="100%"
              size="mini"
              :import-config="{}"
              :export-config="{}"
              :checkbox-config="{reserve: true}"
              :data="alarm.table.infoData"
              row-id='id'
            >
              <vxe-table-column v-for="(config, index) in alarm.table.tableColumn" :key="index" v-bind="config">
                <template v-if="config.field === 'alarmName'" v-slot="{ row }">
                  <span class="text_click text-primary" @click="alarmDialogEvent(row)">{{ row.alarmName }}</span>
                </template>
                <template v-else-if="config.field === 'perceivedSeverity'" v-slot="{ row }">
                  <span v-if="row.perceivedSeverity === '1'"><div class="status-point bg-red"/>一级</span>
                  <span v-else-if="row.perceivedSeverity === '2'"><div class="status-point bg-orange"/>二级</span>
                  <span v-else-if="row.perceivedSeverity === '3'"><div class="status-point bg-yellow"/>三级</span>
                  <span v-else><div class="status-point bg-grey"/>四级</span>
                </template>
              </vxe-table-column>
            </vxe-table>
          </div>
        </div>
      </div>
    </t-col>
    <t-col :span="8">
      <div>
        <div style="font-size: 12px" class="py-2 font-bold">性能<span v-show="obj['label']">({{ obj['label'] }})</span></div>
        <div>
          <iframe :src="url" style="height: 90%; width: 100%; border: 0px"/>
        </div>
      </div>
    </t-col>
  </t-row>
</template>

<script>
import { getLogNetworkAPI, getLogHostAPI } from '@/api/monitor/faultCheck'
export default {
  name: 'secondInfo',
  props: {
    obj: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      logType: 'sys',
      urlDict: {
        srv: { url: 'monitor_server_details', fullScreen: true },
        fw: { url: 'fault_check_network_firewall', fullScreen: true },
        storagePool: { url: 'monitor_storagePool_details', fullScreen: true },
        lun: { url: 'monitor_storagePool_lun_details', fullScreen: true },
        vm: { url: 'monitor_vm_details', fullScreen: true },
        ce: { url: 'monitor_network_details', fullScreen: true },
        tor: { url: 'monitor_network_details', fullScreen: true },
        eor: { url: 'monitor_network_details', fullScreen: true }
      },
      alarm: {
        table: {
          infoData: [],
          tableColumn: [
            { id: 1, field: 'alarmName', title: '告警名称', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
            { id: 2, field: 'name', title: '设备名称', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
            { id: 3, field: 'perceivedSeverity', type: 'html', title: '告警级别', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
            { id: 4, field: 'clearedState', title: '清除状态', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true },
            { id: 5, field: 'latestLogTime', title: '时间', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', showFooterOverflow: true }
          ]
        }
      },
      fullScreen: {
        logScreen: false,
        iframeScreen: false
      },
      url: '',
      prefix: 'http://188.0.58.40:8084/d/fault_check_network_firewall/fault_check_network_firewall?orgId=1&var-resource_pool=',
      logShow: true,
      logInfo: {
        filter: '',
        rowShow: false,
        row: 100,
        highLightInfo: '',
        data: '',
        list: []
      }
    }
  },
  activated () {
    this.logShow = true
    this.logInfo.data = ''
    this.url = this.urlGenerate(this.urlDict[this.obj.type].url, this.urlDict[this.obj.type].fullScreen)
    this.alarm.table.infoData = this.obj.alarmList
    if (this.obj.type === 'srv' || this.obj.type === 'db') {
      this.logInfo.rowShow = true
      this.getLogHost()
    } else if (this.obj.type === 'fw' || this.obj.type === 'ce' || this.obj.type === 'tor' || this.obj.type === 'eor') {
      this.getLogNetwork()
    } else {
      this.logInfo.data = '暂无日志'
      this.logShow = false
    }
  },
  watch: {
    'logInfo.filter': {
      handler () {
        this.logInfo.highLightInfo = ''
        this.logInfoFilter()
      },
      deep: true
    },
    'logInfo.highLightInfo': {
      handler () {
        this.highLightEvent()
      },
      deep: true
    },
    'logInfo.row': {
      handler () {
        this.logShow = true
        this.getLogHost()
      }
    }
  },
  methods: {
    urlGenerate (path, fullScreen) {
      const str = fullScreen ? '&kiosk' : '&refresh=5m'
      const startTime = new Date().setTime(new Date().getTime() - 3600 * 1000 * 6)
      const endTime = new Date().getTime()
      return `http://188.0.50.40:8084/d/${path}/${path}?orgId=1&var-resource_pool=${this.obj.resourcePool}&var-name=${this.obj.label}&from=${startTime}&to=${endTime}${str}`
    },
    getLogNetwork () {
      const params = {
        name: this.obj.label,
        manufacturer: this.obj.manufacturer,
        startTime: this.obj.info.startDate,
        endTime: this.obj.info.endDate
      }
      getLogNetworkAPI(params).then(response => {
        const { data } = response
        if (data.code === 0) {
          if (data.data.orgMsg) {
            this.logInfo.list = data.data.orgMsg.split('\n')
            this.logInfo.data = this.logInfo.list.join('\n')
          } else {
            this.logInfo.data = '未查询到相关日志信息'
          }
          this.logShow = false
        } else {
          this.logShow = false
        }
      })
    },
    getLogHost () {
      const params = {
        name: this.obj.label,
        manufacturer: this.obj.manufacturer,
        row: this.logInfo.row,
        startTime: this.obj.info.startDate,
        endTime: this.obj.info.endDate
      }
      getLogHostAPI(params).then(response => {
        const { data } = response
        if (data.code === 0) {
          if (data.data.orgMsg) {
            this.logInfo.list = data.data.orgMsg.split('\n')
            this.logInfo.data = this.logInfo.list.join('\n')
          } else {
            this.logInfo.data = '未查询到相关日志信息'
          }
          this.logShow = false
        } else {
          this.logShow = false
        }
      })
    },
    logInfoFilter () {
      this.logInfo.data = this.logInfo.list.filter(item => {
        return item.indexOf(this.logInfo.filter) > -1
      }).join('\n')
      if (this.logInfo.filter) {
        this.logInfo.data = this.logInfo.data.replace(new RegExp(this.logInfo.filter, 'g'), '<span class="text-primary" style="font-weight: bold">' + this.logInfo.filter + '</span>')
      }
    },
    highLightEvent () {
      this.logInfoFilter()
      this.logShow = true
      const value = this.logInfo.highLightInfo
      if (value === 'Error') {
        this.logInfo.data = this.logInfo.data.replace(new RegExp('Error', 'g'), '<span class="bg-red text-white">Error</span>')
        this.logInfo.data = this.logInfo.data.replace(new RegExp('error', 'g'), '<span class="bg-red text-white">error</span>')
      } else if (value === 'Warn') {
        this.logInfo.data = this.logInfo.data.replace(new RegExp('Warn', 'g'), '<span class="bg-orange text-white">Warn</span>')
        this.logInfo.data = this.logInfo.data.replace(new RegExp('Warn', 'g'), '<span class="bg-orange text-white">warn</span>')
      }
      this.logShow = false
    },
    resetHighLight () {
      this.logInfo.highLightInfo = ''
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .q-card__section--vert
  height: 5%
  padding: 10px 10px 0px 10px
/deep/ .q-date__view
  min-height: 0px
  padding: 10px
/deep/ .q-date__calendar-days-container
  min-height: 0px
/deep/ .q-date__actions
  padding: 0px 5px 0px 0px
</style>
