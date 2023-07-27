<template>
  <div class="q-pl-md q-pr-md">
  </div>
</template>

<script>
export default {
  name: 'ListObjectInputComp',
  props: ['serviceInputForm', 'isSatisfy'],
  data () {
    return {
      inputOptionsForm: this.serviceInputForm
    }
  },
  methods: {
    addParameter () {
      this.$emit('addParameter', this.inputOptionsForm)
    }
  }
}
</script>

<style scoped>
</style>
