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

## 实现原理
