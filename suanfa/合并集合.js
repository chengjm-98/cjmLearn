/*
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2024-10-14 15:12:48
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2024-10-14 16:08:25
 * @FilePath: \learn\suanfa\合并集合.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function (intervals) {
  intervals.sort((p, q) => p[0] - q[0]); //根据左端点排序
  let ans = []; //合并后的数组
  for (p of intervals) {
    let ansLength = ans.length;
    if (ansLength && p[0] <= ans[ansLength - 1][1]) {
      ans[ansLength - 1][1] = Math.max(p[1], ans[ansLength - 1][1]);    //比如[[1,4][2,3]],要取3和4的最大值
    } else {
      //第一次以及不需要合并的场景
      ans.push(p);
    }
  }
  return ans;
};
console.log(
  "结果",
  merge([
    [1, 4],
    [0, 4],
  ])
);
