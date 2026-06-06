import { type Interaction, MessageFlags } from "discord.js";
import { commandMap } from "../commands/index.js";
import type { BotContext } from "../../types.js";

/** スラッシュコマンドの実行を振り分ける。 */
export async function handleInteraction(
  interaction: Interaction,
  ctx: BotContext
): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  const command = commandMap.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, ctx);
  } catch (error) {
    console.error(
      `コマンド /${interaction.commandName} の実行中にエラーが発生しました:`,
      error
    );
    const content = "⚠️ コマンドの実行中にエラーが発生しました。";
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content }).catch(() => {});
    } else {
      await interaction
        .reply({ content, flags: MessageFlags.Ephemeral })
        .catch(() => {});
    }
  }
}
