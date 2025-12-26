<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-12-25 16:54:54
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2025-12-26 16:21:52
 * @FilePath: /cjmLearn/长连接/websocket.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# websocket

WebSocket 是一种网络通信协议，它提供了在客户端和服务器之间建立持久连接的功能，并且允许双向通信。WebSocket 设计的目标是克服传统 HTTP 请求/响应模型的限制，使得数据交换能够在客户端和服务器之间**实时**进行。

WebSocket 在 HTTP 协议的基础上进行了扩展，基于 TCP 协议，允许客户端和服务器之间建立持久的双向通信通道，它与传统的 HTTP 长轮询相比，具有**更低的延迟和更高的实时性**。

## websocket 的基本使用

### 1.1 建立 WebSocket 连接

通过 WebSocket 构造函数，可以创建一个 WebSocket 实例并连接到指定的服务器。WebSocket 的 URL 以 ws://（非加密）或 wss://（加密）为协议头。

```jsx
// 创建 WebSocket 实例
const socket = new WebSocket("ws://example.com/socket"); // 非加密连接
const socket = new WebSocket("wss://example.com/socket"); // 加密连接
```

### 1.2 监听事件

WebSocket 提供了几种常用事件，我们可以通过监听这些事件来处理连接的不同阶段。

- onopen：当 WebSocket 连接建立成功时触发。

- onmessage：当接收到来自服务器的消息时触发。

- onclose：当 WebSocket 连接关闭时触发。

- onerror：当 WebSocket 连接出现错误时触发。

```jsx
socket.onopen = function (event) {
  console.log("WebSocket 连接已打开");
  socket.send("Hello, Server!"); // 发送消息
};

socket.onmessage = function (event) {
  console.log("收到消息: ", event.data); // 处理服务器发送过来的消息
};

socket.onclose = function (event) {
  console.log("WebSocket 连接已关闭");
};

socket.onerror = function (event) {
  console.log("WebSocket 错误: ", event);
};
```

### 1.3 发送和接收消息

通过 WebSocket 实例的 send() 方法，可以向服务器发送消息。支持发送文本和二进制数据。

```jsx
socket.send("这是发送的文本消息");
// 发送二进制数据
const buffer = new ArrayBuffer(16); // 创建一个16字节的缓冲区
const view = new DataView(buffer); // 以视图的方式处理数据
view.setInt8(0, 42); // 设置一个整数

socket.send(buffer); // 发送二进制数据
```

### 1.4 关闭连接

当不再需要与服务器保持连接时，可以通过调用 WebSocket 实例的 close() 方法来关闭连接。

```jsx
socket.close();
```

## websocket 的心跳机制

WebSocket 是持久连接的，但有时连接可能会因网络问题或其他原因断开。为了确保连接的持续有效，通常会使用 心跳机制 来检测连接是否活跃。

### 1.1 客户端发送心跳包

客户端定期向服务器发送一个特定的消息（例如 "ping"），以检查连接是否依然存在。如果服务器收到 "ping" 后没有返回响应，则说明连接已断开。

```jsx
setInterval(() => {
  socket.send("ping"); // 发送心跳包
}, 30000); // 每30秒发送一次
```

## 常见的问题

### 1.1websocket 连接丢失

如果 websocket 连接丢失，可以使用重连机制来恢复连接。

```jsx
socket.onclose = function (event) {
  console.log("连接丢失，尝试重连...");
  setTimeout(() => {
    socket = new WebSocket("ws://example.com/socket"); // 重新连接
  }, 1000);
};
```

### 1.2 WebSocket 消息丢失

## websocket 性能优化

### 1.1 压缩消息

可以使用压缩算法（如 gzip）来减小消息的大小，从而减少网络传输的开销。

```jsx
// 发送压缩后的消息
socket.send(compress(message));
```

### 1.2 消息分片

如果消息非常大，可以将其分片发送，以减少单个消息的大小。

```jsx
// 分片发送消息
function sendChunkedMessage(message) {
  const chunkSize = 1024; // 每个分片的大小
  for (let i = 0; i < message.length; i += chunkSize) {
    const chunk = message.slice(i, i + chunkSize);
    socket.send(chunk);
  }
}
```

### 1.3 心跳机制

使用心跳机制来检测连接是否活跃，确保连接的持续有效。

```jsx
setInterval(() => {
  socket.send("ping"); // 发送心跳包
}, 30000); // 每30秒发送一次
```

### 1.4 消息缓存

为了防止消息丢失，防止 websocket 在断开重连期间丢失消息，可以使用消息缓存机制。

消息缓存机制应该分为两个部分，一个是客户端缓存，一个是服务器端缓存。

- 客户端缓存：

  - 客户端可以缓存在断开期间用户的操作，比如用户的输入、消息等。
  - 当连接恢复时，客户端可以将缓存的消息重新发送给服务器。
  - 客户端缓存可以使用本地存储（如 localStorage）来实现。

  ```jsx
  let messageBuffer = []; // 用来缓存用户的消息
  //还可以设置一个最大的缓存大小，防止缓存过大
  const MAX_BUFFER_SIZE = 100;

  function sendMessage(message) {
    if (socket.readyState === WebSocket.OPEN) {
      // 如果 WebSocket 连接是开放的，直接发送消息
      socket.send(message);
    } else {
      // 否则将消息缓存
      messageBuffer.push(message);
    }
  }

  socket.onopen = function () {
    // 连接恢复时，发送缓存的消息
    while (messageBuffer.length > 0) {
      const message = messageBuffer.shift();
      socket.send(message);
    }
  };
  ```

- 服务器端缓存：

  - 服务器端可以在断开期间，使用消息队列来缓存消息，直到连接恢复。
  - 当连接恢复时，服务器可以将缓存的消息重新发送给客户端。
  - 服务器端缓存可以使用消息队列（如 Redis）来实现。

  ```jsx
  const WebSocket = require("ws");
  const redis = require("redis");
  const client = redis.createClient(); // Redis 客户端
  const wss = new WebSocket.Server({ port: 8080 });

  const MAX_CACHE_SIZE = 100; // 每个用户的最大缓存消息数

  wss.on("connection", (ws, req) => {
    const userId = req.url.split("?user=")[1]; // 假设 URL 中包含用户 ID 参数
    console.log(`User ${userId} connected`);
    // 当用户连接时，发送缓存的消息
    client.lrange(`messages:${userId}`, 0, -1, (err, messages) => {
      if (err) {
        console.error("Redis error:", err);
        return;
      }
      messages.forEach((msg) => {
        ws.send(msg); // 发送缓存的消息
      });
    });

    // 监听客户端发送的消息
    ws.on("message", (message) => {
      console.log(`Received message from ${userId}:`, message);

      // 将消息缓存到 Redis 中
      client.rpush(`messages:${userId}`, message, (err, reply) => {
        if (err) console.error("Redis error:", err);

        // 如果缓存消息超过最大条数，删除最旧的消息
        if (reply > MAX_CACHE_SIZE) {
          client.lpop(`messages:${userId}`, (err) => {
            if (err) console.error("Redis error:", err);
          });
        }
      });
    });

    // 监听 WebSocket 关闭事件
    ws.on("close", () => {
      console.log(`User ${userId} disconnected`);
    });
  });

  console.log("WebSocket server running on ws://localhost:8080");
  ```
