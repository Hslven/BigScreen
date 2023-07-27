<template>
  <t-row :gutter="[16, 16]">
    <t-col :span="9">
      <div class="user-left-greeting">
        <div>
          Hi，{{ userInfo.nickName }}
          <span class="regular"> 欢迎回来～</span>
        </div>
        <div style="display: flex; text-align: center;" class="logo">
          <!-- <img src="~@/assets/images/logo.png" style="height: 26px; padding: 0 8px 0 8px"> -->
          <span style="font-size:24px; color: #2d3356; font-family: logo-font;">运维自动化平台</span>
        </div>
      </div>
      <t-card class="user-info-list" title="个人信息" :bordered="false">
        <t-row class="content" justify="space-between">
          <t-col class="contract" :span="3">
            <div class="contract-title">
              昵称
            </div>
            <div class="contract-detail">
              {{ userInfo.nickName }}
            </div>
          </t-col>
          <t-col class="contract" :span="3">
            <div class="contract-title">
              手机
            </div>
            <div class="contract-detail">
              {{ userInfo.phonenumber }}
            </div>
          </t-col>
          <t-col class="contract" :span="3">
            <div class="contract-title">
              邮箱
            </div>
            <div class="contract-detail">
              {{ userInfo.email || '----' }}
            </div>
          </t-col>
          <t-col class="contract" :span="3">
            <div class="contract-title">
              性别
            </div>
            <div class="contract-detail">
              {{ userInfo.sex || '----' }}
            </div>
          </t-col>
        </t-row>
      </t-card>
      <t-card :bordered="false" class="mt-4">
        <div id="container" style="height: 420px"></div>
      </t-card>
    </t-col>
    <t-col :span="3">
      <div>
        <t-card class="user-intro" :bordered="false">
          <t-avatar size="60px">{{ userInfo.nickName }}</t-avatar>
          <div class="name">{{ userInfo.userName }}</div>
          <div class="position">云基础设施运维人员</div>
          <div style="text-align: right;color: white;cursor: pointer" @click="isUpdatePassword = !isUpdatePassword">修改密码</div>
          <t-dialog :visible.sync="isUpdatePassword" header="修改密码" :confirm-btn="null" :cancel-btn="null">
              <div class="p-4">
                <t-form :data="passwordForm" :rules="rules" ref="form" @submit="onSubmit">
                  <t-form-item label="原密码" name="oldPassword">
                    <t-input type="password" v-model="passwordForm.oldPassword" placeholder="请输入原密码"></t-input>
                  </t-form-item>
                  <t-form-item label="新密码" name="newPassword">
                    <t-input type="password" v-model="passwordForm.newPassword" placeholder="请输入新密码"></t-input>
                  </t-form-item>
                  <div style="display: grid; grid-template-columns: 4fr 1fr 1fr 1fr 1fr; column-gap: 4px; padding-bottom: 10px">
                      <span style="position: relative; bottom: 7px; right: 8px;color: rgba(0,0,0,0.54);text-align: right">密码强度</span>
                      <div
                          v-for="index in 4"
                          :key="index"
                          :style="{ backgroundColor: levelColor(index) }"
                          style="height: 5px; width: 50px; border-radius: 5px;"></div>
                    </div>
                  <t-form-item label="确认密码" name="cpassword">
                    <t-input type="password" v-model="passwordForm.cpassword" placeholder="请再次输入密码"></t-input>
                  </t-form-item>
                  <t-form-item style="margin-left: 100px">
                    <t-space size="10px">
                      <t-button theme="primary" type="submit">提交</t-button>
                    </t-space>
                  </t-form-item>
                </t-form>
              </div>
          </t-dialog>
        </t-card>
        <t-card title="所属角色" class="mt-4" :bordered="false">
          <div>
            <t-tag theme="primary" variant="outline" v-for="(val, index) in userInfo.roles" :key="index" style="margin-right: 8px">{{ val }}</t-tag>
          </div>
        </t-card>
        <t-card class="mt-4 mod-flex-center" :bordered="false">
          <t-date-picker-panel />
        </t-card>
      </div>
    </t-col>
  </t-row>
