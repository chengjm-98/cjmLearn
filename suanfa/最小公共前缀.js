/*
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2024-10-22 18:47:55
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2024-10-25 11:51:05
 * @FilePath: \learn\suanfa\minSonString.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @param {string[]} strs
 * @return {string}
 */
// var longestCommonPrefix = function (strs) {
//   let minLenght = Number.MAX_SAFE_INTEGER; //初始化一个最大值
//   for (i = 0; i < strs.length; i++) {
//     minLenght = Math.min(minLenght, strs[i].length);
//   }
//   console.log("minLenght", minLenght);
//   let sameLength = 0;
//   for (i = 0; i < minLenght; i++) {
//     for(j=1;j<strs.length;j++){
//         console.log("strs[0][i]", strs[0][i]);
//         console.log("item[i]",strs[j][i]);
//         if (strs[0][i] != strs[j][i]) {
//           return getString(sameLength, strs[0]);
//         }
//     }
//     sameLength++;
//   }
//   return getString(sameLength, strs[0]);
// };
// function getString(length, stringTemp) {
//   return stringTemp.substr(0, length);
// }

var longestCommonPrefix = function (strs) {
  if (strs.length == 0) return "";
  let ans = strs[0]; //随便取一个
  for (let i = 1; i < strs.length; i++) {
    let j = 0;
    for (; j < ans.length && j < strs[i].length; j++) {
      console.log("字符串遍历", ans[j], strs[i][j]);
      if (ans[j] != strs[i][j]) {
        break;
      }
    }
    ans = ans.substr(0, j);
    if (ans === "") return ans;
  }
  return ans;
};

console.log(longestCommonPrefix(["ab", "a"]));
