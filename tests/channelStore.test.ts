import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ChannelStore } from "../src/services/channelStore.js";

describe("ChannelStore", () => {
  let dir: string;
  let file: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "channel-store-"));
    file = join(dir, "channels.json");
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it("設定したチャンネルを取得できる", async () => {
    const store = new ChannelStore(file);
    await store.load();
    await store.set("guild-1", "channel-1");
    expect(store.get("guild-1")).toBe("channel-1");
  });

  it("ファイルに永続化され、再読み込みできる", async () => {
    const store = new ChannelStore(file);
    await store.load();
    await store.set("guild-1", "channel-1");

    const reloaded = new ChannelStore(file);
    await reloaded.load();
    expect(reloaded.get("guild-1")).toBe("channel-1");

    const raw = JSON.parse(await readFile(file, "utf8"));
    expect(raw).toEqual({ "guild-1": "channel-1" });
  });

  it("削除すると取得できなくなる", async () => {
    const store = new ChannelStore(file);
    await store.load();
    await store.set("guild-1", "channel-1");
    expect(await store.delete("guild-1")).toBe(true);
    expect(store.get("guild-1")).toBeUndefined();
    expect(await store.delete("guild-1")).toBe(false);
  });

  it("ファイルが無くてもエラーにならない", async () => {
    const store = new ChannelStore(file);
    await expect(store.load()).resolves.toBeUndefined();
    expect(store.get("guild-x")).toBeUndefined();
  });
});
