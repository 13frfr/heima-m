<template>
  <div>
    <van-nav-bar class="navbar">
      <template #title>
        <van-button round @click="$router.push('/search')"
          ><van-icon name="search" />搜索</van-button
        >
      </template>
    </van-nav-bar>

    <!-- tabs选项卡 -->
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="item in myChannels" :key="item.id" :title="item.name">
        <!-- 文章列表 -->
        <ArticleList :id="item.id"></ArticleList>
      </van-tab>
      <!-- 更多的按钮 -->
      <span class="iconfont icon-gengduo" @click="showPop"></span>
    </van-tabs>
    <!-- 弹框 -->
    <EditChannelPopup
      ref="popup"
      :myChannels="myChannels"
      @del-mychannel="delMyChannel"
      @change-active="changeActive"
      @add-mychannel="addMyChannel"
    ></EditChannelPopup>
  </div>
</template>

<script>
// 引入API
import {
  getMyChannels,
  getMyChannelsByLocal,
  setMyChannelsToLocal,
  delMyChannel,
  addMyChannel
} from '@/api/channel'
// 引入组件
import ArticleList from './component/ArticleList.vue'
import EditChannelPopup from './component/EditChannelPopup.vue'
export default {
  data () {
    return {
      active: 0,
      myChannels: []
    }
  },
  computed: {
    // 登录状态
    isLogin () {
      return !!this.$store.state.user.token
    }
  },
  components: {
    ArticleList,
    EditChannelPopup
  },
  created () {
    this.getMyChannels()
  },
  methods: {
    // 获取我的频道
    async getMyChannels () {
      try {
        // 离线状态 存在本地存储中
        if (!this.isLogin) {
          const myChannels = getMyChannelsByLocal()
          // 如果本地存储里面有数据 直接找本地
          if (myChannels) {
            this.myChannels = myChannels
          } else {
            // 如果本地存储里面无数据 发请求获取
            const { data } = await getMyChannels()
            this.myChannels = data.data.channels
          }
        } else {
          // 登录状态 发请求获取
          const { data } = await getMyChannels()
          this.myChannels = data.data.channels
        }
      } catch (error) {
        this.$toast.fail('请重新获取频道列表')
      }
    },
    showPop () {
      this.$refs.popup.isShow = true
    },
    changeActive (active) {
      this.active = active
    },
    // 添加我的频道
    async addMyChannel (channel) {
      this.myChannels.push(channel)
      // 离线状态 存在本地存储中
      if (!this.isLogin) {
        setMyChannelsToLocal(this.myChannels)
      } else {
        // 登录状态 发请求获取
        try {
          await addMyChannel(channel.id, this.myChannels.length)
        } catch (error) {
          return this.$toast.fail('添加用户频道失败')
        }
      }
      this.$toast.success('添加用户频道成功')
    },
    // 删除我的频道
    async delMyChannel (id) {
      this.myChannels = this.myChannels.filter((item) => item.id !== id)
      // 离线状态 存在本地存储中
      if (!this.isLogin) {
        setMyChannelsToLocal(this.myChannels)
      } else {
        // 登录状态 发请求获取
        try {
          await delMyChannel(id)
        } catch (error) {
          return this.$toast.fail('删除用户频道失败')
        }
      }
      this.$toast.success('删除用户频道成功')
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  background-color: #3296fa;
  color: #fff;
  .van-button {
    width: 265px;
    height: 31px;
    background-color: #5babfb;
  }
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }
  .van-button__text {
    color: #fff;
  }
  .van-icon-search {
    color: #fff;
  }
  .van-button--default {
    border: 0.02667rem solid #5babfb;
  }
}
//tabs选项卡
:deep(.van-tabs__wrap) {
  padding-right: 33px;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 100px;
      height: 41px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 15.5px;
      height: 3px;
      background-color: #3296fa;
      bottom: 20px;
    }
  }
}

/* 字体图标 */
.icon-gengduo {
  z-index: 99;
  position: absolute;
  top: 0;
  right: 0;
  width: 33px;
  height: 41px;
  font-size: 20px;
  line-height: 41px;
  text-align: center;
  opacity: 0.6;
  border-bottom: 1px solid #eee;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-image: url('~@/assets/images/gradient-gray-line.png');
  }
}
// 头部固定的样式
.navbar {
  position: sticky;
  top: 0;
  left: 0;
}
:deep(.van-tabs__wrap) {
  position: sticky;
  top: 46px;
  left: 0;
  z-index: 99;
}
.toutiao-gengduo {
  position: fixed;
  top: 46px;
}

:deep(.van-tabs__content) {
  max-height: calc(100vh - 46px - 41px - 50px);
  overflow: auto;
}
</style>
