import Vue from 'vue'
export function loopGroup (groupList, keyName, treeType) {
  const groupTree = []
  const groupMap = {}
  groupList.forEach(group => {
    if (treeType ? group[treeType] : group.type === '0') {
      Vue.set(group, 'chilren', [])
    }
    Vue.set(groupMap, group.id, group)
  })
  groupList.forEach(group => {
    const parent = groupMap[group.parentId]
    const groupType = treeType ? group[treeType] : group.type
    if (parent) {
      if (groupType === '0') {
        parent.chilren.push({
          id: group.id,
          label: group[keyName],
          icon: 'folder_open',
          children: group.chilren
        })
      } else if (groupType === '1') {
        parent.chilren.push({
          id: group.id,
          label: group[keyName],
          children: group.chilren
        })
      }
    } else {
      groupTree.push({
        id: group.id,
        label: group[keyName],
        icon: 'folder_open',
        children: group.chilren
      })
    }
  })
  return groupTree
}

export function loopGroupOnlyNode (groupList, keyName, treeType) {
  const groupTree = []
  const groupMap = {}
  groupList.forEach(group => {
    if (treeType ? group[treeType] : group.type === '0') {
      Vue.set(group, 'chilren', [])
    }
    Vue.set(groupMap, group.id, group)
  })
  groupList.forEach(group => {
    const parent = groupMap[group.parentId]
    const groupType = treeType ? group[treeType] : group.type
    if (parent) {
      if (groupType === '0') {
        parent.chilren.push({
          id: group.id,
          label: group[keyName],
          icon: 'folder_open',
          children: group.chilren
        })
      }
    } else {
      groupTree.push({
        id: group.id,
        label: group[keyName],
        icon: 'folder_open',
        children: group.chilren
      })
    }
  })
  return groupTree
}

export function findParentId (parentId, groupList) {
  const index = groupList.findIndex(item => item.id === parentId)
  return groupList[index]
}
