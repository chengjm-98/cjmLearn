/*
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2024-10-14 10:53:57
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2024-10-14 11:42:43
 * @FilePath: \learn\suanfa\erfen.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
// var searchInsert = function (nums, target) {
//   for (let i = 0; i < nums.length; i++) {
//     console.log(nums[i], target, i);
//     if (nums[i] >= target) {
//       return i;
//     }
//   }
//   return nums.length;
// };
// console.log("结果", searchInsert([1, 3, 5, 6], 7));
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function (nums, target) {
  let numsLength = nums.length;
  let ans = numsLength;
  let left = 0;
  let right = numsLength - 1;
  while (left <= right) {
    // let mid = ((right - left) >> 1) + left;
    let mid = Math.floor((right + left) / 2);
    console.log("mid", mid);
    if (nums[mid] >= target) {
      ans = mid;
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }
  return ans;
};
console.log("结果", searchInsert([1, 3, 5, 6], 5));
