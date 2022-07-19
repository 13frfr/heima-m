<template>
  <van-popup
    v-model="isShow"
    position="bottom"
    :style="{ height: '90%' }"
    closeable
    close-icon-position="top-left"
  >
    <div class="popupMain">
      <!-- 我的频道 -->
      <div class="my-channel">
        <!-- 我的频道标题 -->
        <van-cell title="我的频道">
          <van-button
            size="small"
            round
            class="edit-btn"
            @click="isEdit = !isEdit"
            >{{ isEdit ? '完成' : '编辑' }}</van-button
          >
        </van-cell>
        <!-- 我的频道 -->
        <van-grid :border="false" gutter="10px">
          <van-grid-item
            @click="onClickMyChannel(item, index)"
            v-for="(item, index) in myChannels"
            :key="item.id"
            :text="item.name"
            :class="{ 'active-channel': item.name === '推荐' }"
          >
            <template #icon>
              <van-icon name="cross" v-show="isEdit && item.name !== '推荐'" />
            </template>
          </van-grid-item>
        </van-grid>
      </div>
      <div class="recommend-channel">
        <!-- 推荐频道标题 -->
        <van-cell title="推荐频道"></van-cell>
        <!-- 推荐频道 -->
        <van-grid :border="false" gutter="10px">
          <van-grid-item
            v-for="item in recommendChannels"
            :key="item.id"
            :text="item.name"
            icon="plus"
            @click="addMyChannel(item)"
          ></van-grid-item>
        </van-grid>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  name: 'Edit',
  data () {
    return {
      isShow: false,
      allChannels: [],
      // 编辑是否处于编辑状态
      isEdit: false
    }
  },
  props: {
    myChannels: {
      type: Array,
      required: true
    }
  },
  created () {
    this.getAllChannels()
  },
  methods: {
    // 获取所有频道列表并处理数据
    async getAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    onClickMyChannel (channel, index) {
      // 边缘情况判断
      if (this.isEdit && channel.name !== '推荐') {
        // 删除
        return this.$emit('del-mychannel', channel.id)
      }
      if (!this.isEdit) {
        this.isShow = false
        this.$emit('change-active', index)
      }
    },
    // 添加频道
    addMyChannel (myChannel) {
      this.$emit('add-mychannel', { ...myChannel })
    }
  },
  computed: {
    recommendChannels () {
      // 在所有频道中 筛选掉 我的频道
      return this.allChannels.filter((item) => {
        // 所有频道的每一项
        return !this.myChannels.find((i) => i.id === item.id)
        // const result = this.myChannels.find((i) => i.id === item.id)
        // if (result) {
        //   return false
        // } else {
        //   return true
        // }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.active-channel {
  :deep(.van-grid-item__text) {
    color: red;
  }
}
.popupMain {
  padding-top: 50px;
  .edit-btn {
    color: red;
    padding: 0 15px;
    height: 24px;
    border: 0.02667rem solid red;
  }
  :deep(.van-grid-item__content) {
    background-color: #eee;
  }
  // 我的频道
  .my-channel {
    :deep(.van-grid-item__content) {
      position: relative;

      .van-grid-item__icon-wrapper {
        position: absolute;
        top: 0;
        right: 0;

        .van-icon-cross {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(20%, -35%);
          border: 0.02667rem solid #000;
          border-radius: 50%;
          text-align: center;
          // line-height: 0.32rem;
          z-index: 100;
        }
        .van-icon {
          font-size: 12px;
        }
      }
    }
  }
  // 推荐频道
  // 推荐频道的样式
  .recommend-channel {
    // 推荐频道加号样式
    :deep(.van-grid-item__content) {
      flex-direction: row;

      .van-grid-item__icon {
        font-size: 0.5rem;
      }

      .van-grid-item__text {
        margin-top: 0;
      }
    }
  }
}
</style>
