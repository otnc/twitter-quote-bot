import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../types.js";

/** `/help` — 使い方を表示する。 */
export const helpCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("このボットの使い方を表示します。"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Twitter Quote Bot の使い方")
      .setColor(0x1d9bf0)
      .setDescription(
        "ツイートを「Make it a Quote」風の画像に変換するボットです。"
      )
      .addFields(
        {
          name: "/quote url:<ツイートURL> [color:<true|false>]",
          value:
            "指定したツイートを引用画像にします。`color` を `true` にすると背景に色が付きます。",
        },
        {
          name: "/setchannel [channel:<チャンネル>]",
          value:
            "ツイート URL を自動で画像化するチャンネルを設定します (サーバーごとに 1 つ)。省略時は実行したチャンネルが対象です。",
        },
        {
          name: "/help",
          value: "このヘルプを表示します。",
        }
      );

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
  },
};
