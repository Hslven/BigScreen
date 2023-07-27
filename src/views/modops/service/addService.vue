<template>
  <div>
    <t-form
          ref="formRef"
          :data="serviceForm"
          :rules="rules"
          labelAlign="top"
          class="p-4"
          @submit="onSubmit"
      >
      <t-form-item label="构件名称" name="name">
        <t-input v-model="serviceForm.name" placeholder="请输入构件名称"></t-input>
      </t-form-item>
      <t-form-item label="唯一标识" name="key">
        <t-input v-model="serviceForm.key" placeholder="请输入唯一标识"></t-input>
      </t-form-item>
      <t-form-item label="构件类型" name="category">
        <t-select
          v-model="serviceForm.category"
          clearable
          :options="serviceCategoryOptions"
        >
        </t-select>
      </t-form-item>
      <t-form-item label="输出类型" name="output.type">
        <t-select
          v-model="serviceForm.output.type"
          clearable
          :options="serviceOutputTypeOptions"
        >
        </t-select>
      </t-form-item>
      <t-form-item label="描述" name="description">
        <t-textarea
          v-model="serviceForm.description"
          :autosize="true"
        />
      </t-form-item>
      <t-form-item label="输入参数" name="input">
        <div>
          <div style="display: flex; flex-direction: row; flex-wrap: wrap">
            <t-tag
              theme="primary"
              v-for="(item, index) in serviceForm.input"
              :key="index"
              :closable="true"
              @close="removeParamter(index)"
              @click="editParam(item)"
              class="py-4 px-4 m-2"
            >
              {{ item.name }} | {{ item.type }} <span v-if="item.tag"> : {{ item.tag }}</span>
            </t-tag>
            <t-tag theme="primary" @click="addParam" class="py-4 px-4 m-2">
              添加
            </t-tag>
          </div>
        </div>
      </t-form-item>
      <t-form-item>
        <t-button theme="primary" type="submit" block>提交</t-button>
      </t-form-item>
    </t-form>
    <t-dialog :closeOnOverlayClick="false" :closeOnEscKeydown="false" :destroyOnClose="true" width="33%" :visible.sync="paramDialog" header="输入参数配置" :cancelBtn="null" :confirm-btn="null" :footer="false">
      <comp-entrance :paramsForm="inputParamsForm" @addParameter="onParamsComp" paramSign="service"></comp-entrance>
    </t-dialog>
  </div>
</template>

<script>
import CompEntrance from '../paramSelect_pro/compEntrance'
import { cloneDeep } from 'lodash'
import { addServiceApi } from '@/api/modServer/service'
import { serviceObj, InputInitObj } from '../utils/dataObject'
import { serviceCategoryOptions, serviceOutputTypeOptions } from '../utils/type'
export default {
  name: 'addService',
  components: {
    CompEntrance
  },
  props: {
    isAddService: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      paramDialog: false,
      serviceCategoryOptions,
      serviceOutputTypeOptions,
      data: [],
      rules: {
        name: [{ required: true, message: '构件名必填', type: 'error' }],
        key: [{ required: true, message: '唯一标识必填', type: 'error' }],
        category: [{ required: true, message: '构件分类必填', type: 'error' }],
        'output.type': [{ required: true, message: '输出类型必填' }]
      },
      serviceForm: cloneDeep(serviceObj),
      inputParamsForm: cloneDeep(InputInitObj('string')),
      request_page: {
        page: 1,
        page_size: 200
      }
    }
  },
  methods: {
    onSubmit ({ validateResult, firstError }) {
      if (validateResult === true) {
        this.serviceForm.author = this.$store.getters.getInfo.userName
        return new Promise((resolve, reject) => {
          addServiceApi(this.serviceForm).then(response => {
            const { data } = response
            if (data.status === 'success') {
              this.$message.success('创建构件成功！')
              this.$emit('refreshServices') // 刷新构件列表
              this.$emit('update:isAddService', false) // 关闭弹窗
              this.serviceForm = cloneDeep(serviceObj)
            } else {
              this.$message.error(data.message)
            }
          }).catch(error => {
            this.$message.error(error.data.message)
          })
        })
      } else {
        this.$message.warning(`错误：${firstError}`)
      }
    },
    // 监听参数子组件返回的数据
    onParamsComp (data) {
      // 判断新增的参数是否存在，存在则更新；不存在则新增
      if (!data.name) {
        this.$message.error('参数名称不能为空！')
      } else {
        if (!this.serviceForm.input.length) {
          this.serviceForm.input.push(cloneDeep(data))
        } else {
          for (let i = 0; i < this.serviceForm.input.length; i++) {
            if (this.serviceForm.input[i].name !== data.name) {
              if (this.serviceForm.input.length === (i + 1)) {
                this.serviceForm.input.push(cloneDeep(data))
              }
            } else {
              this.serviceForm.input[i] = cloneDeep(data)
              break
            }
          }
        }
        this.paramDialog = false
      }
    },
    removeParamter (key) {
      this.serviceForm.input.splice(key, 1)
    },
    addParam () {
      this.paramDialog = true
      this.inputParamsForm = cloneDeep(InputInitObj('string'))
    },
    editParam (item) {
      this.inputParamsForm = item
      this.paramDialog = true
    }
  }
}
</script>

<style scoped>
div {
  position: relative;
}
</style>
