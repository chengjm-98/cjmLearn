<!-- 一些promise的题/异步同步事件循环 -->

# 一些 promise 的题/异步同步事件循环

## 1. 输出结果 2 6 3 1 7 8 4 5

```js
//第一个宏任务
setTimeout(() => {
  console.log(1);
  Promise.resolve().then(() => {
    console.log(7);
  });
}, 0);

console.log(2); //同步任务

//微任务
Promise.resolve().then(() => {
  console.log(3);
});

//第二个宏任务
setTimeout(() => {
  console.log(8);
  setTimeout(() => {
    console.log(5);
  }, 0);
}, 0);

//第三个宏任务
setTimeout(() => {
  Promise.resolve().then(() => {
    console.log(4);
  });
}, 0);

console.log(6); //同步任务
```

## 2. 输出结果 2 6 3 10 1 7 9 8 4 5

```js
//第一个宏任务
setTimeout(() => {
  console.log(1);
  Promise.resolve()
    .then(() => {
      console.log(7);
    })
    .then(() => {
      console.log(9);
    });
}, 0);

console.log(2); //同步任务

//微任务
Promise.resolve()
  .then(() => {
    console.log(3);
  })
  .then(() => {
    console.log(10);
  });

//第二个宏任务
setTimeout(() => {
  console.log(8);
  setTimeout(() => {
    console.log(5);
  }, 0);
}, 0);

//第三个宏任务
setTimeout(() => {
  Promise.resolve().then(() => {
    console.log(4);
  });
}, 0);

console.log(6); //同步任务
```

## 3. 输出结果 start promise1 timer1 promise2 timer2

```js
Promise.resolve().then(() => {
  console.log("promise1");
  const timer2 = setTimeout(() => {
    console.log("timer2");
  }, 0);
});
const timer1 = setTimeout(() => {
  console.log("timer1");
  Promise.resolve().then(() => {
    console.log("promise2");
  });
}, 0);
console.log("start");
```

## 4. 输出结果

'promise1 里的内容'  
'promise1' Promise{<pending>}  
'promise2' Promise{<pending>}  
'timer1'  
test5.html:102 Uncaught (in promise) Error: error!!! at test.html:102  
'timer2'  
'promise1' Promise{<resolved>: "success"}  
'promise2' Promise{<rejected>: Error: error!!!}

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("success");
    console.log("timer1");
  }, 1000);
  console.log("promise1里的内容");
});
const promise2 = promise1.then(() => {
  throw new Error("error!!!");
});
console.log("promise1", promise1);
console.log("promise2", promise2);
setTimeout(() => {
  console.log("timer2");
  console.log("promise1", promise1);
  console.log("promise2", promise2);
}, 2000);
```

## 5. 输出结果 1 ----关于透传

.then 或者 .catch 的参数期望是函数，传入非函数则会发生值透传。

第一个 then 和第二个 then 中传入的都不是函数，一个是数字类型，一个是对象类型，因此发生了透传，将 resolve(1) 的值直接传到最后一个 then 里。

```js
const promise = new Promise((resolve, reject) => {
  console.log("Promise");
  resolve(1);
})
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log);

  等价于：
  const promise = new Promise((resolve, reject) => {
  console.log("Promise");
  resolve(1);
  }).then(2)
  .then(Promise.resolve(3))
  .then((value)=>{console.log(value)})
```

## 6. 关于 catch 和.then 的 reject 捕获错误

throw new Error('error') 和 reject('error') 都会被 catch 捕获到，也会被。then 的 reject 捕获到。
但是两个同时存在的话，会被前面的捕获掉。

### 比如

```js
Promise.reject("error!!!")
  .then((res) => {
    console.log("success", res);
  })
  .catch((err) => {
    console.log("catch", err);
  });
//输出的是catch error!!!
```

```js
Promise.reject('error!!!')
  .then((res) => {
    console.log('success', res)
  }，(err)=>{
    console.log('reject', err)
  }).catch(err => {
    console.log('catch', err)
  })
//输出的是reject error!!!
```

### 但是如果是 return throw new Error('error')的话，会被 resolve 捕获到，不会被 reject 捕获到。

```js
Promise.resolve()
  .then(() => {
    return new Error("error!!!");
  })
  .then((res) => {
    console.log("then: ", res);
  })
  .catch((err) => {
    console.log("catch: ", err);
  });
//输出的是then:  Error: error!!!
```

## 7. 关于 promise 的链式调用

```js
function promise1() {
  let p = new Promise((resolve) => {
    console.log("promise1");
    resolve("1");
  });
  return p;
}
function promise2() {
  return new Promise((resolve, reject) => {
    reject("error");
  });
}
promise1()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => console.log(err))
  .finally(() => console.log("finally1"));

promise2()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => console.log(err))
  .finally(() => console.log("finally2"));

//输出的结果为：
promise1;
1;
error;
finally1;
finally2;
```
