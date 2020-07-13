<template>
  <div class="mystar">
    <hm-header>我的收藏</hm-header>
    <div class="starlist">
      <hm-post v-for="post in posts" :key="post.id" :post="post">
        <template>{{post.comments.length}}</template>
      </hm-post>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      posts: []
    }
  },
  methods: {
    async getMyStar() {
      const res = await this.$axios.get('/user_star')
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // console.log(data)
        this.posts = data
      }
    }
  },
  created() {
    this.getMyStar()
  }
}
</script>

<style lang="less" scoped>
</style>
