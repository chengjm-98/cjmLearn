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

## 初始化（启动阶段）

- 从配置文件（webpack.config.js）和 Shell 语句中读取与合并参数，得出最终的配置结果。比如入口文件，loader 和 plugins 等。创建一个**compiler**实例，作为整个打包过程的核心。

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

## 构建阶段

### 生成模块

如果模块是一个 javascript 文件，webpack 会将其解析成一个 javascript 模块。如果不是，那就会使用对应的 loader 来处理。

- webpack 本身只处理 javascript 模块，如果要处理其他类型的文件，就需要使用 loader。  
  **什么是 loader，一些常见的 loader** 具体看 loader 和 plugins.md

### 生成 chunk

在构建阶段，Webpack 会将所有模块按照配置的方式进行分割，生成一个或多个 chunk。每个 chunk 包含一组相互依赖的模块，并最终会输出到文件中。

**什么是 chunk**  
 chunk 是 webpack 在构建过程中产生的打包单元，是 webpack 打包的最小单位。会将模块组织成一个或者多个 chunk，然后最后合成成 output 文件「bundle」。

**chunk 分类**关于 chunk 我们额外加个文件具体介绍吧。

- 入口 chunk：由 entry 指定的入口文件生成的 chunk。
- 异步 chunk：在代码中动态导入的模块生成的 chunk。
- 代码分割 chunk：使用 splitChunksPlugin 等插件生成的 chunk。
- common chunk：多个 chunk 之间共享的模块生成的 chunk。

## 优化阶段

### 使用插件来进行优化（插件不一定全部在这个阶段，任何阶段都有可能）

- 使用插件来进行优化，比如使用 TerserPlugin 来压缩代码，使用 SplitChunksPlugin 来分割代码，使用 DedupePlugin 来去除重复的模块，使用 tree-shaking 来去除未使用的模块等。

## 输出阶段（输出 output）

在输出阶段，Webpack 会将生成的 chunk 输出到文件中。这个过程包括将 chunk 中的模块合并成一个文件，然后将这个文件输出到指定的目录中。通常是 dist 或者 build 目录。  
hash：webpack 会给每个输出文件一个唯一的 hash 值，这个 hash 值是根据文件内容计算出来的。如果文件内容没有变化，那么 hash 值也不会变化。确保文件缓存和版本控制。
