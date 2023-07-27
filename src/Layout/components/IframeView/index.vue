<template>
  <transition-group name="fade-transform" mode="out-in">
    <div v-for="(item, index) in iframeViews" :key="item.path">
      <inner-link
        v-show="$route.path === item.path"
        :iframeId="'iframe' + index"
        :src="item.iframeLink"
      ></inner-link>
    </div>
  </transition-group>
</template>

<script>
import InnerLink from '../InnerLink/index'

export default {
  components: { InnerLink },
  computed: {
    iframeViews () {
      return this.$store.getters.getTagView.filter((item) => {
        return !item.isFrame
      })
    }
  }
}
</script>
