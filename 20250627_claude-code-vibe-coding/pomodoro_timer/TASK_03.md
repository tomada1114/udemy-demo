# 作りたいアプリのイメージ

一画面のポモドーロタイマー

# 必要な要素

- 作業時間と休憩時間を分と秒で設定できる
- リセットできる
- 作業と休憩終了時に音が鳴る

- レスポンシブデザイン
- スムーズなアニメーション
- モダンでスタイリッシュなデザイン

# 制約事項

- Reactを使う
- Tailwind CSS を使う
- shadcn をできるだけ使う
- ダークモード対応を必須とし、ライトモード・ダークモード両方で視認性の高いUIを実現すること

- データベースは使わないこと
- Core Web Vitals を意識し、見やすく使いやすい UI/UX 設計にすること

# 実装の流れ（固定）

1. 既存の実装を把握する
2. ESLint をセットアップする
3. テストをセットアップする
4. 設計を行う
5. 先に要件を満たすテストを書く
6. 実装する
7. リファクタリングを行う
8. すべての品質チェックがパスすることを確認する
9. README.md に仕様をまとめる

# 注意点

- ファイル内コメントなどはすべて日本語を使用する

# 命令

上記のタスクを進めてください。

# プロジェクトセットアップでの詰まりポイント・対処法

## Tailwind CSS 4.x系の設定問題

### 問題
- CSSが正しく適用されず、スタイリングが崩れる状態が発生
- 従来のTailwind CSS 3.x系の設定方法では動作しない

### 原因
- Tailwind CSS 4.x系では設定方法が大幅に変更された
- package.jsonに`@tailwindcss/postcss: 4.1.11`と`tailwindcss: 4.1.11`が混在
- 従来の`postcss.config.js`による設定が適用されない

### 解決手順
1. **正しい依存関係をインストール**
   ```bash
   npm install @tailwindcss/vite
   ```

2. **vite.config.tsにプラグインを追加**
   ```typescript
   import tailwindcss from '@tailwindcss/vite'
   
   export default defineConfig({
     plugins: [react(), tailwindcss()],
   })
   ```

3. **CSS importを4.x系形式に変更**
   ```css
   // 旧形式（3.x系）
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   
   // 新形式（4.x系）
   @import "tailwindcss";
   ```

4. **不要ファイルを削除**
   - `postcss.config.js` を削除（4.x系では不要）
   - `tailwind.config.js`から不要なsafelistを削除

### 学習ポイント
- **公式ドキュメントの確認が重要**: https://tailwindcss.com/docs/installation/using-vite
- **メジャーバージョンアップでは設定方法が変更される可能性が高い**
- **package.jsonの依存関係とドキュメントの整合性確認が必要**
- **ビルドが成功してもスタイリングが適用されない場合は設定問題の可能性**

### 対処時間
約30分（調査・修正・検証含む）

### 予防策
- プロジェクト開始時に最新ドキュメントを確認
- 依存関係のバージョンと設定方法の対応関係を把握
- CSSが適用されない場合は設定ファイルを最初に疑う
