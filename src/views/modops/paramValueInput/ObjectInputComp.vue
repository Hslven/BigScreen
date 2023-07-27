<template>
  <div class="q-pl-md q-pr-md">
  </div>
</template>

<script>
export default {
  name: 'ObjectInputComp',
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
