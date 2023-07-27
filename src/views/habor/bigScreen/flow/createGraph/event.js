// import axios from 'axios'
// import { line } from './lineStyle.js'
// import {
//   getPortData
// } from '@/api/monitor/bigScreen'
import './register.js'
import {
// 根据设备名查询端口
  getPortsByHostName
} from '@/api/monitor/bigScreen'

const graphEvent = (graph, vm) => {
  // 单击edge显示编辑框
  // click on the edge to display the edit box
  graph.on('edge:customevent', ({ name, e, edge }) => {
    // 获取下拉框选项
    // get select options
    // edge1
    vm.edge = edge
    vm.edgeForm.edgeLabel = edge.data.bandWidth
    console.log(vm.nodeForm.nodeText)
    if (name === 'click:out') {
      // 设置类型防迷路
      vm.edgeForm.type = 'edge0'
      // 根据name渲染对应设备名称,根据id查找节点
      // 如果在节点表单不选，点击线条后会赋值，回到节点表单会填入一个没有选项的值（如LB负载均衡）
      // 所以需要一个临时变量在没选的时候来显示LB负载均衡
      const node = graph.getCellById(edge.source.cell)
      // if (vm.nodeForm.nodeText !== '') {
      vm.nodeForm.nodeText = node.attrs.label.text
      vm.edgeForm.AOrZ = 'A端'
      // } else {
      // vm.nodeForm.temNodeText = node.attrs.label.text
      // }
      vm.edgeForm.edgePort0 = ''
      // 获取下拉框(在父组件中选了设备后才解控)
      if (vm.edgeForm.disabled) return vm.$message.error({ content: '请先选择资源设备名称', placement: 'center' })
      getPortsByHostName({ hostName: vm.nodeForm.nodeText }).then(res => {
        if (res.data.code === 0) {
          vm.edgeForm.dialog = true
          vm.edgeForm.resourcePortOptions = res.data.data.map(item => {
            return { label: item, value: item }
          })
        } else {
          vm.edgeForm.resourcePortOptions = []
          vm.edgeForm.edgePort0 = ''
          vm.$message.error({ content: '没有设备端口数据', placement: 'center' })
        }
      }).catch((error) => {
        vm.edgeForm.resourcePortOptions = []
        vm.edgeForm.edgePort0 = ''
        vm.$message.error({ content: error, placement: 'center' })
      })
      // setTimeout(() => {
      //   vm.$refs.edgeLabel0.focus()
      // }, 200)
      // edge2
    } else if (name === 'click:in') {
      // 设置类型防迷路
      vm.edgeForm.type = 'edge1'
      // 根据name渲染对应设备名称,根据id查找节点
      const node = graph.getCellById(edge.target.cell)
      // if (vm.nodeForm.nodeText !== '') {
      vm.nodeForm.nodeText = node.attrs.label.text
      vm.edgeForm.AOrZ = 'Z端'

      // } else {
      //   vm.nodeForm.temNodeText = node.attrs.label.text
      // }
      vm.edgeForm.edgePort1 = ''
      // 获取下拉框(在父组件中选了设备后才解控)
      if (vm.edgeForm.disabled) return vm.$message.error({ content: '请先选择资源设备名称', placement: 'center' })
      getPortsByHostName({ hostName: vm.nodeForm.nodeText }).then(res => {
        if (res.data.code === 0) {
          vm.edgeForm.dialog = true
          vm.edgeForm.resourcePortOptions = res.data.data.map(item => {
            return { label: item, value: item }
          })
        } else {
          vm.edgeForm.resourcePortOptions = []
          vm.edgeForm.edgePort1 = ''
          vm.$message.error({ content: '获取选项失败', placement: 'center' })
        }
      }).catch(() => {
        vm.edgeForm.edgePort1 = ''
        vm.edgeForm.resourcePortOptions = []
        vm.$message.error({ content: '获取选项失败', placement: 'center' })
      })
      // setTimeout(() => {
      //   vm.$refs.edgeLabel1.focus()
      // }, 200)
    }
  })

  // 双击node显示编辑框
  // Dbclick on the node to display the edit box
  graph.on('node:dblclick', ({ e, x, y, node, view }) => {
    vm.nodeForm.dialog = true
    // 拉出来线的那里对应端口3，对应数据是0
    // const nodeId1 = graph.getNodes()[0].id
    // console.log(graph.getConnectedEdges(nodeId1))

    // vm.nodeForm.nodeText = ''
    // vm.formData.nodeText = node.label
    // if (node.attr.label.text !== undefined) {
    //   vm.formData.nodeText = node.attr.label.text
    // } else {
    // vm.nodeForm.nodeText = node.attrs.label.text
    // }
    vm.nodeForm.nodeText = ''
    // 获取当前node参数，用于编辑框修改
    vm.node = node
    if (!node.data.text) {
      vm.nodeForm.nodeText = node.attrs.label.text
    }
    // 获取下拉框选项
    // get select optionsi
    // Gnode({ device: node.data.device }).then(res => {
    // vm.dialog.nodeForm = !vm.dialog.nodeForm
    // setTimeout(() => {
    //   vm.$refs.nodeLabel.focus()
    // }, 200)
    // if (res.data.code === 0) {
    // vm.sourceDeviceOptions = res.data.data.map(item => {
    //   return { label: item, value: item }
    // })
    // } else {
    // vm.sourceDeviceOptions = []
    // vm.$message.error(res.msg)
    // vm.$message.error('获取选项失败')
    // }
    // }).catch(() => {
    // vm.$message.error('获取选项失败')
    // vm.sourceDeviceOptions = []
    // })
  })

  // 添加节点触发
  graph.on('node:added', ({ node, index, options }) => {
    vm.node = node
    vm.nodeForm.dialog = true
    // 如果拉出相同的设备，资源池和资源选项不变,否则清空
    if (vm.nodeForm.temNodeText !== node.data.text) {
      vm.nodeForm.temNodeText = node.data.text
      vm.nodeForm.resource = ''
      vm.nodeForm.nodeText = ''
      vm.nodeForm.nodeTextOptions = []
      vm.nodeForm.nameDisabled = true
    }
    // 如果没有getPorts说明是线条
    if (!node.getPorts) return
    // 触碰线条or隐藏连接框不执行下面方法
    vm.nodeForm.position = node.store.previous.position
    const ports = node.getPorts()
    // 如果端口为0添加端口
    if (ports.length === 0) {
      vm.nodeForm.nodePosition = node.store.data.position
      // 添加port连接桩
      node.prop('ports/groups/group1/position', {
        name: 'absolute',
        args: {
          x: '50%',
          y: '100%'
        }
      })
      node.prop('ports/items/0', {
        id: 'in',
        group: 'in'
      })
    }
  })
  // 优化线条的位置
  // graph.on('cell:mousemove', ({ x, y, e, view }) => {
  // vm.formData.edgePosition.x = x
  // vm.formData.edgePosition.y = y
  // console.log(x, y)
  // if (x < vm.nodeForm.nodePosition.x) {
  //   vm.nodeForm.nodePosition.x -= 50
  //   // vm.formData.edgePosition.y = y - 100
  // }
  // else if(x < vm.formData.nodePosition.x){
  //     vm.formData.edgePosition.x = x - 100
  //     vm.formData.edgePosition.y = y + 100
  // }
  // else{
  //     return
  // }
  // })

  // 进入元素显示删除按钮
  graph.on('cell:mouseenter', ({ cell }) => {
    // 获取cell中的Symbol(Symbol.toStringTag)
    // 获取触碰到的节点位置，拉动线条出来的位置按这个冲进计算
    console.log(cell.store.previous.position)
    vm.nodeForm.nodePosition = cell.store.data.position
    const type = Object.prototype.toString.call(cell)
    // 判断type里面是否包含Node字符
    // node和edge的删除按钮显示位置不通
    // console.log(typeof(type));
    if (type.includes('Node')) {
      cell.addTools({
        name: 'button-remove',
        args: {
          x: 0,
          y: 0,
          offset: { x: 10, y: 10 }
        }
      })
    } else if (type.includes('Edge')) {
      // distance 删除按钮在线条的距离，支持百分比和数字
      cell.addTools({
        name: 'button-remove',
        args: { distance: '10%' }
      })
      cell.addTools({
        name: 'button-remove',
        args: { distance: '90%' }
      })
    }

    // 触碰线条or隐藏连接框不执行下面方法
    // if (!cell.getPorts) return
    // vm.formData.position = cell.store.previous.position

    // const ports = cell.getPorts()
    // if (ports.length === 0) {
    //   vm.formData.nodePosition = cell.store.data.position
    //   // 添加port连接桩
    //   cell.prop('ports/groups/group1/position', {
    //     name: 'absolute',
    //     args: {
    //       x: '50%',
    //       y: '100%'
    //     }
    //   })
    //   cell.prop('ports/items/0', {
    //     id: 'in',
    //     group: 'in'
    //   })

    // 隐藏连接桩后拖动图仍然隐藏住
    // if (vm.isHiddenPort) {
    //   setTimeout(() => {
    //     document.querySelectorAll('.x6-port-in').forEach((el) => {
    //       el.setAttribute('visibility', 'hidden')
    //     })
    //   }, 100)
    // }
    // }
  })

  // 离开节点隐藏删除按钮
  graph.on('cell:mouseleave', ({ cell }) => {
    cell.removeTools()
  })

  graph.on('edge:added', ({ edge, index, options }) => {
    // console.log(edge);
    vm.edge = graph.getEdges()
    // 增高线条优先级
    // edge.toFront();
    edge.toBack()
  })

  // Binding keyboard(copy、cut、paste、undo redo、select all)
  graph.bindKey(['meta+c', 'ctrl+c'], () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.copy(cells)
    }
    return false
  })
  graph.bindKey(['meta+x', 'ctrl+x'], () => {
    const cells = graph.getSelectedCells()
    if (cells.length) {
      graph.cut(cells)
    }
    return false
  })
  graph.bindKey(['meta+v', 'ctrl+v'], () => {
    if (!graph.isClipboardEmpty()) {
      const cells = graph.paste({ offset: 32 })
      graph.cleanSelection()
      graph.select(cells)
    }
    return false
  })
  graph.bindKey(['meta+z', 'ctrl+z'], () => {
    if (graph.canUndo()) {
      graph.undo()
    }
    return false
  })
  // watch zoom
  let zoomRatio = window.devicePixelRatio
  // 判断是否按下了ctrl键并且滚动了鼠标滚轮
  document.addEventListener(
    'wheel',
    function (event) {
      if (event.ctrlKey || event.altKey) {
        if (event.deltaY < 0) {
          zoomRatio += 0.1
          graph.zoomTo(zoomRatio)
        } else {
          zoomRatio -= 0.1
          graph.zoomTo(zoomRatio)
        }
        event.preventDefault() // 阻止页面的缩放行为
      }
    },
    { passive: false }
  )

  // // 节流
  // function throttle (fn, delay) {
  //   let valid = true
  //   return function () {
  //     if (valid) {
  //       setTimeout(() => {
  //         fn(delay)
  //         valid = true
  //       }, delay)
  //       valid = false
  //     }
  //   }
  // }
  // const __throttle = throttle(() => {
  //   // window.localStorage.setItem(
  //   //   'graph_current',
  //   //   JSON.stringify(graph.toJSON())
  //   // )
  //   // window.localStorage.setItem(
  //   //   'periodTime',
  //   //   JSON.stringify(vm.periodTime)
  //   // )
  //   vm.$message.success('保存成功')
  //   console.log(vm.graph.toJSON())
  //   console.log(vm.graphListOptions)
  // }, 500)
  // document.addEventListener('fullscreenchange', function () {
  //   console.log('full')
  //   if (!document.fullscreenElement) {
  //     // 推出全屏后触发对应方法
  //     this.$store.commit('appProject/SET_SCREEN', false)
  //   }
  // })

  // document.addEventListener('keydown', function (event) {
  //   if (event.code === 'Space') {
  //     return event.preventDefault()
  //   }

  //   if (event.ctrlKey && event.code === 'KeyS') {
  //     // 判断是否按下了ctrl+s，然后阻止事件的默认行为
  //     event.preventDefault()
  //     __throttle()
  //   }
  // }, { passive: false })
}

export default graphEvent
