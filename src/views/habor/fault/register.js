import G6 from '@antv/g6'
export class Register {
  registerEdge () {
    G6.registerEdge('circle-running', {
      afterDraw (cfg, group) {
        const shape = group.get('children')[0]
        const startPoint = shape.getPoint(0)
        const circle = group.addShape('circle', {
          attrs: {
            x: startPoint.x,
            y: startPoint.y,
            fill: '#4caf50',
            r: 3
          },
          name: 'circle-shape'
        })
        circle.animate((radio) => {
          const tmpPoint = shape.getPoint(radio)
          return {
            x: tmpPoint.x,
            y: tmpPoint.y
          }
        }, {
          repeat: true,
          duration: 3000
        })
      }
    }, 'line')
  }

  registerNotClearedNode () {
    G6.registerNode(
      'notCleared',
      {
        afterDraw (cfg, group) {
          const r = cfg.size / 2
          const back1 = group.addShape('circle', {
            zIndex: -3,
            attrs: {
              r,
              fill: '#d50000',
              opacity: 1
            },
            name: 'back1-shape'
          })
          const back2 = group.addShape('circle', {
            zIndex: -2,
            attrs: {
              r,
              fill: '#d50000',
              opacity: 1
            },
            name: 'back2-shape'
          })
          const back3 = group.addShape('circle', {
            zIndex: -1,
            attrs: {
              r,
              fill: '#d50000',
              opacity: 1
            },
            name: 'back3-shape'
          })
          group.sort() // Sort according to the zIndex
          back1.animate(
            {
              // Magnifying and disappearing
              r: r + 10,
              opacity: 1
            },
            {
              duration: 3000,
              easing: 'easeCubic',
              delay: 0,
              repeat: true // repeat
            }
          ) // no delay
          back2.animate(
            {
              // Magnifying and disappearing
              r: r + 10,
              opacity: 1
            },
            {
              duration: 3000,
              easing: 'easeCubic',
              delay: 1000,
              repeat: true // repeat
            }
          ) // 1s delay
          back3.animate(
            {
              // Magnifying and disappearing
              r: r + 10,
              opacity: 1
            },
            {
              duration: 3000,
              easing: 'easeCubic',
              delay: 2000,
              repeat: true // repeat
            }
          ) // 3s delay
        }
      },
      'image'
    )
  }

  registerClearedNode () {
    G6.registerNode(
      'cleared',
      {
        afterDraw (cfg, group) {
          const r = cfg.size / 2
          const back1 = group.addShape('circle', {
            zIndex: -3,
            attrs: {
              r,
              fill: '#ff5722',
              opacity: 1
            },
            name: 'back1-shape'
          })
          const back2 = group.addShape('circle', {
            zIndex: -2,
            attrs: {
              r,
              fill: '#ff5722',
              opacity: 1
            },
            name: 'back2-shape'
          })
          const back3 = group.addShape('circle', {
            zIndex: -1,
            attrs: {
              r,
              fill: '#ff5722',
              opacity: 1
            },
            name: 'back3-shape'
          })
          group.sort() // Sort according to the zIndex
          back1.animate(
            {
              // Magnifying and disappearing
              r: r + 10,
              opacity: 1
            },
            {
              duration: 3000,
              easing: 'easeCubic',
              delay: 0,
              repeat: true // repeat
            }
          ) // no delay
          back2.animate(
            {
              // Magnifying and disappearing
              r: r + 10,
              opacity: 1
            },
            {
              duration: 3000,
              easing: 'easeCubic',
              delay: 1000,
              repeat: true // repeat
            }
          ) // 1s delay
          back3.animate(
            {
              // Magnifying and disappearing
              r: r + 10,
              opacity: 1
            },
            {
              duration: 3000,
              easing: 'easeCubic',
              delay: 2000,
              repeat: true // repeat
            }
          ) // 3s delay
        }
      },
      'image'
    )
  }
}
