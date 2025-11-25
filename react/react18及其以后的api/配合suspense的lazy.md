# 懒加载

## 懒加载和普通的关键区别

- 懒加载和普通加载的关键区别在于 **「会不会提前注册和加载」**

```jsx
const Editor = () => {
  return <div>编辑器内容</div>;
};

const App = () => {
  const data = null; // 或者其他条件

  return (
    <div>
      {data && <Editor />} {/* 如果 data 存在，则渲染 Editor */}
    </div>
  );
};
```

```jsx
const LazyEditor = React.lazy(() => import("./Editor"));

const App = () => {
  const data = null; // 或者其他条件

  return (
    <div>
      {data && (
        <Suspense fallback={<div>加载中...</div>}>
          <LazyEditor />
        </Suspense>
      )}
    </div>
  );
};
```

### 具体解释

**比如说这同一个组件 Editor，一个是普通组件一个是懒加载的组件**

#### 关键差异

- 普通组件（没有懒加载）：组件的代码会在应用启动时加载，只要组件被渲染，它就会被加载。如果没有满足条件是不会渲染但是其实早就加载好了。
- 懒加载组件（React.lazy()）：组件的代码会被延迟加载，只有在渲染时才会加载组件代码。
- 因此，React.lazy() 帮助我们延迟加载组件，只有在条件成立时（例如用户点击、路由变化、条件渲染等），才触发组件加载，避免不必要的资源浪费

#### **换人话：**

- 普通组件（没有懒加载）
  - 组件代码在应用启动时就已经被加载和注册（加入 bundle）。
  - 条件渲染 {data && <Editor />} 只是控制渲染 是否显示，并不会延迟组件代码的加载。
  - 换句话说，即使条件不成立，组件的代码已经在浏览器中了，只是没被渲染出来。
- 懒加载组件（React.lazy() + Suspense）
  - 组件代码不会在应用启动时加载。
  - 只有当组件真正 需要渲染时（条件成立、用户点击、路由跳转等）才会开始加载代码。
  - Suspense 用来在加载过程中显示占位 UI（fallback）。
- **可以有效减少初始加载的资源消耗，尤其适合大型组件或页面。**

## 懒加载只关注组件本身 模块代码的异步加载，并不关心组件内部的逻辑异步（如 useEffect、接口请求、定时器等）。

### 懒加载的本质

React.lazy() 是对 组件代码本身 的异步加载（也就是模块的按需加载）。

它的目标是 延迟加载组件的 JS 代码，直到组件真正需要渲染时才去加载。

懒加载关注的是“组件代码何时加载”，而不是组件内部的逻辑或者数据请求。

- **换句话说：**

```jsx
懒加载 = “组件什么时候在页面上可用”

内部异步 = “组件渲染后做什么事情”
```

```jsx
const Editor = () => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return <div>{data ? "数据加载完成" : "加载中..."}</div>;
};

const LazyEditor = React.lazy(() => import("./Editor"));

<Suspense fallback={<div>加载组件...</div>}>
  <LazyEditor />
</Suspense>;
```

- 懒加载负责加载 Editor 的模块代码。

- 接口请求在 useEffect 中执行，和懒加载无关。

- Suspense 只会显示 “加载组件...” 直到 Editor 代码加载完成，不会等接口返回。
