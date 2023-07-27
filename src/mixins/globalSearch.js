import { cloneDeep } from 'lodash'

export default {
  data () {
    return {
      globalFilter: '',
      initData: []
    }
  },
  watch: {
    globalFilter: {
      handler (newval, oldvalue) {
        if (!newval) {
          this.data = cloneDeep(this.initData)
        } else {
          this.data = this.initData.filter((item) => {
            return JSON.stringify(item).includes(newval)
          })
        }
        this.pagination.total = this.data.length
      },
      deep: true
    }
  },
  methods: {
    getInitData (data) {
      this.initData = cloneDeep(data)
    }
  }
}
