const alignMap = {
  left: 'start',
  center: 'center',
  right: 'end',
  between: 'between',
  around: 'around',
  evenly: 'evenly',
  stretch: 'stretch'
}
const alignValues = Object.keys(alignMap)

export default {
  props: {
    align: {
      type: String,
      validator: v => alignValues.includes(v)
    }
  },

  computed: {
    alignClass () {
      const align = this.align === undefined
        ? (this.vertical === true ? 'stretch' : 'left')
        : this.align

      return `${this.vertical === true ? 'items' : 'justify'}-${alignMap[align]}`
    }
  }
}
