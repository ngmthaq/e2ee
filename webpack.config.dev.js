const path = require("path");

module.exports = {
  entry: "./src/e2ee.ts",
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
    filename: "hash.min.js",
    path: path.resolve(__dirname, "dist"),
  },
};
