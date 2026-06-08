/**
 * 環境変数の読み込みと検証。
 * Node.js v24 では `--env-file=.env` または `process.loadEnvFile()` で
 * `.env` を読み込めるため、外部ライブラリには依存しない。
 */

export interface Env {
  discordId: string;
  discordToken: string;
}

/** `.env` が存在すれば読み込む。存在しない場合は環境変数をそのまま使う。 */
function loadDotEnv(): void {
  try {
    process.loadEnvFile();
  } catch {
    // `.env` が無い場合は無視し、OS の環境変数のみを利用する。
  }
}

/**
 * 必須の環境変数を検証して返す。
 * @throws {Error} 必須変数が未設定の場合。
 */
export function loadEnv(): Env {
  loadDotEnv();

  const discordId = process.env.DISCORD_ID;
  const discordToken = process.env.DISCORD_TOKEN;

  const missing: string[] = [];
  if (!discordId) missing.push("DISCORD_ID");
  if (!discordToken) missing.push("DISCORD_TOKEN");

  if (missing.length > 0) {
    throw new Error(
      `必須の環境変数が設定されていません: ${missing.join(", ")}。.env を確認してください。`
    );
  }

  return { discordId: discordId!, discordToken: discordToken! };
}
