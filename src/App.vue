<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html,body,#root{
  width: 100%;
  height: 100%;
}
.ant-layout{
  height: 100%;
}
#app {
  height: 100%;
}
</style>
