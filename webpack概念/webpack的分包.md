# 分包

- 假如现在有这个结构

```jsx
HomePage/index.tsx
├── Banner/      // 小组A
├── ProductList/ // 小组B
├── FlashSale/   // 小组C
shared/          // 公共库
node_modules/    // 第三方库
```

# 具体分包

vendor.aaa.js // node_modules
home-banner.bbb.js // Banner 模块
home-productlist.ccc.js // ProductList 模块
home-flashsale.ddd.js // FlashSale 模块
commons.eee.js // 首页公共组件或工具
homepage.main.js // 首页入口文件，组合各模块

## 具体策略

| 场景                      | 结果                         |
| ------------------------- | ---------------------------- |
| chunk < minSize           | 不拆，直接合并到父 chunk     |
| minSize ≤ chunk ≤ maxSize | 单独 chunk，按需加载         |
| chunk > maxSize           | Webpack 尝试拆成多个子 chunk |

- 假如roductlist大于200000，会尝试拆成多个子chunk
- 就会变成
  HomePage (入口)
  ├─ Banner.chunk.js (~50KB)
  ├─ ProductList.chunk.part1.js (~120KB)
  ├─ ProductList.chunk.part2.js (~130KB)
  ├─ FlashSale.chunk.js (~80KB)
  ├─ vendor.js (第三方库)
  └─ commons.js (shared 工具)

### 分包的大小范围

- 小模块、组件 → 动态 import → chunk 50~150KB
- 大模块、页面级功能 → 150~250KB
- 公共库 → 200~400KB

```jsx
// pages/HomePage/index.tsx
import React, { Suspense } from "react";
//这是动态import，会被单独拆成一个chunk
const Banner = React.lazy(() => import("./Banner"));
const ProductList = React.lazy(() => import("./ProductList"));
const FlashSale = React.lazy(() => import("./FlashSale"));

export const HomePage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Banner />
    <ProductList />
    <FlashSale />
  </Suspense>
);
```

```jsx
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all", // 同步 + 异步 都参与
      minSize: 20 * 1024, // 20kb 才有拆分价值
      maxSize: 200 * 1024, // 控制 chunk 上限，避免过大
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,

      cacheGroups: {
        // ===== 1️⃣ 第三方库（静态 & 动态都适用）=====
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 20,
          reuseExistingChunk: true,
        },

        // ===== 2️⃣ 公共业务代码（静态 import 产生）=====
        common: {
          name: "common",
          minChunks: 2, // 被至少 2 个 chunk 使用
          priority: 10,
          reuseExistingChunk: true,
        },

        // ===== 3️⃣ async chunk 专用规则 =====
        asyncChunks: {
          chunks: "async", // 只作用于 import()
          minSize: 30 * 1024,
          name(module, chunks, cacheGroupKey) {
            return `async-${chunks.map((c) => c.name).join("~")}`;
          },
          priority: 5,
        },
        // ===== 4️⃣ 自定义 chunk 规则 ===== 相当于把这个组件强制拆包，即使是静态 import
        bannerChunk: {
          test: /Banner/,
          name: "banner",
          chunks: "all", // 注意：all 可以让静态 chunk 也拆
          enforce: true, // 强制拆包
        },
      },
    },
  },
};
```

# 具体分包的原因

- 动态的import一定会拆成单独的chunk，一定会单独分包，不管有没有webpack的配置。
  - 动态 import 一定进入 async chunk 体系，而不是一定“一模块一 chunk”
  - 但它绝不会回到主 bundle —— 这一点是铁律。
  - A 和 B 可能被 合并进同一个 async chunk
    - 比如：相同的 webpackChunkName
    - splitChunks 对 async chunk 的合并规则
- 静态的import配合wbpack的 chunks: "all"，会尝试拆成单独的chunk，但是不一定会单独分包
  - splitChunks: 'all' 只是对已有 chunk 做公共拆分，是否生成新 chunk 取决于命中规则。

## 假如是静态组件的写法

```jsx
// pages/HomePage/index.tsx
import React from "react";
import { Banner } from "./Banner";
import { ProductList } from "./ProductList";
import { FlashSale } from "./FlashSale";
export const HomePage = () => (
  <>
    <Banner />
    <ProductList />
    <FlashSale />
  </>
);
```

| 组件              | 分包吗？                             | 原因                                                 |
| ----------------- | ------------------------------------ | ---------------------------------------------------- |
| Banner            | ❌                                   | 静态 import，只有 initial chunk，HomePage 是唯一引用 |
| ProductList       | ❌                                   | 同上                                                 |
| FlashSale         | ❌                                   | 同上                                                 |
| node_modules 依赖 | ✅                                   | 命中 vendors cacheGroup                              |
| 重复业务模块      | ✅（如果被其他入口或页面引用 ≥2 次） | 命中 common cacheGroup                               |

- 原因

```jsx
静态 import → initial chunk

splitChunks: { chunks: "all" } 会处理：

initial chunk（静态 import）

async chunk（动态 import）

cacheGroups 决定是否抽 chunk：
```

- 但是如果你强制写了分包逻辑，会强制拆包，即使是静态 import
- 比如：
  ```jsx
      bannerChunk: {
          test: /Banner/,
          name: "banner",
          chunks: "all", // 注意：all 可以让静态 chunk 也拆
          enforce: true, // 强制拆包
        },
  ```
