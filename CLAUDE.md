# Laboratory - Binary Heap Visualizer

React + TypeScript + Viteで構築されたバイナリヒープの可視化・学習アプリケーション。Cloudflare Workersでホスティング。

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # ビルド（TypeScriptコンパイル + Viteビルド）
npm run lint     # ESLintでコード品質チェック
npm run preview  # ビルド結果のプレビュー
npm run deploy   # Cloudflareへデプロイ
```

### コード品質チェック
```bash
# 型チェック
npx tsc --noEmit

# Biomeでのフォーマット・リント
npx biome check .
npx biome check --write .  # 自動修正
```

## 技術スタック

- **フロントエンド**: React 19 + TypeScript + Vite
- **UI**: Lucide React (アイコン)
- **ホスティング**: Cloudflare Workers
- **リント**: ESLint + Biome
- **型チェック**: TypeScript 5.8

## プロジェクト構造

```
src/
├── components/
│   ├── heap/           # ヒープ関連コンポーネント
│   └── ui/             # 汎用UIコンポーネント
├── hooks/              # カスタムフック
├── types/              # 型定義
├── utils/              # ユーティリティ関数
└── main.tsx           # エントリーポイント
```

## 開発方針

### テスト駆動開発 (TDD)
t-wadaの提唱するTDDサイクルを実践：
1. **Red**: 失敗するテストを先に書く
2. **Green**: テストを通す最小限のコードを書く
3. **Refactor**: コードを改善し、テストが通ることを確認

### 低結合高凝集の設計
- **低結合**: モジュール間の依存関係を最小限に
- **高凝集**: 関連する機能を同じモジュール内にまとめる
- コンポーネントは単一責任を持つ
- 依存関係の注入でテスタビリティを向上

### 関数型ドメインモデリング
- **イミュータブルデータ**: 状態変更は新しいオブジェクト生成で
- **純粋関数**: 副作用のない関数を基本とする
- **型安全性**: TypeScriptの型システムを活用
- **ドメインロジック**: ビジネスルールを型とpure functionで表現

## 実装指針

### コンポーネント設計
```typescript
// ❌ 避けるべき: 複数の責任を持つコンポーネント
// ✅ 推奨: 単一責任のコンポーネント分割
```

### 状態管理
```typescript
// ❌ 避けるべき: 直接的な状態変更
setState(state.items.push(item))

// ✅ 推奨: イミュータブルな更新
setState(prevState => ({
  ...prevState,
  items: [...prevState.items, item]
}))
```

### ドメインモデル
```typescript
// ✅ 型でドメインルールを表現
type HeapNode = {
  readonly value: number
  readonly index: number
}

// ✅ 純粋関数でビジネスロジック
const insertToHeap = (heap: readonly HeapNode[], value: number): readonly HeapNode[] => {
  // イミュータブルな操作
}
```

## 主要機能

- バイナリヒープの可視化
- インタラクティブな要素の挿入・削除
- ヒープソートのステップ実行
- アニメーション付きの操作表示

## 型定義

主要な型は `src/types/heap.ts` で定義。ドメインルールを型レベルで表現し、コンパイル時に制約を保証。