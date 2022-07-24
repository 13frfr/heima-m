<template>
  <div>
    <!-- 头部区域 -->
    <div class="article-top">
      <van-nav-bar
        class="navbar"
        title="黑马头条"
        left-arrow
        @click-left="goback"
      >
      </van-nav-bar>
    </div>
    <!-- 中间文章区域 -->
    <div class="main-wrap markdown-body">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="isLoading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="detailslist.title">
        <!-- 文章标题 -->
        <h1 class="article-title markdown-body">{{ detailslist.title }}</h1>

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div slot="title" class="user-name">{{ detailslist.aut_name }}</div>
          <div slot="label" class="publish-date">{{ detailslist.pupdate }}</div>
          <van-button
            v-if="detailslist.is_followed"
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            @click="getFollowing"
            >关注</van-button
          >
          <!-- 这里的逻辑其实是如果detailslist里面的is_followed为true  -->
          <van-button
            class="follow-btn"
            round
            size="small"
            v-else
            @click="getFollowing"
            >已关注</van-button
          >
        </van-cell>
        <!-- 文章内容 -->
        <div class="article-content">
          <article class="markdown-body" v-html="detailslist.content"></article>
        </div>
        <van-divider>正文结束</van-divider>
      </div>

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button @click="getArticleDetails()" class="retry-btn"
          >点击重试</van-button
        >
      </div>
      <div class="article-comments">
        <!-- 评论列表 -->
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <van-cell v-for="item in list" :key="item.com_id">
            <van-image
              slot="icon"
              round
              width="30"
              height="30"
              style="margin-right: 10px"
              :src="item.aut_photo"
            />
            <span style="color: #466b9d" slot="title">{{ item.aut_name }}</span>
            <div slot="label">
              <p style="color: #363636">{{ item.content }}</p>
              <p>
                <span style="margin-right: 10px">{{
                  articleDesc(item.pubdate)
                }}</span>
                <van-button
                  size="mini"
                  type="default"
                  @click="secondShowPopupThings(item)"
                  >回复:{{ item.reply_count }}</van-button
                >
              </p>
            </div>
            <!-- 点赞 -->
            <div class="count-zan" :class="item.is_liking ? 'hot' : ''">
              <van-icon name="good-job-o" @click="addOrDelete(item)"
                >赞</van-icon
              >
            </div>
          </van-cell>
        </van-list>
      </div>
    </div>
    <!-- 底部区域     -->
    <div class="article-bottom" v-for="item in list" :key="item.com_id">
      <!-- 评论 -->
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="showPopup"
        >写评论</van-button
      >
      <van-popup v-model="show" position="bottom" :style="{ height: '18%' }">
        <van-field
          v-model="value"
          rows="2"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请输入留言"
          show-word-limit
        >
        </van-field>
        <span @click="postComment">发布</span>
      </van-popup>
      <van-icon name="comment-o" :badge="detailslist.comm_count" color="#777" />
      <!-- 收藏 -->
      <van-icon
        v-if="detailslist.is_collected"
        color="#777"
        name="star-o"
        @click="articleCollected"
      />
      <!-- 取消收藏 -->
      <van-icon v-else color="#3296FA" name="star" @click="articleCollected" />
      <!-- 点赞 -->
      <!-- <div class="count-zan" :class="item.is_liking ? 'hot' : ''">
        <van-icon name="good-job-o" @click="addOrDelete(item)"></van-icon>
      </div> -->
        <van-icon
          v-if="item.is_liking"
          color="#777"
          name="good-job-o"
          @click="addOrDelete(item)"
        />
        <van-icon
          v-else
          color="#3296FA"
          name="good-job-o"
          @click="addOrDelete(item)"
        />

      <van-icon
        name="share"
        color="#777777"
        @click="showShare = true"
      ></van-icon>
      <van-share-sheet
        v-model="showShare"
        title="立即分享给好友"
        :options="options"
        @select="onSelect"
      />
    </div>
    <commentsBack
      ref="child"
      :firstitem="firstitem"
      :detailslist="detailslist"
    ></commentsBack>
  </div>
</template>

