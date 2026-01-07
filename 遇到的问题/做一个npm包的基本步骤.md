<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-01-07 10:21:05
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-01-07 10:25:31
 * @FilePath: /cjmLearn/遇到的问题/做一个npm包的基本步骤.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# 目标

源码用 ESModule,发布产物是 打包后的 dist,用 Rollup

```jsx
import { add } from "my-rollup-utils";

add(1, 2); // 3
```

# 目录结构

```jsx
my-rollup-utils
├─ src/
│  └─ index.js        # 源码（ESM）
├─ dist/
│  ├─ index.esm.js    # 打包产物（ESM）
│  └─ index.cjs.js    # 打包产物（CJS）
├─ rollup.config.js
├─ package.json
└─ README.md

```

# 步骤

## 初始化项目，安装 rollup

```jsx
npm init -y
npm install rollup --save-dev
```

## 编写源码

```jsx
// src/index.js
export function add(a, b) {
  return a + b;
}
```

## 配置 rollup.config.js

输出两种格式：

- es → 给现代打包器用（Vite / Webpack）
- cjs → 给 Node / 老项目用

```jsx
export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.esm.js",
      format: "es",
    },
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      exports: "named",
    },
  ],
};
```

## 配置 package.json

```jsx
{
  "name": "my-rollup-utils",
  "version": "1.0.0",
  "description": "A simple ESModule + Rollup npm package",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "scripts": {
    "build": "rollup -c"
  },
  "files": [
    "dist"
  ],
  "license": "MIT"
}
```

## 打包

```jsx
npm run build
```

## 发布到 npm

```jsx
npm publish
```
