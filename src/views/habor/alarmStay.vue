<template>
  <div id="alarm-stay">
    <div class="bg-mod-card rounded-sm justify-between mb-2">
      <t-row class="p-2 flex items-center">
        <t-col :span="10">
          <t-button variant="text" @click="handleShowDate()">
            <div class="font-bold text-mod-title">
              统计日期：<span style="font-size: 16px">{{ selectedDate }}</span
              >&nbsp;&nbsp;⇩
            </div>
          </t-button>
        </t-col>
        <t-col :span="2" class="flex justify-end">
          <div>
            <t-upload
                  v-model="files"
                  :requestMethod="requestSuccessMethod"
                >
                 <t-button theme="primary"
              >导入告警</t-button
            ></t-upload>
            <t-dialog
              v-if="isFileUpload"
              preventScrollThrough
              destroyOnClose
              placement="top"
              width="80%"
              header="文件上传"
              :footer="false"
              :visible.sync="isFileUpload"
            >
              <div class="bg-mod-card p-4">
                <t-upload
                  v-model="files"
                  :requestMethod="requestSuccessMethod"
                ></t-upload>
              </div>
            </t-dialog>
          </div>
        </t-col>
      </t-row>
    </div>
    <div
      style="
        overflow: hidden;
        display: grid;
        grid-template-columns: 3fr 1.5fr 1.5fr;
        grid-column-gap: 10px;
        width: 100%;
        height: 356px;
      "
    >
      <div style="overflow: hidden; position: relative" class="table_progress">
        <!-- :foot-data="[{ index: '123',
          type: '全部类型',
          default: '',
          description: '-',}]" -->
        <t-table
          resizable
          ellipsis
          cellEmptyContent="0"
          style="
            padding-right: 0;
            padding-top: 0;
            margin-top: -2px;
            height: 97%;
          "
          height="358"
          row-key="index"
          :data="t_tableData"
          :columns="t_columns"
          ref="t_table"
          table-layout="fixed"
          class="alarmStay-table"
        >
          <template #footerSummary>
            <div
              class="t-table__row-filter-inner"
              style="display: flex; justify-content: space-around"
            >
              <div>
                <b style="font-weight: bold">当月文件告警总数：</b>
                <b style="font-weight: bold">
                  {{ alarmCountTop.fileAlarmCount }}
                </b>
              </div>
              <div>
                <b style="font-weight: bold">当天Top10告警总数：</b>
                <b style="font-weight: bold">
                  {{ alarmCountTop.alarmTopCount }}
                </b>
              </div>
              <div>
                <b style="font-weight: bold">近日差异总数：</b>
                <b style="font-weight: bold">
                  {{ alarmCountTop.changeValueCount }}
                </b>
              </div>
            </div>
          </template>
        </t-table>
        <div
          class="bg-mod-card rounded-sm"
          ref="dateToggle"
          style="z-index: 99; transition: all 0.5s; position: absolute"
          :style="
            showDate
              ? 'transform:translateY(-96%)'
              : 'transform:translateY(18px)'
          "
        >
          <mod-date @getDate="changeDate" :event-date.sync="eventDate" />
        </div>
      </div>
      <div class="bg-mod-card rounded-sm alarm_progress" id="alarm_progress">
        <div
          style="
            padding: 12px 12px 0 16px;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 1px;
          "
        >
          告警时长
        </div>
        <div
          style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 10px;
            padding: 6px 12px 0px 12px;
          "
        >
          <div
            class="source-main-row-style bg-mod-primary bg-opacity-10"
            style="padding: 4px 12px"
          >
            <div class="font-bold">{{ avgData.avgTime }}</div>
            <div class="source-main-row-font">平均告警时长(小时/台)</div>
          </div>
          <div
            class="source-minor-row-style bg-mod-primary bg-opacity-5"
            style="padding: 4px 12px"
          >
            <div class="font-bold">{{ avgData.level1Count }}</div>
            <div class="source-minor-row-font">一级告警时长(小时)</div>
          </div>
          <div
            class="source-minor-row-style bg-mod-primary bg-opacity-5"
            style="padding: 4px 12px"
          >
            <div class="font-bold">{{ avgData.level2Count }}</div>
            <div class="source-minor-row-font">二级告警时长(小时)</div>
          </div>
          <div
            class="source-minor-row-style bg-mod-primary bg-opacity-5"
            style="padding: 4px 12px"
          >
            <div class="font-bold">{{ avgData.level3Count }}</div>
            <div class="source-minor-row-font">三级告警时长(小时)</div>
          </div>
        </div>
        <div
          style="
            padding: 4px 12px;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 1px;
          "
        >
          设备可用率
        </div>
        <div>
          <t-row :gutter="16">
            <t-col :span="4" class="mod-flex-center">
              <t-space direction="vertical" align="center" :size="10">
                <t-progress
                  theme="circle"
                  :percentage="avgData.networkAvailability"
                  size="medium"
                ></t-progress>
                <div style="font-size: 12px">网络设备</div>
              </t-space>
            </t-col>
            <t-col :span="4" class="mod-flex-center">
              <t-space direction="vertical" align="center" :size="10">
                <t-progress
                  theme="circle"
                  :percentage="avgData.serverAvailability"
                  size="medium"
                ></t-progress>
                <div style="font-size: 12px">计算设备</div>
              </t-space>
            </t-col>
            <t-col :span="4" class="mod-flex-center">
              <t-space direction="vertical" align="center" :size="10">
                <t-progress
                  theme="circle"
                  :percentage="avgData.storageAvailability"
                  size="medium"
                ></t-progress>
                <div style="font-size: 12px">存储设备</div>
              </t-space>
            </t-col>
          </t-row>
        </div>
      </div>
      <div class="bg-mod-card rounded-sm">
        <div
          style="
            padding: 12px 12px 6px 12px;
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 1px;
          "
        >
          【集团考核指标管控】
        </div>
        <div
          class="source-main-row-style"
          style="margin: 0 10px; padding: 5px 16px"
        >
          <div class="font-bold" style="font-size: 12px" id="summary">
            <div style="padding: 2px 0 2px 0">
              时间：
              <span id="summaryTime" class="font-bold">{{
                avgData.dateLimit
              }}</span>
            </div>
            <div style="padding: 2px 0 2px 0">
              设备平均活动时长（集团要求值）：
              <span class="font-status">0.07</span>
              <span class="font-bold">小时/台（考核粒度：月累计）</span>
            </div>
            <div style="padding: 2px 0 2px 0">
              今日设备平均活动告警时长值为：
              <span class="font-status" id="summaryAvg">{{
                avgData.avgTime
              }}</span>
              <span class="font-bold">小时/台</span>
              <span
                class="font-status"
                id="summaryA"
                v-show="avgData.summaryA"
                >{{ avgData.summaryA }}</span
              >
            </div>
            <div
              style="padding: 2px 0 2px 0"
              v-show="avgData.summaryValuationValue"
            >
              <span id="summaryValuationSpan"
                >当前风险评估值：
                <span
                  style="color: #ab2f29; font-size: 14px"
                  id="summaryValuationValue"
                  >{{ avgData.summaryValuationValue }}</span
                >
              </span>
            </div>
            <div
              v-show="avgData.hostTypeMsg.hw"
              class="font-bold"
              style="padding: 2px 0 2px 0"
            >
              <div
                style="
                  height: 8px;
                  width: 8px;
                  background-color: #0084f4;
                  display: inline-block;
                  margin-right: 8px;
                "
              ></div>
              <span id="summaryHwSpan"
                >请华为<span class="font-status" id="summaryHw">{{
                  avgData.hostTypeMsg.hw
                }}</span
                >专业及时清理告警并填写每日告警统计表。</span
              >
            </div>
            <div
              v-show="avgData.hostTypeMsg.alx"
              class="font-bold"
              style="padding: 2px 0 2px 0"
            >
              <div
                style="
                  height: 8px;
                  width: 8px;
                  background-color: #0084f4;
                  display: inline-block;
                  margin-right: 8px;
                "
              ></div>
              <span id="summaryAlxSpan"
                >请爱立信<span class="font-status" id="summaryAlx">{{
                  avgData.hostTypeMsg.alx
                }}</span
                >专业及时清理告警并填写每日告警统计表。</span
              >
            </div>
            <div
              v-show="avgData.hostTypeMsg.zx"
              class="font-bold"
              style="padding: 2px 0 2px 0"
            >
              <div
                style="
                  height: 8px;
                  width: 8px;
                  background-color: #0084f4;
                  display: inline-block;
                  margin-right: 8px;
                "
              ></div>
              <span id="summaryZxSpan"
                >请中兴<span class="font-status" id="summaryZx">{{
                  avgData.hostTypeMsg.zx
                }}</span
                >专业及时清理告警并填写每日告警统计表。</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-mod-card rounded-sm mt-2">
      <div style="overflow: hidden">
        <vxe-table
          round
          border
          auto-resize
          size="mini"
          :column-config="{ resizable: true }"
          :row-config="{ isHover: true }"
          style="margin: 10px"
          ref="xTable"
          :data="tableData"
        >
          <vxe-colgroup field="group0" :title="tableTile" align="center">
            <vxe-column
              field="resourcePool"
              title="资源池/指标"
              width="150"
            ></vxe-column>
            <vxe-colgroup
              title="一级告警未清除数量/累积持续时长(小时)"
              align="center"
            >
              <vxe-colgroup title="计算" align="center">
                <vxe-column
                  field="level1ServerCountNum"
                  title="数量"
                  align="center"
                ></vxe-column>
                <vxe-column
                  field="level1ServerCountTime"
                  title="持续时间"
                  align="center"
                ></vxe-column>
              </vxe-colgroup>
              <vxe-colgroup title="存储" align="center">
                <vxe-column
                  field="level1StorageCountNum"
                  title="数量"
                  align="center"
                ></vxe-column>
                <vxe-column
                  field="level1StorageCountTime"
                  title="持续时间"
                  align="center"
                ></vxe-column>
              </vxe-colgroup>
              <vxe-colgroup title="网络" align="center">
                <vxe-column
                  field="level1NetworkCountNum"
                  title="数量"
                  align="center"
                ></vxe-column>
                <vxe-column
                  field="level1NetworkCountTime"
                  title="持续时间"
                  align="center"
                ></vxe-column>
              </vxe-colgroup>
            </vxe-colgroup>
            <vxe-colgroup
              title="二级告警未清除数量/累积持续时长(小时)"
              align="center"
            >
              <vxe-colgroup title="计算" align="center">
                <vxe-column
                  field="level2ServerCountNum"
                  title="数量"
                  align="center"
                ></vxe-column>
                <vxe-column
                  field="level2ServerCountTime"
                  title="持续时间"
                  align="center"
                ></vxe-column>
              </vxe-colgroup>
              <vxe-colgroup title="存储" align="center">
                <vxe-column
                  field="level2StorageCountNum"
                  title="数量"
                  align="center"
                ></vxe-column>
                <vxe-column
                  field="level2StorageCountTime"
                  title="持续时间"
                  align="center"
                ></vxe-column>
              </vxe-colgroup>
              <vxe-colgroup title="网络" align="center">
                <vxe-column
                  field="level2NetworkCountNum"
                  title="数量"
                  align="center"
                ></vxe-column>
                <vxe-column
                  field="level2NetworkCountTime"
                  title="持续时间"
                  align="center"
                ></vxe-column>
              </vxe-colgroup>
            </vxe-colgroup>
            <vxe-colgroup
              title="三级告警未清除数量/累积持续时长(小时)"
              align="center"
            >
              <vxe-colgroup title="计算" align="center">
                <vxe-column
                  field="level3ServerCountNum"
                  title="数量"
                  align="center"
                ></vxe-column>
                <vxe-column
                  field="level3ServerCountTime"
                  title="持续时间"
                  align="center"
                ></vxe-column>
              </vxe-colgroup>
              <vxe-colgroup title="存储" align="center">
                <vxe-column
                  field="level3StorageCountNum"
                  title="数量"
                  align="center"
                ></vxe-column>
                <vxe-column
                  field="level3StorageCountTime"
                  title="持续时间"
                  align="center"
                ></vxe-column>
              </vxe-colgroup>
              <vxe-colgroup title="网络" align="center">
                <vxe-column
                  field="level3NetworkCountNum"
                  title="数量"
                  align="center"
                ></vxe-column>
                <vxe-column
                  field="level3NetworkCountTime"
                  title="持续时间"
                  align="center"
                ></vxe-column>
              </vxe-colgroup>
            </vxe-colgroup>
          </vxe-colgroup>
        </vxe-table>
      </div>
    </div>
  </div>