<script>
import commentsBack from './components/commentsBack.vue'
import dayjs from '@/utils/dayjs'
import { getFollowings, cancelFollowings } from '@/api/user'
import { Toast } from 'vant'
import {
  getArticleComment,
  articlesOrComments,
  addLike,
  deleteLike
} from '@/api/comment'
import {
  getArticleDetails,
  getArticleCollected,
  cancelArticleCollected
} from '@/api/new'
export default {
  data () {
    return {
      value: '', // 评论内容
      message: '',
      detailslist: [],
      firstitem: {},
      isLoading: false,
      show: false, // 发布评论弹出层
      isShow: false,
      showShare: false, // 分享弹出层
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      totalCount: 0, // 总数据条数
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '微博', icon: 'weibo' },
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' }
      ]
    }
  },
  components: {
    commentsBack
  },
  computed: {
    articleDesc () {
      return (data) => {
        return dayjs(data).fromNow()
      }
    }
  },
  created () {
    this.getArticleDetails()
  },
  methods: {
    // 评论点赞
    async addOrDelete (item) {
      // console.log(11111)
      if (!item.is_liking) {
        await addLike(item.com_id)
      }
      await deleteLike(item.com_id)
      item.is_liking = !item.is_liking
    },
    secondShowPopupThings (item) {
      this.fn1(item).then(() => this.$refs.child.secondShowPopup())
    },
    fn1 (item) {
      return Promise.resolve((this.firstitem = item))
    },
    // 发布评论弹出层
    showPopup () {
      this.show = true
    },
    onSelect (option) {
      Toast(option.name)
      this.showShare = false
    },
    async getArticleDetails () {
      this.isLoading = true
      try {
        const { data } = await getArticleDetails(this.$route.query.artistId)
        // console.log(data)
        this.detailslist = data.data
        // console.log(this.detailslist)
        this.fn()
      } catch (err) {
        // 加载失败404
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        this.$toast('获取失败')
      }
      this.isLoading = false
    },
    goback () {
      this.$router.back()
    },
    async getFollowing () {
      // console.log(11)
      if (!this.detailslist.is_followed) {
        await getFollowings(this.detailslist.aut_id)
        // console.log(res)
      }
      await cancelFollowings(this.detailslist.aut_id)
      this.detailslist.is_followed = !this.detailslist.is_followed
    },
    async articleCollected () {
      if (!this.detailslist.is_collected) {
        await getArticleCollected(this.detailslist.art_id)
      }
      await cancelArticleCollected(this.detailslist.art_id)
      this.detailslist.is_collected = !this.detailslist.is_collected
    },
    onLoad () {
      // 加载状态结束
      this.loading = false

      // 数据全部加载完成
      if (this.list.length >= 5) {
        this.finished = true
      }
    },
    // 获取评论列表
    async fn () {
      const {
        data: { data }
      } = await getArticleComment({
        type: 'a',
        source: this.detailslist.art_id,
        limit: 10000
      })
      // console.log(data)
      // 将数据添加到列表中
      // const { res } = data
      this.list = data.results
      // this.totalCount = data.total_count
      this.loading = false
    },
    // 发布评论
    async postComment () {
      // console.log(11111)
      await articlesOrComments({
        target: this.detailslist.art_id,
        content: this.value
      })
      // console.log(res)
      this.fn()
      this.show = false
      this.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
// 头部
.navbar {
  background-color: #3296fa;
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
}
:deep(.van-nav-bar .van-icon) {
  color: #fff;
}
// 中间
.count-zan {
  margin-right: 0;
}
.hot {
  color: #3296fa;
}
.main-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: scroll;
  background-color: #fff;
}
.article-detail {
  .article-title {
    font-size: 20px;
    padding: 25px 16px;
    margin: 0;
    color: #3a3a3a;
  }

  .user-info {
    padding: 0 16px;
    margin-top: 10px;
    .avatar {
      width: 35px;
      height: 35px;
      margin-right: 8px;
    }
    .van-cell__label {
      margin-top: 0;
    }
    .user-name {
      font-size: 12px;
      color: #3a3a3a;
    }
    .publish-date {
      font-size: 12px;
      color: #b7b7b7;
    }
    .follow-btn {
      width: 85px;
      height: 29px;
    }
  }

  .article-content {
    padding: 27px 16px;
    /deep/ p {
      text-align: justify;
      font-size: 12px;
    }
  }
}

.loading-wrap {
  padding: 100px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.error-wrap {
  padding: 100px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  .van-icon {
    font-size: 61px;
    color: #b4b4b4;
  }
  .text {
    font-size: 15px;
    color: #666666;
    margin: 16px 0 24px;
  }
  .retry-btn {
    width: 140px;
    height: 35px;
    line-height: 35px;
    border: 1px solid #c3c3c3;
    font-size: 15px;
    color: #666666;
  }
}
// 底部
.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 44px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 141px;
    height: 23px;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
  .van-icon {
    font-size: 20px;
    .van-info {
      font-size: 12px;
      background-color: #e22829;
    }
  }
}
.van-popup {
  display: flex;
  justify-content: space-around;
  align-items: center;
  .van-cell {
    background-color: #eee;
    width: 298px;
    height: 88px;
    :deep(.van-field__control) {
      width: 270px;
    }
  }
  span {
    display: inline-block;
    font-size: 15px;
    text-align: center;
    color: #6ba3d8;
  }
}
.van-list {
  margin-bottom: 45px;
}
</style>
