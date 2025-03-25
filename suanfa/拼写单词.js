/*
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2024-10-24 10:45:00
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2024-10-24 14:16:32
 * @FilePath: \learn\suanfa\拼写单词.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @param {string[]} words
 * @param {string} chars
 * @return {number}
 */
// var countCharacters = function (words, chars) {
//   let charsMap = new Map();
//   for (i = 0; i < chars.length; i++) {
//     if (!charsMap.has(chars[i])) {
//       charsMap.set(chars[i], 0);
//     }
//   }
//   console.log("charsMap", charsMap);
//   let num = 0;
//   let flag = true;
//   for (i = 0; i < words.length; i++) {
//     for (j = 0; j < words[i].length; j++) {
//       flag = true;
//       console.log("字符串遍历", words[i][j]);
//       if (charsMap.has(words[i][j]) && charsMap.get(words[i][j]) < i) {
//         charsMap.set(words[i][j], i);
//       } else {
//         flag = false;
//         break;
//       }
//     }
//     if (flag) {
//       console.log("length", i, words[i].length, words[i], charsMap);
//       num += words[i].length;
//     }
//   }
//   return num;
// };
/**
 * @param {string[]} words
 * @param {string} chars
 * @return {number}
 */
// var countCharacters = function (words, chars) {
//   //存每个单词的个数
//   let charsMap = new Map();
//   for (i = 0; i < chars.length; i++) {
//     if (!charsMap.has(chars[i])) {
//       charsMap.set(chars[i], 1);
//     } else {
//       charsMap.set(chars[i], charsMap.get(chars[i]) + 1);
//     }
//   }
//   let num = 0;
//   let flag = true;
//   for (i = 0; i < words.length; i++) {
//     let tempMap = new Map(charsMap); // 使用副本检查每个单词
//     console.log("MAP", tempMap);
//     for (j = 0; j < words[i].length; j++) {
//       flag = true;
//       console.log("字符串遍历", words[i][j]);
//       if (tempMap.has(words[i][j]) && tempMap.get(words[i][j]) > 0) {
//         tempMap.set(words[i][j], tempMap.get(words[i][j]) - 1);
//       } else if (!tempMap.has(words[i][j]) && tempMap.get("?") > 0) {
//         tempMap.set("?", tempMap.get("?") - 1);
//       } else {
//         flag = false;
//         break;
//       }
//     }
//     if (flag) {
//       console.log("length", flag, words[i].length, words[i]);
//       num += 1;
//     }
//   }
//   return num;
// };
var countCharacters = function (words, chars) {
  var wordCount = 0;
  for (var i = 0; i < words.length; i++) {
    var isok = true;
    var word = words[i];
    let charsTemp = Array.from(chars);
    for (var j = 0; j < word.length; j++) {
      console.log("字符串遍历", words[i][j]);
      var char = word[j];
      if (charsTemp.indexOf(char) > -1) {
        charsTemp.splice(charsTemp.indexOf(char), 1);
      } else if (charsTemp.indexOf("?") > -1) {
        charsTemp.splice(charsTemp.indexOf("?"), 1);
      } else {
        isok = false;
        break;
      }
    }
    console.log("charsTemp", charsTemp);
    if (isok) {
      console.log("匹配", word);
      wordCount++;
    }
  }
  return wordCount;
};
console.log(
  "结果",
  countCharacters(["apple", "car", "window"], "welldoneapplec?")
);
