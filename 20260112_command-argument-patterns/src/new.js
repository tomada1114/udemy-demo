// ユーザー情報を取得する関数（新しいバージョン）
function getUser(id) {
  const users = [
    { id: 1, name: "田中", email: "tanaka@example.com" },
    { id: 2, name: "佐藤", email: "sato@example.com" },
    { id: 3, name: "鈴木", email: "suzuki@example.com" },
  ];
  return users.find((u) => u.id === id);
}

// ユーザー名を表示（エラーハンドリング追加）
function showUserName(id) {
  const user = getUser(id);
  if (!user) {
    console.log("ユーザーが見つかりません");
    return;
  }
  console.log(user.name);
}

// ユーザーのメールを取得（新機能）
function getUserEmail(id) {
  const user = getUser(id);
  return user?.email ?? null;
}

module.exports = { getUser, showUserName, getUserEmail };
