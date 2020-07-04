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
      <template #tip>{{info.nickname}}</template>
    </hm-navbar>
    <hm-navbar @click="showPasswordFn">
      <template #title>密码</template>
      <template #tip>******</template>
    </hm-navbar>
    <hm-navbar @click="showGenderFn">
      <template #title>性别</template>
      <template #tip>{{info.gender === 0 ? '女' : '男'}}</template>
    </hm-navbar>
    <van-dialog v-model="showNickname" title="修改昵称" show-cancel-button @confirm="editNicknameFn">
      <van-cell-group>
        <van-field v-model="nickname" placeholder="请输入昵称" />
      </van-cell-group>
    </van-dialog>
    <van-dialog v-model="showPassword" title="修改密码" show-cancel-button @confirm="editPasswordFn">
      <van-cell-group>
        <van-field v-model="password" placeholder="请输入密码" />
      </van-cell-group>
    </van-dialog>
    <van-dialog v-model="showGender" title="修改性别" show-cancel-button @confirm="editGenderFn">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {},
      showNickname: false,
      nickname: '',
      showPassword: false,
      password: '',
      showGender: false,
      gender: ''
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
    async afterRead(file) {
      // 将文件通过FormData转成二进制传输
      const form = new FormData()
      form.append('file', file.file)
      // 将文件上传到服务器，等待服务器返回一个路径
      const res = await this.$axios.post('/upload', form)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.editUserFn({ head_img: data.url })
      }
    }
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
</style>
