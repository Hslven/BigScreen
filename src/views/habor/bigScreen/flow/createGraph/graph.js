import { Graph } from '@antv/x6'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Keyboard } from '@antv/x6-plugin-keyboard'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'
import { MiniMap } from '@antv/x6-plugin-minimap'

import { line } from './lineStyle.js'
import './register.js'

const createGraph = (containerId, vm, edit = false) => {
  const container = document.getElementById(containerId)
  const BGC_COLOR = '#fff'

  const graph = new Graph({
    container,
    autoResize: true,
    panning: {
      enabled: true,
      eventTypes: 'rightMouseDown'
    },
    background: {
      color: BGC_COLOR
    },
    // 只渲染可视区域
    virtual: false,
    // 是否可拖动节点
    interacting: {
      nodeMovable: edit
    },
    interactable: false,
    scaling: { min: 0.2, max: 2 },
    grid: {
      visible: false,
      type: 'doubleMesh',
      size: 50,
      args: [
        {
          color: '#eee', // 次网格线颜色
          thickness: 1, // 次网格线宽度
          factor: 1 // 主次网格线间隔
        },
        {
          color: '#eee', // 次网格线颜色
          thickness: 1, // 次网格线宽度
          factor: 1 // 主次网格线间隔
        }
      ]
    },

    connecting: {
      snap: true,
      connector: {
        // 这里有两种方案
        // name: "multi-smooth",
        // args: {
        // total: 10,
        // index: 1,
        // },
        name: 'smooth'
        // name: "per",
      },
      allowLoop: false,
      allowNode: false,
      createEdge () {
        return graph.createEdge({
          shape: 'arrow',
          zIndex: 2,
          // vertices: [{ x: 400, y: 400 }],
          vertices: [
            {
              x: vm.nodeForm.nodePosition.x - 50,
              y: vm.nodeForm.nodePosition.y + 100
            }
          ],
          data: { bandWidth: 10 },
          // tools: {
          //     name: "button-remove",
          //     args: { distance: 0 },
          // },

          attrs: {
            line: {
              stroke: line().default,
              strokeWidth: 2,
              targetMarker: null,
              connection: true,
              fill: 'none'
            }
          },
          labels: [
            // label1
            {
              markup: [
                {
                  tagName: 'rect',
                  selector: 'labelBody'
                },
                {
                  tagName: 'text',
                  selector: 'labelText'
                }
              ],
              // data: "label1",
              attrs: {
                labelText: {
                  text: '0',
                  fill: '#000',
                  textAnchor: 'middle',
                  textVerticalAnchor: 'middle'
                },
                labelBody: {
                  ref: 'labelText',
                  refX: -8,
                  refY: -5,
                  refWidth: '100%',
                  refHeight: '100%',
                  refWidth2: 16,
                  refHeight2: 10,
                  stroke: '#000',
                  fill: line().default,
                  strokeWidth: 1,
                  rx: 5,
                  ry: 5,
                  event: 'click:out',
                  cursor: 'pointer'
                }
              },
              position: {
                distance: 0.3,
                args: {
                  keepGradient: true,
                  ensureLegibility: true
                }
              }
            },
            // label 2
            {
              markup: [
                {
                  tagName: 'rect',
                  selector: 'labelBody'
                },
                {
                  tagName: 'text',
                  selector: 'labelText'
                }
              ],
              attrs: {
                labelText: {
                  text: '0',
                  fill: '#000',
                  textAnchor: 'middle',
                  textVerticalAnchor: 'middle'
                },
                labelBody: {
                  ref: 'labelText',
                  refWidth: '100%',
                  refHeight: '100%',
                  refWidth2: 16,
                  refHeight2: 10,
                  stroke: '#000',
                  fill: line().default,
                  strokeWidth: 1,
                  refX: -8,
                  refY: -5,
                  rx: 5,
                  ry: 5,
                  event: 'click:in',
                  cursor: 'pointer'
                }
              },
              position: {
                distance: 0.7,
                angle: 0
              }
            },
            // label 1-1，2
            {
              markup: [
                {
                  tagName: 'text',
                  selector: 'labelText'
                }
              ],
              attrs: {
                labelText: {
                  text: 'Z端',
                  fill: '#fff',
                  textAnchor: 'middle',
                  textVerticalAnchor: 'middle',
                  refY: 30
                }
              },
              position: {
                distance: 0.7,
                angle: 0
              }
            },
            // label 2-1，3
            {
              markup: [
                {
                  tagName: 'text',
                  selector: 'labelText'
                }
              ],
              attrs: {
                labelText: {
                  text: 'A端',
                  fill: '#fff',
                  textAnchor: 'middle',
                  textVerticalAnchor: 'middle',
                  refY: 30
                }
              },
              position: {
                distance: 0.3,
                angle: 0
              }
            }
          ]
        })
      },
      createNode () {
        return graph.createNode({
          shape: 'rect'
        })
      }
    },
    // panning: {
    //   enabled: true,
    //   eventTypes: "rightMouseDown",
    // },
    mousewheel: {
      enabled: true,
      modifiers: 'Ctrl'
    },
    view: {
      virtual: true,
      magnetThreshold: 4
    }
  })

  // 移动画布
  graph.use(
    new Snapline({
      enabled: true
    })
  )

  if (edit) {
    graph
      .use(
        new Keyboard({
          enabled: true
        })
      )
      .use(
        new Clipboard({
          enabled: true
        })
      )
      .use(
        new History({
          enabled: true
        })
      )
      .use(
        new Selection({
          enabled: true,
          rubberband: true,
          // showNodeSelectionBox: true,
          modifiers: 'shift',
          showNodeSelectionBox: true
          // multiple: true,
          // multipleSelectionModifiers: ["shift", "meta"],
        })
      )
  }
  if (!edit) {
    // 隐藏连线端口
    const edges = graph.getEdges()
    edges.forEach((edge) => {
      edge.setInteractable(false)
    })
    graph.use(
      new MiniMap({
        container: document.getElementById('minimap')
      })
    )
  }

  return graph
}

export default createGraph
