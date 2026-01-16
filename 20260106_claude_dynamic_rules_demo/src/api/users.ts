// このファイルを読み込むと api.md が動的ロードされる

export async function getUsers() {
  const response = await fetch('/api/users');
  return response.json();
}

export async function createUser(data: { name: string }) {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}
