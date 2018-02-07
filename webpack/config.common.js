const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, '..', 'app/index.js'),
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new StyleLintPlugin({
      configFile: path.resolve(__dirname, '..', '.stylelintrc'),
      context: path.resolve(__dirname, '..', 'scss'),
      syntax: 'scss',
      files: '**/*.scss',
    }),
  ],
  module: {
    rules: [{
      test: /\.(scss|css)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        // resolve-url-loader may be chained before sass-loader if necessary
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }, {
          loader: 'stylefmt-loader',
          options: {
            config: '.stylelintrc',
          },
        }],
      }),
    }, {
      test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
      use: [
        'file-loader',
      ],
    }, {
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      options: {
        fix: true,
        emitError: true,
        emitWarning: true,
      },
    }, {
      test: /\.js$/,
      use: [
        'babel-loader',
      ],
      exclude: /node_modules/,
    }],
  },
  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
};
