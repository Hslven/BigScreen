<template>
  <div style="padding: 15px">
    <t-row align="center">
      <div style="border: 1px solid #165DFF; height: 14px;"></div>
      <span style="margin-left: 10px">基础配置</span>
    </t-row>
    <t-form :data="value" ref="form" labelAlign="right" label-width="150px" style="margin-top: 20px">
      <t-form-item  name="assignUser">
        <t-row align="center">
          <t-switch class="mr-5" v-model="value.assignUser" :customValue="['1', '0']"></t-switch>指定执行账号
          <template v-if="value.assignUser === '1'">
            用户名：<t-input class="mr-5" v-model.trim="value.execUser" placeholder="请输入指定用户用户名" clearable style="width: 314px"></t-input>
            密码：<t-input ref="plainExecPass" v-model.trim="value.plainExecPass" placeholder="请输入指定用户登录密码" type="password" style="width: 314px"></t-input>
          </template>
        </t-row>
      </t-form-item>
      <t-form-item name="becomeUser">
        <t-row>
          <t-switch class="mr-5" v-model="value.become" :customValue="['1', '0']"></t-switch>提权
        </t-row>
        <template v-if="value.become === '1'">
          <t-row style="margin-top: 15px">
            <t-radio-group v-model="value.becomeMethod"><span>提权账号：</span>
              <t-radio-button value="su" style="width: 100px;">su</t-radio-button>
              <t-radio-button value="sudo">sudo</t-radio-button>
            </t-radio-group>
          </t-row>
          <t-row style="margin-top: 15px"><span style="position: relative;top: 5px;">提权账号：</span>
            <t-input v-model.trim="value.becomeUser" placeholder="请输入提权用户名" clearable style="width: 314px"></t-input>&nbsp;&nbsp;&nbsp;<span style="position: relative;top: 5px;">提权密码：</span>
            <t-input ref="plainBecomePass" v-model.trim="value.plainBecomePass" placeholder="请输入提权登录密码" type="password" style="width: 314px"></t-input>
          </t-row>
        </template>
      </t-form-item>
      <t-form-item name="bmcExec" >
        <t-switch class="mr-5" align="center" v-model="value.bmcExec" :customValue="['1', '0']"></t-switch>
        <span>BMC IP执行</span>
      </t-form-item>
      <t-form-item  name="bmcExec">
        <t-switch class="mr-5" v-model="value.ignoreErrors" :customValue="['1', '0']"></t-switch>
        <span>忽略错误执行下一步骤</span>
      </t-form-item>
      <t-form-item  name="bmcExec" text-align="center"><span style="color: rgb(38, 110, 255);font-weight: bold;">远端</span> &nbsp;
        <t-switch class="mr-5" v-model="value.delegateToLocal" :customValue="['1', '0']"></t-switch>&nbsp;节点&nbsp;
        <icon-font name="error-circle" size="20px" />
        <!-- <t-radio-group v-model="value.delegateToLocal">
          <t-radio-button value='0'>远端</t-radio-button>
          <t-radio-button value='1'>节点</t-radio-button>
        </t-radio-group> -->
      </t-form-item>
    </t-form>
  </div>
</template>

<script>
import { getDecryptPswAPI } from '@/api/inops/CMDB/cmdbDevice'
import { IconFont } from 'tdesign-icons-vue'
export default {
  name: 'Params',
  components: { IconFont },
  props: {
    obj: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      value: {
        assignUser: '0',
        execUser: '',
        execPass: '',
        plainExecPass: '',
        become: '0',
        becomeMethod: '',
        becomeUser: '',
        becomePass: '',
        plainBecomePass: '',
        bmcExec: '0',
        ignoreErrors: '1',
        delegateToLocal: '0',
        newSvgUrl: 'https://tdesign.gtimg.com/icon/default-demo/index.js'
      }
    }
  },
  mounted () {
    this.initData()
  },
  watch: {
    value: {
      handler (newVal) {
        this.$emit('update:obj', newVal)
      },
      deep: true
    },
    'value.assignUser': {
      handler (newVal) {
        if (newVal === '1') {
          this.$nextTick(() => {
            this.$refs.plainExecPass.$children[0].$el.children[0].children[1].addEventListener('click', event => {
              this.getPass('plainExecPass', this.value.execPass)
            })
          })
        } else {
          this.$refs.plainExecPass.$children[0].$el.children[0].children[1].removeEventListener('click', event => {
            this.getPass('plainExecPass', this.value.execPass)
          })
        }
      }
    },
    'value.become': {
      handler (newVal) {
        if (newVal === '1') {
          this.$nextTick(() => {
            this.$refs.plainBecomePass.$children[0].$el.children[0].children[1].addEventListener('click', event => {
              this.getPass('plainBecomePass', this.value.becomePass)
            })
          })
        } else {
          this.$refs.plainBecomePass.$children[0].$el.children[0].children[1].removeEventListener('click', event => {
            this.getPass('plainBecomePass', this.value.plainBecomePass)
          })
        }
      }
    }
  },
  methods: {
    initData () {
      this.value = Object.assign(this.value, this.obj)
    },
    /**
     * 密码输入框元素绑定
     * 监听输入框显示密码点击事件
     */
    elBinding () {
      this.$refs.plainExecPass.$children[0].$el.children[0].children[1].addEventListener('click', event => {
        this.getPass('plainExecPass', this.value.execPass)
      })
      this.$refs.plainBecomePass.$children[0].$el.children[0].children[1].addEventListener('click', event => {
        this.getPass('plainBecomePass', this.value.becomePass)
      })
    },
    /**
     * 移除密码输入框元素绑定
     */
    elRemoveBindding () {
      this.$refs.plainExecPass.$children[0].$el.children[0].children[1].removeEventListener('click', event => {
        this.getPass('plainExecPass', this.value.execPass)
      })
      this.$refs.plainBecomePass.$children[0].$el.children[0].children[1].removeEventListener('click', event => {
        this.getPass('plainBecomePass', this.value.plainBecomePass)
      })
    },
    async getDecryptPass (type, password) {
      await getDecryptPswAPI(password).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.value[type] = data.data
          console.log(data.message)
        }
      })
    },
    async getPass (plainType, psw) {
      if (this.value[plainType] === '' || this.value[plainType] === '******') {
        if (psw !== '') {
          await this.getDecryptPass(plainType, psw)
        } else {
          this.value[plainType] = ''
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
/deep/ .t-form__controls-content
  display: block
span
  text-align:center
/deep/ .t-radio-button
  width: 100px
</style>
