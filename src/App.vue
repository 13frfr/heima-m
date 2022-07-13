<template>
  <div>
    <router-view ></router-view>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'App',
  created () {
    console.dir(request)
  }
}
</script>

<style scoped>
.login {
  width: 347px;
  height: 44px;
  background-color: #6db4fb;
  border-radius: 5px;
  margin: auto;
  margin-top: 30px;
}
</style>
