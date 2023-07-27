<template>
  <div>
   <t-row style="margin-left:20px">
          <t-form
        ref="formRef"
        :data="condition"
        :rules="rules" style="width: 80%">
          <t-form-item label="节点名称:" name="name">
            <t-input  v-model.trim="condition.name" clearable style="width: 80%" :disabled="addId.id !== ''" ></t-input>
          </t-form-item>
          <t-form-item label="节点状态:">
            <t-switch v-model.trim="condition.enable" :customValue="['1', '0']" clearable ></t-switch>
          </t-form-item>
          <t-form-item label="Agent版本号:" name="hostName">
            <t-input v-model="condition.Agent" style="width: 80%" />
          </t-form-item>
          <t-form-item label="节点编号:" name="portName">
            <t-input v-model="condition.code" style="width: 80%" />
          </t-form-item>
          <t-form-item label="作业队列:" name="jobQueue">
            <t-input v-model="condition.jobQueue" style="width: 80%" />
          </t-form-item>
          <t-form-item label="终端队列:" name="terminalQueue">
            <t-input v-model="condition.terminalQueue" style="width: 80%" />
          </t-form-item>
          <t-form-item label="池外IP:" name="externalIp">
            <t-input v-model="condition.externalIp" style="width: 80%" />
          </t-form-item>
          <t-form-item label="池内IP:" name="internalIp">
            <t-input v-model="condition.internalIp" style="width: 80%" ></t-input>
          </t-form-item>
          <t-form-item label="网络区域:" name="networkArea">
            <t-select :options="dict.networkArea" v-model.trim="condition.networkArea"  clearable filterable style="width: 40%"></t-select>
          </t-form-item>
          <t-form-item label="资源池:" name="resourcePool">
            <t-select  :options="dict.resourcePool" v-model.trim="condition.resourcePool"  clearable filterable style="width: 40%"></t-select>
          </t-form-item>
          <t-form-item label="备注信息:" name="remarks">
            <t-textarea v-model="condition.remarks" clearable filterable style="width: 80%" :autosize="{ minRows: 4, maxRows: 5}"></t-textarea>
          </t-form-item>
        </t-form>
    <!-- <t-col :span="12" v-for="(item, index) in field" :key="index">
        <t-row style="margin-top:20px" align="center">
          <t-col :span="2"><span>{{ item.name }}</span></t-col>
          <t-col :span="8">
            <t-form :data="condition" :rule="rules" ref="formRef">
              <t-form-item v-if="item.type === 'input'" prop="name">
<t-input  v-model.trim="condition[item.value]" :key="item.value" clearable style="width: 80%" :disabled="item.value === 'name' && addId.id !== ''"  @blur="checkInput()"></t-input>
              </t-form-item>
              <t-switch v-else-if="item.type === 'switch'" v-model.trim="condition[item.value]" :customValue="['1', '0']" clearable ></t-switch>
              <t-select v-else-if="item.type === 'select'" :options="dict[item.options]" v-model.trim="condition[item.value]"  clearable filterable style="width: 40%"></t-select>
              <t-textarea v-else-if="item.type === 'textarea'" v-model.trim="condition[item.value]" clearable filterable style="width: 80%" :autosize="{ minRows: 4, maxRows: 5}"></t-textarea>
            </t-form>
          </t-col>
        </t-row>
    </t-col> -->
   </t-row>
  </div>
</template>

