<template>
  <div>
    <!-- 每一篇的文章结构 -->
    <van-pull-refresh
      v-model="refreshloading"
      @refresh="loadNextPage"
      success-text="刷新成功~"
    >
      <van-list
        @load="loadNextPage"
        :immediate-check="false"
        v-model="loading"
        :finished="isFinished"
        :error.sync="error"
        error-text="出错了，请重新加载！"
        finished-text="没有更多了..."
      >
        <ArticleItem
          v-for="item in articles"
          :key="item.atr_id"
          :articleInfo="item"
          @click.native="godetails(item.art_id)"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 引入API
import { getArticleList } from '@/api/new'
// 引入组件
import ArticleItem from './ArticleItem.vue'
export default {
  name: 'ArticleList',
  data () {
    return {
      articles: [],
      pre_timestamp: '',
      loading: false,
      isFinished: false,
      error: false,
      refreshloading: false
    }
  },
  components: {
    ArticleItem
  },
  props: {
    // 频道id
    id: {
      type: [String, Number],
      required: true
    }
  },
  created () {
    this.getArticleList()
  },
  methods: {
    godetails (artistId) {
      this.$router.push({
        path: '/details',
        query: {
          artistId
        }
      })
    },
    // 获取频道文章 并处理 文章数据
    async getArticleList () {
      try {
        const { data } = await getArticleList(this.id, +new Date())
        // 保存第一页页码
        this.pre_timestamp = data.data.pre_timestamp
        // console.log(data)
        this.articles = data.data.results
      } catch (error) {
        // 获取状态吗
        const status = error.response.status
        if (status === 400) {
          throw new Error(error.response.data.message)
        } else {
          this.$toast.fail('获取文章列表失败，请重新刷新')
        }
      }
    },
    // 加载下一页频道数据
    async loadNextPage () {
      try {
        if (Math.random() < 0.7) {
          throw new Error('出错了')
        }
        const { data } = await getArticleList(this.id, this.pre_timestamp)
        if (!data.data.pre_timestamp) {
          this.isFinished = true
        }
        // 将第n页数据放在articles
        if (this.refreshloading) {
          // 如果是下拉刷新 数据放在最前面
          this.articles.unshift(...data.data.results)
        } else {
          this.articles.push(...data.data.results)
        }

        // 更新页数
        this.pre_timestamp = data.data.pre_timestamp
        // loading设置为false
      } catch (error) {
        this.error = true
      } finally {
        this.loading = false
        this.refreshloading = false
      }
    }
  }
}
</script>

<style></style>
