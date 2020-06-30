module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // 37.5表示当前默认的html的font-size为37.5px 从而计算出rem。而随着屏幕的变化，根元素的大小也随之变化
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
