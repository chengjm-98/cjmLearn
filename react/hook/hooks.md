# react 常见的 hook

## 什么是 hook

- **管理状态&&处理副作用**
- 组件尽量写成纯函数，如果有副作用，就使用 hook 把代码勾进来。
- **Hook 只能在 React 函数组件的顶层或自定义 Hook 的顶层调用，不能在条件语句、循环或嵌套函数中调用。**
  - ❓**为什么呢**？
  - React 内部通过 Fiber 的 memoizedState 链表 存储每个 Hook 的状态，状态是按 Hook 调用顺序挂载的。如果调用顺序在不同渲染中发生变化，就会导致 Hook 获取错误的状态，从而产生不可预测的行为。
  - updateQueue 也是按 Hook 调用顺序挂载的。所以 Hook 能在条件语句、循环或嵌套函数中调用。

## 1.useState

- **异步的**，setState 是异步的，不会立即更新 state，需要在下一次渲染才能拿到最新的值。
- **批处理**，react 会把多次 setState 合并成一次 setState，这样可以减少渲染次数，提高性能。
- **函数式更新**，setState 可以接受一个函数作为参数，这个函数会接收上一次的 state 作为参数，返回一个新的 state。

  ```jsx
  const [count, setCount] = useState(0);
  setCount((prevCount) => prevCount + 1);
  ```

  ```md
  **如何避免依赖陷阱**
  什么是依赖陷阱？

  依赖陷阱是指 useEffect 的依赖项没有包含外部状态，导致 useEffect 的回调函数始终捕获第一次渲染时的旧状态值，这就出现了“闭包陷阱（stale closure）”。

  在多个连续更新或者闭包场景中，使用**函数式更新**可以确保读取的是最新的值，而不是闭包捕获的旧值。
  ```

## 2.useEffect

- 三种情况
  - 无依赖
    - 每次渲染都会执行
    - 任何 state 和 props 的改变都会执行
  - 空依赖
    - 只会在第一次渲染的时候执行
    - 组件卸载的时候也会执行
    - 常用于初始化请求和订阅
  - 有依赖
    - 只会在依赖发生变化的时候执行
    - 组件卸载的时候也会执行

#### 一些注意点

- 依赖写全防止闭包问题
  - 为什么 useEffect 的依赖项要写全？**防止产生依赖陷阱**
  - 为什么会产生依赖陷阱
    ```jsx
    因为函数组件每次渲染都会创建新的闭包环境，
    如果 useEffect 的依赖列表没包含外部状态，
    React 只会执行一次 effect，
    导致回调函数始终捕获第一次渲染时的旧状态值，
    这就出现了“闭包陷阱（stale closure）”。
    ```
- 异步函数不能传给 useEffect

  - react 的要求 useEffect 的回调函数，要么返回一个清理函数要么返回一个 undefined。
  - 不能返回一个 promise。所以不能使用 async/await
  - 举个 🌰 子：

  ```jsx
  useEffect(async () => {
    // 错误：useEffect的回调函数不能返回一个promise
    const data = await fetchData();
    setData(data);
  }, []);
  ```

  - 一个已知的知识：**【async 本身自动返回一个 Promise】**
  - 解决方法：

  ```jsx
  useEffect(() => {
    const fetchDataAsync = async () => {
      const data = await fetchData();
      setData(data);
    };
    fetchDataAsync();
  }, []);
  ```

- useEffect 在渲染过程中的执行时机
  - 准确的来说，react 会在 commit 阶段执行生成的 effectList。
  - 然后把生成的 workInProgress 树赋值给 current 树。

## 3.useContext

useContext 是 React 提供的一个 Hook，用于在函数组件中 直接读取 Context 的值，从而在组件树中实现 跨层级的数据共享（避免层层 props 传递）。

## 4.useReducer

## 5.useCallback

