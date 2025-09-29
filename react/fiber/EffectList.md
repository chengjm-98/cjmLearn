## 什么是 effectList

effectList 是 React 中用于**记录副作用的链表**。
effect list 是一条**链表**（通过 nextEffect 指针串起来），用于在 commit 阶段 按正确顺序执行需要副作用（DOM 插入/删除/更新、生命周期回调、ref、useLayoutEffect/useEffect 等）的 Fiber 节点。
它由 render（构建 WIP 树）阶段 收集并附着到完成的 finishedWork（workInProgress 完成后的树）上，commit 阶段直接沿着这条链表遍历执行副作用，而不用再遍历整棵树。
💋**简而言之是一份清单，用于 commit 的清单，记录了哪些需要更新**

## 那么什么是副作用？

在 React Fiber 里，副作用（effect）指的是 render 计算“完虚拟 UI”之外，还需要做的事情，例如：

- DOM 插入 / 删除 / 属性更新
- ref 的赋值 / 清理
- 生命周期（componentDidMount/Update、getSnapshotBeforeUpdate 等）
- Hook 的 effect（useLayoutEffect/useEffect）

**「除了数据更新外」**可以这么理解：
数据更新本身（newState）发生在 render 阶段，属于计算 fiber 树。
副作用是为了让这次计算结果反映到真实环境（DOM / refs / 用户回调等）中去。

## 为什么需要 effectList

渲染（render）阶段是可中断的，commit 阶段是不可中断的。为了高效把“需要做副作用的节点”按正确顺序记录下来，React 在渲染期间构建这条链表，commit 时直接遍历即可，避免重新 DFS 整棵树，提高效率并保证顺序正确性。

## effectList 的结构和顺序

- 生成方式
  在 render 阶段，Fiber 树构建完成之后，React 会把带有副作用的 Fiber 节点（比如 Placement、Update、Deletion 等）串成一条 effectList 单向链表，链表的顺序来自 深度优先遍历（DFS） Fiber 树的顺序：
  遍历时先走 子节点 → 再走 兄弟节点 → 最后回到 父节点。
  因此 effectList 的顺序就是 先子后父。
- commit 阶段的执行顺序
  在 commit 阶段，副作用的执行遵循 effectList 的顺序：DOM 插入 / 更新 / 删除（mutation 阶段）也是先子后父。Layout Effect 和 Passive Effect 的触发，也沿用这个顺序。

举个例子：

```jsx
function Child({ value }) {
  useLayoutEffect(() => {
    console.log("Child Layout");
  });
  return <div>{value}</div>;
}

function Parent({ count }) {
  useLayoutEffect(() => {
    console.log("Parent Layout");
  });
  return <Child value={count} />;
}
```

- 结果：更新 count 时的输出顺序：
  Child Layout
  Parent Layout

- 子组件是否早于父组件？
  分两种情况：
  要分情况讨论：

  - 渲染顺序：
    Reconciliation 阶段时，父 Fiber 会先被处理（因为它包含 props 改变），但 React 会进入它的子树递归构建新 Fiber → 所以子组件的 render 确实在父组件 commit 副作用之前完成。

  - 副作用执行顺序：
    提交阶段时，effectList 保证 子组件的副作用先执行，再执行父组件。
  - 所以可以总结：
    - render 阶段：父先开始 → 子 → 回到父。
    - commit 阶段：effectList 决定副作用 子先父后。

## effect List 和 updateQueue 的关系

- updateQueue 是什么
- updateQueue 是更新对象的队列，每个 update 对象记录一次 state/props/context/forceUpdate 的更新请求。它的作用是 在 render 阶段计算 fiber 的新 state/props。
- 所以 updateQueue 服务于 render 阶段的 “计算工作”。
  举个 🌰：

```jsx
this.setState({ count: this.state.count + 1 });
```

会生成一个 update → append 到 fiber 的 updateQueue。
在 render 阶段，React 会从 updateQueue 里取出所有 update，计算出最终的 nextState，然后生成新的 fiber 节点。

- effect list 是什么
- effect list 是副作用链表，在 render 阶段（completeWork）拼接出来。它记录的是 哪些 fiber 在 commit 阶段要做副作用。
- commit 阶段 React 直接遍历 effect list，而不用遍历整棵 fiber 树。
  举个 🌰：

```jsx
this.setState({count: this.state.count + 1});
<div>{this.state.count}</div>~
```

这样如果有副作用产生，比如这个 🌰 中，有 dom 的变化，就会产生 updateQueue。
