# proxy 代理

## 作用

Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

## 语法

```js
const p = new Proxy(target, handler);
```

## 详细介绍

-target 要使用 Proxy 包装的目标对象。----**可以是任何类型的对象，包括原生数组，函数，甚至另一个代理**  
-handler 带有“捕捉器”（“traps”，即拦截操作的方法）的对象**说人话：一个对象，它的属性是函数**，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。  
捕捉器的意思：比如 get 捕捉器用于读取 target 的属性，set 捕捉器用于写入 target 的属性，等等。

### 没有捕捉器的 proxy 是一个 target 的透明包装器

```js
let target = {};
let proxy = new Proxy(target, {}); // 空的 handler 对象

proxy.test = 5; // 写入 proxy 对象 (1)
alert(target.test); // 5，test 属性出现在了 target 中！

alert(proxy.test); // 5，我们也可以从 proxy 对象读取它 (2)

for (let key in proxy) alert(key); // test，迭代也正常工作 (3)
```

我们可以看到，没有任何捕捉器，proxy 是一个 target 的透明包装器（wrapper）。  
![alt text](proxy.png)
所有对 proxy 的操作都直接转发给了 target。

### 设置捕捉器的 proxy 可以拦截操作
