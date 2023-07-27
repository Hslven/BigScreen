<template>
  <div ref="prometheus">
    <t-space direction="vertical" class="p-4" style="width: 100%">
      <t-collapse defaultExpandAll borderless>
        <t-collapse-panel header="关键信息" >
          <t-row :gutter="[30, 20]">
            <t-col
              :span="4"
              v-for="(item, index) in infomation.primaty"
              :key="index"
            >
              <t-row>
                <t-col :span="3">{{ item.value }}</t-col>
                <t-col :span="9">{{ item.name }}</t-col>
              </t-row>
            </t-col>
          </t-row>
        </t-collapse-panel>
        <br />
        <t-collapse-panel header="其他信息" >
          <t-row :gutter="[30, 20]">
            <t-col
              :span="4"
              v-for="(item, index) in infomation.other"
              :key="index"
            >
              <t-row>
                <t-col :span="3">{{ item.value }}</t-col>
                <t-col :span="9">{{ item.name }}</t-col>
              </t-row>
            </t-col>
          </t-row>
          <t-row :gutter="[30, 20]" style="margin-top: 30px">
            <t-col v-for="(item, index) in infomation.magnititude" :key="index">
              <t-row>
                <t-col :span="1" style="max-width: 148px">{{
                  item.value
                }}</t-col>
                <t-col :span="11">{{ item.name }}</t-col>
              </t-row>
            </t-col>
          </t-row>
        </t-collapse-panel>
      </t-collapse>
    </t-space>
    <button @click="handle">333</button>
  </div>
</template>

