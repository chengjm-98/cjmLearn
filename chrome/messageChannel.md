# 什么是 messageChannel

- messageChannel 是 HTML5 的 API，用于创建一个消息通道，用于在不同的窗口之间传递消息。
- 简单来说，它提供了一个 “双向管道”，允许两端发送和接收消息。
- **构造函数**：`new MessageChannel()` 返回一个 MessageChannel 对象，包含两个属性：`port1`和`port2`。
- **实例属性**：
  - `port1`：MessagePort 对象，用于接收消息。
  - `port2`：MessagePort 对象，用于发送消息。
- 属于异步的宏任务，会被放到消息队列中，等待执行。

# messageChannel 的具体使用情况

- 当你需要在不同的窗口之间传递消息时，可以使用 messageChannel。
- iframe 之间可以使用 messageChannel 进行通信。
- webworker 之间也可以使用 messageChannel 进行通信。

# react 中的 messageChannel

其实就是把 requestIdCallBack 的内容用 messageChannel 实现了。
