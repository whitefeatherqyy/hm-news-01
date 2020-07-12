<template>
  <div>
    <!-- 设置缓存组件，includes属性表示需要缓存的组件的名字 -->
    <!-- 缓存组件：路由跳转时需要缓存的组件不会被销毁，而是调用deactivated钩子函数；跳转回来时也不会调用created，而是调用activated -->
    <keep-alive include="home">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
div {
  font-size: 18px;
}
</style>
