<template>
  <div style="width: 100%; text-align: left;">
    <div>
      <div style="display: flex;align-items: center;justify-content: center; position: relative; top: 10px">
        <div class="node-style-transition" :style="{backgroundColor:is_satisfy?'#3cb67c':'#012f4b'}"
             style="font-size: 12px;color: white;padding: 8px 24px 8px 24px;border-radius: 60px;letter-spacing: 1px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{ nodeInfo.name }}
        </div>
      </div>
      <div
        style="padding: 20px; background-color: white; border-radius: 8px; cursor: pointer !important"
        :style="{
           'border':active ? is_satisfy ? '1px solid rgb(85,188,138)' : '1px solid rgb(79,193,233)':'1px solid rgba(36, 46, 66, 0.3)',
           'box-shadow':active ? is_satisfy ? '0 0 5px 5px rgba(85,188,138,0.3)' : '0 0 5px 5px rgba(79,193,233,0.3)':''
        }"
        @click="active = !active"
      >
        <div
            v-for="(param, index) in params(nodeInputInfo)"
            v-bind:key="index"
            :style="{backgroundColor:(param.connected || param.source === 'order'?'rgba(85,188,138,0.2)':'rgba(239,244,249,0.5)'), pointerEvents: param.source === '' || param.source === 'value'?'':'none'}"
            @click="ValueInputEvent(param, index)"
            class="param-selected"
            style="padding: 8px 0px 8px 16px; border-radius: 8px;margin-top: 8px">
          <div v-if="param.source === 'order'" style="font-size: 0.8rem;letter-spacing: 1px; pointer-events: none; color: #012f4b">表示顺序,
            不传值
          </div>
          <div v-else style="letter-spacing: 1px">
            <div class="param-hover-style"
                 style="font-size: 0.8rem;padding-bottom: 2px;letter-spacing: 1px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap; color: #012f4b">
              {{ param.name }}
            </div>
            <!--            先判断param.options是否存在，避免template DOM渲染完成时，数据还未被挂载的情况-->
<!--            <div v-if="param.options" style="display: grid; grid-template-columns: 1fr 1fr;width: 10%">-->
<!--              <div class="type-hover-style"-->
<!--                   style="background-color: rgb(1,47,75); padding: 1px 6px 1px 8px;color: white"-->
<!--                   :style="{borderRadius:param.tag?'5px 0px 0px 5px':'5px'}">{{ param.type }}-->
<!--              </div>-->
<!--              <div class="tag-hover-style" v-if="param.tag"-->
<!--                   style="background-color: white;padding: 0px 6px 0px 6px;color: #012f4b;border-radius: 0px 3px 3px 0px">-->
<!--                {{ param.tag }}-->
<!--              </div>-->
<!--            </div>-->
          </div>
        </div>
      </div>
    </div>
    <t-dialog :closeOnEscKeydown="false" :closeOnOverlayClick="false" :destroyOnClose="true" attach="body" :visible.sync="is_valueInput" header="参数信息" :cancelBtn="null" :confirm-btn="null" :footer="false">
      <div v-if="is_valueInput">
        <t-row style="font-size: 12px" class="pl-4">
          <t-col :span="4" style="color: #5f708a;" class="p-2">参数名:</t-col>
          <t-col :span="8" style="color: #242E42" class="p-2">{{ portInfo.name }}</t-col>
          <t-col :span="4" style="color: #5f708a;" class="p-2">参数类型:</t-col>
          <t-col :span="8" style="color: #242E42" class="p-2">{{ portInfo.type }}</t-col>
          <t-col :span="4" style="color: #5f708a;" class="p-2">参数标签:</t-col>
          <t-col :span="8" style="color: #242E42" class="p-2">{{ portInfo.tag }}</t-col>
        </t-row>
        <component :is="paramInputor" :serviceInputForm.sync="portInfo" @addParameter="addParameter"
                       :isSatisfy="true"></component>
      </div>
    </t-dialog>
  </div>
</template>

