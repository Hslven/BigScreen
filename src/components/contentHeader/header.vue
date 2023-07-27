<template>
  <div class="w-full bg-mod-card rounded-sm mb-2" style="height: 100px;padding: 24px 24px 20px 28px;position: relative;overflow: hidden;">
    <div style="
      position: absolute;
      top: 50%;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      transform: translateY(-50%);
      left: 24px;
      padding: 10px;
      border-radius: 100px;
      background: rgba(194, 212, 255, 1)
      ">
      <span class="icon" style="width: 40px; height: 40px">
        <mod-icon :name="$route.meta.icon" @click="testMet" class="text-mod-primary" size="lg"></mod-icon>
      </span>
    </div>
    <div style="padding-left: 78px">
      <div class="header-font" style="line-height: 32px;">{{ $route.meta.label }}</div>
      <p class="text-second color-mod-body" style="font-size: 12px !important;">{{ $route.meta.remark }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentHeader',
  props: {
    headerObj: {
      icon: String,
      name: String,
      desc: String
    }
  },
  methods: {
    testMet () {
      console.log('mod-icon点击事件传递')
    }
  }
}
</script>

<style scoped>
.header-font {
  display: block;
  font-weight: 600;
  font-style: normal;
  text-shadow: 0 4px 8px rgba(36,46,66,.1);
  font-size: 24px;
}
.header-font {
  @apply text-mod-title;
}
</style>
