const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "psittacus.js",
    library: "Psittacus",
    libraryTarget: "umd",
    libraryExport: "Psittacus",
  },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }],
  },
  mode: "production",
};
