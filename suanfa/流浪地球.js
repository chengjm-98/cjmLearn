/*
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2024-10-24 17:00:29
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2024-10-24 18:35:39
 * @FilePath: \learn\suanfa\流量地球.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
function findLatestEngines(sum, firstArray) {
  //sum 总发射器数
  //firstArray 第一批发射的发射器，格式：[t,p] [时间，位置]
  // 初始化每个发动机的启动时间为 Infinity（无穷大）
  let time = new Array(sum).fill(Infinity); //用来存储每个发射器的最快发射时间
  let queue = []; //发射队列
  for ([t, p] of firstArray) {
    if (t < time[p]) {
      //如果t小于time中对应位置的数据，更新为最小值
      time[p] = t;
    }
    queue.push([t, p]);
  }
  while (queue.length > 0) {
    console.log("queue1", queue);
    let engines = queue.shift(); //从头取出一个发射器
    let enginesIndex = engines[1]; //发射器位置
    console.log("取出", engines);
    let left = (enginesIndex - 1 + sum) % sum; //发射器左边位置
    let right = (enginesIndex + 1) % sum; //发射器右边位置
    if (time[left] > engines[0] + 1) {
      //如果左边位置在time中的时间大于未来匹配的时间，取最小值
      time[left] = engines[0] + 1;
      queue.push([engines[0] + 1, left]);
    }
    if (time[right] > engines[0] + 1) {
      //如果左边位置在time中的时间大于未来匹配的时间，取最小值
      time[right] = engines[0] + 1;
      queue.push([engines[0] + 1, right]);
    }
    console.log("queue2", queue);
  }
  let result = [];
  //更新结束后
  let maxVal = Math.max(...time);
  time.forEach((item, i) => {
    if (item === maxVal) {
      result.push(i);
    }
  });
  return {
    个数: result.length,
    结果: result,
  };
}
console.log(
  findLatestEngines(8, [
    [0, 2],
    [0, 6],
  ])
); // 输出最晚启动的发动机
