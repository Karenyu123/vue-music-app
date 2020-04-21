module.exports = {
  lintOnSave: false,
  devServer: {
    open: true,
    hot: true
  },
  configureWebpack: {
    resolve: {
      alias: {
        'common': '@/common',
        'components': '@/components'
      }
    }
  }
}
