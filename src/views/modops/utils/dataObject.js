/*
   构件信息参数数据结构
*/
const serviceObj = {
  // _id: null, //构件id，modserver后端自动生成
  id: '',
  name: '',
  version: 1,
  description: '',
  author: '',
  key: '', // 构件唯一标识，即MQ的队列名
  category: '',
  input: [],
  output: {
    type: '',
    name: '输出参数',
    group: 'out',
    data: '',
    args: { x: '', y: '' },
    relation: [],
    options: {}
  },
  nodeType: 'step',
  createdAt: '', // 构件创建时间
  updatedAt: '', // 构件更新时间
  status: 'Waitting' // 构件状态
}

// 构件参数---options参数的default初始值
const inputDefaultInit = {
  string: '',
  int: '',
  boolean: false,
  list_string: [],
  list_object: [],
  object: null,
  all: []
}
const OutputInitObj = {
  type: '',
  name: '输出参数',
  group: 'out',
  data: '',
  args: { x: '', y: '' },
  relation: [],
  options: {}
}
const OrderInitObj = {
  type: 'void',
  name: '顺序桩',
  group: 'in',
  connected: false,
  value: [],
  args: {
    x: null,
    y: null
  },
  source: 'order',
  options: {}
}

const InstanceObj = (id) => {
  return {
    instanceId: '',
    modid: id,
    userid: 'Azrael',
    source: 'manual',
    params: []
  }
}

const InputInitObj = (item) => {
  return {
    // id: '', // 输入参数唯一标识(输入参数ID)
    type: item, // 输入参数类型
    tag: '', // 输入参数标签
    name: '', // 输入参数名称
    value: [], // 输入参数值。五种值：1. 当source为value时，该值为输入值；2. 当source为mod时，该值为全局参数的索引值；3. 当source为step时，该值为上一个构件实例的step id；4. 当source为order时，该值为一个列表，包含多个构件实例的step id；5. 当source为null时，该值为0
    group: 'in', // 区分输入桩与输出桩
    connected: false, // 用于判断该输入桩是否已被连
    args: { x: '', y: '' }, // 用于计算输入桩的位置
    nodeType: 'step',
    // index: Number, // 当输入桩的来源是模组全局参数是，该索引表示为第几个参数
    source: '', // 输入参数值来源，包括五种标识：1. 固定值输入：value；2. 模组全局参数的第几个参数: mod；3. 构件实例step的输出: step；4. 只定义顺序,不传递参数: order；5. 未定义: null
    index: 0,
    // source_label: '', // 输入参数值来源名称
    // source_type: '', // 输入参数值来源类型
    // source_id: '', // 输入参数值来源ID
    options: { // 输入参数额外参数
      default: inputDefaultInit[item], // 输入参数默认值
      enumeration: [], // 输入参数枚举值
      scope: [], // 输入参数可接收类型范围
      regular: '', // 输入参数正则规则
      header: null, // 输入参数字段对应的中文名
      sheet: false // 在excel文件生成构件中指定是否生成多个sheet表
      // script: '' // inops构件的自需参数 --- 脚本名称
      // max: Number // inops构件的自需参数
    }
  }
}

const modObj = {
  name: '',
  description: '',
  author: '',
  params: [],
  steps: [],
  orders: [],
  createdAt: '',
  updatedAt: '',
  release: false
}

const modExtra = {
  mod: {
    name: '',
    description: ''
  }
}

const CellInitObj = (obj) => {
  return {
    shape: obj.nodeObj.nodeType === 'step' ? obj.nodeName : obj.paramName,
    width: 250,
    height: obj.nodeHeight,
    data: obj.nodeObj,
    component: obj.nodeObj.nodeType === 'step' ? obj.nodeName : obj.paramName,
    ports: {
      groups: {
        out: {
          position: {
            name: 'absolute'
          },
          label: {
            position: 'right'
          },
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: 'rgb(18, 170, 253)',
              strokeWidth: 4,
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
              r: 6,
              magnet: true,
              stroke: 'rgb(18, 170, 253)',
              strokeWidth: 4,
              fill: '#ffffff',
              style: {
                visibility: obj.visibility
              }
            }
          }
        }
      },
      items: obj.nodeObj.ports
    }
  }
}

const scheduleObj = {
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

module.exports = {
  InputInitObj,
  OutputInitObj,
  inputDefaultInit,
  serviceObj,
  OrderInitObj,
  modObj,
  CellInitObj,
  InstanceObj,
  scheduleObj,
  modExtra
}
