<template>
  <div class="follow">
    <hm-header>我的关注</hm-header>
    <div class="list">
      <!--   -->
      <div class="follows" v-for="item in list" :key="item.id">
        <div class="avatar">
          <img :src="$axios.defaults.baseURL + item.head_img" alt />
        </div>
        <div class="name">
          <p>{{ item.nickname }}</p>
          <p>{{ item.create_date | timer }}</p>
        </div>
        <div class="unfollowed" @click="cancel(item.id)">
          <van-button type="warning" round>取消关注</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  methods: {
    async getFollows() {
      const res = await this.$axios.get('/user_follows')
      // console.log(res)
      const { data, statusCode } = res.data
      if (statusCode === 200) {
        this.list = data
      }
    },
    async cancel(id) {
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '确认取消关注么？'
        })
        const res = await this.$axios.get(`/user_unfollow/${id}`)
        this.$toast.success(res.data.message)
        this.getFollows()
      } catch {
        this.$toast.fail('取消操作')
      }
    }
  },
  created() {
    this.getFollows()
  }
}
</script>

<style lang="less" scoped>
.follows {
  display: flex;
  height: 100px;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .avatar {
    width: 80px;
    padding-left: 20px;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
  .name {
    flex: 1;
    font-size: 18px;
    padding-left: 20px;
  }
  .unfollowed {
    width: 100px;
    font-size: 10px;
    margin-right: 10px;
  }
}
</style>
