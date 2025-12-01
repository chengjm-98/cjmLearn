# useId

useId 是 React 18 新增的 Hook，用来生成 **稳定的、唯一的、不冲突的** ID
主要用于：

- SSR 和 CSR 的一致性问题
  - 为什么不用 uuid(),Math.random()等？
    - 因为这些方法生成的 ID 在 SSR 和 CSR 中是不同的，会导致不一致的问题。会在 SSR 的时候导致 hydration mismatch。但是 useId 生成的 ID 在 SSR 和 CSR 中是相同的，不会导致不一致的问题。

### React 是如何保证 SSR/CSR 一致的？

React 内部有一个 "ID 生成器"，在 SSR 时会：

- 记录渲染顺序
- 生成序列化 ID（它不是随机数）
- 前端 hydration 时 React 会根据相同顺序 重新生成同样的 ID，因此不会 mismatch。
