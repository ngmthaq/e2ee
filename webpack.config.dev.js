const path = require("path");

module.exports = {
  entry: "./src/common/index.ts",
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  output: {
    filename: "index.bundle.js",
    path: path.resolve(__dirname, "build"),
  },
};
