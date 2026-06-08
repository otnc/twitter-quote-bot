import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * サーバー (Guild) ごとに監視対象チャンネルを 1 つ保存するストア。
 * 永続化は `data/channels.json` への JSON 書き込みで行う。
 * 形式: `{ [guildId]: channelId }`
 */

const DATA_FILE = join(process.cwd(), "data", "channels.json");

export class ChannelStore {
  private readonly cache = new Map<string, string>();
  private loaded = false;

  constructor(private readonly file: string = DATA_FILE) {}

  /** ファイルから初期データを読み込む (初回のみ)。 */
  async load(): Promise<void> {
    if (this.loaded) return;
    try {
      const raw = await readFile(this.file, "utf8");
      const data = JSON.parse(raw) as Record<string, string>;
      for (const [guildId, channelId] of Object.entries(data)) {
        this.cache.set(guildId, channelId);
      }
    } catch (error) {
      // ファイルが無い (ENOENT) 場合は空の状態で開始する。
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        console.error("channels.json の読み込みに失敗しました:", error);
      }
    }
    this.loaded = true;
  }

  /** 指定サーバーの監視チャンネル ID を返す (未設定なら undefined)。 */
  get(guildId: string): string | undefined {
    return this.cache.get(guildId);
  }

  /** 指定サーバーの監視チャンネルを設定して永続化する。 */
  async set(guildId: string, channelId: string): Promise<void> {
    this.cache.set(guildId, channelId);
    await this.persist();
  }

  /** 指定サーバーの監視チャンネル設定を削除して永続化する。 */
  async delete(guildId: string): Promise<boolean> {
    const existed = this.cache.delete(guildId);
    if (existed) await this.persist();
    return existed;
  }

  private async persist(): Promise<void> {
    const obj = Object.fromEntries(this.cache);
    await mkdir(dirname(this.file), { recursive: true });
    await writeFile(this.file, JSON.stringify(obj, null, 2), "utf8");
  }
}
