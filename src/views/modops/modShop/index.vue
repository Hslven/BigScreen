<template>
  <div>
    <content-header></content-header>
    <div class="bg-mod-card rounded-sm text-mod-body">
      <div style="display: grid;grid-template-columns: auto 60px;column-gap: 16px" class="ml-2 mr-6">
        <div class="mt-6 ml-4 mr-0">
          <t-input v-model="globalFilter" placeholder="全局搜索">
            <search-icon slot="prefix-icon"></search-icon>
          </t-input>
        </div>
        <div v-permission="'mod_add'" class="mt-6">
          <t-button @click="getModList" variant="outline">
            刷新
          </t-button>
        </div>
      </div>
      <t-divider align="center" style="font-size: 12px" class="text-mod-body">共{{ data.length }}个模组</t-divider>
      <t-row :gutter="16" class="px-6">
        <t-col :span="12" v-for="(item, key) in data" :key="key" class="my-2" style="border: 1px solid rgba(224, 225, 230, 1); border-radius: 4px;padding: 12px !important">
          <t-row>
            <t-col :span="8">
              <t-space>
                <div class="mod-flex-center w-full h-full mr-4">
                  <div class="mod-flex-center" style="width: 44px; height: 44px; background: rgba(194, 212, 255, 1);border-radius: 100px;">
                    <mod-icon name="token" color="primary" size="md"></mod-icon>
                  </div>
                </div>
                <div class="ml-2" style="line-height: 1.71;">
                  <a @click="modEvent(item)" class="table-main-font" style="cursor: pointer;text-decoration: none; font-weight: 600">{{ item.name }}</a>
                  <p style="font-size: 12px;" class="text-mod-body">{{ item.description }}</p>
                </div>
              </t-space>
            </t-col>
            <t-col :span="2">
              <div style="font-size: 12px; font-weight: 600">作者</div>
              <p style="font-size: 12px;" class="text-mod-body">{{ item.author }}</p>
            </t-col>
            <t-col :span="2">
              <div style="font-size: 12px; font-weight: 600">状态</div>
              <mod-status status="Success" class="text-mod-title"></mod-status>
            </t-col>
          </t-row>
        </t-col>
      </t-row>
    </div>
  </div>
</template>

<script>
import { getModListApi } from '@/api/modServer/mod'
import ContentHeader from '@/components/contentHeader/header'
import globalSearch from '@/mixins/globalSearch'
import { SearchIcon } from 'tdesign-icons-vue'
import ModStatus from '@/components/modComp/modStatus'
export default {
  name: 'index',
  mixins: [globalSearch],
  components: {
    ContentHeader,
    SearchIcon,
    ModStatus
  },
  data () {
    return {
      data: [],
      pagination: {
        defaultCurrent: 1,
        defaultPageSize: 12,
        total: 0,
        showJumper: true
      }
    }
  },
  mounted () {
    this.getModList()
  },
  methods: {
    getModList () {
      // 请求用户列表接口
      return new Promise((resolve, reject) => {
        getModListApi({ page: 1, page_size: 100 }).then(response => {
          const { data } = response
          this.data = []
          if (data.status === 'success') {
            data.data.list.forEach((val, index) => {
              if (val.release) {
                this.data.push(val)
              }
            })
            this.getInitData(this.data)
          } else {
            this.$message.error(data.message)
          }
        }).catch(error => {
          this.$message.error(error.response.data.message)
        })
      })
    },
    modEvent (mod) {
      window.sessionStorage.setItem('fromPath', this.$route.path)
      window.sessionStorage.setItem('modPermissions', JSON.stringify(mod.permissions))
      this.$router.push({
        path: `/modops/modShop/${mod._id}`
      })
    }
  }
}
</script>

<style scoped>
/deep/ .t-card__title {
  font-size: 12px !important;
}
/deep/ .t-card__description {
  font-size: 12px !important;
}
/deep/ .t-card__header {
  padding: 12px 18px !important;
  border-radius: 5px 5px 0 0;
}
/deep/ .t-card__header {
  @apply bg-mod-primary text-white
}
/deep/ .t-card__footer {
  padding: 8px 12px
}
</style>
