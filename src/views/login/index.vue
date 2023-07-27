<template>
  <div style="background-color: #F4F7FF; height: 100vh; position: relative">
    <div style="position: absolute; top: 0; left: 400px;">
      <img class="login-intro-img" src="~@/assets/images/left-top.png" alt="">
    </div>
    <div style="position: absolute; top: 0; right: 0;">
      <img class="login-intro-img" src="~@/assets/images/right-top.png" alt="">
    </div>
    <div style="position: absolute; bottom: 0; right: 0;">
      <img class="login-intro-img" src="~@/assets/images/right-bottom.png" alt="">
    </div>
    <div class="min-h-full mod-flex-center">
      <t-row>
        <t-col :xs="0" :sm="0" :md="6" :lg="7" :xl="7">
          <div>
            <div style="display: flex; text-align: center; line-height: 60px;">
              <!-- <img src="~@/assets/images/logo.png" style="height: 50px; padding-right: 14px"> -->
              <span style="font-size: 42px; color: #2d3356; font-family: logo-font;">运维自动化平台</span>
            </div>
            <div style="padding-top: 30px">
              <img src="~@/assets/images/login.png" alt="">
            </div>
          </div>
        </t-col>
        <t-col :xs="12" :sm="12" :md="6" :lg="5" :xl="5">
          <div style="padding: 50px 0 0 40px">
            <t-tabs style="width: 400px; border-radius: 10px" :value="loginComp" theme="card" @change="(newValue) => (loginComp = newValue)">
              <t-tab-panel value="authLogin" label="普通登录">
                <auth-login></auth-login>
              </t-tab-panel>
              <t-tab-panel value="ssoLogin" label="SSO登录" style="height: 420px; padding: 20px 0 10px 25px;">
                <iframe
                  class="iframeCss"
                  src="http://sso.gmcc.net/?client_id=nfvcmdb_gmcc_net&returnUrl=http://188.0.58.40/ssoLogin"
                  frameborder="0"
                  scrolling="no"
                >
                </iframe>
              </t-tab-panel>
            </t-tabs>
          </div>
        </t-col>
      </t-row>
    </div>
  </div>
</template>

<script>
import AuthLogin from './authLogin'
export default {
  name: 'index',
  components: { AuthLogin },
  data () {
    return {
      loginComp: 'authLogin'
    }
  }
}
</script>

<style scoped>
.iframeCss {
  height: 100%;
  width: 100%;
}
/deep/ .t-tabs__nav--card.t-tabs__nav-item {
  width: 200px;
  text-align: center;
  letter-spacing: 2px
}
/deep/ .t-tabs__nav--card.t-tabs__nav-item {
  @apply flex items-center justify-center
}
</style>
