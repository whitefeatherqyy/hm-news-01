<template>
  <div class="hm-header-wrapper">
    <div class="hm-header">
      <!-- 注册点击回退事件 -->
      <div class="arrow" @click="$router.go(-1)">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="hd">
        <slot></slot>
      </div>
      <div class="space">
        <span></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>
// 设置语言 scoped表示默认给当前组件内样式添加一个随机属性
<style lang="less" scoped>
.hm-header-wrapper {
  // 给固定定位加一个父盒子
  height: 40px;
  .hm-header {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color: #f5f5f5;
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
}
</style>
