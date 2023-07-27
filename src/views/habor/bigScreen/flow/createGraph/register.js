import { Graph, Path, Curve } from '@antv/x6'

// pass
Graph.registerConnector(
  'multi-smooth',
  (sourcePoint, targetPoint, routePoints, options) => {
    // const { index = 0, total = 1, gap = 12 } = options;
    // const line = new Line(sourcePoint, targetPoint);
    // const centerIndex = (total - 1) / 2;
    // const dist = index - centerIndex;
    // const diff = Math.abs(dist);
    // const factor = diff === 0 ? 1 : diff / dist;
    // console.log(options);
    const vertice = {
      x: targetPoint.x / 2,
      y: targetPoint.y / 2
    }
    const points = [sourcePoint, vertice, targetPoint]
    const curves = Curve.throughPoints(points)
    const path = new Path(curves)
    return options.raw ? path : path.serialize()
  },
  true
)

Graph.registerNode(
  'custom-node',
  {
    inherit: 'rect', // 继承于 rect 节点
    x: 120,
    y: 330,
    width: 30,
    height: 10,

    attrs: {
      body: {
        fill: '#efdbff',
        stroke: '#9254de'
      }

    },
    ports: {
      groups: {
        in: {
          position: 'line',
          markup: [
            {
              tagName: 'rect',
              selector: 'portBody'
            }
          ],
          attrs: {
            text: {
              // text: this.formData.nodeText,
              // text: "default",
              fill: '#000',
              // stroke: "#000",
              textAnchor: 'middle',
              textVerticalAnchor: 'top',
              fontSize: 15
            },
            portBody: {
              width: 120,
              height: 50,
              x: -60,
              y: -25,
              strokeWidth: 1,
              stroke: '#5F95FF',
              fill: '#EFF4FF',
              magnet: true
            }
          },
          label: {
            position: 'top'
          }
        }
      },
      items: [
        {
          id: 'in',
          group: 'in'
        }
      ]
    }
  },
  true
)
// arrow model
Graph.registerEdge(
  'arrow',
  {
    markup: [
      {
        tagName: 'path',
        selector: 'line'
      },
      {
        tagName: 'path',
        groupSelector: 'arrow',
        selector: 'arrowL'
      },
      {
        tagName: 'path',
        groupSelector: 'arrow',
        selector: 'arrowR'
      }
    ],
    attrs: {
      arrow: {
        fill: '#7ffffd'
        // stroke: '#7ffffd',
      },
      arrowL: {
        atConnectionRatio: 0.5,
        d: 'm -20 0 l 15 10 v -20'

      },
      arrowR: {
        atConnectionRatio: 0.5,
        d: 'm 20 0 l -15 10 v -20'
      }
    }
  },
  true
)
//  custom-image model
Graph.registerNode(
  'custom-image',
  {
    inherit: 'image', // 继承于 rect 节点
    width: 60,
    height: 60,
    attrs: {
      label: {
        refX: 0.5,
        refY: '100%',
        refY2: 2,
        textAnchor: 'middle',
        textVerticalAnchor: 'top',
        fill: '#ffffff'
      }
    },
    ports: {
      groups: {
        in: {
          attrs: {
            circle: {
              r: 8,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 2,
              fill: '#fff'
            }

          },
          position: {
            name: 'absolute',
            args: {
              x: '50%',
              y: '50%'
            }
          }
        }
      },
      items: [
        // {
        //     id: "in",
        //     group: "in",
        // },
      ]
    }

  },
  true
)
