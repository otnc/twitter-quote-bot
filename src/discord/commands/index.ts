import type { Command } from "../../types.js";
import { helpCommand } from "./help.js";
import { quoteCommand } from "./quote.js";
import { setChannelCommand } from "./setchannel.js";

/** 全スラッシュコマンドの一覧。 */
export const commands: Command[] = [
  helpCommand,
  quoteCommand,
  setChannelCommand,
];

/** コマンド名から検索できる Map。 */
export const commandMap = new Map<string, Command>(
  commands.map((command) => [command.data.name, command])
);
