```jsx
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "production", // 设置为生产模式
  entry: "./src/index.js", // 入口文件

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js", // 使用 contenthash 进行缓存优化
    publicPath: "/", // 配置公共路径
  },

  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components/"),
      "@assets": path.resolve(__dirname, "src/assets/"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"], // 配置扩展名
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader", // 配置 Babel
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 提取 CSS
          "css-loader",
          "postcss-loader", // 配置 PostCSS（可选）
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        use: [
          "file-loader", // 处理图片
          "image-webpack-loader", // 优化图片
        ],
      },
    ],
  },

  optimization: {
    runtimeChunk: "single", // 将 Webpack 的运行时提取到单独的文件
    splitChunks: {
      chunks: "all", // 对所有模块进行代码分离
      minSize: 20000, // 最小文件大小为 20KB
      maxSize: 70000, // 最大文件大小为 70KB
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors", // 将 `node_modules` 目录下的库提取到单独的文件
          chunks: "all", // 提取同步和异步模块
        },
        default: {
          minChunks: 2, // 如果一个模块被两个以上的入口共享，则提取出来
          priority: -10, // 该配置项的优先级
        },
      },
    },
    minimize: true, // 启用压缩
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 去掉 console.log
          },
        },
      }),
      new CssMinimizerPlugin(), // 压缩 CSS
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css", // 提取 CSS 为独立文件，并加上 contenthash
    }),
    new webpack.HotModuleReplacementPlugin(), // 启用 HMR 插件
  ],

  devtool: "source-map", // 为生产环境生成 source map

  // 开发服务器配置
  devServer: {
    contentBase: path.join(__dirname, "dist"), // 指定静态文件根目录
    compress: true, // 启用gzip压缩
    port: 9000, // 设置端口号
    hot: true, // 启用热更新
    open: true, // 自动打开浏览器
    historyApiFallback: true, // 解决单页应用（SPA）路由问题
    proxy: {
      "/api": {
        target: "http://localhost:5000", // 后端 API 服务器地址
        changeOrigin: true, // 支持虚拟托管的 API 代理
        secure: false, // 如果是 https 接口，可以设置为 true
        pathRewrite: {
          "^/api": "", // 让请求中的 `/api` 替换为空
        },
      },
    },
  },
};
```
