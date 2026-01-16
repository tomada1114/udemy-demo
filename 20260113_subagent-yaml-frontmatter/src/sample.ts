// サンプルコード（レビュー対象）

const apiKey = "sk-1234567890abcdef"; // 機密情報の露出例

function f(x: any) {
  // 不明確な命名の例
  return x * 2;
}

async function fetchData() {
  // エラーハンドリングなしの例
  const res = await fetch("/api/data");
  return res.json();
}

export { f, fetchData };
