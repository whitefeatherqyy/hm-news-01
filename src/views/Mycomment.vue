<template>
  <div class="comment">
    <hm-header>我的跟帖</hm-header>
    <div class="list">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        :offset="5"
        loading-text="加载中"
      >
        <div class="item" v-for="item in list" :key="item.id">
          <div class="time">{{ item.create_date | timer2 }}</div>
          <div class="parent" v-if="item.parent">
            <p>回复：{{ item.parent.user.nickname }}</p>
            <p>{{ item.parent.content }}</p>
          </div>
          <p class="content">{{ item.content }}</p>
          <div class="title">
            <div class="txt-one-cut article">原文：{{ item.post.title }}</div>
            <span class="iconfont iconjiantou1"></span>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      finished: false,
      loading: false,
      pageIndex: 1,
      pageSize: 6
    }
  },
  methods: {
    async getcomment() {
      const res = await this.$axios.get('/user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      console.log(res)
      const { data, statusCode } = res.data
      if (statusCode === 200) {
        this.list = [...this.list, ...data]
        if (data.length < this.pageSize) {
          this.finished = true
        }
      }
    },
    async onLoad() {
      this.pageIndex++
      await this.getcomment()
      this.loading = false
    }
  },
  created() {
    this.getcomment()
  }
}
</script>

<style lang="less" scoped>
.list {
  margin-top: 20px;
  .item {
    padding: 20px;
    border-bottom: 1px solid #ccc;
    .time {
      color: #bbbbbb;
      margin-bottom: 10px;
    }
    .parent {
      background-color: #d9d9d9;
      padding: 10px;
      color: #aaa;
    }
    .content {
      margin: 10px 0;
    }
    .title {
      display: flex;
      color: #bbb;
      align-items: center;
      .article {
        margin-right: 20px;
      }
    }
  }
}
</style>
