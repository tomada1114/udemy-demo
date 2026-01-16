// Prettierの設定違反サンプル

const message = "Hello World"    // ダブルクォート使用 & セミコロンなし

const user = {
    name: "John",     // インデント4スペース & ダブルクォート
    age: 30,
    email: "john@example.com"
}

function greet(name,age) {
  return "Hello, " + name + "! You are " + age + " years old."     // セミコロンなし
}

const veryLongVariableName = { firstName: "John", lastName: "Doe", email: "john.doe@example.com", phone: "123-456-7890", address: "123 Main Street" }

const items = [
    "apple",
    "banana",
    "orange"   // 末尾カンマなし
]

const calculate = (a,b,c) => {
    return a+b+c
}