- 缓存函数引用，避免不必要的函数创建和销毁。
- 缓存函数： useCallback 接受一个函数和一个依赖项数组作为参数。它会返回一个记忆过后的函数，只有当依赖项数组中的值发生变化时，它才会返回一个新的函数。
- **已知前提：**在 React 中，函数在组件内每次渲染都会重新创建一个新的函数引用。也就是说，每次渲染，函数的引用都会发生变化。都是一个全新的函数。
- 使用场景

  #### 防止频繁触发 useEffect

  ```jsx
  function ChatRoom({ roomId }) {
    const [message, setMessage] = useState("");

    function createOptions() {
      return {
        serverUrl: "https://localhost:1234",
        roomId: roomId,
      };
    }
    useEffect(() => {
      const options = createOptions();
      const connection = createConnection(options);
      connection.connect();
      return () => connection.disconnect();
    }, [createOptions]); // 🔴 问题：这个依赖在每一次渲染中都会发生改变
  }
  ```

  如果这么写就会导致，每次渲染都会触发 useEffect，因为 createOptions 是一个函数，每次渲染都会创建一个新的函数引用。  
   而导致重新渲染的条件可能是别的比如 message 改变了。 这样就会导致频繁的断开链接出现问题。  
   但是本意上，是希望比如这个组件第一次渲染的时候，就建立连接，然后在组件卸载的时候断开连接。  
   所以我们可以使用 useCallback 来缓存 createOptions 函数，这样每次渲染的时候，createOptions 函数的引用都是相同的。  
   这样就可以避免不必要的重新渲染。

  #### 传给子组件的时候，跳过组件的重新渲染。与 react.memo 配合使用

  ```jsx
  <!-- 父组件 -->
  function ParentComponent({ data }) {
    const handleClick = useCallback(() => {
      // 处理点击事件
    }, []);

    return <ChildComponent data={data} onClick={handleClick} />;
  }
  <!-- 子组件 -->
  // ✅ 子组件
  import { memo } from 'react';
  const ChildComponent = memo(function ChildComponent({ data, onClick }) {
  console.log('Child render'); // 用于观察渲染情况

  return (
    <div>
      <button onClick={onClick}>Click me</button>
      <p>{data}</p>
    </div>
  );
  });
  ```

  如果不加 useCallBack，onClick 每次新的渲染都会是一个新的值，就算加上 memo 子组件每次都会重新渲染。所以必须加上 useCallback

## 6.useMemo

缓存计算结果，避免不必要的计算。（类似于 vue 中的计算 computed）

- 用于缓存一些复杂的计算结果，避免每次渲染都重新计算。

## 7.useRef

- 在整个生命周期中保持同一个引用。
- 改变 ref.current 的值不会触发组件重新渲染。
- 用途：
  - 存储 DOM 元素引用。
  - 存储上一次渲染的状态或者回调。
  - 存储一些不需要重新渲染的状态（比如存储一些不影响 ui 的纯逻辑的状态）。
- 具体的使用情况
- 💋 原理须知
  #### 为什么 useRef 可以保持同一个引用而 useState 每次都会重新渲染
  因为所有的 Hook 状态（如 useState、useEffect、useRef 等）都会以链表结构存储在当前组件对应的 Fiber 节点的 memoizedState 属性上。
  React 在每次组件重新渲染时，会沿着这条 Hook 链表顺序执行 Hook 调用，并复用上一次的 Hook 节点数据。
- useRef

  在初始化时，React 会创建一个 { current: initialValue } 的对象，并将这个对象存放在对应的 Hook 节点的 memoizedState 中。
  在后续的渲染中，React 只是取出同一个对象引用返回（不会创建新对象），因此即使组件重新渲染，ref.current 依然指向同一个引用。

- useState 则不同，它的 memoizedState 存放的是当前的 state 值，而当你调用 setState 时，React 会：
  - 创建一个新的更新对象（update），放入 Hook 的更新队列；
  - 调度一次重新渲染；
  - 渲染时根据更新队列计算出新的 state；
  - 如果新的 state 与旧的 state 不同，就会触发组件重新渲染。
- 所以 useState 会触发重新渲染并更新 state 值，而 useRef 只是单纯地保存一个可变引用，不会引起重新渲染。

## 8.useLayoutEffect

# 各个 hook 在 react 中的时间段

# React Hook 执行阶段与特点

| Hook                     | 执行阶段                | 触发渲染？ | 特点                                           |
| ------------------------ | ----------------------- | ---------- | ---------------------------------------------- |
| **useState（读取）**     | Render 阶段             | ❌         | 只是读取当前 state，不会触发渲染               |
| **useState（setState）** | 触发新的 Render         | ✔          | 调度更新，使 React 重新进入 Render phase       |
| **useMemo**              | Render 阶段             | ❌         | 纯计算缓存，提前参与渲染                       |
| **useCallback**          | Render 阶段             | ❌         | 生成函数的缓存版本                             |
| **useRef**               | Render 阶段             | ❌         | 持久存储，不触发渲染                           |
| **useContext**           | Render 阶段             | ❌         | 获取 context，如变化会触发重新 render          |
| **useEffect**            | Commit 阶段（异步执行） | ❌         | DOM 完成后执行，不阻塞 UI                      |
| **useLayoutEffect**      | Commit 阶段（同步）     | ❌         | DOM 更新后、浏览器绘制前执行，可读写布局       |
| **useReducer**           | Render 阶段             | ❌         | dispatch 触发新的 render，行为与 useState 类似 |

# react 18 新特性，新 Hook
