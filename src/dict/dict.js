// 构件模块的字典数据
const serverDict = {
  computer: '计算节点',
  mange: '管理节点',
  storage: '存储节点'
}

// 容灾模块的字典数据
const disasterDict = {
  memory: '虚拟机内存',
  server_memory: '服务器内存',
  cpu: '虚拟机CPU',
  server_cpu: '服务器CPU',
  ha_vnf_group: '高可用组',
  vm_aggregate: '虚拟反亲和组'
}

const sysStatus = {
  0: {
    label: '正常',
    color: 'positive'
  },
  1: {
    label: '停用',
    color: 'negative'
  },
  GET: {
    label: 'GET',
    color: 'green'
  },
  POST: {
    label: 'POST',
    color: 'primary'
  },
  DELETE: {
    label: 'DELETE',
    color: 'red'
  },
  PUT: {
    label: 'PUT',
    color: 'cyan'
  }
}

const cmdbRecordDict = {
  vm: '虚拟机',
  vnf: 'VNF'
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
  list_string: 'listStringCompNew',
  network: 'networksCompNew'
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
  list_string: 'ListStringInputComp',
  network: 'NetworkInputComp'
}

// 类型、标签对应的展示器组件
const paramDisplayDict = {
  string: 'generalDisplay',
  int: 'generalDisplay',
  boolean: 'generalDisplay',
  all: 'allDisplay',
  list_string: 'generalDisplay',
  list_object: 'generalDisplay',
  object: 'generalDisplay'
}

// 单数数据类型
const singularType = ['string', 'int']

// 复数数据类型
const pluralType = ['list_string']

// CMDB特殊数据类型
const cmdbType = ['network', 'host']

// 构件输入参数类型数组
const serviceInputType = ['string', 'int', 'boolean', 'object', 'list_string', 'list_object', 'all']

// 模组全局参数类型数组
const modInputType = ['string', 'int', 'boolean', 'list_string']

// 构件输出参数类型数组
const serviceOutputType = ['string', 'int', 'boolean', 'object', 'list_string', 'list_object']

// 构件分类数据
const serviceType = ['触发器', '转换器', '执行器', '逻辑器']
const serviceTypeShow = [
  {
    label: '执行器',
    data: [],
    value: '执行器'
  },
  {
    label: '转换器',
    data: [],
    value: '转换器'
  },
  {
    label: '触发器',
    data: [],
    value: '触发器'
  },
  {
    label: '逻辑器',
    data: [],
    value: '逻辑器'
  }
]

// 构件参数---options参数的default初始值
const paramsInitValue = {
  string: null,
  int: null,
  boolean: null,
  list_string: [],
  list_object: [],
  object: null,
  all: []
}

// 构件参数类型对应的标签信息
const paramsTags = {
  string: ['host', 'telephone', 'ip', 'email'],
  int: null,
  boolean: null,
  object: null,
  list_string: ['host', 'network', 'ip', 'email', 'telephone'],
  list_object: ['inops', 'dataCheck'],
  all: null
}

// 数据类型的验证规则
const ruleDict = {
  ip: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/,
  telephone: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
  email: /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/,
  // email: /^\w+@\w+\.\w+$/,
  host: null,
  network: null
}

module.exports = {
  ruleDict,
  serverDict,
  disasterDict,
  sysStatus,
  paramsInitValue,
  paramDisplayDict,
  serviceType,
  singularType,
  pluralType,
  serviceTypeShow,
  cmdbType,
  paramsTags,
  modInputType,
  serviceInputType,
  serviceOutputType,
  tagSelectDict,
  tagInputDict,
  cmdbRecordDict
}
