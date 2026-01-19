# 什么是 PerformanceObserver

- 是整个现代前端性能监控体系的“心脏”级 API。
- PerformanceObserver 是浏览器提供的「性能事件订阅系统」，监听器。

```jsx
| entryType                | 用途        |
| ------------------------ | --------- |
| navigation               | 页面导航生命周期  |
| resource                 | 资源加载性能    |
| paint                    | FP / FCP  |
| largest-contentful-paint | LCP       |
| layout-shift             | CLS       |
| longtask                 | 主线程卡顿     |
| event                    | 用户交互（INP） |
| measure                  | 自定义性能打点   |
| mark                     | 自定义打点     |
| first-input              | FID（已废弃）  |

```
