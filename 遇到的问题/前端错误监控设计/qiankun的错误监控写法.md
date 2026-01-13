# qiankun 的错误监控

- 可以精确到具体子应用的错误/生命周期阶段

```jsx
// main.js
import { addErrorHandler } from "qiankun";

addErrorHandler((event) => {
  const { appOrParcelName, error, lifecycle } = event;

  console.error(`[qiankun-error] ${appOrParcelName} ${lifecycle}`, error);

  reportError({
    app: appOrParcelName, // 子应用名称
    lifecycle, // 生命周期阶段
    message: error.message, // 错误信息
    stack: error.stack,
  });
});
```
