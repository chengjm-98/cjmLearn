# navigator.sendBeacon

- 只能是 post
  | 特性 | 说明 |
  | ------------------ | -------------------------------------- |
  | 不会阻塞页面 | 不影响跳转和关闭 |
  | 页面卸载也能发 | beforeunload / visibilitychange 也能用 |
  | 浏览器保证尽力发送 | 可靠性高 |
  | 不会阻塞主线程 | 异步、低优先级 |

## 为什么要使用 navigator.sendBeacon

- 接口什么的话可能在页面卸载在关闭浏览器的时候会被取消掉，所以有可能导致数据丢失。

## 经典场景

```js
window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    navigator.sendBeacon(
      "/api/report",
      JSON.stringify({
        type: "page_leave",
        time: Date.now(),
      })
    );
  }
});
```

# 比较

| 对比         | sendBeacon      | fetch       |
| ------------ | --------------- | ----------- |
| 是否阻塞页面 | ❌ 不阻塞       | 可能阻塞    |
| 卸载时能发   | ✅ 可以         | ❌ 经常失败 |
| 响应处理     | ❌ 无法读取响应 | ✅ 可以     |
| 适合场景     | 埋点、监控      | 业务接口    |
