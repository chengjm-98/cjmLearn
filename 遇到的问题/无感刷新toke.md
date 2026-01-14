# 什么是无感刷新 token

当短期 Token（access token）过期时，系统自动用长期 Token（refresh token）换一个新的短期 Token。  
换完后，自动重试之前失败的请求。  
用户完全感觉不到，不用重新登录或刷新页面。

- 在前端 axios 拦截器里面做

# 无感刷新 token 的实现方式

- 双 token 机制
  | Token 类型 | 作用 | 有效期 |
  | ------------- | --------------- | ----------- |
  | Access Token | 业务接口鉴权 | 短（如 15 分钟） |
  | Refresh Token | 刷新 Access Token | 长（如 7~30 天） |

## 流程

```jsx
用户登录
   ↓
返回 AccessToken + RefreshToken
   ↓
前端请求接口 → 带 AccessToken
   ↓
AccessToken 过期 → 返回 401
   ↓
前端自动调用刷新接口，通过 RefreshToken获取
   ↓
后端校验 RefreshToken
   ↓
签发新 AccessToken + 新 RefreshToken
   ↓
前端替换 Token 并重试原请求（无感）


如果refresh_token 失效
→ 清空本地 token
→ 跳转登录页

```

## 为什么要用双 Token？

- Access Token 用于接口鉴权，生命周期短，安全性高
- Refresh Token 用于刷新 Access Token，生命周期长，减少用户频繁登录
- 双 Token 兼顾安全性和用户体验

## 为什么 Access Token 为什么要短有效期？

- 防止 token 泄露后被长期利用，缩短攻击窗口，提高安全性

## 如何防止 refresh_token 被盗用？

每次刷新都会生成新的 refresh_token
旧的立即失效
可绑定设备 ID + IP 风控

## 并发请求导致多个 401 怎么办？

前端加刷新锁，只允许一个刷新请求
其余请求排队等待刷新完成后重试

## 你们的登录态是有状态还是无状态？

Access Token 是无状态 JWT
Refresh Token 是有状态存储
结合两者优势

## token 黑名单

它本质上就是一张表：已失效 Token 列表，如果在直接拒绝访问。

- 正常情况下：JWT 是无状态的，服务器不存 Token，只靠过期时间控制有效性
- 如果用户主动退出登录/如果账号被封禁/如果 Token 被盗/如果风控要求强制下线
  **一种机制让 Token 立刻失效**token 黑名单
- 标准回答

```jsx
我们的系统采用 JWT + Refresh Token 双 Token 机制。
由于 JWT 本身是无状态的，无法主动失效，所以引入了 Token 黑名单机制。

当用户退出登录、账号封禁或风控触发时，会把当前 Access Token 加入 Redis 黑名单，并设置 TTL 等于 Token 剩余有效期。

每次请求在校验 JWT 之后，还会额外校验是否在黑名单中，从而实现 Token 的即时失效能力。
```
