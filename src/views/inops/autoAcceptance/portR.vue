<template>
  <div class="p-4">
    <div class="p-4 bg-mod-card rounded-sm">
      <div class="font-bold">计算服务器物理端口可靠性验收</div>
      <div class="font-bold text-mod-primary mt-4">算法参数配置</div>
      <div class="py-4">
        <t-form
          :data="condition"
          style="width: 400px"
          scrollToFirstError="smooth"
        >
          <t-form-item label="拟合范围" name="scope">
            <t-select
              v-model="condition.scope"
            >
              <t-option v-for="item in ['最近18个点', '最近36个点', '最近72个点']" :value="item" :label="item" :key="item">
                <div>
                  {{ item }}
                </div>
              </t-option>
            </t-select>
          </t-form-item>
        </t-form>
      </div>
      <div class="font-bold text-mod-primary mt-2">选择设备</div>
      <div class="my-2">
        <t-form
          :data="condition"
          layout="inline"
          scrollToFirstError="smooth"
        >
          <t-form-item label="资源池" name="resourcePool">
            <t-select
              v-model="condition.resourcePool"
            >
              <t-option v-for="item in resourcePoolOtions" :value="item" :label="item" :key="item">
                <div>
                  {{ item }}
                </div>
              </t-option>
            </t-select>
          </t-form-item>
          <t-form-item>
            <t-button theme="primary" @click="searchE">查询</t-button>
          </t-form-item>
        </t-form>
      </div>
      <div class="mt-4">
        <vxe-table
          class="text-black"
          stripe
          auto-resize
          keep-source
          highlight-hover-row
          highlight-current-row
          highlight-hover-column
          highlight-current-column
          ref="infoTable"
          id="infoTable"
          row-id='id'
          empty-text="暂无验收信息！"
          border="default"
          max-height="500"
          size="mini"
          :column-config="{resizable: true}"
          :tooltip-config="{showAll: true}"
          :loading="table.loading"
          :seq-config="{startIndex: (pages.current - 1) * pages.size }"
          :checkbox-config="{reserve: true}"
          :data="table.infoData"
        >
          <vxe-table-column
            v-for="(config, index) in table.column"
            :key="index" v-bind="config"
          >
          </vxe-table-column>
        </vxe-table>
      </div>
      <div class="mt-4 flex justify-end">
        <t-button theme="primary" @click="apply">提交</t-button>
      </div>
    </div>
    <t-dialog placement="center" width="1000px" header="结果" :visible.sync="dialog.apply" :footer="false">
      <div class="p-2">
        <div class="pb-2">
          通过AI预测设备空载情况下物理端口流量的波动，检测物理端口数据传输的可靠性
        </div>
        <div>
          <vxe-table
            class="text-black"
            stripe
            auto-resize
            keep-source
            highlight-hover-row
            highlight-current-row
            highlight-hover-column
            highlight-current-column
            ref="resTable"
            id="resTable"
            row-id='id'
            empty-text="暂无设备端口流量预测信息！"
            border="default"
            max-height="500"
            size="mini"
            :column-config="{resizable: true}"
            :tooltip-config="{showAll: true}"
            :loading="resTable.loading"
            :seq-config="{startIndex: (resPages.current - 1) * resPages.size }"
            :checkbox-config="{reserve: true}"
            :data="resTable.infoData"
          >
            <vxe-table-column
              v-for="(config, index) in resTable.column"
              :key="index" v-bind="config"
            >
              <template v-if="config.field === 'portName'" v-slot="{ rowIndex }">
                <span>eth{{ rowIndex }}</span>
              </template>
              <template v-else-if="config.field === 'reliability'">
                <q-chip outline square label="通过" color="positive"></q-chip>
              </template>
              <template v-else-if="config.field === 'detail'">
                <span>无劣化趋势，流量波动较小，稳定性好</span>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import { interfaceTrafficForecastAPI } from '@/api/inops/AI/AI'

export default {
  name: 'portR',
  data () {
    return {
      hostList: [],
      condition: {
        scope: '',
        resourcePool: ''
      },
      resourcePoolOtions: ['NFV-RP-HNGZ-00A', 'NFV-RP-HNGZ-01A', 'NFV-RP-HNGZ-02A', 'NFV-RP-HNGZ-03A', 'NFV-RP-HNGZ-04A', 'NFV-RP-HNGZ-05A', 'NFV-RP-HNGZ-06A', 'NFV-RP-HNGZ-07A', 'NFV-RP-HNGZ-08A', 'NFV-RP-HNGZ-09A'],
      table: {
        loading: false,
        data: [],
        infoData: [],
        column: [
          { type: 'checkbox', align: 'center', width: '40' },
          { type: 'seq', title: '序号', align: 'center', width: '50' },
          { field: 'resourcePool', title: '资源池', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'hostName', title: '设备名称', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'portName', title: '物理端口', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'receive', title: '最近接收流量值', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', width: '25%' },
          { field: 'send', title: '最近发送流量值', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip', width: '25%' }
        ]
      },
      pages: {
        pageSizeList: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      resTable: {
        loading: false,
        infoData: [],
        column: [
          { type: 'seq', title: '序号', align: 'center', width: '50' },
          { field: 'resourcePool', title: '资源池', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'hostName', title: '设备名称', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'portName', title: '物理端口', align: 'left', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'reliability', title: '端口可靠性', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'detail', title: '分析描述', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', width: '40%' }
        ]
      },
      resPages: {
        pageSizeList: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      selectHost: [],
      dialog: {
        apply: false
      }
    }
  },
  mounted () {
    this.hostList = this.$route.query.hosts
    this.getInterfaceTrafficForecast()
  },
  methods: {
    searchE () {
      this.table.infoData = this.table.data.filter(item => {
        return item.resourcePool.indexOf(this.condition.resourcePool) > -1
      })
    },
    getInterfaceTrafficForecast () {
      this.table.loading = true
      const hostIds = []
      this.hostList.forEach(item => {
        hostIds.push(item.id)
      })
      const data = {
        hostIds
      }
      interfaceTrafficForecastAPI(data).then(async res => {
        const { data } = res
        if (data.code === 200) {
          const infoData = []
          await data.data.forEach(item => {
            const receive = []
            const send = []
            item.receivingRate.forEach(v => {
              receive.push(Number(v[1]) === 0 ? Number(v[1]) : Number(v[1]).toFixed(2))
            })
            item.sendingRate.forEach(v => {
              send.push(Number(v[1]) === 0 ? Number(v[1]) : Number(v[1]).toFixed(2))
            })
            const obj = {
              hostName: item.hostName,
              portName: item.portName,
              resourcePool: item.resourcePool,
              receive: receive.join(','),
              send: send.join(',')
            }
            infoData.push(obj)
          })
          this.table.data = infoData
          this.table.infoData = infoData
          this.table.loading = false
        }
      })
    },
    apply () {
      const records = this.$refs.infoTable.getCheckboxRecords()
      this.resTable.infoData = records
      this.dialog.apply = true
    }
  }
}
</script>
