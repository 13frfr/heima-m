<template>
  <div>
    <van-cell v-for="(item, index) in searchlist" :key="index">
      <template #title>
        <span v-html="item.title"></span>
      </template>
    </van-cell>
  </div>
</template>

<script>
import { SearchResult, getMyResult, setMyResult } from '@/api/search'
export default {
  data () {
    return {
      searchlist: []
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
  created () {
    this.SearchResult()
    // console.log(this.SearchResult())
  },
  methods: {
    async SearchResult () {
      const { data } = await SearchResult(2, 20, this.keywords)
      console.log(data)
      const res = getMyResult() || []
      res.push(this.keywords)
      const arr = Array.from(new Set(res))
      setMyResult(arr)
      this.searchlist = data.data.results
    }
  }
}
</script>

<style></style>