</template>

<script>
import modDate from '@/components/modDate/modDate'
import { formatDate } from '@/utils'
import {
  getAlarmTableAPI,
  getAlarmAvgAPI,
  uploadAlarmAPI,
  tableDataHandle
} from '@/api/monitor/alarm'
export default {
  name: 'alarmStay',
  components: { modDate },
  data () {
    return {
      isFileUpload: false,
      selectedDate: '',
      showDate: false,
      t_tableData: [],
      t_columns: [
        {
          colKey: 'index',
          title: '序号',
          width: '10%'
          // foot: () => <b style="font-weight: bold">Top10告警总数：</b>
        },
        {
          colKey: 'name',
          title: '告警名称',
          width: '30%'
          // foot: () => (
          //   <b style="font-weight: bold">
          //     {this.t_tableData.reduce((pre, cur) => pre + cur.score, 0)}
          //   </b>
          // )
        },
        {
          colKey: 'alarmCount',
          title: '告警数量',
          width: '15%'

          // foot: () => <b style="font-weight: bold">近日差异总数：</b>
        },
        {
          colKey: 'changeValue',
          title: '近日差异',
          width: '15%',
          cell: (_h, { row }) => {
            if (row.changeValue === 0) return 0
            return (
              <div>
                {row.changeValue > 0 ? (
                  <div>
                    <p style="color:#3fb950">+{row.changeValue}</p>
                  </div>
                ) : (
                  <div>
                    <p style="color:#f51414">{row.changeValue}</p>
                  </div>
                )}
              </div>
            )
          }
        },
        {
          colKey: 'resourcePoolTop',
          title: '告警资源池Top',
          width: '30%',
          cell: (h, { row }) => {
            return (
              <t-popup content={row.resourcePoolTop}>
                <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {row.resourcePoolTop}
                </div>
              </t-popup>
            )
          }
        }
      ],
      avgDataBack: {
        avgTime: 0,
        hostTypeMsg: { alx: '', zx: '', hw: '' },
        id: '',
        level1Count: 0,
        level2Count: 0,
        level3Count: 0,
        networkAvailability: 0.0,
        serverAvailability: 0.0,
        storageAvailability: 0.0,
        unclearedCountMsg: {},
        summaryA: '',
        summaryValuationValue: '',
        dateLimit: 'xxxx-xx-xx至xxxx-xx-xx'
      },
      avgData: {
        avgTime: 0,
        hostTypeMsg: {},
        id: '',
        level1Count: 0,
        level2Count: 0,
        level3Count: 0,
        networkAvailability: 0.0,
        serverAvailability: 0.0,
        storageAvailability: 0.0,
        unclearedCountMsg: {},
        summaryA: '',
        summaryValuationValue: '',
        dateLimit: ''
      },
      eventDate: {},
      lastDay: 0,
      days: new Date().getDate() - 1,
      tableData: [],
      tableTile: '网络云运行情况',
      files: [],
      alarmCountTop: {}
    }
  },
  watch: {
    selectedDate: {
      // 监听值变化，及时更新
      handler (newval) {
        if (newval) {
          this.handleData(newval)
          this.getAvgData(newval)
          this.getTableData(newval)
        }
      },
      deep: true
    }
  },
  created () {
    const d = new Date()
    this.selectedDate = formatDate(
      `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
    )
  },
  mounted () {},
  methods: {
    handleData (time) {
      tableDataHandle({ time }).then((res) => {
        if (res.data.code === 0) {
          console.log(res.data.data)
          const result = JSON.parse(res.data.data.timeAvg.alarmCountTop)
          this.alarmCountTop = result
          if (!result) return
          // 数组转对象遍历
          this.t_tableData = Object.values(result.alarmTop).map(
            (item, index) => {
              // let temValue = item.changeValue
              // temValue = temValue + '\t近期时间' + item.comparisonTime
              // console.log(item)
              return {
                index: 'top' + (index + 1),
                // 告警名称
                name: item.alarmName,
                // 次数统计
                alarmCount: item.alarmCount,
                // 近日差异
                changeValue: item.changeValue,
                resourcePoolTop: Object.values(item.resourcePoolTop).join('；')
              }
            }
          )
          // this.t_columns[this.t_columns.length - 1].title += '\n' + '(' + this.t_tableData[0].comparisonTime + ')'
          this.t_columns[this.t_columns.length - 2].title = () => {
            return (
              <div>
                近日差异
                <br />
                {this.alarmCountTop.comparisonTime}
              </div>
            )
          }
        }
      })
    },
    handleShowDate () {
      this.showDate = !this.showDate
      // 获取ref=t_table的长度
      const tableHeight = this.$refs.t_table.$el.clientHeight
      const tableWidth = this.$refs.t_table.$el.clientWidth
      // console.log(tableHeight, tableWidth)
      this.$refs.dateToggle.style.height = +tableHeight + 10 + 'px'
      this.$refs.dateToggle.style.width = tableWidth + 'px'
    },
    changeDate: function (date) {
      // console.log(date)
      this.selectedDate = date
    },
    getAvgData: function (date) {
      return new Promise(() => {
        getAlarmAvgAPI({ time: date })
          .then((response) => {
            const { data } = response
            if (data.code === 0) {
              if (data.data) {
                this.avgData = data.data
                this.formatData(this.avgData)
              } else {
                this.avgData = this.avgDataBack
                this.eventDate = {}
                this.$message.error('无数据')
                this.t_tableData = []
              }
              this.updateTableTile(this.selectedDate)
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch((error) => {
            this.$message.error(error)
          })
      })
    },
    formatData: function (data) {
      this.avgData.level1Count = (data.level1Count / 60 / 60).toFixed(2)
      this.avgData.level2Count = (data.level2Count / 60 / 60).toFixed(2)
      this.avgData.level3Count = (data.level3Count / 60 / 60).toFixed(2)
      this.avgData.avgTime = data.avgTime.toFixed(4)
      if (this.avgData.avgTime > 0.07) {
        // 超标
        this.avgData.summaryA = '，已超标'
        this.avgData.summaryValuationSpan = ''
      } else {
        // 计算
        let a = 0
        if (this.avgData.avgTime > 0) {
          a = (0.07 / this.avgData.avgTime) * this.days - this.days
        }
        this.avgData.summaryA =
          '，以当前增速，' + a.toFixed(2) + '天后将超标。'
        if (this.lastDay - this.days >= a.toFixed(0)) {
          this.avgData.summaryValuationValue = '高'
        } else if (a > 0) {
          this.avgData.summaryValuationValue = '低'
        }
      }
      this.avgData.hostTypeMsg = JSON.parse(data.hostTypeMsg)

      if (this.avgData.unclearedCountMsg) {
        this.eventDate = {}
        const eventDate = JSON.parse(this.avgData.unclearedCountMsg)
        Object.keys(eventDate).forEach((key) => {
          this.$set(this.eventDate, key, eventDate[key])
        })
      } else {
        this.$set(this.eventDate, {})
      }
    },
    getTableData: function (date) {
      const form = {
        page: 1,
        limit: 10,
        time: date
      }
      return new Promise(() => {
        getAlarmTableAPI(form)
          .then((response) => {
            const { data } = response
            if (data.code === 0) {
              if (data.data) {
                this.tableData = data.data
              } else {
                this.tableData = []
                this.eventDate = {}
                this.$message.error('无数据')
              }
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch((error) => {
            this.$message.error(error)
          })
      })
    },
    updateTableTile: function (date) {
      const split = date.split('-')
      let year = split[0]
      let month = split[1] - 1
      const day = split[2]
      if (month === 0) {
        month = 12
        year -= 1
      }
      this.avgData.dateLimit = year + '-' + month + '-26至' + date
      this.lastDay = new Date(split[0], split[1], 0).getDate()
      // 计算多少天后要超标 取值要从上个月26号开始到统计日期相隔的天数
      this.days = parseInt(day) + (new Date(year, month, 0).getDate() - 26)
      this.tableTile =
        '网络云运行情况（' +
        this.avgData.dateLimit +
        '）--告警来源于集团故障中心'
    },
    requestSuccessMethod (file) {
      // console.log(file, file.raw)
      const formData = new FormData()
      formData.append('file', file.raw)
      formData.append('filename', file.name)
      return new Promise(() => {
        uploadAlarmAPI(formData)
          .then((response) => {
            const { data } = response
            if (data.code === 0) {
              this.$message.success(data.data)
            } else {
              this.$message.error(data.msg)
            }
            this.isFileUpload = false
          })
          .catch((error) => {
            this.$message.error(error.msg)
            this.isFileUpload = false
          })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.source-main-row-style {
  border-radius: 4px;
  min-height: 34px !important;
  margin-bottom: 10px;
}
.source-main-row-font {
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 1px;
}
.source-minor-row-style {
  border-radius: 4px;
  min-height: 34px !important;
  margin-bottom: 10px;
}
.source-minor-row-font {
  font-size: 12px;
  letter-spacing: 1px;
}
.font-status {
  color: #ab2f29;
  font-size: 14px;
  font-weight: bold;
}
/deep/ .alarmStay-table .t-table--layout-fixed {
  min-height: 358px;
  font-size: 12px !important;
}
/deep/ .alarmStay-table .t-table__body {
  height: 241px;
}
/deep/ #alarm_progress .t-progress .t-progress__info {
  font-size: initial !important;
}
/deep/
  .table_progress
  .t-table__header--fixed:not(.t-table__header--multiple)
  > tr
  > th {
  padding: 0 15px !important;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
/deep/ .table_progress .t-table__footer {
  bottom: 5px;
}
/deep/ .table_progress .t-table__footer.t-table__footer--fixed {
  bottom: 8px !important;
}
/deep/ .table_progress .t-table td {
  padding: 0 15px !important;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
/deep/ .table_progress .t-table tr > th {
  padding: 0 15px !important;
  font-size: 12px;
  // 超出显示省略号
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
/deep/ .table_progress .t-table__row-full-element {
  padding: 4px !important;
}
</style>
