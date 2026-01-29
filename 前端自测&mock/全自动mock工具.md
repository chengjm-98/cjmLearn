# 目标

- Mock 完全在 项目内
- 不切 baseURL、不重启、不改 env
- 一个按钮运行时切 Mock / Real
- 开发 / 测试 / CI 共用一套逻辑

# 方案

使用MSW（Mock Service Worker）

## 什么是MSW

- 在“网络层”拦截请求的 Mock 工具
  - 不是写假接口/不是改业务代码/不是切 baseURL
  - 浏览器发请求之前，被 MSW 拦下来

- req.passthrough() //放行

  ```jsx
  fetch / axios
   ↓
  Service Worker（MSW）
   ├─ 返回 Mock 数据
   └─ 放行真实请求

  ```
