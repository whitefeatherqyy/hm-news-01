<template>
  <div>
    <hm-header>
      <template>注册</template>
    </hm-header>
    <hm-logo></hm-logo>
    <van-form @submit="onSubmit">
      <van-field v-model="user.username" label="用户名" placeholder="用户名" :rules="rules.username" />
      <van-field
        v-model="user.nickname"
        type="text"
        label="昵称"
        placeholder="昵称"
        :rules="rules.nickname"
      />
      <van-field
        v-model="user.password"
        type="password"
        label="密码"
        placeholder="密码"
        :rules="rules.password"
      />
      <div style="margin: 20px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
    <p>
      已有账号？去
      <router-link to="/login">登录</router-link>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
        nickname: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'onChage' },
          {
            pattern: /^\d{5,11}$/,
            message: '请输入5到11位数字',
            trigger: 'onChange'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'onChange' },
          {
            pattern: /^\w{3,9}$/,
            message: '密码只有3到9位',
            trigger: 'onChange'
          }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'onChange' },
          {
            pattern: /^[\u4e00-\u9fa5]{3,5}$/,
            message: '请输入3到5个字',
            trigger: 'onChange'
          }
        ]
      }
    }
  },
  methods: {
    //   提交发送请求
    async onSubmit() {
      const res = await this.$axios.post('/register', this.user)
      // console.log(res)
      if (res.data.statusCode === 200) {
        //   注册成功后跳转到登录页面并把参数传过去
        this.$toast.success('登陆成功')
        this.$router.push({
          name: 'login',
          params: {
            username: this.user.username,
            password: this.user.password
          }
        })
      } else if (res.data.message === '用户名已存在') {
        this.$toast.fail('用户名已存在，请重新输入')
      } else {
        this.$toast.fail('注册失败，请重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .van-button {
  background-color: red;
  border-color: transparent;
}
p {
  text-align: right;
  padding-right: 15px;
}
/deep/ .van-form {
  margin: 10px;
}
</style>
