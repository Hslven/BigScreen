<template>
  <div>
    <content-header />
    <div class="bg-mod-card text-mod-body">
      <t-row>
        <t-col flex="auto">
          <div class="m-4">
            <t-input v-model="globalFilter" placeholder="全局搜索">
              <search-icon slot="prefix-icon"></search-icon>
            </t-input>
          </div>
        </t-col>
        <t-col flex="200px">
          <t-space class="mt-4">
            <t-button variant="outline" @click="addRecord" class="mr-4">
              添加处理记录
            </t-button>
            <t-button variant="outline" @click="isSelectedPool = true" class="mr-4">
              选择资源池
            </t-button>
            <t-button variant="outline" @click="isDownload = true" class="mr-4">
              数据导出
            </t-button>
            <t-dialog :visible.sync="isSelectedPool" header="选择资源池" :cancelBtn="null" @confirm="changePools">
              <t-checkbox-group v-model="poolGroup" :options="poolList" />
            </t-dialog>
            <t-dialog :visible.sync="isDownload" header="数据导出" :cancelBtn="null" @confirm="downloadEvent">
              <div class="mt-2">选择日期：</div>
              <t-date-picker format="YYYYMMDD" v-model="dowmloadForm.date" :firstDayOfWeek="3" :inputProps="{ inputClass: 'test-inputClass' }" />
              <div class="mt-2">选择资源池：</div>
              <t-checkbox-group v-model="dowmloadForm.pools" :options="poolList" />
            </t-dialog>
          </t-space>
        </t-col>
      </t-row>
      <div>
        <t-table
          rowKey="check_id"
          :columns="columns"
          :data="data"
          size="small"
          :pagination="pagination"
          style="font-size: 12px;"
          @select-change="rehandleSelectChange"
          table-layout="fixed"
          class="px-8"
        >
          <template #check_name="{ row }">
            <div>
              <a style="font-weight: 600">{{ row.check_name }}</a>
              <p style="font-size: 12px;font-weight: 400;color: #79879c;margin: 0 0 0px !important;">{{ row.check_desc }}</p>
            </div>
          </template>
          <template #check_sum="{ row }">
            <span style="cursor: pointer;font-size: 12px">{{ row.check_sum[row.check_sum.length - 1] }}</span>
          </template>
          <template #check_error_datas="{ row }">
            <span style="cursor: pointer;font-size: 12px">{{ row.check_error_datas[row.check_error_datas.length - 1] }}</span>
          </template>
          <template #dataFluc="{ row }">
            <span
                style="cursor: pointer;font-size: 12px; padding: 2px 4px; border-radius: 5px"
                :style="{
                    color: row.dataFluc > 0 ? '#f32f53' : row.dataFluc < 0 ? '#09BD3C' : '#2B84E7',
                    background: row.dataFluc > 0 ? 'rgba(243,47,83,0.2)' : row.dataFluc < 0 ? 'rgba(9,189,60,0.2)' : 'rgba(43,132,231,0.2)'
                  }"
              >
              <arrow-up-icon v-show="row.dataFluc > 0"></arrow-up-icon>
              <arrow-down-icon v-show="row.dataFluc < 0"></arrow-down-icon>
                  {{ Math.abs(row.dataFluc) }}
                </span>
          </template>
          <template #check_dates="{ row }">
            <span style="cursor: pointer;font-size: 12px">{{ row.check_dates[row.check_dates.length - 1] }}</span>
          </template>
          <template #operation="{ row }">
            <history-icon @click="showRecord(row)"></history-icon>
          </template>
        </t-table>
      </div>
    </div>
    <t-dialog :visible.sync="is_open" header="数据处理情况记录" :cancelBtn="null" :confirm-btn="getConfirmBtn">
      <t-form
          ref="formRef"
          :data="form"
          @submit="onSubmit"
          class="p-4"
          labelAlign="top"
      >
        <t-form-item label="处理人" name="processor">
          <t-input v-model="form.processor" placeholder="请输入处理人"></t-input>
        </t-form-item>
        <t-form-item label="处理内容" name="content">
          <t-input v-model="form.content" placeholder="请输入处理内容"></t-input>
        </t-form-item>
        <t-form-item label="备注" name="remarks">
          <t-input v-model="form.remarks" placeholder="请输入备注"></t-input>
        </t-form-item>
      </t-form>
    </t-dialog>
    <t-dialog width="80%" :visible.sync="is_show" header="历史数据处理情况" :cancelBtn="null" :confirm-btn="null">
      <t-table
          rowKey="check_id"
          :columns="recordColumns"
          :data="recordData"
          size="small"
          :pagination="recordPagination"
          style="font-size: 12px;"
          table-layout="fixed"
          class="px-8"
        >
          <template #create_date="{ row }">
            <div>{{ dateData(row.create_date) }}</div>
          </template>
        </t-table>
    </t-dialog>
  </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'
