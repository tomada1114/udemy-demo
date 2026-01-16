// ユーザー情報を取得する関数（リファクタリング後）
function getUser(id) {
  return database.find(u => u.id === id) ?? null;
}

// 全ユーザーを取得（フィルタリング対応）
function getAllUsers(filter = null) {
  if (!filter) {
    return database;
  }
  return database.filter(filter);
}

// IDでユーザーが存在するか確認
function hasUser(id) {
  return database.some(u => u.id === id);
}

module.exports = { getUser, getAllUsers, hasUser };
