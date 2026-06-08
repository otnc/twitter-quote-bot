import { Client, GatewayIntentBits, Partials } from "discord.js";

/**
 * Discord クライアントを生成する。
 * MessageContent はメッセージ本文を読むための特権インテント。
 * (Developer Portal で有効化が必要)
 */
export function createClient(): Client {
  return new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
  });
}
