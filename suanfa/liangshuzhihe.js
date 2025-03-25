// 两数之和
// 1.暴力for循环
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (nums, target) {
  for (i = 0; i < nums.length; i++) {
    for (j = i + 1; j < nums.length; j++) {
      if (target - nums[i] == nums[j]) {
        return [i, j];
      }
    }
  }
};
console.log("结果1", twoSum([2, 7, 11, 15], 9));
// 哈希表
var twoSum1 = function (nums, target) {};
console.log("结果2", twoSum([2, 7, 11, 15], 9));
