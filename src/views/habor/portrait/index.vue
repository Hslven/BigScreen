<template>
  <div class="p-4">
    <div class="p-4 bg-mod-card rounded-sm">
      <t-form :data="condition" ref="form" @submit="submitEvent">
        <t-form-item name="hostName" style="padding-bottom: 10px">
          <t-input v-model="condition.hostName" size="large" placeholder="设备名称">
          </t-input>
        </t-form-item>
        <t-form-item>
          <t-button style="width: 100%; letter-spacing: 2px" theme="primary" type="submit" block>查询</t-button>
        </t-form-item>
      </t-form>
    </div>
    <div v-show="iframeShow" class="mt-4 bg-mod-card rounded-sm" style="height: 80vh">
      <iframe :src="url" style="height: 100%; width: 100%; border: 0px"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      condition: {
        hostName: ''
      },
      url: '',
      iframeShow: false
    }
  },
  methods: {
    submitEvent () {
      this.url = `http://188.0.105.245:8081/portrait/graph?hostName=${this.condition.hostName}&type=1`
      this.iframeShow = true
    }
  }
}
</script>

<style scoped>

</style>
