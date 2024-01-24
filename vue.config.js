const { defineConfig } = require('@vue/cli-service');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

const DEV = process.env.NODE_ENV !== 'production';

module.exports = defineConfig({
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
      // 开启GZIP压缩
      ...(DEV
        ? []
        : [
          new CompressionPlugin({
            filename: '[path][base].js.gz', // JS文件的输出名称
            algorithm: 'gzip',
            test: /\.(js)(\?.*)?$/i,
            threshold: 512,
            minRatio: 0.8,
            deleteOriginalAssets: false,
          }),
          new CompressionPlugin({
            filename: '[path][base].css.gz', // CSS文件的输出名称
            algorithm: 'gzip',
            test: /\.(css)(\?.*)?$/i,
            threshold: 512,
            minRatio: 0.8,
            deleteOriginalAssets: false,
          }),
        ]),
    ],
  },
  assetsDir: 'static',
  parallel: false,
  publicPath: './',
  lintOnSave: false,
});
