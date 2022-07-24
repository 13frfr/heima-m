<template>
  <div>
    <!-- 点击回复进行评论的弹出层 -->
    <van-popup
      v-model="secondshow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 头部 -->
      <van-nav-bar
        title="暂无回复"
        left-text="返回"
        left-arrow
        @click-left="goback"
        class="left"
      >
        111</van-nav-bar
      >
      <div class="article-comments">
        <!-- 回复的弹出层列表 -->
        <van-list finished-text="没有更多了">
          <van-cell>
            <van-image
              slot="icon"
              round
              width="30"
              height="30"
              style="margin-right: 10px"
              :src="firstitem.aut_photo"
            />
            <span style="color: #466b9d" slot="title">{{
              firstitem.aut_name
            }}</span>
            <div slot="label">
              <p style="color: #363636">{{ firstitem.content }}</p>
              <p>
                <span style="margin-right: 10px">{{
                  articleDesc(firstitem.pubdate)
                }}</span>
                <van-button size="mini" type="default" @click="clickFn"
                  >回复:{{ firstitem.reply_count }}</van-button
                >
              </p>
            </div>
            <!-- 点赞 -->
            <div class="count-zan" :class="firstitem.is_liking ? 'hot' : ''">
              <van-icon name="good-job-o" @click="addOrDelete(firstitem)">赞</van-icon>
            </div>
          </van-cell>
        </van-list>

        <div class="allreply">全部回复</div>

        <!-- 回复的弹出层的回复列表 -->
        <van-list finished-text="没有更多了">
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
                <van-button size="mini" type="default" @click="clickFn"
                  >回复:{{ item.reply_count }}</van-button
                >
              </p>
            </div>
            <!-- @click="addOrDelete" -->
            <div @click="addOrDelete">
              <van-icon slot="right-icon" name="good-job-o" />
              <span>赞</span>
            </div>
          </van-cell>
        </van-list>
        <!-- 弹出层 -->
        <van-popup
          v-model="show"
          position="bottom"
          :style="{ height: '18%' }"
          class="vanpopup"
        >
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
      </div>
      <!-- 尾部 -->
      <van-search
        shape="round"
        left-icon="comment-o"
        background="#FF69B4"
        placeholder="评论"
        @click="clickFn"
      />
    </van-popup>
  </div>
</template>

<script>
import {
  getArticleComment,
  articlesOrComments,
  addLike,
  deleteLike
} from '@/api/comment'
import dayjs from '@/utils/dayjs'
export default {
  data () {
    return {
      show: false, // 回复别人评论的弹出层
      value: '', // 弹出层回复评论的内容
      secondshow: false, // 评论回复弹出层
      list: []
    }
  },
  computed: {
    articleDesc () {
      return (data) => {
        return dayjs(data).fromNow()
      }
    }
  },
  props: {
    firstitem: {
      type: Object,
      required: true
    },
    detailslist: {
      type: [String, Object, Array],
      required: true
    }
  },
  methods: {
    // 评论回复弹出层
    secondShowPopup () {
      this.fn()
      this.secondshow = true
    },
    goback () {
      this.secondshow = false
    },
    clickFn () {
      this.show = true
    },
    // 获取评论列表
    async fn () {
      const {
        data: { data }
      } = await getArticleComment({
        type: 'c',
        source: this.firstitem.com_id,
        limit: 10000
      })
      // console.log(data)
      // 将数据添加到列表中
      this.list = data.results
    },
    // 发布评论
    async postComment () {
      console.log(11111)
      console.log(this.detailslist)
      await articlesOrComments({
        target: this.firstitem.com_id,
        content: this.value,
        art_id: this.detailslist.art_id
      })
      // console.log(res)
      this.fn()
      this.show = false
      this.value = ''
    },
    // 评论点赞
    async addOrDelete (firstitem) {
      // console.log(firstitem)
      await addLike(firstitem.com_id)
      if (!firstitem.is_liking) {
        await addLike(firstitem.com_id)
      }
      await deleteLike(firstitem.com_id)
      firstitem.is_liking = !firstitem.is_liking
    }
  }
}
</script>

<style lang="less" scoped>
:deep(.van-nav-bar__content) {
  background-color: #3296fa;
}
.van-search {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
.vanpopup {
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
:deep(.allreply) {
  font-size: 14px;
  border-bottom: 1px solid #ccc;
  padding: 15px 15px 15px 15px;
}
.hot {
  color: #3296fa;
}
</style>
