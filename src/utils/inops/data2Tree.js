import Vue from 'vue'

/**
 * 后端对象数组转化为树形数据
 * @param list 对象数组
 * @param key 节点名称对应的键
 * @param type  节点类型 属性名
 * @param isOnlyNode  是否只需要根节点数据  默认为false
 */
export function data2Tree (list, key, type, isOnlyNode = false) {
  // 树结构数据
  const tree = []
  // 树结构对象
  const map = {}
  list.forEach(item => {
    // 判断是否为根节点
    if (item[type] === '0') {
      Vue.set(item, 'chilren', [])
    }
    Vue.set(map, item.id, item)
  })
  for (let i = 0; i < list.length; i++) {
    const parent = map[list[i].parentId]
    if (parent) {
      if (isOnlyNode && list[i][type] === '1') continue
      parent.chilren.push({
        label: list[i][key],
        value: list[i].id,
        children: list[i].chilren,
        isRoot: list[i][type] === '0'
      })
    } else {
      tree.push({
        label: list[i][key],
        value: list[i].id,
        children: list[i].chilren,
        isRoot: list[i][type] === '0'
      })
    }
  }
  return tree
}
