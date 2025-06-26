class MyPromise {
  static PENDING = "PENDING";
  static FULFILLED = "FULFILLED";
  static REJECTED = "REJECTED";

  status = MyPromise.PENDING; // 状态
  value = undefined; //resolve传的值
  reason = undefined; //reject传的值

  // 成功/失败回调队列（支持异步）
  onFulfilledCallbacks = [];
  onRejectedCallbacks = [];

  constructor(executor) {
    // 立即执行 executor（new MyPromise 时的回调）
    try {
      executor && executor(this.resolve.bind(this), this.reject.bind(this));
      //这里是实参，两个参数分别是this.resolve和this.reject。当你新建MyPromise的时候，决定调用哪个
    } catch (err) {
      this.reject.bind(this)(err);
    }
  }
  resolve(value) {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.FULFILLED;
      this.value = value;

      // 执行所有成功回调
      this.onFulfilledCallbacks.forEach((fn) => fn());
    }
  }
  reject = (reason) => {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.REJECTED;
      this.reason = reason;

      // 执行所有失败回调
      this.onRejectedCallbacks.forEach((fn) => fn());
    }
  };
  then(onFulfilled, onRejected) {
    // 支持链式调用：返回新的 MyPromise
    return new MyPromise((resolve, reject) => {
      // 包装成功的回调函数
      const fulfilledHandler = () => {
        try {
          const result = onFulfilled ? onFulfilled(this.value) : this.value;
          resolve(result);
        } catch (e) {
          reject(e);
        }
      };
      //包装失败的回调函数
      const rejectedHandler = () => {
        try {
          const result = onRejected ? onRejected(this.reason) : this.reason;
          reject(result);
        } catch (e) {
          reject(e);
        }
      };

      // 三种状态处理
      if (this.status === MyPromise.FULFILLED) {
        // 微任务模拟（更接近真实 MyPromise）
        queueMicrotask(fulfilledHandler);
      } else if (this.status === MyPromise.REJECTED) {
        queueMicrotask(rejectedHandler);
      } else if (this.status === MyPromise.PENDING) {
        // 还未完成，保存回调（等状态变更时调用）
        this.onFulfilledCallbacks.push(() => queueMicrotask(fulfilledHandler));
        this.onRejectedCallbacks.push(() => queueMicrotask(rejectedHandler));
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
}
const p = new MyPromise((resolve, reject) => {
  resolve(1);
}).then(
  (res) => {
    console.log(res);
  },
  (err) => {
    console.log(err);
  }
);
