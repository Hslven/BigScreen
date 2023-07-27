<template>
    <div>
        <div style="padding-left: 10px;">
            <t-row class="rownoe">
            <t-col>1.审批申请</t-col>
        </t-row>
        <t-row style="padding-top: 20px;">
            <t-col :span="2"><span>申请原因</span></t-col>
            <t-col :span="8"><span style="color: rgba(0, 0, 0, 1);">提权操作审批</span></t-col>
        </t-row>
        <t-row align="center" style="padding-top: 20px;">
          <t-col :span="2">
            <span>审批人</span>
          </t-col>
          <t-col :span="4">
            <t-select v-model.trim="query.label" clearable filterable style="width: 90%" @input="change">
              <t-option v-for="(item, index) in dict.approveUser" :key="index"  :label="item.label" :value="index" />
            </t-select>
          </t-col>
        </t-row>
        <t-row style="padding-top: 20px;">
            <t-col :span="2"><span>手机号码</span></t-col>
            <t-col :span="8">{{query.approvePhone}}</t-col>
        </t-row>
        <t-row style="padding-top: 20px;">
            <t-col :span="2"><span>脚本名称</span></t-col>
            <t-col :span="8"><span>{{script.name ? script.name : '脚本调试'}}</span></t-col>
        </t-row>
        <t-row style="padding-top: 20px;">
            <t-col :span="2"><span>设备量</span></t-col>
            <t-col :span="8"><span>{{ hostsum }}</span></t-col>
        </t-row>
        <t-row style="padding-top: 20px;">
            <t-col :span="2"><span>附加说明</span></t-col>
            <t-col :span="10"><t-textarea :disabled="dialog.textarea" v-model="query.content" placeholder="这是一条发给审批人的留言......."  :autosize="{ minRows: 4, maxRows: 5}" style="width: 464px" /></t-col>
        </t-row>
        <t-row align="center" style="padding-top: 20px;">
          <t-col :span="2">
            <span>审批时效：</span>
          </t-col>
          <t-col :span="10">
            <t-date-range-picker
            enable-time-picker
            allow-input clearable
            v-model="query.date"
            :disable-date="disableDate"
            style="width: 80%"/>
          </t-col>
        </t-row>
        <t-row style="padding-top: 20px;" align="center">
            <t-col :span="2"><span>权限添加</span></t-col>
            <t-col :span="8"><t-select  style="width: 100%" :options="dict.approve" v-model="query.approveType" clearable multiple :minCollapsedNum="1"></t-select></t-col>
        </t-row>
        <t-row style="padding-top: 40px;">
            <t-col style="font-weight: bold">2.审批申请结果状态</t-col>
        </t-row>
        <t-row style="padding-top: 15px;">
            <t-col v-if="dialog.list == '1'">暂无信息</t-col>
        <t-space style="width: 98%;" v-else-if="!dialog.list" direction="vertical" text-align="center">
          <t-alert theme="success" v-if="dialog.role === '1'">提交成功，请等待审批人确认<span>{{ dateTime + 's' }}</span></t-alert>
          <t-alert theme="success" v-else-if="dialog.role === '2'" message="审批已通过，可进行执行操作" />
          <t-alert theme="error" v-else-if="dialog.role === '3'" > 审批已超时，请重新提交 </t-alert>
          <t-alert theme="error" v-else-if="dialog.role === '4'" > 审批未通过 </t-alert>
        </t-space>
        </t-row>
        </div>
        <div style="padding-top: 40px;margin: -12px;">
            <t-row class="footer">
            <t-col :span="2">
              <t-button style="width: 80px;height: 40px;" @click="onApply()" v-if="dialog.btn === '1' ">提交</t-button>
              <t-button style="width: 80px;height: 40px;background: rgba(122, 122, 122, 1);color: aliceblue;" theme="default" disabled  v-else-if="dialog.btn === '2' ">执行</t-button>
              <t-button style="width: 80px;height: 40px;" v-else-if="dialog.btn === '3'" @click="fatherScript()" >执行</t-button>
            </t-col>
            <t-col :span="2"><t-button theme="default" class="mr-5" variant="outline" style="width: 80px;height: 40px;" @click="itemVisible">取消</t-button></t-col>
            </t-row>
        </div>
    </div>
</template>

