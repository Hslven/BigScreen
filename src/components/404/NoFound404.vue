<template>
   <div>
     <div class="row justify-center">
      <div style="font-size: 18px; font-weight: bold">404</div>
      <t-button @click="back">返 回</t-button>
     </div>
   </div>
</template>

<script>

export default {
  name: 'NoFound404',
  methods: {
    back () {
      window.history.back(-1)
    }
  }
}
</script>
<style lang="css">
  .bg-logon-card-input{
    background:  linear-gradient(to right, #36d1dc 1%, #5b86e5 99%);
    transition: all 0.3s ease-in-out;
    background-size: 200% auto;
  }

  .bg-logon-card-input:hover{
    background-position: right center;
    box-shadow: 0 12px 20px -11px #5b86e5;
  }
</style>
