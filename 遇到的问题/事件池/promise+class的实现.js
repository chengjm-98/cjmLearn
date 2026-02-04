class Scheduler {
  constructor(max) {
    this.max = max; // 最大并发数
    this.running = 0; // 当前运行数量
    this.queue = []; // 任务队列
  }

  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this._run();
    });
  }

  _run() {
    if (this.running >= this.max) return;
    if (this.queue.length === 0) return;

    const { task, resolve, reject } = this.queue.shift();
    this.running++;

    Promise.resolve()
      .then(task)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {
        this.running--;
        this._run(); // 执行下一个
      });
  }
}
