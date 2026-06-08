# Twitter Quote Bot

ツイートの URL を「Make it a Quote」風の画像に変換する Discord ボットです。
[FxTwitter (FxEmbed) API](https://docs.fxembed.com/api/twitter/) でツイートを取得し、
[makeitaquote](https://www.npmjs.com/package/makeitaquote) で画像を生成します。

## 機能

- `/help` — 使い方を表示します。
- `/quote url:<ツイートURL> [color:<true|false>]` — 指定したツイートを引用画像にします。
- `/setchannel [channel:<チャンネル>]` — ツイート URL を自動で画像化する監視チャンネルを
  サーバーごとに 1 つ設定します(`ManageGuild` 権限が必要)。
- 監視チャンネルにツイート URL が投稿されると、自動で引用画像を返信します。

## セットアップ

1. 依存関係をインストールします:

   ```bash
   npm install
   ```

2. `.env.example` をコピーして `.env` を作成し、値を設定します:

   ```conf
   DISCORD_ID=<アプリケーション (クライアント) ID>
   DISCORD_TOKEN=<ボットトークン>
   ```

3. Discord Developer Portal でボットの **MESSAGE CONTENT INTENT** を有効化します
   (チャンネル監視機能に必要です)。

## 実行

```bash
npm run build      # dist/ にビルド
npm run register   # スラッシュコマンドを Discord に登録 (初回 / コマンド変更時)
npm start          # ボットを起動
```

開発時は `npm run dev`(ビルドのウォッチ)を利用できます。

## 開発コマンド

```bash
npm test           # テストを実行 (vitest)
npm run check      # format:check + lint + typecheck をまとめて実行
npm run fix        # prettier --write + eslint --fix
```

## データの保存

`/setchannel` で設定した監視チャンネルは `data/channels.json` に
`{ "<guildId>": "<channelId>" }` 形式で保存されます(`data/` は Git 管理対象外)。

## ライセンス

Apache-2.0
