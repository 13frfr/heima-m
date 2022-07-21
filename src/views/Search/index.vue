<template>
  <div>
    <form action="/">
      <van-search
        v-model="keywords"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="backToPrePage"
        @focus="visibleSearchSuggestion"
        background="#3296fa"
        class="search"
      />
    </form>
    <!-- 搜索结果/历史/建议 -->
    <component :is="componentName" :keywords="keywords" :isShowSearchResult="isShowSearchResult"></component>
  </div>
</template>

<script>
import SearchHistory from './components/SearchHistory.vue'
import SearchSuggestion from './components/SearchSuggestion.vue'
import SearchResult from './components/SearchResult.vue'
export default {
  data () {
    return {
      // 搜索关键词
      keywords: '',
      isShowSearchResult: false
    }
  },
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  computed: {
    componentName () {
      if (this.keywords.trim() === '') {
        return 'SearchHistory'
      }
      if (this.isShowSearchResult) {
        return 'SearchResult'
      }
      return 'SearchSuggestion'
    }
  },
  methods: {
    // 搜索
    onSearch () {
      console.log('正在搜索')
      this.isShowSearchResult = true
    },
    // 返回上一页
    backToPrePage () {
      this.$router.go(-1)
    },
    visibleSearchSuggestion () {
      this.isShowSearchResult = false
    }
  }
}
</script>

<style lang="less" scoped>
:deep(.search) {
  color: #fff;
  z-index: 99;
}
</style>
