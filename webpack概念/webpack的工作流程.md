<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-12-18 21:08:53
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-12-24 15:47:27
 * @FilePath: /cjmLearn/webpack1/webpack的工作流程.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# 工作流程

链接：https://juejin.cn/post/7154192670326259719

## webpack 的一个配置文件

```js
var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');

module.exports = {
  // 入口文件，是模块构建的起点，同时每一个入口文件对应最后生成的一个 chunk。
  entry: './path/to/my/entry/file.js'，
  // 文件路径指向(可加快打包过程)。
  resolve: {
    alias: {
      'react': pathToReact
    }
  },
  // 生成文件，是模块构建的终点，包括输出文件与输出路径。
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  // 这里配置了处理各模块的 loader ，包括 css 预处理 loader ，es6 编译 loader，图片处理 loader。
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ],
    noParse: [pathToReact]
  },
  // webpack 各插件对象，在 webpack 的事件流中执行对应的方法。
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
```

## 初始化

- 从配置文件（webpack.config.js）和 Shell 语句中读取与合并参数，得出最终的配置结果。比如入口文件，loader 和 plugins 等。

## 构建依赖图

- 从 entry 指定的入口文件开始，webpack 会递归解析所有的依赖项。每个模块都会被解析成一个 javascript 文件，依赖项包括直接导入的文件（css，图片和 javascript 等），webpack 将这些依赖构建成一个依赖图。
  ### 什么是依赖图
  - 构建过程中生成的 **「模块关系网」**
  - 本质上是一个 **「有向无环图」**
  ### 依赖图在 webpack 中的作用
  - 打包
  - 有助于 tree shaking
  - 有助于代码分割
  - 有助于热更新
    - 可以精准的知道哪个模块变了，哪个模块依赖了它，从而只更新受到影响的模块。

## 使用 loader

- webpack 本身只处理 javascript 模块，如果要处理其他类型的文件，就需要使用 loader。
  **什么是 loader，一些常见的 loader** 具体看 loader 和 plugins.md

##
