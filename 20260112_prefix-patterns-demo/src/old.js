// ユーザー情報を取得する関数（リファクタリング前）
function getUser(id) {
  const user = database.find(u => u.id === id);
  if (user) {
    return user;
  } else {
    return null;
  }
}

// 全ユーザーを取得
function getAllUsers() {
  return database;
}

module.exports = { getUser, getAllUsers };
