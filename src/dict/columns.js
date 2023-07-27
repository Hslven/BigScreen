/*
* 表格字段信息
* */

const haTable = {
  columns: [
    {
      colKey: 'name',
      title: 'HA名称',
      align: 'left',
      width: '390'
    },
    { colKey: 'cpu_project', align: 'left', title: '已用规划CPU' },
    { colKey: 'cpu_usable_project', title: '可用规划CPU', align: 'left' },
    { colKey: 'cpu_precent_project', title: '规划CPU使用率', align: 'left' },
    { colKey: 'cpu_used', align: 'left', title: '已用现网CPU' },
    { colKey: 'cpu_usable', title: '可用现网CPU', align: 'left' },
    { colKey: 'cpu_precent', title: '现网CPU使用率', align: 'left' },
    { colKey: 'memory_project', align: 'left', title: '已用规划内存(GB)' },
    { colKey: 'memory_usable_project', title: '可用规划内存(GB)', align: 'left' },
    { colKey: 'memory_precent_project', title: '规划内存使用率', align: 'left' },
    { colKey: 'memory_used', align: 'left', title: '已用现网内存(GB)' },
    { colKey: 'memory_usable', title: '可用现网内存(GB)', align: 'left' },
    { colKey: 'memory_precent', title: '现网内存使用率', align: 'left' },
    { colKey: 'storage_project', align: 'left', title: '已用规划存储(GB)' },
    { colKey: 'storage_usable_project', title: '可用规划存储(GB)', align: 'left' },
    { colKey: 'storage_precent_project', title: '规划存储使用率', align: 'left' },
    { colKey: 'storage_used', align: 'left', title: '已用现网存储(GB)' },
    { colKey: 'storage_usable', title: '可用现网存储(GB)', align: 'left' },
    { colKey: 'storage_precent', title: '现网存储使用率', align: 'left' }
  ],
  visibleColumns: ['name', 'colKey', 'cpu_precent_project', 'cpu_precent', 'memory_precent_project', 'memory_precent', 'storage_precent_project', 'storage_precent']
}

const networkTable = {
  columns: [
    {
      colKey: 'name',
      title: '网元名称',
      align: 'left'
    },
    { colKey: 'storagePercent', title: '存储使用率(GB)', align: 'left' },
    { colKey: 'memoryPercent', title: '内存使用率(GB)', align: 'left' },
    { colKey: 'cpuPercent', title: 'CPU使用率', align: 'left' }
  ],
  visibleColumns: ['name', 'storagePercent', 'memoryPercent', 'cpuPercent']
}

const modTable = {
  columns: [
    {
      colKey: 'name',
      align: 'left',
      title: '模组名',
      width: '1000'
    },
    {
      colKey: 'params',
      align: 'left',
      title: '全局参数'
    },
    {
      colKey: 'author',
      align: 'left',
      title: '创建者'
    },
    {
      colKey: 'release',
      align: 'left',
      title: '发布'
    },
    { colKey: 'operation', align: 'left', title: '操作', fixed: 'right' }
  ],
  visibleColumns: []
}

const scheduleTable = {
  columns: [
    {
      colKey: 'name',
      align: 'left',
      title: '模组名',
      className: () => 'table-font-main'
    },
    {
      colKey: 'user',
      align: 'left',
      title: '执行者'
    },
    {
      colKey: 'plan',
      align: 'left',
      title: '计划任务'
    },
    { colKey: 'operation', align: 'left', title: '操作' }
  ],
  visibleColumns: []
}

const serviceTable = {
  columns: [
    {
      colKey: 'name',
      align: 'left',
      title: '构件名',
      width: '400'
    },
    {
      colKey: 'status',
      align: 'left',
      title: '状态'
    },
    {
      colKey: 'input',
      align: 'left',
      title: '输入参数'
    },
    {
      colKey: 'output.type',
      align: 'left',
      title: '输出类型',
      cell: 'output-type-slot'
    },
    {
      colKey: 'author',
      align: 'left',
      title: '创建者'
    },
    {
      colKey: 'createdAt',
      align: 'left',
      title: '创建时间'
    },
    { colKey: 'key', align: 'left', title: 'key', width: '300' },
    { colKey: 'operation', align: 'left', title: '操作', fixed: 'right' }
  ],
  visibleColumns: []
}

