# suspense

## 允许在子组件完成加载前展示后备方案

```jsx
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

**允许在 someComponent 组件加载完成前展示 loading 组件**

## 本质

- 让渲染阶段支持“暂停”与“继续”的能力
- 遇到一个 Promise → 挂起当前渲染 → 显示 fallback → 等 Promise resolve → 再自动恢复渲染

## suspense 的限制

- 1.捕获 promise

- 2.只能捕获 render 阶段的 promise 的错误

## 一个疑问

**既然 suspense 只能捕获到 render 阶段的 promise，捕获不到 useEffect 中的，那么他的意义在哪里，比如一个页面的初始化，他的接口获取数据时写在 useEffect 中，那么 supense 也捕获不到，达不到骨架屏的作用**
答：

- Suspense 的核心意义不是替代 useEffect，而是 用于“渲染时就知道数据未准备好，可以暂停组件渲染”。

### 使用场景

常见场景：

- 服务端渲染（SSR） + Concurrent Mode

- 数据可以在 render 阶段就读取（通过 resource.read()，Suspense 让页面在数据准备好之前显示 fallback → 骨架屏

- 组件内部异步依赖（如 code-splitting 或图片加载）

- React.lazy + Suspense → 组件未加载完成 → fallback，图片或动态模块可以在 render 阶段 throw Promise → fallback

- React Query / SWR 的 Suspense 模式

- 它们内部封装 resource，保证 render 阶段调用 read() 就会 throw Promise，页面加载时直接挂起 → Suspense fallback
- **所以 Suspense 的 核心价值在于“render 阶段可挂起的异步组件”，而不是在任何异步操作都能自动挂起。**
