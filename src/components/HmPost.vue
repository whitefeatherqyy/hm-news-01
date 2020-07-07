<template>
  <div class="post">
    <!--<div class="video" v-if="post.type === 2">
      <div class="title">{{post.title}}</div>
      <div class="content">
        使用video.js插件
      </div>
      <div class="info">
        {{post.user.nickname}}
        <span>{{post.comment_length}}跟帖</span>
      </div>
    </div>-->
    <div v-if="post.cover.length < 3" class="singleImg">
      <div class="content">
        <div class="title">{{ post.title }}</div>
        <div class="info">
          {{ post.user.nickname }}
          <span> <slot></slot>跟帖 </span>
        </div>
      </div>
      <div class="cover">
        <img :src="$url(post.cover[0].url)" alt />
      </div>
    </div>
    <div class="multipleImg" v-else>
      <div class="title">{{ post.title }}</div>
      <div class="cover">
        <img :src="$url(post.cover[0].url)" alt />
        <img :src="$url(post.cover[1].url)" alt />
        <img :src="$url(post.cover[2].url)" alt />
      </div>
      <div class="info">
        {{ post.user.nickname }}
        <span> <slot></slot>跟帖 </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    post: Object
  }
}
</script>

<style lang="less" scoped>
.singleImg {
  display: flex;
  //   align-items: center;
  padding: 20px;
  border-bottom: 1px solid #cccccc;
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title {
      font-size: 18px;
    }
    .info {
      font-size: 14px;
      color: #aaa;
      margin-top: 10px;
      span {
        padding-left: 20px;
      }
    }
  }
  .cover {
    img {
      width: 120px;
      height: 75px;
      object-fit: cover;
    }
  }
}
.multipleImg {
  //   align-items: center;
  padding: 20px;
  border-bottom: 1px solid #cccccc;

  .title {
    font-size: 18px;
  }
  .info {
    font-size: 14px;
    color: #aaa;
    margin-top: 10px;
    span {
      padding-left: 20px;
    }
  }
  .cover {
    margin-top: 10px;
    display: flex;
    img {
      //   flex: 1;
      width: 112px;
      height: 74px;
      object-fit: cover;
      //   padding-right: 10px;
    }
  }
}
// .video {
//   padding: 20px;
//   border-bottom: 1px solid #cccccc;
//   .title {
//     font-size: 18px;
//   }
//   .content {
//   }
// }
</style>
