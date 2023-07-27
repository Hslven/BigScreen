<template>
  <div>
    <div class="mb-4">
      <t-checkbox-group v-model="selectedRoles">
        <t-checkbox :checkAll="true" label="全选" />
        <t-checkbox v-for="(item, index) in roleList" :value="item.role_id" :key="index">{{ item.role_name }}</t-checkbox>
      </t-checkbox-group>
    </div>
    <t-button @click="onSubmit" block>
      授权
    </t-button>
  </div>
</template>

<script>
import { serviceObj } from '../utils/dataObject'
import { cloneDeep } from 'lodash'
import { addRoleToDataApi, deleteRoleToDataApi, getModRoleListApi, getDataRolesApi } from '@/api/modServer/modAuth'
export default {
  name: 'authService',
  props: {
    serviceRow: {
      type: Object,
      default: () => ({
        ...serviceObj
      })
    },
    isAuthService: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      serviceData: this.serviceRow,
      selectedRoles: [],
      selectedRolesBack: [],
      roleList: []
    }
  },
  mounted () {
    this.getRoleList()
    this.getSelectedRoles()
  },
  methods: {
    getSelectedRoles () {
      const paramObj = { data_id: this.serviceRow._id, category: 'service' }
      return new Promise((resolve, reject) => {
        getDataRolesApi(paramObj).then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.selectedRoles = data.data
            this.selectedRolesBack = cloneDeep(data.data)
          } else {
            this.$message.error(data)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    getRoleList () {
      return new Promise((resolve, reject) => {
        getModRoleListApi().then(response => {
          const { data } = response
          if (data.status === 'success') {
            data.data.forEach((item) => {
              if (item.role_name.indexOf('作者') === -1) {
                this.roleList.push(item)
              }
            })
          } else {
            this.$message.error(data)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      })
    },
    async onSubmit () {
      const diffList = this.selectedRoles.concat(this.selectedRolesBack).filter(v => !this.selectedRoles.includes(v) || !this.selectedRolesBack.includes(v))
      const addList = []
      const deleteList = []
      diffList.forEach((item) => {
        if (this.selectedRoles.includes(item)) {
          addList.push(item)
        } else {
          deleteList.push(item)
        }
      })
      if (addList.length !== 0) {
        await this.addDataToRole(addList)
      }
      if (deleteList.length !== 0) {
        await this.deleteDataToRole(deleteList)
      }
    },
    addDataToRole (addList) {
      const dataForm = {
        role_ids: addList,
        data_id: this.serviceData._id,
        data_name: this.serviceData.name,
        category: 'service',
        operation_types: ['use']
      }
      return new Promise((resolve, reject) => {
        addRoleToDataApi(dataForm).then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.$message.success(data.message)
            this.$emit('update:isAuthService', false)
          } else {
            this.$message.warning(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },
    deleteDataToRole (deleteList) {
      const dataForm = {
        role_ids: deleteList,
        data_id: this.serviceData._id,
        category: 'service'
      }
      return new Promise((resolve, reject) => {
        deleteRoleToDataApi(dataForm).then(response => {
          const { data } = response
          if (data.status === 'success') {
            this.$message.success(data.message)
            this.$emit('update:isAuthService', false)
          } else {
            this.$message.warning(data.message)
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
