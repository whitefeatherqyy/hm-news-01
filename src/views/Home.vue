<template>
  <div class="home">
    <div class="search">
      <div class="icon">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="searchbox" @click="$router.push('/search')">
        <span class="iconfont iconsearch"></span>
        <span>搜索新闻</span>
      </div>
      <div class="user" @click="$router.push('/user')">
        <span class="iconfont iconwode"></span>
      </div>
    </div>
    <div class="manage" ref="manage" @click="$router.push('/manage')">
      <span>∨</span>
    </div>
    <van-tabs v-model="active" animated sticky>
      <van-tab v-for="item in tablist" :title="item.name" :key="item.id">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
            :offset="5"
          >
            <hm-post
              v-for="post in posts"
              :key="post.id"
              :post="post"
              @click="$router.push(`/detail/${post.id}`)"
            >
              <template>{{post.comment_length}}</template>
            </hm-post>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      active: 0,
      tablist: [],
      //   categoryId: ''
      posts: [],
      pageIndex: 1,
      pageSize: 7,
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scrollhandler)
  },
  methods: {
    async getTabList() {
      const res = await this.$axios.get('/category')
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.tablist = data
      }
    },
    async getPost(id) {
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 切换tab栏时，先清空数据/解决频繁切换tab栏报错的问题
        if (this.pageIndex === 1) {
          this.posts = []
        }
        // console.log(data)
        this.posts = [...this.posts, ...data]
        // console.log(this.posts)
        if (data.length < this.pageSize) {
          this.finished = true
        }
        this.loading = false
        this.refreshing = false
      }
    },
    onLoad() {
      this.pageIndex++
      this.getPost(this.tablist[this.active].id)
    },
    async onRefresh() {
      this.pageIndex = 1
      this.posts = []
      this.finished = false
      this.loading = true
      await this.getPost(this.tablist[this.active].id)
      this.refreshing = false
    },
    scrollhandler() {
      const scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      if (scrollTop > 80) {
        this.$refs.manage.style.position = 'fixed'
        this.$refs.manage.style.top = 0
      } else {
        this.$refs.manage.style.position = 'absolute'
        this.$refs.manage.style.top = '80px'
      }
    }
  },
  async created() {
    const activated = JSON.parse(localStorage.getItem('activated'))
    if (activated) {
      this.tablist = activated
    } else {
      await this.getTabList()
    }

    const id = this.tablist[this.active].id
    // console.log(id)
    this.getPost(id)
  },
  watch: {
    active(value) {
      this.finished = false
      this.posts = []
      this.pageIndex = 1
      this.loading = true
      //   发送请求获取相关数据
      const id = this.tablist[value].id
      // console.log(id)
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
.manage {
  position: absolute;
  position: fixed;
  top: 80px;
  right: 0;
  width: 20px;
  height: 44px;
  line-height: 44px;
  font-size: 20px;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 9999;
}
/deep/ .van-tab__text--ellipsis {
  font-size: 16px;
}
</style>
