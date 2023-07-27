<template>
  <span style="display: flex;line-height: 20px;">
    <i class="Status-indicator Indicator-icon"
       :class="classObject(this.compStatus)"
    ></i>
    <span style="letter-spacing: 1px">{{ statusDict[this.compStatus] }}</span>
  </span>
</template>

<script>
const statusDict = {
  Success: '成功',
  success: '成功',
  正常: '正常',
  Running: '运行中',
  running: '运行中',
  Fail: '失败',
  Failed: '失败',
  fail: '失败',
  failed: '失败',
  异常: '异常',
  Block: '阻塞',
  block: '阻塞',
  Warning: '告警',
  warning: '告警',
  Waiting: '等待',
  Pending: '阻塞',
  Initializing: '初始化中',
  Waitting: '等待',
  waiting: '等待'
}
export default {
  name: 'modStatus',
  props: {
    status: {
      type: String,
      default: 'waiting'
    }
  },
  data () {
    return {
      statusDict: statusDict,
      compStatus: this.status,
      statusOptions: {
        success: ['Success', 'success', '正常', 'Running', 'running'],
        fail: ['Fail', 'Failed', 'fail', 'failed', '异常'],
        // running: [],
        block: ['Block', 'block'],
        warning: ['Warning', 'warning'],
        waiting: ['Waiting', 'Pending', 'Initializing', 'Waitting', 'waiting']
      }
    }
  },
  computed: {
    classObject () {
      return function (value) {
        return {
          modSuccess: this.statusOptions.success.includes(value),
          modFail: this.statusOptions.fail.includes(value),
          // modRunning: this.statusOptions.running.includes(value),
          modBlock: this.statusOptions.block.includes(value),
          modWarning: this.statusOptions.warning.includes(value),
          modWaiting: this.statusOptions.waiting.includes(value)
        }
      }
    }
  },
  watch: {
    status: {
      // 监听输入参数类型变化，加载对应的选择器
      handler (newval, oldvalue) {
        this.compStatus = newval
      },
      deep: true
    }
  }
}
</script>

<style scoped>
  .Status-indicator {
    display: inline-block;
    margin-right: 8px;
    margin-top: 3px;
    vertical-align: top !important;
  }
  .Indicator-icon {
    display: block;
    position: relative;
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  .Indicator-icon:before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    width: 8.3px;
    height: 8.3px;
    border-radius: 50%;
  }
  .modSuccess {
    /* background-color: rgba(85,188,138,.1);
    -webkit-box-shadow: 0 8px 16px 0 rgba(85,188,138,.36);
    box-shadow: 0 8px 16px 0 rgba(85,188,138,.36); */
  }
  .modSuccess:before {
    background-color: rgba(0, 186, 173, 1);
  }
  .modFail {
    /* background-color: rgba(171,47,71,.1);
    -webkit-box-shadow: 0 8px 16px 0 rgba(171,47,71,.36);
    box-shadow: 0 8px 16px 0 rgba(171,47,71,.36); */
  }
  .modFail:before {
    background-color: #F5319D;
  }
  .modRunning {
    /* background-color: rgba(79,193,233,.1);
    -webkit-box-shadow: 0 8px 16px 0 rgba(79,193,233,.36);
    box-shadow: 0 8px 16px 0 rgba(79,193,233,.36); */
  }
  .modRunning:before {
    background-color: #165DFF;
  }
  .modWarning {
    /* background-color: rgba(255,153,51,.1);
    -webkit-box-shadow: 0 8px 16px 0 rgba(255,153,51,.36);
    box-shadow: 0 8px 16px 0 rgba(255,153,51,.36); */
  }
  .modWarning:before {
    background-color: #FEA826;
  }
  .modWaiting {
    /* background-color: rgba(170,178,189,.1);
    -webkit-box-shadow: 0 8px 16px 0 rgba(170,178,189,.36);
    box-shadow: 0 8px 16px 0 rgba(170,178,189,.36); */
  }
  .modWaiting:before {
    background-color: #AAB2BD;
  }
  .modBlock {
    /* background-color: rgba(102,51,0,.1);
    -webkit-box-shadow: 0 8px 16px 0 rgba(102,51,0,.36);
    box-shadow: 0 8px 16px 0 rgba(102,51,0,.36); */
  }
  .modBlock:before {
      background-color: #663300;
  }
</style>
