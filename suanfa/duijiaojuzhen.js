/*
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2024-10-16 18:55:52
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2024-10-16 18:56:00
 * @FilePath: \learn\suanfa\duijiaojuzhen.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
var findDiagonalOrder = function (mat) {
  const m = mat.length; //行
  const n = mat[0].length; //列
  let res = new Array(m * n).fill(0); //目标数组 长度为m*n
  let move = [
    [-1, 1],
    [1, -1],
  ]; //两个方向 右上，左下
  for (let i = 0, j = 0, r = 0, c = 0; i < res.length; i++) {
    //i：res的角标；j：move的角标；rc：遍历到的行列
    console.log("mat[r][c]", r, c);
    res[i] = mat[r][c];
    //先按照右上走
    let x = r + move[j][0];
    let y = c + move[j][1];
    if (x < 0 || x == m) {
      //如果碰到了上下边界,那么往右
      if (c < n - 1) {
        //没到右边界，往右走
        c++;
      } else {
        //碰到了右边界往下走
        r++;
      }
      j = 1 - j;
    } else if (y < 0 || y == n) {
      //碰到了左右边界，优先往下
      if (r < m - 1) {
        //没碰到上下，往下走
        r++;
      } else {
        //往右
        c++;
      }
      j = 1 - j; //变方向
    } else {
      //啥都没碰到的时候就保持原方向走
      r = x;
      c = y;
    }
  }
  return res;
};
