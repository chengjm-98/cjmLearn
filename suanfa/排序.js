/*
 * @Author: jamie jamie.cheng@yuansuan.com
 * @Date: 2024-11-03 17:08:06
 * @LastEditors: jamie jamie.cheng@yuansuan.com
 * @LastEditTime: 2024-11-05 18:11:14
 * @FilePath: \learn\suanfa\排序.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 直接插入算法
function insertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    let temp = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > temp) {
      //j是用于循环已经排好序的数组
      //将比目标值temp的值向后移动一位
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = temp;
  }
  return array;
}
//折半插入排序
//从大到小排序
function binaryInsertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let temp = arr[i];
    let left = 0;
    let right = i - 1;
    while (left <= right) {
      let mid = Math.floor((left + right) / 2); //取中间位置
      if (arr[mid] > temp) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    for (let j = i - 1; j >= left; j--) {
      arr[j + 1] = arr[j]; //向右挪一位
    }
    arr[left] = temp;
  }
  return arr;
}
// 示例
// const array = [5, 2, 9, 1, 5, 6];
// console.log(binaryInsertionSort(array)); // 输出: [1, 2, 5, 5, 6, 9]
//希尔排序
// function shellSort(arr) {
//   let n = arr.length;
//   // 初始间隔为数组长度的一半
//   let gap = Math.floor(n / 2);
//   // 不断缩小间隔
//   while (gap > 0) {
//     console.log("gap", gap);
//     // 针对每个间隔进行插入排序
//     for (let i = gap; i < n; i++) {
//       let key = arr[i];
//       let j = i;
//       console.log("key", key);
//       // 将大于 key 的元素向右移动
//       while (j >= gap && arr[j - gap] > key) {
//         console.log("要交换的值", arr[j], arr[j - gap]);
//         console.log("要交换的索引j", j, "j-gap", j - gap);
//         arr[j] = arr[j - gap];
//         j -= gap;
//         console.log("交换之后的j", j, arr);
//       }
//       arr[j] = key; // 插入 key
//       console.log("arr单次一次变化", arr);
//     }
//     console.log("arr完整一次变化", arr);
//     // 缩小间隔
//     gap = Math.floor(gap / 2);
//   }
//   return arr;
// }

function shellSort(arr) {
  const n = arr.length;
  let gap = Math.floor(n / 2);
  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      let j = i;
      let temp = arr[i];
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j = j - gap;
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }
  return arr;
}
// 示例
// const array = [7, 6, 9, 3, 1, 5, 2, 4];

// console.log(shellSort(array)); //[ 1, 2, 3, 4, 5, 6, 7, 9]

//冒泡排序
function maopao(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    //外层循环控制遍历次数
    for (let j = 0; j < arr.length - 1 - i; j++) {
      //内村循环进行相邻数字的比较
      if (arr[j + 1] < arr[j]) [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
    }
  }
  return arr;
}
// const array = [7, 6, 9, 3, 1, 5, 2, 4];

// console.log("maopao", maopao(array));

//递归
function partition(arr, left, right) {
  let privotNum = arr[left]; //基准
  while (left < right) {
    while (left < right && arr[right] >= privotNum) {
      right--;
    }
    arr[left] = arr[right];
    while (left < right && arr[left] <= privotNum) {
      left++;
    }
    arr[right] = arr[left];
  }
  //得到privotNum的正确位置
  arr[left] = privotNum;
  return left;
}
function quickSort(arr, left, right) {
  if (left < right) {
    let privot = partition(arr, left, right);
    quickSort(arr, left, privot - 1);
    quickSort(arr, privot + 1, right);
  }
  return arr;
}
// 示例
const array = [5, 2, 9, 1, 5, 6];
quickSort(array, 0, array.length - 1);
console.log(quickSort(array, 0, array.length - 1)); // 输出: [1, 2, 5, 5, 6, 9]
