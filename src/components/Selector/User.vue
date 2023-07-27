<template>
  <div style="width: 100%">
    <t-transfer
      v-model="targetValue"
      theme="primary"
      :data="list"
      :search="true"
      :operation="['移除', '加入']"
      style="height: 450px;" />
    <t-row style="margin-top: 10px">
      <t-col :offset="11" :span="1">
        <t-button theme="primary" @click="confirm">确认</t-button>
      </t-col>
    </t-row>
  </div>
</template>

<script>
export default {
  name: 'User',
  props: {
    // 用户列表
    userList: {
      type: Array
    },
    // 选择列表（源）
    checkList: {
      type: Array
    },
    // 已选列表
    checked: {
      type: Array
    }
  },
  data () {
    return {
      list: [], // 全量用户列表
      targetValue: [] // 已选用户列表
    }
  },
  mounted () {
    this.list = this.userList
    this.targetValue = this.checkList
  },
  methods: {
    /**
     * 确认用户选择
     */
    confirm () {
      this.$emit('save', this.targetValue)
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-transfer__search .t-transfer__list
  height: 100%
/deep/ .t-transfer__list-body
  width: 400px
</style>
