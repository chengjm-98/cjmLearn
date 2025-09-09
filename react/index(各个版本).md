# react
## react截至2025/7 最新的版本是19
## react各个版本的启动方式
## React 各版本启动方式对比

### 📋 概览对比表

| React 版本 | 启动方式                  | `ReactDOM.render` | `ReactDOM.createRoot` | 特点说明 |
|-------------|----------------------------|-------------------|------------------------|----------|
| **React 16** | `ReactDOM.render()`        | ✅ 支持            | ❌ 不支持               | 传统渲染方式 |
| **React 17** | `ReactDOM.render()`        | ✅ 支持            | ❌ 不支持               | 和 16 类似，升级兼容性好 |
| **React 18** | `ReactDOM.createRoot()`    | ❌ 废弃            | ✅ 推荐                 | 引入并发特性 |
| **React 19** | `ReactDOM.createRoot()`    | ❌ 已移除          | ✅ 强制使用             | 强化并发渲染、支持新特性 |

---

### 🧪 各版本启动代码示例

#### 🔸 React 16 / 17

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

#### 🔸 React 18 / 19

```js
import React from'react';
import ReactDOM from'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 🧪 核心差异
#### 🔸 `ReactDOM.render` vs `ReactDOM.createRoot`

- **1️⃣并发渲染** 
  - **render()**：同步渲染，遇到大量组价或者动画会容易卡顿，不能中断
  - **createRoot()**：支持并发渲染：可以在渲染过程中中断、恢复、调度优先级，带来更流畅的用户体验。
- **2️⃣ 自动批处理更新**  
  - **react17及其之前** 只有事件处理函数中的 setState 会批处理。
  - **react18以后** 几乎所有的 setState 都会批处理。
```js
// 17 之前的 setState 不会批处理
setTimeout(() => {
  setA(1);
  setB(2); // 会触发两次 render（不是批处理）
});
```
```js
// 18 之后的 setState 会批处理
setTimeout(() => {
  setA(1);
  setB(2); // 会触发一次 render（批处理）
});
```
- **3️⃣ 支持新 API（React 18/19）**  todo之后详细介绍

   - startTransition：可中断更新

   - useId：解决 SSR 和客户端一致性问题

   - useDeferredValue：延迟值更新

   - useSyncExternalStore：用于状态库适配

   - Suspense 的改进

   - React 19 的 useFormStatus、useOptimistic、Actions