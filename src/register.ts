import { REST, Routes } from "discord.js";
import { loadEnv } from "./config/env.js";
import { commands } from "./discord/commands/index.js";

/**
 * スラッシュコマンドを Discord に登録するスクリプト。
 * `npm run register` で実行する。
 */
async function main(): Promise<void> {
  const env = loadEnv();
  const rest = new REST({ version: "10" }).setToken(env.discordToken);
  const body = commands.map((command) => command.data.toJSON());

  console.log(`${body.length} 件のスラッシュコマンドを登録しています...`);
  await rest.put(Routes.applicationCommands(env.discordId), { body });
  console.log("✅ スラッシュコマンドの登録が完了しました。");
}

main().catch((error) => {
  console.error("スラッシュコマンドの登録に失敗しました:", error);
  process.exitCode = 1;
});
