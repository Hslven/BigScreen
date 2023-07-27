<template>
  <div style="width: 100%">
    <div style="padding: 0 0 16px 0">
      <div style="font-size: 12px;letter-spacing: 1px;">
        默认值
      </div>
      <t-input-number v-model="inputOptionsForm.options.default" :step="1" :allow-input-over-limit="false" style="width: 100%" />
    </div>
    <div style="padding: 8px 0px 8px 0px">
      <div style="font-size: 12px;letter-spacing: 1px">
        枚举值
      </div>
      <t-tag-input :value="inputOptionsForm.options.enumeration" @change="onChange" />
    </div>
    <div style="padding: 16px 0px 16px 0px">
      <div style="width: 80px; font-size: 12px;letter-spacing: 1px; color: #242e42">
        校验规则
      </div>
      <t-input v-model="inputOptionsForm.options.regular"></t-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'intCompNew',
  props: ['serviceInputForm', 'isSatisfy'],
  data () {
    return {
      input_value: '',
      inputOptionsForm: this.serviceInputForm
    }
  },
  watch: {
    inputOptionsForm: {
      // 监听参数类型变化，载入不同的tag
      handler (newval, oldvalue) {
        this.$emit('update:serviceInputForm', newval)
      },
      deep: true
    }
  },
  methods: {
    onChange (val, context) {
      if (context.trigger === 'tag-remove') {
        this.removeParamter(context.index)
      } else {
        this.addValue(val, context)
      }
    },
    addValue (val, context) {
      if (this.inputOptionsForm.options.enumeration.indexOf(context.item) < 0) {
        const emunValue = parseInt(context.item)
        if (window.isNaN(emunValue)) {
          this.$message.warning('设置的枚举值需为整型！')
        } else {
          this.inputOptionsForm.options.enumeration = val
        }
      } else {
        this.$message.warning('枚举值不能重复！')
      }
    },
    removeParamter (key) {
      this.inputOptionsForm.options.enumeration.splice(key, 1)
    }
  }
}
</script>

<style scoped>
</style>
