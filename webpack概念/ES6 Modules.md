# ES6 Modules

## 模块化机制

CommonJs (典型代表：node.js 早期)
AMD (典型代表：require.js)
CMD (典型代表：sea.js)

## 模块化的意义

在没有模块化之前，我们的代码都是写在一个文件中，这样会导致以下问题：可读性，可维护性，复用性差，全局污染，命名冲突等。

- 解决全局污染的问题
- 提高代码的可读性
- 提高代码的可维护性
- 提高代码的复用性
- 清晰的依赖管理
- 配合 webpack 等工具，可以实现代码的按需加载，提高页面的加载速度。

## ES6 模块化机制（ESM）

## 什么是 ESM

- ESM（ECMAScript Module）是 JavaScript 的模块系统标准，它通过原生的语法支持 JavaScript 文件的模块化（即按功能分割代码）。ESM 与过去的模块化方式（如 CommonJS 和 AMD）相比，提供了更简洁、性能更优的实现，并在现代浏览器中得到原生支持。

## ESM 的核心概念

### 1. 模块化（Modularization）

ESM 将 JavaScript 代码拆分成多个文件，并通过明确的导入 (import) 和导出 (export) 机制，让不同文件之间可以共享代码。这样做的好处包括：

- 代码复用：模块化能将代码拆解成小块，便于重用和管理。

- 避免命名冲突：每个模块都有自己的作用域，避免了全局作用域污染。

- 按需加载：ESM 支持 懒加载，即只有需要的模块才会加载，提高性能。

### 2. 导入与导出

- 导出（export）：通过 export 关键字将某些功能或数据暴露给外部文件使用。（区分 export defult ｜ export const ）

- 导入（import）：通过 import 关键字引入其他文件中导出的内容。
  - 命名导入
    ```jsx
    import { name, greet } from "./file1.js";
    console.log(name); // 'Alice'
    greet(); // 'Hello'
    ```
  ````
  - 默认导入
  ```jsx
   // file4.js
   import greet from './file2.js';
   greet(); // 'Hello, world!'
  ````
  - 重命名导入
  ```jsx
  // file5.js
  import { name as newName } from "./file1.js";
  console.log(newName); // 'Alice'
  ```
  - 导入整个模块
  ```jsx
  // file6.js
  import * as module from "./file1.js";
  console.log(module.name); // 'Alice'
  module.greet(); // 'Hello'
  ```

### 为什么需要 ESM（特点）

- 标准化和兼容性
  - 规范统一
  - 原生浏览器支持，无需额外的工具和库。可以直接通过 <script type="module"> 引入模块，不需要任何构建工具或打包器。
- 性能优化
  - 按需加载
    - ESM 允许按需加载模块，在开发和生产环境中都能有效减小初始加载时间。浏览器会根据需要请求并加载模块，而不是一次性加载所有依赖。
  - 异步加载
    - ESM 默认是异步加载的，这意味着浏览器在加载模块时不会阻塞页面的其他操作。
  - 缓存机制
    - 浏览器会缓存已加载的模块，从而减少重复请求，提高加载速度。
- 提升可维护性
  - 模块化
    - 代码拆分成小块，便于维护。每个模块只包含特定的功能，且不容易与其他模块冲突。
  - 作用域隔离
    - 模块中的变量和函数是局部的，只能通过显式的 import 和 export 与外部共享，避免全局污染。
