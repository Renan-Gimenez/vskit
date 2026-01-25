import type { IDEMetadata } from "./types.js";

export const SUPPORTED_IDES: IDEMetadata[] = [
  {
    name: "Visual Studio Code",
    id: "vscode",
    command: "code",
    confDirName: "Code",
  },
  {
    name: "Visual Studio Code - Insiders",
    id: "vscode-insiders",
    command: "code-insiders",
    confDirName: "Code - Insiders",
  },
  {
    name: "VSCodium",
    id: "vscodium",
    command: "codium",
    confDirName: "VSCodium",
  },
  {
    name: "Cursor",
    id: "cursor",
    command: "cursor",
    confDirName: "Cursor",
  },
  {
    name: "Windsurf",
    id: "windsurf",
    command: "windsurf",
    confDirName: "Windsurf",
  },
  {
    name: "Antigravity",
    id: "antigravity",
    command: "antigravity",
    confDirName: "Antigravity",
  },
];
