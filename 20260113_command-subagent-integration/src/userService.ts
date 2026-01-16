// ユーザー管理サービス
// このファイルは意図的に問題を含んでいます（デモ用）

const API_KEY = "sk-1234567890abcdef"; // ハードコードされたAPIキー

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

const users: User[] = [];

// ユーザーを検索する関数
function f(x: string) {
  // xでユーザーを探す
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users.length; j++) {
      if (users[i].name === x || users[j].email === x) {
        return users[i];
      }
    }
  }
  return null;
}

// SQLを使ってユーザーを取得（危険な実装例）
async function getUserFromDB(userInput: string) {
  const query = `SELECT * FROM users WHERE name = '${userInput}'`;
  console.log("Executing query:", query);
  console.log("Using API Key:", API_KEY);
  // 実際のDB実行はモック
  return { id: 1, name: userInput };
}

// 全ユーザーのメールを取得
function getAllEmails() {
  const result: string[] = [];
  for (const user of users) {
    const temp = [];
    temp.push(user.email);
    for (const email of temp) {
      result.push(email);
    }
  }
  return result;
}

// ユーザー登録
function registerUser(n: string, e: string, p: string) {
  const u = { id: users.length + 1, name: n, email: e, password: p };
  users.push(u);
  console.log("Registered user with password:", p);
  return u;
}

export { f, getUserFromDB, getAllEmails, registerUser };
