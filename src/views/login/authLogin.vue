<template>
  <div class="mt-4 text-mod-body">
    <div style="padding: 20px 0 0 0">
      <h4 class="mb-4 text-center text-mod-title" style="color: #435689; font-size: 20px; letter-spacing: 2px; font-weight: 600">欢迎登录系统</h4>
    </div>
    <div class="mod-flex-center">
      <div style="height: 4px; width: 30px;border-radius: 8px" class="bg-mod-primary"></div>
    </div>
    <t-card :bordered="false">
      <div style="margin: 20px 40px 80px 40px">
        <t-form :data="formValue" :rules="rules" ref="form" @submit="handleSubmit" :colon="true" :labelWidth="0">
            <t-form-item name="userName" style="padding-bottom: 10px">
              <t-input v-model="formValue.userName" size="large" placeholder="请输入登录账号">
                <user-icon slot="prefix-icon"></user-icon>
              </t-input>
            </t-form-item>
            <t-form-item name="password" style="padding-bottom: 10px">
              <t-input type="password" v-model="formValue.password" size="large" placeholder="请输入密码">
                <lock-on-icon slot="prefix-icon"></lock-on-icon>
              </t-input>
            </t-form-item>
            <t-form-item>
              <div v-if="!loading" style="width: 100%">
                <t-button style="width: 100%; letter-spacing: 2px" theme="primary" type="submit" block>登录</t-button>
              </div>
              <div v-else style="width: 100%">
                <t-button style="width: 100%; letter-spacing: 2px" theme="primary" loading block>登录中</t-button>
              </div>
            </t-form-item>
          </t-form>
      </div>
    </t-card>
    </div>
</template>

<script>
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { createStorage } from '@/utils/Storage'
import { UserIcon, LockOnIcon } from 'tdesign-icons-vue'
const Storage = createStorage({ storage: localStorage })
export default {
  name: 'authLogin',
  components: {
    UserIcon,
    LockOnIcon
  },
  data () {
    return {
      loading: false,
      formValue: {
        userName: '',
        password: ''
      },
      redirect: '',
      otherQuery: {},
      percentage: 0,
      rules: {
        userName: [
          { required: true, message: '用户名必填', type: 'error' }
        ],
        password: [
          { required: true, message: '密码必填', type: 'error' }
        ]
      }
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted () {
    const token = Storage.get(ACCESS_TOKEN, '')
    if (token) {
      this.$store.dispatch('user/tokenRefresh')
        .then(() => {
          this.onLoginSuccess()
        })
        .catch((err) => {
          console.log('认证登陆：', err)
        })
    }
  },
  methods: {
    async onLoginSuccess () {
      this.$message.success({
        content: `hi，${this.$store.getters.getInfo.userName} 欢迎回来`,
        duration: 2000,
        className: 'test_class',
        style: { width: '200px' }
      })
      this.$store.dispatch('user/getModPermission')
      if (this.redirect && this.redirect.includes('/login?redirect=')) {
        this.redirect = '/'
      }
      this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
      this.loading = false
    },
    handleSubmit ({ validateResult, firstError }) {
      if (validateResult === true) {
        this.loading = true
        this.$store.dispatch('user/login', this.formValue)
          .then(() => {
            this.onLoginSuccess()
          })
          .catch((err) => {
            console.log(err)
            this.loading = false
          })
      } else {
        this.$message.warning(firstError)
      }
    },
    getOtherQuery (query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style scoped>
</style>
