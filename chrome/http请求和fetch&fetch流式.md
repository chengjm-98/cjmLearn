# http 状态码

| 状态码 | 类别       | 描述                                               |
| ------ | ---------- | -------------------------------------------------- |
| 1xx    | 信息       | 接收的请求正在处理                                 |
| 2xx    | 成功       | 请求正常处理完毕                                   |
| 3xx    | 重定向     | 需要进行附加操作以完成请求                         |
| 4xx    | 客户端错误 | 服务器无法处理请求，客户端可能需要采取一些纠正措施 |
| 5xx    | 服务器错误 | 服务器处理请求出错，可能是服务器本身的错误         |

| 类别       | 状态码  | 含义                                                          |
| ---------- | ------- | ------------------------------------------------------------- |
| 信息       | 100-199 | 继续、切换协议等                                              |
| 成功       | 200-299 | 请求成功（200 OK、201 Created）                               |
| 重定向     | 300-399 | 资源重定向（301 永久、302 临时）                              |
| 客户端错误 | 400-499 | 请求错误（400 Bad Request、401 未授权、403 禁止、404 未找到） |
| 服务器错误 | 500-599 | 服务器出错（500 内部错误、502 Bad Gateway、503 服务不可用）   |

# http 方法

| 方法        | 功能                            | 幂等性     | 常用场景                         |
| ----------- | ------------------------------- | ---------- | -------------------------------- |
| **GET**     | 获取资源                        | ✅ 幂等    | 获取数据，例如请求列表、详情页   |
| **POST**    | 创建资源 / 提交数据             | ❌ 非幂等  | 表单提交、创建新记录             |
| **PUT**     | 更新资源（整体替换）            | ✅ 幂等    | 更新某个完整对象                 |
| **PATCH**   | 更新资源（部分更新）            | ❌/部分 ✅ | 只修改部分字段                   |
| **DELETE**  | 删除资源                        | ✅ 幂等    | 删除某条记录                     |
| **HEAD**    | 获取资源头信息（无 body）       | ✅         | 获取内容长度、类型，或做缓存验证 |
| **OPTIONS** | 查询服务器支持的 HTTP 方法      | ✅         | CORS 预检请求                    |
| **TRACE**   | 回显请求，用于测试              | ✅         | 调试                             |
| **CONNECT** | 建立隧道（通常用于 HTTPS 代理） | ❌         | 代理服务器使用                   |

# fetch 和 axios 的区别

| 特性                | Axios                                          | Fetch                                                    |
| ------------------- | ---------------------------------------------- | -------------------------------------------------------- |
| **默认返回值**      | 自动解析 JSON，并直接返回 `response.data`      | 需要手动调用 `.json()` 或 `.text()` 解析                 |
| **错误处理**        | HTTP 状态非 2xx 会被 reject（进入 catch）      | HTTP 状态非 2xx 仍然 resolve，需要手动判断 `response.ok` |
| **请求/响应拦截器** | 内置支持                                       | 不支持，需要手动封装                                     |
| **取消请求**        | 内置 `CancelToken` 或 `AbortController`        | 只能通过 `AbortController`                               |
| **上传/下载进度**   | 支持 `onUploadProgress` / `onDownloadProgress` | Fetch 原生不支持，需要 `ReadableStream` 手动实现         |
| **请求数据转换**    | 自动将对象转换为 JSON                          | 需要 `JSON.stringify`                                    |
| **浏览器兼容性**    | IE 需要 polyfill                               | IE 不支持，需要 polyfill                                 |
| **带 cookie**       | `{ withCredentials: true }`                    | `{ credentials: 'include' }`                             |

## fetch 如何处理非 2xx 状态码？

fetch 不会自动处理非 2xx 状态码的错误。当服务器返回的 HTTP 状态码不在 200-299 的范围内，fetch 会将响应对象的 `ok` 属性设置为 `false`。这意味着你需要手动检查 `response.ok` 的值来确定请求是否成功。
如果服务器返回的状态码不是 2xx，你可以通过以下两种方式之一来处理错误：

```jsx
fetch("/api/data")
  .then((response) => {
    if (!response.ok) {
      // 非 2xx 状态
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log("数据:", data);
  })
  .catch((err) => {
    console.error("请求失败:", err);
  });
```

## 关于拦截器

- axios 可以写拦截器，是因为它本身是一个 HTTP 客户端库，内部对请求流程做了封装。
- fetch 是浏览器原生 api，它是一个单一函数，浏览器不会暴露“请求前 / 响应后”的钩子，没有中间层给你插，所以没有办法 xiangaxios 那样写拦截器

### fetch 的拦截器

```jsx
function request(url, options = {}) {
  // ===== 请求拦截 =====
  const token = localStorage.getItem("token");

  const finalOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    },
  };

  return fetch(url, finalOptions)
    .then((response) => {
      // ===== 响应拦截 =====
      if (!response.ok) {
        if (response.status === 401) {
          // 统一处理未登录
          console.log("未授权，跳转登录");
        }
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.json();
    })
    .catch((err) => {
      // ===== 错误拦截 =====
      console.error("请求异常:", err);
      throw err;
    });
}
```

# 什么时候使用 fetch，什么时候使用 axios

axios 不支持流式处理（ReadableStream），而 fetch 支持。

## 推荐 Axios：

- 后台管理系统
- 需要拦截器、统一错误处理
- 需要上传/下载进度

## 推荐 Fetch：

- 轻量项目
- 对 bundle size 敏感
- 需要流式处理（ReadableStream）

# 关于 fetch 的流式加载

Fetch 使用 Streams API（ReadableStream）来处理流式数据。这意味着你可以在数据到达时立即处理它，而不需要等待整个响应体加载完成。
