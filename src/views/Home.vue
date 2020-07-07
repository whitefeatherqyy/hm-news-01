<template>
  <div class="home">
    <div class="search">
      <div class="icon">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="searchbox">
        <span class="iconfont iconsearch"></span>
        <span>搜索新闻</span>
      </div>
      <div class="user">
        <span class="iconfont iconwode"></span>
      </div>
    </div>
    <van-tabs v-model="active" animated sticky>
      <van-tab v-for="item in tablist" :title="item.name" :key="item.id">
        <hm-post v-for="post in posts" :key="post.id" :post="post">
          <template>{{post.comment_length}}</template>
        </hm-post>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      tablist: [],
      //   categoryId: ''
      posts: []
    }
  },
  methods: {
    async getTabList() {
      const res = await this.$axios.get('/category')
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.tablist = data
      }
    },
    async getPost(id) {
      const res = await this.$axios.get('/post', {
        params: {
          category: id
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        console.log(data)
        this.posts = data
      }
    }
  },
  async created() {
    await this.getTabList()
    const id = this.tablist[this.active].id
    // console.log(id)
    this.getPost(id)
  },
  watch: {
    active(value) {
      //   发送请求获取相关数据
      const id = this.tablist[value].id
      //   console.log(id)
      this.getPost(id)
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  display: flex;
  align-items: center;
  height: 80px;
  text-align: center;
  background-color: red;
  color: #fff;
  .searchbox {
    flex: 1;
    height: 50px;
    border-radius: 25px;
    background-color: rgba(255, 255, 255, 0.5);
    span {
      line-height: 50px;
      padding: 4px;
      font-size: 20px;
    }
  }
  .icon {
    width: 80px;
    .iconfont {
      font-size: 70px;
    }
  }
  .user {
    width: 80px;
    .iconfont {
      font-size: 36px;
    }
  }
}
/deep/ .van-tab__text--ellipsis {
  font-size: 16px;
}
</style>
