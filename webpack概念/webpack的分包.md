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
module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: "all", // 所有类型的 chunk 都拆
      minSize: 20000, // 超过 20KB 才拆
      maxSize: 200000, // 尽量控制单个 chunk 大小。200kb
      cacheGroups: {
        // 第三方库单独拆
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
          priority: 20,
        },
        // 页面公共模块拆分
        commons: {
          test: /[\\/]pages[\\/].*\.tsx?$/,
          name(module, chunks, cacheGroupKey) {
            const moduleFileName = module
              .identifier()
              .split("/")
              .pop()
              .replace(/\.\w+$/, "");
            return `commons.${moduleFileName}`;
          },
          minChunks: 2, // 至少被两个 chunk 引用
          priority: 10,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```