<script>
import axios from 'axios'
const url = process.env.VUE_APP_MONITOR_SIGN_URL
export default {
  data () {
    return {
      infomation: {
        primaty: [],
        other: [],
        magnititude: []
      }
    }
  },
  mounted () {},
  methods: {
    handle () {
      // 获取当前页面的查询参数
      // Obtain the query parameters of the current page
      const query = this.$route.query
      // 转成x=xx&y=yy的形式
      // Convert to the form of x=xx&y=yy
      const queryStr = Object.keys(query)
        .map((key) => {
          return `${key}=${query[key]}`
        })
        .join('&')

      axios({
        method: 'get',
        url: `${process.env.VUE_APP_BASE_URL}${url}/prometheus/alarm?${queryStr}`
      }).then((res) => {
        const { data } = res
        console.log(data)
        if (queryStr.indexOf('alarm') > -1) {
          return this.handleTypeOfAlarm(data)
        }
        return this.handleTypeOfEvent(data)
      })
    },
    handleTypeOfAlarm (data) {
      this.infomation.primaty = [
        { name: '：' + (data.activeStatus || '---'), value: '告警消除状态' },
        { name: '：' + (data.alarmSeverity || '---'), value: '告警级别' },
        { name: '：' + (data.resourcePoolName || '---'), value: '资源池' },
        // 网元名称
        { name: '：' + (data.eqpLabel || '---'), value: '网元名称' },
        // 告警标题
        {
          name: '：' + (JSON.parse(data.alarmText).alarmTitle || '---'),
          value: '告警标题'
        },
        // 告警发生时间
        { name: '：' + (data.happenTime || '---'), value: '告警发生时间' }
      ]
      this.infomation.other = [
        // 厂家原始告警
        { name: '：' + (data.vendorSeverity || '---'), value: '厂家原始告警' },
        // 网管告警级别
        { name: '：' + (data.orgSeverity || '---'), value: '网管告警级别' },
        // 告警定位对象
        { name: '：' + (data.neLabel || '---'), value: '告警定位对象' },
        // 网元状态
        { name: '：' + (data.resourceStatus || '---'), value: '网元状态' },
        // 设备类型
        { name: '：' + (data.eqpObjectClass || '---'), value: '设备类型' },
        // 专业
        { name: '：' + (data.professionalType || '---'), value: '专业' },
        // 二级专业
        { name: '：' + (data.networkType || '---'), value: '二级专业' },
        // 告警类别
        { name: '：' + (data.orgType || '---'), value: '告警类别' },
        // 省份
        { name: '：' + (data.provinceName || '---'), value: '省份' },
        // 城市
        { name: '：' + (data.cityName || '---'), value: '城市' },
        // 设备厂家
        {
          name: '：' + (JSON.parse(data.alarmText).vendorName || '---'),
          value: '设备厂家'
        },
        // 是否需要上报集团
        { name: '：' + (data.sendJtFlag || '---'), value: '是否需要上报集团' },
        // 网管告警id
        { name: '：' + (data.omcAlarmId || '---'), value: '网管告警id' },
        // 原始告警流水号
        {
          name: '：' + (JSON.parse(data.alarmText).alarmSeq || '---'),
          value: '原始告警流水号'
        },
        // 告警发现时间
        { name: '：' + (data.timeStamp || '---'), value: '告警发现时间' },
        // 网元定位信息
        { name: '：' + (data.neLocation || '---'), value: '网元定位信息' },
        // 地区名称
        { name: '：' + (data.regionName || '---'), value: '地区名称' },
        // 资源关联信息
        { name: '：' + (data.specialField9 || '---'), value: '资源关联信息' },
        // 机房名称
        { name: '：' + (data.specialField22 || '---'), value: '机房名称' },
        // 创建时间
        { name: '：' + (data.createTime || '---'), value: '创建时间' },
        // 更新时间
        { name: '：' + (data.updateTime || '---'), value: '更新时间' }
      ]
      this.infomation.magnititude = [
        // 定位信息
        { name: '：' + (data.locateInfo || '---'), value: '定位信息' },
        // 告警正文
        { name: '：' + (data.alarmText || '---'), value: '告警正文' }
      ]
    },
    handleTypeOfEvent (data) {
      this.infomation.primaty = [
        // 事件名称
        { name: '：' + (data.eventName || '---'), value: '事件名称' },
        // 事件级别
        { name: '：' + (data.eventSeverity || '---'), value: '事件级别' },
        // 资源池
        { name: '：' + (data.resourcePoolName || '---'), value: '资源池' },
        // 对象名称
        { name: '：' + (data.objectName || '---'), value: '对象名称' },
        // 对象组件名称
        { name: '：' + (data.objectModelName || '---'), value: '对象组件名称' },
        // 当前值
        { name: '：' + (data.actualValue || '---'), value: '当前值' },
        // 阈值
        { name: '：' + ((data.thresholdValue || '---')), value: '阈值' },
        // 变化值
        { name: '：' + (data.changeValue || '---'), value: '变化值' },
        // 情况说明
        { name: '：' + (data.illustrate || '---'), value: '情况说明' }
      ]
      this.infomation.other = [
        // 事件状态
        { name: '：' + (data.eventStatus || '---'), value: '事件状态' },
        //  是否发送短信
        { name: '：' + (data.sendStatus || '---'), value: '是否发送短信' },
        // 事件类型
        { name: '：' + (data.eventType || '---'), value: '事件类型' },
        // 指标名称
        { name: '：' + (data.metricName || '---'), value: '指标名称' },
        // 指标描述
        { name: '：' + (data.metricExplain || '---'), value: '指标描述' },
        // 对象类型
        { name: '：' + (data.objectType || '---'), value: '对象类型' },
        // 单位
        { name: '：' + (data.unit || '---'), value: '单位' },
        // 条件2阈值
        { name: '：' + (data.threshold2Value || '---'), value: '条件2阈值' },
        // 条件2变化值
        { name: '：' + (data.change2Value || '---'), value: '条件2变化值' },
        // 条件3阈值
        { name: '：' + (data.threshold3Value || '---'), value: '条件3阈值' },
        // 条件3变化值
        { name: '：' + (data.change3Value || '---'), value: '条件3变化值' },
        // 创建时间
        { name: '：' + (data.createTime || '---'), value: '创建时间' },
        // 更新时间
        { name: '：' + (data.updateTime || '---'), value: '更新时间' },
        // 换行
        { name: '', value: '' },
        { name: '', value: '' },
        // 处理建议
        { name: '：' + (data.suggest || '---'), value: '处理建议' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .t-collapse-panel .t-collapse-panel__header-content{
  font-size: 16px!important;
}
</style>
