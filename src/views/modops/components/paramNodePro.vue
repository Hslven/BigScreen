<template>
  <div>
    <div style="display: grid;grid-template-columns: 1fr 3fr;width: 100%; height: 100%" :style="{'box-shadow':active ? '0 0 5px 5px rgba(85, 188, 138, 0.2)':''}" @click="active = !active">
      <div style="background-color: #3cb67c;border-radius: 4px 0 0 4px;display: inline-flex;flex-grow: 0;align-items: center;justify-content: center;padding: 20px 0px 20px 0px">
        <mod-icon name="memory" color="white" style="font-size: 1.4rem"></mod-icon>
      </div>
      <div
          style="background-color: #3cb67c;font-size: 12px; padding: 20px 4px 20px 4px;color: white; border-radius: 0 4px 4px 0; letter-spacing: 2px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;text-align: center"
          :style="{'border':active ? '':''}"
      >
        {{ nodeInfo.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'paramNodePro',
  data () {
    return {
      active: false,
      nodeInfo: {
        name: '',
        type: ''
      }
    }
  },
  inject: ['getGraph', 'getNode'],
  mounted () {
    this.nodeInfo = this.getNode().getData()
    document.addEventListener('click', e => {
      if (!this.$el.contains(e.target)) {
        this.active = false
      } else {
        this.active = true
      }
    })
  }
}
</script>

<style scoped>

</style>
