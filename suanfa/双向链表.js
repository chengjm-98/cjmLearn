/*
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2024-10-25 15:05:39
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2024-11-01 11:49:33
 * @FilePath: \learn\suanfa\数组排序.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// var isPalindrome = function (x) {
//   if (x < 0) {
//     return false;
//   }
//   let stringTemp = Math.abs(x).toString();
//   for (let i = 0; i < Math.floor(stringTemp.length / 2); i++) {
//     if (stringTemp[i] != stringTemp[stringTemp.length - i - 1]) {
//       return false;
//     }
//   }
//   return true;
// };

// var isPalindrome=function(x){
//   if(x<0){
//    return false;
//   }
//     let left = 0;  //左指针
//     let right = x.toString().length-1; //右指针
//     while(left<right){
//       if(x.toString()[left]!=x.toString()[right]){
//         return false;
//       }
//       left++;
//       right--;
//     }
//     return true;
//   }
// console.log("121", isPalindrome(121));
// console.log("-121", isPalindrome(-121));
// console.log("100000001", isPalindrome(100000001));

/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function (nums1, m, nums2, n) {
  let p1 = 0;
  let p2 = 0;
  let resultArray = new Array(m + n).fill(0); //新建一个新的m+n数组
  let cur;
  while (p1 < m || p2 < n) {
    if (p1 === m) {
      //nums1遍历结束了
      cur = nums2[p2];
      p2++;
    } else if (p2 === n) {
      cur = nums1[p1];
      p1++;
    } else if (nums1[p1] <= nums2[p2]) {
      cur = nums1[p1];
      p1++;
    } else {
      cur = nums2[p2];
      p2++;
    }
    resultArray[p1 + p2 - 1] = cur;
  }
  for (let i = 0; i != m + n; ++i) {
    nums1[i] = resultArray[i];
  }
  return nums1;
};
// var merge = function (nums1, m, nums2, n) {
//   let p1 = 0,
//     p2 = 0;
//   const sorted = new Array(m + n).fill(0);
//   var cur;
//   while (p1 < m || p2 < n) {
//     if (p1 === m) {
//       cur = nums2[p2++];
//     } else if (p2 === n) {
//       cur = nums1[p1++];
//     } else if (nums1[p1] < nums2[p2]) {
//       cur = nums1[p1++];
//     } else {
//       cur = nums2[p2++];
//     }
//     sorted[p1 + p2 - 1] = cur;
//   }
//   for (let i = 0; i != m + n; ++i) {
//     nums1[i] = sorted[i];
//   }
//   return nums1;
// };

console.log("merge", merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3));
