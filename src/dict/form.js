const loginForm = {
  fields: {
    userName: '',
    password: ''
  },
  rules: {
    userName: [val => (val && val.length > 0) || '不能为空'],
    password: [val => (val && val.length > 0) || '不能为空']
  }
}

const networkHistoryReportForm = {
  fields: {
    network_elet_name: '',
    beigin_date: '',
    end_date: ''
  },
  rules: {}
}

const networkReportForm = {
  fields: {
    network_element: '',
    operation_user: '',
    area: '',
    hardware_resource_pool: '',
    virtual_resource_pool: '',
    application_descr: '预定三个月内',
    cpu: 0,
    memory: 0,
    hard_disk: 0,
    network: 0
  },
  rules: {}
}

const paramsForm = {
  fields: {
    label: '',
    type: '',
    options: {
      default: '',
      enumeration: [],
      regular: ''
    }
  },
  rules: {}
}

const modForm = {
  fields: {
    name: '',
    description: '',
    author: '',
    params: [],
    steps: [],
    orders: [],
    is_on: false
  },
  rules: {}
}

const serviceForm = {
  fields: {
    name: '',
    version: 1,
    author: '',
    description: '',
    key: '',
    input: [],
    output: ''
  },
  rules: {}
}

const disasterForm = {
  fields: {
    vnf_name: '',
    high_available_type: ''
  },
  rules: {}
}

module.exports = {
  loginForm,
  networkHistoryReportForm,
  networkReportForm,
  paramsForm,
  modForm,
  serviceForm,
  disasterForm
}
