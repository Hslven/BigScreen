export function getPropCacheMixin (propName, proxyPropName) {
  // 获取$listeners传递的事件
  return {
    data () {
      const target = {}
      const source = this[propName]

      for (const prop in source) {
        target[prop] = source[prop]
      }

      return { [proxyPropName]: target }
    },

    watch: {
      [propName] (newObj, oldObj) {
        const target = this[proxyPropName]

        if (oldObj !== undefined) {
          // we first delete obsolete events
          // 移除$listeners中不存在的事件
          for (const prop in oldObj) {
            if (newObj[prop] === undefined) {
              this.$delete(target, prop)
            }
          }
        }

        // 更新从$listeners传递的事件
        for (const prop in newObj) {
          // we then update changed events
          if (target[prop] !== newObj[prop]) {
            this.$set(target, prop, newObj[prop])
          }
        }
      }
    }
  }
}
