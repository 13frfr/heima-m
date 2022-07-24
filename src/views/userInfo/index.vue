<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 🐖🐖头像 -->
    <input type="file" ref="file" hidden accept=".png,.jpg" />
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image
        width="40"
        height="40"
        round
        :src="!!update ? update : userInfo.photo"
      />
    </van-cell>
    <!-- 编辑头像弹出层 -->
    <van-popup v-model="show" style="height: 100%">
      <updateUserPhoto
        v-if="show"
        @close="show = false"
        :photo="photo"
        @update="updateimg"
      ></updateUserPhoto>
    </van-popup>

    <!-- 🐖🐖昵称 -->
    <van-cell
      title="昵称"
      v-model="value1"
      @click="isShowUpdateName = true"
      is-link
    />
    <!-- 编辑昵称弹层 -->
    <van-popup
      v-model="isShowUpdateName"
      style="height: 100%"
      position="bottom"
    >
      <van-nav-bar
        title="编辑昵称"
        left-text="取消"
        right-text="确定"
        @click-left="isShowUpdateName = false"
        @click-right="showUpdateName"
      />
      <div style="padding: 10px">
        <van-field
          rows="2"
          autosize
          v-model="message"
          maxlength="50"
          placeholder="请输入新昵称"
          show-word-limit
        />
      </div>
    </van-popup>

    <!-- 🐖🐖性别 -->
    <van-cell
      title="性别"
      v-model="value2"
      clickable
      @click="isShowUpdateGender = true"
      is-link
    />
    <!-- 编辑性别弹层 -->
    <van-popup v-model="isShowUpdateGender" position="bottom">
      <van-picker
        title="更新性别"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>

    <!-- 🐖🐖生日 -->
    <van-cell
      title="生日"
      v-model="value3"
      @click="isShowUpdateBirthdy = true"
      is-link
    />
    <!-- 编辑生日弹层 -->
    <van-popup v-model="isShowUpdateBirthdy" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="enSure"
        @cancel="isShowUpdateBirthdy = false"
      />
    </van-popup>
  </div>
</template>

<script>
import updateUserPhoto from './components/updateUserPhoto.vue'
import { getUserInfo, getUserProfile, reviseUserProfile } from '@/api/user'
import dayjs from '@/utils/dayjs'
// import dayjs from '@/utils/dayjs'
export default {
  name: 'userInfo',
  data () {
    return {
      show: false,
      photo: '',
      isShowUpdateName: false,
      isShowUpdateGender: false,
      isShowUpdateBirthdy: false,
      columns: ['男', '女'],
      message: '',
      value1: '',
      value2: '',
      value3: '',
      update: '',
      userInfo: {},
      minDate: new Date(1990, 1, 1),
      maxDate: new Date(2022, 7, 24),
      currentDate: new Date(1999, 11, 4),
      userList: [],
      revise: {},
      nan: 0
    }
  },
  components: {
    updateUserPhoto
  },
  mounted () {
    this.$refs.file.addEventListener('change', (e) => {
      // e.target 触发事件的元素
      // 图片的src能识别什么?
      //  - 图片相对/绝对路径
      //  - base64 DateUrl
      //  - file,blob对象的url
      const file = e.target.files[0]
      // file = URL.createObjectURL(file) // 将file对象转换成图片可识别的url
      const fr = new FileReader()
      fr.readAsDataURL(file)

      fr.onload = (e) => {
        this.photo = e.target.result
        this.show = true
      }
    })
  },
  created () {
    this.getUserInfo()
    this.getUserProfile()
    this.reviseUserProfile()
  },
  methods: {
    updateimg (update) {
      this.show = false
      this.update = update
    },
    showUpdateName () {
      this.value1 = this.message
      this.reviseUserProfile()
      this.isShowUpdateName = false
    },

    onConfirm (value) {
      this.value2 = value
      this.nan = this.value2 === '男' ? 0 : 1
      this.reviseUserProfile()
      this.isShowUpdateGender = false
    },
    onCancel () {
      this.isShowUpdateGender = false
    },
    async getUserInfo () {
      try {
        const {
          data: { data }
        } = await getUserInfo()
        this.userInfo = data
      } catch (error) {
        console.log(error)
      }
    },
    enSure (value) {
      // console.log(value3)
      this.value3 = dayjs(value).format('YYYY-MM-DD')
      this.reviseUserProfile()
      this.isShowUpdateBirthdy = false
    },
    // 获取用户个人资料
    async getUserProfile () {
      try {
        const { data } = await getUserProfile()
        // console.log(data)

        this.value1 = data.data.name
        this.revise = data.data

        if (this.revise.gender === 1) {
          this.value2 = '女'
        } else {
          this.value2 = '男'
        }
        // console.log('===', data.data.birthday)
        this.value3 = data.data.birthday
        // console.log(this.value3)
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑用户个人资料
    async reviseUserProfile () {
      try {
        const res = await reviseUserProfile(this.value1, this.nan, this.value3)
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 30px;
    height: 30px;
  }
}
.van-popup {
  background: #f5f7f9;
}
</style>
