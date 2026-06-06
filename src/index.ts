import { Events } from "discord.js";
import { loadEnv } from "./config/env.js";
import { createClient } from "./discord/client.js";
import { ChannelStore } from "./services/channelStore.js";
import { handleInteraction } from "./discord/events/interactionCreate.js";
import { handleMessage } from "./discord/events/messageCreate.js";
import type { BotContext } from "./types.js";

/** ボットを起動する。 */
async function main(): Promise<void> {
  const env = loadEnv();

  const channelStore = new ChannelStore();
  await channelStore.load();
  const ctx: BotContext = { channelStore };

  const client = createClient();

  client.once(Events.ClientReady, (ready) => {
    console.log(`✅ ${ready.user.tag} としてログインしました。`);
  });

  client.on(Events.InteractionCreate, (interaction) => {
    void handleInteraction(interaction, ctx);
  });

  client.on(Events.MessageCreate, (message) => {
    void handleMessage(message, ctx);
  });

  client.on(Events.Error, (error) => {
    console.error("Discord クライアントでエラーが発生しました:", error);
  });

  await client.login(env.discordToken);
}

main().catch((error) => {
  console.error("ボットの起動に失敗しました:", error);
  process.exitCode = 1;
});
