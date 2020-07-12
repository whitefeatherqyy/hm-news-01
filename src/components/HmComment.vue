<template>
  <div>
    <hm-comment v-if="comment.parent" :comment="comment.parent" :num="num-1"></hm-comment>
    <div class="comment">
      <div class="title">
        <div class="name">{{num}}楼：{{comment.user.nickname}}</div>
        <div class="time">{{comment.create_date | timer3}}</div>
        <div class="post_comment" @click="reply(comment.user.nickname,comment.id)">回复</div>
      </div>
      <div class="content">{{comment.content}}</div>
    </div>
  </div>
</template>

<script>
export default {
  // 给组件一个名字以此自己调用自己
  name: 'hm-comment',
  props: {
    comment: {
      type: Object,
      required: true
    },
    num: {
      type: Number,
      required: true
    }
  },
  methods: {
    reply(name, id) {
      this.$bus.$emit('replyto', name, id)
    }
  }
}
</script>

<style lang="less" scoped>
.comment {
  border: 1px solid #cccccc;
  margin-bottom: -1px;
  padding: 20px;
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .name {
      font-size: 20px;
    }
    .time {
      flex: 1;
      font-size: 16px;
      color: #aaa;
      margin-left: 10px;
    }
    .post_comment {
      font-size: 16px;
      color: #aaa;
    }
  }
}
</style>
