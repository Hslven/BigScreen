<template>
  <div class="p-4">
    <div class="p-4 bg-mod-card rounded-sm">
      <div class="font-bold">计算服务器性能状态验收</div>
      <div class="font-bold text-mod-primary mt-4">参数配置</div>
      <div class="py-4">
        <t-form
          :data="paramForm"
          layout="vertical"
          ref="form"
          style="width: 400px"
          scrollToFirstError="smooth"
        >
          <t-form-item label="状态时间" name="stateTime">
            <t-date-picker v-model="paramForm.stateTime" enable-time-picker allow-input clearable />
          </t-form-item>
          <t-form-item label="性能指标集" name="indicators">
            <t-select
              v-model="paramForm.indicators"
              :minCollapsedNum="2"
              multiple
            >
              <t-option v-for="item in indicatorsList" :value="item" :label="item" :key="item">
                <div>
                  {{ item }}
                </div>
              </t-option>
            </t-select>
          </t-form-item>
        </t-form>
      </div>
      <div class="font-bold text-mod-primary mt-2">验收设备</div>
      <div class="py-4">
        <t-form
          :data="condition"
          layout="inline"
          scrollToFirstError="smooth"
        >
          <t-form-item label="资源池" name="resourcePool">
            <t-input v-model="condition.resourcePool"></t-input>
          </t-form-item>
          <t-form-item label="设备名称" name="hostName">
            <t-input v-model="condition.hostName"></t-input>
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
          empty-text="暂无设备信息！"
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
          />
        </vxe-table>
      </div>
      <div class="mt-4 flex justify-end">
        <t-button theme="primary" @click="apply">提交</t-button>
      </div>
    </div>
    <t-dialog placement="center" width="1000px" header="结果" :visible.sync="dialog.apply" :footer="false">
      <div class="p-2">
        <div class="pb-2">
          通过AI能力的GBDT决策树分类匹配异常类型，实现服务器性能状态异常定位
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
            empty-text="暂无性能状态分析信息！"
            border="default"
            max-height="500"
            size="mini"
            :column-config="{ resizable: true }"
            :tooltip-config="{ showAll: true }"
            :loading="resTable.loading"
            :seq-config="{startIndex: (resPages.current - 1) * resPages.size }"
            :checkbox-config="{reserve: true}"
            :data="resTable.infoData"
          >
            <vxe-table-column
              v-for="(config, index) in resTable.column"
              :key="index" v-bind="config"
            >
              <template v-if="config.field === 'status'" v-slot="{ row }">
                <t-tag v-if="row.data.length <= 0" theme="primary">通过</t-tag>
                <t-tag v-else theme="danger">不通过</t-tag>
              </template>
            </vxe-table-column>
          </vxe-table>
        </div>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import { hostHealthInspectAPI } from '@/api/inops/AI/AI'
export default {
  name: 'pState',
  data () {
    return {
      paramForm: {
        stateTime: '',
        indicators: []
      },
      indicatorsList: [],
      condition: {
        resourcePool: '',
        hostName: ''
      },
      table: {
        loading: false,
        data: [],
        infoData: [],
        column: [
          { type: 'checkbox', align: 'center', width: '40' },
          { type: 'seq', title: '序号', align: 'center', width: '50' },
          { field: 'resourcePool', title: '所属资源池', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'hostName', title: '设备名称', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' }
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
          { type: 'checkbox', align: 'center', width: '40' },
          { type: 'seq', title: '序号', align: 'center', width: '50' },
          { field: 'resName', title: '所属资源池', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', width: '15%' },
          { field: 'deviceName', title: '设备名称', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', width: '20%' },
          { field: 'status', title: '性能状态', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip' },
          { field: 'data', title: '描述', align: 'center', showHeaderOverflow: true, showOverflow: 'tooltip', width: '45%' }
        ]
      },
      resPages: {
        pageSizeList: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      dialog: {
        apply: false
      }
    }
  },
  mounted () {
    if (this.$route.query.type === 'srv') {
      this.indicatorsList = ['宿主机CPU使用率', '宿主机内存使用率', '宿主机CPU均衡率', '宿主机内存均衡率', '硬件资源池CPU使用率', '硬件资源池CPU分配率']
    } else if (this.$route.query.type === 'dbs') {
      this.indicatorsList = ['卷时延', '硬件资源池存储池与存储集群磁盘比例', '硬件资源池逻辑卷与存储池磁盘比例']
    }
    this.initHost()
  },
  methods: {
    initHost () {
      this.table.data = this.$route.query.hosts
      this.table.infoData = this.$route.query.hosts
    },
    hostHealthInspect (data) {
      this.resTable.loading = true
      hostHealthInspectAPI(data).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.resTable.infoData = data.data
          this.resTable.loading = false
        }
      })
    },
    searchE () {
      let resList = []
      let deviceNameList = []
      if (this.condition.resourcePool === '' && this.condition.hostName === '') {
        this.table.infoData = this.table.data
      } else {
        if (this.condition.resourcePool) {
          resList = this.table.data.filter(item => {
            return item.resourcePool.indexOf(this.condition.resourcePool) > -1
          })
        }
        if (this.condition.hostName) {
          deviceNameList = this.table.data.filter(item => {
            return item.hostName.indexOf(this.condition.hostName) > -1
          })
        }
        this.table.infoData = resList.concat(deviceNameList)
      }
    },
    async apply () {
      const hostList = this.$refs.infoTable.getCheckboxRecords()
      const hostIds = []
      await hostList.forEach(item => {
        hostIds.push(item.id)
      })
      const data = {
        indicatorList: this.indicators,
        hostIds,
        queryTime: this.stateTime
      }
      this.hostHealthInspect(data)
      this.dialog.apply = true
    }
  }
}
</script>
