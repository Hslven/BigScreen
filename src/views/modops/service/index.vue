<template>
  <div>
    <content-header></content-header>
    <div class="bg-mod-card rounded-sm">
      <t-row :gutter="16">
        <t-col :flex="14">
          <div class="my-6 ml-4">
            <t-input v-model="globalFilter" placeholder="全局搜索">
              <search-icon slot="prefix-icon"></search-icon>
            </t-input>
          </div>
        </t-col>
        <t-col :flex="1">
          <div class="my-6 mr-4" style="float: right" v-permission="'service_add'">
            <t-button @click="isAddService = !isAddService">
              <add-icon slot="icon" />
              新建
            </t-button>
          </div>
        </t-col>
      </t-row>
      <t-table
        rowKey="index"
        :columns="columns"
        :data.sync="data"
        size="small"
        :pagination="pagination"
        @data-change="dataChange"
        style="font-size: 12px;"
        cellEmptyContent = "-"
        class="px-8"
      >
        <template #name="{ row }">
          <div class="h6">
            <a @click="editService(row)" class="table-main-font" style="cursor: pointer;text-decoration: none;">{{ row.name|| '-' }}</a>
            <p style="font-size: 12px;font-weight: 400;color: #79879c;margin: 0 0 0px !important;">{{ row.description|| '-' }}</p>
          </div>
        </template>
        <template #status="{ row }">
          <mod-status :status="row.status"></mod-status>
        </template>
        <template #output-type-slot="{ row }">
          {{ formatType(row.output.type) }}
        </template>
        <template #input="{ row }">
          <t-popup>
            <t-tag size="small" theme="primary">{{ row.input.length }}</t-tag>
            <!-- <t-space slot="content">触发元素是指触发浮层内容显示的元素</t-space> -->
            <template #content>
              <div v-for="(param, index) in row.input" v-bind:key="index">
                <t-space style="font-size: 12px">
                  <div class="mr-4">{{ param.name }}</div>
                  <div>{{ param.type }}</div>
                </t-space>
              </div>
            </template>
          </t-popup>
        </template>
        <template #createdAt="{ row }">
          {{ dateFormat(row.createdAt) }}
        </template>
        <template #operation="{ row }">
          <t-link class="pr-2" theme="primary" hover="color" v-if="isPermission('service_delete', row.permissions)" @click="deleteService(row._id, row.name)">
            删除
          </t-link>
          <t-link class="pr-2" theme="primary" hover="color" v-if="isPermission('service_auth', row.permissions)" @click="serviceAuth(row)">
            授权
          </t-link>
        </template>
      </t-table>
    </div>
    <t-dialog width="30%" :visible.sync="isShowServiceInfo" header="构件信息" :cancelBtn="null" :confirm-btn="null" :footer="false">
      <t-row :gutter="16" style="font-size: 14px" class="p-2">
        <t-col :span="2" class="pb-4">
          <div class="font-bold">名称</div>
        </t-col>
        <t-col :span="10" class="pb-4">
          <div>{{ serviceRow.name }}</div>
        </t-col>
        <t-col :span="2" class="pb-4">
          <div class="font-bold">创建者</div>
        </t-col>
        <t-col :span="10" class="pb-4">
          <div>{{ serviceRow.author }}</div>
        </t-col>
        <t-col :span="2" class="pb-4">
          <div class="font-bold">创建时间</div>
        </t-col>
        <t-col :span="10" class="pb-4">
          <div>{{ dateFormat(serviceRow.createdAt) }}</div>
        </t-col>
        <t-col :span="2" class="pb-4">
          <div class="font-bold">key</div>
        </t-col>
        <t-col :span="10" class="pb-4">
          <t-tag variant="outline" size="small" theme="primary">{{ serviceRow.key }}</t-tag>
        </t-col>
        <t-col :span="2" class="pb-4">
          <div class="font-bold">状态</div>
        </t-col>
        <t-col :span="10" class="pb-4">
          <mod-status :status="serviceRow.status"></mod-status>
        </t-col>
        <t-col :span="2" class="pb-4">
          <div class="font-bold">输出类型</div>
        </t-col>
        <t-col :span="10" class="pb-4">
          <t-tag variant="outline" size="small" theme="primary">{{ serviceRow.output ? serviceRow.output.type : '' }}</t-tag>
        </t-col>
        <t-col :span="2" class="pb-4">
          <div class="font-bold">输入参数</div>
        </t-col>
        <t-col :span="10" class="pb-4">
          <div v-if="serviceRow.input && serviceRow.input.length !== 0">
              <div style="display: flex; flex-direction: row; flex-wrap: wrap">
                <div
                    v-for="(item, index) in serviceRow.input"
                    :key='index + "12"'>
                  <div style="cursor:pointer;padding: 4px 0px; margin-right: 8px">
                    <div class="bg-mod-primary" style="color: white;display: inline-block; padding: 2px 6px;border: 1px solid rgba(22, 93, 255, 1);border-radius: 2px 0px 0px 2px; font-size: 12px">{{ item.name }}
                    </div>
                    <div style="; font-size: 12px;background-color: white;color: rgba(22, 93, 255, 1);border: 1px solid rgba(22, 93, 255, 1);border-radius: 0px 2px 2px 0px;display: inline-block;padding: 2px 6px;border: 1px solid rgba(22, 93, 255, 1)">
                      {{ item.type }}
                      <span v-if="item.tag">
                      : {{ item.tag }}
                    </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </t-col>
        <t-col :span="2" class="pb-4">
          <div class="font-bold">描述</div>
        </t-col>
        <t-col :span="10" class="pb-4">
          <div>{{ serviceRow.description }}</div>
        </t-col>
      </t-row>
    </t-dialog>
    <t-dialog :destroyOnClose="true" :closeOnOverlayClick="false" :closeOnEscKeydown="false" width="30%" :visible.sync="isAddService" header="新增构件" :cancelBtn="null" :confirm-btn="null" :footer="false">
      <add-service @refreshServices="getServiceList" :isAddService.sync="isAddService"></add-service>
    </t-dialog>
    <t-dialog :destroyOnClose="true" width="40%" :visible.sync="isAuthService" header="构件授权" :cancelBtn="null" :confirm-btn="null" :footer="false">
      <auth-service v-if="isAuthService" :service-row="serviceRow" :isAuthService.sync="isAuthService"></auth-service>
    </t-dialog>
  </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'
