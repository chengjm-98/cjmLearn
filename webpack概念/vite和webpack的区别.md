# vite 和 webpack 的区别

- webpack 的流程是先打包，再启动服务器。
- vite 的流程是先启动服务器，按需编译。

**重点**
Webpack 是“以打包为中心”的构建工具，开发和生产都依赖 bundle；  
Vite 利用浏览器原生 ESM，在开发阶段跳过打包，按需编译，因此启动和热更新极快，生产环境再交给 Rollup 打包。

## 底层工作原理对比

### webpack

- webpack 的底层工作原理是基于 node.js 的，使用的是 commonjs 模块规范。
- 核心思想：打包一切

```js
开发阶段流程

从入口文件开始（entry）

构建 依赖图

所有模块 → loader 处理 → AST → 转换

打成 bundle

启动 dev server

浏览器加载的是 打包后的 bundle

即使你只改了一个文件，Webpack 仍然是基于 bundle 体系在工作
```

- 启动慢，项目越大越明显

### vite（ESM+Rollup）

核心思想：按需编译，利用浏览器的 ES Module 特性。

```js
开发阶段流程
从入口文件开始（entry）
开发阶段流程
启动一个 dev server（几乎秒起）
浏览器请求哪个模块
服务端 按需编译并返回
未请求的模块 不会处理
```

- 不打包
- 每个文件就是一个模块
- 浏览器请求哪个模块，服务端就编译哪个模块

## 如何选择

- 选 Webpack 的情况

  - 老项目：Webpack 作为构建工具已经成熟，并且广泛应用在许多老项目中。迁移到 Vite 可能需要一些重构，尤其是对已有构建流程的高度依赖。
  - 非 ESM 代码多：Webpack 对于 CommonJS、AMD 等传统模块格式的支持较好，如果项目中仍有很多这样的代码，Webpack 会处理得更好。
  - 复杂构建逻辑：Webpack 提供了非常灵活的配置选项，支持各种自定义的插件、loader。复杂的构建需求，比如处理特殊文件、多个构建输出等，Webpack 可以非常灵活地应对。
  - 微前端（Module Federation）：Webpack 5 引入了 Module Federation，可以很好地解决多个项目之间的共享和隔离，非常适合微前端架构。
  - 追求定制化开发：Webpack 支持通过插件和 loader 对构建流程的高度定制，可以非常精准地控制整个构建流程。

- 选 Vite 的情况
  - 新项目：Vite 更适合现代化的前端开发，尤其是与 Vue、React 等新技术栈搭配得更好。它的启动速度极快，能够提高开发体验。
  - Vue / React 技术栈：Vite 内置对 Vue 和 React 的良好支持，尤其是 Vue 3 的 script setup 语法和 React 18 特性，开发体验非常顺滑。
  - 追求开发体验：Vite 的启动速度极快，热更新（HMR）也非常迅速，这为开发带来了极大的便利。它通过按需编译，避免了全量打包，从而极大提高了开发效率。
