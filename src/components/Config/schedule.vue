<template>
  <div>
    <div class="q-mt-none">
      <t-form ref="form">
        <t-form-item labelAlign="right" label="执行方式" name="mode">
          <t-select
            v-model="mode"
            :options="[{ label: '手动执行', value: '0'}, { label: '周期执行', value: '1'}]"
            clearable filterable
            @change="modeChange"
            style="width: 208px"></t-select>
        </t-form-item>
        <template v-if="mode === '1'">
          <t-form-item labelAlign="right" label="执行频率" name="type">
            <t-select
              v-model="type"
              :options="[{ label: '仅执行一次', value: '0'}, { label: '配置执行周期', value: '1'}]"
              clearable filterable
              @change="modeChange"
              style="width: 208px"></t-select>
          </t-form-item>
          <template v-if="type === '0'">
            <t-form-item labelAlign="right" label="执行时间" name="datetime">
              <t-date-picker
                v-model="datetime"
                enable-time-picker allow-input clearable
                format="YYYY-MM-DD hh:mm:ss"
                @change = datetimeChange
                style="width: 208px"/>
            </t-form-item>
          </template>
          <template v-if="type === '1'">
            <t-form-item labelAlign="right" label="执行频率" name="quart">
              <t-radio-group v-model="quart" @change="quartChange">
                <t-radio-button value="onDay">日</t-radio-button>
                <t-radio-button value="onWeek">周</t-radio-button>
                <t-radio-button value="onMonth">月</t-radio-button>
              </t-radio-group>
            </t-form-item>
            <template>
              <t-form-item labelAlign="right" label="频率选择" name="frequency">
                <t-select
                  v-show="quart === 'onDay'"
                  v-model="day"
                  clearable filterable disabled
                  style="width: 208px"></t-select>
                <t-select
                  v-show="quart === 'onWeek'"
                  v-model="week"
                  :options="dict.week"
                  clearable filterable
                  @change="quartChange"
                  style="width: 208px"></t-select>
                <t-select
                  v-show="quart === 'onMonth'"
                  v-model="month"
                  :options="dict.month"
                  clearable filterable
                  @change="quartChange"
                  style="width: 208px"></t-select>
              </t-form-item>
            </template>
            <t-form-item labelAlign="right" label="指定间隔时长" name="interval">
              <t-radio-group v-model="isInterVal">
                <t-radio-button v-for="(item, index) in dict.isInterVal" :key="index" :value="item.value">{{ item.label }}</t-radio-button>
              </t-radio-group>
            </t-form-item>
            <template v-if="isInterVal">
              <t-form-item labelAlign="right" label="间隔时长" name="toInterval">
                <t-select
                  class="mr-5"
                  v-model="interVal.start"
                  clearable filterable
                  :options="dict.hour"
                  @change="intervalChange"
                  label="开始时间/时"
                  style="width: 208px"></t-select>
                <t-select
                  class="mr-5"
                  v-model="interVal.end"
                  clearable filterable
                  :options="dict.hour"
                  @change="intervalChange"
                  label="结束时间/时"
                  style="width: 208px"></t-select>
                <t-select
                  v-model="interVal.duration"
                  clearable filterable
                  :options="dict.duration"
                  @change="intervalChange"
                  label="间隔时间/分钟"
                  style="width: 208px"></t-select>
              </t-form-item>
            </template>
            <template v-if="!isInterVal">
              <t-form-item labelAlign="right" label="执行时间" name="timeWithSeconds">
                <t-time-picker v-model="timeWithSeconds" allowInput clearable @change="timeChange" style="width: 208px"/>
              </t-form-item>
            </template>
          </template>
        </template>
      </t-form>
    <div class="mt-10">
      <t-form-item labelAlign="right" label="Cron表达式" name="cron">
        <t-input
          v-model.trim="taskExpression"
          readonly disabled
          style="width: 208px"></t-input>
      </t-form-item>
    </div>
  </div>
  </div>
</template>

<script>
import { weekDict, monthDict, hourDict, durationDict } from './dict'
import { expreOfOnly, expreOfCycle, expreOfInterval } from '@/utils/inops/toExpression'
import { transToQuarts } from '@/utils/inops/transExpression'
export default {
  name: 'schedule',
  props: {
    expression: {
      type: String,
      default: ''
    },
    taskType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dict: {
        week: weekDict,
        month: monthDict,
        hour: hourDict,
        isInterVal: [{ label: '是', value: true }, { label: '否', value: false }],
        duration: durationDict
      },
      mode: '0',
      type: '0', // 0：仅执行一次，1：周期执行;  runOnly（0：周期执行，1：仅执行一次）
      datetime: '', // 执行时间
      quart: 'onDay', //
      week: '',
      month: '',
      isInterVal: false,
      timeWithSeconds: '',
      interVal: {
        start: '',
        end: '',
        duration: ''
      },
      taskExpression: '',
      day: ''
    }
  },
  mounted () {
    this.initData()
  },
  watch: {
    mode: {
      handler (newval) {
        if (newval === '0') {
          this.$emit('update:taskType', 'manual')
        } else {
          this.$emit('update:taskType', 'auto')
        }
      }
    },
    taskExpression: {
      handler (newVal) {
        this.$emit('update:expression', newVal)
      }
    }
  },
  methods: {
    initData () {
      this.taskExpression = this.expression
      if (this.expression) {
        this.mode = '1'
        const config = transToQuarts(this.expression)
        const { type, date, quart, week, month, isInterVal, timeWithSeconds, interVal } = config
        this.type = type
        this.datetime = date
        this.quart = quart
        this.week = week
        this.month = month
        this.isInterVal = isInterVal
        this.timeWithSeconds = timeWithSeconds
        this.interVal = interVal
      } else {
        this.mode = '0'
      }
    },
    modeChange (val) {
      if (val === '0') this.$emit('update:expression', '')
    },
    datetimeChange () {
      this.taskExpression = expreOfOnly(this.datetime)
    },
    quartChange () {
      if (this.isInterVal) {
        this.intervalChange()
      } else {
        this.timeChange()
      }
    },
    timeChange () {
      if (this.quart === 'onDay') {
        this.taskExpression = expreOfCycle('day', this.timeWithSeconds)
      } else if (this.quart === 'onWeek') {
        this.taskExpression = expreOfCycle('week', this.timeWithSeconds, this.week)
      } else {
        this.taskExpression = expreOfCycle('month', this.timeWithSeconds, null, this.month)
      }
    },
    intervalChange () {
      if (this.interVal.start !== '' && this.interVal.end !== '' && this.interVal.duration !== '') {
        const { start, end, duration } = this.interVal
        if (this.quart === 'onDay') {
          this.taskExpression = expreOfInterval('day', start, end, duration)
        } else if (this.quart === 'onWeek') {
          this.taskExpression = expreOfInterval('week', start, end, duration, this.week)
        } else {
          this.taskExpression = expreOfInterval('month', start, end, duration, null, this.month)
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
