<template>
  <div class="search">
    <div class="header">
      <span class="iconfont iconjiantou2" @click="$router.back()"></span>
      <!-- @input="recommend" -->
      <input
        type="search"
        placeholder="通灵兽消失之谜"
        v-model="key"
        @input="recommend"
        @keyup.enter="send"
      />
      <span class="iconfont iconsearch"></span>
      <span @click="send">搜索</span>
    </div>
    <div class="recommend" v-if="recommendList.length > 0 ">
      <ul>
        <li
          v-for="item in recommendList"
          :key="item.id"
          @click="search(item.title)"
          class="txt-one-cut"
        >{{item.title}}</li>
      </ul>
    </div>
    <div class="searchList" v-else-if="searchList.length > 0">
      <hm-post
        v-for="item in searchList"
        :key="item.id"
        :post="item"
        @click="$router.push(`/detail/${item.id}`)"
      >
        <template>{{item.comment_length}}</template>
      </hm-post>
    </div>
    <div v-else>
      <div class="history">
        <h5>历史记录</h5>
        <div class="list">
          <div
            class="record txt-one-cut"
            v-for="item in records"
            :key="item"
            @click="search(item)"
          >{{ item }}</div>
        </div>
      </div>
      <div class="hot_search">
        <h5>热门搜索</h5>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
// let _this = {}
export default {
  data() {
    return {
      records: [],
      key: '',
      searchList: [],
      recommendList: []
    }
  },
  methods: {
    //   防抖函数 此处不能使用箭头函数，箭头函数中this指向外部的this，外部的this不指向Vue实例
    recommend: _.debounce(async function() {
      if (!this.key) {
        this.recommendList = []
        return
      }
      const res = await this.$axios.get(
        `/post_search_recommend?keyword=${this.key}`
      )
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // console.log(data)
        this.recommendList = data
      }
    }, 1000),
    // recommend: _.debounce(_this.fn, 500),
    // async fn() {
    //   // console.log(this)
    //   // console.log(_this)
    //   const res = await this.$axios.get(
    //     `/post_search_recommend?keyword=${this.key}`
    //   )
    //   const { statusCode, data } = res.data
    //   if (statusCode === 200) {
    //     // console.log(data)
    //   }
    // },
    async send() {
      if (!this.key) return
      const res = await this.$axios.get('/post_search', {
        params: {
          keyword: this.key
        }
      })
      const { statusCode, data } = res.data
      // console.log(res)
      if (statusCode === 200) {
        // console.log(data)
        if (data.length === 0) {
          this.$toast('暂无相关数据')
        }
        this.searchList = data
        this.records = this.records.filter(item => item !== this.key)
        this.records.unshift(this.key)
        localStorage.setItem('history', JSON.stringify(this.records))
        this.key = ''
        this.recommendList = []
      }
    },
    async search(title) {
      this.key = title
      await this.send()
      this.recommendList = []
    }
  },
  created() {
    const history = JSON.parse(localStorage.getItem('history'))
    this.records = history || []
  }
  // beforeCreate() {
  //   _this = this
  // }
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
  .recommend {
    ul {
      li {
        border-bottom: 1px solid #ccc;
        font-size: 18px;
        height: 40px;
        line-height: 40px;
      }
    }
  }
  .history {
    // font-size: 24px;
    margin-top: 20px;
    overflow: hidden;
    .list {
      .record {
        float: left;
        width: 60px;
        height: 40px;
        font-size: 16px;
        line-height: 40px;
        text-align: center;
        margin: 0px 10px;
      }
    }
  }
}
</style>
