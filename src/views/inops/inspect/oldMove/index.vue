<template>
  <div>
    <div style="height: 90vh">
      <iframe :src="url" style="height: 100%; width: 100%; border: 0px"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      url: ''
    }
  },
  watch: {
    $route: {
      handler (newVal) {
        this.changePage()
      }
    }
  },
  mounted () {
    this.changePage()
  },
  methods: {
    changePage () {
      const _route = this.$route.name
      if (_route === 'analysis') {
        this.url = 'http://188.0.58.40:8081/#/detail/analysis'
      } else if (_route === 'daily') {
        this.url = 'http://188.0.58.40:8081'
      } else if (_route === 'detail') {
        this.url = 'http://188.0.58.40:8081/#/detail/index'
      } else if (_route === 'monthly') {
        this.url = 'http://188.0.58.40:8081/#/detail/inspectCensus'
      }
    }
  }
}
</script>

<style scoped>

</style>
