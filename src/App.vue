<template>
  <div>
    <h1>黑马头条</h1>
    <span class="iconfont icon-dianzan2"></span>
    <van-button type="primary">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button>
    <van-button type="default">默认按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>
    <div class="login"></div>
  </div>
</template>

<script>
export default {
  name: 'App'
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
