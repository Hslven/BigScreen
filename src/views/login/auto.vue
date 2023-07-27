<template>
  <div>
    <t-loading :loading="loading" text="正在自动登录中，请稍后..." fullscreen />
  </div>
</template>

<script>
export default {
  name: 'auto',
  data () {
    return {
      loading: true,
      account: {
        userName: 'inops_test',
        password: '123456'
      }
    }
  },
  mounted () {
    this.autoLogin()
  },
  methods: {
    async onLoginSuccess () {
      if (this.redirect && this.redirect.includes('/login?redirect=')) {
        this.redirect = '/'
      }
      this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
    },
    autoLogin () {
      this.$store.dispatch('user/login', this.account)
        .then(() => {
          this.loading = false
          this.onLoginSuccess()
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
</style>
