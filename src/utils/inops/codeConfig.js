// codemirror样式配置文件
import 'codemirror/mode/python/python'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/mode/shell/shell'
import 'codemirror/addon/display/autorefresh' // 及时自动更新，配置里面也需要设置autoRefresh为true
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js' // 搜索功能所需库
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/comment/comment.js'
import 'codemirror/keymap/sublime.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/jump-to-line.js'
import 'codemirror/addon/selection/active-line' // 光标行背景高亮，配置里面也需要styleActiveLine设置为true
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'
import 'codemirror/addon/fold/xml-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/edit/closetag.js'
import 'codemirror/addon/edit/matchtags.js'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/javascript-hint.js'
export function codeConfig (mode, readOnly) {
  return {
    tabSize: 4, // Tab键空格数
    mode, // 代码编辑器默认语言标识
    readOnly: readOnly,
    theme: 'darcula', // 主题，对应主题库 JS 需要提前引入
    lineNumbers: true, // 显示行号
    indentUnit: 4, // 智能缩进4个空格长度
    lineWrapping: true,
    lineWiseCopyCut: true,
    showCursorWhenSelecting: true,
    line: true,
    indentWithTabs: false, // 使用制表符进行智能缩进
    smartIndent: true, // 智能缩进
    matchBrackets: true,
    autocorrect: true,
    autofocus: true,
    autoRefresh: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    matchTags: { bothTags: true },
    foldGutter: true, // 启用行槽中的代码折叠
    spellcheck: true,
    styleActiveLine: false,
    styleSelectedText: false,
    keyMap: 'sublime', // 快捷键风格
    highlightSelectionMatches: {
      minChars: 2,
      showToken: true
    },
    extraKeys: {
      Ctrl: 'autocomplete',
      // tab转空格
      Tab: function (cm) {
        if (cm.somethingSelected()) {
          cm.indentSelection('add', '    ')
        } else {
          const spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
          cm.replaceSelection(spaces)
        }
      }
    },
    lint: true,
    gutters: [
      'CodeMirror-lint-markers',
      'CodeMirror-linenumbers',
      'CodeMirror-foldgutter'
    ], // 在行槽中天界行号显示器、折叠器、语法监测器
    hintOptions: {
      completeSingle: false,
      tables: {
        users: ['name', 'score', 'birthDate'],
        countries: ['name', 'population', 'size']
      }
    }
  }
}
