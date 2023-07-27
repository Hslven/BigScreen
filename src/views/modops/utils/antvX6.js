import { FunctionExt, Graph, Shape } from '@antv/x6'
import { MessagePlugin } from 'tdesign-vue'
import { LoopJupge } from './loopJupge'
import { showPorts } from './general'
import { cloneDeep } from 'lodash'
import { DARK_THEME } from '@/store/mutation-types'
import { createStorage } from '@/utils/Storage'
const Storage = createStorage({ storage: localStorage })
export class X6Graph {
  /*
  初始化x6画布
   */
  constructor (id) {
    this.id = id
    this.graphParam = this.initGraphParams()
  }

  initGraphParams () {
    const params = {
      container: this.id,
      // todo 自定义提示框
      // onPortRendered ({ node, port, container, labelContainer, labelSelectors, selectors, contentContainer, contentSelectors }) {
      //   container.addEventListener('mouseenter', (e) => {
      //     const nodeSize = node.size()
      //     const tooltip = document.getElementById('port-tooltip')
      //     tooltip.innerText = port.name
      //     tooltip.style.right = `${nodeSize.width + 40}px`
      //     tooltip.style.top = `${port.args.y - 10}px`
      //     tooltip.style.width = `${nodeSize.width}px`
      //     tooltip.style.display = ''
      //   })
      //   container.addEventListener('mouseleave', () => {
      //     const tooltip = document.getElementById('port-tooltip')
      //     tooltip.style.display = 'none'
      //   })
      // },
      background: {
        color: Storage.get(DARK_THEME, false) ? 'rgb(43, 40, 47)' : 'rgb(255 255 255)'
      },
      // autoResize: true,
      grid: {
        size: 20,
        visible: true,
        type: 'mesh', // 'dot' | 'fixedDot' | 'mesh'
        args: {
          color: 'rgba(36,46,66,0.6)', // 网格线/点颜色
          thickness: 0.2 // 网格线宽度/网格点大小
        }
      },
      panning: true, // 允许平移
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta']
      }
    }
    return params
  }

  modGraph (obj) {
    return new Graph(obj)
  }

  createGrapher () {
    /*
    模组编排Graph
     */
    const enabled = {
      enabled: true
    }
    this.graphParam.selecting = enabled
    const connecting = {
      anchor: 'center', // 线的箭头在连接桩的中心
      connectionPoint: 'anchor', // 线的两头与连接桩重合
      allowBlank: false, // 不允许连接到画布空白位置
      allowMulti: false, // 不允许在相同的起始节点和终止之间创建多条边
      highlight: true, // 拖动边时，高亮显示所有可用的连接桩或节点
      allowLoop: false, // 不允许创建循环连线
      snap: true, // 连线的过程中距离节点或者连接桩 50px 时会触发自动吸附
      connector: { name: 'curve' }, // 自定义连接器：设置线的弯曲样式
      createEdge () {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: 'rgb(18, 170, 253)',
              strokeWidth: 1.8,
              sourceMarker: {
                tagName: 'circle',
                r: 3,
                cx: 0,
                fill: 'rgb(18, 170, 253)',
                stroke: 'rgb(18, 170, 253)'
              },
              targetMarker: {
                name: 'block',
                args: {
                  size: '8'
                },
                fill: 'rgb(18, 170, 253)',
                stroke: 'rgb(18, 170, 253)'
              }
            }
          },
          router: {
            name: 'orth'
          },
          zIndex: 0
        })
      },
      validateMagnet ({ magnet }) {
        // 输入桩不创建边
        return magnet.getAttribute('port-group') !== 'in'
      },
      validateConnection ({
        sourcePort,
        targetPort,
        sourceCell,
        targetCell
      }) {
        const sourceData = sourceCell.getData()
        const sourcePortData = sourceCell.getPort(sourcePort)
        const targetPortData = targetCell.getPort(targetPort)
        // 只能连接到输入链接桩
        if (!targetPortData || targetPortData.group !== 'in') {
          return false
        }
        // 模组参数不能连接顺序桩
        if (sourceData.nodeType === 'param' && targetPortData.source === 'order') {
          return false
        }
        // 模组参数不能连接已被构件连接的点
        if (sourceData.nodeType === 'param' && targetPortData.source === 'step') {
          return false
        }
        // 不允许多个模组参数连接同一个连接桩
        if (targetPortData.source === 'mod') {
          return false
        }
        // 构件不能连接已被模组参数连接的点
        if (sourceData.nodeType === 'step' && targetPortData.source === 'mod') {
          return false
        }
        // 输出参数和输入参数同类型可连
        if (sourcePortData.type === targetPortData.type) {
          return true
        }
        // 输入参数为all时，判断输出参数的类型是否时all所支持的类型
        if (targetPortData.type === 'all' && targetPortData.options.scope.indexOf(sourcePortData.type) > -1) {
          return true
        }
        // 所有构件的输出参数都可连顺序桩
        if (targetPortData.type === 'void') {
          return true
        }
        return false
      }
    }
    const highlighting = {
      magnetAvailable: {
        name: 'stroke',
        args: {
          padding: 4,
          attrs: {
            'stroke-width': 6,
            stroke: '#81C784'
          }
        }
      }
    }
    this.graphParam.highlighting = highlighting
    this.graphParam.connecting = connecting
    return this.modGraph(this.graphParam)
  }

  createActuator () {
    /*
    模组调度Graph
     */
    const connecting = {
      anchor: 'center',
      connectionPoint: 'anchor',
      allowBlank: false,
      allowLoop: false,
      allowNode: false,
      allowPort: false,
      connector: { name: 'curve' }
    }
    this.graphParam.connecting = connecting
    return this.modGraph(this.graphParam)
  }
}

