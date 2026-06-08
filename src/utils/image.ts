import ky from "ky";

/**
 * 画像 URL を取得し、`data:` URI (base64) 形式の文字列に変換する。
 *
 * Voids API (makeitaquote のバックエンド) はアバターに Discord の CDN URL か
 * `data:` URI しか受け付けないため、Twitter のアバター URL はそのまま渡せない。
 * そこで一度ダウンロードして data URI に変換する。
 *
 * @throws {Error} 画像の取得に失敗した場合。
 */
export async function fetchImageAsDataUri(url: string): Promise<string> {
  const response = await ky.get(url, { timeout: 10_000, retry: 1 });
  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const base64 = Buffer.from(await response.arrayBuffer()).toString("base64");
  return `data:${contentType};base64,${base64}`;
}
