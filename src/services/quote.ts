import { MiQ } from "makeitaquote";
import type { FxTweet } from "./fxtwitter.js";

/** 引用画像の生成に失敗した場合のエラー。 */
export class QuoteGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuoteGenerationError";
  }
}

/**
 * FxTwitter のツイート情報から「Make it a Quote」風の画像を生成する。
 * @param tweet  FxTwitter API から取得したツイート。
 * @param color  背景に色を付けるかどうか。
 * @returns 生成された画像の Buffer。
 * @throws {QuoteGenerationError} 画像生成に失敗した場合。
 */
export async function generateQuoteImage(
  tweet: FxTweet,
  color = false
): Promise<Buffer> {
  try {
    const miq = new MiQ()
      .setText(tweet.text)
      .setAvatar(tweet.author.avatar_url)
      .setUsername(`@${tweet.author.screen_name}`)
      .setDisplayname(tweet.author.name)
      .setColor(color)
      .setWatermark("Twitter Quote Bot");

    // returnRawImage = true で Buffer を取得する。
    const result = await miq.generate(true);
    if (!Buffer.isBuffer(result)) {
      throw new QuoteGenerationError("画像データを取得できませんでした。");
    }
    return result;
  } catch (error) {
    if (error instanceof QuoteGenerationError) throw error;
    const reason = error instanceof Error ? error.message : String(error);
    throw new QuoteGenerationError(`引用画像の生成に失敗しました: ${reason}`);
  }
}
