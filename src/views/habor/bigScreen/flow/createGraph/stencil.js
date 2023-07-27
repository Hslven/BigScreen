import { Stencil } from '@antv/x6-plugin-stencil'
import './register.js'

function createStencil (graph, vm) {
  const stencil = new Stencil({
    title: '流程图',
    target: graph,
    // stencilGraphWidth: 100,
    stencilGraphHeight: 0,
    collapsable: true,
    // resizeToFit:true,
    groups: [
      {
        title: '设备图例',
        name: 'group1',
        graphHeight: 0,
        layoutOptions: {
          rowHeight: 100
        }
      }

    ],

    layoutOptions: {
      columns: 2,
      columnWidth: 140
      // resizeToFit:true
    }
  })
  document.getElementById('stencil').appendChild(stencil.container)

  const L = [

    {
      shape: 'custom-image',
      imageUrl: require('@/assets/images/screen/flow/flow_server.png'),
      attrs: {
        label: {
          text: '服务器'
        }
      },
      data: {
        device: 'SE',
        bandwidth: 10,
        text: '服务器'

      }
    },
    {
      shape: 'custom-image',
      imageUrl: require('@/assets/images/screen/flow/flow_router.png'),
      attrs: {
        label: {
          text: '路由器'
        }
      },
      data: {
        device: 'RT',
        bandwidth: 10,
        text: '路由器'

      }
    },
    {
      shape: 'custom-image',
      imageUrl: require('@/assets/images/screen/flow/EOR_switchboard.png'),
      attrs: {
        label: {
          text: 'EOR交换机'
        }
      },
      data: {
        device: 'EOR',
        bandwidth: 10,
        text: 'EOR交换机'

      }
    },
    {
      shape: 'custom-image',
      imageUrl: require('@/assets/images/screen/flow/TOR_switchboard.png'),
      attrs: {
        label: {
          text: 'TOR交换机'
        }
      },
      data: {
        device: 'TOR',
        bandwidth: 10,
        text: 'TOR交换机'

      }
    },
    {
      shape: 'custom-image',
      imageUrl: require('@/assets/images/screen/flow/flow_firewall.png'),
      attrs: {
        label: {
          text: '防火墙'
        }
      },
      data: {
        device: 'FW',
        bandwidth: 10,
        text: '防火墙'

      }
    },
    {
      shape: 'custom-image',
      imageUrl: require('@/assets/images/screen/flow/bearer_network.png'),
      attrs: {
        label: {
          text: 'IP承载网'
        }
      },
      data: {
        device: 'IPNET',
        bandwidth: 10,
        text: 'IP承载网'

      }
    },
    {
      shape: 'custom-image',
      imageUrl: require('@/assets/images/screen/flow/CE.png'),
      attrs: {
        label: {
          text: 'CE网络边缘'
        }
      },
      data: {
        device: 'CE',
        bandwidth: 10,
        text: 'CE网络边缘'

      }
    },
    {
      shape: 'custom-image',
      imageUrl: require('@/assets/images/screen/flow/LB.png'),
      attrs: {
        label: {
          text: 'LB负载均衡'
        }
      },
      data: {
        device: 'LB',
        bandwidth: 10,
        text: 'LB负载均衡'

      }
    }

  ]
  const arr = []
  for (const i of L) {
    arr.push(graph.createNode(i))
  }

  stencil.load(arr, 'group1')

  return stencil
}

export default createStencil
