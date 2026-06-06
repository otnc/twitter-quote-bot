import { AttachmentBuilder } from "discord.js";
import { fetchTweet } from "./fxtwitter.js";
import { generateQuoteImage } from "./quote.js";

/**
 * ツイート ID から引用画像を生成し、Discord 添付ファイルを組み立てる。
 * fetchTweet / generateQuoteImage の例外はそのまま呼び出し元へ伝播する。
 */
export async function createQuoteAttachment(
  tweetId: string
): Promise<{ attachment: AttachmentBuilder; sourceUrl: string }> {
  const tweet = await fetchTweet(tweetId);
  const image = await generateQuoteImage(tweet);
  const attachment = new AttachmentBuilder(image, {
    name: `quote-${tweet.id}.png`,
  });
  return { attachment, sourceUrl: tweet.url };
}
