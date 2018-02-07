const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./config.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');

const buildPath = path.resolve(__dirname, '..', 'public/');
const config = require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') }).parsed;

module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'index.html'),
      path: buildPath,
      CORE_API_URL: config.CORE_API_URL,
      excludeChunks: ['base'],
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
      },
    }),
    new CleanWebpackPlugin('public', {
      root: path.resolve(__dirname, '..'),
    }),
    new UglifyJSPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false,
      },
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.[chunkhash].js',
      minChunks(module) {
        return module.context &&
          module.context.indexOf('node_modules') >= 0;
      },
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
  output: {
    filename: '[name].[chunkhash].js',
    publicPath: '/',
    path: buildPath,
  },
});