export class EventListener {
  constructor (graph, x6Id) {
    this.x6Id = x6Id
    this.graph = graph
  }

  onNodeMouseenter () {
    this.graph.on('node:mouseenter', FunctionExt.debounce(() => {
      const ports = this.x6Id.querySelectorAll(
        '.x6-port-body'
      )
      showPorts(ports, true)
    }), 500)
  }

  onNodeMouseleave () {
    this.graph.on('node:mouseleave', () => {
      const ports = this.x6Id.querySelectorAll(
        '.x6-port-body'
      )
      showPorts(ports, false)
    })
  }

  connectedEvent () {
    /*
    <连线事件监听>
    边连接时触发的事件：将节点上已连接的连接桩设置为已连接
     */
    this.graph.on('edge:connected', ({ currentCell, currentMagnet, currentPort, currentView, e, edge, view }) => {
      // 成环判断
      const allEdges = this.graph.getEdges()
      const edgesData = []
      allEdges.forEach(function (edge, index) {
        const SourceTarget = {
          source: edge.getSource().cell,
          target: edge.getTarget().cell
        }
        edgesData.push(cloneDeep(SourceTarget))
      })
      const isLoop = LoopJupge(edgesData)
      if (isLoop) {
        MessagePlugin('warning', { content: '该线导致成环，请重新连线！' })
        this.graph.removeEdge(edge)
      } else {
        // 连接事件
        this.connectedNodeEvent(view, currentCell, edge)
      }
    })
  }

  connectedNodeEvent (view, currentCell, edge) {
    // 起始节点和目标节点对象
    const sourceCell = view.sourceView.cell
    // 目标节点port
    const targetPortId = edge.getTargetPortId()
    const targetPort = currentCell.getPort(targetPortId)
    // 边对象
    const EdgeCell = view.cell
    // 边属性
    const edgeAttrs = {
      line: {
        stroke: 'rgb(18, 170, 253)',
        strokeWidth: 1.8,
        targetMarker: {
          name: 'block',
          args: {
            size: '6'
          }
        }
      }
    }
    const edgeData = {
      id: null,
      prev_stepid: sourceCell.id,
      next_stepid: currentCell.id,
      param: null
    }
    const sourceData = sourceCell.getData()
    // 目标节点端口是顺序桩的情况
    if (targetPort.source === 'order') {
      // 起始节点端口是节点输出参数的情况
      // 更新目标节点的顺序端口数据
      targetPort.value.push(sourceCell.id)
      const OrderPort = targetPort.value
      currentCell.setPortProp(targetPortId, 'value', OrderPort)
      // 更新边属性数据
      edgeData.param = -1 // -1表示是顺序桩
      edgeAttrs.line.strokeDasharray = '5 5'
      EdgeCell.setAttrs(edgeAttrs)
      EdgeCell.setData(edgeData)
    } else {
      // 目标节点端口是输入桩的情况
      if (sourceData.nodeType === 'param') {
        // 起始节点是模组参数的情况
        // 更新目标节点的参数端口数据
        currentCell.removePortProp(targetPortId, 'value')
        currentCell.setPortProp(
          targetPortId,
          {
            connected: true,
            source: 'mod',
            value: [sourceCell.id]
            // source_type: sourceData.type,
            // source_name: sourceData.name,
            // source_id: sourceCell.id
          }
        )
        // 更新边属性数据
        edgeData.param = targetPort.index
        EdgeCell.setAttrs(edgeAttrs)
        EdgeCell.setData(edgeData)
      } else {
        // 更新目标节点的输入参数端口数据
        let targetPortValue = currentCell.getPortProp(targetPortId, 'value')
        if (currentCell.getPortProp(targetPortId, 'source') === 'value') {
          targetPortValue = [sourceCell.id]
        } else {
          targetPortValue.push(sourceCell.id)
        }
        currentCell.removePortProp(targetPortId, 'value')
        currentCell.setPortProp(
          targetPortId,
          {
            connected: true,
            source: 'step',
            value: targetPortValue
          }
        )
        edgeData.param = targetPort.index
        EdgeCell.setAttrs(edgeAttrs)
        EdgeCell.setData(edgeData)
      }
    }
  }