import { cloneDeep } from 'lodash'
import { formatterDate } from '@/utils/index'
import { SearchIcon, ArrowUpIcon, ArrowDownIcon, HistoryIcon } from 'tdesign-icons-vue'
import globalSearch from '@/mixins/globalSearch'
import dialogSubmit from '@/mixins/dialogSubmit'
import {
  getCheckDataApi,
  addCheckHistoryRecordApi,
  getCheckHistoryRecordApi,
  downloadCheckDataApi,
  getPoolInfosApi
} from '@/api/cmdb/cmdb_data_check'

function parsePoolInfo (poolData) {
  const columnList = [
    { label: '全选', checkAll: true }
  ]
  poolData.forEach(item => {
    const columnDict = {}
    columnDict.label = item.name
    columnDict.value = item.label
    columnList.push(cloneDeep(columnDict))
  })
  return columnList
}
export default {
  name: 'modelCheck',
  mixins: [globalSearch, dialogSubmit],
  components: {
    ContentHeader,
    SearchIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    HistoryIcon
  },
  data () {
    return {
      is_open: false,
      isSelectedPool: false,
      isDownload: false,
      is_show: false,
      selected: [],
      poolList: [],
      poolGroup: [],
      dowmloadForm: {
        date: '',
        pools: []
      },
      // 初始化分页信息
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 20,
        total: 0
      },
      recordPagination: {
        defaultCurrent: 1,
        defaultPageSize: 20,
        total: 0
      },
      // 表格列名字段
      columns: [
        {
          colKey: 'row-select',
          type: 'multiple',
          width: 50
        },
        {
          colKey: 'check_name',
          title: '检查项',
          align: 'left',
          width: '450',
          ellipsis: {
            theme: 'light',
            placement: 'bottom'
          }
        },
        { colKey: 'model_name', title: '模型名', align: 'center' },
        { colKey: 'check_sum', title: '模型数据总量', align: 'center' },
        { colKey: 'check_error_datas', align: 'center', title: '违规个数' },
        { colKey: 'dataFluc', title: '违规数据波动', align: 'center' },
        { colKey: 'error_duration', title: '违规时长', align: 'center' },
        { colKey: 'check_dates', title: '日期', align: 'center' },
        { colKey: 'operation', align: 'center', title: '历史数据处理情况' }
      ],
      recordColumns: [
        {
          colKey: 'create_date',
          title: '创建时间',
          align: 'left'
        },
        { colKey: 'processing_content', title: '处理内容', align: 'center', ellipsis: { theme: 'light', placement: 'bottom' }, width: '300' },
        { colKey: 'processor', title: '处理人', align: 'center' },
        { colKey: 'remark', align: 'center', title: '备注' },
        { colKey: 'pool_tag', title: '所属资源池', align: 'center' }
      ],
      data: [],
      form: {},
      recordData: []
    }
  },
  computed: {
    dateData () {
      return function (date) {
        return formatterDate(date)
      }
    }
  },
  mounted () {
    this.getPoolsListData()
  },
  methods: {
    getPoolsListData () {
      return new Promise((resolve, reject) => {
        getPoolInfosApi().then(response => {
          const { data } = response
          if (data.code === 0) {
            this.poolList = parsePoolInfo(cloneDeep(data.data))
            data.data.forEach((item) => {
              this.poolGroup.push(item.label)
            })
            this.getCheckData({ pools: this.poolGroup, model_name: '' })
          } else {
            this.$message.error(data)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    // 获取CMDB指定资源池下各模型违规数据统计结果
    getCheckData (params) {
      getCheckDataApi(params).then(response => {
        const { data } = response
        if (data.code === 0) {
          data.data.forEach((item) => {
            item.check_data && item.check_data.forEach((checkItem, index) => {
              const modelData = {
                model_id: item.model_id,
                model_name: item.model_name,
                check_desc: checkItem.check_desc,
                check_id: checkItem.check_id,
                check_sum: checkItem.check_sum,
                check_name: checkItem.check_name,
                check_error_datas: checkItem.check_error_datas,
                dataFluc: checkItem.check_error_datas.length <= 1 ? 0 : checkItem.check_error_datas[checkItem.check_error_datas.length - 1] - checkItem.check_error_datas[checkItem.check_error_datas.length - 2],
                check_dates: checkItem.check_dates,
                error_duration: checkItem.error_duration
              }
              this.data.push(cloneDeep(modelData))
            })
          })
          this.getInitData(this.data)
          this.pagination.total = this.data.length
          this.isSelectedPool = false
        } else {
          this.$message.error(data.message)
        }
      }).catch(error => {
        this.$message.error(error)
      })
    },
    downloadEvent () {
      return new Promise((resolve, reject) => {
        downloadCheckDataApi(this.dowmloadForm).then(response => {
          const blob = new Blob([response.data], {
            type: 'application/vnd.ms-excel'
          })
          const fileNameEncode = response.headers['content-disposition'].split('filename=')[1] // 构造一个blob对象来处理数据，并设置文件类型
          const fileName = decodeURIComponent(fileNameEncode)
          if (window.navigator.msSaveOrOpenBlob) { // 兼容IE10
            navigator.msSaveBlob(blob, fileName)
          } else {
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(blob) // 创建新的URL表示指定的blob对象, 并指定a标签的指定下载链接
            link.download = fileName // 指定下载文件名
            link.click() // 触发下载
            window.URL.revokeObjectURL(link.href) // 释放URL对象
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    dataChange (data) {
      this.data = data
    },
    rehandleSelectChange (value, { selectedRowData }) {
      this.selected = selectedRowData
    },
    getSelectedString () {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.data.length}`
    },
    addRecord () {
      if (this.selected.length) {
        this.is_open = !this.is_open
        return
      }
      this.$message.warning('请选择检查项')
    },
    showRecord (item) {
      return new Promise((resolve, reject) => {
        getCheckHistoryRecordApi({ check_id: item.check_id, model_name: item.model_name, pools: this.poolGroup }).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.recordData = data.data
            this.recordPagination.total = this.recordData.length
            this.is_show = !this.is_show
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    onSubmit () {
      this.is_open = !this.is_open
      this.form.check_id = []
      this.selected.forEach((item) => {
        this.form.check_id.push(item.check_id)
      })
      this.form.pools = this.poolGroup
      return new Promise((resolve, reject) => {
        addCheckHistoryRecordApi(this.form).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.$message.success(data.message)
            this.selected = []
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },
    changePools () {
      this.data = []
      this.getCheckData({ pools: this.poolGroup, model_name: '' })
    }
  }
}
</script>

<style scoped>
/deep/ .t-checkbox {
  margin: 4px !important
}
</style>
