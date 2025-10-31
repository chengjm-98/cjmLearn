<!--
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2025-08-05 11:38:55
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2025-10-30 17:48:48
 * @FilePath: \cjmLearn\react\hooks.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# react 常见的 hook

## 1.useState

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

## 4.useReducer

## 5.useCallback

缓存函数引用，避免不必要的函数创建和销毁。

## 6.useMemot

缓存计算结果，避免不必要的计算。

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

# hook 的存储和调用以及原理
