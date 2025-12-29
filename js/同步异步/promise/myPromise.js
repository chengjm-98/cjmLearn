//手写一个promise
class MyPromise {
  static PENDING = "pending"; //等待
  static FULFILLED = "fulfilled"; //成功
  static REJECTED = "rejected"; //失败
  status; //状态
  value; //成功的值
  reason; //失败的原因
  //成功的回调和失败的回调列表
  onFulfilledCallback = [];
  onRejectedCallback = [];
  constructor(executor) {
    this.status = MyPromise.PENDING; //默认状态
    if (executor) {
      //executor是一个函数
      executor(this.resolve.bind(this), this.reject.bind(this));
    }
  }
  resolve(value) {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.FULFILLED;
      this.value = value;
    }
    this.onFulfilledCallback && this.onFulfilledCallback.forEach((fn) => fn());
  }
  reject(reason) {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.REJECTED;
      this.reason = reason;
    }
    this.onRejectedCallback && this.onRejectedCallback.forEach((fn) => fn());
  }
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const fulfilledHandler = (value) => {
        try {
          const result = onFulfilled ? onFulfilled(value) : value;
          resolve(result);
        } catch (e) {
          reject(e);
        }
      };
      const rejectedHandler = (reason) => {
        try {
          const result = onRejected ? onRejected(reason) : reason;
          reject(result);
        } catch (e) {
          reject(e);
        }
      };
      if (this.status === MyPromise.FULFILLED) {
        queueMicrotask(() => {
          fulfilledHandler(this.value);
        });
      } else if (this.status === MyPromise.REJECTED) {
        queueMicrotask(() => {
          rejectedHandler(this.reason);
        });
      } else if (this.status === MyPromise.PENDING) {
        this.onFulfilledCallback.push(() => {
          queueMicrotask(() => {
            fulfilledHandler(this.value);
          });
        });
        this.onRejectedCallback.push(() => {
          queueMicrotask(() => {
            rejectedHandler(this.reason);
          });
        });
      }
    });
  }
}

const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(100);
  }, 1000);
}).then(
  (res) => {
    console.log(res);
  },
  (err) => {
    console.log(err);
  }
);

//关于手写promise的几点注意问题
//1. 状态只能由pending到fulfilled或者rejected，一旦确定就不能再改变
//2. .then 链式调用，返回的是一个新的promise
//3. 等待状态改变后才能触发.then的回调函数
