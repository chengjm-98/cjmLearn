# 什么是 promise

本质上 Promise 是 JavaScript 的一个标准内置对象，用于表示一个异步操作的最终完成（或失败）及其结果值。

# 两大特点

- 链式调用
- 状态变化后就不会再改变状态

# 三种状态

- 待定（pending）：初始状态，既没有被兑现，也没有被拒绝。
- 已兑现（fulfilled）：意味着操作成功完成。
- 已拒绝（rejected）：意味着操作失败。

# 什么时候回改变状态

- ## resolve(value)
  fulfilled 标记成功返回 value
- ## reject(reason)
  rejected 标记失败，返回 reason
- ## resolve(promise)
  等待 promise 的状态 等待另一个 promise 完成或失败
- ## 抛出异常
  rejected 等价于调用 reject

# 能支持链式调用的原因

promise 能支持链式调用的原因，是因为.then()、.catch() 和 .finally() 都返回一个新的 Promise 对象。

# promise 的同步和异步

- 1. Promise 构造函数的执行是同步的
     当你新建一个 Promise 的时候，传进去的 executor 函数（带有 resolve 和 reject 的函数）是立即同步执行的。
- 2. .then() / .catch() / .finally() 的回调总是异步执行的
- 3. resolve() / reject() 它本身是同步触发状态变化，触发的回调是异步的，就是.then .catch 中的东西

# promise 的静态方法和实例方法

实例方法是“某个 Promise 实例”调用的方法，静态方法是挂载在 Promise 类本身上的方法。

## 静态方法

- ### 静态方法的一些意义：
  - 1.不依赖实例，做一些通用工具函数。
  - 2.一些工厂方法。
  - 3.用于多态和继承。(具体的可见 ES6 的继承)
- ### 静态方法有哪些

  - Promise.resolve(value)
  - Promise.reject(reason)
  - Promise.all(iterable)

    ````jsx
    iterable：一个可以遍历的对象（通常是数组），里面是多个 Promise 实例或普通值。
    返回值：一个新的 Promise。
    执行逻辑：
    所有 Promise 都成功（fulfilled）：返回一个新的 fulfilled Promise，值是一个结果数组，顺序与传入顺序一致。
    任意一个失败（rejected）：立即返回一个 rejected Promise，并抛出第一个失败的错误。
    const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
    resolve(1);
    }, 2000);
    });
    const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
    reject(1);
    }, 2000);
    });
    Promise.all([p1, p2]).then(
    (result) => {
    console.log("promiseAll 成功", result);
    },
    (error) => {
    console.log("promiseAll 失败", error);
    }
    );

         ```

    ````

  - Promise.race()
    它接受一个可迭代的对象（通常是数组），里面是多个 Promise 实例或普通值。
    返回值：一个新的 Promise。
    执行逻辑：
    第一个 Promise 成功（fulfilled）或失败（rejected）：立即返回这个 Promise 的结果。
  - Promise.any()
    它接受一个可迭代的对象（通常是数组），里面是多个 Promise 实例或普通值。
    返回值：一个新的 Promise。
    执行逻辑：
    第一个 Promise 成功（fulfilled）：立即返回这个 Promise 的结果。

## 实例方法

### .then .catch .finally

- .then 和.catch 都会返回一个新的 Promise，catch 不管被连接到哪里，都能捕获上层未捕捉过的错误
- .finally()方法不管 Promise 对象最后的状态如何都会执行.
  finally()方法的回调函数不接受任何的参数，也就是说你在.finally()函数中是没法知道 Promise 最终的状态是 resolved 还是 rejected 的
  它最终返回的默认会是一个上一次的 Promise 对象值，不过如果抛出的是一个异常则返回异常的 Promise 对象。

# promise 的使用

```jsx
new MyPromise((resolve, reject) => {
  setTimeout(() => resolve("Success"), 1000);
})
  .then(
    (value) => {
      console.log(value); // 输出: Success
      return "Next value";
    },
    (error) => {
      console.log(error);
    }
  )
  .then((value) => {
    console.log(value); // 输出: Next value
  })
  .catch((error) => {
    console.log(error);
  });
```

# async&await

```jsx
async = Promise 工厂
await = Promise 解包器
```

async 和 await 是 promise 的语法糖，它们可以让我们以同步的方式编写异步代码。

- async 一定会返回一个 promise
- await 只能在 async 函数中使用，它会暂停 async 函数的执行，直到 promise 解决或拒绝。然后返回 promise 的结果。
