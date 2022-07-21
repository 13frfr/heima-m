<template>
  <div>
    <van-cell
      v-for="(item, index) in highlightData"
      :key="index"
      @click="clickFn"
    >
      <template #icon>
        <van-icon name="search" class="search-icon" />
      </template>
      <template #title>
        <span v-html="item"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { SearchSuggestion } from '@/api/search'
export default {
  data () {
    return {
      suggessions: []
    }
  },
  props: {
    keywords: {
      type: String,
      required: true
    },
    isShowSearchResult: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    // 获取搜索建议 并处理数据
    async SearchSuggestion () {
      try {
        const res = await SearchSuggestion(this.keywords)
        //   console.log(res)
        if (res.data.data.options.length === 0) {
          this.$toast.fail('没有搜索建议')
        }
        this.suggessions = res.data.data.options.filter(Boolean)
      } catch (error) {
        console.log(error)
      }
    },
    clickFn () {
      this.$parent.isShowSearchResult = true
    }
  },
  watch: {
    keywords: {
      immediate: true,
      handler () {
        this.SearchSuggestion()
      }
    }
  },
  computed: {
    highlightData () {
      const reg = new RegExp(this.keywords, 'ig')
      return this.suggessions.map((str) =>
        str.replace(reg, (match) => `<span style="color: red">${match}</span>`)
      )
    }
  }
}
</script>

<style lang="less" scoped>
.search-icon {
  padding-top: 5px;
}
</style>
