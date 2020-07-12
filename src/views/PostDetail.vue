<template>
  <div class="detail">
    <div class="post_content">
      <section v-if="post.type === 1" class="post">
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
        <div class="title">{{post.title}}</div>
        <div class="info">
          {{post.user.nickname}}
          <span>{{post.create_date | timer}}</span>
        </div>
        <div class="content" v-html="post.content"></div>
      </section>
      <section v-else class="video">
        <div class="detail_header">
          <div class="left">
            <span class="iconfont iconjiantou2" @click="$router.back()"></span>
          </div>
        </div>
        <video :src="post.content" controls></video>
        <div class="info">
          <div class="avatar">
            <img :src="$axios.defaults.baseURL + post.user.head_img" alt />
          </div>
          <span>{{post.user.nickname}}</span>
          <span v-if="!post.has_follow" class="follow" @click="follow">关注</span>
          <span v-else class="followed" @click="unfollowed">已关注</span>
        </div>
        <div class="title">{{post.title}}</div>
      </section>
      <section class="dianzan" @click="like">
        <div class="like" :class="{liked:post.has_like}">
          <span class="iconfont icondianzan"></span>
          {{post.like_length}}
        </div>
        <div class="share">
          <span class="iconfont iconweixin"></span>微信
        </div>
      </section>
    </div>
    <div class="post_nocomment" v-if="post.comment_length === 0">
      <div class="title">精彩跟帖</div>
      <p>暂无跟帖，抢占沙发</p>
    </div>
    <div class="post_comment" v-else>
      <div class="title">精彩跟帖</div>
      <div class="reply" v-for="item in comments" :key="item.id">
        <div class="infos">
          <div class="avatar">
            <img alt :src="$axios.defaults.baseURL + item.user.head_img" />
          </div>
          <div class="info">
            <div class="name">{{item.user.nickname}}</div>
            <div class="time">{{item.create_date | timer3}}</div>
          </div>
          <div class="post_comment" @click="$bus.$emit('replyto',item.user.nickname,item.id)">回复</div>
        </div>
        <hm-comment v-if="item.parent" :comment="item.parent" :num="getFloors(0,item)"></hm-comment>
        <div class="content">{{item.content}}</div>
      </div>
    </div>
    <div class="new_reply" v-if="replying">
      <textarea
        :placeholder="'回复' + replyName + ':'"
        v-model="replyContent"
        ref="textarea"
        @blur="cancel"
        v-focus
      ></textarea>
      <span @click="send">发送</span>
    </div>
    <div class="my_apply" v-else>
      <input type="text" placeholder="写跟帖" @focus="reply" />
      <div class="icons">
        <span class="iconfont iconpinglun-"></span>
        <span class="iconfont iconshoucang" @click="star" :class="{star: post.has_star}"></span>
        <span class="iconfont iconfenxiang"></span>
        <span class="count">{{post.comment_length}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import HmComment from '../components/HmComment.vue'
export default {
  components: {
    'hm-comment': HmComment
  },
  // 自定义指令
  directives: {
    focus: {
      inserted(el) {
        el.focus()
      }
    }
  },
  data() {
    return {
      post: {
        user: {}
      },
      comments: [],
      replyContent: '',
      replying: false,
      replyName: '',
      replyId: '',
      pageIndex: 1,
      pageSize: 5
    }
  },
  async created() {
    this.getDetail()
    this.getComments()
    // 给bus注册事件
    this.$bus.$on('replyto', (name, id) => {
      this.replyName = name
      this.replyId = id
      this.replying = true
    })
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
      const tip = '登录后才能关注，确认登录么？'
      this.afterlogin(`/user_follows/${this.post.user.id}`, tip)
    },
    async unfollowed() {
      const res = await this.$axios.get(`/user_unfollow/${this.post.user.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getDetail()
      }
    },
    async like() {
      const tip = '登录后才能点赞，确认登录么？'
      this.afterlogin(`/post_like/${this.post.id}`, tip)
    },
    async star() {
      const tip = '登录后才能收藏，确认登录么？'
      this.afterlogin(`/post_star/${this.post.id}`, tip)
    },
    async afterlogin(path, tip) {
      const token = localStorage.getItem('token')
      //   先判断token是否存在，如果存在就直接发送请求添加关注
      if (token) {
        const res = await this.$axios.get(path)
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
          message: tip
        })
        // 将当前路径存储
        localStorage.setItem('backURL', this.$route.path)
        this.$router.push({
          path: '/login'
        })
      } catch {}
    },
    // 获取文章列表
    async getComments() {
      const res = await this.$axios.get(
        `/post_comment/${this.$route.params.id}`,
        {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      )
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        console.log(data)
        this.comments = data
      }
    },
    getFloors(num, obj) {
      if (obj.parent) {
        return this.getFloors(num + 1, obj.parent)
      } else {
        return num
      }
    },
    async reply() {
      this.replying = true
      // 数据更新后等待DOM更新再进行DOM操作
      // await this.$nextTick()
      // this.$refs.textarea.focus()
    },
    cancel() {
      if (!this.replyContent) {
        this.replying = false
      }
    },
    async send() {
      const res = await this.$axios.post(`/post_comment/${this.post.id}`, {
        content: this.replyContent,
        parent_id: this.replyId
      })
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.replying = false
        this.replyContent = ''
        this.replyName = ''
        this.replyId = ''
        this.getComments()
        this.getDetail()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.post_content {
  border-bottom: 4px solid #bbb;
  .post {
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
    .title {
      padding: 10px;
      font-size: 20px;
      font-weight: bold;
      margin: 10px 0 6px;
    }
    .info {
      padding: 10px;
      font-size: 16px;
      color: #aaa;
      margin-bottom: 10px;
      span {
        padding-left: 10px;
      }
    }
    .content {
      padding: 10px;
      /deep/ img {
        width: 100%;
      }
    }
  }
  .video {
    video {
      width: 100%;
      margin: 10px 0;
    }
    .info {
      display: flex;
      align-items: center;
      margin: 10px;
      .avatar {
        margin-right: 10px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }
      span:nth-child(2) {
        flex: 1;
        color: #aaa;
        font-size: 18px;
      }
      span:nth-child(3) {
        font-size: 16px;
        border: 1px solid #bbbbbb;
        padding: 10px 20px;
        border-radius: 36px;
      }
      span.followed {
        background-color: red;
        border: none;
        color: #fff;
      }
    }
    .title {
      margin: 10px;
      font-size: 20px;
    }
  }
  .dianzan {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 20px;
    div {
      border: 1px solid #bbb;
      padding: 10px 20px;
      border-radius: 25px;
      span {
        padding-right: 5px;
      }
    }
    .share {
      span {
        color: green;
      }
    }
    .liked {
      color: red;
      border-color: red;
    }
  }
}
.post_nocomment {
  margin-top: 20px;
  margin-bottom: 100px;
  .title {
    font-size: 28px;
    text-align: center;
  }
  p {
    font-size: 20px;
    line-height: 60px;
    color: #aaa;
    text-align: center;
  }
}
.post_comment {
  margin-top: 20px;
  margin-bottom: 60px;
  .title {
    font-size: 28px;
    text-align: center;
  }
  .reply {
    padding: 20px;
    border-bottom: 1px solid #ccc;
    .infos {
      display: flex;
      height: 60px;
      align-items: center;
      text-align: center;
      .avatar {
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
      }
      .info {
        flex: 1;
        text-align: left;
        margin-left: 15px;
        .time {
          font-size: 16px;
          color: #aaa;
        }
      }
      .post_comment {
        font-size: 16px;
        color: #aaa;
      }
    }
    .content {
      margin-top: 10px;
      font-size: 20px;
      // line-height: 30px;
    }
  }
}
.new_reply {
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 160px;
  padding: 10px;
  align-items: flex-end;
  justify-content: space-between;
  background-color: #f5f5f5;
  textarea {
    flex: 1;
    height: 140px;
    // 禁止拖拽
    resize: none;
    padding: 10px;
    background-color: #ccc;
    border: none;
    border-radius: 5px;
  }
  span {
    margin-left: 20px;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 20px;
    background-color: red;
    color: white;
    text-align: center;
  }
}
.my_apply {
  display: flex;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  align-items: center;
  background-color: #f5f5f5;
  input {
    flex: 1;
    width: 200px;
    padding: 10px 20px;
    margin: 0 10px;
    border-radius: 20px;
    background-color: #ddd;
    border: none;
  }
  .icons {
    position: relative;
    display: flex;
    justify-content: space-around;
    text-align: center;
    span {
      width: 40px;
      font-size: 28px;
    }
    .star {
      color: red;
    }
    .count {
      position: absolute;
      left: 12px;
      top: -10px;
      background-color: red;
      color: white;
      font-size: 14px;
      border-radius: 14px;
      padding: 4px 0;
    }
  }
}
</style>
