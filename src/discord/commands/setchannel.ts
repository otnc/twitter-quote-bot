import {
  ChannelType,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import type { Command } from "../../types.js";

/** `/setchannel` — ツイート URL を自動画像化するチャンネルを設定する。 */
export const setChannelCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription("ツイート URL を自動で画像化するチャンネルを設定します。")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("対象チャンネル (省略時は実行したチャンネル)")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),

  async execute(interaction, ctx) {
    if (!interaction.inGuild()) {
      await interaction.reply({
        content: "このコマンドはサーバー内でのみ使用できます。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const channel =
      interaction.options.getChannel("channel") ?? interaction.channel;
    if (!channel || channel.type !== ChannelType.GuildText) {
      await interaction.reply({
        content: "テキストチャンネルを指定してください。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    try {
      await ctx.channelStore.set(interaction.guildId, channel.id);
      await interaction.reply({
        content: `✅ 監視チャンネルを <#${channel.id}> に設定しました。このチャンネルにツイート URL が貼られると自動で画像化します。`,
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error("/setchannel の保存に失敗しました:", error);
      await interaction.reply({
        content:
          "⚠️ 設定の保存に失敗しました。時間をおいて再度お試しください。",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
