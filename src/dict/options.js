
const reportResultOptions = [
  {
    label: '待定',
    value: 0
  },
  {
    label: '通过',
    value: 1
  },
  {
    label: '不通过',
    value: 2
  }
]

const visibleBusinessOptions = {
  business_system: [],
  app_name: [],
  vnf_name: [],
  vlan_id: [],
  vlan_name: [],
  gateway_interface: [],
  vrf_name: [],
  locate_device: [],
  nexthop_ip: [],
  resource_pool: [],
  destination_ip: [],
  gateway_ip: [],
  vrrp_ip: [],
  subnet_name: []
}

const visibleCmnetIpOptions = {
  name: [],
  ip: [],
  resource_type: [],
  type: [],
  city: [],
  desc: [],
  domain_name: [],
  purpose: [],
  remark: [],
  related_fwnat_ip: [],
  belong_hardware: [],
  related_logic_port: [],
  data_src_type: [],
  project_period: []
}

const visibleVerticalMapOptions = {
  vim: [],
  vnf: [],
  business: [],
  ha: [],
  computer_server: [],
  computer_server_st_tor: [],
  computer_server_s_tor: [],
  computer_server_m_tor: [],
  computer_server_dm_tor: [],
  storage_server_st_tor: [],
  storage_server_s_tor: [],
  storage_server_dm_tor: [],
  storage_server_m_tor: [],
  storage_cluster: [],
  storage_pool: [],
  storage_server: [],
  resource_pool: []
}

const visibleVlanOptions = {
  vlan_name: [],
  vlan_id: [],
  subnet_name: [],
  resource_pool: [],
  gateway_interface: [],
  gateway_ip: [],
  vrf_name: [],
  locate_device: []
}

const requestOptions = ['GET', 'POST', 'DELETE', 'PUT']
const paramOptions = ['string', 'strings', 'int', 'boolean', 'hosts', 'networks', 'ips', 'emails', 'inops']

module.exports = {
  reportResultOptions,
  requestOptions,
  visibleBusinessOptions,
  visibleCmnetIpOptions,
  visibleVlanOptions,
  paramOptions,
  visibleVerticalMapOptions
}
