/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var setZeroes = function (matrix) {
  let n = matrix.length;
  let zeroArrayi = new Map();
  let zeroArrayj = new Map();
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 0) {
        if (!zeroArrayi.has(i)) {
          zeroArrayi.set(i, i);
        }
        if (!zeroArrayj.has(j)) {
          zeroArrayj.set(j, j);
        }
      }
    }
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      for (let [key, value] of zeroArrayj) {
        matrix[i][key] = 0;
      }
      for (let [key, value] of zeroArrayi) {
        matrix[key][j] = 0;
      }
    }
  }
};

setZeroes([
  [0, 1, 2, 0],
  [3, 4, 5, 2],
  [1, 3, 1, 5],
]);
