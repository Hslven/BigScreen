// 成环判断
export function LoopJupge (edges) {
  const graph = {}
  const visited = {}
  let isDAG = true
  const nodes = []
  function DFS (i) {
    visited[nodes[i]] = 1
    for (let j = 0; j < nodes.length; j++) {
      if (graph[nodes[i]][nodes[j]] !== 0) {
        if (visited[nodes[j]] === 1) {
          isDAG = false
          break
        } else if (visited[nodes[j]] === -1) {
          continue
        } else {
          DFS(j)
        }
      }
    }
    visited[nodes[i]] = -1
  }

  function create (nodes, edges) {
    for (let i = 0; i < nodes.length; i++) {
      const pre = nodes[i]
      graph[pre] = {}
      for (let j = 0; j < nodes.length; j++) {
        const next = nodes[j]
        graph[pre][next] = 0
      }
    }
    for (let k = 0; k < edges.length; k++) {
      const edge = edges[k]
      graph[edge.source][edge.target] = 1
    }
    for (let i = 0; i < nodes.length; i++) {
      visited[nodes[i]] = 0
    }
  }

  edges.forEach(e => {
    const { source, target } = e
    if (!nodes.includes(source)) {
      nodes.push(source)
    }
    if (!nodes.includes(target)) {
      nodes.push(target)
    }
  })
  create(nodes, edges)
  for (let i = 0; i < nodes.length; i++) {
    if (visited[nodes[i]] === -1) {
      continue
    }
    DFS(i)
    if (!isDAG) {
      return true
    }
  }
  if (isDAG) {
    return false
  }
}
