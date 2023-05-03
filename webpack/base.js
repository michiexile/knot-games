const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          //loader: "babel-loader"
          loader: "esbuild-loader"
        },
        type: "javascript/auto"
      },
      {
        test: [/\.vert$/, /\.frag$/],
        type: "asset/source"
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        type: "asset/resource"
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
        type: "javascript/auto"
      },
      {
        test: /\.scss$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {loader: 'postcss-loader',
           options: {
            postcssOptions: {
              plugins: function() {
                return [require('autoprefixer')];
              }
            }
           }},
          {loader: 'sass-loader'}
        ],
        type: "javascript/auto"
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ],
        type: "javascript/auto"
      },
      {
        test: /\.md$/,
        type: "asset/source"
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "../")
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ]
};
