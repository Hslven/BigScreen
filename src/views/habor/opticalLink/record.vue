<template>
  <div class="p-4">
    <div class="bg-mod-card rounded-sm p-4">
      <t-form
        :data="condition"
        labelWidth="calc(2em + 50px)"
        layout="inline"
        ref="form"
        @submit="onSubmit"
        @reset="onReset"
        scrollToFirstError="smooth"
      >
        <t-form-item label="资源池名称:" name="resourcePool">
          <t-select v-model="condition.resourcePool" clearable filterable :options="resourcePoolOptions">
          </t-select>
        </t-form-item>
        <t-form-item label="链路类型:" name="type">
          <t-select v-model="condition.type" clearable filterable :options="[
            { label: '所有', value: 'All' },
            { label: '10GE', value: '10GE' },
            { label: '25GE', value: '25GE' },
            { label: '40GE', value: '40GE' },
            { label: '100GE', value: '100GE' }
          ]">
          </t-select>
        </t-form-item>
        <t-form-item label="设备名:" name="hostName">
          <t-input
              v-model="condition.hostName"
            ></t-input>
        </t-form-item>
        <t-form-item label="端口名:" name="portName">
          <t-input
              v-model="condition.portName"
            ></t-input>
        </t-form-item>
        <t-form-item label="对端设备名:" name="toHostName">
          <t-input
              v-model="condition.toHostName"
            ></t-input>
        </t-form-item>
        <t-form-item label="对端端口名:" name="toPortName">
          <t-input
              v-model="condition.toPortName"
            ></t-input>
        </t-form-item>
        <t-form-item label="故障发生时间:" name="startTime">
          <t-date-picker
            v-model="condition.startTime"
            clearable
            enableTimePicker
          />
        </t-form-item>
        <t-form-item label="故障结束时间:" name="endTime">
          <t-date-picker
            v-model="condition.endTime"
            clearable
            enableTimePicker
          />
        </t-form-item>
        <t-form-item>
          <t-space size="10px">
            <t-button theme="primary" type="submit">查询</t-button>
            <t-button theme="default" variant="base" type="reset">重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </div>
    <div class="bg-mod-card rounded-sm p-4 my-2">
      <div class="pb-4">
        <t-space>
          <t-button size="small" theme="primary" @click="onAdd">新增</t-button>
          <t-button size="small" theme="danger" @click="onDel">删除</t-button>
          <t-button size="small" theme="primary" @click="onExport" :href="url">导出</t-button>
        </t-space>
      </div>
      <div>
        <vxe-table
          auto-resize
          keep-source
          resizable
          highlight-hover-row
          highlight-hover-column
          row-id="id"
          border="inner"
          :max-height="table.maxHeight"
          size="mini"
          :empty-text="table.empty"
          :ref="table.ref"
          :checkbox-config="{ reserve: true, trigger: 'row' }"
          :loading="table.loading"
          :seq-config="{ startIndex: (pages.current - 1) * pages.size }"
          :data="table.data"
        >
          <vxe-table-column
            v-for="(config, index) in table.column"
            :key="index"
            v-bind="config"
          />
          <vxe-table-column
            title="操作"
            align="center"
            fixed="right"
            width="250"
          >
            <template v-slot="{ row }">
              <t-button size="small" theme="primary" variant="text" @click="onUpdate(row)">更新</t-button>
              <t-button size="small" theme="primary" variant="text" @click="onDetail(row)">查看详情</t-button>
              <t-button size="small" theme="danger" variant="text" @click="onDel(row.id)">删除</t-button>
            </template>
          </vxe-table-column>
        </vxe-table>
        <vxe-pager
          class="mt-2 pt-8 pb-12"
          size="mini"
          :current-page="pages.current"
          :page-size="pages.size"
          :total="pages.total"
          :page-sizes="pages.list"
          :page-count="5"
          @page-change="onPages"
        >
        </vxe-pager>
      </div>
    </div>
    <t-dialog placement="center" :visible.sync="alert" header="新增故障记录" :cancel-btn="null" :confirm-btn="getConfirmBtn">
      <t-form
        ref="formRef"
        :data="formData"
        :rules="rules"
        label-align="top"
        class="p-4"
        @submit="onFormSubmit">
          <t-form-item label="链路类型:" name="type">
            <t-select :readonly="disable" v-model="formData.type" clearable filterable :options="[
              { label: '所有', value: 'All' },
              { label: '10GE', value: '10GE' },
              { label: '25GE', value: '25GE' },
              { label: '40GE', value: '40GE' },
              { label: '100GE', value: '100GE' }
            ]">
            </t-select>
          </t-form-item>
          <t-form-item label="资源池:" name="resourcePool">
            <t-select :readonly="disable" v-model="formData.resourcePool" clearable filterable :options="resourcePoolOptions">
            </t-select>
          </t-form-item>
          <t-form-item label="设备名称:" name="hostName">
            <t-input :readonly="disable" v-model="formData.hostName"/>
          </t-form-item>
          <t-form-item label="端口名称:" name="portName">
            <t-input :readonly="disable" v-model="formData.portName"/>
          </t-form-item>
          <t-form-item label="对端设备名称:" name="toHostName">
            <t-input :readonly="disable" v-model="formData.toHostName"/>
          </t-form-item>
          <t-form-item label="对端端口名称:" name="toPortName">
            <t-input :readonly="disable" v-model="formData.toPortName"/>
          </t-form-item>
          <t-form-item label="故障发生时间:" name="occurrenceTime">
            <t-date-picker
              :disabled="disable"
              v-model="formData.occurrenceTime"
              clearable
              enableTimePicker
            />
          </t-form-item>
          <t-form-item label="发生途径:" name="discoveryPath">
            <t-textarea v-model="formData.discoveryPath"></t-textarea>
          </t-form-item>
          <t-form-item label="告警描述:" name="alarmDescription">
            <t-textarea v-model="formData.alarmDescription"></t-textarea>
          </t-form-item>
          <t-form-item label="直接原因:" name="immediateCause">
            <t-textarea v-model="formData.immediateCause"></t-textarea>
          </t-form-item>
          <t-form-item label="备件更换信息:" name="partsReplacement">
            <t-textarea v-model="formData.partsReplacement"></t-textarea>
          </t-form-item>
        </t-form>
    </t-dialog>
  </div>
