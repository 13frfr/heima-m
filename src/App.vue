<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
// 频道持久化方案
// 未登录状态 数据是默认的 存到本地存储中
// 登录状态 数据是用户的 存储到服务器中
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
