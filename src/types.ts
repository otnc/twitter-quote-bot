import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import type { ChannelStore } from "./services/channelStore.js";

/** コマンド実行時に共有されるアプリケーションのコンテキスト。 */
export interface BotContext {
  channelStore: ChannelStore;
}

/** スラッシュコマンドのビルダー型。 */
export type CommandData = SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;

/** スラッシュコマンドの定義。 */
export interface Command {
  data: CommandData;
  execute(
    interaction: ChatInputCommandInteraction,
    ctx: BotContext
  ): Promise<void>;
}
