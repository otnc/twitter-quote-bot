import { MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../types.js";
import { parseTweetUrl } from "../../utils/twitterUrl.js";
import { createQuoteAttachment } from "../../services/quoteFlow.js";
import { FxTwitterError } from "../../services/fxtwitter.js";
import { QuoteGenerationError } from "../../services/quote.js";

/** `/quote` — ツイート URL を引用画像に変換する。 */
export const quoteCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("quote")
    .setDescription("ツイートを引用画像に変換します。")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("引用したいツイートの URL")
        .setRequired(true)
    ),

  async execute(interaction) {
    const url = interaction.options.getString("url", true);

    const parsed = parseTweetUrl(url);
    if (!parsed) {
      await interaction.reply({
        content:
          "有効なツイート URL を指定してください (例: https://x.com/user/status/1234567890)。",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.deferReply();
    try {
      const { attachment } = await createQuoteAttachment(parsed.id);
      await interaction.editReply({ files: [attachment] });
    } catch (error) {
      const message =
        error instanceof FxTwitterError || error instanceof QuoteGenerationError
          ? error.message
          : "予期しないエラーが発生しました。しばらくしてから再度お試しください。";
      console.error("/quote の処理に失敗しました:", error);
      await interaction.editReply({ content: `⚠️ ${message}` });
    }
  },
};