const businessTable = {
  columns: [
    {
      colKey: 'business_system',
      align: 'left',
      title: '业务系统名称',
      className: () => 'table-font-main'
    },
    { colKey: 'app_name', align: 'left', title: 'APP' },
    { colKey: 'resource_pool', align: 'left', title: '所在资源池' },
    {
      colKey: 'vnf_name',
      align: 'left',
      title: '网元'
    },
    {
      colKey: 'vlan_id',
      align: 'left',
      title: '业务vlan ID'
    },
    {
      colKey: 'gateway_interface',
      align: 'center',
      title: '网关接口'
    },
    { colKey: 'vrf_name', align: 'left', title: 'VRF' },
    { colKey: 'locate_device', align: 'left', title: '网关所在设备' },
    {
      colKey: 'nexthop_ip',
      align: 'left',
      title: '下一跳地址',
      cell: 'ip-slot'
    },
    {
      colKey: 'destination_ip',
      align: 'left',
      title: '目的地址',
      cell: 'ip-slot'
    },
    { colKey: 'gateway_ip', align: 'left', title: '网关IP' },
    {
      colKey: 'vrrp_ip',
      align: 'left',
      title: 'VRRP接口地址',
      cell: 'ip-slot'
    },
    { colKey: 'subnet_name', align: 'left', title: '所用子网' }
  ],
  visibleColumns: ['business_system', 'app_name', 'resource_pool', 'vnf_name', 'vlan_id', 'gateway_ip']
}

const cmnetIpTable = {
  columns: [
    {
      colKey: 'name',
      align: 'left',
      title: '名称',
      className: () => 'table-font-main',
      ellipsis: {
        theme: 'light',
        placement: 'bottom'
      }
      // width: '220'
    },
    {
      colKey: 'ip',
      align: 'left',
      title: 'IP',
      field: 'ip',
      ellipsis: {
        theme: 'light',
        placement: 'bottom'
      }
      // width: '180'
    },
    { colKey: 'resource_type', align: 'left', title: '资源类型', ellipsisTitle: true },
    { colKey: 'type', align: 'left', title: '类型' },
    { colKey: 'city', align: 'left', title: '所处地市', ellipsisTitle: true },
    {
      colKey: 'desc',
      align: 'left',
      title: '描述',
      ellipsis: {
        theme: 'light',
        placement: 'bottom'
      }
      // width: '180'
    },
    { colKey: 'domain_name', align: 'left', title: '域名' },
    {
      colKey: 'purpose',
      align: 'left',
      title: '用途',
      ellipsis: {
        theme: 'light',
        placement: 'bottom'
      }
      // width: '140'
    },
    {
      colKey: 'remark',
      align: 'left',
      title: '备注',
      ellipsis: {
        theme: 'light',
        placement: 'bottom'
      }
      // width: '120'
    },
    { colKey: 'related_fwnat_ip', align: 'left', title: '关联FWNAT地址', ellipsisTitle: true },
    {
      colKey: 'belong_hardware',
      align: 'left',
      title: '配置于硬件设备',
      ellipsis: {
        theme: 'light',
        placement: 'bottom'
      }
      // width: '160'
    },
    {
      colKey: 'related_logic_port',
      align: 'left',
      title: '关联逻辑端口',
      ellipsis: {
        theme: 'light',
        placement: 'bottom'
      }
      // width: '160'
    },
    {
      colKey: 'data_src_type',
      align: 'center',
      title: '录入方式',
      ellipsis: {
        theme: 'light',
        placement: 'bottom'
      }
      // width: '80'
    },
    { colKey: 'project_period', align: 'left', title: '工程期数', ellipsisTitle: true }
  ],
  visibleColumns: ['name', 'ip', 'resource_type', 'related_fwnat_ip', 'belong_hardware', 'related_logic_port', 'type', 'city', 'domain_name']
}

