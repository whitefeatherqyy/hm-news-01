<template>
  <div class="detail">
    <div class="detail_header">
      <div class="left">
        <span class="iconfont iconjiantou2" @click="$router.back()"></span>
      </div>
      <div class="center">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="right">
        <van-button round class="followed" v-if="post.has_follow" @click="unfollowed">已关注</van-button>
        <van-button round class="unfollow" v-else @click="follow">关注</van-button>
      </div>
    </div>
    <section v-if="post.type === 1" class="post">
      <div class="title">{{post.title}}</div>
      <div class="info">
        {{post.user.nickname}}
        <span>{{post.create_date | timer}}</span>
      </div>
      <div class="content" v-html="post.content"></div>
    </section>
    <!-- <section v-else class="video">
      <video :src="post.content" controls></video>
      <div class="info">
        <div class="avatar">
          <img :src="$axios.defaults.baseURL + post.user.head_img" alt />
        </div>
        <span>{{post.nickname}}</span>
        <van-button>关注</van-button>
      </div>
      <div class="title">{{post.title}}</div>
    </section>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      post: {
        user: {}
      }
    }
  },
  async created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      const id = this.$route.params.id
      // console.log(id)
      const res = await this.$axios.get(`/post/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        console.log(data)
        this.post = data
      }
    },
    async follow() {
      const token = localStorage.getItem('token')
      //   先判断token是否存在，如果存在就直接发送请求添加关注
      if (token) {
        const res = await this.$axios.get(`/user_follows/${this.post.user.id}`)
        const { statusCode, message } = res.data
        if (statusCode === 200) {
          this.$toast.success(message)
          this.getDetail()
        }
        return
      }
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '登录后才能关注，确认登录么？'
        })
        this.$router.push({
          path: '/login',
          query: {
            back: true
          }
        })
      } catch {}
    },
    async unfollowed() {
      const res = await this.$axios.get(`/user_unfollow/${this.post.user.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getDetail()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.detail_header {
  display: flex;
  height: 60px;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .left {
    margin: 10px;
    span {
      font-size: 20px;
    }
  }
  .center {
    flex: 1;
    span {
      font-size: 60px;
    }
  }
  .right {
    margin: 10px;
    .van-button {
      border: 1px solid #ccc;
      background-color: transparent;
      font-size: 14px;
      padding: 8px 20px;
    }
    .unfollow {
      background-color: red;
      color: white;
      border: none;
    }
  }
}
.post {
  padding: 10px;
  .title {
    font-size: 20px;
    font-weight: bold;
    margin: 10px 0 6px;
  }
  .info {
    font-size: 16px;
    color: #aaa;
    margin-bottom: 10px;
    span {
      padding-left: 10px;
    }
  }
  /deep/ img {
    width: 100%;
  }
}
// .video {
//   video {
//     width: 100%;
//     margin: 10px 0;
//   }
//   .info {
//     .avatar {
//       img {
//         width: 40px;
//         height: 40px;
//         border-radius: 50%;
//       }
//     }
//   }
// }
</style>
