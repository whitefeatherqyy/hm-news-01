<template>
  <div class="search">
    <div class="header">
      <span class="iconfont iconjiantou2"></span>
      <input
        type="search"
        placeholder="通灵兽消失之谜"
        @input="recommend"
        v-model="key"
      />
      <span class="iconfont iconsearch"></span>
      <span>搜索</span>
    </div>
    <div class="history">
      <h5>历史记录</h5>
      <div class="list">
        <div class="record" v-for="item in records" :key="item.id">
          {{ item }}
        </div>
      </div>
    </div>
    <div class="hot_search"></div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      records: [],
      key: ''
    }
  },
  methods: {
    //   防抖函数
    recommend: _.debounce(async function() {
      const res = await this.$axios.get(
        `/post_search_recommend?keyword=${this.key}`
      )
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        console.log(data)
      }
    }, 1000),
    async fn() {
      const res = await this.$axios.get(
        `/post_search_recommend?keyword=${this.key}`
      )
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        console.log(data)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  padding: 10px 10px;
  .header {
    display: flex;
    align-items: center;
    span {
      font-size: 16px;
      margin-right: 10px;
    }
    input {
      flex: 1;
      margin-right: 10px;
      border-radius: 24px;
      padding: 10px 25px;
      background-color: #f5f5f5;
      border: 1px solid #ccc;
    }
    .iconsearch {
      position: absolute;
      top: 20px;
      left: 40px;
    }
  }
  .history {
    font-size: 24px;
    margin-top: 20px;
  }
}
</style>
