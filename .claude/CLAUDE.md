# Twitter Quote Bot

TwitterのツイートURLを `/quote` スラッシュコマンドで読み込ませ、Make it a Quote風の画像にするツールを作成する。

## 実装

- Discord
  - Slash Commands
    - `/help`
      - 使い方
    - `/quote`
      - FxTwitter API で取得したツイート本文とユーザーネーム、ユーザーID、ユーザープロフィール画像を `makeitaquote` に渡して引用画像化
    - `/setchannel`
      - サーバーごとに1チャンネル指定可能
      - [x] 保存方法などは検討 (検討して確定したのちに下に追記、チェックを入れる)
        - `data/channels.json` への JSON 永続化 (`{ [guildId]: channelId }` 形式)。外部DB不要・軽量。実装は `src/services/channelStore.ts`。`data/` は `.gitignore` 対象。
  - Channel
    - `/setchannel` で指定したチャンネルにツイートURLが貼り付けられたらそれに `/quote` と同じように画像を生成しリプライ
- Code
  - ネットワークエラーやAPIエラーの場合なども考慮し、例外処理を実装する。 (`try-catch`)
  - 例外処理の場合はその旨をコンソールやDiscordのレスポンスにする。

## 規約

- `tsconfig.json` および `tsdown.config.ts` に従ったTypeScriptのコードで記述すること。
- `prettier` および `eslint` / `eslint-config-prettier` に従ったTypeScriptのコードで記述すること。
  - [x] Prettier with ESLint 用の設定(configファイルや必要パッケージのインストール等)を済ませる。(完了したらチェックを入れる)
  - [x] `package.json` の `scripts` の `lint` / `lint:fix` を作成すること。(完了したらチェックを入れる)
- 実装は `src/**` にまとめること。
- 一つのファイルが肥大化しないようにファイル分けすること。一つのファイルあたり150行以内に収まることが望ましい。
- テストを作成すること。(`tests/**`)
- Git
  - 書き込み操作は確認を取ること
  - `force-push` とそれに準ずる破壊的な行為の禁止
  - `main` を直接書き込まないこと。
  - ブランチ名は以下の方式にする。作業ブランチを作成する際は開発ブランチをもとにして作成し、Pull Requestも開発ブランチに向ける。作業ブランチの属性が少なかった来夏のリストに追記してもよい。
    - 本番ブランチ: `main`
    - 開発ブランチ: `develop`
    - 作業ブランチ:
      - 実装: `feat/*`
      - 修正: `fix/*`
  - GitHub CLI ( `gh` )
    - GitHubから読み取る際に積極的に利用してよい。
    - Pull RequestやIssue、Commentの書き込みは許可を得てから行う。
  - コード編集した場合、 `package.json` 内の `scripts` にあるコマンドの `check` で違反がないかを確かめる。

## 使用技術・外部API

以下のスタックとAPIを使用する。バージョンは `package.json` を参照。

```
Node.js v24
npm v11
```

- Dependencies
  - discord.js
  - ky
  - makeitaquote
- DevDependencies
  - @eslint/js
  - @types/node
  - eslint
  - eslint-config-prettier
  - globals
  - prettier
  - tsdown
  - typescript
  - typescript-eslint
  - vitest

その他必要なライブラリ(型定義用やその他)も適宜追加してよい。ただし、追加したのちに上のリストにa-z順に従いながらパッケージ名を挿入すること。

- API
  - FxTwitter API
    - https://docs.fxembed.com/api/twitter/
    - https://docs.fxembed.com/api/twitter/operations/2statusid/
    - https://docs.fxembed.com/api/twitter/operations/2profilehandle/

## ファイル・フォルダ構造

```tree
/
  dist/
    <built files>
  src/
    <files>
  tests/
    <test files>
  .env
  .gitignore
  .nvmrc
  LICENSE
  package-lock.json
  package.json
  README.md
  tsconfig.json
  tsdown.config.ts
```

`.env`

```conf
DISCORD_ID=<DISCORD_ID>
DISCORD_TOKEN=<DISCORD_TOKEN>
```