import ModStatus from '@/components/modComp/modStatus'
import AddService from './addService'
import { formatterDate } from '@/utils/index'
import { serviceTable } from '@/dict/columns'
import { getServiceListApi, deleteServiceAPI } from '@/api/modServer/service'
import AuthService from './authService'
import globalSearch from '@/mixins/globalSearch'
import { SearchIcon, AddIcon } from 'tdesign-icons-vue'
import { serviceInputTypeOptions } from '../utils/type'
export default {
  name: 'index',
  mixins: [globalSearch],
  components: {
    AddService,
    AuthService,
    ContentHeader,
    SearchIcon,
    AddIcon,
    ModStatus
  },
  data () {
    return {
      isAddService: false,
      isShowServiceInfo: false,
      isAuthService: false,
      // 头部组件数据
      filter: '',
      // 表格数据
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 12,
        total: 0,
        showJumper: true
      },
      data: [],
      columns: serviceTable.columns,
      request_page: {
        page: 1,
        page_size: 400
      },
      serviceRow: {},
      author: this.$store.getters.getInfo.userName
    }
  },
  mounted () {
    this.getServiceList()
  },
  computed: {
    formatType () {
      return function (type) {
        const typeDict = {}
        serviceInputTypeOptions.forEach(item => {
          typeDict[item.value] = item.label
        })
        return typeDict[type]
      }
    },
    dateFormat () {
      // 格式化时间
      return function (date) {
        return formatterDate(date)
      }
    },
    isPermission () {
      // 判断是否有权限
      return function (sign, data) {
        let permission = false
        data.forEach((item) => {
          if (item.element_id === sign) {
            permission = true
          }
        })
        return permission
      }
    }
  },
  methods: {
    dataChange (data) {
      this.data = data
    },
    getServiceList () {
      return new Promise((resolve, reject) => {
        getServiceListApi(this.request_page).then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.data = data.data.list
            this.getInitData(this.data)
            this.pagination.total = this.data.length
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    // 删除构件事件
    deleteService (Id, name) {
      const confirmDia = this.$dialog.confirm({
        header: '删除构件',
        theme: 'warning',
        body: `是否确定删除构件: ${name}`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        onConfirm: ({ e }) => {
          return new Promise((resolve, reject) => {
            deleteServiceAPI(Id).then(response => {
              const { data } = response
              if (data.status === 'success') {
                this.$message.success('删除成功')
                this.getServiceList()
                confirmDia.destroy()
              } else {
                this.$message.error(data.msg)
              }
            }).catch(error => {
              this.$message.error(error.response.data.msg)
            })
          })
        },
        onClose: ({ e, trigger }) => {
          confirmDia.hide()
        }
      })
    },
    serviceAuth (row) {
      this.isAuthService = !this.isAuthService
      this.serviceRow = row
    },
    editService (row) {
      this.isShowServiceInfo = !this.isShowServiceInfo
      this.serviceRow = row
    }
  }
}
</script>

<style scoped>
</style>