const verticalMapTable = {
  columns: [
    {
      colKey: 'resource_pool',
      align: 'left',
      title: '所在资源池'
    },
    {
      colKey: 'computer_server',
      align: 'left',
      title: '计算服务器'
    },
    {
      colKey: 'ha',
      align: 'left',
      title: '主机组'
    },
    {
      colKey: 'ha_vim',
      align: 'left',
      title: 'HA租户'
    },
    {
      colKey: 'cp_model',
      align: 'left',
      title: '所属网络云模块'
    },
    {
      colKey: 'vm',
      align: 'left',
      title: '虚拟机'
    },
    {
      colKey: 'vnf',
      align: 'left',
      title: 'VNF'
    },
    {
      colKey: 'business',
      align: 'left',
      title: '业务'
    },
    {
      colKey: 'computer_server_st_tor',
      align: 'left',
      title: '计算服务器的存储TOR'
    },
    {
      colKey: 'computer_server_s_tor',
      align: 'left',
      title: '计算服务器业务TOR'
    },
    {
      colKey: 'computer_server_m_tor',
      align: 'left',
      title: '计算服务器管理TOR'
    },
    {
      colKey: 'computer_server_dm_tor',
      align: 'left',
      title: '计算服务器硬管TOR'
    },
    {
      colKey: 'storage_server_st_tor',
      align: 'left',
      title: '存储服务器存储TOR'
    },
    // {
    //   colKey: 'storage_server_s_tor',
    //   align: 'left',
    //   title: '存储服务器业务TOR'
    // },
    {
      colKey: 'storage_server_dm_tor',
      align: 'left',
      title: '存储服务器硬管TOR'
    },
    {
      colKey: 'storage_server_m_tor',
      align: 'left',
      title: '存储服务器管理TOR'
    },
    {
      colKey: 'storage_cluster',
      align: 'left',
      title: '存储集群'
    },
    {
      colKey: 'storage_pool',
      align: 'left',
      title: '存储池'
    },
    {
      colKey: 'storage_server',
      align: 'left',
      title: '存储服务器'
    }
  ],
  visibleColumns: ['resource_pool', 'computer_server', 'ha', 'ha_vim', 'cp_model', 'vm', 'vnf', 'business', 'computer_server_st_tor', 'computer_server_s_tor', 'computer_server_m_tor', 'computer_server_dm_tor', 'storage_server_st_tor', 'storage_server_dm_tor', 'storage_server_m_tor', 'storage_cluster', 'storage_pool', 'storage_server']
}

const vlanTable = {
  columns: [
    {
      colKey: 'vlan_id',
      align: 'left',
      title: 'VlanID',
      className: () => 'table-font-main'
    },
    { colKey: 'gateway_interface', align: 'left', title: '网关接口' },
    { colKey: 'resource_pool', align: 'left', title: '所在资源池' },
    {
      colKey: 'gateway_ip',
      align: 'left',
      title: '网关地址'
    },
    {
      colKey: 'vrf_name',
      align: 'left',
      title: 'vrf名称',
      width: '100'
    },
    {
      colKey: 'locate_device',
      align: 'left',
      title: '网关所在设备'
    },
    { colKey: 'subnet_name', align: 'left', title: '所用子网' }
  ],
  visibleColumns: ['vlan_id', 'resource_pool', 'gateway_ip', 'vrf_name', 'locate_device', 'subnet_name']
}

const modRoleTable = {
  columns: [
    {
      colKey: 'role_name',
      align: 'left',
      title: '角色名',
      cell: 'role-name-slot'
    },
    { colKey: 'category', align: 'left', title: '分类' },
    { colKey: 'status', align: 'left', title: '状态', cell: 'status-slot' },
    { colKey: 'operation', align: 'center', title: '操作' }
  ],
  visibleColumns: ['role_name', 'category', 'status', 'operation']
}

