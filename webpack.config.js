const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
//NOTE: Импортируем  палагин для минификации
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    clean: true,
  },
  devtool: "source-map",
  plugins: [
    new CopyPlugin({
      patterns: [{from: "public"}],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  // NOTE: Свойство для отмены минификации классов, отмена ужимания классов заканчивающиеся на View
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: /View$/
        }
      })
    ]
  }
};
