<template>
  <codemirror
    class="scrollbar-style"
    ref="CodeEdit"
    v-model="code"
    :options="codeConfig"
  />
</template>

<script>
import { codemirror } from 'vue-codemirror' // 引入组件
import { codeConfig } from '@/utils/inops/codeConfig'
export default {
  name: 'CodeInfo',
  components: { codemirror },
  props: {
    codeInfo: {
      type: Object,
      default () {
        return {}
      }
    },
    isReadOnly: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      height: 0,
      code: '',
      codeConfig: codeConfig('python', true),
      close: false
    }
  },
  mounted () {
    this.height = this.$refs.CodeEdit.$el.parentElement.clientHeight
    this.code = this.codeInfo.code
    this.codeConfig = codeConfig(this.codeInfo.lang, this.isReadOnly)
    this.setSize()
  },
  methods: {
    setSize () {
      this.$refs.CodeEdit.codemirror.setSize('auto', this.height)
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .CodeMirror
  height: 100%
</style>
