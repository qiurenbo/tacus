const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dev"),
    filename: "psittacus.js",
    library: "Psittacus",
    libraryTarget: "umd",
    libraryExport: "Psittacus",
  },
  watch: true,
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, "dev"),
    compress: true,
    port: 8080,
    watchContentBase: true,
  },
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
    ],
  },
  mode: "development",
};
