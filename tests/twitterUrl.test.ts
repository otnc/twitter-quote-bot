import { describe, expect, it } from "vitest";
import {
  extractTweetFromText,
  parseTweetUrl,
} from "../src/utils/twitterUrl.js";

describe("parseTweetUrl", () => {
  it("x.com の URL から ID とスクリーンネームを取得する", () => {
    expect(parseTweetUrl("https://x.com/jack/status/20")).toEqual({
      id: "20",
      screenName: "jack",
    });
  });

  it("twitter.com / クエリ付き URL も解析できる", () => {
    expect(
      parseTweetUrl("https://twitter.com/Foo/status/1234567890?s=20")
    ).toEqual({ id: "1234567890", screenName: "Foo" });
  });

  it("/i/web/status 形式は screenName が null になる", () => {
    expect(parseTweetUrl("https://x.com/i/web/status/42")).toEqual({
      id: "42",
      screenName: null,
    });
  });

  it("前後の空白を許容する", () => {
    expect(parseTweetUrl("  https://x.com/a/status/7 ")).toEqual({
      id: "7",
      screenName: "a",
    });
  });

  it("ツイート以外の URL は null", () => {
    expect(parseTweetUrl("https://example.com/a/status/1")).toBeNull();
    expect(parseTweetUrl("https://x.com/jack")).toBeNull();
    expect(parseTweetUrl("not a url")).toBeNull();
  });
});

describe("extractTweetFromText", () => {
  it("文章中の最初のツイート URL を抽出する", () => {
    const text = "これ見て https://x.com/jack/status/20 すごい";
    expect(extractTweetFromText(text)).toEqual({
      id: "20",
      screenName: "jack",
    });
  });

  it("ツイート URL が無ければ null", () => {
    expect(extractTweetFromText("ただの文章 https://example.com")).toBeNull();
  });
});
