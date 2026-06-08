/**
 * ツイート URL から各種情報を抽出するユーティリティ。
 */

const TWEET_HOSTS = new Set([
  "twitter.com",
  "www.twitter.com",
  "mobile.twitter.com",
  "x.com",
  "www.x.com",
  "fxtwitter.com",
  "fixupx.com",
  "vxtwitter.com",
]);

export interface ParsedTweet {
  /** ツイート ID (数字列)。 */
  id: string;
  /** URL に含まれるスクリーンネーム (例: `jack`)。取得できない場合は null。 */
  screenName: string | null;
}

/**
 * 文字列がツイート URL であれば ID とスクリーンネームを返す。
 * ツイート URL でない場合は null を返す。
 */
export function parseTweetUrl(input: string): ParsedTweet | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase();
  if (!TWEET_HOSTS.has(host)) return null;

  // 想定パス: /{screen_name}/status/{id} もしくは /i/web/status/{id}
  const idMatch = url.pathname.match(/\/status(?:es)?\/(\d+)/i);
  if (!idMatch) return null;

  // 先頭セグメントをスクリーンネームとみなす (`i` の場合は不明として null)。
  const firstSegment = url.pathname.split("/").filter(Boolean)[0] ?? null;
  const screenName =
    firstSegment && firstSegment.toLowerCase() !== "i" ? firstSegment : null;

  return { id: idMatch[1], screenName };
}

/** 文字列に含まれる最初のツイート URL を抽出して解析する。 */
export function extractTweetFromText(text: string): ParsedTweet | null {
  const urlMatches = text.match(/https?:\/\/\S+/g);
  if (!urlMatches) return null;

  for (const candidate of urlMatches) {
    const parsed = parseTweetUrl(candidate);
    if (parsed) return parsed;
  }
  return null;
}
