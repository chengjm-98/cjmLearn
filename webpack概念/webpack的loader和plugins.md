<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-12-18 21:12:37
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-12-24 17:32:17
 * @FilePath: /cjmLearn/webpack1/webpack的loader和plugins.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# loader

- loader 本质上是一个 node.js 的函数，接受一个东西然后经过处理再返回一个东西。**「内容的转换」**，返回 webpack 可以处理的内容。

## loader 的特性

- 支持链式调用，loader 的执行顺序是你配置顺序的反方向。也就是从后往前执行。
  - **为什么是从后往前执行？**
    - 因为 loader 是一个函数管道，越靠右的 loader 越接近原始资源，先把原始内容转换成中间结果，再逐步加工。
  - **loader 能操作 dom 吗？**
    - 不能，因为 loader 运行在 node.js 环境中，node.js 环境中没有 dom。
- loader 可以是同步的，也可以是异步的。
  ```jsx
  -同步loader;
  module.exports = function (source) {
    return source;
  };
  -异步loader;
  module.exports = function (source) {
    const callback = this.async();
    setTimeout(() => {
      callback(null, source);
    }, 1000);
  };
  ```
- loader 运行在 node.js 环境中.

## 常见的 loader

- html-loader
- markdown-loader
- css-loader
- style-loader
- sass-loader
- less-loader
- babel-loader
- file-loader
- url-loader
- eslint-loader
- ts-loader

### babel-loader

进行语法转换，流程如下：

- 解析：将代码解析成**抽象语法树**（AST）。ES6->AST
- 转换：遍历 AST，对节点进行转换。 AST
- 生成：将转换后的 AST 生成新的代码。AST->ES5

为什么需要转换成 ES5？

- 浏览器兼容，因为一些低版本浏览器不支持 ES6 的语法。解决低版本浏览器中的性能问题，保持统一。

# plugins

## 插件的执行时机

- 每个阶段都有可能
  Webpack 的插件机制基于 tapable 库，它提供了一个钩子（hook）机制，用于在 Webpack 的不同阶段触发插件的执行。插件可以通过在特定的 hook 上进行 tap，来决定其在整个构建过程中的执行时机。
  | 阶段 | 主要任务 | 常见插件 |
  | --------- | -------------------- | ------------------------------------------------------------------- |
  | **初始化阶段** | 读取配置，初始化参数 | `DefinePlugin`，`ProvidePlugin` |
  | **编译阶段** | 解析模块，构建依赖图 | `HotModuleReplacementPlugin`，`ProvidePlugin` |
  | **构建阶段** | 模块转换与处理，加载 loader | `MiniCssExtractPlugin`，`CopyWebpackPlugin` |
  | **优化阶段** | 优化输出文件，代码分割，压缩等 | `TerserWebpackPlugin`，`OptimizeCSSAssetsPlugin`，`SplitChunksPlugin` |
  | **输出阶段** | 输出最终的打包文件，清理旧文件，生成报告 | `HtmlWebpackPlugin`，`CleanWebpackPlugin`，`BundleAnalyzerPlugin` |

# 插件和 loader 的区别

| 特性         | **Loader**               | **Plugin**                          |
| ------------ | ------------------------ | ----------------------------------- |
| **作用**     | 转换文件，处理文件内容   | 扩展 Webpack 功能，操作整个构建过程 |
| **应用范围** | 针对模块级别的转换       | 针对整个构建过程（全局操作）        |
| **执行时机** | 文件加载和处理时         | Webpack 生命周期的各个阶段          |
| **执行顺序** | 从右到左、从下到上       | 依据生命周期钩子（hook）            |
| **常见功能** | 转换 JS、CSS、图片等文件 | 代码压缩、生成文件、提取公共代码等  |
| **影响范围** | 只影响当前模块的处理     | 影响整个构建过程和输出结果          |
