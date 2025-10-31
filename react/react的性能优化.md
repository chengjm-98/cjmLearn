# react 的性能优化（开发者能做哪些操作）

## 编写组件时的优化

### 1.使用 useMemo 和 useCallback

- useMemo
- useCallback

### 2.设置唯一的 key 值

- 设置唯一的 key 以后可以防止 react diff 算法的时候不必要的更新，从而提高性能。
- 对于列表组件，设置唯一的 key 值是非常重要的。

### 3.不使用匿名函数

### 4.使用 React.memo 包裹组件

## 状态管理阶段的优化

### 4.减少全局变量的的数据使用，只把必要的数据放入全局

### 5.避免 contect 频繁更新

## 渲染性能

### 6.异步操作使用并发特性

- React 18+ 的 useTransition

### 7.延迟加载非首屏内容

- React.lazy 和 Suspense

### 8.重计算放入 webworker

### 9.webpack 优化

- TREESHAKING
- 压缩缓存
