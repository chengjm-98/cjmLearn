# suspense

## 允许在子组件完成加载前展示后备方案

```jsx
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

**允许在 someComponent 组件加载完成前展示 loading 组件**
## 实现原理
