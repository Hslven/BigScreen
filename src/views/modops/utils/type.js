// 构件输入参数类型数组
const serviceInputType = ['string', 'int', 'boolean', 'object', 'list_string', 'list_object', 'all']

const serviceInputTypeOptions = [
  {
    label: '字符串',
    value: 'string'
  },
  {
    label: '整型',
    value: 'int'
  },
  {
    label: '布尔值',
    value: 'boolean'
  },
  {
    label: '对象',
    value: 'object'
  },
  {
    label: '字符串列表',
    value: 'list_string'
  },
  {
    label: '列表对象',
    value: 'list_object'
  },
  {
    label: '多类型',
    value: 'all'
  }
]

// 构件输出参数类型数组
const serviceOutputType = ['string', 'int', 'boolean', 'object', 'list_string', 'list_object']

const serviceOutputTypeOptions = [
  {
    label: '字符串',
    value: 'string'
  },
  {
    label: '整型',
    value: 'int'
  },
  {
    label: '布尔值',
    value: 'boolean'
  },
  {
    label: '对象',
    value: 'object'
  },
  {
    label: '字符串列表',
    value: 'list_string'
  },
  {
    label: '列表对象',
    value: 'list_object'
  }
]

// 模组全局参数类型数组
const modInputType = ['string', 'int', 'boolean', 'list_string']

const modInputTypeOptions = [
  {
    label: '字符串',
    value: 'string'
  },
  {
    label: '整型',
    value: 'int'
  },
  {
    label: '布尔值',
    value: 'boolean'
  },
  {
    label: '字符串列表',
    value: 'list_string'
  }
]

// CMDB特殊数据类型
const cmdbType = ['network', 'host']

// 构件分类数据
const serviceCategory = ['触发器', '转换器', '执行器', '逻辑器']

const serviceCategoryOptions = [
  {
    label: '触发器',
    value: '触发器'
  },
  {
    label: '转换器',
    value: '转换器'
  },
  {
    label: '执行器',
    value: '执行器'
  },
  {
    label: '逻辑器',
    value: '逻辑器'
  }
]

// 构件参数类型对应的标签信息
const paramsTags = {
  string: ['host', 'telephone', 'ip', 'email'],
  int: null,
  boolean: null,
  object: null,
  list_string: ['host', 'ip', 'email', 'telephone'],
  list_object: ['inops', 'dataCheck'],
  all: null
}

// 类型、标签对应的选择器组件
const tagSelectDict = {
  string: 'stringCompNew',
  boolean: 'booleanCompNew',
  int: 'intCompNew',
  all: 'allCompNew',
  object: 'objectCompNew',
  list_object: 'listObjectCompNew',
  host: 'hostsCompNew',
  list_string: 'listStringCompNew'
  // network: 'networksCompNew'
}

// 类型、标签对应的固定值输入组件
const tagInputDict = {
  string: 'StringInputComp',
  boolean: 'BooleanInputComp',
  int: 'IntInputComp',
  all: 'AllInputComp',
  object: 'ObjectInputComp',
  list_object: 'ListObjectInputComp',
  host: 'HostInputComp',
  list_string: 'ListStringInputComp'
  // network: 'NetworkInputComp'
}

// 构件状态
const serviceStatus = {
  Running: {
    border: '1px solid rgba(79, 193, 233, 0.5)',
    boxShadow: '0px 0px 5px 5px rgba(79, 193 ,233, 0.3)',
    color: '#242E42'
  },
  Init: {
    border: '1px solid rgba(79, 193, 233, 0.5)',
    boxShadow: '0px 0px 5px 5px rgba(79, 193 ,233, 0.3)',
    color: '#00bbec'
  },
  waiting: {
    border: '1px solid rgba(79, 193, 233, 0.5)',
    boxShadow: '0px 0px 5px 5px rgba(79, 193 ,233, 0.3)',
    color: '#242E42'
  },
  Waitting: {
    border: '1px solid rgba(79, 193, 233, 0.5)',
    boxShadow: '0px 0px 5px 5px rgba(79, 193 ,233, 0.3)',
    color: '#242E42'
  },
  Success: {
    border: '1px solid rgba(85, 188, 138, 0.5)',
    boxShadow: '0px 0px 5px 5px rgba(85, 188, 138, 0.3)',
    color: '#55BC8A'
  },
  Failed: {
    border: '1px solid rgba(171,47,41,0.5)',
    boxShadow: '0 0 5px 5px rgba(171,47,41,0.3)',
    color: '#AB2F29'
  },
  Pending: {
    border: '1px solid rgba(79, 193, 233, 0.5)',
    boxShadow: '0px 0px 5px 5px rgba(79, 193 ,233, 0.3)',
    color: '#242E42'
  },
  Block: {
    border: '1px solid rgba(79, 193, 233, 0.5)',
    boxShadow: '0px 0px 5px 5px rgba(79, 193 ,233, 0.3)',
    color: '#242E42'
  }
}

module.exports = {
  serviceInputType,
  serviceOutputType,
  modInputType,
  serviceCategory,
  paramsTags,
  tagSelectDict,
  cmdbType,
  tagInputDict,
  serviceStatus,
  serviceCategoryOptions,
  serviceOutputTypeOptions,
  serviceInputTypeOptions,
  modInputTypeOptions
}
