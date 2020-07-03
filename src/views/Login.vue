<template>
  <div>
    <hm-header>
      <template>登录</template>
    </hm-header>
    <hm-logo></hm-logo>
    <van-form @submit="onSubmit">
      <van-field v-model="user.username" label="用户名" placeholder="用户名" :rules="rules.username" />
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
      还没有账号？去
      <router-link to="/register">注册</router-link>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      //   校验规则
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
        ]
      }
    }
  },
  methods: {
    async onSubmit() {
      //   发送请求
      const res = await this.$axios.post('/login', this.user)
      //   console.log(res)
      if (res.data.statusCode === 200) {
        this.$toast.success('登陆成功')
        // console.log(res)
        localStorage.setItem('token', res.data.data.token)
        localStorage.setItem('user_id', res.data.data.user.id)
        this.$router.push('/user')
      } else {
        this.$toast.fail('密码或用户名错误，请重新登陆')
      }
    }
  },
  created() {
    if (this.$route.params) {
      //   console.log(this.$route.params)
      this.user.username = this.$route.params.username
      this.user.password = this.$route.params.password
    }
  }
}
</script>

<style lang="less" scoped>
// less在前面加/deep/修改默认样式 css中选择器前使用>>>
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
