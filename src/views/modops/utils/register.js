import { Graph, Path } from '@antv/x6'
import InstanceNodePro from '../components/InstanceNodePro'
import ModLogNodePro from '../components/ModLogNodePro'
import paramNodePro from '../components/paramNodePro'
import modNodePro from '../components/modNodePro'
import { register } from '@antv/x6-vue-shape'
export class Register {
  registerEdge () {
    /*
    注册antv/X6的边样式，设置线的弯曲效果
     */
    Graph.registerConnector(
      'curve',
      (sourcePoint, targetPoint) => {
        const path = new Path()
        path.appendSegment(Path.createSegment('M', sourcePoint))
        path.appendSegment(
          Path.createSegment(
            'C',
            sourcePoint.x + 80,
            sourcePoint.y,
            targetPoint.x - 80,
            targetPoint.y,
            targetPoint.x,
            targetPoint.y
          )
        )
        return path.serialize()
      },
      true
    )
  }

  registerModStepNode () {
    /*
    注册antv/X6的编排节点样式
     */
    register({
      shape: 'mod-node-pro',
      component: modNodePro
    })
    // Graph.registerVueComponent(
    //   'mod-node-pro',
    //   {
    //     template: '<mod-node-pro></mod-node-pro>',
    //     data () {
    //       return {}
    //     },
    //     components: {
    //       modNodePro
    //     }
    //   },
    //   true
    // )
  }

  registerInstanceStepNode () {
    /*
    注册antv/X6的调度节点样式
     */
    register({
      shape: 'instance-node-pro',
      component: InstanceNodePro
    })
    // Graph.registerVueComponent(
    //   'instance-node-pro',
    //   {
    //     template: '<instance-node-pro></instance-node-pro>',
    //     data () {
    //       return {}
    //     },
    //     components: {
    //       InstanceNodePro
    //     }
    //   },
    //   true
    // )
  }

  registerModLogStepNode () {
    /*
    注册antv/X6的执行记录节点样式
     */
    register({
      shape: 'mod-log-node-pro',
      component: ModLogNodePro
    })
    // Graph.registerVueComponent(
    //   'mod-log-node-pro',
    //   {
    //     template: '<mod-log-node-pro></mod-log-node-pro>',
    //     data () {
    //       return {}
    //     },
    //     components: {
    //       ModLogNodePro
    //     }
    //   },
    //   true
    // )
  }

  registerParamNode () {
    /*
    注册antv/X6的模组参数节点样式
     */
    register({
      shape: 'param-node-pro',
      component: paramNodePro
    })
    // Graph.registerVueComponent(
    //   'param-node-pro',
    //   {
    //     template: '<param-node-pro></param-node-pro>',
    //     data () {
    //       return {}
    //     },
    //     components: {
    //       paramNodePro
    //     }
    //   },
    //   true
    // )
  }
}
