// ユーザー情報を取得する関数（古いバージョン）
function getUser(id) {
  const users = [
    { id: 1, name: "田中" },
    { id: 2, name: "佐藤" },
  ];
  return users.find((u) => u.id === id);
}

// ユーザー名を表示
function showUserName(id) {
  const user = getUser(id);
  console.log(user.name);
}

module.exports = { getUser, showUserName };
