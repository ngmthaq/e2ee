const path = require("path");

module.exports = {
  entry: "./src/common/index.ts",
  mode: "production",
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
    path: path.resolve(__dirname, "build"),
  },
};
