<template>
  <div class="edit">
    <hm-header>
      <template>编辑资料</template>
    </hm-header>
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + info.head_img" alt />
      <van-uploader :after-read="afterRead" />
    </div>
    <hm-navbar @click="showNicknameFn">
      <template #title>昵称</template>
      <template #tip>{{ info.nickname }}</template>
    </hm-navbar>
    <hm-navbar @click="showPasswordFn">
      <template #title>密码</template>
      <template #tip>******</template>
    </hm-navbar>
    <hm-navbar @click="showGenderFn">
      <template #title>性别</template>
      <template #tip>{{ info.gender === 0 ? '女' : '男' }}</template>
    </hm-navbar>
    <van-dialog
      v-model="showNickname"
      title="修改昵称"
      show-cancel-button
      @confirm="editNicknameFn"
    >
      <van-cell-group>
        <van-field v-model="nickname" placeholder="请输入昵称" />
      </van-cell-group>
    </van-dialog>
    <van-dialog
      v-model="showPassword"
      title="修改密码"
      show-cancel-button
      @confirm="editPasswordFn"
    >
      <van-cell-group>
        <van-field v-model="password" placeholder="请输入密码" />
      </van-cell-group>
    </van-dialog>
    <van-dialog
      v-model="showGender"
      title="修改性别"
      show-cancel-button
      @confirm="editGenderFn"
    >
      <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <template #right-icon>
              <van-radio :name="1" />
            </template>
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <template #right-icon>
              <van-radio :name="0" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
    <div class="mask" v-show="isShow">
      <van-button type="info" @click="cropper">截图</van-button>
      <van-button type="info" @click="cancel">取消</van-button>
      <vue-cropper
        ref="cropper"
        :img="imgurl"
        :autoCrop="true"
        :fixedNumber="[1, 1]"
        autoCropWidth="150"
        autoCropHeight="150"
      ></vue-cropper>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  data() {
    return {
      info: {},
      showNickname: false,
      nickname: '',
      showPassword: false,
      password: '',
      showGender: false,
      gender: '',
      imgurl: '',
      isShow: false
    }
  },
  async created() {
    this.getInfo()
  },
  methods: {
    // 获取用户信息
    async getInfo() {
      const id = localStorage.getItem('user_id')
      const res = await this.$axios.get(`/user/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.info = data
      }
    },
    // 编辑用户信息
    async editUserFn(data) {
      const id = localStorage.getItem('user_id')
      const res = await this.$axios.post(`/user_update/${id}`, data)
      const { statusCode } = res.data
      if (statusCode === 200) {
        this.getInfo()
      }
    },
    showNicknameFn() {
      this.showNickname = true
      this.nickname = this.info.nickname
    },
    editNicknameFn() {
      this.editUserFn({ nickname: this.nickname })
    },
    showPasswordFn() {
      this.showPassword = true
      this.password = this.info.password
    },
    editPasswordFn() {
      this.editUserFn({ password: this.password })
    },
    showGenderFn() {
      this.gender = this.info.gender
      this.showGender = true
    },
    editGenderFn() {
      this.editUserFn({
        gender: this.gender
      })
    },
    afterRead(file) {
      // console.log(file)
      // // 限制图片大小
      // if (file.file.size / 1024 > 20) {
      //   this.$toast.fail('图片大小不能超过20kb')
      //   return
      // }
      // // 限制图片格式
      // const isJpg = file.file.type === 'image/jpeg'
      // const isPng = file.file.type === 'image/png'
      // const isGif = file.file.type === 'image/gif'
      // if (!isJpg && !isGif && !isPng) {
      //   this.$toast.fail('头像格式只能为jpg、png或gif')
      //   return
      // }
      // // 将文件通过FormData转成二进制传输
      // const form = new FormData()
      // form.append('file', file.file)
      // // 将文件上传到服务器，等待服务器返回一个路径
      // const res = await this.$axios.post('/upload', form)
      // const { statusCode, data } = res.data
      // if (statusCode === 200) {
      //   this.editUserFn({ head_img: data.url })
      // }
      // 上传后显示出裁剪页面
      this.isShow = true
      this.imgurl = file.content
    },
    cropper() {
      // 获取裁剪后的图片数据
      this.$refs.cropper.getCropBlob(async dat => {
        const form = new FormData()
        form.append('file', dat)
        // 将文件上传到服务器，等待服务器返回一个路径
        const res = await this.$axios.post('/upload', form)
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          this.editUserFn({ head_img: data.url })
        }
      })
      this.isShow = false
    },
    cancel() {
      this.isShow = false
    }
  },
  components: {
    'vue-cropper': VueCropper
  }
}
</script>

<style lang="less" scoped>
.avatar {
  position: relative;
  height: 200px;
  .van-uploader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    opacity: 0;
  }
  img {
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
}
.mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  .van-button {
    position: absolute;
    top: 0;
    z-index: 999;
  }
  .van-button:nth-child(1) {
    left: 0;
  }
  .van-button:nth-child(2) {
    right: 0;
  }
}
</style>
