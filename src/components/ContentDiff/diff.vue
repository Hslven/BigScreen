<template>
  <div class="view" id="view"></div>
</template>

<script>
import 'codemirror/addon/merge/merge.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/addon/search/jump-to-line.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'
import CodeMirror from 'codemirror'
import { codeConfig } from '@/utils/inops/codeConfig'
import DiffMatchPatch from 'diff-match-patch'
window.diff_match_patch = DiffMatchPatch
window.DIFF_DELETE = -1
window.DIFF_INSERT = 1
window.DIFF_EQUAL = 0
export default {
  name: 'diff',
  props: {
    newValue: {
      type: String,
      default: ''
    },
    oldValue: {
      type: String,
      default: ''
    },
    lang: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      codeConfig: null
    }
  },
  mounted () {
    this.codeConfig = codeConfig(this.lang, false)
    this.initView()
  },
  watch: {
    newValue: {
      handler (newVal) {
        this.initView()
      }
    }
  },
  methods: {
    initView () {
      if (this.newValue == null) {
        return false
      }
      const target = document.getElementById('view')
      target.innerHTML = ''
      const obj = {
        lineNumbers: false,
        value: this.oldValue,
        originLeft: null,
        orig: this.newValue,
        highlightDifferences: true,
        connect: 'align'
      }
      this.codeConfig = Object.assign(this.codeConfig, obj)
      CodeMirror.MergeView(target, this.codeConfig)
    }
  }
}
</script>

<style lang="sass" scoped>
.view[data-v-75a44143]
  display: inline
/deep/ .CodeMirror-merge.CodeMirror-merge-2pane
  display: flex
/deep/ .CodeMirror-merge-pane.CodeMirror-merge-editor
  width: 50%
/deep/ .CodeMirror-merge-pane.CodeMirror-merge-right.CodeMirror-merge-pane-rightmost
  width: 50%
/deep/ .CodeMirror.cm-s-darcula.CodeMirror-wrap
  height: 500px
</style>
