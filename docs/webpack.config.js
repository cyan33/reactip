const path = require('path')
const webpack = require('webpack')
const pkg = require('../package.json')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const joinPath = path.join.bind(null, __dirname)
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: {
    app: [joinPath('app.js')],
  },
  output: {
    publicPath: isProduction ? `/${pkg.name}` : '/',
    path: joinPath('dist'),
    filename: isProduction ? 'app.[hash].js' : 'app.js',
  },
  devtool: !isProduction && 'cheap-eval-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  resolve: {
    alias: {
      'reactip': joinPath('../lib/index.js'),
    },
  },
  plugins: ([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ]).concat(isProduction ? [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {warnings: false},
      output: {comments: false},
    }),
    new HtmlWebpackPlugin({
      template: joinPath('index-tpl.html'),
      minify: false,
    }),
  ] : [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ]),
  devServer: {
    hot: true,
    inline: true,
    stats: {
      colors: true,
      chunks: false,
      chunkModules: false,
    },
  },
}
