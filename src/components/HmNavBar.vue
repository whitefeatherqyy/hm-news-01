<template>
  <div class="navbar" @click="$emit('click')">
    <div class="title">
      <slot name="title"></slot>
    </div>
    <div class="tip">
      <slot name="tip"></slot>
    </div>
    <div class="arrow">
      <span class="iconfont iconjiantou1"></span>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.navbar {
  display: flex;
  height: 40px;
  line-height: 40px;
  margin-left: 16px;
  font-size: 14px;
  border-bottom: 2px solid #eee;
  .title {
    flex: 1;
    text-align: left;
  }
  .tip {
    color: #ccc;
    text-align: right;
  }
  .arrow {
    text-align: center;
    width: 20px;
  }
}
</style>
