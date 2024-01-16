const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig ({
  devServer: {
    client: {
      overlay: false,
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'windows.jQuery': 'jquery',
      }),
    ],
  },
  assetsDir: 'static',
  parallel: false,
  publicPath: './',
  lintOnSave:false
});
