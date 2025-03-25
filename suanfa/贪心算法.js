/*
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2024-11-06 10:08:57
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2024-11-06 11:50:25
 * @FilePath: \learn\suanfa\贪心算法.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// var findContentChildren = function (g, s) {
//   let num = 0;
//   g.sort((a, b) => b-a);
//   s.sort((a, b) => b-a);
//   console.log("g", g);
//   console.log("s", s);
//   let i = 0;
//   for (let j = 0; j < g.length; j++) {
//     if (g[j] <= s[i]) {
//       i++;
//       num++;
//     }
//   }
//   return num;
// };
// console.log("结果", findContentChildren([10, 9, 8, 7], [5, 6, 7, 8]));
var climbStairs = function (n) {
  let dp = new Array(n).fill(0);
  dp[1] = 1;
  dp[2] = 2;
  for (i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
};
 climbStairs;(9)