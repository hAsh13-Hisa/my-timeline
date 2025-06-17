# 私年表

ユーザーの生年月日を元に、同じ誕生日の有名人や人生の年表をAIが自動生成するWebアプリ

## 機能

- 生年月日の入力
- 同じ誕生日の有名人リスト表示（3-5名）
- 生まれ年から現在までの年表生成
- 誕生日と同じ日付の出来事を強調表示

## セットアップ

1. 依存関係をインストール
```bash
npm install
```

2. 環境変数を設定
`.env.local`ファイルを作成し、OpenAI APIキーを設定
```
OPENAI_API_KEY=your_api_key_here
```

3. 開発サーバーを起動
```bash
npm run dev
```

## Renderへのデプロイ

1. GitHubにプッシュ
2. Renderダッシュボードで新しいWebサービスを作成
3. GitHubリポジトリを接続
4. 環境変数`OPENAI_API_KEY`を設定
5. デプロイ

## 技術スタック

- Next.js 15
- TypeScript
- Tailwind CSS
- OpenAI API