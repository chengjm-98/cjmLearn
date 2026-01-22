# 什么是cdn

CDN 就是把网站的内容缓存到全国甚至全球各地的服务器上，让用户就近访问，从而加快加载速度、提高稳定性。
相当于也是一个服务器，但是这个服务器是专门用来缓存网站的内容的，所以叫做内容分发网络。

# 什么是oss

OSS 是源站（存储静态资源的地方），CDN 是分发网络（把资源快速送到用户）

```jsx
浏览器请求： https://cdn.example.com/assets/main.js
        ↓
CDN 节点缓存命中？ → 是 → 直接返回浏览器
                   → 否 → 回源 OSS → 缓存 → 返回浏览器
```

# cdn的作用

- 加快网站打开速度
- 减轻源服务器压力
- 提高访问稳定性（不容易崩）
- 抗攻击、防刷流量

# 具体使用

- 前端设置baseurl，在vite或者webpack

  ```jsx
  ---vite----
  export default {
  base: 'https://cdn.example.com/',
   }
  ----webpack----
  output: {
  publicPath: 'https://cdn.example.com/'
  }
  ```

  - 访问的时候直接加前缀

- ## 设置点nginx
  ```jsx
  适合静态资源的缓存/比如图片/字体等
  location /assets/ {
        root /var/www/html;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
  ```

# gzip

gzip on;
gzip_types text/css application/javascript application/json;

# 打开 sendfile

sendfile on;

# 提高并发

worker_connections 10240;

```

```
