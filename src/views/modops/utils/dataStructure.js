import { paramsInitValue } from '@/dict/dict'
class Data {
  serviceData () {
    /*
   构件信息参数数据结构
    */
    const data = {
      // _id: null, //构件id，modserver后端自动生成
      id: null,
      name: null,
      version: 1,
      description: null,
      author: null,
      // 构件唯一标识，即MQ的队列名
      key: null,
      // 构件类型
      category: null,
      // 输入参数
      input: [],
      // 输出参数类型
      output: null,
      nodeType: 'step',
      createdAt: null, // 构件创建时间
      updatedAt: null, // 构件更新时间
      status: null // 构件状态
    }
    return data
  }

  instanceData (id) {
    /*
   模组调度信息参数数据结构
    */
    const data = {
      modid: id,
      userid: 'Azrael',
      source: 'manual',
      params: []
    }
    return data
  }

  modData () {
    /*
   模组编排信息参数数据结构
    */
    const data = {
      name: null,
      description: null,
      author: null,
      params: [],
      steps: [],
      orders: [],
      createdAt: null,
      updatedAt: null,
      release: false
    }
    return data
  }

  scheduleData () {
    /*
   模组调度信息参数数据结构
    */
    const data = {
      mod: {
        id: '',
        name: '',
        params: []
      },
      user: '',
      plan: {
        type: '',
        when: ''
      }
    }
    return data
  }

  stepData () {
    /*
   模组节点实例参数数据结构
    */
    const data = {
      id: null,
      type: null,
      serviceid: null,
      position: {
        x: null,
        y: null
      },
      params: [],
      output: {
        id: null,
        type: null
      }
    }
    return data
  }

  orderData () {
    /*
   模组边连接参数数据结构
    */
    const data = {
      id: null,
      prev_stepid: null,
      next_stepid: null,
      param: null
    }
    return data
  }

  paramsData (type = 'string') {
    /*
   模组/构件输入参数数据结构
    */
    const data = {
      // 输入参数id
      id: null,
      // 输入参数类型
      type: type,
      // 输入参数名称
      label: null,
      name: null,
      // 输入参数值
      data: null,
      value: null,
      // 参数值来源
      source: null,
      // 额外数据
      options: {
        // 参数标签
        tag: null,
        // 参数默认值
        default: JSON.parse(JSON.stringify(paramsInitValue[type])),
        // 参数枚举值
        enumeration: [],
        scope: [],
        // 正则验证规则
        regular: null,
        // 字段对应的中文名称
        header: null,
        // InOps专用
        script: null,
        // InOps专用
        max: null
      }
    }
    return data
  }

  outputData () {
    /*
   antv/X6输出桩参数数据结构
    */
    const data = {
      group: 'out',
      name: '输出参数',
      attrs: null,
      type: null
    }
    return data
  }

  inputData () {
    /*
    antv/X6输入桩参数数据结构
     */
    const data = {
      id: null,
      name: null,
      label: null,
      type: null,
      index: null,
      group: 'in',
      options: null,
      args: {
        x: null,
        y: null
      },
      source: null,
      connected: false,
      value: null
    }
    return data
  }

  inputOrderData () {
    /*
    antv/X6顺序桩参数数据结构
     */
    const data = {
      group: 'in',
      name: '顺序桩',
      connected: false,
      type: 'void',
      value: [],
      args: {
        x: null,
        y: null
      },
      source: 'order'
    }
    return data
  }

  cellData (obj) {
    /*
    antv/X6节点参数数据结构
     */
    const data = {
      shape: 'vue-shape',
      width: 250,
      height: obj.nodeHeight,
      attrs: {
        info: obj.nodeObj
      },
      component: obj.nodeObj.nodeType === 'step' ? obj.nodeName : obj.paramName,
      ports: {
        groups: {
          out: {
            position: 'right',
            label: {
              position: 'right'
            },
            attrs: {
              circle: {
                r: 10,
                magnet: true,
                stroke: '#00bbec',
                strokeWidth: 6,
                fill: '#ffffff',
                style: {
                  visibility: obj.visibility
                }
              }
            }
          },
          in: {
            position: {
              name: 'absolute'
            },
            attrs: {
              circle: {
                r: 10,
                magnet: true,
                stroke: '#00bbec',
                strokeWidth: 6,
                fill: '#ffffff',
                style: {
                  visibility: obj.visibility
                }
              }
            }
          }
        },
        items: obj.nodePorts
      }
    }
    return data
  }
}
const DataStructure = new Data()
export default DataStructure
