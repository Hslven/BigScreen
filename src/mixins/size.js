export const sizes = {
  xs: 18,
  sm: 24,
  md: 32,
  lg: 38,
  xl: 46
}

export function getSizeMixin (sizes) {
  return {
    props: {
      size: String
    },

    computed: {
      sizeStyle () {
        // eslint-disable-next-line no-void
        if (this.size !== undefined) {
          return { fontSize: this.size in sizes ? `${sizes[this.size]}px` : this.size }
        } else {
          return { fontSize: '' }
        }
      }
    }
  }
}

export default getSizeMixin(sizes)
