# startTransition 用于非紧急更新

```jsx
- startTransition 是 React 18 新增的 API，用于标记 非紧急更新（transitions），让 React 将某些更新的优先级降低，从而保持 UI 的响应性。

  - 紧急更新（urgent update）：用户输入、点击、滚动等需要立即响应的操作。

  - 非紧急更新（transition）：渲染大列表、搜索过滤、分页切换等可以稍后渲染的操作。
```

- **底层其实和 react 的 lands（优先级模型相关）**
- 可以将一些非紧急更新的任务，放到一个单独的优先级中，这样可以保证紧急任务的及时响应。

## 常用场景

## 面试问题

### Q1：startTransition 与普通 setState 有什么区别？

普通 setState 默认优先级高，可能阻塞用户输入。startTransition 内的 setState 优先级低，React 可以中断，保证流畅性。

### Q2：什么时候应该使用 startTransition？

- 大数据量渲染
- 非紧急 UI 更新
- 保持用户输入流畅

### Q3：startTransition 可以和 Suspense 配合吗？

可以，用于骨架屏或渐进式渲染，提高用户体验。

#### 具体配合使用方法

### Q4：startTransition 会影响 useEffect 吗？

不会，它只是标记更新的优先级。useEffect 的执行顺序不受影响。
