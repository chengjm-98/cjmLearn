# 反向代理

反向代理是指客户端向代理服务器发送请求，而代理服务器代为向目标服务器请求资源，并将响应返回给客户端。客户端并不知道最终响应的来源，它看到的只是代理服务器。

```jsx
server {
    listen 80;

    location / {
        proxy_pass http://backend_server;  # 将请求转发给后端服务器
    }
}

```

- 反向代理与 websocket

```jsx
server {
    listen 80;

    location /ws/ {
        proxy_pass http://backend_server;  # 转发 WebSocket 请求
        proxy_http_version 1.1;  # 使用 HTTP/1.1 协议
        proxy_set_header Upgrade $http_upgrade;  # 设置 Upgrade 头部
        proxy_set_header Connection 'upgrade';  # 设置 Connection 头部
    }
}

```

# 负载均衡

## 什么是负载均衡

- 通常指的是 前端的 HTTP 请求。客户端（浏览器、移动设备等）发起 HTTP 请求时，这些请求会通过 Nginx 反向代理服务器进行转发，Nginx 会根据配置的负载均衡算法将请求分发到后端的应用服务器上。
- **说人话：**就是把请求均匀的分配到多个服务器上，从而提高系统的性能和稳定性。如果想使用负载均衡，后端需要提供多个服务器，单个服务器是没有意义的。

- nginx 使用**upstream**模块来配置。

## 负载均衡的算法

- 1.  **轮询(如果没有特殊配置就默认使用轮询)**

  - 轮询是最常见的负载均衡策略，它的工作原理是：Nginx 会按顺序（循环）将请求依次分发到各个后端服务器上。例如，如果有 3 台服务器，第一轮请求会发给服务器 1，第二轮请求发给服务器 2，第三轮发给服务器 3，然后循环回到服务器 1，如此往复。

  ```jsx
  http {
   upstream backend {
       server backend1.example.com;
       server backend2.example.com;
       server backend3.example.com;
   }

   server {
       listen 80;

       location / {
           proxy_pass http://backend;
       }
   }
  }

  ```

- 2.  **加权轮询**

  - 加权轮询是对轮询的扩展，允许为每台服务器指定一个权重值。具有更高权重的服务器会接收到更多的请求。这样，如果某台服务器的性能较强，可以通过提高它的权重，来使它处理更多的请求，从而达到负载均衡的目的。

  ```jsx
  upstream backend {
    server backend1.example.com weight=3;  # 权重 3
    server backend2.example.com weight=1;  # 权重 1
    server backend3.example.com weight=2;  # 权重 2
  }
  ```

- 3.  **ip hash** - IP 哈希负载均衡算法是通过客户端的 IP 地址来决定将请求转发到哪台后端服务器。这种方式确保了同一个客户端的请求总是被转发到同一台后端服务器。这样做的好处是能保持会话的连贯性，也就是说，如果一个客户端与某个服务器建立了连接，那么后续的请求就会继续发送到这台服务器。

  ```jsx
        upstream backend {
        ip_hash;
        server backend1.example.com;
        server backend2.example.com;
        server backend3.example.com;

    }

  ```

# 缓存机制

## 什么是缓存机制

- 静态文件缓存：Nginx 可以缓存静态文件，减少每次请求都去访问磁盘或源服务器。
- 反向代理缓存：Nginx 可以缓存反向代理的请求结果，减少对后端服务器的压力。
- 缓存控制：可以通过 proxy_cache 和 proxy_cache_path 配置来启用缓存。

## 缓存的位置：

- 存在本机的磁盘或者内存上。
- 可以自己配置缓存的路径。

## 具体的配置：

- 1.  **基本配置**

```jsx
upstream backend {
  http {
   # 定义缓存路径和大小
   proxy_cache_path /data/nginx/cache levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;
   //keys_zone 设置了一个缓存区域（10MB 内存），max_size 设置了缓存的最大大小，inactive 设置缓存失效的时间。
   server {
       listen 80;

       location / {
           proxy_pass http://backend;
           proxy_cache my_cache;
           proxy_cache_valid 200 1h;  # 200 OK 响应缓存 1 小时
           proxy_cache_valid 404 10m;  # 404 响应缓存 10 分钟
           proxy_cache_use_stale error timeout updating;  # 出错时使用过期缓存
           add_header X-Cache-Status $upstream_cache_status;  # 显示缓存状态
       }
   }
}

}
```

- 2.  **静态文件缓存**
- 减少静态资源请求：静态资源缓存可以减少频繁访问静态文件时的 I/O 操作，提高性能。
- 提高加载速度：客户端缓存静态文件后，下次访问时直接从本地加载，减少了网络延迟和带宽消耗。

```jsx
server {
    listen 80;

    location /images/ {
        root /var/www/html;
        expires 30d;  # 缓存 30 天
        add_header Cache-Control "public";
    }

    location /scripts/ {
        root /var/www/html;
        expires 7d;  # 缓存 7 天
        add_header Cache-Control "public";
    }
}
```

- root 路径 是 Web 服务器（如 Nginx）配置文件中的路径，由 服务器管理员 或 开发人员 配置，指向存放 静态文件 的文件系统目录。
