<template>
  <div style="width: 100%">
    <div style="padding: 0 0 16px 0">
      <div style="font-size: 12px;letter-spacing: 1px;">
        默认值
      </div>
      <t-input v-model="inputOptionsForm.options.default" style="width: 100%"></t-input>
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
import { ruleDict } from '@/dict/dict'
export default {
  name: 'stringCompNew',
  props: ['serviceInputForm', 'isSatisfy'],
  data () {
    return {
      ruleRes: true,
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
    },
    ruleRes: {
      handler (newval, oldvalue) {
        this.$emit('update:isSatisfy', newval)
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
      // 对新增的枚举值进行校验
      if (this.inputOptionsForm.options.enumeration.indexOf(context.item) < 0) {
        if (this.inputOptionsForm.tag && ruleDict[this.inputOptionsForm.tag] !== null) {
          const ruleReg = ruleDict[this.inputOptionsForm.tag]
          if (ruleReg.test(context.item)) {
            this.inputOptionsForm.options.enumeration = val
          } else {
            this.$message.error(this.inputOptionsForm.tag + '格式不正确')
          }
        } else {
          this.inputOptionsForm.options.enumeration = val
        }
      } else {
        this.$message.warning('枚举值不能重复！')
      }
    },
    removeParamter (key) {
      this.inputOptionsForm.options.enumeration.splice(key, 1)
    },
    ruleMethod (val) {
      // 判断输入值是否合规
      if (this.inputOptionsForm.tag && ruleDict[this.inputOptionsForm.tag] !== null) {
        const ruleReg = ruleDict[this.inputOptionsForm.tag]
        this.ruleRes = ruleReg.test(val)
        if (val) {
          return this.ruleRes || this.inputOptionsForm.tag + '格式不正确'
        } else {
          this.ruleRes = true
          return true || this.inputOptionsForm.tag + '格式不正确'
        }
      } else {
        return true
      }
    }
  }
}
</script>

<style scoped>
</style>
