module.exports = {
  devServer: {
    open: true,
    // 反向代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
        secure: true,
        changeOrigin: true
      }
    }
  },
  // 打包优化
  configureWebpack: {
    externals: {
      // vue: 模块名字
      // 'Vue' 全局变量Vue
      // 告诉webpack  import Vue from 'vue'
      vue: 'Vue',
      'vue-router': 'VueRouter',
      moment: 'moment',
      axios: 'axios',
      lodash: '_'
    }
  }
}