</template>

<script>
import { getResourcePoolAPI } from '@/api/monitor/opticalModule'
import { signListAPI, delSignAPI, saveSignAPI, updateSignAPI } from '@/api/monitor/sign'
import { formatTime } from '@/utils/inops/dateUtils'
import dialogSubmit from '@/mixins/dialogSubmit'
import { cloneDeep } from 'lodash'
export default {
  name: 'record',
  mixins: [dialogSubmit],
  data () {
    return {
      resourcePoolOptions: [],
      condition: {
        resourcePool: '',
        type: 'All',
        hostName: '',
        portName: '',
        toHostName: '',
        toPortName: '',
        startTime: '',
        endTime: ''
      },
      url: '',
      table: {
        ref: 'record',
        empty: '暂无故障记录',
        loading: false,
        maxHeight: '600',
        // 新增
        data: [],
        column: [
          { type: 'checkbox', align: 'center', width: '40' },
          { type: 'seq', title: '序号', align: 'center', width: '50' },
          {
            field: 'resourcePool',
            title: '资源池',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip'
          },
          {
            field: 'type',
            title: '链路类型',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip'
          },
          {
            field: 'hostName',
            title: '设备名',
            align: 'left',
            showHeaderOverflow: true,
            showOverflow: 'tooltip'
          },
          {
            field: 'portName',
            title: '端口名',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip'
          },
          {
            field: 'toHostName',
            title: '设备端口名',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip'
          },
          {
            field: 'toPortName',
            title: '对端端口名',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip'
          },
          {
            field: 'occurrenceTime',
            title: '故障发生时间',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip'
          },
          {
            field: 'discoveryPath',
            title: '发生途径',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip'
          },
          {
            field: 'alarmDescription',
            title: '告警描述',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip'
          },
          {
            field: 'immediateCause',
            title: '直接原因',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip'
          },
          {
            field: 'partsReplacement',
            title: '备件更换信息',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip'
          },
          {
            field: 'operator',
            title: '操作人',
            align: 'center',
            showHeaderOverflow: true,
            showOverflow: 'tooltip'
          }
        ]
      },
      pages: {
        list: [10, 50, 100, 500, 1000, 2000, { label: '全部', value: '' }],
        total: 0,
        current: 1,
        size: 10,
        align: 'right'
      },
      formData: {
        resourcePool: '',
        type: 'All',
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
        resourcePool: [
          { required: true, message: '资源池必选', type: 'error' }
        ],
        type: [
          { required: true, message: '链路类型必选', type: 'error' }
        ],
        hostName: [
          { required: true, message: '设备名必填', type: 'error' }
        ],
        portName: [
          { required: true, message: '端口名必填', type: 'error' }
        ],
        toHostName: [
          { required: true, message: '对端设备名必填', type: 'error' }
        ],
        toPortName: [
          { required: true, message: '对端端口名必填', type: 'error' }
        ],
        occurrenceTime: [
          { required: true, message: '故障发生时间必填', type: 'error' }
        ],
        discoveryPath: [
          { required: true, message: '发生途径必填', type: 'error' }
        ],
        alarmDescription: [
          { required: true, message: '告警描述必填', type: 'error' }
        ]
      },
      formDebug: {},
      alert: false,
      disable: false,
      operationType: 'add'
    }
  },
  mounted () {
    this.getResourcePool()
    const startTime = new Date().setTime(
      new Date().getTime() - 3600 * 1000 * 24 * 30
    )
    this.condition.startTime = formatTime(startTime)
    this.condition.endTime = formatTime(new Date())
    this.getData()
  },
  methods: {
    getResourcePool () {
      getResourcePoolAPI().then((res) => {
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
    getData () {
      this.table.loading = true
      const param = {
        page: this.pages.current,
        pageSize: this.pages.size
      }
      const data = Object.assign({}, this.condition, param)
      signListAPI(data).then((r) => {
        const { data } = r
        if (data.code === 0) {
          this.table.data = data.data.records
          const { total, size, current } = data.data
          this.pages = Object.assign(this.pages, { total, size, current })
          this.pages.list[this.pages.list.length - 1].value = total
          this.table.loading = false
        } else {
          this.$message.error('数据加载失败，请联系管理员')
          this.table.loading = false
        }
      })
    },
    delData (list) {
      const str = list.join(',')
      const data = {
        ids: str
      }
      delSignAPI(data).then((r) => {
        const { data } = r
        if (data.code === 0) {
          this.$message.success('保存成功')
          this.getData()
        } else {
          this.$message.error('删除故障标记失败，请联系管理员')
        }
      })
    },
    onSubmit () {
      this.getData()
    },
    onFormSubmit ({ validateResult, firstError }) {
      if (validateResult === true) {
        if (this.operationType === 'add') {
          saveSignAPI(this.formData).then((res) => {
            const { data } = res
            if (data.code === 0) {
              this.$message.success(data.msg)
              this.alert = false
            } else {
              this.$message.error(data.msg)
            }
          }).catch(reason => this.$message.error(reason.data.msg))
        } else {
          const data = Object.assign({}, this.formData)
          data.occurrenceTime = data.occurrenceTime.replace('T', ' ')
          updateSignAPI(data).then((res) => {
            const { data } = res
            if (data.code === 0) {
              this.$message.success('已更新故障标记')
              this.alert = false
            } else {
              this.$message.error('更新故障标记失败，请联系管理员')
            }
          })
        }
      } else {
        this.$message.warning(firstError)
      }
    },
    onReset () {
      this.condition = {
        resourcePool: '',
        type: 'All',
        hostName: '',
        portName: '',
        toHostName: '',
        toPortName: '',
        startTime: '',
        endTime: ''
      }
      const startTime = new Date().setTime(
        new Date().getTime() - 3600 * 1000 * 24 * 30
      )
      this.condition.startTime = formatTime(startTime).replace(' ', 'T')
      this.condition.endTime = formatTime(new Date()).replace(' ', 'T')
    },
    onAdd () {
      this.formData = {}
      this.alert = true
      this.disable = false
      this.operationType = 'add'
    },
    onExport () {
      const records = this.$refs.record.getCheckboxRecords()
      const list = []
      records.forEach((item) => {
        list.push(item.id)
      })
      this.url = `${
        process.env.VUE_APP_BASE_URL
      }/monitor/optical/fault/export?ids=${list.join(',')}`
    },
    onPages ({ currentPage, pageSize }) {
      this.pages.current = currentPage
      this.pages.size = pageSize
      this.getData()
    },
    onUpdate (row) {
      this.formData = cloneDeep(row)
      this.disable = true
      this.alert = true
      this.operationType = 'update'
    },
    onDetail (row) {
      this.$router.push({
        path: '/monitor/analysis/detail',
        query: {
          id: row.id
        }
      })
    },
    onDel () {
      const records = this.$refs.record.getCheckboxRecords()
      const list = []
      records.forEach((item) => {
        list.push(item.id)
      })
      this.$XModal.confirm('是否确定删除该故障标记？').then((type) => {
        if (type === 'confirm') {
          this.delData(list)
        } else {
          console.log(1)
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.box
  display: grid
  grid-gap: 15px
  grid-template-columns: 1fr 1fr 1fr 1fr
/deep/ .on-left
  margin-right: 4px
</style>
