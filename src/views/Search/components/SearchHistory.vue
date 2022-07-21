<template>
  <div>
    <van-cell-group>
      <van-cell title="搜素历史">
        <template #default>
          <div @click="isShowDelete = !isShowDelete">
            <div v-if="isShowDelete">
              <span @click="deleteAll">全部删除</span> <span>完成</span>
            </div>
            <i v-else class="iconfont icon-shanchu"></i>
          </div>
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell
      v-for="(item, index) in list"
      :key="index"
      :title="item"
      @click="clickFn(item)"
    >
      <template #default>
        <van-icon name="close" v-if="isShowDelete" @click="deleteFn(item)" />
      </template>
    </van-cell>
  </div>
</template>

<script>
import { getMyResult, setMyResult, delMyResult } from '@/api/search'
export default {
  props: {
    keywords: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isShowDelete: false,
      list: getMyResult() || []
    }
  },
  methods: {
    deleteFn (item) {
      this.list = this.list.filter((ele) => ele !== item)
      setMyResult(this.list)
    },
    deleteAll () {
      delMyResult()
      this.list = []
    },
    clickFn (item) {
      this.$parent.keywords = item
    }
  }
}
</script>

<style lang="less" scoped>
.icon {
  font-size: 12px;
}
</style>
