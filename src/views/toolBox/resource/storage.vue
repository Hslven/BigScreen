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
        @page-change="onPageChange"
        style="font-size: 12px;"
        cellEmptyContent = "-"
        class="px-8"
      >
        <template #reference_capacity="{ row }">
          {{ referenceCapacity(row.total_capacity) }}
        </template>
        <template #available_capacity="{ row }">
          <t-tag size="small" theme="danger" v-if="availableCapacity(row.total_capacity, row.allocated_capacity) <= 0">
            {{ availableCapacity(row.total_capacity, row.allocated_capacity) }}
          </t-tag>
          <span v-else>
            {{ availableCapacity(row.total_capacity, row.allocated_capacity) }}
          </span>
        </template>
      </t-table>
    </t-config-provider>
  </div>
</template>

<script>
import { storageTable } from '@/dict/columns'
import { SearchIcon } from 'tdesign-icons-vue'
import { getStoragePoolAPI } from '@/api/cmdb/HardwareResourcePool'
import globalSearch from '@/mixins/globalSearch'
export default {
  name: 'storage',
  mixins: [globalSearch],
  components: { SearchIcon },
  data () {
    return {
      sort: {},
      // 表格数据
      pagination: {
        current: 1,
        pageSize: 1000,
        total: 0,
        showJumper: true
      },
      data: [],
      columns: storageTable.columns,
      globalLocale: {
        table: {
          sortIcon: (h) => h && <mod-icon name="arrow_drop_down" size="22px" style="color: #cccccc !important" />
        }
      }
    }
  },
  mounted () {
    const postData = {
      page: this.pagination.current,
      page_size: this.pagination.pageSize,
      storage_pool_name: ''
    }
    this.getStoragePoolList(postData)
  },
  computed: {
    referenceCapacity () {
      // 求参考容量
      return function (total) {
        return Math.round(total * 0.95)
      }
    },
    availableCapacity () {
      // 求可用容量
      return function (total, allocated) {
        // 95%总容量-已分配
        return Math.round(total * 0.95) - allocated
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
    onPageChange (pageInfo) {
      this.pagination.current = pageInfo.current
      this.pagination.pageSize = pageInfo.pageSize
    },
    // 请求构件列表接口
    getStoragePoolList (pageData) {
      return new Promise((resolve, reject) => {
        getStoragePoolAPI(pageData).then(response => {
          const { data } = response
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
    }
  }
}
</script>

<style scoped>
</style>