<script>
import { getIdNodeAPI } from '@/api/inops/jobNode/jobNode'
import { getDictList } from '@/utils/inops/u'
export default {
  naem: 'addNode',
  props: {
    addId: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      checked: true,
      nodeId: {},
      dict: {
        list: ['resourcePool', 'networkArea'],
        networkArea: [],
        resourcePool: []
      },
      field: [
        {
          name: '节点名称',
          value: 'name',
          type: 'input'
        },
        {
          name: '节点状态',
          value: 'enable',
          type: 'switch',
          options: 'jobSheduleState'
        },
        {
          name: 'Agent版本号',
          value: 'Agent',
          type: 'input'
        },
        {
          name: '节点编号',
          value: 'code',
          type: 'input'
        },
        {
          name: '作业队列',
          value: 'jobQueue',
          type: 'input'
        },
        {
          name: '终端队列',
          value: 'terminalQueue',
          type: 'input'
        },
        {
          name: '池外IP',
          value: 'externalIp',
          type: 'input'
        },
        {
          name: '池内IP',
          value: 'internalIp',
          type: 'input'
        },
        {
          name: '网络区域',
          value: 'networkArea',
          type: 'select',
          options: 'networkArea'
        },
        {
          name: '资源池',
          value: 'resourcePool',
          type: 'select',
          options: 'resourcePool'
        },
        {
          name: '备注信息',
          value: 'remarks',
          type: 'textarea'
        }
      ],
      // 查询字段对象
      condition: {
        name: '',
        enable: '0',
        Agent: '',
        code: '',
        jobQueue: '',
        terminalQueue: '',
        externalIp: '',
        internalIp: '',
        networkArea: '',
        resourcePool: '',
        remarks: ''
      },
      rules: {
        name: [
          { required: true }
          // { pattern: new RegExp('^[0-9a-zA-Z_]{1,}$', 'g'), message: '只允许包含数字、字母、下划线' }
        ],
        terminalQueue: [
          { required: true }
          // { pattern: new RegExp('^[0-9a-zA-Z_]{1,}$', 'g'), message: '只允许包含数字、字母、下划线' }
        ],
        jobQueue: [
          { required: true }
          // { pattern: new RegExp('^[0-9a-zA-Z_]{1,}$', 'g'), message: '只允许包含数字、字母、下划线' }
        ],
        internalIp: [
          { required: true }
          // { pattern: new RegExp('^((25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]\\d|\\d)\\.){3}(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]\\d|\\d)$', 'g'), message: 'IP地址错误' }
        ],
        externalIp: [
          { required: true }
          // { pattern: new RegExp('^(?=(\\b|\\D))(((\\d{1,2})|(1\\d{1,2})|(2[0-4]\\d)|(25[0-5]))\\.){3}((\\d{1,2})|(1\\d{1,2})|(2[0-4]\\d)|(25[0-5]))(?=(\\b|\\D))$', 'g'), message: '非正确IP地址' }
        ],
        networkArea: [
          { required: true }
        ],
        resourcePool: [
          { required: true }
        ]
      }
    }
  },
  mounted () {
    this.getDict()
    this.$nextTick(() => {
      this.$on('editNode', () => {
        this.$emit('nodeEdit', this.condition)
      })
    })
  },
  watch: {
    addId: {
      handler (newValue) {
        this.nodeId = newValue
        if (this.nodeId.id !== '') {
          this.getData()
        } else if (this.nodeId.id === '') {
          this.condition.id = ''
          this.condition.name = ''
          this.condition.enable = '0'
          this.condition.Agent = ''
          this.condition.code = ''
          this.condition.jobQueue = ''
          this.condition.terminalQueue = ''
          this.condition.externalIp = ''
          this.condition.internalIp = ''
          this.condition.networkArea = ''
          this.condition.resourcePool = ''
          this.condition.remarks = ''
        }
      }
    }
  },
  methods: {
    onChange (val) {
      console.log(val)
    },
    /**
    * 获取节点信息
    * @returns {Promise<void>}
    */
    async getData () {
      await getIdNodeAPI(this.nodeId.id).then(res => {
        const { data } = res
        if (data.code === 200) {
          this.condition = data.data
        }
      })
    },
    checkInput () {
      const nameReg = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/g // ip地址校验
      this.condition.internalIp = this.condition.internalIp.replace(nameReg, '')
    },
    /**
     * 字典查询
     * @returns {Promise<void>}
     */
    async getDict () {
      for (const item of this.dict.list) {
        this.dict[item] = await getDictList(item)
      }
    },
    validate () {
      this.$refs.formRef.validate()
    }
  }
}
</script>

<style>

</style>