  removedEdgeEvent () {
    /*
    <移除边事件监听>
    边移除时触发的事件：将节点连接桩设置为初始值
     */
    this.graph.on('edge:removed', ({ edge, options }) => {
      const targetCellId = edge.getTargetCellId()
      const targetCell = this.graph.getCellById(targetCellId)
      const sourceCellId = edge.getSourceCellId()
      const sourceCell = this.graph.getCellById(sourceCellId)
      const targetPortId = edge.getTargetPortId()
      if (targetCell) {
        const targetPort = targetCell.getPort(targetPortId)
        if (targetPort.source === 'order') {
          // 移除与顺序桩相连的线
          const orderStepIds = cloneDeep(targetPort.value)
          orderStepIds.splice(orderStepIds.findIndex(item => item === sourceCell.id), 1)
          targetCell.removePortProp(targetPortId, 'value')
          targetCell.setPortProp(targetPortId, 'value', orderStepIds)
        } else if (targetPort.source === 'step') {
          // 移除与输入桩相连的线
          const stepStepIds = cloneDeep(targetPort.value)
          stepStepIds.splice(stepStepIds.findIndex(item => item === sourceCell.id), 1)
          if (stepStepIds.length) {
            targetCell.removePortProp(targetPortId, 'value')
            targetCell.setPortProp(targetPortId, 'value', stepStepIds)
          } else {
            targetCell.removePortProp(targetPortId, 'value')
            targetCell.setPortProp(
              targetPortId,
              {
                source: '',
                value: [],
                connected: false
              })
          }
        } else {
          targetCell.removePortProp(targetPortId, 'value')
          targetCell.setPortProp(
            targetPortId,
            {
              source: '',
              value: [],
              connected: false
            })
        }
      }
    })
  }

  contextmenuEvent () {
    // 右键事件
    this.graph.on('node:contextmenu', ({ cell, view }) => {
      const oldText = cell.attr('text/textWrap/text')
      const elem = view.container.querySelector('.x6-edit-text')
      if (elem == null) { return }
      cell.attr('text/style/display', 'none')
      if (elem) {
        elem.style.display = ''
        elem.contentEditable = 'true'
        elem.innerText = oldText
        elem.focus()
      }
      const onBlur = () => {
        cell.attr('text/textWrap/text', elem.innerText)
        cell.attr('text/style/display', '')
        elem.style.display = 'none'
        elem.contentEditable = 'false'
      }
      elem.addEventListener('blur', () => {
        onBlur()
        elem.removeEventListener('blur', onBlur)
      })
    })
  }

  mouseenterEdgeEvent () {
    this.graph.on('edge:mouseenter', ({ edge }) => {
      edge.addTools([
        'target-arrowhead',
        {
          name: 'button-remove',
          args: {
            distance: -50
          }
        }
      ])
    })
  }

  mouseleaveEdgeEvent () {
    this.graph.on('edge:mouseleave', ({ edge }) => {
      edge.removeTools()
    })
  }
}
