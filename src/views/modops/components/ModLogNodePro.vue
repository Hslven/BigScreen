<template>
  <div style="width: 100%; text-align: left; ">
    <div>
      <div style="display: flex;align-items: center;justify-content: center; position: relative; top: 10px">
        <div class="node-style-transition" :style="{backgroundColor: nodeStyle[nodeStatus].color}"
             style="font-size: 12px;color: white;padding: 8px 24px 8px 24px;border-radius: 60px;letter-spacing: 1px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{ nodeInfo.name }}
        </div>
      </div>
      <div
          style="padding: 20px; background-color: white; border-radius: 8px; cursor: pointer !important"
          :style="{
           'border':active ? nodeStyle[nodeStatus].border:'1px solid rgba(36, 46, 66, 0.3)',
           'box-shadow':active ? nodeStyle[nodeStatus].boxShadow:''
        }"
          @click="active = !active"
      >
        <div
            v-for="(param, index) in params(nodeInputInfo)"
            v-bind:key="index"
            style="padding: 8px 0px 8px 16px; border-radius: 8px;margin-top: 8px; background-color: rgba(85,188,138,0.2); pointer-events: none">
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
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { InputInitObj, serviceObj } from '../utils/dataObject'
import { serviceStatus } from '../utils/type'

export default {
  name: 'ModLogNodePro',
  data () {
    return {
      active: false,
      nodeId: null,
      nodeStatus: 'waiting',
      statusColor: '',
      portInfo: cloneDeep(InputInitObj('string')),
      nodeInfo: cloneDeep(serviceObj),
      nodeInputInfo: [],
      is_satisfy: false,
      nodeStyle: serviceStatus
    }
  },
  inject: ['getGraph', 'getNode'],
  mounted () {
    this.nodeId = this.getNode().id
    this.nodeInfo = this.getNode().getData()
    this.nodeInputInfo = this.getNode().getPorts()
    this.nodeStatus = this.nodeInfo.status
    document.addEventListener('click', e => {
      if (!this.$el.contains(e.target)) {
        this.active = false
      } else {
        this.active = true
      }
    })
    this.listenerNode()
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
        if (args.key === 'data' && args.node.id === this.nodeId) {
          this.nodeStatus = args.current.status
        }
      })
    }
  }
}
</script>

<style scoped>
  .node-style-transition {
    transition: all 2s
  }
</style>
