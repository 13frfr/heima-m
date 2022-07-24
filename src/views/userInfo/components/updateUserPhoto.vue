<template>
  <div>
    <div style="width: 375px; height: 375px; transform: translateY(146px)">
      <img :src="photo" alt="" ref="img" />
    </div>
    <div class="toolbar">
      <span class="cancel" @click="$emit('close')">取消</span>
      <span class="confirm" @click="confirm">完成</span>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { uploadPhoto } from '@/api/user'
export default {
  props: ['photo'],
  data () {
    return {
      photoimg: ''
    }
  },
  mounted () {
    const img = this.$refs.img

    this.myCropper = new Cropper(img, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  methods: {
    confirm () {
      try {
        const fm = new FormData()
        this.myCropper.getCroppedCanvas().toBlob(async (blob) => {
          fm.append('photo', blob)

          const {
            data: { data }
          } = await uploadPhoto(fm)
          // console.log(data)
          this.photoimg = data.photo
          this.$emit('update', this.photoimg)
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.toolbar {
  position: fixed;
  bottom: 5px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: black;
  padding: 0 7.5px;
  box-sizing: border-box;
  .cancel {
    position: fixed;
    bottom: 8px;
    left: 10px;
  }
  .confirm {
    position: fixed;
    bottom: 8px;
    right: 10px;
  }
}
</style>
