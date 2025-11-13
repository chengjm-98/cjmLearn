# async&await

async 和 await 是 promise 的语法糖，它们可以让我们以同步的方式编写异步代码。

- async 一定会返回一个 promise
- await 只能在 async 函数中使用，它会暂停 async 函数的执行，直到 promise 解决或拒绝。然后返回 promise 的结果。
