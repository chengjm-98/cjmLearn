# SSR 和 CSR 是什么？

- 是两种不同的渲染方式。
- CSR（Client Side Rendering）客户端渲染：
- 浏览器先下载一个空的 HTML + JS，由 JS 在浏览器里渲染 UI。

- SSR（Server Side Rendering）服务端渲染：
- 页面 HTML 在服务器上就已经生成，浏览器拿到的是完整页面，然后再让 React 接管。

**简而言之：渲染发生在浏览器就是 CSR，发生在服务端就是 SSR。**

举个例子 🌰：

### CSR

```JSX
页面一开始什么都没有，JS 下载完 → 执行 → React 渲染 → 页面才出现内容。
<body>
  <div id="root"></div>
  <script src="/react-app.js"></script>
</body>
```

### SSR

```JSX
浏览器 第一时间 就能看到内容，之后 React 再对这块 HTML 进行 “hydrate（注水）” 来绑定事件
<body>
  <div id="root">
    <h1>Hello React SSR</h1>
  </div>
  <script src="/react-app.js"></script>
</body>
```

### Hydration--什么是注水？

```JSX
SSR 输出的 HTML 虽然已经有内容，但它没有事件绑定。

浏览器加载 React JS 后做一件事：

给服务端生成的 HTML “注入事件逻辑”，让它变成真正的 React 应用。

这一步叫 hydrate，是 SSR 的核心机制。
```

### 各自的优点和缺点

- **CSR**

  - 优点：
    - 前后端分离，开发效率高。
    - 用户交互流畅
    - 服务器负担轻
  - 缺点：
    - 初始加载慢。
    - seo 差
    - 对弱网设备不友好

- **SSR**
  - 优点：
    - SEO 好
    - 首屏渲染快
    - 对弱网设备友好
  - 缺点：
    - 服务端压力大
    - 架构复杂
    - 需要考虑数据预取和 hydration

## 那么 react 是 ssr 还是 csr 呢？

- 首先这种说法就是不正确的。React 是一个 UI 渲染库，它并不关心你在“哪里渲染”（浏览器还是服务器）。
- React 本身只提供渲染能力，不属于 SSR 或 CSR，React 能做 SSR，也能做 CSR

**你使用的框架决定它最终运行方式**

| 技术栈                                 | 渲染方式             |
| -------------------------------------- | -------------------- |
| Create React App / Vite + React        | CSR                  |
| Next.js                                | SSR + SSG + CSR 混合 |
| Remix                                  | SSR 优先             |
| Express + react-dom/server             | SSR                  |
| React + RSC（React Server Components） | 全新 SSR 模式        |

# 什么是 seo

## SEO 是什么？

**SEO = Search Engine Optimization（搜索引擎优化）**

- 意思：让你的网站更容易被 Google / 百度 等搜索引擎收录，并且排名更靠前。
- 简单说：
  - SEO = 让别人能在搜索里找到你的网页。

## csr 和 ssr 对于 seo 的影响

- csr 写的页面，搜索引擎是无法抓取的。因为 csr 的网页内容是依赖 js 来渲染的，爬虫一般不会执行 js，所以他看到的是一个空页面。所以抓取不到信息，seo 很差。
- ssr 写的页面，搜索引擎是可以抓取的。因为 html 已经包含了内容，爬虫可以直接抓取。
