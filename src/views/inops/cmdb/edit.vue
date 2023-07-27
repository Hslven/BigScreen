<template>
  <t-layout class="bg-mod-card" style="padding: 15px; min-height: 100%">
    <t-content>
      <div style="padding: 15px">
        <t-steps v-model="step.current" readonly :options="step.options" style="width: 850px"></t-steps>
      </div>
      <t-form :data="basicInfo" ref="form" style="margin-top: 50px;">
        <div v-if="step.current === 'basic'">
          <t-row align="center">
            <div style="width: 2px; height: 14px; opacity: 1; background: rgba(22, 93, 255, 1); margin-right: 10px"></div>
            <span style="font-size: 14px; font-weight: 700">基础信息</span>
          </t-row>
          <t-form-item v-for="(item, index) in basicField" :key="index" labelAlign="left" :label="item.name" :name="item.value" style="margin-top: 30px; margin-left: 20px">
            <t-input v-if="item.type === 'input'" v-model.trim="basicInfo[item.value]" clearable :style="{ width: `${item.value === 'hostName' ? 532 : 424 }px` }"></t-input>
            <t-select v-else-if="item.type === 'select'" v-model="basicInfo[item.value]" :options="dict[item.value]" clearable filterable style="width: 208px"></t-select>
          </t-form-item>
        </div>
        <div v-if="step.current === 'account'">
          <t-row align="center">
            <div style="width: 2px; height: 14px; opacity: 1; background: rgba(22, 93, 255, 1); margin-right: 10px"></div>
            <span style="font-size: 14px; font-weight: 700">账号配置信息</span>
          </t-row>
          <div v-for="(item, index) in accountField" :key="index">
            <t-form-item v-for="(v, k) in item.field" :key="k" labelAlign="left" :label="v.name" :name="item.value" style="margin-top: 30px; margin-left: 20px">
              <t-input v-model.trim="accountInfo[item.name][v.value]" clearable :ref="v.ref" :type="v.inputType" style="width: 532px">
              </t-input>
            </t-form-item>
          </div>
        </div>
      </t-form>
    </t-content>
    <t-footer class="footer_css">
      <t-row justify="center" style="vertical-align: middle">
        <t-space v-show="step.current === 'basic'" size="15px">
          <t-button class="mr-5" variant="outline" theme="default" @click="back">返回</t-button>
          <t-button theme="primary" variant="base" @click="nextStep">下一步</t-button>
        </t-space>
        <t-space v-show="step.current === 'account'" size="15px">
          <t-button class="mr-5" variant="outline" theme="default" @click="preStep">上一步</t-button>
          <t-button theme="primary" variant="base" @click="onApply">提交</t-button>
        </t-space>
      </t-row>
    </t-footer>
  </t-layout>
</template>

