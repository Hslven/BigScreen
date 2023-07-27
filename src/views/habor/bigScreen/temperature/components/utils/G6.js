import G6 from '@antv/g6'
const data = {
  nodes: [
    {
      id: 'node1',
      img: require('@/assets/images/screen/temperatureComp/route_master.png'),
      x: 250,
      y: 120,
      label: '~AE16-M-TOR-01',
      // 调整大小
      labelCfg: {
        position: 'top',
        style: {
          fill: '#fff'
        }
      }
    },
    {
      id: 'node2',
      img: require('@/assets/images/screen/temperatureComp/route_in.png'),
      x: 120,
      y: 200,
      color: '#40a9ff',
      label: '~AE16-M-TOR-02',
      labelCfg: {
        position: 'bottom',
        offset: 5,
        style: {
          fill: '#fff'
        }
      }
    },
    {
      id: 'node3',
      img: require('@/assets/images/screen/temperatureComp/route_in_error.png'),
      x: 250,
      y: 200,
      color: '#40a9ff',
      label: '~AE16-M-TOR-03',
      labelCfg: {
        position: 'bottom',
        offset: 5,

        style: {
          fill: '#fff'
        }
      }
    },
    {
      id: 'node4',
      img: require('@/assets/images/screen/temperatureComp/route_in.png'),
      x: 380,
      y: 200,
      color: '#40a9ff',
      label: '~AE16-M-TOR-04',
      labelCfg: {
        position: 'bottom',
        offset: 5,

        style: {
          fill: '#fff'
        }
      }
    }
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2'
    },
    {
      source: 'node1',
      target: 'node3'
    },
    {
      source: 'node1',
      target: 'node4'
    }
  ]
}
G6.registerEdge(
  'circle-running',
  {
    afterDraw (cfg, group) {
      // get the first shape in the group, it is the edge's path here=
      const shape = group.get('children')[0]
      // the start position of the edge's path
      const startPoint = shape.getPoint(0)

      // add red circle shape
      const circle = group.addShape('circle', {
        attrs:
        {
          x: startPoint.x - 30,
          y: startPoint.y + 30,
          fill: '#67ce9f',
          r: 6
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'circle-shape'
      })

      // animation for the red circle
      circle.animate(
        (ratio) => {
          // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
          // get the position on the edge according to the ratio
          const tmpPoint = shape.getPoint(ratio)
          // returns the modified configurations here, x and y here
          return {
            x: tmpPoint.x,
            y: tmpPoint.y
          }
        },
        {
          repeat: true, // Whether executes the animation repeatly
          duration: 3000 // the duration for executing once
        }
      )
    }
  },
  'line' // extend the built-in edge 'cubic'
)
export default data
