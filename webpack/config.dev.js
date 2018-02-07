const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./config.common.js');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.development') }).parsed;

module.exports = merge(common, {
  devtool: 'eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'index.html'),
      path: path.resolve(__dirname, '..', 'public/'),
      inject: true,
      CORE_API_URL: config.CORE_API_URL,
    }),
    new CleanWebpackPlugin(['public'], {
      root: path.resolve(__dirname, '..'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    filename: '[name].[hash].js',
    publicPath: '/',
    path: path.resolve(__dirname, '..', 'public/'),
  },
  devServer: {
    compress: true,
    port: 9000,
    host: config.DEV_SERVER_URL,
    contentBase: path.join(__dirname, '..', 'public/'),
    historyApiFallback: {
      disableDotRule: true,
    },
    hot: true,
    proxy: {
      '/api': 'http://10.129.168.55:3000',
    },
  },
});
