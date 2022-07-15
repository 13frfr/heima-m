<template>
  <div class="login-container">
    <van-nav-bar
      class="navbar"
      title="登录"
      left-arrow
      @click-left="backToPrePage"
    >
      <template #left>
        <van-icon name="cross" />
      </template>
    </van-nav-bar>

    <van-form class="form" @submit="login" ref="form">
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
        maxlength="11"
      >
        <template #label>
          <span class="iconfont icon-shouji"></span>
        </template>
      </van-field>
      <van-field
        v-model="code"
        type="number"
        name="code"
        placeholder="请输入验证码"
        :rules="codeRules"
      >
        <template #label>
          <span class="iconfont icon-yanzhengma"></span>
        </template>
        <template #right-icon>
          <van-count-down
            v-if="isShowCountDown"
            :time="3 * 1000"
            @finish="isShowCountDown = false"
            format="ss s"
          />
          <van-button
            v-else
            class="code-btn"
            size="mini"
            round
            @click.prevent="sendCode"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendCode } from '@/api/user'
import { mobileRules, codeRules } from './rules'
export default {
  name: 'LoginPage',
  data () {
    return {
      mobile: '',
      code: '',
      mobileRules,
      codeRules,
      isShowCountDown: false
    }
  },
  methods: {
    backToPrePage () {
      // 返回之前的页面
      this.$router.back()
    },
    async login () {
      this.$toast.loading({
        message: '加载中...',
        // loading 禁止点击页面
        forbidClick: true
      })
      try {
        const res = await login(this.mobile, this.code)
        // 存储token
        this.$store.commit('setUser', res.data.data)
        // console.log(res)
        // 路由跳转
        this.$router.push('./profile')
        // 提示成功
        this.$toast.success('登录成功')
      } catch (err) {
        // 提示失败
        // 拿到状态码
        const status = err.response.status
        // 默认失败消息
        let message = '登录错误'
        if (status === 400) {
          message = err.response.data.message
        }
        this.$toast.fail(message)
        // switch (status) {
        //   case 400:
        //     this.$toast.fail(err.response.data.message)
        //     break
        //   case 500:
        //     this.$toast.fail('登录错误，请刷新')
        //     break

        //   default:
        //     this.$toast.fail('登录错误，请刷新')
        //     break
        // }
      }
    },
    async sendCode () {
      try {
        // 验证手机号
        await this.$refs.form.validate('mobile')
        // 发送请求，获取验证码
        await sendCode(this.mobile)
        // 显示倒计时
        this.isShowCountDown = true
      } catch (err) {
        // this.$toast.fail('手机号非法！')
        // 1.表单验证失败
        if (!err.response) {
          this.$toast.fail('手机号格式不正确')
        } else {
          // 2.发送验证码导致失败
          const status = err.response.status
          if (status === 404 || status === 429) {
            this.$toast.fail(err.response.data.message)
          }
        }
      }
    }
  }
}
</script>
<style scoped lang="less">
.navbar {
  background-color: #3296fa;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  .van-icon {
    color: #fff;
  }
}
.form {
  :deep(.van-field__label) {
    flex: 1;
  }
  :deep(.van-cell__value) {
    flex: 20;
  }
  .iconfont {
    font-size: 0.49333rem;
  }
  .van-button {
    background-color: #6db4fb;
    border: none;
  }
  .code-btn {
    background-color: #ededed;
    padding: 0 10px;
    color: #666;
  }
}
</style>