</template>
<script>
import { Mix } from '@antv/g2plot'
import userImage from '@/assets/images/avataaars.png'
import workImg from '@/assets/images/work.png'
import { updatePasswordApi } from '@/api/system/user'
import { passwordStrength } from '@/utils'
export default {
  name: 'index',
  data () {
    return {
      userImage: userImage,
      passwordForm: {
        id: this.$store.getters.getInfo.userId,
        oldPassword: '',
        newPassword: '',
        cpassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '原密码必填', type: 'error' }
        ],
        newPassword: [
          { required: true, message: '新密码必填', type: 'error' }
        ],
        cpassword: [
          { required: true, message: '密码必填', type: 'error' },
          { validator: this.rePassword, message: '两次密码不一致' }
        ]
      },
      passwordLevel: 0,
      isUpdatePassword: false,
      rightBottomImg: workImg,
      userInfo: this.$store.getters.getInfo,
      data1: [
        { sessions: 'sessions-1', visits: 89, type: 'Current Month' },
        { sessions: 'sessions-1', visits: 87, type: 'Last Month' },
        { sessions: 'sessions-2', visits: 148, type: 'Current Month' },
        { sessions: 'sessions-2', visits: 140, type: 'Last Month' },
        { sessions: 'sessions-3', visits: 128, type: 'Current Month' },
        { sessions: 'sessions-3', visits: 144, type: 'Last Month' },
        { sessions: 'sessions-4', visits: 104, type: 'Current Month' },
        { sessions: 'sessions-4', visits: 138, type: 'Last Month' },
        { sessions: 'sessions-5', visits: 102, type: 'Current Month' },
        { sessions: 'sessions-5', visits: 114, type: 'Last Month' },
        { sessions: 'sessions-6', visits: 89, type: 'Current Month' },
        { sessions: 'sessions-6', visits: 107, type: 'Last Month' },
        { sessions: 'sessions-7', visits: 93, type: 'Current Month' },
        { sessions: 'sessions-7', visits: 102, type: 'Last Month' },
        { sessions: 'sessions-8', visits: 116, type: 'Current Month' },
        { sessions: 'sessions-8', visits: 89, type: 'Last Month' },
        { sessions: 'sessions-9', visits: 159, type: 'Current Month' },
        { sessions: 'sessions-9', visits: 80, type: 'Last Month' },
        { sessions: 'sessions-10', visits: 164, type: 'Current Month' },
        { sessions: 'sessions-10', visits: 151, type: 'Last Month' },
        { sessions: 'sessions-11', visits: 139, type: 'Current Month' },
        { sessions: 'sessions-11', visits: 134, type: 'Last Month' },
        { sessions: 'sessions-12', visits: 130, type: 'Current Month' },
        { sessions: 'sessions-12', visits: 129, type: 'Last Month' },
        { sessions: 'sessions-13', visits: 115, type: 'Current Month' },
        { sessions: 'sessions-13', visits: 111, type: 'Last Month' },
        { sessions: 'sessions-14', visits: 128, type: 'Current Month' },
        { sessions: 'sessions-14', visits: 95, type: 'Last Month' },
        { sessions: 'sessions-15', visits: 117, type: 'Current Month' },
        { sessions: 'sessions-15', visits: 108, type: 'Last Month' },
        { sessions: 'sessions-16', visits: 111, type: 'Current Month' },
        { sessions: 'sessions-16', visits: 82, type: 'Last Month' },
        { sessions: 'sessions-17', visits: 161, type: 'Current Month' },
        { sessions: 'sessions-17', visits: 92, type: 'Last Month' },
        { sessions: 'sessions-18', visits: 134, type: 'Current Month' },
        { sessions: 'sessions-18', visits: 132, type: 'Last Month' },
        { sessions: 'sessions-19', visits: 124, type: 'Current Month' },
        { sessions: 'sessions-19', visits: 104, type: 'Last Month' },
        { sessions: 'sessions-20', visits: 105, type: 'Current Month' },
        { sessions: 'sessions-20', visits: 125, type: 'Last Month' },
        { sessions: 'sessions-21', visits: 111, type: 'Current Month' },
        { sessions: 'sessions-21', visits: 131, type: 'Last Month' },
        { sessions: 'sessions-22', visits: 119, type: 'Current Month' },
        { sessions: 'sessions-22', visits: 112, type: 'Last Month' },
        { sessions: 'sessions-23', visits: 104, type: 'Current Month' },
        { sessions: 'sessions-23', visits: 117, type: 'Last Month' },
        { sessions: 'sessions-24', visits: 100, type: 'Current Month' },
        { sessions: 'sessions-24', visits: 104, type: 'Last Month' },
        { sessions: 'sessions-25', visits: 90, type: 'Current Month' },
        { sessions: 'sessions-25', visits: 90, type: 'Last Month' },
        { sessions: 'sessions-26', visits: 93, type: 'Current Month' },
        { sessions: 'sessions-26', visits: 93, type: 'Last Month' },
        { sessions: 'sessions-27', visits: 62, type: 'Current Month' },
        { sessions: 'sessions-27', visits: 89, type: 'Last Month' },
        { sessions: 'sessions-28', visits: 53, type: 'Current Month' },
        { sessions: 'sessions-28', visits: 61, type: 'Last Month' },
        { sessions: 'sessions-29', visits: 59, type: 'Current Month' },
        { sessions: 'sessions-29', visits: 48, type: 'Last Month' },
        { sessions: 'sessions-30', visits: 53, type: 'Current Month' },
        { sessions: 'sessions-30', visits: 51, type: 'Last Month' }
      ],
      data2: {
        uniqueSessions: [
          3,
          12,
          5,
          14,
          7,
          7,
          10,
          11,
          6,
          12,
          7,
          6,
          9,
          12,
          2,
          7,
          8,
          6,
          9,
          13,
          16,
          9,
          8,
          6,
          7,
          8,
          7,
          9,
          3,
          7,
          5,
          3,
          9,
          2,
          3,
          7,
          10,
          11,
          9,
          16,
          9,
          8,
          4,
          9,
          7,
          4,
          9,
          8,
          7,
          3
        ],
        pageSessions: [
          40,
          35,
          32,
          33,
          36,
          29,
          39,
          27,
          35,
          37,
          36,
          27,
          32,
          34,
          27,
          30,
          37,
          38,
          40,
          40,
          33,
          28,
          28,
          31,
          36,
          26,
          32,
          30,
          38,
          38,
          26,
          29,
          29,
          40,
          36,
          34,
          34
        ],
        pageToSession: [2, 3, 1, 3, 3, 9, 5, 8, 3, 7, 7, 8, 4, 3, 5, 5, 2, 4, 5, 7],
        newSessions: [
          3,
          14,
          6,
          6,
          11,
          7,
          14,
          4,
          8,
          11,
          12,
          11,
          12,
          7,
          11,
          13,
          2,
          2,
          13,
          7
        ],
        bonusRate: [
          4.4,
          5.2,
          5.1,
          12.4,
          3.5,
          7.9,
          12.7,
          9.3,
          5.2,
          10.2,
          14.7,
          5.1,
          8.9,
          11.8,
          2.9,
          3.1,
          14.3,
          10.9,
          11.4,
          5.2,
          9.9,
          3.8,
          14.1,
          8.8,
          5.2,
          14,
          5.3
        ],
        avgTime: [
          1339,
          1042,
          644,
          1040,
          751,
          1058,
          732,
          1010,
          794,
          1136,
          526,
          1782,
          1731,
          1303,
          1785,
          1907,
          575,
          734,
          1216,
          617,
          1235,
          833,
          541,
          501,
          832,
          1292,
          1710,
          862,
          798,
          940
        ],
        directTraffic: [
          6285,
          7587,
          6954,
          8476,
          6106,
          3516,
          10986,
          5248,
          11380,
          7944,
          10086,
          10066,
          6465,
          3447,
          3291,
          10844,
          6044,
          11223,
          11911,
          5364,
          6616,
          10525,
          3398,
          7230,
          6725,
          10368,
          3213,
          11459,
          8119,
          11623,
          5177,
          3896,
          10585,
          8660,
          10703
        ],
        referringSites: [
          7811,
          9167,
          5938,
          10367,
          10763,
          6300,
          5302,
          5559,
          9168,
          8646,
          11818,
          10547,
          3731,
          3782,
          5046,
          10633,
          9236,
          10412,
          5099,
          8822,
          8473,
          9464,
          10367,
          9716,
          5055
        ],
        searchEngine: [
          4882,
          8764,
          8253,
          10828,
          7552,
          5590,
          10499,
          4442,
          8049,
          4151,
          4966,
          5143,
          11362,
          4027,
          6539,
          11066,
          10455,
          7022,
          7379,
          10830,
          4658,
          5411,
          7005,
          10265,
          5032
        ],
        goal1: [
          7954,
          7579,
          7907,
          5282,
          8250,
          4250,
          11659,
          6666,
          4177,
          4553,
          8792,
          4246,
          10460,
          3971,
          11234,
          8042,
          4944,
          3979,
          9441,
          7452,
          5914,
          4618,
          10418,
          10156,
          6553
        ],
        goal2: [
          11957,
          6659,
          5008,
          11875,
          9383,
          10869,
          4610,
          9494,
          6255,
          6193,
          9740,
          5235,
          4568,
          4476,
          4370,
          3884,
          6532,
          6152,
          5673,
          8410,
          3057,
          9749,
          6224,
          4628,
          6839
        ]
      }
    }
  },
  watch: {
    'passwordForm.newPassword': {
      // 监听参数类型变化，载入不同的tag
      handler (newval, oldvalue) {
        this.passwordLevel = passwordStrength(newval)
      },
      deep: true
    }
  },
  mounted () {
    this.renderG2Plot()
  },
  computed: {
    levelColor () {
      // 密码等级颜色
      return function (index) {
        const status = {
          1: '#dc3545',
          2: '#fd7e14',
          3: '#346ee0',
          4: '#2ac870'
        }
        if (index <= this.passwordLevel) {
          return status[this.passwordLevel]
        } else {
          return 'grey'
        }
      }
    }
  },
  methods: {
    rePassword (val) {
      return new Promise((resolve) => {
        const timer = setTimeout(() => {
          resolve(this.passwordForm.newPassword === val)
          clearTimeout(timer)
        })
      })
    },
    onSubmit ({ validateResult, firstError }) {
      if (validateResult === true) {
        return new Promise((resolve, reject) => {
          updatePasswordApi(this.passwordForm).then(response => {
            const { data } = response
            if (data.code === 0) {
              this.$message.success({
                content: '成功修改密码',
                duration: 2000,
                style: { width: '200px' }
              })
              this.isUpdatePassword = false
              this.$store.dispatch('user/logout').then(() => {
                this.$router.push({ name: 'Login' })
              })
            } else {
              this.$message.error({
                content: '原密码错误',
                duration: 2000,
                style: { width: '200px' }
              })
            }
          }).catch(error => {
            this.$message.error({
              content: `原密码错误, ${error}`,
              duration: 2000,
              style: { width: '200px' }
            })
          })
        })
      } else {
        this.$message.warning(firstError)
      }
    },
    renderG2Plot () {
      const uvData = this.data2.uniqueSessions.map((d, idx) => ({
        date: `${idx}`,
        uv: d
      }))
      const pvData = this.data2.pageSessions.map((d, idx) => ({
        date: `${idx}`,
        pv: d
      }))
      const directTrafficData = this.data2.directTraffic.map((d, idx) => ({
        date: `${idx}`,
        directTraffic: d
      }))
      const referringSitesData = this.data2.referringSites.map((d, idx) => ({
        date: `${idx}`,
        referringSites: d
      }))
      const plot = new Mix('container', {
        height: 140,
        appendPadding: [20, 0, 0, 0],
        tooltip: false,
        legend: { position: 'top-left' }
      })

      plot.update({
        plots: [
          {
            type: 'area',
            region: {
              start: { x: 0, y: 0 },
              end: { x: 1, y: 0.4 }
            },
            options: {
              data: this.data1,
              xField: 'sessions',
              yField: 'visits',
              seriesField: 'type',
              isStack: false,
              meta: {
                visits: {
                  min: 30,
                  max: 180,
                  tickItnerval: 30
                },
                sessions: {
                  range: [0, 1]
                }
              },
              yAxis: {
                grid: { line: { style: { lineDash: [4, 2], stroke: '#ddd' } } },
                tickLine: { style: { stroke: '#ddd' } }
              },
              xAxis: false,
              tooltip: { showMarkers: false, showCrosshairs: true, shared: true },
              areaStyle: ({ type }) => {
                const { colors10 } = plot.chart.getTheme()
                return {
                  fill:
                type === 'Current Month'
                  ? `l(90) 0.3:${colors10[0]} 1:rgba(255,255,255,0.2)`
                  : `l(90) 0.3:${colors10[1]}  1:rgba(255,255,255,0.2)`
                }
              },
              line: { style: { lineWidth: 1.5 } }
            }
          },
          {
            type: 'tiny-area',
            region: { start: { x: 0, y: 0.5 }, end: { x: 11 / 24, y: 0.7 } },
            options: {
              data: uvData.map((d) => d.uv),
              tooltip: {},
              meta: {
                iv: {
                  min: 20
                }
              },
              seriesField: '1',
              color: () => {
                return '#ffffff'
              },
              line: {
                style: () => {
                  const { colors10 } = plot.chart.getTheme()
                  return { lineWidth: 1, stroke: colors10[0] }
                }
              },
              annotations: [
                {
                  type: 'text',
                  content: 'Unique Sessions',
                  position: ['min', 'max'],
                  offsetY: -8,
                  style: { textAlign: 'left' }
                },
                {
                  type: 'text',
                  content: `${uvData.reduce((a, b) => a + b.uv, 0)}`,
                  position: ['max', 'median'],
                  offsetX: 4,
                  style: { textAlign: 'left' }
                }
              ]
            }
          },
          {
            type: 'tiny-area',
            region: { start: { x: 13 / 24, y: 0.5 }, end: { x: 17 / 18, y: 0.7 } },
            options: {
              data: pvData.map((d) => d.pv),
              tooltip: {},
              meta: {
                pv: {
                  min: 20
                }
              },
              seriesField: '1',
              color: () => {
                return '#ffffff'
              },
              line: {
                style: () => {
                  const { colors10 } = plot.chart.getTheme()
                  return { lineWidth: 1, stroke: colors10[0] }
                }
              },
              annotations: [
                {
                  type: 'text',
                  content: 'Page Sessions',
                  position: ['min', 'max'],
                  offsetY: -8,
                  style: { textAlign: 'left' }
                },
                {
                  type: 'text',
                  content: `${pvData.reduce((a, b) => a + b.pv, 0)}`,
                  position: ['max', 'median'],
                  offsetX: 8,
                  style: { textAlign: 'left' }
                }
              ]
            }
          },
          {
            type: 'tiny-area',
            region: { start: { x: 0 / 24, y: 0.75 }, end: { x: 11 / 24, y: 0.98 } },
            options: {
              data: directTrafficData.map((d) => d.directTraffic),
              tooltip: {},
              meta: {
                directTraffic: {
                  min: 2000
                }
              },
              seriesField: '1',
              color: () => {
                return '#ffffff'
              },
              line: {
                style: () => {
                  const { colors10 } = plot.chart.getTheme()
                  return { lineWidth: 1, stroke: colors10[0] }
                }
              },
              annotations: [
                {
                  type: 'text',
                  content: 'Direct Traffic',
                  position: ['min', 'max'],
                  offsetY: -8,
                  style: { textAlign: 'left' }
                },
                {
                  type: 'text',
                  position: ['max', 'median'],
                  content: `${directTrafficData.reduce((a, b) => a + b.directTraffic, 0)}`,
                  offsetX: 8,
                  style: { textAlign: 'left' }
                }
              ]
            }
          },
          {
            type: 'tiny-area',
            region: { start: { x: 13 / 24, y: 0.75 }, end: { x: 17 / 18, y: 0.98 } },
            options: {
              data: referringSitesData.map((d) => d.referringSites),
              tooltip: {},
              seriesField: '1',
              color: () => {
                return '#ffffff'
              },
              line: {
                style: () => {
                  const { colors10 } = plot.chart.getTheme()
                  return { lineWidth: 1, stroke: colors10[0] }
                }
              },
              annotations: [
                {
                  type: 'text',
                  content: 'Referring Sites',
                  position: ['min', 'max'],
                  offsetY: -8,
                  style: { textAlign: 'left' }
                },
                {
                  type: 'text',
                  content: `${referringSitesData.reduce((a, b) => a + b.referringSites, 0)}`,
                  position: ['max', 'median'],
                  offsetX: 8,
                  style: { textAlign: 'left' }
                }
              ]
            }
          }
        ]
      })
      plot.render()
    }
  }
}
</script>
<style scoped>
.user-left-greeting {
  padding: 28px 32px;
  line-height: 28px;
  font-size: 20px;
  background: var(--td-bg-color-container);
  color: var(--td-text-color-primary);
  text-align: left;
  border-radius: var(--td-radius-default);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.user-left-greeting .regular {
  font-size: 14px;
}
.user-left-greeting .logo {
  width: 320px;
}
.user-info-list {
  margin-top: 16px;
}
.user-info-list .content {
  width: 70%;
}
.user-info-list .contract {
  width: 340px;
  height: 88px;
  border-radius: var(--td-radius-default);
  margin: 8px 0;
}
.user-info-list .contract-title {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 24px;
  margin: 20px 0 6px;
  font-size: 14px;
  color: var(--td-text-color-placeholder);
}
.user-info-list .contract-detail {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 40px;
  font-size: 14px;
  color: var(--td-text-color-secondary);
}
.user-info-list .contract:last-child {
  margin-bottom: 0;
}
.user-intro {
  padding: 32px 0 0 24px ;
  background: var(--td-brand-color);
  border-radius: var(--td-radius-default);
  color: var(--td-text-color-primary);
}
.user-intro .name {
  line-height: 37px;
  font-size: 20px;
  margin-top: 12px;
  color: #fff;
}
.user-intro .position {
  line-height: 24px;
  font-size: 14px;
  margin-top: 8px;
  color: #fff;
}
.user-intro .user-info {
  line-height: 24px;
  font-size: 14px;
  color: var(--td-text-color-primary);
}
.user-intro .user-info .hiredate,
.user-intro .user-info .del,
.user-intro .user-info .mail {
  display: flex;
}
.product-container .logo {
  width: 48px;
}
.content-container {
  margin-top: 16px;
  background: var(--td-bg-color-container);
  border-radius: var(--td-radius-default);
}
.user-team {
  margin-top: 16px;
}

</style>
