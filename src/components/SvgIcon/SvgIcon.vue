<template>
  <svg class="svg-icon" aria-hidden="true" v-on="$listeners" :fill="color" :style="{ 'font-size': `${size}px`}">
    <use :xlink:href="`#icon-${name}`" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String
    },
    size: {
      type: String,
      required: false,
      default: '18'
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  overflow: hidden;
  vertical-align: -0.15em;
  /*fill: currentColor;*/
}
</style>
