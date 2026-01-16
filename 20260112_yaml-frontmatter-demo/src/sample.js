// サンプルコード：レビュー対象
function greet(name) {
  console.log("Hello, " + name);
}

function add(a, b) {
  return a + b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error("ゼロで除算できません");
  }
  return a / b;
}

module.exports = { greet, add, divide };