const modPermissionTable = {
  columns: [
    {
      colKey: 'permission_name',
      align: 'left',
      title: '权限名',
      cell: 'permission-name-slot'
    },
    { colKey: 'element_id', align: 'left', title: '唯一标识' },
    { colKey: 'operation_type', align: 'left', title: '操作类型', cell: 'operation-slot' },
    { colKey: 'category', align: 'left', title: '分类', cell: 'category-slot' },
    { colKey: 'status', align: 'left', title: '状态', cell: 'status-slot' },
    { colKey: 'operation', align: 'center', title: '操作' }
  ],
  visibleColumns: ['permission_name', 'element_id', 'operation_type', 'category', 'status', 'operation']
}

const userTable = {
  columns: [
    {
      colKey: 'userName',
      align: 'left',
      title: '用户名',
      sortType: 'all',
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      cell: 'username-slot'
    },
    {
      colKey: 'nickName',
      align: 'left',
      sortType: 'all',
      sorter: (a, b) => a.nickName?.localeCompare(b.nickName),
      title: '用户昵称'
    },
    {
      colKey: 'status',
      align: 'left',
      title: '状态',
      sortType: 'all',
      sorter: (a, b) => parseInt(a.status) - parseInt(b.status),
      cell: 'status-slot'
    },
    {
      colKey: 'createBy',
      align: 'left',
      title: '创建者'
    },
    {
      colKey: 'roles',
      align: 'left',
      title: '角色组',
      cell: 'roles-slot',
      width: '340'
    },
    {
      colKey: 'createTime',
      align: 'left',
      sortType: 'all',
      sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
      title: '创建时间'
    },
    {
      colKey: 'phonenumber',
      align: 'left',
      title: '电话',
      sortType: 'all',
      sorter: (a, b) => a.phonenumber?.localeCompare(b.phonenumber)
    },
    {
      colKey: 'email',
      align: 'left',
      title: '邮箱',
      sortType: 'all',
      sorter: (a, b) => a.email?.localeCompare(b.email)
    },
    { colKey: 'operation', align: 'left', title: '操作' }
  ],
  visibleColumns: []
}

const roleTable = {
  columns: [
    {
      colKey: 'roleName',
      align: 'left',
      title: '角色名',
      sortType: 'all',
      sorter: (a, b) => a.roleName.localeCompare(b.roleName),
      cell: 'rolename-slot'
    },
    {
      colKey: 'createBy',
      align: 'left',
      title: '创建者'
    },
    {
      colKey: 'createTime',
      align: 'left',
      title: '创建时间',
      sortType: 'all',
      sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
    },
    {
      colKey: 'status',
      align: 'left',
      title: '状态',
      sortType: 'all',
      sorter: (a, b) => parseInt(a.status) - parseInt(b.status),
      cell: 'status-slot'
    },
    { colKey: 'operation', align: 'center', title: '操作' },
    { colKey: 'auth', align: 'center', title: '授权' }
  ],
  visibleColumns: []
}

const appTable = {
  columns: [
    {
      colKey: 'appName',
      align: 'left',
      title: '应用名',
      sortType: 'all',
      sorter: (a, b) => a.appName.localeCompare(b.appName),
      cell: 'app-name-slot'
    },
    {
      colKey: 'appId',
      align: 'left',
      title: 'appId'
    },
    {
      colKey: 'appSecret',
      align: 'left',
      title: 'appSecret'
    },
    {
      colKey: 'createBy',
      align: 'left',
      title: '创建者'
    },
    {
      colKey: 'createTime',
      align: 'left',
      title: '创建时间',
      sortType: 'all',
      sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime()
    },
    { colKey: 'operation', align: 'center', title: '操作' }
  ],
  visibleColumns: []
}

