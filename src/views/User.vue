<template>
  <div class="user_info">
    <div class="basicinfo" @click="$router.push('/user_edit')">
      <div class="avatar">
        <img :src="imgurl" alt />
      </div>
      <div class="title">
        <p>
          <span
            :class="{
              iconfont: true,
              iconxingbienv: gender === 0,
              iconxingbienan: gender === 1
            }"
          ></span>
          {{ nickname }}
        </p>
        <p class="time">{{ time }}</p>
      </div>
      <div class="arrow">
        <span class="iconfont iconjiantou1"></span>
      </div>
    </div>
    <div class="my">
      <hm-navbar>
        <template v-slot:title>我的关注</template>
        <template v-slot:tip>关注的用户</template>
      </hm-navbar>
      <hm-navbar>
        <template v-slot:title>我的跟帖</template>
        <template v-slot:tip>跟帖/回复</template>
      </hm-navbar>
      <hm-navbar>
        <template v-slot:title>我的收藏</template>
        <template v-slot:tip>文章/视频</template>
      </hm-navbar>
      <hm-navbar @click="$router.push('/user_edit')">
        <template v-slot:title>设置</template>
      </hm-navbar>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      gender: 0,
      nickname: '',
      time: '',
      imgurl: ''
    }
  },
  //   获取相关信息
  async created() {
    const id = localStorage.getItem('user_id')
    const res = await this.$axios.get(`/user/${id}`)
    console.log(res.data.data)
    const { gender, nickname } = res.data.data
    this.gender = gender
    this.nickname = nickname
    this.time = moment(res.data.data.create_date).format('YYYY-MM-DD')
    this.imgurl = this.$axios.defaults.baseURL + res.data.data.head_img
  }
}
</script>

<style lang="less" scoped>
.basicinfo {
  display: flex;
  height: 100px;
  align-items: center;
  border-bottom: 6px solid #eeeeee;
  .avatar {
    width: 100px;
    text-align: right;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      vertical-align: middle;
    }
  }
  .title {
    flex: 1;
    padding-left: 10px;
    font-size: 14px;
    .iconxingbienan {
      color: skyblue;
    }
    .iconxingbienv {
      color: hotpink;
    }
    .time {
      color: #cccccc;
      font-size: 14px;
      line-height: 25px;
    }
  }
  .arrow {
    width: 60px;
    text-align: center;
  }
}
</style>
