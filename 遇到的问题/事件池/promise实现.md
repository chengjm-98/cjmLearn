# 控制并发/事件池

## 场景

比如同时请求 100 个接口的场景

- 虽然 HTTP/1.1 在同一域名下默认最多 6 个 TCP 连接，但这并不等于你只能发 6 个请求，而是多余的请求会进入等待队列。

## 问题来源

- 服务端扛不住，线程池打满，数据库连接池打满，触发限流。
- 浏览器内存暴涨，如果返回的请求数据很大，一次性加载会导致内存暴涨。
- js 线程回调会塞满，100 个回调同时进入微任务队列，页面会出现明显卡顿

## 解决方案

- 控制并发数量，维护一个线程池，同时最多执行 N 个 Promise，后面的排队，执行完一个补一个。

## 具体实现

- 函数实现
- 类实现

```jsx
request()  --> 入队 --> 尝试调度
                   ↓
              runNext()
              |  有空位？
              |  有任务？
              ↓
            执行 task()
                 ↓
             执行完成
                 ↓
           running--
           再次 runNext()

```

```jsx
function createRequestPool(limit) {
  //limit是并发上限
  let running = 0; //用来控制现在正在执行的任务数
  const queue = []; //排队队列

  function runNext() {
    if (running >= limit || queue.length === 0) return;
    //正在执行的任务已经达到上限，或者队列中没有任务了，直接返回

    const { task, resolve, reject } = queue.shift();
    //从队列头部取出第一个任务，执行它
    running++;

    task()
      .then(resolve)
      .catch(reject)
      .finally(() => {
        //当前任务执行完毕 running-- 立刻尝试调度下一个任务
        running--;
        runNext();
      });
  }

  return function (task) {
    //这里为什么要新建一个promise，给外部调用者（是指下面的1-1的位置可以使用.then() 或 .catch()）
    return new Promise((resolve, reject) => {
      //这里传resolve和reject是为了这个外层的 Promise 需要在内部 task 执行完毕时被 resolve / reject
      queue.push({ task, resolve, reject });
      //尝试执行任务，但是否执行，要看 running 是否小于 limit
      runNext();
    });
  };
}
const request = createRequestPool(5);
//request是一个函数，接受一个task（函数），返回一个Promise
urls.forEach((url) => {
  //1-1
  request(() => fetch(url)).then(
    (res) => console.log(res),
    (err) => console.log(err)
  );
  //这里一定要写成一个函数，否则fetch这个promise会立即执行，就没有等待区这个必要了
});
```

## 为什么 task 要是函数而不是 Promise？

- fetch(url) 会立刻执行，返回一个 已经在执行的 Promise，你的并发控制就失效了：Promise 已经在执行了，running = 0 还没被加上，任务已经开始，queue 只是一个 “排队区”，无法阻止这个 Promise 执行。
- 如果换成一个函数，函数不会立即执行，只有当你调用这个函数的时候，才会执行 fetch(url)。
