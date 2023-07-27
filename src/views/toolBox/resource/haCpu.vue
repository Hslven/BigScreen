<template>
  <div>
    <t-row :gutter="16">
      <t-col :span="12">
        <div class="my-6 ml-4">
          <t-input v-model="globalFilter" placeholder="全局搜索">
            <search-icon slot="prefix-icon"></search-icon>
          </t-input>
        </div>
      </t-col>
    </t-row>
    <t-config-provider :globalConfig="globalLocale">
      <t-table
        rowKey="index"
        :columns="columns"
        :data.sync="data"
        size="small"
        :sort.sync="sort"
        :pagination="pagination"
        @sort-change="sortChange"
        @data-change="dataChange"
        style="font-size: 12px;"
        cellEmptyContent = "-"
        class="px-8"
      >
        <template #ha_name="{ row }">
          <div class="h6">
            <a class="table-main-font" style="color: #242e42;cursor: pointer;text-decoration: none;" @click="rowDblclick(row)">{{ row.ha_name|| '-' }}</a>
          </div>
        </template>
        <template #reference_capacity="{ row }">
          {{ referenceCapacity(row.cpu_total_capacity) }}
        </template>
        <template #available_capacity="{ row }">
          <t-tag size="small" theme="danger"  v-if="availableCapacity(row.cpu_total_capacity, row.cpu_used_capacity, row.cpu_plan_capacity) <= 0">
            {{ availableCapacity(row.cpu_total_capacity, row.cpu_used_capacity, row.cpu_plan_capacity) }}
          </t-tag>
          <span v-else>
            {{ availableCapacity(row.cpu_total_capacity, row.cpu_used_capacity, row.cpu_plan_capacity) }}
          </span>
        </template>
      </t-table>
    </t-config-provider>
    <t-dialog width="40%" :visible.sync="popSign" header="HA扩容预测计算" :cancelBtn="null" :confirm-btn="null">
      <div>
        <div class="q-pa-sm">HA名称：{{ computeData.ha_name }}</div>
          <div class="q-pa-sm">总CPU核心数(物理核)：{{ computeData.cpu_total_capacity }}</div>
          <div class="q-pa-sm">现网已用CPU核心数(物理核)：{{ computeData.cpu_used_capacity }}</div>
          <div class="cursor-pointer q-pa-sm" style="width: 300px">
            扩容需求(物理核)：
            <t-input v-model="dilatationData">
            </t-input>
          </div>
          <div class="q-pa-sm">扩容结果：<q-chip dense :color="computeDilatationCpu(computeData.cpu_used_capacity, computeData.cpu_total_capacity).status ? 'red' : 'teal'" text-color="white">
            {{ computeDilatationCpu(computeData.cpu_used_capacity, computeData.cpu_total_capacity).value }}%
          </q-chip></div>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import { cpuTable } from '@/dict/columns'
import globalSearch from '@/mixins/globalSearch'
import { SearchIcon } from 'tdesign-icons-vue'
import { getHaResourceAPI } from '@/api/cmdb/HardwareResourcePool'
export default {
  name: 'haCpu',
  mixins: [globalSearch],
  components: { SearchIcon },
  data () {
    return {
      sort: {},
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 1000,
        total: 0,
        showJumper: true
      },
      globalLocale: {
        table: {
          sortIcon: (h) => h && <mod-icon name="arrow_drop_down" size="22px" style="color: #cccccc !important" />
        }
      },
      data: [],
      columns: cpuTable.columns,
      popSign: false,
      computeData: {
        ha_name: null,
        cpu_total_capacity: null,
        cpu_used_capacity: null,
        cpu_plan_capacity: null,
        reference_capacity: null,
        available_capacity: null
      },
      dilatationData: 0
    }
  },
  mounted () {
    const postData = {
      page: this.pagination.defaultCurrent,
      page_size: this.pagination.defaultPageSize,
      ha_name: ''
    }
    this.getHaResourceList(postData)
  },
  computed: {
    referenceCapacity () {
      // 求参考容量
      return function (total) {
        return Math.round(total * 0.85)
      }
    },
    availableCapacity () {
      // 求可用容量
      return function (total, used, plan) {
        // 85%CPU - max(现网已用CPU、规划CPU)
        return Math.ceil(total * 0.85) - Math.max(used, plan)
      }
    },
    computeDilatationCpu () {
      // 求可用容量
      return function (cpuUsed, cpuTotal) {
        const res = (cpuUsed + Number(this.dilatationData)) / cpuTotal * 100
        return {
          value: res,
          status: res > 85
        }
      }
    }
  },
  methods: {
    dataChange (data) {
      this.data = data
    },
    sortChange (sort) {
      this.sort = sort
    },
    getHaResourceList (pageData) {
      return new Promise((resolve, reject) => {
        getHaResourceAPI(pageData).then(response => {
          const { data } = response
          this.loading = false
          if (data.code === 0) {
            this.data = data.data.list
            this.getInitData(this.data)
            this.pagination.current = data.data.page
            this.pagination.pageSize = data.data.page_size
            this.pagination.total = data.data.total
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },
    rowDblclick (row) {
      this.popSign = !this.popSign
      this.computeData = row
    }
  }
}
</script>

<style scoped>
</style>
