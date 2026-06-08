import { MiQ } from "makeitaquote";
import type { FxTweet } from "./fxtwitter.js";
import { fetchImageAsDataUri } from "../utils/image.js";

/** アバターを取得できなかった場合に使う Discord のデフォルトアバター。 */
const FALLBACK_AVATAR = "https://cdn.discordapp.com/embed/avatars/0.png";

/** 引用画像の生成に失敗した場合のエラー。 */
export class QuoteGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuoteGenerationError";
  }
}

/**
 * アバター URL を Voids API が受け付ける形式に解決する。
 * Twitter のアバター URL は拒否されるため data URI に変換し、
 * 取得に失敗した場合は Discord のデフォルトアバターにフォールバックする。
 */
async function resolveAvatar(url: string | null): Promise<string> {
  if (!url) return FALLBACK_AVATAR;
  try {
    return await fetchImageAsDataUri(url);
  } catch {
    return FALLBACK_AVATAR;
  }
}

/**
 * FxTwitter のツイート情報から「Make it a Quote」風の画像を生成する。
 * @param tweet FxTwitter API から取得したツイート。
 * @returns 生成された画像の Buffer。
 * @throws {QuoteGenerationError} 画像生成に失敗した場合。
 */
export async function generateQuoteImage(tweet: FxTweet): Promise<Buffer> {
  try {
    const avatar = await resolveAvatar(tweet.author.avatar_url);
    const miq = new MiQ()
      .setText(tweet.text)
      .setAvatar(avatar)
      // username には `@` を付けない (API 側で `@` が付与されるため)。
      .setUsername(tweet.author.screen_name)
      .setDisplayname(tweet.author.name)
      // Voids API は color が falsy だとエラーになるため常に true を渡す。
      .setColor(true)
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
