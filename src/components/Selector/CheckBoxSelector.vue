<template>
  <div class="check_group">
    <label v-for="(item, index) in list" :key="index" :for="item.value" :class="check.includes(item.value) ? 'is_check' : 'is_not_check'">
      <div class="sign" v-show="check.includes(item.value)"></div>
      {{ item.label }}
      <input v-model="check" :value="item.value" :id="item.value" type="checkbox" style="display: none" @change="onChange">
    </label>
  </div>
</template>

<script>
export default {
  name: 'CheckBoxSelector',
  // 父组件传值
  props: {
    // 多选框选项
    options: {
      type: Array
    },
    // v-model绑定值
    value: {
      type: Array
    }
  },
  data () {
    return {
      // 多选列表
      list: [],
      // 接收选中值
      check: []
    }
  },
  mounted () {
    // 初始化参数转换
    this.list = JSON.parse(JSON.stringify(this.options))
    this.check = JSON.parse(JSON.stringify(this.value))
  },
  methods: {
    onChange () {
      console.log('111')
      this.$emit('input', this.check)
    }
  }
}
</script>

<style lang="sass" scoped>
// 多选框
.check_group
  display: flex
  cursor: pointer
// 倒三角
.sign
  position: absolute
  right: 2px
  top: 2px
  width: 0px
  height: 0px
  border: 4px solid rgba(38, 110, 255, 1)
  opacity: 0.35
  border-bottom-color: transparent
  border-left-color: transparent
// 多选框子label节点
.check_group label
  position: relative
  margin-right: -1px
  border-radius: 0px
  cursor: pointer
  height: 32px
  padding: 4px 16px
  box-sizing: border-box
// 多选框第一个子label节点
.check_group label:first-child
  border-radius: 3px 0px 0px 3px
// 多选框最后一个子label节点
.check_group label:last-child
  margin: 0px
  border-radius: 0px 3px 3px 0px
// 子label鼠标悬浮状态
.check_group label:hover
  color: #165DFF
// 非选中状态  设置边框
.is_not_check
  border: 1px solid #DCDCDC
// 选中状态  设置边框
.is_check
  z-index: 1
  border: 1px solid #165DFF
  color: #165DFF
</style>
