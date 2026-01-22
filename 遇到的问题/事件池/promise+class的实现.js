/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2026-01-22 11:04:37
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2026-01-22 11:07:33
 * @FilePath: /cjmLearn/js/同步异步/promise/高级使用场景/事件池class写法.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
