<template>
  <div class="hm-header">
    <!-- 注册点击回退事件 -->
    <div class="arrow" @click="$router.go(-1)">
      <span class="iconfont iconjiantou2"></span>
    </div>
    <div class="hd">
      <slot></slot>
    </div>
    <div class="space"><span></span></div>
  </div>
</template>

<script>
export default {}
</script>
// 设置语言 scoped表示默认给当前组件内样式添加一个随机属性
<style lang="less" scoped>
.hm-header {
  height: 40px;
  line-height: 40px;
  display: flex;
  .arrow,
  .space {
    width: 40px;
    text-align: center;
  }
  .hd {
    flex: 1;
    text-align: center;
    font-size: 16px;
  }
}
</style>
