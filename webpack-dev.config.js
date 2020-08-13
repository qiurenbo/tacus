const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  entry: "./dev/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "dev.js",
  },
  watch: true,
  devtool: "inline-source-map",
  devServer: {
    compress: true,
    port: 8000,
    watchContentBase: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./dev/index.html",
      filename: "index.html",
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            //https://github.com/babel/babel/issues/8829
            //https://github.com/parcel-bundler/parcel/issues/871
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  regenerator: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  mode: "development",
};
