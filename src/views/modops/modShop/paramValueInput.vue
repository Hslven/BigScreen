<template>
<div>
  <t-row style="font-size: 12px" class="pl-4">
    <t-col :span="4" style="color: #5f708a;" class="p-2">参数名:</t-col>
    <t-col :span="8" style="color: #242E42" class="p-2">{{ modParamsInfo.name }}</t-col>
    <t-col :span="4" style="color: #5f708a;" class="p-2">参数类型:</t-col>
    <t-col :span="8" style="color: #242E42" class="p-2">{{ modParamsInfo.type }}</t-col>
  </t-row>
  <component :is="paramInputor" :serviceInputForm.sync="modParamsInfo" @addParameter="addParameter" :isSatisfy="true"></component>
</div>
</template>

<script>
import { cmdbType, tagInputDict } from '../utils/type'

export default {
  name: 'paramValueInput',
  components: {
    BooleanInputComp: () => import('../paramValueInput/BooleanInputComp'),
    HostInputComp: () => import('../paramValueInput/HostInputComp'),
    IntInputComp: () => import('../paramValueInput/IntInputComp'),
    ListStringInputComp: () => import('../paramValueInput/ListStringInputComp'),
    StringInputComp: () => import('../paramValueInput/StringInputComp'),
    AllInputComp: () => import('../paramValueInput/AllInputComp'),
    // NetworkInputComp: () => import('../paramValueInput/NetworkInputComp'),
    ObjectInputComp: () => import('../paramValueInput/ObjectInputComp'),
    ListObjectInputComp: () => import('../paramValueInput/ListObjectInputComp')
  },
  props: {
    modParam: {
      type: Object
    }
  },
  data () {
    return {
      modParamsInfo: this.modParam,
      paramInputor: ''
    }
  },
  mounted () {
    if (this.modParamsInfo.type === 'list_string') {
      // 加载host、network选择器组件
      if (cmdbType.indexOf(this.modParamsInfo.tag) > -1) {
        this.paramInputor = tagInputDict[this.modParamsInfo.tag]
      } else {
        this.paramInputor = tagInputDict[this.modParamsInfo.type]
      }
    } else {
      this.paramInputor = tagInputDict[this.modParamsInfo.type]
    }
  },
  methods: {
    addParameter () {
      this.$emit('onInstanceObjParam', this.modParamsInfo)
    }
  }
}
</script>

<style scoped>

</style>
