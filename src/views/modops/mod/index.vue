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
          <div class="my-6 mr-4" style="float: right">
            <t-button @click="isAddMod = !isAddMod">
              <add-icon slot="icon" />
              新建
            </t-button>
          </div>
        </t-col>
      </t-row>
      <t-table
        rowKey="name"
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
            <a @click="editMod(row)" class="table-main-font" style="cursor: pointer;text-decoration: none;">{{ row.name|| '-' }}</a>
            <p class="text-mod-body" style="overflow: hidden;text-overflow: ellipsis;font-size: 12px;font-weight: 400;">{{ row.description|| '-' }}</p>
          </div>
        </template>
        <template #params="{ row }">
          <t-popup>
            <t-tag size="small" theme="primary">{{ row.params.length }}</t-tag>
            <!-- <t-space slot="content">触发元素是指触发浮层内容显示的元素</t-space> -->
            <template #content>
              <div v-for="(param, index) in row.params" v-bind:key="index">
                <t-space style="font-size: 12px">
                  <div class="mr-4">{{ param.name }}</div>
                  <div>{{ param.type }}</div>
                </t-space>
              </div>
            </template>
          </t-popup>
        </template>
        <template #createdAt="{ row }">
          {{ dateData(row.createdAt) }}
        </template>
        <template #release="{ row }">
          <t-switch v-if="isPermission('mod_pubilc', row.permissions)" size="large" v-model="row.release" @change="releaseEvent(row, $event)"></t-switch>
          <t-switch v-else disable size="large" v-model="row.release"></t-switch>
        </template>
        <template #operation="{ row }">
          <t-link class="pr-2" theme="primary" hover="color" v-if="isPermission('mod_delete', row.permissions)" @click="deleteElement(row._id, row.name)">
            删除
          </t-link>
          <t-link class="pr-2" theme="primary" hover="color" v-if="isPermission('mod_auth', row.permissions)" @click="modAuth(row)">
            授权
          </t-link>
        </template>
      </t-table>
    </div>
    <t-dialog :visible.sync="isAddMod" header="新增模组" :cancelBtn="null" :confirm-btn="getConfirmBtn">
      <t-form
        ref="formRef"
        :data="modForm"
        :rules="rules"
        @submit="onSubmit"
        class="p-4"
        labelAlign="top"
      >
        <t-form-item label="模组名称" name="name">
          <t-input v-model="modForm.name" placeholder="请输入模组名称"></t-input>
        </t-form-item>
        <t-form-item label="描述" name="description">
          <t-textarea
            v-model="modForm.description"
            :autosize="true"
          />
        </t-form-item>
      </t-form>
    </t-dialog>
    <t-dialog :destroyOnClose="true" width="40%" :visible.sync="isAuthMod" header="模组授权" :cancelBtn="null" :confirm-btn="null" :footer="false">
      <auth-mod v-if="isAuthMod" :mod-row="modRow" :isAuthMod.sync="isAuthMod"></auth-mod>
    </t-dialog>
  </div>
</template>

<script>
import ContentHeader from '@/components/contentHeader/header'
import { getModListApi, deleteModAPI, releaseModApi, addModApi } from '@/api/modServer/mod'
import { formatterDate } from '@/utils/index'
import { modTable } from '@/dict/columns'
import AuthMod from './authMod'
import globalSearch from '@/mixins/globalSearch'
import { SearchIcon, AddIcon } from 'tdesign-icons-vue'
import dialogSubmit from '@/mixins/dialogSubmit'
import { modObj } from '../utils/dataObject'
import { cloneDeep } from 'lodash'
export default {
  name: 'index',
  mixins: [globalSearch, dialogSubmit],
  components: {
    AuthMod,
    ContentHeader,
    SearchIcon,
    AddIcon
  },
  data () {
    return {
      modForm: cloneDeep(modObj),
      isAuthMod: false,
      modRow: {},
      author: this.$store.getters.getInfo.userName,
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 12,
        total: 0,
        showJumper: true
      },
      rules: {
        name: [
          { required: true, message: '模组名称必填', type: 'error' }
        ]
      },
      request_page: {
        page: 1,
        page_size: 200
      },
      isAddMod: false,
      data: [],
      columns: modTable.columns
    }
  },
  mounted () {
    this.getModList()
  },
  computed: {
    dateData () {
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
    releaseEvent (row, value) {
      return new Promise((resolve, reject) => {
        releaseModApi(row._id, { release: value }).then(response => {
          const { data } = response
          if (data.status === 'success') {
            if (value) {
              this.$message.success('发布成功')
            } else {
              this.$message.success('下架成功')
            }
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },
    getModList () {
      return new Promise((resolve, reject) => {
        getModListApi(this.request_page).then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.data = data.data.list
            this.getInitData(this.data)
            this.pagination.total = this.data.length
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },
    modAuth (row) {
      this.isAuthMod = !this.isAuthMod
      this.modRow = row
    },
    editMod (mod) {
      window.sessionStorage.setItem('fromPath', this.$route.path)
      this.$router.push({
        path: `/modops/mod/${mod._id}`
      })
    },
    deleteElement (Id, component) {
      const confirmDia = this.$dialog.confirm({
        header: '删除模组',
        theme: 'warning',
        body: `是否确定删除模组: ${component}`,
        confirmBtn: '确定',
        cancelBtn: '取消',
        onConfirm: ({ e }) => {
          return new Promise((resolve, reject) => {
            deleteModAPI(Id).then(response => {
              const { data } = response
              if (data.status === 'success') {
                this.$message.success('删除成功')
                this.getModList()
                confirmDia.destroy()
              } else {
                this.$message.error(data.message)
              }
            }).catch(error => {
              this.$message.error(error.response.data.message)
            })
          })
        },
        onClose: ({ e, trigger }) => {
          confirmDia.hide()
        }
      })
    },
    onSubmit ({ validateResult, firstError }) {
      if (validateResult === true) {
        window.sessionStorage.setItem('fromPath', this.$route.path)
        this.modForm.author = this.$store.getters.getInfo.userName
        return new Promise((resolve, reject) => {
          addModApi(this.modForm).then(response => {
            const { data } = response
            if (data.status === 'success') {
              this.$message.success('创建模组成功')
              this.isAddMod = false
              this.$router.push({
                path: `/modops/mod/${data.data.id}`
              })
            } else {
              this.$message.error(data.message)
            }
          }).catch(error => {
            this.$message.error(error.response.data.message)
          })
        })
      } else {
        this.$message.warning(`错误：${firstError}`)
      }
    }
  }
}
</script>

<style scoped>
div {
  justify-content: center;
  align-items: center;
}
</style>
