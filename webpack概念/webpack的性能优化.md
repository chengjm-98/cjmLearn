# 一个分析插件

webpack-bundle-analyzer

# 1.使用 tree-shaking

- tree-shaking 是一种代码优化技术，用于从代码中移除未使用的代码。
- tree-shaking 的实现基础是 ESM 模块规范。
- 配置 mode: 'production' 开启 Tree Shaking 和压缩。

# 2.压缩

## TerserPlugin：默认情况下，Webpack 使用 TerserPlugin 来压缩 JavaScript。

```jsx
const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
  mode: "production", // 开启生产模式
  optimization: {
    minimize: true, // 启用压缩
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 删除 console.log
            drop_debugger: true, // 删除 debugger
          },
          output: {
            comments: false, // 删除所有注释
          },
        },
      }),
    ],
  },
};
```

## CSS 压缩：使用 css-minimizer-webpack-plugin 来压缩 CSS 文件。

```jsx
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
optimization: {
  minimize: true,
  minimizer: [new CssMinimizerPlugin()],
}
```

## html 文件压缩： HtmlWebpackPlugin

## 压缩图片

image-webpack-loader

```jsx
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        use: [
          "file-loader",
          "image-webpack-loader", // 添加图片压缩加载器
        ],
      },
    ],
  },
};
```

# 3.缓存

Webpack 提供了内置的缓存机制，通过缓存之前的构建结果，避免每次构建都重新处理文件，提高构建速度。
缓存优化通过哈希值技术，提升代码运行性能与用户体验。以下是其核心概念与实现方法：

哈希值类型：

- hash：每次构建生成唯一哈希值，文件变化时会重新生成。
- chunkhash：基于模块生成哈希值，模块变化时会重新生成。
- contenthash：基于文件内容生成哈希值，内容不变时哈希值不变。

```jsx
optimization: {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
}
```

# 4. 代码分离

Webpack 提供了 代码分离（Code Splitting） 功能，可以帮助将大型应用拆分为多个小的文件（chunks），从而优化页面加载速度，提升性能

## 入口点分离

- 在 Webpack 中，我们可以通过 entry 配置来指定多个入口点。这会使 Webpack 为每个入口文件生成一个单独的 JavaScript 文件。
- 效果
  - Webpack 会为 app.js 和 admin.js 创建两个独立的文件。每个页面只加载所需的文件，而不是一次加载所有代码。

## 动态导入

动态 import（最重要）

- 在有需要的时候再引入
  比如 echert
  先封装一个 echart 组件，然后在需要的地方引入

```jsx

// EChartsView.tsx
import * as echarts from 'echarts';

export default function EChartsView() {
  useEffect(() => {
    const chart = echarts.init(document.getElementById('chart')!);
    chart.setOption({
      xAxis: { type: 'category', data: ['Mon', 'Tue'] },
      yAxis: { type: 'value' },
      series: [{ data: [120, 200], type: 'bar' }]
    });

    return () => chart.dispose();
  }, []);

  return <div id="chart" style={{ height: 300 }} />;
}
const LazyECharts = React.lazy(
  () => import(/* webpackChunkName: "echarts-view" */ './EChartsView')
);

<Suspense fallback={<div>图表加载中...</div>}>
  <LazyECharts />
</Suspense>

```

## 公共代码分离

当多个入口文件（app.js, admin.js 等）共享相同的依赖时，Webpack 会将这些公共代码提取到一个单独的文件中，避免在多个文件中重复加载相同的模块。
使用 optimization.splitChunks 配置来提取公共代码。splitChunks 允许 Webpack 自动分离出重复的模块（如 React、lodash 等）并将其放入单独的文件中。

## 总的代码实现

```jsx
// webpack.config.js
const path = require("path");

module.exports = {
  //入口点分离
  entry: {
    app: "./src/index.js",
    admin: "./src/admin.js",
  },
  output: {
    filename: "[name].[contenthash].js", // 使用 contenthash 便于缓存
    path: path.resolve(__dirname, "dist"),
    clean: true, // 打包前清理 dist
  },
  optimization: {
    splitChunks: {
      chunks: "all", // async 异步 + initial 初始 + all 全部
      minSize: 20000, // 最小分割大小
      maxSize: 0, // 最大分割大小（0 表示不限制）
      minChunks: 1, // 模块最少被引用次数
      cacheGroups: {
        echarts: {
          test: /[\\/]node_modules[\\/]echarts[\\/]/,
          name: "echarts",
          chunks: "all",
          priority: 20,
        },
        // 第三方库单独打包
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
        // 公共模块打包
        commons: {
          name: "commons",
          minChunks: 2, // 至少被两个入口共享
          priority: 10,
          reuseExistingChunk: true,
        },
      },
    },
  },
  mode: "production",
};
```

## runtimeChunk 配置

- 将运行时代码单独打包。
- 尽管应用代码（如你的业务代码）发生了变化，运行时代码可能不会变化。因此，将运行时代码提取到单独的文件中，能够提升浏览器缓存的命中率，从而提高页面加载性能。
  Webpack 默认将 Webpack 自身的运行时（runtime）代码和应用代码一起打包，这可能导致每次修改应用代码后，整个应用的哈希值都会改变。通过 runtimeChunk 配置，可以将 Webpack 的运行时代码提取到单独的文件中，这样可以避免每次修改应用代码时都重新生成运行时代码，从而提高缓存利用率。

```jsx
module.exports = {
  optimization: {
    runtimeChunk: "single", // 提取运行时代码为单独的文件
  },
};
```

- ### 什么是运行时代码，什么是应用代码
  - **运行时代码** Webpack 为了让应用能够正确运行而自动生成的代码，它并不包含应用的业务逻辑，而是处理应用模块加载、依赖管理、代码分割、缓存、热更新等功能的代码。
  - **应用代码** 应用代码是指你在项目中编写的实际业务逻辑代码，包括所有模块、组件、函数、类等

# 别名

虽然 Webpack 的 别名 配置本身并不直接优化代码分割或压缩等过程，但它能够：

- 提升模块解析速度：通过减少 Webpack 在大量目录中的查找路径。
- 减少路径错误和冗余：使路径更加清晰、一致，减少错误发生的概率。
- 帮助构建缓存和模块重用：避免重复打包相同的模块，提高缓存命中率。
- 减少构建时间：通过合理的路径配置，避免重复的解析过程。
