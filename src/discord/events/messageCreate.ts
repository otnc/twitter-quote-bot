import type { Message } from "discord.js";
import type { BotContext } from "../../types.js";
import { extractTweetFromText } from "../../utils/twitterUrl.js";
import { createQuoteAttachment } from "../../services/quoteFlow.js";
import { FxTwitterError } from "../../services/fxtwitter.js";
import { QuoteGenerationError } from "../../services/quote.js";

/**
 * 設定済みチャンネルにツイート URL が投稿されたら、自動で引用画像を返信する。
 */
export async function handleMessage(
  message: Message,
  ctx: BotContext
): Promise<void> {
  if (message.author.bot || !message.inGuild()) return;

  const targetChannelId = ctx.channelStore.get(message.guildId);
  if (!targetChannelId || message.channelId !== targetChannelId) return;

  const parsed = extractTweetFromText(message.content);
  if (!parsed) return;

  try {
    const { attachment } = await createQuoteAttachment(parsed.id);
    await message.reply({ files: [attachment] });
  } catch (error) {
    const reason =
      error instanceof FxTwitterError || error instanceof QuoteGenerationError
        ? error.message
        : "引用画像の生成に失敗しました。";
    console.error("自動引用の処理に失敗しました:", error);
    await message.reply({ content: `⚠️ ${reason}` }).catch(() => {});
  }
}
