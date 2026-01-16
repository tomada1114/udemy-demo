# rules-demo

.claude/rules/ の動的読み込みを確認するデモプロジェクト

## 構造

```
rules-demo/
├── .claude/rules/
│   ├── code-style.md          # pathsなし → 常に読み込み
│   ├── api.md                 # paths: src/api/**
│   ├── testing.md             # paths: tests/**/*.test.{ts,tsx}
│   └── frontend/
│       └── react.md           # paths: src/components/**
├── src/
│   ├── components/
│   │   └── Button.tsx         # → react.md がロード
│   └── api/
│       └── users.ts           # → api.md がロード
└── tests/
    └── button.test.tsx        # → testing.md がロード
```

## 確認方法

1. このディレクトリで Claude Code を起動
   ```
   cd ~/Desktop/rules-demo
   claude
   ```

2. /memory で常時読み込みルールを確認
   ```
   /memory
   → code-style.md が表示される
   ```

3. ファイルを読み込んで動的ロードを確認
   ```
   @src/components/Button.tsx を読んで
   → ログに .claude/rules/frontend/react.md が表示される
   ```

4. 別のファイルを読み込む
   ```
   @src/api/users.ts を読んで
   → ログに .claude/rules/api.md が表示される
   ```

5. Globパターン（ブレース展開）を確認
   ```
   @tests/button.test.tsx を読んで
   → ログに .claude/rules/testing.md が表示される
   ```