const permissionTable = {
  columns: [
    {
      colKey: 'permissionName',
      align: 'left',
      title: '权限名',
      sortType: 'all',
      sorter: (a, b) => a.permissionName.localeCompare(b.permissionName),
      cell: 'permission-name-slot'
    },
    {
      colKey: 'serverName',
      align: 'left',
      sortType: 'all',
      sorter: (a, b) => a.serverName?.localeCompare(b.serverName),
      title: '服务名'
    },
    {
      colKey: 'method',
      align: 'left',
      title: '请求方式',
      sortType: 'all',
      sorter: (a, b) => a.method?.localeCompare(b.method)
    },
    {
      colKey: 'path',
      align: 'left',
      title: '请求路径',
      sortType: 'all',
      sorter: (a, b) => a.path?.localeCompare(b.path)
    },
    {
      colKey: 'createBy',
      align: 'left',
      title: '创建者',
      sortType: 'all',
      sorter: (a, b) => a.path?.localeCompare(b.path)
    },
    {
      colKey: 'remark',
      align: 'left',
      title: '备注'
    },
    {
      colKey: 'status',
      align: 'left',
      title: '状态',
      sortType: 'all',
      sorter: (a, b) => parseInt(a.status) - parseInt(b.status),
      cell: 'status-slot'
    },
    { colKey: 'operation', align: 'center', title: '操作' }
  ],
  visibleColumns: []
}

const disasterTable = {
  columns: [
    {
      name: 'vnf_name',
      align: 'left',
      required: true,
      label: '业务网元',
      field: row => row.vnf_name,
      format: val => `${val}`,
      sortable: true
    },
    {
      name: 'spare_vnf_name',
      align: 'left',
      label: '备灾网元',
      sortable: true,
      field: 'spare_vnf_name'
    },
    {
      name: 'high_available_type',
      align: 'left',
      label: '高可用类型',
      sortable: true,
      field: 'high_available_type'
    },
    {
      name: 'disaster_count',
      align: 'left',
      label: '容灾次数(虚拟机迁移次数)',
      sortable: true,
      field: 'disaster_count'
    }
  ],
  visibleColumns: []
}

const storageTable = {
  columns: [
    {
      colKey: 'storage_pool_name',
      align: 'left',
      title: '分布式存储池',
      className: () => 'table-font-main'
    },
    {
      colKey: 'total_capacity',
      align: 'left',
      title: '总容量(GB)',
      sorter: (a, b) => parseInt(a.total_capacity) - parseInt(b.total_capacity)
    },
    {
      colKey: 'allocated_capacity',
      align: 'left',
      title: '已分配(GB)',
      sorter: (a, b) => parseInt(a.allocated_capacity) - parseInt(b.allocated_capacity)
    },
    {
      colKey: 'reference_capacity',
      align: 'left',
      title: '参考容量(95%总容量)',
      sorter: (a, b) => parseInt(a.reference_capacity) - parseInt(b.reference_capacity)
    },
    {
      colKey: 'available_capacity',
      align: 'left',
      title: '可用容量(GB)',
      sorter: (a, b) => parseInt(a.available_capacity) - parseInt(b.available_capacity)
    }
  ],
  visibleColumns: []
}

const cpuTable = {
  columns: [
    {
      colKey: 'ha_name',
      align: 'left',
      title: 'HA名称'
    },
    {
      colKey: 'cpu_total_capacity',
      align: 'left',
      title: '标准CPU总量',
      sorter: (a, b) => parseInt(a.cpu_total_capacity) - parseInt(b.cpu_total_capacity)
    },
    {
      colKey: 'cpu_used_capacity',
      align: 'left',
      title: '现网已用CPU',
      sorter: (a, b) => parseInt(a.cpu_used_capacity) - parseInt(b.cpu_used_capacity)
    },
    {
      colKey: 'cpu_plan_capacity',
      align: 'left',
      title: '规划CPU',
      sorter: (a, b) => parseInt(a.cpu_plan_capacity) - parseInt(b.cpu_plan_capacity)
    },
    {
      colKey: 'reference_capacity',
      align: 'left',
      title: '參考CPU总量(85%CPU)',
      sorter: (a, b) => parseInt(a.reference_capacity) - parseInt(b.reference_capacity)
    },
    {
      colKey: 'available_capacity',
      align: 'left',
      title: '可用CPU',
      sorter: (a, b) => parseInt(a.available_capacity) - parseInt(b.available_capacity)
    }
  ],
  visibleColumns: []
}