<script>
import { cmdbType, tagInputDict } from '../utils/type'
import { serviceObj, InputInitObj } from '../utils/dataObject'
import { cloneDeep } from 'lodash'

export default {
  name: 'modNodePro',
  components: {
    BooleanInputComp: () => import('../paramValueInput/BooleanInputComp'),
    HostInputComp: () => import('../paramValueInput/HostInputComp'),
    IntInputComp: () => import('../paramValueInput/IntInputComp'),
    ListStringInputComp: () => import('../paramValueInput/ListStringInputComp'),
    StringInputComp: () => import('../paramValueInput/StringInputComp'),
    AllInputComp: () => import('../paramValueInput/AllInputComp'),
    // NetworkInputComp: () => import('../paramValueInput/NetworkInputComp'),
    ObjectInputComp: () => import('../paramValueInput/ObjectInputComp'),
    ListObjectInputComp: () => import('../paramValueInput/ListObjectInputComp')
  },
  data () {
    return {
      is_valueInput: false,
      active: false,
      nodeId: null,
      paramInputor: 'StringInputComp',
      portInfo: cloneDeep(InputInitObj('string')),
      nodeInfo: cloneDeep(serviceObj),
      nodeInputInfo: [],
      is_satisfy: false
    }
  },
  inject: ['getGraph', 'getNode'],
  mounted () {
    this.nodeId = this.getNode().id
    this.nodeInfo = this.getNode().getData()
    this.nodeInputInfo = this.getNode().getPorts()
    document.addEventListener('click', e => {
      if (!this.$el.contains(e.target)) {
        this.active = false
      } else {
        this.active = true
      }
    })
    this.listenerNode()
  },
  watch: {
    nodeInputInfo: {
      // 监听参数是否全部满足
      handler (newval, oldvalue) {
        let satisfy = true
        if (newval.length !== 2) {
          newval.forEach((val, index) => {
            if (val.group === 'in' && val.type !== 'void') {
              if (!val.connected) {
                satisfy = false
              }
            }
          })
        }
        this.is_satisfy = satisfy
      },
      deep: true
    },
    portInfo: {
      handler (newval, oldvalue) {
        if (newval.type === 'list_string') {
          // 加载host、network选择器的情况
          if (cmdbType.indexOf(newval.tag) > -1) {
            this.paramInputor = tagInputDict[newval.tag]
          } else {
            this.paramInputor = tagInputDict[newval.type]
          }
        } else {
          this.paramInputor = tagInputDict[newval.type]
        }
      },
      deep: true
    }
  },
  computed: {
    params () {
      // 从连接桩数据中过滤出输入桩和顺序桩
      return function (ports) {
        const inputParams = []
        ports.forEach((val, index) => {
          if (val.group !== 'out') {
            inputParams.push(val)
          }
        })
        return inputParams
      }
    }
  },
  methods: {
    listenerNode () {
      // 连接桩数据变更时，更新数据
      this.getGraph().on('node:change:*', (args) => {
        if (args.key === 'ports' && args.node.id === this.nodeId) {
          this.nodeInputInfo = args.current.items
        }
      })
    },
    ValueInputEvent (param, index) {
      this.portInfo = cloneDeep(param)
      this.is_valueInput = true
    },
    addParameter (data) {
      // 需要先移除对象型的属性，避免set失效
      this.getNode().removePortProp(data.id, 'value')
      this.getNode().removePortProp(data.id, 'options')
      this.getNode().setPortProp(data.id, data)
      // 更新构件参数
      this.nodeInputInfo = this.getNode().getPorts()
      this.is_valueInput = false
    }
  }
}
</script>

<style lang="sass" scoped>
  .node-style-transition
    transition: all 2s

  .param-selected
    transition: all 0.5s

  .param-selected:hover
    background-color: rgb(1, 47, 75) !important

    .param-hover-style
      transition: all 0.5s
      color: white !important

    .type-hover-style
      transition: all 0.5s
      color: rgb(1, 47, 75) !important
      background-color: white !important

    .tag-hover-style
      transition: all 0.5s
      color: white !important
      background-color: rgb(1, 47, 75) !important
</style>