<script>
import { getDictList } from '@/utils/inops/u'
import { getHostInfoAPI, getDecryptPswAPI, saveHostAPI } from '@/api/inops/CMDB/cmdbDevice'
export default {
  name: 'edit',
  data () {
    return {
      paramInfo: null,
      // 配置步骤
      step: {
        current: 'basic', // 当前步骤
        options: [
          { title: '基础配置', value: 'basic', content: '这里是提示文字' },
          { title: '账号配置信息', value: 'account', content: '这里是提示文字' }
        ] // 分步器选项
      },
      // 字典
      dict: {
        resourcePool: [],
        hostRoom: [],
        hostType: [],
        hostMfgr: [],
        hostSource: [],
        sysArea: [],
        major: []
      },
      hostId: '', // 设备ID  not null is edit else is add
      // 基础信息配置字段
      basicField: [
        {
          name: '设备名称',
          type: 'input',
          value: 'hostName',
          isRequire: true,
          isDisable: false
        },
        {
          name: '设备类型',
          type: 'select',
          value: 'hostType',
          isRequire: true,
          isDisable: false
        },
        {
          name: '所属资源池',
          type: 'select',
          value: 'resourcePool',
          isRequire: true,
          isDisable: false
        },
        {
          name: '所属专业',
          type: 'select',
          value: 'major',
          isRequire: true,
          isDisable: false
        },
        {
          name: '是否允许作业',
          type: 'select',
          value: 'isWork',
          options: [{ label: '是', value: '1' }, { label: '否', value: '0' }],
          isRequire: false,
          isDisable: false
        },
        {
          name: '管理IP',
          type: 'input',
          value: 'osIp',
          isRequire: false,
          isDisable: false
        },
        {
          name: '硬管IP',
          type: 'input',
          value: 'bmcIp',
          isRequire: false,
          isDisable: false
        },
        {
          name: 'SSH端口',
          type: 'input',
          value: 'sshPort',
          isRequire: false,
          isDisable: false
        },
        {
          name: '设备状态',
          type: 'select',
          value: 'status',
          isRequire: false,
          isDisable: false
        },
        {
          name: '所属机房',
          type: 'select',
          value: 'hostRoom',
          isRequire: false,
          isDisable: false
        },
        {
          name: '所属网络区域',
          type: 'select',
          value: 'networkArea',
          isRequire: false,
          isDisable: false
        },
        {
          name: '所属厂家',
          type: 'select',
          value: 'hostMfgr',
          isRequire: false,
          isDisable: false
        },
        {
          name: '设备型号',
          type: 'input',
          value: 'hostModel',
          isRequire: false,
          isDisable: false
        },
        {
          name: '设备归属',
          type: 'select',
          value: 'sysArea',
          isRequire: false,
          isDisable: false
        },
        {
          name: '设备来源',
          type: 'select',
          value: 'hostSource',
          isRequire: false,
          isDisable: true
        }
      ],
      // 账号信息配置字段
      accountField: [
        {
          name: 'sshUser',
          field: [
            {
              ref: 'sshUsername',
              name: '连接账号',
              type: 'input',
              value: 'username',
              inputType: 'text',
              isShow: true,
              isWaiting: false
            },
            {
              ref: 'sshPassword',
              name: '连接密码',
              type: 'input',
              value: 'plainPassword',
              inputType: 'password',
              isShow: false,
              isWaiting: false
            }
          ]
        },
        {
          name: 'osUser',
          field: [
            {
              ref: 'osUsername',
              name: '管理账号',
              type: 'input',
              value: 'username',
              inputType: 'text',
              isShow: true,
              isWaiting: false
            },
            {
              ref: 'osPassword',
              name: '管理密码',
              type: 'input',
              value: 'plainPassword',
              inputType: 'password',
              isShow: false,
              isWaiting: false
            }
          ]
        },
        {
          name: 'bmcUser',
          field: [
            {
              ref: 'bmcUsername',
              name: '硬管账号',
              type: 'input',
              value: 'username',
              inputType: 'text',
              isShow: true,
              isWaiting: false
            },
            {
              ref: 'bmcPassword',
              name: '硬管密码',
              type: 'input',
              value: 'plainPassword',
              inputType: 'password',
              isShow: false,
              isWaiting: false
            }
          ]
        },
        {
          name: 'becomeUser',
          field: [
            {
              ref: 'becomeUsernmae',
              name: '超管账号',
              type: 'input',
              value: 'username',
              inputType: 'text',
              isShow: true,
              isWaiting: false
            },
            {
              ref: 'becomePassword',
              name: '超管密码',
              type: 'input',
              value: 'plainPassword',
              inputType: 'password',
              isShow: false,
              isWaiting: false
            }
          ]
        }
      ],
      // 基本信息存储对象
      basicInfo: {
        id: '',
        hostName: '',
        hostType: '',
        isWork: '',
        resourcePool: '',
        status: '',
        osIp: '',
        bmcIp: '',
        sshPort: '22',
        hostSource: 'manual',
        hostRoom: '',
        hostMfgr: '',
        hostModel: '',
        networkArea: '',
        major: '',
        sysArea: ''
      },
      // 账号信息存储对象
      accountInfo: {
        osUser: {
          id: '',
          username: '',
          plainPassword: '******',
          password: ''
        },
        becomeUser: {
          id: '',
          username: '',
          plainPassword: '******',
          password: ''
        },
        bmcUser: {
          id: '',
          username: '',
          plainPassword: '******',
          password: ''
        },
        sshUser: {
          id: '',
          username: '',
          plainPassword: '******',
          password: ''
        }
      },
      // 密码
      password: {
        osUser: '',
        becomeUser: '',
        bmcUser: '',
        sshUser: ''
      }
    }
  },
  async mounted () {
    this.paramInfo = this.$route.query.obj
    await this.getDict()
    if ('hostId' in this.paramInfo && this.paramInfo.hostId) {
      this.hostId = this.paramInfo.hostId
      this.getHostInfo(this.hostId)
    }
  },
  watch: {
    'step.current': {
      handler (newVal) {
        if (newVal === 'account') {
          this.$nextTick(() => {
            this.elBinding()
          })
        }
      }
    }
  },
  methods: {
    /**
     * 返回纳管资源列表
     */
    back () {
      this.$router.push({
        path: '/inops/resource/list'
      })
    },
    /**
     * 分步器上一步
     */
    preStep () {
      this.elRemoveBindding()
      this.step.current = 'basic'
    },
    /**
     * 分步器下一步
     */
    nextStep () {
      this.step.current = 'account'
    },
    /**
     * 密码输入框元素绑定
     * 监听输入框显示密码点击事件
     */
    elBinding () {
      this.$refs.sshPassword[0].$children[0].$el.children[0].addEventListener('click', event => {
        this.showPwd('sshUser', this.accountInfo.sshUser.password)
      })
      this.$refs.osPassword[0].$children[0].$el.children[0].addEventListener('click', event => {
        this.showPwd('osUser', this.accountInfo.osUser.password)
      })
      this.$refs.bmcPassword[0].$children[0].$el.children[0].addEventListener('click', event => {
        this.showPwd('bmcUser', this.accountInfo.bmcUser.password)
      })
      this.$refs.becomePassword[0].$children[0].$el.children[0].addEventListener('click', event => {
        this.showPwd('becomeUser', this.accountInfo.becomeUser.password)
      })
    },
    /**
     * 移除密码输入框元素绑定
     */
    elRemoveBindding () {
      this.$refs.sshPassword[0].$children[0].$el.children[0].removeEventListener('click', event => {
        this.showPwd('sshUser', this.accountInfo.sshUser.password)
      })
      this.$refs.osPassword[0].$children[0].$el.children[0].removeEventListener('click', event => {
        this.showPwd('sshUser', this.accountInfo.sshUser.password)
      })
      this.$refs.bmcPassword[0].$children[0].$el.children[0].removeEventListener('click', event => {
        this.showPwd('sshUser', this.accountInfo.sshUser.password)
      })
      this.$refs.becomePassword[0].$children[0].$el.children[0].removeEventListener('click', event => {
        this.showPwd('sshUser', this.accountInfo.sshUser.password)
      })
    },
    /**
     * 获取字典
     * @returns {Promise<void>}
     */
    async getDict () {
      const keys = Object.keys(this.dict)
      for (const item of keys) {
        this.dict[item] = await getDictList(item)
      }
    },
    /**
     * 获取编辑设备信息
     * @param hostId 设备ID
     */
    getHostInfo (hostId) {
      getHostInfoAPI(hostId).then(res => {
        const { data } = res
        if (data.code === 200) {
          // const { id, hostName, hostType, isWork, resourcePool, status, osIp, bmcIp, sshPort, hostSource, hostRoom, hostMfgr, hostModel, networkArea, major, sysArea } = data.data
          this.basicInfo = Object.assign(this.basicInfo, data.data)
          if (data.data.osUser !== null) {
            const { id, username, password } = data.data.osUser
            this.accountInfo.osUser = Object.assign(this.accountInfo.osUser, { id, username, password })
          }
          if (data.data.becomeUser !== null) {
            const { id, username, password } = data.data.becomeUser
            this.accountInfo.becomeUser = Object.assign(this.accountInfo.becomeUser, { id, username, password })
          }
          if (data.data.bmcUser !== null) {
            const { id, username, password } = data.data.bmcUser
            this.accountInfo.bmcUser = Object.assign(this.accountInfo.bmcUser, { id, username, password })
          }
          if (data.data.sshUser !== null) {
            const { id, username, password } = data.data.sshUser
            this.accountInfo.sshUser = Object.assign(this.accountInfo.sshUser, { id, username, password })
          }
        } else {
          this.$message.error({ content: '设备信息获取失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 获取设备密码明文（解密）
     * @param type
     * @param psw
     * @returns {Promise<void>}
     */
    async getDecryptPass (type, psw) {
      await getDecryptPswAPI(psw).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.password[type] = data.data
        } else {
          this.$message.error({ content: '账号密码获取失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 展示密码
     * 密码框点击显示时触发
     * @param type 密码类型 sshUser→连接账号  osUser→管理账号  bmcUser→bmc账号
     * @param psw 密码密文
     * @returns {Promise<void>}
     */
    async showPwd (type, psw) {
      // 获取密码在密码字段中的下标
      const index = this.accountField.findIndex(v => v.name === type)
      // 密码密文是否为空
      if (psw !== '') {
        // 设置等待器为true  即 显示
        this.accountField[index].field[1].isWaiting = true
        // 判断是否已获取过明文密码
        if (this.password[type] === '') {
          // 为空则调用获取明文密码方法
          await this.getDecryptPass(type, psw)
          this.accountInfo[type].plainPassword = this.password[type]
        }
      }
      this.accountField[index].field[1].isWaiting = false
      this.accountField[index].field[1].isShow = !this.accountField[index].field[1].isShow
    },
    /**
     * 保存时判断密码
     * @param type 密码类型
     * @param psw 密码
     * @returns {Promise<void>}
     */
    async judgePassword (type, psw) {
      // 判断明文密码是否为******
      if (this.accountInfo[type].plainPassword === '******') {
        // 明文密码为 ****** 切该账号密文不为空 为空表示 无密码
        if (psw !== '') {
          // 调用获取密文方法
          await this.getDecryptPass(type, psw)
          this.accountInfo[type].plainPassword = this.password[type]
        } else {
          this.accountInfo[type].plainPassword = ''
        }
      }
      // 删除密文属性
      this.$delete(this.accountInfo[type], 'password')
    },
    /**
     * 删除账号字段属性
     * @param type
     * @param data
     */
    delAccountField (type, data) {
      if (this.paramInfo.editType === 'add') {
        if (data[type].plainPassword === '') {
          this.$delete(data, type)
        }
      } else {
        if (data[type].id === '' && data[type].username === '') {
          this.$delete(data, type)
        }
        if (data[type]) {
          if (data[type].plainPassword === '') {
            data[type] = {
              id: data[type].id
            }
          }
        }
      }
    },
    /**
     * 提交保存
     * @returns {Promise<void>}
     */
    async onApply () {
      this.judgePassword('osUser', this.accountInfo.osUser.password)
      this.judgePassword('becomeUser', this.accountInfo.becomeUser.password)
      this.judgePassword('bmcUser', this.accountInfo.bmcUser.password)
      this.judgePassword('sshUser', this.accountInfo.sshUser.password)
      let data = {}
      data = Object.assign(data, this.basicInfo, this.accountInfo)
      this.delAccountField('osUser', data)
      this.delAccountField('becomeUser', data)
      this.delAccountField('bmcUser', data)
      this.delAccountField('sshUser', data)
      saveHostAPI(data).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.$message.success({ content: '保存成功', placement: 'center' })
          this.hostId = data.data.id
          this.getHostInfo(data.data.id)
        } else {
          this.$message.error({ content: '设备信息保存失败，请联系管理员', placement: 'center' })
        }
      })
    },
    /**
     * 重置
     */
    onReset () {
      if (this.hostId) {
        this.getHostInfo(this.hostId)
      } else {
        this.basicInfo = {
          id: '',
          hostName: '',
          hostType: '',
          isWork: '',
          resourcePool: '',
          status: '',
          osIp: '',
          bmcIp: '',
          sshPort: '22',
          hostSource: 'manual',
          hostRoom: '',
          hostMfgr: '',
          hostModel: '',
          networkArea: '',
          major: '',
          sysArea: ''
        }
        this.accountInfo = {
          osUser: {
            id: '',
            username: '',
            plainPassword: '******',
            password: ''
          },
          becomeUser: {
            id: '',
            username: '',
            plainPassword: '******',
            password: ''
          },
          bmcUser: {
            id: '',
            username: '',
            plainPassword: '******',
            password: ''
          }
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-layout__footer
  padding: 18px
.footer_css
  margin-top: 30px
  height: 64px
  box-shadow: 0px -2px 10px 0px rgba(0, 0, 0, 0.06)
</style>