const modLogTable = {
  columns: [
    {
      colKey: 'name',
      align: 'left',
      title: '模组',
      width: '500'
    },
    {
      colKey: 'user',
      align: 'left',
      title: '执行者'
    },
    {
      colKey: 'status',
      align: 'left',
      title: '执行状态'
    },
    {
      colKey: 'executionTime',
      align: 'left',
      title: '执行时间'
    },
    {
      colKey: 'timeConsuming',
      align: 'left',
      title: '耗时'
    }
  ],
  visibleColumns: []
}

// 机房概览
const machineTapble = {
  columns: [
    {
      colKey: 'resource_pool',
      align: 'left',
      title: '资源池',
      ellipsisTitle: true,
      ellipsis: true
      // 设置单元格类名
      // attrs: ({ row }) => {
      //   return {
      //     style: {
      //       fontWeight: 600
      //     }
      //   }
      // }
    },
    {
      colKey: 'machine_room',
      align: 'left',
      title: '机房',
      ellipsisTitle: true,
      ellipsis: true
      // 设置单元格类名
      // attrs: ({ row }) => {
      //   return {
      //     style: {
      //       fontWeight: 600
      //     }
      //   }
      // }
    },
    {
      colKey: 'project_period',
      align: 'left',
      title: '工程期数',
      ellipsisTitle: true,
      ellipsis: true
      // 设置单元格类名
      // attrs: ({ row }) => {
      //   return {
      //     style: {
      //       fontWeight: 600
      //     }
      //   }
      // }
    },
    {
      colKey: 'host_server_num',
      align: 'left',
      title: '计算设备数量',
      ellipsisTitle: true,
      ellipsis: true
    },
    {
      colKey: 'storage_server_num',
      align: 'left',
      title: '存储设备数量',
      ellipsis: true,
      // width: 60,
      ellipsisTitle: true
    },
    {
      colKey: 'router_num',
      align: 'left',
      title: '路由机设备数量',
      ellipsis: true,
      // width: 60,
      ellipsisTitle: true
    },
    {
      colKey: 'switch_num',
      align: 'left',
      title: '交换机设备数量',
      ellipsis: true,
      // width: 60,
      ellipsisTitle: true
    },
    {
      colKey: 'firewall_num',
      align: 'left',
      title: '防火墙设备数量',
      ellipsis: true,
      // width: 60,
      ellipsisTitle: true
    },
    {
      colKey: 'business',
      align: 'left',
      title: '业务情况',
      // width: 160,
      ellipsis: true,
      ellipsisTitle: true
    },
    {
      colKey: 'power_supply_mode',
      align: 'left',
      title: '供电模式',
      ellipsisTitle: true,
      ellipsis: true
    },
    {
      colKey: 'hardware_manufacturers',
      align: 'left',
      title: '硬件设备厂家',
      ellipsis: true,
      ellipsisTitle: true
    },
    {
      colKey: 'hardware_model',
      align: 'left',
      title: '设备型号',
      ellipsis: true,
      ellipsisTitle: true
    },
    {
      colKey: 'software_manufacturers',
      align: 'left',
      title: '软件厂家',
      ellipsis: true,
      ellipsisTitle: true
    },
    {
      colKey: 'hardware_project_manufacturers',
      align: 'left',
      title: '硬集工程厂家',
      ellipsis: true,
      ellipsisTitle: true
    },
    {
      colKey: 'module',
      align: 'left',
      // width: 200,
      ellipsis: true,
      title: '模块'
    }
  ],
  visibleColumns: ['resource_pool', 'machine_room', 'project_period', 'host_server_num', 'storage_server_num', 'router_num', 'switch_num', 'firewall_num', 'business', 'power_supply_mode', 'hardware_manufacturers', 'hardware_model', 'software_manufacturers', 'hardware_project_manufacturers', 'module'
  ]
}

module.exports = {
  haTable,
  networkTable,
  modTable,
  serviceTable,
  businessTable,
  cmnetIpTable,
  vlanTable,
  userTable,
  roleTable,
  appTable,
  permissionTable,
  disasterTable,
  storageTable,
  cpuTable,
  modLogTable,
  verticalMapTable,
  scheduleTable,
  modRoleTable,
  modPermissionTable,
  machineTapble
}
