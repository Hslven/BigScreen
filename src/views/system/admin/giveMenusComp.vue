<template>
  <t-card :bordered="false">
      <t-tree
        :data="menusData"
        v-model="actived"
        hover
        :keys = "{ value: 'menuId', label: 'label', children: 'children' }"
        :check-strictly="true"
        :checkable="true"
      />
      <t-button class="mt-4" block theme="primary" variant="base" @click="onSubmit">保存</t-button>
  </t-card>
</template>

<script>
import { getMenuListApi } from '@/api/system/menu'
import { getRoleInfoApi } from '@/api/system/role'
import { updateMenusAPI, delMenusAPI } from '@/api/system/auth'
export default {
  name: 'giveMenusComp',
  components: {
  },
  props: {
    roleInfo: {
      type: Object
    },
    isGiveMenus: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      roleData: this.roleInfo,
      menusData: [],
      tickedBack: [],
      actived: []
    }
  },
  watch: {
    roleInfo (newval, old) {
      if (newval) {
        this.roleData = newval
        this.getMenusList()
        this.getRoleMenus()
      }
    }
  },
  mounted () {},
  methods: {
    getRoleMenus () {
      return new Promise((resolve, reject) => {
        getRoleInfoApi(this.roleData.roleId).then(response => {
          const { data } = response
          if (data.code === 0) {
            if (data.data.menus.length !== 0) {
              this.actived = data.data.menus.map(e => e.menuId)
              this.tickedBack = data.data.menus.map(e => e.menuId)
            }
          } else {
            this.$message.error('获取菜单列表失败！')
          }
        }).catch(error => {
          this.$message.error(error.response.message)
        })
      })
    },
    getMenusList () {
      return new Promise((resolve, reject) => {
        getMenuListApi().then(response => {
          const { data } = response
          if (data.code === 0) {
            this.menusData = data.data
          } else {
            this.$message.error('获取菜单列表失败！')
          }
        }).catch(error => {
          this.$message.error(error.response.message)
        })
      })
    },
    onSubmit () {
      if (this.actived.length !== 0) {
        updateMenusAPI({
          roleId: this.roleData.roleId,
          menuIds: this.actived
        }).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.$message.success('更新菜单权限成功！')
          } else {
            this.$message.error('更新菜单权限失败！')
          }
          this.$emit('update:isGiveMenus', false)
        }).catch(error => {
          this.$message.error(error.response.message)
        })
      } else {
        delMenusAPI({
          roleId: this.roleData.roleId,
          menuIds: this.tickedBack
        }).then(response => {
          const { data } = response
          if (data.code === 0) {
            this.$message.success('删除全部菜单权限成功！')
          } else {
            this.$message.error('删除全部菜单权限失败！')
          }
          this.$emit('update:isGiveMenus', false)
        }).catch(error => {
          this.$message.error(error.response.message)
        })
      }
    }
  }
}
</script>
