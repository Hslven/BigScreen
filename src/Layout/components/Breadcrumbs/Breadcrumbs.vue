<template>
    <t-breadcrumb>
        <template v-for="(v, i) in breadcrumbs">
          <t-breadcrumbItem :key="v.label" v-if="i !== 0">
            {{ v.label }}
          </t-breadcrumbItem>
        </template>
    </t-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  data () {
    return {
      breadcrumbs: []
    }
  },
  mounted () {
    this.breadcrumbs = this.$store.getters.getBreadcrumbs
  },
  computed: {
    getBreadcrumbs () {
      return this.$store.getters.getBreadcrumbs
    }
  },
  watch: {
    getBreadcrumbs (newVal, oldVal) {
      this.breadcrumbs = newVal
    }
  }
}
</script>
<style scoped>
/deep/ .t-breadcrumb--text-overflow .t-breadcrumb__inner-text {
  font-size: 12px;
}
</style>
