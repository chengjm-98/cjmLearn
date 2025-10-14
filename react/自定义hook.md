# 自定义 hook

**复用逻辑而不是复用 UI**

既然是复用逻辑，那么一个公共的方法也可以实现复用逻辑，为什么要使用自定义 hook?

**不仅复用逻辑，而且封装了逻辑的生命周期管理（副作用）**

## 自定义 hook 和函数的关键区分

| 对比维度                                      | 自定义 Hook              | 普通函数                    |
| --------------------------------------------- | ------------------------ | --------------------------- |
| 是否能使用其他 Hook（如 useState、useEffect） | ✅ 可以                  | ❌ 不行                     |
| 是否参与 React 的渲染流程                     | ✅ 是                    | ❌ 否                       |
| 状态是否与组件生命周期绑定                    | ✅ 绑定当前组件          | ❌ 不绑定（调用后就消失）   |
| 是否可以触发组件重新渲染                      | ✅ 可以（通过 setState） | ❌ 不行                     |
| 状态是否持久化（跨渲染保留）                  | ✅ 是（通过 Fiber）      | ❌ 否（每次调用都重新执行） |
| 是否受 Hook 调用顺序约束                      | ✅ 是                    | ❌ 否                       |
| React DevTools 是否能追踪                     | ✅ 能                    | ❌ 不能                     |

## 自定义 hook 的使用

### 什么是自定义 hook？

- 自定义 hook 本质上就是一个以 use 开头的**函数**,但是这个函数内部可以使用其他的 hook。
- 返回状态和逻辑结果
- 可以接受参数
- 只能在函数最外层调用 hook，不能在循环、条件判断、嵌套函数中调用 hook。
- 自定义 hook 不会创建独立的状态作用域，它只是把逻辑抽离出来，依然归属于调用它的组件。

### 参数化和可配置化

- 让自定义 hook 支持动态参数化和可配置化，让它更加灵活和可复用。

### 状态共享（全局逻辑复用）

- 有时候我们希望不同组件共同共享一份状态，这时候可以使用自定义 hook 来实现状态共享。（在不适用 mobx 等全局管理工具的前提下）
- 举个 🌰 子：

```jsx
const ThemeContext = createContext();
//自定义provider
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
// 自定义hook
export function useTheme() {
  return useContext(ThemeContext);
}
//-----------使用---------
function Button() {
  const { theme, toggle } = useTheme();
  return <button onClick={toggle}>当前主题：{theme}</button>;
}
//-----------jsx---------
<ThemeProvider>
  <Button />
</ThemeProvider>;
```

### 性能优化

- 在自定义 Hook 内部，也要缓存计算或函数，防止不必要的重渲染。比如使用 useMemo、useCallback 等。
