# iframe

## 原理

利用浏览器原生 <iframe> 标签，把不同的前端应用嵌入到主应用中。每个 iframe 是独立的浏览上下文（window、document、CSS 样式、JS 全局变量互相隔离）。
主应用和子应用通过 postMessage 或 URL 传参进行通信。

## 优点

- 完全隔离：JS 全局变量、CSS 样式完全隔离，避免冲突。
- 技术栈独立：子应用可以用任意框架（React、Vue、Angular）。
- 安全性高：沙箱环境，避免子应用影响主应用。

## 缺点

- 性能问题：每个 iframe 都是独立浏览上下文，内存消耗大，页面切换慢。
- 通信复杂：跨 iframe 通信需要 postMessage，事件链复杂。
- 无法共享状态：全局状态共享困难。
- 不利于 SEO：iframe 内内容对搜索引擎不可见

## iframe 怎么实现隔离

- JS 隔离：每个 iframe 有独立的 window 对象，全局变量互不影响。
- CSS 隔离：iframe 内部样式只作用于自己的 document，不影响外部。
- DOM 隔离：iframe 内的 DOM 和主应用完全独立。

## iframe 怎么实现通信

- postMessage：浏览器提供安全跨域通信方式，子应用通过 window.parent.postMessage 发送消息，主应用通过 window.addEventListener('message', fn) 接收消息。
- URL 参数 / hash 传参：子应用通过 query 或 hash 向父应用传递状态。
- SharedWorker 或 LocalStorage（非主流）：跨 iframe 共享状态，但限制多。