<script>
import { getApproverOfUserAPI } from '@/api/inops/approve/approveUser'
import { approve } from '@/api/inops/approve/approve'
import { getWSURL } from '@/utils/inops/u'
import { getUserListApi } from '@/api/system/user'
import data from '../../views/habor/bigScreen/temperature/components/utils/G6'
import moment from 'moment'
export default {
  name: 'AssignUser',
  data () {
    return {
      dict: {
        user: [],
        queryuserId: [],
        approveUser: [],
        approve: [
          { label: 'assignUser (指定账号)', value: 'assignUser' },
          { label: 'become (su提权)', value: 'become' },
          { label: 'large (大设备)', value: 'large' }]
      },
      query: {
        approvePhone: '',
        userId: '',
        label: '',
        approveType: [],
        content: '',
        date: []
      },
      approveList: {
        approvePhone: '',
        userId: '',
        label: '',
        approveType: ''
      },
      dialog: {
        list: true,
        role: '1',
        btn: '1',
        textarea: false
      },
      dateTime: 600,
      suid: '',
      ws: null,
      visible: false
    }
  },
  props: {
    script: {
      type: Object,
      default: () => {
        return {}
      }
    },
    hostsum: {
      type: Number,
      default: () => {
        return 0
      }
    },
    approveType: {
      type: Array,
      default: () => {
        return []
      }
    },
    user: {
      type: String,
      default: () => {
        return ''
      }
    },
    becomeUser: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  async mounted () {
    await this.getUser()
    await this.getUserId()
    await this.getUsetList()
  },
  watch: {
    query: {
      handler (newVal) {
        if (newVal.date[0] !== '' && newVal.date[1] !== '') {
          const begin = new Date(newVal.date[0]).getTime()
          const end = new Date(newVal.date[1]).getTime()
          const hour = parseInt(end - begin) / 1000 / 60 / 60
          if (hour > 5) {
            this.$message.error({ content: '时效不能超过5个小时，请重新选择', placement: 'center' })
            this.query.date = []
          }
        }
      },
      deep: true
    }
  },
  methods: {
    async getUser () {
      await getUserListApi().then(res => {
        const { data } = res
        if (data.code === 0) {
          for (const item of data.data) {
            if (item.delFlag === '0') {
              const params = {
                label: item.nickName,
                value: item.phonenumber,
                userId: (item.userId).toString()
              }
              this.dict.user.push(params)
            }
          }
        }
      })
    },
    async getUserId () {
      await getApproverOfUserAPI().then(res => {
        const { data } = res
        if (data.code === 200) {
          for (const item of data.data) {
            this.dict.queryuserId.push(item)
          }
        }
      })
    },
    async getUsetList () {
      for (const id of this.dict.queryuserId) {
        for (const item of this.dict.user) {
          if (id === item.userId) {
            const params = {
              label: item.label,
              value: item.value,
              userId: item.userId
            }
            this.dict.approveUser.push(params)
          }
        }
      }
    },
    async onApply () {
      this.query.approveType.push(this.approveType.join(','))
      this.query.approveType = Array.from(new Set(this.query.approveType))
      this.getData()
      this.getDateTime()
    },
    async getData () {
      if (this.query.label !== '') {
        const data = {
          approveType: this.query.approveType.join(','),
          hostLen: this.hostsum,
          assignUser: this.user,
          becomeUser: this.becomeUser,
          approveBy: this.query.userId,
          approvePhone: this.query.approvePhone,
          content: this.query.content,
          jobName: this.script,
          startTime: this.query.date[0],
          expireTime: this.query.date[1]
        }
        await approve(data).then(res => {
          const { data } = res
          if (data.code === 200) {
            this.suid = data.data
            if (data.message === '发送成功') {
              this.dialog.btn = '2'
              this.dialog.list = false
              this.dialog.role = '1'
              this.dialog.textarea = true
              this.initws(this.suid)
            } else {
              this.dialog.btn = '2'
              this.dialog.list = false
              this.dialog.role = '3'
              this.dialog.textarea = true
            }
          } else {
            this.$message.error({ content: '发送请求失败', placement: 'center' })
          }
        })
      } else {
        this.$message.error({ content: '请选择审批人', placement: 'center' })
      }
      console.log('data', data)
    },
    itemVisible () {
      this.$emit('getChange', this.visible)
      this.query.approveType = []
    },
    getDateTime () {
      const setTiem = setInterval(() => {
        this.dateTime--
        if (this.dateTime === 0) {
          clearInterval(setTiem)
          this.dialog.role = '3'
          this.dialog.btn = '1'
          this.dateTime = 300
          this.ws.close()
        }
      }, 1000)
    },
    initws (id) {
      this.ws = new WebSocket(getWSURL(id, 'approve'))
      this.ws.onopen = this.onopen
      this.ws.onmessage = (message) => {
        const data = JSON.parse(message.data)
        if (data.assignUser === 'PERMIT' || data.become === 'PERMIT' || data.large === 'PERMIT') {
          this.dialog.role = '2'
          this.dialog.btn = '3'
          clearInterval(this.setTiem)
          this.$message.success({ content: '审批已通过，可继续操作', placement: 'center' })
        } else {
          this.dialog.role = '4'
          clearInterval(this.setTiem)
          this.$message.error({ content: '审批未通过', placement: 'center' })
        }
      }
      this.ws.error = (e) => {
        this.onError(e)
      }
    },
    fatherScript () {
      this.$emit('executeScript')
    },
    change (index) {
      this.query.approvePhone = this.dict.approveUser[index].value
      this.query.userId = this.dict.approveUser[index].userId
      this.query.label = this.dict.approveUser[index].label
    },
    // 限定选择日期的时间
    disableDate (current) {
      return current && current < moment().subtract(1, 'days').endOf('day')
    }
  }
}
</script>
<style lang="sass" scoped>
.rownoe
  padding-top: 10px
  font-weight: bold
.footer
  display: flex
  flex-direction: row-reverse
  align-content: space-around
  align-items: center
  height: 95px
  opacity: 1
  background: rgba(247, 248, 250, 1)
  border: 1px solid rgba(224, 225, 230, 1)
/deep/ .t-alert.t-alert--success
  height: 32px
  align-items: center
/deep/ .t-alert.t-alert--error
  height: 32px
  align-items: center
span
  font-size: 14px
  color: rgba(0, 0, 0, 1)
  font-weight: 500
/deep/ .t-dialog__body
  padding: 0
.t-dialog__body
  padding: 0
t-dialog__body
  padding: 0
/deep/ [data-v-803cb53e] .t-dialog__body
 padding: 0
[data-v-803cb53e].t-dialog__body
  padding: 0
/deep/ .t-alert__description
  width: 100%
  display: flex
  justify-content: space-between
</style>
