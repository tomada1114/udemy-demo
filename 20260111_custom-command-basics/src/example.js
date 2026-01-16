/**
 * 2つの数値を加算する
 * @param {number} a - 1つ目の数値
 * @param {number} b - 2つ目の数値
 * @returns {number} 合計値
 */
function add(a, b) {
  return a + b;
}

/**
 * 配列の最大値を返す
 * @param {number[]} numbers - 数値の配列
 * @returns {number} 最大値
 * @throws {Error} 空配列の場合
 */
function findMax(numbers) {
  if (numbers.length === 0) {
    throw new Error('配列が空です');
  }
  return Math.max(...numbers);
}

/**
 * 文字列を反転する
 * @param {string} str - 反転する文字列
 * @returns {string} 反転した文字列
 */
function reverseString(str) {
  return str.split('').reverse().join('');
}

module.exports = { add, findMax, reverseString };
